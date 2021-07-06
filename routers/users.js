const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // to get json from the server/backend

//initial route, from source to frontend
router.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash'); // find method return promises and need to use promise or async
    if(!userList){
        res.status(500).json({succes: false})
    }
    res.send(userList);
})

router.get('/:id', async(req, res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(500).json({
            message: 'The User with the given ID was not found.'
        })
    }
    res.status(200).send(user);
})

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: await bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
        return res.status(400).send('The user cannot be created!');

    res.send(user);
})

//Check user by email address - findOne ({})
router.post('/login', async (req, res)=>{
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;
    
    if(!user){
            return res.status(400).send('The user does not exist.');
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin,
            street: user.street
        }, secret,
        {expiresIn: '1d'})
        res.status(200).send({user: user.email, token: token})
    }else{
        return res.status(400).send('Wrong Password');
    }
})

//Register
router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: await bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
        return res.status(400).send('The user cannot be created!');

    res.send(user);
})

//Delete user
router.delete('/:id', async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product Id.');
    }
    const user = await User.findOneAndRemove(req.params.id);

    if(user){
        return res.status(200).json({success: true, message: 'The user is deleted.'})
    }else{
        return res.status(404).json({success: false, message: 'user Not Found.'})
    }
})

//count of user - used countDocuments method
router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments((count)=> count)
    
    if(!userCount){
        res.status(500).json({succes: false})
    }
    res.send({
        count: userCount
    });
})


module.exports = router;