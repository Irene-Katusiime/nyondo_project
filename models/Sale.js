const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
date: {
    type: Date,
    required: true,
    default: Date.now
},
// itemname: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Stock',
//     required: true
// },
// quantity: {
//     type: Number,
//     trim: true,
//     required: true
// },
// unitprice: {
//     type: Number,
//     trim: true,
//     required: true
// },
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
// total: {
//     type: Number
// },
attendant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'
}
});

module.exports = mongoose.model('Sale', saleSchema);