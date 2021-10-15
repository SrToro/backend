const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const barberSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    tel:{
        type: Number,
        required: true
    },
    correo:{
        type: String,
        required: true
    },
    imag:{
        type: String,
        required: true
    },
    appointments:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Appointment'
        }
    ],
    
})

module.exports = mongoose.model('Barber',barberSchema);