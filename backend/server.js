// Load environment variables, express, and other dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const verifyUser = require('./middleware/verifyUser')
const Order = require('./models/Order')
const { addOrderToDatabase, calculateDeliveryDate, calculateShippingMethod, updateStockAfterOrder } = require('./utils/UpdateOrder')
const { sendEmailToUserAfterOrder, sendEmailToAdminAfterOrder } = require('./utils/Email')

const app = express();

// Middleware for raw body parsing for the webhook
app.use((req, res, next) => {
    if (req.path === '/webhooks') { // Ensure it checks for the correct endpoint
        let data = '';
        req.setEncoding('utf8'); // Set encoding to UTF-8
        req.on('data', (chunk) => {
            data += chunk; // Accumulate the data chunks
        });
        req.on('end', () => {
            req.rawBody = data; // Store raw body in req object
            next(); // Call next middleware
        });
    } else {
        express.json()(req, res, next); // Handle other routes with JSON body parsing
    }
});

// Middleware to handle CORS and cookies
app.use(cors());
app.use(cookieParser());

// Serve the static files from the 'uploads' folder
app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Uploads served from:', path.join(__dirname, 'uploads'));

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Connection error', error));

// Define your API routes here
const productRoutes = require('./routes/productRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const userRoutes = require('./routes/userRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userOrderRoutes = require('./routes/userOrders')
const reportRoutes = require('./routes/reportRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const forgotPasswordRoutes = require('./routes/forgotPassword')

app.use('/api', productRoutes);
app.use('/api', stripeRoutes);
app.use('/api', userRoutes);
app.use('/api', favouriteRoutes);
app.use('/api', orderRoutes);
app.use('/api', userOrderRoutes);
app.use('/api', reportRoutes);
app.use('/api', reviewRoutes);
app.use('/api', forgotPasswordRoutes);

// Webhook route
app.post('/webhooks', (request, response) => {

    console.log('Received a webhook request.');
    const sig = request.headers['stripe-signature'];
    let event;
  
    try {
        // Verify the signature using the webhook secret
        event = stripe.webhooks.constructEvent(request.rawBody, sig, process.env.STRIPE_SIGNING_SECRET);
        console.log('Webhook signature verified successfully.');
    } catch (err) {
        console.error('⚠️  Webhook signature verification failed.', err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Log the event type received
    console.log(`Received event type: ${event.type}`);
  
    // Respond to Stripe immediately to avoid timeout
    response.status(200).json({ received: true });
  
    // Handle the event asynchronously
    (async () => {
        switch (event.type) {
            case 'invoice.finalized':
                const invoice = event.data.object;
                console.log('Invoice was finalized:', invoice);
                const shippingMethod = await calculateShippingMethod(invoice.shipping_cost.amount_total)
                const { earliestDate, latestDate, message } = await calculateDeliveryDate(invoice.shipping_cost.amount_total);
  
                const newOrder = {
                    name: invoice.customer_name || 'Unknown',
                    email: invoice.customer_email || 'Unknown',
                    phone: invoice.customer_phone || 'Unknown',
                    order_id: uuidv4(),
                    user: invoice.metadata.user,
                    line_items: invoice.lines.data.map(item => ({
                        name: item.description || 'Unnamed Item',
                        quantity: item.quantity,
                        unit_price: parseFloat(((item.amount / item.quantity) / 100).toFixed(2)),
                        reviewed: false
                    })),
                    total_price: parseFloat((invoice.total / 100).toFixed(2)),
                    shipping: parseFloat(invoice.shipping_cost.amount_total).toFixed(2),
                    invoice: invoice.hosted_invoice_url,
                    discount: 0,
                    order_status: 'pending',
                    order_date: Date.now(),
                    order_type: 'card',
                    paid: 'paid',
                    shipping_address: {
                        address_line_1: invoice.customer_address.line1 || '',
                        address_line_2: invoice.customer_address.line2 || '',
                        city: invoice.customer_address.city || '',
                        postal_code: invoice.customer_address.postal_code || '',
                        country: 'United Kingdom'
                    },
                    shipping_method: shippingMethod,
                    estimated_delivery: {
                        earliestDate: earliestDate,
                        latestDate: latestDate,
                    },                    
                    order_message: invoice.message || ''
                };
  
                console.log('New Order:', newOrder); // Log the new order
  
                try {
                    await addOrderToDatabase(newOrder);
                    await sendEmailToUserAfterOrder(newOrder)
                    await sendEmailToAdminAfterOrder(newOrder)
                    await updateStockAfterOrder(newOrder)

                    
                    console.log('Order saved to database successfully.');
                } catch (dbError) {
                    console.error('Error saving order to database:', dbError.message);
                }
                break;
  
            default:
                console.log(`Received unhandled event type: ${event.type}`);
        }
    })();
  });
  

// Catch-all route to handle all other requests (send to React)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
