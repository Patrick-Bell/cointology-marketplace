import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Alert,
} from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { useAuth } from '../context/AuthenticateContext';
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios';
import Shake from '../animation/Shake'

function UserDetails() {
    const { user } = useAuth(); // Assuming you have a context to provide user data and update function
    const [username, setUsername] = useState(user.username || '');
    const [email, setEmail] = useState(user.email || '');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false)
    const [usernameErrorMsg, setUsernameErrorMsg] = useState('')
    const [emailErrorMsg, setEmailErrorMsg] = useState('')
    const [success, setSuccess] = useState('Update')
    

    useEffect(() => {
        // Load user details into state if user is available
        if (user) {
            console.log(user)
            setUsername(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleUpdate = async () => {
        setLoading(true);
    
        // Validation checks
        if (!username || username.trim() === '') {
            setUsernameError(true);
            setUsernameErrorMsg('Username cannot be empty.')
            toast.error('Usernme cannot be empty')
            setLoading(false);

            setTimeout(() => {
                setUsernameError(false);
                setUsernameErrorMsg('')
            }, 3000);


            return;
        }
    
        // Basic validation for username length (e.g., min 3, max 20 characters)
        if (username.length < 3 || username.length > 20) {
            setUsernameError(true);
            setUsernameErrorMsg('Username must be between 3 and 20 characters')
            toast.error('Username must be between 3 and 20 characters')
            setUsername('')
            setLoading(false);

            setTimeout(() => {
                setUsernameError(false);
                setUsernameErrorMsg('')
            }, 3000);


            return;
        }
    
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
        if (!email || email.trim() === '') {
            setEmailError(true);
            setEmailErrorMsg('Email cannot be empty')
            toast.error('Email cannot be empty')
            setLoading(false);

            setTimeout(() => {
                setEmailError(false);
                setEmailErrorMsg('')
            }, 3000);

            return;
        }
        if (!emailRegex.test(email)) {
            setEmailError(true);
            setLoading(false);
            setEmailErrorMsg('Invalid email')
            toast.error('Invalid email')
            setEmail('')

            setTimeout(() => {
                setEmailError(false);
                setEmailErrorMsg('')
            }, 3000);

            return;
        }
    
        console.log(username, email);
        try {
            const response = await axios.put(`/api/edit-user-details/${user.id}`, {
                username: username,
                email: email
            });
            console.log('success', response.data);
            setLoading(false);
            toast.success('Details updated successfully. Please re-sign into your account to see the updates.');
        } catch (err) {
            setLoading(false); // Make sure to stop loading in case of an error
            toast.error('Something has gone wrong!')
        } 
    };
    

    return (
        <>

        <ToastContainer/>

        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                User Details
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Shake hasError={usernameError}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    error={usernameError}
                    helperText={ usernameError ? usernameErrorMsg : ''}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </Shake>
            </Box>
            <Box sx={{ mb: 2 }}>
                <Shake hasError={emailError}>
                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    error={emailError}
                    helperText={emailError ? emailErrorMsg : ''}
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </Shake>
            </Box>
            <Box display="flex" justifyContent="space-between">
                <Button variant="contained" color="primary" onClick={handleUpdate} disabled={loading || emailError || usernameError }>
                    {loading ? <CircularProgress size={24} /> : success }
                </Button>
            </Box>
            <Alert
            sx={{
                mt: 2,
                bgcolor: 'white', // Custom background color
                border:'1px solid #9c27b0',
                color: '#9c27b0', // Optional: Set text color for better contrast
                '& .MuiAlert-icon': {
                    color: '#9c27b0', // Optional: Change the icon color
                },
            }}
            icon={<NewReleasesIcon fontSize="inherit" />}
        >
            To view changes, you <strong>MUST</strong> re-sign into your account after updating. 
        </Alert>     
            </Paper>
        </>
    );
}

export default UserDetails;
