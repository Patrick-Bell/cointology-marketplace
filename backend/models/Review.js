const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    id: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating_number: { type: Number, min: 1, max: 5 },
    rating_header: String,
    rating_message: String,
    date: { type: Date, default: Date.now() },
    responded: {type: Boolean, default: false},
    helpful_votes: {type: Number, default: 0}
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review