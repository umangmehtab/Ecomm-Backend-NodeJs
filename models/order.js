const mongoose = require('mongoose');
//Scheme 
const orderSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: { //to add required field
        type: Number,
        required: true
    }
})

// to use id anywhere without _id
orderSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

orderSchema.set('toJSON',{
    virtuals: true
})

exports.Order = mongoose.model('Order', orderSchema);
