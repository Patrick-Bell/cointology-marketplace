require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const verifyUser = require('../middleware/verifyUser');
const { emailToUserAfterRegistration, emailToAdminAfterRegistration } = require('../utils/Email')

// Route to register
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    console.log(username, password, email)

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            },
            reviews: [],
            favourites: [],
            orders: [],
            messages: [],
            role: 'user',
            last_login: Date.now()
        });

        // Save the new user to the database
        await newUser.save();
        await emailToUserAfterRegistration(newUser)
        await emailToAdminAfterRegistration(newUser)

        // Respond with success
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error registering' });
    }
});

// Route to login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log(email, password)

    try {
        // Check if the user exists by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, name: user.username, role: user.role, email: user.email },
            process.env.SESSION_SECRET,
            { expiresIn: '1hr' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600000,
            path: '/'
        })

        user.last_login = Date.now()
        await user.save()

        // Respond with token and success message
        return res.status(200).json({ message: 'User logged in successfully', token, user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error logging in' });
    }
});


// route to log out
router.post('/logout', async (req, res) => {
    try{
        res.clearCookie('token')
        res.status(200).json({ message: 'Logged out successfully' })
    }catch(e) {
        console.log(e) 
        res.status(500).json({ message: e })
    }
})



router.get('/check-auth', verifyUser, (req, res) => {

    // Assuming `req.user` was set by the middleware after token verification
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Respond with user data if authenticated
    return res.status(200).json({
        user: req.user, // This should contain user's role, id, etc.
    });
});


// get all orders
router.get('/all-users', async (req, res) => {
    try {
        const users = await User.find()

        res.status(200).json(users)

    }catch(e) {
        console.log(e)
        res.status(500).json({message: e})
    }
})


// route to get 1 user
router.get('/user/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id).populate('orders')

        console.log(user)

        res.status(200).json(user)

        
    }catch(e) {
        console.log(e)
        res.status(500).json({message: e})
    }
})

// route to update user details
router.put('/edit-user-details/:id', async (req, res) => {
    const { id } = req.params; // Fixed to use 'id' from the params
    const { username, email } = req.body;

    console.log(username, email);

    try {
        // Use findOneAndUpdate to find the user and update in one step
        const updatedUser = await User.findOneAndUpdate(
            { _id: id }, // Find user by ID
            { username, email }, // Update fields
            { new: true, runValidators: true } // Options
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' }); // Handle case where user is not found
        }

        res.status(200).json(updatedUser); // Send back the updated user details
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' }); // Handle server error
    }
});

module.exports = router;
