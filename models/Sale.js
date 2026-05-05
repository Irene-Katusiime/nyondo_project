const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
date: {
    type: String,
    required: true,
    default: Date.now
},
itemname: {
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
customername: {
    type: String,
    required: true
},
customercontact: {
    type: Number,
    required: true
}
});

module.exports = mongoose.model('Sale', saleSchema);