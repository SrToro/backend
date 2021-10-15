const mongoose = require('mongoose');
const user = require('./user');


const Schema = mongoose.Schema;


const appointmentsSchema = new Schema({

    date:{
        type: Date,
        required: true
    },
    appointmentCreator:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    
    hairCutSelected:{
        type: Schema.Types.ObjectId,
        ref: 'HairCut'
    },

    barberSelected:{
        type: Schema.Types.ObjectId,
        ref: 'Barber'
    },
    hour:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Appointment', appointmentsSchema);