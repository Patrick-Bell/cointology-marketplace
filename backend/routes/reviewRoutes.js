const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const User = require('../models/User')
const Product = require('../models/Product')
const { v4: uuidv4 } = require('uuid')
const Order = require('../models/Order')
const verifyUser = require('../middleware/verifyUser')



// Submit a review
router.post('/submit-review/:name/:orderId/:lineItemId', verifyUser, async (req, res) => {
    const { name, orderId, lineItemId } = req.params; // Product name and order ID from URL parameters
    const { reviewData } = req.body; // Review data from request body

    try {
        const user = req.user; // Fetch the authenticated user

        // Find the product by name in your products collection
        const product = await Product.findOne({ name: name }); // Assuming 'name' is the correct field in your Product schema

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Create a new review instance using the Review model
        const newReview = new Review({
            user: user.id,
            product: product._id, // Use the ObjectId of the found product
            rating_number: reviewData.rating ? reviewData.rating : 5,
            rating_header: reviewData.subject,
            rating_message: reviewData.message,
            date: Date.now(),
            responded: true, // Setting responded to true for the new review
            helpful_votes: 0,
        });

        // Save the new review to the database
        const savedReview = await newReview.save();

        // Update the Product model to add the review ID to the reviews array
        await Product.findByIdAndUpdate(
            { _id: product._id }, 
            { $push: { ratings: savedReview._id } }, 
            { new: true }
        );

        // Find the order by ID
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Find the line item within the order that corresponds to the product reviewed
        const lineItem = order.line_items.find(item => item._id.toString() === req.params.lineItemId);

        if (!lineItem) {
            return res.status(404).json({ message: 'Line item not found in the order.' });
        }

        // Update the responded status of the line item
        lineItem.reviewed = true;

        // Save the updated order with the modified line item
        await order.save();

        return res.status(200).json(savedReview); // Return the saved review
    } catch (error) {
        console.error('Error submitting review:', error);
        return res.status(500).json({ message: 'Failed to submit review.' });
    }
});






module.exports = router