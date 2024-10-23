const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')


/* 
Routes to include after an order has been placed

1. Create a new Order (mongoose)
2. Update the stock
3. Send email to the customer
4. Send email to the admin
5. Decide what shipping method was used (based on price)
6. Calculate expected delivery date based on this
*/

const calculateShippingMethod = async (shipping) => {
    try {
        switch (shipping) {
            case 0:
                return 'free';
            case 500:
                return 'premium';
            case 750:
                return 'next day';
            default:
                return 'standard';
        }
    } catch (e) {
        console.log(e);
        return 'error'; // Optionally return an error message or code
    }
};


const calculateDeliveryDate = async (shippingCost) => {
    try {
        const today = new Date();
        
        // Use setDate to add days to the current date
        if (shippingCost === 0) {
            return {
                earliestDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // Add 5 days
                latestDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)  // Add 10 days
            };
        } else if (shippingCost === 500) {
            return {
                earliestDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // Add 3 days
                latestDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)   // Add 5 days
            };
        } else if (shippingCost === 750) {
            return {
                earliestDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), // Add 1 day
                latestDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)   // Add 1 day
            };
        } else {
            return 'We will keep you updated with your delivery date!';
        }
    } catch (e) {
        console.log(e);
    }
};



// Route to add Card (stripe) payment to the database 

const addOrderToDatabase = async (orderData) => {
    try {
        // Create a new order instance
        const newOrder = new Order(orderData);

        // Save the new order to the database
        await newOrder.save();

        if (orderData.user !== null) {
            await User.findOneAndUpdate(
                { _id: orderData.user }, {$push: { orders: newOrder._id }}, { new: true }
            )
        }

        // Log success message (optional)
        console.log('Order saved successfully:', newOrder);
    } catch (error) {
        // Log the error with more context
        console.error('Error saving order to database:', error.message);
        // Optionally, rethrow the error or handle it as needed
        throw new Error('Database Error: Unable to save order');
    }
};

// Route to update stock quantities

const updateStockAfterOrder = async (orderData) => {

    try{
        for (const item of orderData.line_items) {
            const { name, quantity } = item

            const updatedProduct = await Product.findOneAndUpdate(
                { name: name },
                { $inc: { stock: -quantity} },
                { new: true}
            )

            console.log(`Stock updated for product ${name}`, updatedProduct);

        }

        return { message: 'Stock successfully updated'}


    }catch(e) {
        console.log(e)
    }
}


module.exports = { addOrderToDatabase, updateStockAfterOrder, calculateDeliveryDate, calculateShippingMethod }