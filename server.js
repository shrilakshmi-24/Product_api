const express = require('express');
const cors = require('cors');
require("dotenv").config();
const jwt = require("jsonwebtoken");

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.json({ message: 'Hello from the API' });
});
// const verifyAdminToken=require('./middlewares/admin')
// const verifyUserToken=require('./middlewares/user')

app.use('/api/',productRoutes);
app.use('/api/',userRoutes);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
