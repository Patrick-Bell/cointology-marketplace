const express = require('express')
const router = express.Router();
const Product = require('../models/Product')
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { sendEmailWhenNewLimitedProductReleases } = require('../utils/Email')
 


// route to get all products
router.get('/products', async (req, res) => {
    try{
        const products = await Product.find().populate('ratings')

        return res.status(200).json(products)

    }catch(e) {
        console.log(e)
        res.status(500).json({ e: 'Error fetching products' })
    }
})

// route to add a product
router.post('/add-product', async (req, res) => {
    try {
        console.log('Received Data:', req.body); // Log the incoming data

        // Extract product information
        const { name, description, price, other_price, category, stock, tags, color, front_image, back_image } = req.body;

        // Create a new product object
        const newProduct = new Product({
            id: uuidv4(),
            name,
            description,
            price,
            other_price,
            category,
            stock,
            tags: tags ? JSON.parse(tags) : [], // Parse tags if they exist
            color,
            front_image,
            back_image,
            ratings: [],
        });

        // Save the product to the database
        await newProduct.save();
        await sendEmailWhenNewLimitedProductReleases(newProduct);


        // Return a success response
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Error adding product' });
    }
});




// route to delete a product
router.delete('/delete-product/:id', async (req, res) => {
    const productId = req.params.id
    console.log(productId)
    try{

        const result = await Product.findOneAndDelete({ id: productId })
        if (result.deleteCount === 0) {
            return res.status(404).json({ error: 'Product not found'})
        }

        return res.status(200).json({ message: 'Product successfully deleted' })

    }catch(error) {
        console.log(error)
        res.status(500).json({ error: 'Error adding to cart' })
    }
})


// route to get a specific product (to populate an edit modal)
router.get('/product/:id', async (req, res) => {
    const { id } = req.params; // Correctly destructuring the id parameter

    console.log(id)

    console.log('Requested Product ID:', id); // Log the requested ID for debugging

    try {
        const product = await Product.findById(id); // Use the correct id

        if (!product) {
            return res.status(404).json({ error: 'Product not found' }); // Handle case where product is not found
        }

        console.log('Found Product:', product); // Log the found product for debugging

        return res.status(200).json(product);
    } catch (error) {
        console.error('Error finding specific product:', error); // Log the error
        return res.status(500).json({ error: 'Error finding specific product' });
    }
});

router.get('/product-details/:id', async (req, res) => {
    const { id } = req.params
    try {

        const product = await Product.findOne({ _id: id }).populate('ratings')

        console.log('product found', product)

        res.json(product)

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: e})
    }
})


// route to complete an edit product
router.post('/edit-product/:id', async (req, res) => {
    const { id } = req.params
    const { updatedProduct } = req.body
    console.log(updatedProduct)
    try{

        const product = await Product.findOneAndUpdate(
            { id: id },
            { $set: updatedProduct },
            { new: true }
        )

        return res.status(200).json(product)

    }catch(error) {
        console.log(error)
        res.status(500).json({ error: 'Error adding to cart' })
    }
})


// route to get all product with reviews included
router.get('/product-reviews', async (req, res) => {
    try {
        const products = await Product.find().populate('ratings')

        res.status(200).json(products)

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: 'error' })
    }
})


module.exports = router