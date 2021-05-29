const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

//initial route, from source to frontend
router.get(`/`, async (req, res) => {
    const userList = await User.find(); // find method return promises and need to use promise or async
    if(!userList){
        res.status(500).json({succes: false})
    }
    res.send(userList);
})

module.exports = router;