const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        street: { type: String, required: false },
        city: { type: String, required: false },
        state: { type: String, required: false },
        zipCode: { type: String, required: false },
        country: { type: String, required: false },
    },
    favourites: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Favourite' }
    ],
    reviews: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
    ],
    orders: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
    ],
    role: {
        type: String,
        enum: ['user', 'admin'],  // restrict to 'user' or 'admin'
        default: 'user',
    },
    joined: {
        type: Date,
        default: Date.now,
    },
    last_login: {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model('User', userSchema)

module.exports = User