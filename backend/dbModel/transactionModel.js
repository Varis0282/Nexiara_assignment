const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
    },
    transactioID: {
        type: String,
    },
    paymentStatus: {
        type: Boolean,
    },
    orderId: {
        type: String,
    },
    receipt:{
        type: String,
    },
    paymentId:{
        type: String,
    },
    signature:{
        type: String,
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);