import axios from 'axios'; // Import axios
import { v4 as uuidv4 } from 'uuid'

export const handleCheckout = async (cartItems, setPayBtn, setCartItems) => {
    try {
        setPayBtn('Checking out...'); // Update button text

        const insufficientItems = [];

        console.log(cartItems)

        // Use Promise.all to fetch product details concurrently
        const productChecks = cartItems.map(async (item) => {
            try {
                const response = await axios.get(`/api/product/${item.id}`);
                const product = response.data;
                console.log(product)

                if (!product) {
                    console.error(`Product with ID ${item.id} not found.`);
                    insufficientItems.push({
                        id: item.id,
                        name: item.name,
                        image: item.front_image,
                        requestedAmount: item.quantity,
                        availableStock: 0 // Indicate that the product does not exist
                    });
                    return;
                }

                if (product.stock < item.quantity) {
                    insufficientItems.push({
                        name: item.name,
                        image: item.front_image,
                        requestedAmount: item.quantity,
                        availableStock: product.stock ?? 0 // Use nullish coalescing operator for cleaner code
                    });
                }
            } catch (error) {
                console.error(`Error fetching product ${item.id}:`, error);
            }
        });

        await Promise.all(productChecks);

        if (insufficientItems.length > 0) {
            console.error('Insufficient items:', insufficientItems);
            return insufficientItems;
        } else {
            const response = await axios.post('/api/stripe-checkout', { items: cartItems });
            const data = response.data;

            if (data.url) {
                window.location.href = data.url;
                setCartItems([]); // Clear cart
            } else {
                console.log('Cannot find route to checkout');
            }
        }

        setPayBtn('Redirecting...'); // Reset button text upon success
    } catch (e) {
        console.error('Checkout error:', e);
        setPayBtn('Checkout Failed'); // Reset button text upon failure
    }
};



export const handleCashCheckout = async (cartItems, setCashBtn) => {
    try {
        setCashBtn('Checking out...'); // Update button text

        const insufficientItems = [];

        const sessionId = uuidv4()

        console.log(cartItems)

        // Use Promise.all to fetch product details concurrently
        const productChecks = cartItems.map(async (item) => {
            try {
                const response = await axios.get(`/api/product/${item.id}`);
                const product = response.data;
                console.log(product)

                if (!product) {
                    console.error(`Product with ID ${item.id} not found.`);
                    insufficientItems.push({
                        id: item.id,
                        name: item.name,
                        image: item.front_image,
                        requestedAmount: item.quantity,
                        availableStock: 0 // Indicate that the product does not exist
                    });
                    return;
                }

                if (product.stock < item.quantity) {
                    insufficientItems.push({
                        name: item.name,
                        image: item.front_image,
                        requestedAmount: item.quantity,
                        availableStock: product.stock ?? 0 // Use nullish coalescing operator for cleaner code
                    });
                }
            } catch (error) {
                console.error(`Error fetching product ${item.id}:`, error);
            }
        });

        await Promise.all(productChecks);

        if (insufficientItems.length > 0) {
            console.error('Insufficient items:', insufficientItems);
            return insufficientItems;
        } else {
            window.location = `/cash-payment/${sessionId}`
        }

        setCashBtn('Redirecting...'); // Reset button text upon success
    } catch (e) {
        console.error('Checkout error:', e);
        setCashBtn('Checkout Failed'); // Reset button text upon failure
    }
};
