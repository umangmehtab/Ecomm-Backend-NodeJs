const {Order} = require('../models/order');
const express = require('express');
const router = express.Router();

//initial route, from source to frontend
router.get(`/`, async (req, res) => {
    const orderList = await Order.find(); // find method return promises and need to use promise or async
    if(!orderList){
        res.status(500).json({succes: false})
    }
    res.send(orderList);
})

module.exports = router;