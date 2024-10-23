import React, { useState, useEffect } from 'react';
import {
    Box,
    Modal,
    Typography,
    Button,
    IconButton,
    Grid,
    Divider,
    RadioGroup,
    Radio,
    FormControlLabel,
    Paper,
    Avatar,
    CircularProgress,
} from '@mui/material';
import {
    AttachMoney,
    MoneyOff,
    CurrencyExchange,
    CheckCircle,
} from '@mui/icons-material';
import axios from 'axios';

// Modal Styling
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

function PaymentModal({ orderId, open, onClose }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState('');

    // Fetch current payment status
    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const response = await axios.get(`/api/orders/${orderId}/payment-status`);
                setStatus(response.data); // Assuming response contains `payment_status`
                setLoading(false);
            } catch (error) {
                console.error('Error fetching payment status:', error);
                setLoading(false);
            }
        };

        if (open) {
            fetchPaymentStatus();
        }
    }, [orderId, open]);

    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const handleSave = async () => {
        try {
            await axios.post(`/api/orders/${orderId}/update-payment-status`, { status: newStatus });
            setStatus(newStatus);
            onClose();
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    const statusIcons = {
        paid: <AttachMoney color="success" />,
        not_paid: <MoneyOff color="error" />,
        refunded: <CurrencyExchange color="primary" />,
    };

    const statusOptions = [
        { label: 'Paid', value: 'paid', icon: <AttachMoney /> },
        { label: 'Not Paid', value: 'not_paid', icon: <MoneyOff /> },
        { label: 'Refunded', value: 'refunded', icon: <CurrencyExchange /> },
    ];

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="payment-modal-title"
            aria-describedby="payment-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    Update Payment Status 
                    <Typography variant="subtitle1" color="textSecondary" component="span" sx={{margin: '0 5px'}}>
                        (...{orderId.slice(-6)})
                    </Typography>
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box>
                        {/* Current Status Display */}
                        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar sx={{ bgcolor: 'transparent', marginRight: 1 }}>
                                    {statusIcons[status]}
                                </Avatar>
                                Current Status: <strong style={{margin: '0 5px'}}>{status}</strong>
                            </Typography>
                        </Paper>

                        <Divider sx={{ my: 2 }} />

                        {/* Status Options */}
                        <Typography variant="subtitle1" gutterBottom>
                            Choose New Status:
                        </Typography>
                        <RadioGroup value={newStatus || status} onChange={handleStatusChange}>
                            <Grid container spacing={2}>
                                {statusOptions.map((option) => (
                                    <Grid item xs={12} sm={12} key={option.value}>
                                        <Paper
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: 1.5,
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                            }}
                                            elevation={1}
                                        >
                                            <FormControlLabel
                                                value={option.value}
                                                control={<Radio />}
                                                label={option.label}
                                                sx={{ marginLeft: 1 }}
                                            />
                                            <IconButton sx={{ marginLeft: 'auto' }}>
                                                {option.icon}
                                            </IconButton>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </RadioGroup>

                        <Divider sx={{ my: 2 }} />

                        {/* Save Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="primary" onClick={handleSave} disabled={!newStatus || newStatus === status}>
                                Save Status
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    );
}

export default PaymentModal;
