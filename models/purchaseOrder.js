const mongoose = require('mongoose');
const { schema } = require('./user');

const Schema =mongoose.Schema;

const purchaseOrderSchema =new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products:{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity:{
        type: Number,
        require: true
    }
    
});

module.exports = mongoose.model('PurchaseOrder',purchaseOrderSchema);