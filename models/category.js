const mongoose = require('mongoose');
//Scheme 
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
    }
})

// to use id anywhere without _id
categorySchema.virtual('id').get(function (){
    return this._id.toHexString();
});

categorySchema.set('toJSON',{
    virtuals: true
})

exports.Category = mongoose.model('Category', categorySchema);
