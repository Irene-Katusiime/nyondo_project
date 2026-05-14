const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
customername: {
    type: String,
    required: true
},
NINnumber: {
    type: String,
    required: true,
    trim: true
},
phonenumber: {
    type: String,
    required: true
},
amounttodeposit: {
    type: Number,
    required: true
},
itemname: {
    type: String,
    required: true
},
quantity: {
    type: Number,
    required: true
},
date: {
    type: Date,
    default: Date.now
},
itemprice: {
    type: Number,
    required: true
},
total: {
    type: Number,
}
});


module.exports = mongoose.model('Deposit', depositSchema);