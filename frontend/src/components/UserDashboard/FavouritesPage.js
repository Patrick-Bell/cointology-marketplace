import { useEffect } from 'react';
import { useFavourite } from '../context/FavouriteContext';
import { useCart } from '../context/CartContext';
import { Card, CardMedia, CardContent, Typography, IconButton, Box, Button, Rating, Stack, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function FavouritesPage() {
    const { favourites, removeFromFavourites, fetchUserFavourites } = useFavourite();
    const { addItemToCart } = useCart();

    const userFavourites = favourites.favourites;

    useEffect(() => {
        fetchUserFavourites();
    }, [removeFromFavourites]);

    const handleRemoveFromFavourites = async (productId) => {
        try {
            removeFromFavourites(productId);
            toast.success('Product removed from favourites')
        } catch (e) {
            console.log(e);
        }
    };

    const handleAddToCart = (product) => {
        addItemToCart({
            id: product.line_items[0]?.item_id,
            name: product.line_items[0]?.item_name,
            price: product.line_items[0]?.item_price,
            quantity: 1,
            front_image: product.line_items[0]?.item_image,
            item_total: product.line_items[0]?.item_price * 1,
        })
        toast.success('Product Added to Cart!')
    }


    return (
        <>

        <ToastContainer />
        
        <Box sx={{ p: 4 }}>
            {/* Empty Favourites Message */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
                {Array.isArray(userFavourites) && userFavourites.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            position: 'fixed',
                            top: 0,
                            left: { xs: 0, md: 120 },
                            width: '100vw',
                            zIndex: 1000,
                        }}
                    >
                        <Box sx={{ p: 10, background: '', borderRadius: '10px' }}>
                            <FavoriteIcon fontSize="large" sx={{ fontSize: '100px', color: 'lightgrey', justifyContent: 'center', alignItems: 'center', display: 'flex', margin: 'auto' }} />
                            <Typography color="textSecondary" sx={{ mt: 2, textAlign: 'center', fontSize: '1.2rem', fontWeight: '500' }}>
                                You have no favourite items.
                            </Typography>
                            <Button
                                fullWidth
                                sx={{
                                    margin: '20px 0',
                                    color: '#fff',
                                    backgroundColor: '#9c27b0',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    '&:hover': {
                                        backgroundColor: '#9c27c9',
                                    },
                                }}
                            >
                                <Link style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }} to='/products'>
                                    Start Shopping
                                </Link>
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    Array.isArray(userFavourites) && userFavourites.map((product) => (
                        <Card
                            key={product._id}
                            sx={{
                                width: 350,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                position: 'relative',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
                                },
                                backgroundColor: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            {/* Product Image */}
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.line_items[0]?.item_image || 'fallback-image-url.jpg'}
                                alt={product.line_items[0]?.item_name || 'Product'}
                                sx={{ objectFit: 'contain' }}
                            />
                            <CardContent sx={{ padding: '16px' }}>
                                {/* Product Name */}
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {product.line_items[0]?.item_name || 'Unknown Product'}
                                </Typography>

                                {/* Price */}
                                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    ${product.line_items[0]?.item_price}
                                </Typography>

                                {/* Product Details */}
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    {product.description || 'No description available.'}
                                </Typography>

                                {/* Product Tags */}
                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                    {product.tags?.map((tag, idx) => (
                                        <Chip key={idx} label={tag} size="small" color="primary" />
                                    ))}
                                </Stack>

                                {/* Buttons */}
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {/* Remove from Favourites Button */}
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRemoveFromFavourites(product._id)}
                                        startIcon={<FavoriteIcon />}
                                        sx={{
                                            borderRadius: '5px',
                                            padding: '10px',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: '#ff5252',
                                                color: '#fff',
                                            },
                                        }}
                                    >
                                        Remove
                                    </Button>

                                    {/* Add to Cart Button */}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleAddToCart(product)}
                                        startIcon={<ShoppingCartIcon />}
                                        sx={{
                                            borderRadius: '5px',
                                            padding: '10px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                </Box>
                                <Link to={`/product/${product.line_items[0].item_id}`}>
                                <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<VisibilityIcon />}
                                        sx={{
                                            borderRadius: '5px',
                                            padding: '10px',
                                            fontWeight: 'bold',
                                            marginTop:'10px'
                                        }}
                                    >
                                        View Product & Ratings
                                    </Button>
                                    </Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Box>
        </>
    );
}

export default FavouritesPage;
