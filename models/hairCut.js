const mongoose = require('mongoose');

const Schema =mongoose.Schema;

const hairCutSchema =new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    imag:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('HairCut',hairCutSchema);