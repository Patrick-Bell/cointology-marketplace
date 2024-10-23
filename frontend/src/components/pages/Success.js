import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Success = () => {
    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Box sx={{ mb: 2, textAlign: 'center' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#4caf50' }} />
                <Typography variant="h4" sx={{ mt: 2 }}>
                    Payment Successful!
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
                    Thank you for your purchase. Your payment has been processed successfully.
                </Typography>
            </Box>

            <Button variant="contained" color="primary" sx={{ mt: 3 }} href="/">
                Go to Home
            </Button>
            <Button variant="outlined" color="primary" sx={{ mt: 1 }} href="/account">
                View Your Account
            </Button>
        </Container>
    );
}

export default Success;
