const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
date: {
    type: Date,
    required: true,
    default: Date.now
},
itemname: {
    type: String,
    required: true,
    ref: 'Stock'
},
quantity: {
    type: Number,
    trim: true,
    required: true
},
unitprice: {
    type: Number,
    trim: true,
    required: true
},
customername: {
    type: String,
    required: true
},
customercontact: {
    type: Number,
    required: true
},
total: {
    type: Number
},
attendant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'
}
});

module.exports = mongoose.model('Sale', saleSchema);