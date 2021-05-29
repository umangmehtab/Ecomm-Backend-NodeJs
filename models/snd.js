const mongoose = require('mongoose');

const sndSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    author:{
        type: String,
        require: true
    },
    description: {
        type: String
    }
})

exports.Snd = mongoose.model('snds', sndSchema);