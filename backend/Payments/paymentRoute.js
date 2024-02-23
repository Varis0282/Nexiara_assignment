const express = require('express');
const router = express.Router();
const Transaction = require('../dbModel/transactionModel');
const User = require('../dbModel/userModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const Razorpay = require('razorpay');
const crypto = require('crypto');
var instance = new Razorpay({
    key_id: 'rzp_test_WPJEmCwUG0xFQH', //I put this in the .env file , but for now I kept it here
    key_secret: 'RpPxwL60EjZX2RqVzexYXMas', //I put this in the .env file , but for now I kept it here
});

router.post('/payment', async (req, res) => {
    const { amount } = req.body;
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const { _id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const payment_capture = 1;
        const currency = 'INR';
        const options = {
            amount: amount,
            currency,
            payment_capture
        };
        const response = await instance.orders.create(options);
        const transaction = new Transaction({
            user: _id,
            amount,
            receipt: response.receipt,
            orderId: response.id,
            paymentStatus: false
        });
        await transaction.save();
        res.status(200).json({ response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/verify', async (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const { _id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const transaction = await Transaction.findOne({ orderId: order_id });
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        const generated_signature = crypto.createHmac('sha256', 'RpPxwL60EjZX2RqVzexYXMas').update(transaction.orderId + '|' + payment_id).digest('hex');
        if (generated_signature === signature) {
            transaction.paymentStatus = true;
            transaction.paymentId = payment_id;
            transaction.signature = signature;
            user.paymentStatus = true;
            await transaction.save();
            await user.save();
            res.status(200).json({ message: "Payment successful", success: true });
        } else {
            transaction.paymentStatus = false;
            await transaction.save();
            res.status(400).json({ error: "Payment failed", success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
});

module.exports = router;