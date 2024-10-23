const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')


const favouriteSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },  // Optional if user is logged in
    id: String,
    // Array of items in the cart
    line_items: [{
        item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        item_name: String,
        item_price: Number,
        item_image: String,
        date_added: { type: Date, default: Date.now() },
    }],
});

const Favourite = mongoose.model('Favourite', favouriteSchema)

module.exports = Favourite