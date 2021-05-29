const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

//initial route, from source to frontend
//Get all the product
router.get(`/`, async (req, res) => {
    
    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }

    //const productList = await Product.find().select('name description -_id'); // To display specific field. we use select
    const productList = await Product.find(filter).populate('category'); // find method return promises and need to use promise or async
    
    if(!productList){
        res.status(500).json({succes: false})
    }
    res.send(productList);
})

// Find single product
router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category'); // Populate use to get reference table data
    
    if(!product){
        res.status(500).json({succes: false})
    }
    res.send(product);
})

//Delete product
router.delete('/:id', async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product Id.');
    }
    const product = await Product.findOneAndRemove(req.params.id);

    if(product){
        return res.status(200).json({success: true, message: 'The product is deleted.'})
    }else{
        return res.status(404).json({success: false, message: 'Product Not Found.'})
    }
})

//from frontend to backend
router.post(`/`, async (req, res) => {
    //In case user did not send existing category
    const category = await Category.findById(req.body.category);
    if(!category)
        return res.status(400).send('Invalid Category.');

    // DB model 
    let product = new Product({ // here "Product" should be the name of the model connected to the DB
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    //save to db
    product = await product.save();
    
    if(!product)
        return res.status(500).send('The Product cannot be created.');

    res.send(product);
    
    //Promise vs Async example.
    // product.save()
    // .then((createdProduct=>{
    //     res.status(201).json(createdProduct)
    // })).catch((err)=>{
    //     res.status(500).json({
    //         error: err,
    //         success: false
    //     })
    // })
})

//Update the product
router.put('/:id', async (req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product Id.');
    }
    const category = await Category.findById(req.body.category);
    if(!category)
        return res.status(400).send('Invalid Category.');

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {
            new: true
        }
    )
    if(!product){
        return res.status(404).send('The Product cannot be updated!');
    }
    res.send(product);
})

//count of product - used countDocuments method
router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count)=> count)
    
    if(!productCount){
        res.status(500).json({succes: false})
    }
    res.send({
        count: productCount
    });
})

//Get featured products - used filters here - limit method help us to get top 'n' products
router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({
        isFeatured: true 
    }).limit(+count) // filter
    
    if(!products){
        res.status(500).json({succes: false})
    }
    res.send(products);
})

module.exports = router;