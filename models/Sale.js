const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
date: {
    type: Date,
    required: true,
    default: Date.now
},
customername: {
    type: String,
    required: true
},
customercontact: {
    type: String,
    required: true
},
customeraddress: {
    type: String,
    required: true
},
customerdistance: {
    type: Number,
    required: true
},
transportcost: {
    type: Number,  
},
paymentmethod: {
    type: String
},
hasTransport: {
    type: Boolean,
    default: false
},
items: [
    {
        itemname: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stock',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unitprice: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }
],

numberOfItems: {
    type: Number,
    default: 0
},

grandTotal: {
    type: Number,
    required: true
},

invoiceNumber: {
    type: String,
    unique: true
},
attendant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'
}
});

module.exports = mongoose.model('Sale', saleSchema);