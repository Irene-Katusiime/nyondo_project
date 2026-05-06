const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
itemName: {
    type: String,
    required: true
},
category: {
    type: String,
    required: true
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
sellingprice: {
    type: Number,
    trim: true,
    required: true
},
suppliername: {
    type: String,
    required: true
},
transportationcost: {
    type: Number,
    required: true
},
datereceived: {
    type: Date,
    default: Date.now
},
total: {
    type: Number,
    required: true
}
});


module.exports = mongoose.model('Stock', stockSchema);