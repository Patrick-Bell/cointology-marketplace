require('dotenv').config();
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Ensure you have Stripe initialized with your secret key
const path = require('path')
const fs = require('fs')
const verifyUser = require('../middleware/verifyUser');

router.post("/stripe-checkout", verifyUser, async (req, res) => {

    const user = req.user

    console.log(user)

    
    try {
        const lineItems = req.body.items.map((item) => {
            const unitAmount = parseInt(parseFloat(item.price) * 100);

            return {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: item.name,
                        images: [item.front_image]
                    },
                    unit_amount: unitAmount,
                },
                quantity: item.quantity,
            };
        });

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 0, currency: 'gbp' },
                        display_name: 'Free Shipping',
                        delivery_estimate: { minimum: { unit: 'business_day', value: 5 }, maximum: { unit: 'business_day', value: 10 } },
                    },
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 500, currency: 'gbp' },
                        display_name: 'Premium Shipping',
                        delivery_estimate: { minimum: { unit: 'business_day', value: 3 }, maximum: { unit: 'business_day', value: 5 } },
                    },
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 750, currency: 'gbp' },
                        display_name: 'Next Day Delivery',
                        delivery_estimate: { minimum: { unit: 'business_day', value: 1 }, maximum: { unit: 'business_day', value: 1 } },
                    },
                }
            ],
            phone_number_collection: {
                enabled: true,
            },
            invoice_creation: {
                enabled: true,
                invoice_data: {
                  metadata: {
                    user: req.user ? req.user.id : null // Metadata at the invoice level
                  },
                },
              },
            allow_promotion_codes: true,
            mode: "payment",
            success_url: "http://localhost:3001/success",
            cancel_url: "http://localhost:3001/cancel",
            billing_address_collection: "required",
            line_items: lineItems,
            metadata: { user: req.user ? req.user.id : null }, // Store user ID or null
        });

        // Optionally retrieve the session to confirm metadata
        const sessionDetails = await stripe.checkout.sessions.retrieve(session.id);
        console.log('Checkout Session Details:', sessionDetails); // Check the details

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(500).json({ error: 'Error processing payment' });
    }
});


module.exports = router;
