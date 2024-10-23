import React, { useState } from 'react';
import { Box, Button, Chip, MenuItem, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';

const AddProductForm = () => {
    // Internal state for the product
    const [product, setProduct] = useState({
        name: '',
        price: '',
        other_price: '',
        stock: '',
        front_image: '',  // Changed to string for URL
        back_image: '',   // Changed to string for URL
        category: '',
        color: '',
        tags: [],
    });

    // Handle input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle tag changes
    const handleTagChange = (tag) => {
        setProduct((prev) => {
            const tags = prev.tags.includes(tag)
                ? prev.tags.filter((t) => t !== tag) // Remove tag if it already exists
                : [...prev.tags, tag]; // Add tag if it doesn't exist
            return { ...prev, tags };
        });
    };

    const handleAddProduct = async () => {
        // Prepare the product data as a JSON object
        const productData = {
            name: product.name,
            price: product.price,
            other_price: product.other_price,
            stock: product.stock,
            front_image: product.front_image,
            back_image: product.back_image,
            category: product.category,
            color: product.color,
            tags: JSON.stringify(product.tags), // Send as string
        };
    
        try {
            // Make a POST request with the product data
            const response = await axios.post('/api/add-product', productData, {
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                },
            });
            console.log('Product added successfully:', response.data);
    
            // Resetting the form
            setProduct({
                name: '',
                price: '',
                other_price: '',
                stock: '',
                front_image: '',
                back_image: '',
                category: '',
                tags: [],
            });
    
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };
    
    

    return (
        <Paper elevation={3} sx={{p: 2}}>
            <Typography variant='h4'>Add Product</Typography>
        <form noValidate autoComplete="off">
            <TextField
                label="Product Name"
                name="name"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={product.name}
                onChange={handleInputChange}
            />
            <TextField
                label="Product Price"
                name="price"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={(product.price)}
                placeholder='£'
                onChange={handleInputChange}
            />
            <TextField
                label="Decoy Price"
                name="other_price"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={(product.other_price)}
                placeholder='£'
                onChange={handleInputChange}
            />
            <TextField
                label="Product Stock"
                name="stock"
                variant="outlined"
                type='number'
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={product.stock}
                onChange={handleInputChange}
            />

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Image URLs:</Typography>

            {/* Front Image URL Input */}
            <TextField
                label="Front Image URL"
                name="front_image"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={product.front_image}
                onChange={handleInputChange}
            />
            {/* Front Image Preview */}
            {product.front_image && (
                <Box sx={{ my: 2 }}>
                    <Typography variant="body2">Front Image Preview:</Typography>
                    <img src={product.front_image} alt="Front Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                </Box>
            )}

            {/* Back Image URL Input */}
            <TextField
                label="Back Image URL"
                name="back_image"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={product.back_image}
                onChange={handleInputChange}
            />
            {/* Back Image Preview */}
            {product.back_image && (
                <Box sx={{ my: 2 }}>
                    <Typography variant="body2">Back Image Preview:</Typography>
                    <img src={product.back_image} alt="Back Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                </Box>
            )}

            <TextField
                select
                label="Category"
                name="category"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={product.category}
                onChange={handleInputChange}
            >
                <MenuItem value="olympic">Olympic</MenuItem>
                <MenuItem value="limited">Limited</MenuItem>
                <MenuItem value="potter">Potter</MenuItem>
                <MenuItem value="other">Other</MenuItem>

            </TextField>

            <TextField
                select
                label="Color"
                name="color"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={product.color}
                onChange={handleInputChange}
            >
                <MenuItem value="bronze">Bronze</MenuItem>
                <MenuItem value="silver">Silver</MenuItem>
                <MenuItem value="gold">Gold</MenuItem>
            </TextField>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Tags:</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {['sale', 'limited', 'new', 'selling fast'].map((tag) => (
                    <Chip
                        key={tag}
                        label={tag}
                        onClick={() => handleTagChange(tag)}
                        variant={product.tags.includes(tag) ? 'filled' : 'outlined'}
                        sx={{
                            cursor: 'pointer',
                            ...(product.tags.includes(tag) ? { backgroundColor: '#9c27b0', color: '#fff' } : {})
                        }}
                    />
                ))}
            </Box>

            <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ mt: 2 }}>
                Add Product
            </Button>
        </form>
        </Paper>
    );
};

export default AddProductForm;
