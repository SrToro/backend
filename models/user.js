const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    tipo:{
        type: String,
        required: true
    },
    appointments:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Appointment'
        }
    ],
    purchaseOrder:[
        {
            type: Schema.Types.ObjectId,
            ref:'PurchaseOrder'
        }
    ],

});

module.exports = mongoose.model('User',userSchema);

