const mongoose = require('mongoose'); 

const roomSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageurls: [],
    maxcount: { type: Number, required: true },
    phonenumber: { type: Number, required: true },
    rentperday: { type: Number, required: true },
    type: { type: String, required: true },
    bookingstatus: {
        type:String
    }

})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room;
