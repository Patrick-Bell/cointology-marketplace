const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    other_price: { type: Number, default: 0 }, // used to control sale prices etc. i can change this to original and leave the price as the set price thats used for cart/paypal etc
    front_image: String,
    back_image: String,
    description: String,
    tags: [String],
    category: String,
    stock: Number,
    date_added: { type: Date, default: Date.now() },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    return_policy: String,
    color: { type: String, enum: ['bronze', 'silver', 'gold'] }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product