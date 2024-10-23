import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, InputAdornment } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check'; // Import Check icon
import axios from 'axios';
import { motion } from 'framer-motion'; // Import Framer Motion
import Shake from '../animation/Shake';

function TrackPackage() {
    const [orderId, setOrderId] = useState('');
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasError, setHasError] = useState(false); // New state for error highlighting

    const handleTrackPackage = async () => {
        setLoading(true);
        setError(null);
        setHasError(false); // Reset error state before tracking

        try {
            const response = await axios.get(`/api/track-order/${orderId}`);
            if (response.data && response.data.length > 0 && response.data[0].order_status) {
                setTrackingInfo(response.data[0]);
                console.log(response.data);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error("Error tracking order:", err);
            setError('Order not found. Please check the order ID and try again.');
            setHasError(true); // Set error state to true on error
            setTrackingInfo(null);
            setTimeout(() => {
                setError('');
                setHasError(false)
                setOrderId('')
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const statusText = {
        pending: { icon: '🕒', message: 'Your order is currently pending and awaiting processing...' },
        shipped: { icon: '✈️', message: 'Great news! Your order has been shipped...' },
        attempted_delivery: { icon: '🚪', message: 'Delivery was attempted but not successful...' },
        delivered: { icon: '📦', message: 'Your order has been delivered!' },
        cancelled: { icon: '❌', message: 'Your order was cancelled...' },
    };

    return (
        <Box sx={{ width: '100%' }}>
            {!trackingInfo ? (
                <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Track My Package
                    </Typography>

                    <Shake hasError={hasError}>
                        <TextField
                            fullWidth
                            label="Enter Order ID"
                            variant="outlined"
                            value={orderId}
                            onChange={(e) => {
                                if (e.target.value.length <= 36) {
                                    setOrderId(e.target.value);
                                }
                            }}
                            sx={{ marginBottom: 2 }}
                            error={hasError} // Highlight text field in red
                            helperText={hasError ? error : ''} // Show error message in helper text
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {orderId.length === 36 ? (
                                            <CheckIcon color="success" />
                                        ) : (
                                            <Typography>{`${orderId.length}/36`}</Typography>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        </Shake>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTrackPackage}
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Track'}
                    </Button>
                </Paper>
            ) : (
                <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Tracking Information
                    </Typography>
                    <Typography variant="body1">
                        <strong>Order ID:</strong> {orderId}
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="h3">{statusText[trackingInfo.order_status]?.icon || '❓'}</Typography>
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                            {statusText[trackingInfo.order_status]?.message || 'Status not available for this order.'}
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ marginTop: 4 }}
                        onClick={() => {
                            setTrackingInfo(null);
                            setOrderId('');
                        }}
                        fullWidth
                    >
                        Track Another Package
                    </Button>
                </Paper>
            )}
        </Box>
    );
}

export default TrackPackage;
