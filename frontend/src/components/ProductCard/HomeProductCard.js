import { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Rating, IconButton, Chip, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS
import { Link } from 'react-router-dom'

function HomeProductCard({ product }) {
    const [isHovered, setIsHovered] = useState(false);
    const { addItemToCart } = useCart();

    // Function to get custom styles for tag background color
    const getTagBackground = (tag) => {
        switch (tag) {
            case 'sale':
                return { backgroundColor: 'red', color: 'white' };
            case 'limited':
                return { backgroundColor: 'black', color: 'white' };
            case 'selling fast':
                return { backgroundColor: 'yellow', color: 'black' };
            case 'new':
                return { backgroundColor: 'blue', color: 'white' };
            default:
                return { backgroundColor: 'gray', color: 'white' };
        }
    };


    // Handle adding to cart
    const handleAddToCart = () => {
        addItemToCart({
            id: product._id,
            name: product.name,
            price: product.salePrice || product.price,
            quantity: 1,
            front_image: product.front_image,
            item_total: (product.salePrice || product.price) * 1,
        });
        toast.success('Product added to cart!'); // Toast notification for adding to cart
    };

    return (
        <Card
            sx={{
                maxWidth: 345,
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: isHovered ? '#f8f9fa' : '#fff',
                transition: 'all 0.3s ease',
                ':hover': {
                    boxShadow: 6,
                },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            {/* Render tags */}
            {Array.isArray(product.tags) && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        display: 'flex',
                        gap: 0.5,
                        flexWrap: 'wrap',
                    }}
                >
                    {product.tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                ...getTagBackground(tag),
                            }}
                        />
                    ))}
                </Box>
            )}

            <Box sx={{ padding: '20px' }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={product.front_image || 'fallback-image-url.jpg'} // Fallback image URL
                    alt={product.name}
                />
            </Box>

            {/* Product Information */}
            <CardContent sx={{ padding: '16px 24px', textAlign: 'center' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {product.name}
                </Typography>

                <Box sx={{ marginTop: 2 }}>
                    {product.salePrice ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography
                                variant="body2"
                                sx={{ textDecoration: 'line-through', marginRight: 1, fontSize: '0.85rem' }}
                            >
                                £{product.price.toFixed(2)}
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#ccc', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                £{product.salePrice.toFixed(2)}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="h6" sx={{ color: '#aaa', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            £{product.price.toFixed(2)}
                        </Typography>
                    )}
                </Box>

                {/* Rating */}
                <Box sx={{ marginTop: 1 }}>
                    <Rating value={4} readOnly size="small" />
                </Box>
            </CardContent>

            {/* Sliding Add to Cart & Favorite Icons */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    right: isHovered ? '10px' : '-60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'right 0.3s ease, transform 0.2s ease',
                    zIndex: 2,
                }}
            >
                {/* Add to Cart Button */}
                <IconButton
                    onClick={handleAddToCart} // Use the new handleAddToCart function
                    color="black"
                    sx={{
                        backgroundColor: 'white',
                        boxShadow: 2,
                        ':hover': { transform: 'scale(1.1)', backgroundColor: '#9c27b0', color:'white' },
                        borderRadius: '50%',
                    }}
                >
                    <ShoppingCartIcon />
                </IconButton>

                {/* View Details Button */}
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }} target='_blank'>
                    <IconButton
                        color="black"
                        sx={{
                            backgroundColor: 'white',
                            boxShadow: 2,
                            ':hover': { transform: 'scale(1.1)', backgroundColor: '#9c27b0', color:'white' },
                            borderRadius: '50%',
                        }}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Link>

            </Box>
        </Card>
    );
}

export default HomeProductCard;
