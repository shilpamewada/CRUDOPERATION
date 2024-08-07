const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/products', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

const Product = mongoose.model('Product', productSchema);

app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    await newProduct.save();
    console.log('Product Created:', newProduct); 
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    console.log('Products Retrieved:', products); 
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).send();
    }
    console.log('Product Updated:', product); 
    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    console.log('Product Deleted:', product); 
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
