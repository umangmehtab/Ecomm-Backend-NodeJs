const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

//initial route, from source to frontend
router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name email').sort({'dateOrdered': -1}); // find method return promises and need to use promise or async
    if(!orderList){
        res.status(500).json({succes: false})
    }
    res.send(orderList);
})

router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    // .populate('orderItems')
    .populate({path: 'orderItems', populate: {
        path:'product', populate: 'category' }
    }); // populate data from products,category and ordetItems table
    if(!order){
        res.status(500).json({succes: false})
    }
    res.send(order);
})

// Below post save in 2 different Schema. 
//Using map to loop into object to get values
router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))

    const orderItemsIdsResolved = await orderItemsIds;
    console.log(orderItemsIdsResolved);

    //array of order id to get total Price 
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price*orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a+b, 0);
    console.log(totalPrice);

    const totalQuantites = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderQuantity = await OrderItem.findById(orderItemId).populate('orderItem', 'quantity');
        const totalQuantity = orderQuantity.quantity;
        return totalQuantity
    }))
    const totalQuantity = totalQuantites.reduce((a,b)=> a+b, 0);
    console.log(totalQuantity);

    
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip, 
        country: req.body.country,
        phone: req.body.phone,
        stauts: req.body.stauts,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order)
        return res.status(404).send('The Order cannot be created!');

    res.send(order);
})

//update the category

router.put('/:id', async (req, res)=>{
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            stauts: req.body.stauts,
        },
        {
            new: true
        }
    )
    if(!order){
        return res.status(404).send('The Order cannot be updated!');
    }
    res.send(order);
})

router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order=>{
        if(order){
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem);
            })
            return res.status(200).json({success: true, message: 'The order is deleted.'})
        } else {
            return res.status(404).json({success: false, message: 'order Not Found.'})
        }
    }).catch(err => { //catch for connection/wrong data wrong id etc.
        return res.status(400).json({success: false, error: err})
    })
})

//count sum of all sales
router.get('/get/totalsales',async (req, res) => {
    const totalSales = await Order.aggregate([
        {$group: {_id: null, totalsales: {$sum : '$totalPrice'}}}
    ])
    if(!totalSales){
        return res.status(400).send('The Order sales cannot be generated')
    }
    res.send({totalsales: totalSales.pop().totalsales})
})


//count of order - used countDocuments method
router.get(`/get/count`, async (req, res) => {
    const orderCount = await Order.countDocuments((count)=> count)
    
    if(!orderCount){
        res.status(500).json({succes: false})
    }
    res.send({
        count: orderCount
    });
})

// user order history 
router.get(`/get/userorders/:userid`, async (req, res) => {
    const userOrderList = await Order.find({user: req.params.userid}).populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'}
    }).sort({'dateOrdered': -1}); // find method return promises and need to use promise or async
    if(!userOrderList){
        res.status(500).json({succes: false})
    }
    res.send(userOrderList);
})


module.exports = router;