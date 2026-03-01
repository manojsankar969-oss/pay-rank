const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Payment = require('../models/Payment');

// --- Default seed data (used when MongoDB is unavailable) ---
const DEFAULT_PAYMENTS = [
    { _id: 's1', nickname: 'PayKing', amount: 10, createdAt: new Date(Date.now() - 60000) },
    { _id: 's2', nickname: 'CryptoQueen', amount: 10, createdAt: new Date(Date.now() - 120000) },
    { _id: 's3', nickname: 'MoneyMaker', amount: 5, createdAt: new Date(Date.now() - 180000) },
    { _id: 's4', nickname: 'LuckyDraw', amount: 5, createdAt: new Date(Date.now() - 240000) },
    { _id: 's5', nickname: 'GoldRush', amount: 5, createdAt: new Date(Date.now() - 300000) },
    { _id: 's6', nickname: 'FlashPay', amount: 2, createdAt: new Date(Date.now() - 360000) },
    { _id: 's7', nickname: 'StarPlayer', amount: 2, createdAt: new Date(Date.now() - 420000) },
    { _id: 's8', nickname: 'RocketMan', amount: 2, createdAt: new Date(Date.now() - 480000) },
    { _id: 's9', nickname: 'Blaze', amount: 1, createdAt: new Date(Date.now() - 540000) },
    { _id: 's10', nickname: 'Shadow', amount: 1, createdAt: new Date(Date.now() - 600000) },
];

// In-memory fallback store for when MongoDB is down
let memoryPayments = [...DEFAULT_PAYMENTS];

/** Check if MongoDB is connected */
function isDbConnected() {
    return mongoose.connection.readyState === 1;
}

/**
 * POST /api/pay
 * Simulate a payment — validate, sanitize, and save to DB.
 * Falls back to in-memory store if MongoDB is unavailable.
 */
router.post('/pay', async (req, res, next) => {
    try {
        let { nickname, amount } = req.body;

        // --- Validation & Sanitization ---
        if (!nickname || typeof nickname !== 'string') {
            return res.status(400).json({ success: false, message: 'Nickname is required.' });
        }

        nickname = nickname.trim();

        if (nickname.length === 0) {
            return res.status(400).json({ success: false, message: 'Nickname cannot be empty.' });
        }

        if (nickname.length > 20) {
            return res.status(400).json({ success: false, message: 'Nickname cannot exceed 20 characters.' });
        }

        amount = Number(amount);

        if (!amount || isNaN(amount) || amount < 1 || amount > 1000) {
            return res.status(400).json({ success: false, message: 'Amount must be between ₹1 and ₹1000.' });
        }

        // --- Fake Payment Simulation ---
        const paymentSimulation = { gateway: 'fake', status: 'success', simulatedDelay: 500 };
        await new Promise((resolve) => setTimeout(resolve, paymentSimulation.simulatedDelay));

        let payment;

        if (isDbConnected()) {
            // Save to MongoDB
            payment = await Payment.create({ nickname, amount });
        } else {
            // Fallback: save to in-memory store
            payment = {
                _id: 'm' + Date.now(),
                nickname,
                amount,
                createdAt: new Date(),
            };
            memoryPayments.unshift(payment);
        }

        res.status(201).json({
            success: true,
            message: `Payment of ₹${amount} by ${nickname} successful!`,
            payment: {
                id: payment._id,
                nickname: payment.nickname,
                amount: payment.amount,
                createdAt: payment.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/leaderboard/top
 * Returns top 10 payments sorted by highest amount.
 */
router.get('/leaderboard/top', async (req, res, next) => {
    try {
        let data;

        if (isDbConnected()) {
            data = await Payment.find()
                .sort({ amount: -1, createdAt: -1 })
                .limit(10)
                .select('nickname amount createdAt');
        } else {
            // Fallback: return from memory, sorted by amount desc
            data = [...memoryPayments]
                .sort((a, b) => b.amount - a.amount || new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10);
        }

        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/leaderboard/latest
 * Returns the 20 most recent payments.
 */
router.get('/leaderboard/latest', async (req, res, next) => {
    try {
        let data;

        if (isDbConnected()) {
            data = await Payment.find()
                .sort({ createdAt: -1 })
                .limit(20)
                .select('nickname amount createdAt');
        } else {
            // Fallback: return from memory, sorted by most recent
            data = [...memoryPayments]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 20);
        }

        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
