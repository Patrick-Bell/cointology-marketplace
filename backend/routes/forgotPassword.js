require('dotenv').config()
const express = require('express')
const User = require('../models/User')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { sendResetPasswordEmail, sendVerificationCodeEmail, sendConfirmationPasswordChangeEmail } = require('../utils/Email')
const ResetToken = require('../models/ResetToken')


// getting the email from the reset password modal and sending reset email
router.post('/send-forgot-password-email/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'No email found' });
        }

        // Check for an existing valid token
        const existingToken = await ResetToken.findOne({ email: email });
        if (existingToken) {
            // Check if the existing token has expired
            if (new Date() < existingToken.expiresAt) {
                // Token is still valid
                return res.status(400).json({ message: 'A reset request is already pending. Please check your email.' });
            } else {
                // Token has expired, you may want to delete it or refresh it
                await ResetToken.deleteOne({ email: email }); // Optionally delete expired token
            }
        }

        // Generate a new verification code and reset token
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit code 
        const resetToken = jwt.sign(
            { id: user._id, email: user.email, verificationCode: verificationCode },
            process.env.SESSION_SECRET,
            { expiresIn: '10m' }
        );

        // Store the new reset token in the database with expiration
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
        await ResetToken.create({ email, resetToken, expiresAt });

        // Send the verification code email
        await sendVerificationCodeEmail(user, verificationCode);

        res.status(200).json({ message: 'Email successfully sent' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e.message });
    }
});



router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    try {
        const resetTokenEntry = await ResetToken.findOne({ email });
        console.log(email)
        if (!resetTokenEntry) {
            return res.status(400).json({ message: 'No reset token found' });
        }

        // Check if the token has expired
        if (new Date() > resetTokenEntry.expiresAt) {
            await ResetToken.deleteOne({ email }); // Clean up expired token
            return res.status(400).json({ message: 'Reset token has expired' });
        }

        const decoded = jwt.verify(resetTokenEntry.resetToken, process.env.SESSION_SECRET);

        console.log(decoded.email)
        
        // Compare the verification code with the one entered by the user
        if (decoded.verificationCode === code) {
            // Token is valid and code matches
            await sendResetPasswordEmail(email, resetTokenEntry.resetToken); // Send reset password email
            return res.status(200).json({ message: 'Code verified' });
        }

        return res.status(400).json({ message: 'Invalid code' });
    } catch (e) {
        console.error(e);
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
});



// when clicked, it will update the new password
router.post('/confirm-new-password', async (req, res) => {
    const { token, password } = req.body
    try {

        const decoded = jwt.decode(token, process.env.SESSION_SECRET)
        console.log('email is', decoded.email)

        const user = await User.findOne({ email: decoded.email })
        
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user.password = hashedPassword

        await user.save()

        await ResetToken.deleteOne({ resetToken: token })

        await sendConfirmationPasswordChangeEmail(decoded.email)

        return res.status(200).json({ message: 'Password Saved Successfully' })

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: e })
    }
})





module.exports = router