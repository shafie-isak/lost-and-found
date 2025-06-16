import express from 'express';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';
import { authenToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getItems);
router.post('/', authenToken, createItem);
router.get('/:id', authenToken,getItemById);
router.put('/:id', authenToken, updateItem);
router.delete('/:id', authenToken, deleteItem);

export default router;
