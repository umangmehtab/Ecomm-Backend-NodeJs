const mongoose = require('mongoose');
//Scheme 
const userSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: { //to add required field
        type: Number,
        required: true
    }
})

// to use id anywhere without _id
userSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

userSchema.set('toJSON',{
    virtuals: true
})

exports.User = mongoose.model('User', userSchema);
