const {Snd} = require('../models/snd');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res)=>{
    const snd = await Snd.find();

    if(!snd)
        return res.status(404).send('No Data Dound');
    
    res.send(snd);
})
router.get('/:id', async (req, res)=>{
    const snd = await Snd.findById(req.params.id);

    if(!snd)
        return res.status(404).send('No Data Dound');
    
    res.send(snd);
})

router.delete('/:id', async(req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product Id.');
    }
    const snd = await Snd.findByIdAndRemove(req.params.id);

    if(!snd)
        return res.send(err);
    
    res.send(snd);
})

router.post('/', async(req, res) => {
    let snd = new Snd({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description
    })
    snd = await snd.save();

    if(!snd)
        return res.status(500).send('The Product cannot be created.');

    res.send(snd);
})

module.exports = router;