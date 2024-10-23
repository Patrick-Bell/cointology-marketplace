import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                textAlign: 'center',
                padding: 2,
            }}
        >
            <ErrorOutlineIcon style={{ fontSize: 100, color: '#ff6b6b' }} />
            <Typography variant="h1" sx={{ fontSize: '72px', fontWeight: 'bold', color: '#333' }}>
                404
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: 3 }}>
                Oops! The page you're looking for doesn't exist.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/"
                sx={{ marginTop: 2 }}
            >
                Go Back to Home
            </Button>
        </Box>
    );
};

export default NotFoundPage;
