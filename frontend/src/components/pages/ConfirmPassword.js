import { Box, Grid, Paper, Typography, TextField, Button, Modal } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';



function ConfirmPassword() {

    const navigate = useNavigate()

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false)


    const { token } = useParams()

    const handlePasswordSubmit = async () => {
        if (password === '' || confirmPassword === '') {
            setError(true);
            setErrorMessage('Fields cannot be left empty.');
            toast.error('Fields cannot be left empty.');

            setTimeout(() => {
                setError(false)
                setErrorMessage('')
            }, 5000);


            return;
        }

        if (password.length < 8) {
            setError(true);
            setErrorMessage('Password must be at least 8 characters.');
            toast.error('Password must be at least 8 characters.');

            setTimeout(() => {
                setError(false)
                setErrorMessage('')
            }, 5000);


            return;
        }

        if (password !== confirmPassword) {
            setError(true);
            setErrorMessage('Passwords do not match.');
            toast.error('Passwords do not match.');

            setTimeout(() => {
                setError(false)
                setErrorMessage('')
            }, 5000);


            return;
        }

        try {
            const response = await axios.post(`/api/confirm-new-password`, { token, password  });
            console.log(token, password)
            console.log(response.data);
            toast.success('Password successfully changed! Redirecting in 5 seconds...');
            setSuccess(true)
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        } catch (e) {
            console.log(e);
            toast.error('Something went wrong. Please try again.');
        }
    };


    return (

        <>
        <ToastContainer/>
             <Box sx={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', bgcolor: '#f5f5f5' }}>
                <Paper elevation={3} sx={{padding: 3}}>
                <Typography variant="h4" component="h1" gutterBottom>
                                Reset Password
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Password"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        error={error}
                                        disabled={success}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Confirm Password"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        error={error}
                                        disabled={success}
                                        required
                                    />
                                    {error && <Typography color="error">{errorMessage}</Typography>}
                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                disabled={success}
                                color="primary"
                                fullWidth
                                sx={{ marginTop: 2, padding: 1.5 }}
                                onClick={handlePasswordSubmit}
                            >
                                Reset Password
                            </Button>
                            </Paper>
                            </Box>
                        </>
            )
}

export default ConfirmPassword