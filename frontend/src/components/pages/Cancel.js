import {useState, useEffect} from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { handleCheckout } from '../../utils/Checkout';

const Cancel = () => {

    const [cartItems, setCartItems] = useState([]);
    const [payBtn, setPayBtn] = useState('Retry Payment');

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items.map(item => ({
            ...item,
            item_total: item.item_total || (item.price * item.quantity),
        })));
    }, []);


    const goToCheckout = async () => {
        try {
            // Ensure you are passing the correct arguments: cartItems, setPayBtn, and setCartItems
            await handleCheckout(cartItems, setPayBtn, setCartItems);
        } catch (e) {
            console.log('Checkout error:', e);
        }
    };


    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Box sx={{ mb: 2, textAlign: 'center' }}>
                <CancelOutlinedIcon sx={{ fontSize: 60, color: '#f44336' }} />
                <Typography variant="h4" sx={{ mt: 2 }}>
                    Payment Canceled
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
                    Your payment has been canceled. If this was a mistake, you can retry the payment.
                </Typography>
            </Box>

            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={goToCheckout}>
               {payBtn}
            </Button>
            <Button variant="outlined" color="primary" sx={{ mt: 1 }} href="/">
                Go to Home
            </Button>
        </Container>
    );
}

export default Cancel;
