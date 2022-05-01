# RESTful-API

## CRUD - PUT, POST, GET, DELETE

## Overview

### The challenge

Users should be able to:

- REST API with function - read, create, delete and update
- User can add, edit and delete products and read them in their website, this will be saved in Server

### Screenshot

![all products](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8df025d6-bec0-44c8-8a05-64d8c6052d2c/Untitled.png)

![new](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3e45e5aa-1e50-49f2-9257-a47d7de88eba/Untitled.png)

![edit](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5956ba2b-fcf7-46ba-a20e-c989a9442fd8/Untitled.png)

## My process

### Built with

- NodeJS
- Express
- MongoDB, Mongoose
- JSON
- ESJ
- Bootstrap
- CSS custom properties with Flexbox

### 📒What I learned

Express + Mongoose Basic Setup

### Creating the Model with Schema

```jsx
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, 
  price: {
    type: Number,
    required: true,
    min: 0
  }, 
  category: {
    type: String, 
    lowercase: true,
    enum: ['fruit', 'vegetable', 'dairy']
  }
})

const Product = mongoose.model('Product', productSchema);

//To export as a Module named Product
module.exports = Product;
```

### Products Index

```jsx
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

app.listen(3000, () => {
  console.log("App is listening on Port 3000");
})
```

- Promise, Async and await
    
    ```jsx
    app.get('/products', async (req, res) => {
      const products = await Product.find({})
      //to make a template "render" for whole products
      res.render('products/index', { products });
    })
    ```
    
    - **async** makes a function return a Promise
    - **await** makes a function wait for a Promise

### Product Details with EJS

```html
index.ejs
    <ul>
      <% for(let product of products) { %>
        <li><a href="/products/<%= product._id %>"><%= product.name %></a></li>
      <% }%>
    </ul>

edit.ejs
		<div class="container">
		    <h1>Edit a Product</h1>
		    <form action="/products/<%=product._id%>?_method=PUT" method="POST">
		      <label for="name">Product Name</label>
		      <input type="text" name="name" id="name" placeholder="product name" value="<%=product.name %>"> 
		      
		      <label for="price">Product Price (per Unit)</label>
		      <input type="number" name="price" id="price" placeholder="product price" min="0" step=".01" value="<%= product.price %>">
		      
		      <label for="category">Select Category</label>
		      <select name="category" id="category">
		        <option value="fruit">fruit</option>
		        <option value="dairy">dairy</option>
		        <option value="vegetable">vegetable</option>
		      </select>
		    </br>
		      <button>Submit</button>
		    </form>
		  </br>
		    <a href="/products/<%=product._id%>">Back to the product detail</a>
		  </div>

show.ejs
		<div class="container">
		    <h1><%= product.name %></h1>
		    <ul>
		      <li>Price: <%= product.price %> €</li>
		      <li>Category: <%= product.category %></li>
		    </ul>
		    <br/>
		    <a href="/products">See all products</a>
		    <a href="/products/<%=product._id%>/edit">Edit this product</a>
		    <form action="/products/<%=product._id%>?_method=DELETE" method="POST">
		    </br>
		      <button>Delete</button>
		    </form>
		  </div>
```

### Creating Products and save in DB

```jsx
//CREATE a new input and save in DB
app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body)
  await newProduct.save()
  //to avoid saving the input again by refresh and be aware with ``
  res.redirect(`/products/${newProduct._id}`)
})
```

### Updating Products

```jsx
//UPDATE
app.get('/products/:id/edit', async (req, res) => {
  //need to find by ID 
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/edit', { product });
})

//REPLACE THE VALUE with NPM Method-override
app.put('/products/:id', async (req, res) => {
  //grab the {id}
  const {id} = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  res.redirect(`/products/${product._id}`);
})
```

### Deleting Products
