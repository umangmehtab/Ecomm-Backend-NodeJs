const mongoose = require('mongoose');

//Scheme 
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, //connected to object id of category schema
        ref: 'Category', //this is the connection with Category Schema
        required: true
    },
    countInStock: { //to add required field
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

// to use id anywhere without _id
productSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

productSchema.set('toJSON',{
    virtuals: true
})

//Creating model- model name start with capital letter
// here "Product" is connected to collection in mongo
// Mongoose automatically looks for the plural, lowercased version of your model name.
exports.Product = mongoose.model('Product', productSchema);
