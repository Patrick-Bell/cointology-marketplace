import React, { useEffect, useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    Typography,
    IconButton,
    Grid,
    Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { handleCheckout, handleCashCheckout } from '../../utils/Checkout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InsufficientItemsModal from '../InsufficientItems/InsuffcientItemsModal'; // Import your modal component
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useCart } from '../context/CartContext';
import ScrollInView from '../animation/ScrollInView'

function Cart() {
    const [item, setCartItems] = useState([])
    const [payBtn, setPayBtn] = useState('Checkout');
    const [payCashBtn, setPayCashBtn] = useState('Pay By Cash');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [insufficientItems, setInsufficientItems] = useState([]);
    const [openModal, setOpenModal] = useState(false); // State for modal visibility
    const navigate = useNavigate(); // Initialize useNavigate

    const { cartItems, handleQuantityChange, handleRemoveItem } = useCart()

    // Calculate the total price of the items in the cart
    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.item_total || 0), 0).toFixed(2);
    };

    // Handle checkout process
    const goToCheckout = async () => {
        try {
            const result = await handleCheckout(cartItems, setPayBtn, setCartItems);
            if (result && result.length > 0) {
                setInsufficientItems(result); // Set insufficient items from the response
                setOpenModal(true); // Open the modal if there are insufficient items
            }
        } catch (e) {
            console.log('Checkout error:', e);
        }
    };

    // Handle cash checkout process
    const goToPayCheckout = async () => {
        try {
            const result = await handleCashCheckout(cartItems, setPayCashBtn);
            if (result && result.length > 0) {
                setInsufficientItems(result); // Set insufficient items from the response
                setOpenModal(true); // Open the modal if there are insufficient items
            }
        } catch (e) {
            console.log('Checkout error:', e);
        }
    };


    const handleCloseModal = () => {
        setOpenModal(false); // Close the modal
        setPayBtn('Checkout');
        setPayCashBtn('Pay By Cash');
    };

    const handleCloseSnackbar = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Box sx={{ padding: 3}}>

            {/* Conditional rendering for empty cart */}
            {cartItems.length === 0 ? (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column', // Stack items vertically
            justifyContent: 'center', // Center vertically
            alignItems: 'center', // Center horizontally
            height: 'calc(100vh - 70px)', // Full viewport height minus header height
            textAlign: 'center', // Center text
            padding: 2, // Add some padding for spacing
        }}
    >
        <AddShoppingCartIcon sx={{ fontSize: '100px'}} /> {/* Big icon */}
        <Typography variant="h6">
            Your cart is empty!
        </Typography>
        <Button
            className='pulse'
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')} // Navigate to the shop page
            sx={{ marginTop: 2 }} // Add some margin for spacing
        >
            Start Shopping
        </Button>
    </Box>
) : (
                <Grid container spacing={2} marginTop='40px'>
                    {/* Cart Items Section */}
                    <Grid item xs={12} md={8}>
                        <TableContainer component={Paper} elevation={3}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>Quantity</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>Total Price</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#e0f7fa' } }}>
                                            <TableCell>
                                                <img src={item.front_image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />
                                            </TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Button 
                                                        onClick={() => handleQuantityChange(item.id, Math.max(item.quantity - 1, 1))} 
                                                        variant="outlined" 
                                                        sx={{ 
                                                            width: '30px', 
                                                            height: '30px', 
                                                            padding: 0, 
                                                            minWidth: 0, 
                                                            fontSize: '0.875rem' 
                                                        }} 
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </Button>
                                                    <Typography sx={{ mx: 1, fontSize: '0.875rem' }}>{item.quantity}</Typography>
                                                    <Button 
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)} 
                                                        variant="outlined" 
                                                        sx={{ 
                                                            width: '30px', 
                                                            height: '30px', 
                                                            padding: 0, 
                                                            minWidth: 0, 
                                                            fontSize: '0.875rem' 
                                                        }}
                                                    >
                                                        +
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                £{item.item_total ? item.item_total.toFixed(2) : '0.00'}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <IconButton onClick={() => handleRemoveItem(item.id)} color="error" size="small">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Checkout Summary Section */}
                    <Grid item xs={12} md={4}>
                        <Box 
                            component={Paper} 
                            elevation={3} 
                            sx={{ padding: 3, textAlign: 'center' }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Total: <strong>£{calculateTotalPrice()}</strong>
                            </Typography>
                            <ScrollInView direction='top'>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={goToCheckout} 
                                    disabled={loading}
                                    sx={{ marginBottom: 1, width: '100%' }} // Add margin for spacing
                                >
                                    {payBtn}
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    onClick={goToPayCheckout}
                                    sx={{ width: '100%' }}
                                >
                                    {payCashBtn}
                                </Button>
                            </Box>
                            </ScrollInView>
                        </Box>
                    </Grid>
                </Grid>
            )}

            {/* Snackbar for Notifications */}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar} 
                message={notification.message}
            />

            {/* Insufficient Items Modal */}
            <InsufficientItemsModal 
                open={openModal} 
                insufficientItems={insufficientItems} 
                onClose={handleCloseModal} 
            />
        </Box>
    );
}

export default Cart;
