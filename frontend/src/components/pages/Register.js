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
import axios from 'axios';
import Shake from '../animation/Shake';
import { ToastContainer, toast } from 'react-toastify';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        let validationErrors = {};
        setErrors({});

        // Validation: Check if fields are filled out
        if (!name) {
            validationErrors.name = 'Name is required';
        }
        if (!email) {
            validationErrors.email = 'Email is required';
        } else {
            // Validation: Check if email is valid
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                validationErrors.email = 'Invalid email format';
            }
        }
        if (!password) {
            validationErrors.password = 'Password is required';
        }
        if (!confirmPass) {
            validationErrors.confirmPass = 'Confirm Password is required';
        } else if (password !== confirmPass) {
            validationErrors.confirmPass = 'Passwords do not match';
        }

        // If there are any validation errors, set them and return early
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            setTimeout(() => {
                setErrors({})
            }, 3000);
            return;
        }

        try {
            const response = await axios.post('/api/register', { username: name, email, password })
            console.log(response.data)
            navigate('/login');

        } catch (error) {
            console.error(error);
            setErrors({ submit: error.response.data.message });
            toast.error('Email already registered. Please use another email or contact support.')

            setTimeout(() => {
                setErrors({ submit: ''})
                setEmail('')
            }, 3000);
        }
    };

    return (
        <>
        <ToastContainer/>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    bgcolor: '#f5f5f5',
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, maxWidth: '400px', width: '100%' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Register
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Shake hasError={Boolean(errors.name)}>
                                <TextField
                                    label="Name"
                                    type="text"
                                    variant="outlined"
                                    fullWidth
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name}
                                />
                                </Shake>
                            </Grid>
                            <Grid item xs={12}>
                            <Shake hasError={Boolean(errors.email)}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                />
                                </Shake>
                            </Grid>
                            <Grid item xs={12}>
                            <Shake hasError={Boolean(errors.password)}>
                                <TextField
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={Boolean(errors.password)}
                                    helperText={errors.password}
                                />
                                </Shake>
                            </Grid>
                            <Grid item xs={12}>
                            <Shake hasError={Boolean(errors.confirmPass)}>
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    error={Boolean(errors.confirmPass)}
                                    helperText={errors.confirmPass}
                                />
                                </Shake>
                            </Grid>
                        </Grid>
                        <Button
                            disabled={errors.name || errors.email || errors.password || errors.confirmPass || errors.submit}
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2, width: '100%', padding: 1.5 }}
                        >
                            Register
                        </Button>

                        {/* Display a general submit error */}
                        {errors.submit && (
                            <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
                                {errors.submit}
                            </Typography>
                        )}
                    </form>
                    <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
                        <Grid item>
                            <Link href="/reset-password" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Login
                            </Link>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </>
    );
}

export default Register;
