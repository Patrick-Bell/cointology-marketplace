const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    order_id: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    name: String,
    email: String,
    phone: String,
    line_items: [{ name: String, quantity: Number, unit_price: Number, front_image: String, reviewed: { type: Boolean, default: false } }],
    shipping: Number,
    discount: Number,
    total_price: Number,
    order_status: { type: String, enum: ['pending', 'shipped', 'delivery_attempted', 'delivered', 'cancelled'], default: 'pending'},
    invoice: String,
    order_date: { type: Date, default: Date.now()},
    order_type: { type: String, enum: ['card', 'cash'] },
    paid: { type: String, enum: ['paid', 'not_paid', 'refunded'], default: 'not_paid' },
    shipping_address: {
        address_line_1: String,
        address_line_2: String,
        city: String,
        postal_code: String,
        country: String,
    },
    shipping_method: { type: String, enum: ['free', 'premium', 'next day', 'standard'] },
    estimated_delivery: {
        earliestDate: { type: Date },
        latestDate: { type: Date }
    },
    order_message: String, // this is typically used for the cash payment option
    
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;