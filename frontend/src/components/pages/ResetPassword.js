import { useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, TextField, Button, Modal } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import CountDown from '../Reuseable/CountDown'; // Import your CountDown component
import Shake from '../animation/Shake'
import { motion } from 'framer-motion'

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(new Array(4).fill(''));
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showFirstModal, setShowFirstModal] = useState(true)
    const [timerActive, setTimerActive] = useState(false); // Timer state

    const handleEmailSubmit = async () => {
        if (email === '') {
            setError(true);
            setErrorMessage('Please enter your email');
            toast.error('Please enter your email.');

            setTimeout(() => {
                setError(false);
                setErrorMessage('');
            }, 3000);


            return;
        }

        try {
            const response = await axios.post(`/api/send-forgot-password-email/${email}`);
            if (response.status === 200) {
                toast.success('Verification code sent to your email.');
                setShowModal(true);
                setShowFirstModal(false)
            }
        } catch (e) {
            setError(true);
            setErrorMessage(e.response?.data?.message || 'An error occurred');
            toast.error(e.response?.data?.message || 'An error occurred');

            setTimeout(() => {
                setError(false);
                setErrorMessage('');
            }, 3000);
        }
    };

    // Handle code verification
    const handleCodeVerification = async () => {
        const code = verificationCode.join('');
        try {
            const response = await axios.post(`/api/verify-code`, { email, code });
            if (response.data.message === 'Code verified') {
                toast.success('Code verified. You can now reset your password.');
                setShowModal(false);
                setShowSuccessModal(true);
                setTimerActive(true); // Activate the timer

            } else {
                setError(true);
                setErrorMessage('Invalid Code');
                toast.error('Invalid code. Please try again.');

                setTimeout(() => {
                    setError(false);
                    setErrorMessage('');
                }, 3000);

                
            }
        } catch (e) {
            setError(true);
            setErrorMessage('Invalid Code');
            toast.error('Invalid code. Please try again.');

            setTimeout(() => {
                setError(false);
                setErrorMessage('');
            }, 3000);
        }
    };

    return (
        <>
            <ToastContainer />

            {showFirstModal && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f5f5f5' }}>
                <Paper elevation={3} sx={{ padding: 4, maxWidth: '400px', width: '100%' }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Enter Email to Reset Password
                    </Typography>
                    <Shake hasError={error}>
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        error={error}
                        helperText={error ? errorMessage : ''}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    </Shake>
                    <Button variant="contained" color="primary" fullWidth onClick={handleEmailSubmit}>
                        Send Verification Code
                    </Button>
                </Paper>
            </Box>
            )}




           {/* Modal for entering verification code */}
<Modal open={showModal} onClose={() => setShowModal(false)} sx={{ zIndex: '100' }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <motion.div 
            initial={{ opacity: 0, scale: 0 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.75 }} 
            transition={{ duration: 0.3 }} // You can adjust the timing as needed
        >
            <Paper sx={{ padding: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Enter Verification Code
                </Typography>
                <Box display="flex" justifyContent="space-between">
                    {verificationCode.map((digit, index) => (
                        <Shake hasError={error} key={index}>
                            <TextField
                                key={index}
                                value={digit}
                                error={error}
                                onChange={(e) => {
                                    const newCode = [...verificationCode];
                                    newCode[index] = e.target.value;
                                    setVerificationCode(newCode);
                                }}
                                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                                variant="outlined"
                                sx={{ width: 50, mx: 1 }}
                            />
                        </Shake>
                    ))}
                </Box>
                
                {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{errorMessage}</Typography>}
                <Button 
                    disabled={error} 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    sx={{ marginTop: 2 }} 
                    onClick={handleCodeVerification}
                >
                    Verify Code
                </Button>
            </Paper>
        </motion.div>
    </Box>
</Modal>





            <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} sx={{ zIndex: '100' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f5f5f5' }}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.75 }} 
                    transition={{ duration: 0.3 }} // You can adjust the timing as needed
                >
                    <Paper elevation={3} sx={{ padding: 4, maxWidth: '400px', width: '100%' }}>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Follow Email Instructions
                        </Typography>
                        <Typography>
                            Please follow email instructions. This email was sent to <strong>{email}</strong>. You will have 10 minutes to reset your password.
                        </Typography>
                        {/* Add the countdown timer */}
                        {timerActive && (
                            <Paper elevation={3} sx={{p: 2, textAlign:'center', mt: 2}}>
                            <CountDown date={Date.now() + 10 * 60 * 1000} />
                            </Paper>
                        )}
                    </Paper>
                    </motion.div>
                </Box>
            </Modal>
        </>
    );
}

export default ResetPassword;
