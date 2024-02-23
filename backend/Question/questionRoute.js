const express = require('express');
const router = express.Router();
const Question = require('../dbModel/questionModel');
const User = require('../dbModel/userModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        // sending only question and options to the client
        const formattedQuestions = questions.map(question => {
            return {
                _id: question._id,
                question: question.question,
                options: question.options
            };
        }).slice(0, 10);
        formattedQuestions.map(question => {
            question.options = question.options.map(option => {
                return {
                    option: option,
                    _id: option._id
                };
            });
        });
        res.status(200).json({ formattedQuestions: formattedQuestions, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/submit', async (req, res) => {
    const { question, selectedAnswer } = req.body;
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
        const questionData = await Question.findById(question);
        if (!questionData) {
            return res.status(404).json({ error: "Question not found" });
        }
        let isCorrect = false;
        if (questionData.correctAnswer === selectedAnswer) {
            isCorrect = true;
        }
        if (isCorrect) {
            user.score += 1;
        }
        // push only if the question is not in user's questions question array
        let isQuestionPresent = false;
        user.questions.map(userQuestion => {
            if (userQuestion.question.toString() === question) {
                isQuestionPresent = true;
            }
        });
        if (!isQuestionPresent) {
            user.questions.push({ question, selectedAnswer, isCorrect });
            await user.save();
            res.status(200).json({ message: "Answer submitted successfully", success: true });
        }
        else {
            res.status(200).json({ message: "Question already answered", success: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/score', async (req, res) => {
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
        res.status(200).json({ score: user.score, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;