const mongoose = require('mongoose');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand')
  .then(()=> {
    console.log("MANGO Connected");
  })
  .catch(err => {
    console.log("Ups! MANGO Not Connected")
    console.log(err);
  });

/*
const p = new Product({
  name: 'Ruby Grapefruit',
  price: 1.99,
  category: 'fruit'
})

p.save()
  .then(p => {
    console.log(p)
  })
  .catch(e => {
    console.log(e)
  })
*/

//create Array
const seedProducts = [
  {
    name: 'Strawberry',
    price: 3.99,
    category: 'fruit'
  },
  {
    name: 'Orange',
    price: 2.99,
    category: 'fruit'
  },
  {
    name: 'Celery',
    price: 1.50,
    category: 'vegetable'
  },
  {
    name: 'Mild',
    price: 0.99,
    category: 'dairy'
  },
  {
    name: 'Chocolate',
    price: 0.79,
    category: 'dairy'
  }
]

Product.insertMany(seedProducts)
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    consol6e.log(e)
  })