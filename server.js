import express from 'express';

const app = express();
app.use(express.json()); // To parse JSON body

app.get('/', (req, res) => { res.send('API is running...');
});