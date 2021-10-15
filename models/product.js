const mongoose = require('mongoose');

const Schema =mongoose.Schema;

const productSchema =new Schema({
    code: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    img:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product',productSchema);