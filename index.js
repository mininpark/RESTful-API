const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand')
  .then(()=> {
    console.log("MANGO Connected");
  })
  .catch(err => {
    console.log("Ups! MANGO Not Connected")
    console.log(err);
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));

//asynce route handler
app.get('/products', async (req, res) => {
  const products = await Product.find({})
  //to make a template "render" for whole products
  res.render('products/index', { products });
})

app.get('/products/new', (req, res) => {
  res.render('products/new')
})

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id)
  // to make a template "render" individual product
  res.render('products/show', { product });
})

//UPDATE
app.get('/products/:id/edit', async (req, res) => {
  //need to find by ID 
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/edit', { product });
})

//CREATE a new input and save in DB
app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body)
  await newProduct.save()
  //to avoid saving the input again by refresh and be aware with ``
  res.redirect(`/products/${newProduct._id}`)
})

//REPLACE THE VALUE with NPM Method-override
app.put('/products/:id', async (req, res) => {
  //grab the {id}
  const {id} = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  res.redirect(`/products/${product._id}`);
})
//DELETE
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  res.redirect(`/products`);
})

app.listen(3000, () => {
  console.log("App is listening on Port 3000");
})