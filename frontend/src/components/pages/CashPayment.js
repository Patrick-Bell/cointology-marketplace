import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Paper, 
    Grid, 
    List, 
    ListItem, 
    ListItemText, 
    Divider,
    ListItemAvatar,
    Avatar,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

function CashPayment() {
    const [cartItems, setCartItems] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('United Kingdom'); // Default to United Kingdom
    const [comments, setComments] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [payBtn, setPayBtn] = useState('Submit Order')
    const fixedShippingFee = 1.99;

    const navigate = useNavigate()

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items.map(item => ({
            ...item,
            item_total: item.item_total || (item.price * item.quantity),
        })));
    }, []);

    // Calculate total price based on cart items and shipping fee
    useEffect(() => {
        const calculateTotal = () => {
            const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotalPrice((total + fixedShippingFee).toFixed(2));
        };
        calculateTotal();
    }, [cartItems]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setPayBtn('Submitting Order...')

        if (!acceptTerms) {
            alert('You must accept the terms and conditions to proceed.');
            return;
        }

        const orderData = {
            name,
            email,
            phone,
            line_items: cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                front_image: item.front_image
            })),
            total_price: parseFloat(totalPrice),
            address_line_1: addressLine1,
            address_line_2: addressLine2,
            city: city,
            postal_code: postalCode,
            country: country,
            message: comments,
        };

        try {
            const response = await axios.post('/api/cash-payment-gateway', { orderData })
            console.log(response.data)
            toast.success(response.data.message)

            setTimeout(() => {
                setPayBtn('Order Confirmed!')
            }, 3000);

            setPayBtn('Submit Order')

            localStorage.setItem('cartItems', JSON.stringify([]));
            setCartItems([])
            navigate('/success')

            
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response.data.message)
            setPayBtn('Order Failed!')
            alert('An error occurred while submitting the order.');
        }
    };

    return (
        <Box sx={{ padding: 3, maxWidth: '800px', margin: '74px auto', bgcolor: '#f5f5f5' }}>
            <Typography variant="h4" gutterBottom>
                Cash Payment
            </Typography>

            <form onSubmit={handleSubmit}>
                <Paper sx={{ padding: 3, marginBottom: 3 }}>
                    {/* User Information */}
                    <Typography variant="h6" gutterBottom>
                        Customer Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Full Name"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone Number"
                                variant="outlined"
                                fullWidth
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <ToastContainer />

                <Paper sx={{ padding: 3, marginBottom: 3 }}>
                    {/* Address Information */}
                    <Typography variant="h6" gutterBottom>
                        Shipping Address
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Street Address (Line 1)"
                                variant="outlined"
                                fullWidth
                                value={addressLine1}
                                onChange={(e) => setAddressLine1(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Street Address (Line 2)"
                                variant="outlined"
                                fullWidth
                                value={addressLine2}
                                onChange={(e) => setAddressLine2(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="City"
                                variant="outlined"
                                fullWidth
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Postal Code"
                                variant="outlined"
                                fullWidth
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Country"
                                variant="outlined"
                                fullWidth
                                value={country}
                                disabled
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ padding: 3, marginBottom: 3 }}>
                    {/* Delivery Date and Time */}
                    <Typography variant="h6" gutterBottom>
                        Preferred Delivery Date & Time
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Delivery Date"
                                type="date"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Delivery Time"
                                type="time"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={deliveryTime}
                                onChange={(e) => setDeliveryTime(e.target.value)}
                                required
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ padding: 3, marginBottom: 3 }}>
                    {/* Cart Items */}
                    <Typography variant="h6" gutterBottom>
                        Order Summary
                    </Typography>
                    <List>
                        {cartItems.map((item) => (
                            <ListItem key={item.id}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={item.front_image}
                                        setImage
                                        alt={item.name}
                                        sx={{ width: 56, height: 56, marginRight: '30px' }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${item.name} x${item.quantity}`}
                                    secondary={`Price: £${(item.price * item.quantity).toFixed(2)}`}
                                />
                            </ListItem>
                        ))}
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Shipping Fee" secondary={`£${fixedShippingFee}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Total Price"
                                secondary={`£${totalPrice}`}
                            />
                        </ListItem>
                    </List>
                </Paper>

                <Paper sx={{ padding: 3, marginBottom: 3 }}>
                    {/* Additional Comments */}
                    <Typography variant="h6" gutterBottom>
                        Additional Comments
                    </Typography>
                    <TextField
                        label="Leave a comment or special instructions"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </Paper>

                <Paper sx={{ padding: 3, marginBottom: 3 }}>
                    {/* Terms and Conditions */}
                    <Typography variant="body2" color="error">
                        Warning: Failure to provide cash payment upon delivery may result in your address being blacklisted for future deliveries.
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                required
                            />
                        }
                        label="I agree to the terms and conditions"
                    />
                </Paper>

                <Box sx={{ textAlign: 'center', marginTop: 3 }}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        sx={{ width: '100%', padding: 1.5 }}
                    >
                        {payBtn}
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default CashPayment;
