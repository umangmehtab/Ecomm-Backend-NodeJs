const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

//initial route, from source to frontend
//Get category list
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find(); // find method return promises and need to use promise or async
    if(!categoryList){
        res.status(500).json({succes: false})
    }
    res.status(200).send(categoryList);
})

router.get('/:id', async(req, res)=>{
    const category = await Category.findById(req.params.id);

    if(!category){
        res.status(500).json({
            message: 'The Category with the given ID was not found.'
        })
    }
    res.status(200).send(category);
})

//Adding the data to the table POST
//used async await and good code
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();

    if(!category)
        return res.status(404).send('The Category cannot be created!');

    res.send(category);
})

//update the category

router.put('/:id', async (req, res)=>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        {
            new: true
        }
    )
    if(!category){
        return res.status(404).send('The Category cannot be updated!');
    }
    res.send(category);
})

//Delete the category by param id from the URL
//Used Promise, more code and not clean
router.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category=>{
        if(category){
            return res.status(200).json({success: true, message: 'The Category is deleted.'})
        } else {
            return res.status(404).json({success: false, message: 'Category Not Found.'})
        }
    }).catch(err => { //catch for connection/wrong data wrong id etc.
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;