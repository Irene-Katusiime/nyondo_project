const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
deliverydestination: {
    type: String,
    required: true
},
distance: {
    type: String,
    required: true
},
vehicletype: {
    type: String,
    required: true
}
});



module.exports = mongoose.model('Transport', transportSchema);