const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')
const Report = require('../models/Report')
const verifyUser = require('../middleware/verifyUser')
const { v4: uuidv4 } = require('uuid')
const { sendEmailAfterStatusChange, sendEmailToAdminAfterOrder, sendEmailToUserAfterOrder } = require('../utils/Email')
const { updateStockAfterOrder } = require('../utils/UpdateOrder')


// route to retrieve all orders (admin)
router.get('/all-orders', async (req, res) => {
    try {
        const orders = await Order.find()
        console.log(orders)

        res.status(200).json(orders)

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: 'error' })
    }
})

router.get('/orders/:id', async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {

        const order = await Order.findOne({order_id: id})

        res.status(200).json(order)

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: 'No order data found' })
    }
})

// route to get orders for specific user
router.get('user-orders', verifyUser, async (req, res) => {
    try {

        const user = req.user
        const userId = user.id

        const userOrders = await User.findOne({id: userId}).populate('orders')

        res.status(200).json(userOrders)
        

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: 'error' })
    }
})


// Route to get current order status (admin)
router.get('/orders/:id/shipping-status', async (req, res) => {
    const { id } = req.params
    try{

        const order = await Order.findOne({ order_id: id })

        const currentStatus = order.order_status
        console.log(currentStatus)

        res.json(currentStatus)

    }catch(e) {
        console.log(e)
    }
})

router.get('/orders/:id/payment-status', async (req, res) => {
    const { id } = req.params
    try{

        const order = await Order.findOne({order_id: id})

        const currentPaymentStatus = order.paid

        res.json(currentPaymentStatus)

    }catch(e) {
        console.log(e)
    }
})


router.post('/orders/:id/update-payment-status', async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    try{

        const order = await Order.findOne({ order_id: id })

        order.paid = status

        await order.save()

        res.status(200).json(order)

    }catch(e) {
        console.log(e)
    }
})

// route update order status (admin)
router.post('/orders/:id/update-status', async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    try {
        
        const order = await Order.findOne({order_id: id})

        order.order_status = status
        
        await order.save()

        await sendEmailAfterStatusChange(order)

        res.status(200).json(order)
        

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: 'error' })
    }
})

// route to add a cash payment to the system
router.post('/cash-payment-gateway', verifyUser, async (req, res) => {

    const { orderData } = req.body
    console.log(orderData)

    try {

        const user = req.user

        const newOrder = new Order({
            name: orderData.name,
            email: orderData.email,
            phone: orderData.phone,
            order_id: uuidv4(),
            user: user ? user.id : null,
            line_items: orderData.line_items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                front_image: item.front_image,
                reviewed: false
            })),
            total_price: orderData.total_price,
            shipping: 1.99,
            invoice: '',
            discount: 0,
            order_status: 'pending',
            order_date: Date.now(),
            order_type: 'cash',
            paid: 'not_paid',
            shipping_address: {
                address_line_1: orderData.address_line_1,
                address_line_2: orderData.address_line_2,
                city: orderData.city,
                postal_code: orderData.postal_code,
                country: 'United Kingdom'
            },
            shipping_method: 'standard',
            estimated_delivery: 2,
            order_message: orderData.message
        })

        const savedOrder = await newOrder.save()
        await sendEmailToUserAfterOrder(newOrder)
        await sendEmailToAdminAfterOrder(newOrder)
        await updateStockAfterOrder(newOrder)

        await User.findOneAndUpdate(
            { _id: user.id }, {$push: { orders: savedOrder._id }}, { new: true }
        )

        res.status(200).json({ message: `Order Completed!` })



    }catch(e) {
        console.log(e)
        res.status(500).json({ messsage: 'Order Failed!' })
    }
})


// get image
router.get('/get-image/:name', async (req, res) => {
    const { name } = req.params 
    try {
        const product = await Product.findOne({ name: name })
        const image = product.front_image

        return res.status(200).json(image)

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: e })
    }
})

router.get('/orders-from-last-6-months', verifyUser, async (req, res) => {
    try {

        const user = req.user

        const today = new Date()
        const last6Months = new Date(today)
        last6Months.setMonth(today.getMonth() - 6)

        const orders = await Order.find({
            user: user.id,
            order_date: {
                $gte: last6Months,
                $lte: today
            }
        })

        res.status(200).json(orders)

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: e })
    }
})

router.get('/orders-from-last-1-month', verifyUser, async (req, res) => {
    try {

        const user = req.user

        const today = new Date()
        const lastMonth = new Date(today)
        lastMonth.setMonth(today.getMonth() - 1)

        const orders = await Order.find({
            user: user.id,
            order_date: {
                $gte: lastMonth,
                $lte: today
            }
        })

        res.status(200).json(orders)

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: e })
    }
})

router.get('/revenue-last-30-days', async (req, res) => {
    try {
        const today = new Date();
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 30); // Set the date to 30 days ago

        // Fetch orders from the last 30 days
        const orders = await Order.find({
            order_date: {
                $gte: last30Days, // Greater than or equal to the calculated date
                $lte: today // Less than or equal to today
            }
        });

        // Calculate total revenue
        const totalRevenue = orders.reduce((acc, order) => acc + order.total_price, 0);

        res.status(200).json(totalRevenue)

       
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
});


// router to track package
router.get(`/track-order/:id`, async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const order = await Order.find({ order_id: id })

        if (!order) {
            return res.status(400).json({ message: 'No Tracking Found' })
        }

        res.status(200).json(order)

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: e })
    }
})

module.exports = router