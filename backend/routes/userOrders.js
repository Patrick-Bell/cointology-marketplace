const express = require('express')
const router = express.Router()
const verifyUser = require('../middleware/verifyUser')
const Orders = require('../models/Order')

// Route to get all orders for one User
router.get('/user-orders', verifyUser, async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id;

        // Await the result of the find query
        const orders = await Orders.find({ user: userId });

        console.log(orders); // Log the orders for debugging

        // Send the orders as a JSON response
        res.json(orders);

    } catch (e) {
        console.error('Error fetching user orders:', e); // Log the error
        // Send an error response with a 500 status code
        res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});


module.exports = router