const mongoose = require('mongoose');

/**
 * Payment Schema
 * Stores each simulated payment with a nickname, amount, and timestamp.
 * Designed for easy future integration with Razorpay (add transactionId, status, etc.)
 */
const paymentSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, 'Nickname is required'],
    trim: true,
    maxlength: [20, 'Nickname cannot exceed 20 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least ₹1'],
    max: [1000, 'Amount cannot exceed ₹1000'],
  },
  // Future: Add these fields when integrating Razorpay
  // transactionId: { type: String },
  // status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  // gateway: { type: String, default: 'fake' },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Payment', paymentSchema);
