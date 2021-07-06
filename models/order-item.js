const mongoose = require('mongoose');
//Scheme 
const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})

// to use id anywhere without _id
orderItemSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

orderItemSchema.set('toJSON',{
    virtuals: true
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);
