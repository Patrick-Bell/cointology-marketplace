import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const EditProductModal = ({ open, handleClose, product, handleSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        other_price: '',
        description: '',
        stock: '',
        tags: [],
        category: '',
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price,
                other_price: product.other_price,
                description: product.description,
                stock: product.stock,
                tags: product.tags || [], // Ensure tags are initialized as an array
                category: product.category,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleTagChange = (tag) => {
        setFormData((prev) => {
            const tags = prev.tags.includes(tag)
                ? prev.tags.filter((t) => t !== tag) // Remove tag if it already exists
                : [...prev.tags, tag]; // Add tag if it doesn't exist
            return { ...prev, tags };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave(formData); // Pass the updated form data
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Edit Product
                </Typography>
                <IconButton
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Other Price"
                        name="other_price"
                        type="number"
                        value={formData.other_price}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        multiline
                        rows={4}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Stock"
                        name="stock"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Tags:</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {['sale', 'limited', 'new', 'selling fast'].map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                onClick={() => handleTagChange(tag)}
                                variant={formData.tags.includes(tag) ? 'filled' : 'outlined'}
                                sx={{
                                    cursor: 'pointer',
                                    ...(formData.tags.includes(tag) ? { backgroundColor: '#1976d2', color: '#fff' } : {})
                                }}
                            />
                        ))}
                    </Box>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Save Changes
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default EditProductModal;
