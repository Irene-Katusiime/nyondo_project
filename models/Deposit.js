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
amountdeposited: {
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
balance: {
   type: Number,
   default: 0 
},
total: {
    type: Number
},
status: {
    type: String,
    default: 'Pending'
},
customeraddress: {
    type: String,
    required: true
},
distance: {
    type: Number,
    required: true
},
issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'
},
invoiceNumber: {
    type: String,
    required: true,
    unique: true
},
transportcost: {
    type: Number,
},
needsTransport: {
    type: Boolean,
    default: false
},
});


module.exports = mongoose.model('Deposit', depositSchema);