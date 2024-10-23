import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthenticateContext';
import Shake from '../animation/Shake'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState(false); // State for email error
    const [passwordError, setPasswordError] = useState(false); // State for password error

    const navigate = useNavigate();
    const { signin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        
        // Reset error states at the start
        setEmailError(false);
        setPasswordError(false);
        setErrorMessage('');

        // Simple email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError(true); // Set email error state
            setErrorMessage('Please enter a valid email address.'); // Set error message
            return; // Stop further execution
        }

        try {
            const response = await signin(email, password); // Call signin and await its response
            console.log(response, 'on the sign in page');

            // Check if login was successful
            if (response.message === 'User logged in successfully') {
                navigate('/cart'); // Navigate to cart after successful login
            } 
        } catch (error) {
            console.log(error); // Log the entire error for better debugging
            const message = error.response.data.message || 'An error occurred.'; // Optional chaining
            console.log(message)
            setErrorMessage(message); // Set user-friendly error message

            // Determine which field caused the error
            if (message.includes('Email')) {
                setEmailError(true); // Highlight the email field

                setTimeout(() => {
                setEmailError(false)
                }, 3000);
            }
            if (message.includes('password')) {
                setPasswordError(true); // Highlight the password field

                setTimeout(() => {
                    setPasswordError(false)
                }, 3000);
            }
        }
    };

    return (
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f5f5f5' }}>
            <Paper elevation={3} sx={{ padding: 4, maxWidth: '400px', width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Shake hasError={emailError}>
                            <TextField
                                label="Email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={emailError} // Use the emailError state
                                helperText={emailError ? errorMessage : ''} // Show helper text if there's an error
                                required
                            />
                            </Shake>
                        </Grid>
                        <Grid item xs={12}>
                            <Shake hasError={passwordError}>
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={passwordError} // Use the passwordError state
                                helperText={passwordError ? errorMessage : ''} // Show helper text if there's an error
                                required
                            />
                            </Shake>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2, width: '100%', padding: 1.5 }}
                    >
                        Sign In
                    </Button>
                </form>
                <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
                    <Grid item>
                        <Link href="/reset-password" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/register" variant="body2">
                            Don't have an account? Register
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
        </>
    );
}

export default Login;
