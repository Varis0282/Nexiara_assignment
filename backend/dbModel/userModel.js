const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    questions: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question'
            },
            selectedAnswer: {
                type: String,
            },
            isCorrect: {
                type: Boolean,
            },
        }
    ],
    score: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: Boolean,
    }
});

module.exports = mongoose.model('User', userSchema);