const mongoose = require('mongoose');

const ResetTokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    resetToken: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

const ResetToken = mongoose.model('ResetToken', ResetTokenSchema);

module.exports = ResetToken;
