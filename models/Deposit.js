const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
customername: {
    type: String,
    required: true
},
NINnumber: {
    type: String,
    required: true
},
phonenumber: {
    type: String,
    required: true
},
amounttodeposit: {
    type: Number,
    required: true
}
});


module.exports = mongoose.model('Deposit', depositSchema);