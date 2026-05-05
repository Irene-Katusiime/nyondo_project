const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
supplierName: {
    type: String,
    required: true
},
invoicenumber: {
    type: String,
    required: true
},
creditamount: {
    type: Number,
    required: true
},
duedate: {
    type: Number,
    required: true
}
});

module.exports = mongoose.model('Supplier', supplierSchema);