import React from 'react';
import {
    Box,
    Modal,
    Typography,
    Button,
    Paper,
    Avatar,
    Divider,
    Grid,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { AttachMoney, MoneyOff, CurrencyExchange } from '@mui/icons-material';

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

function InsufficientItemsModal({ open, insufficientItems, onClose }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="insufficient-items-modal-title"
            aria-describedby="insufficient-items-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    Insufficient Items
                </Typography>

                {/* Check if there are insufficient items */}
                {insufficientItems.length === 0 ? (
                    <Typography>No items are insufficient.</Typography>
                ) : (
                    <Box>
                        {/* Display each insufficient item */}
                        <Divider sx={{ my: 2 }} />
                        {insufficientItems.map((item, index) => (
                            <Paper
                                key={index}
                                elevation={1}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: 2,
                                    marginBottom: 1,
                                    borderRadius: 2,
                                }}
                            >
                                <Avatar 
                                    src={item.image} 
                                    alt={item.name} 
                                    sx={{ width: 56, height: 56, marginRight: 2 }} 
                                />
                                <Box>
                                    <Typography variant="subtitle1">{item.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Requested: {item.requestedAmount} | Available: {item.availableStock}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Please remove <strong>{(item.requestedAmount - item.availableStock)}</strong> quantities
                                    </Typography>
                                </Box>
                                
                            </Paper>
                        ))}
                        <Divider sx={{ my: 2 }} />
                    </Box>
                )}

                {/* Close Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default InsufficientItemsModal;
