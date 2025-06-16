import Item from '../models/item.js';

// Create new item
export const createItem = async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      postedBy: req.user.id // Auth middleware must set req.user
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
};

// Get all items (with optional filters)
export const getItems = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const items = await Item.find(filter)
      .populate('postedBy', 'name email') // Show user info
      .sort({ createdAt: -1 }); // Most recent first

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
};


// Get item by ID
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('postedBy', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item', error: error.message });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(item, req.body);
    const updatedItem = await item.save();

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};
