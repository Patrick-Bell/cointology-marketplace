require('dotenv').config()
const express = require('express')
const router = express.Router()
const Favourite = require('../models/Favourite')
const Product = require('../models/Product')
const verifyUser = require('../middleware/verifyUser')
const User = require('../models/User')
const { v4: uuidv4 } = require('uuid')
const mongoose = require('mongoose')



// Route to add to favourites
router.post('/add-to-favourites/:id', verifyUser, async (req, res) => {
    const productId = req.params.id;
    console.log(productId);

    try {
        const user = req.user;
        const role = user.role;

        if (role === 'guest' || !user) {
            return res.status(400).json({ message: 'You must be logged in to add items to your favourites' });
        }

        const product = await Product.findOne({ _id: productId });
        console.log(product);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const existingFavourite = await Favourite.findOne({
            user: user.id,
            'line_items.item_id': product._id
        });

        if (existingFavourite) {
            return res.status(400).json({ message: 'Item already in favourites' });
        }

        const newFav = new Favourite({
            user: user.id,
            line_items: [{
                item_id: product._id,
                item_name: product.name,
                item_price: product.price,
                item_image: product.front_image,
                date_added: Date.now(),
            }]
        });

        console.log(newFav);

        await newFav.save();

        await User.findByIdAndUpdate(user.id, { $push: { favourites: newFav._id } }, { new: true });

        const updatedUser = await User.findById(user.id).populate('favourites');
        console.log('Updated user favourites:', updatedUser.favourites);

        return res.status(200).json({ message: 'Item added to favourites' });
    } catch (error) {
        console.error('Error adding to favourites:', error);

        // Always return a descriptive error message
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});






// Route to remove a specific product from favourites
router.delete('/remove-from-favourites/:productId', verifyUser, async (req, res) => {
    const productId = req.params.productId; // The product ID to remove from favourites
    console.log('Product ID to remove:', productId); // Log the incoming product ID

    try {
        const user = req.user;

        // Find the user's Favourite document
        const favourite = await Favourite.findOne({ user: user.id });

        console.log('Favourite document found:', favourite); // Log the favourite document

        
        const result = await Favourite.deleteOne({ _id: productId})

        if (result.deletedCount === 0 ) {
            console.log('something gone wrong')
        }


        const id = favourite._id

        console.log('id', id, 'productID', productId)

        // Optionally, you can remove the reference to the item from the user's favourites array if it contains product IDs
        await User.findByIdAndUpdate(user.id, { $pull: { favourites: productId } }, { new: true });

        // Log the updated line_items
        console.log('Updated favourites after removal:', favourite.line_items); // Log updated line_items

        // Send response
        res.status(200).json({ message: 'Product removed from favourites', favourites: favourite.line_items });

    } catch (error) {
        console.error('Error removing product from favourites:', error); // Log the error
        res.status(500).json({ error: 'Error removing product from favourites' });
    }
});







// route to clear the cart
router.post('/clear-favourites', async (req, res) => {
    try{

    }catch(error) {
        console.log(error)
        res.status(500).json({ error: 'Error adding to favourites' })
    }
})


// Route to get all favourites for a user
router.get('/favourites', verifyUser, async (req, res) => {
    try {
      const user = req.user;
  
      if (!user || user.role === 'guest') {
        return res.status(404).json({ message: 'You must be logged in to view favourites' });
      }
  
      // Log the user object to see if it has favourites populated
      console.log('User:', user);
  
      // Find the user and populate the 'favourites' field
      const userWithFavourites = await User.findById(user.id).populate('favourites');
      console.log('User with favourites:', userWithFavourites);
  
      // Check if favourites are populated
      const favourites = userWithFavourites.favourites || [];
      console.log('Favourites:', favourites);

      const ids = favourites.map(fav => {
        return fav.line_items[0]?.item_id
      })
  
      // Return the favourites
      res.status(200).json(ids);
    } catch (error) {
      console.error('Error fetching favourites:', error);
      res.status(500).json({ error: 'Error fetching favourites' });
    }
  });
  


router.get('/user-favourites', verifyUser, async (req, res) => {
    try {
        const user = req.user;
        console.log('verfiting user', user)

        // Find the user and populate the 'favourites' field
        const userWithFavourites = await User.findById(user.id).populate('favourites');


        // Return the favourites
        res.status(200).json(userWithFavourites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching favourites' });
    }
});

router.get('/api/favourite/:id', verifyUser, async (req, res) => {
    const id = req.params.id
    try{

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: 'Cannot retrieve data'})
    }
})


module.exports = router;