import { 
    Box, 
    Typography, 
    CircularProgress, 
    Snackbar, 
    List, 
    ListItem, 
    ListItemAvatar, 
    Avatar, 
    Card, 
    CardContent, 
    CardActions, 
    TextField, 
    Button, 
    Rating,
    Paper
} from "@mui/material";
import axios from 'axios';
import { useEffect, useState } from "react";
import ArticleIcon from '@mui/icons-material/Article';
import Article from "@mui/icons-material/Article";

function ProductReview() {
    const [orders, setOrders] = useState([]); // State to store fetched orders
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error
    const [images, setImages] = useState([]); // State to store fetched images for all items
    const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar
    const [reviews, setReviews] = useState({}); // State to store reviews for each product
    const [submittedReviews, setSubmittedReviews] = useState(new Set()); // Track submitted reviews
    const [productsToReview, setProductsToReview] = useState([])
    const [itemsNeedReviewing, setItemsNeedReviewing] = useState(0)

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await axios.get('/api/user-orders', { withCredentials: true });
                console.log('orders', response.data);
                setOrders(response.data);
                const orders = response.data
                const unreviewedLineItems = Array.isArray(orders) && orders.map(order => {
                    // Filter line items where reviewed is false
                    const unreviewedItems = order.line_items.filter(item => item.reviewed === false);
                  
                    // Only return the order if there are unreviewed items
                    return unreviewedItems.length > 0 ? { ...order, line_items: unreviewedItems } : null;
                  }).filter(order => order !== null); // Remove null values
                  
                  console.log('Unreviewed line items:', unreviewedLineItems);
                  setProductsToReview(unreviewedLineItems);
                  setItemsNeedReviewing(unreviewedLineItems.length)
                  console.log(unreviewedLineItems.length)
                  
                  

                await fetchImages(response.data); // Fetch images after setting orders
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Failed to fetch orders.');
                setOpenSnackbar(true); // Open Snackbar to display error
            } finally {
                setLoading(false); // Set loading to false once the fetch is complete
            }
        };

        const fetchImages = async (orders) => {
            const imagePromises = orders.flatMap(order =>
                order.line_items.map(item => {
                    return findImage(item.name).then(imageUrl => ({
                        name: item.name,
                        imageUrl
                    })); // Return a promise for each item
                })
            );

            const resolvedImages = await Promise.all(imagePromises);
            setImages(resolvedImages); // Set images directly as an array
            console.log(resolvedImages);
        };

        fetchUserOrders();
    }, []); // Empty dependency array means this runs once on mount

    const findImage = async (name) => {
        try {
            const response = await axios.get(`/api/get-image/${name}`);
            return response.data; // Return the image URL
        } catch (e) {
            console.log(`Error fetching image for ${name}:`, e);
            return null; // Return null if there's an error
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false); // Close the Snackbar
    };

    const handleReviewChange = (itemId, field, value) => {
        setReviews((prevReviews) => ({
            ...prevReviews,
            [itemId]: {
                ...prevReviews[itemId],
                [field]: value
            }
        }));
    };

    const handleSubmitReview = async (itemId) => {
        const components = itemId.split('-'); // Split by the hyphen
        const name = components[0]; // First part: "Football"
        const itemLineId = components[1]; // Second part: "6703fbc95aeb64010e403b20"
        const orderId = components[2]; // Third part: "6703d5a5731414e743fc57cb"

        const reviewData = {
            rating: reviews[itemId]?.rating,
            subject: reviews[itemId]?.subject,
            message: reviews[itemId]?.message
        };

        try {
            const response = await axios.post(`/api/submit-review/${name}/${orderId}/${itemLineId}`, {reviewData});
            
            // Add this itemId to submitted reviews set
            setSubmittedReviews(prev => new Set(prev).add(itemId));
            // Clear the input fields after submission
            setReviews(prev => ({ ...prev, [itemId]: {} }));

        } catch (e) {
            console.error('Error submitting review:', e);
            setError('Failed to submit review.');
            setOpenSnackbar(true); // Open Snackbar to display error
        }
    };

    return (
        <Box>    
            {loading ? (
            <Box fullWidth
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh', // Full height to cover the entire screen
                    position: 'fixed', // Fix the loader in the center of the screen
                    top: 0,
                    left: { xs: 0, md: 120 }, // 0px for small screens and 120px for medium and larger screens
                    width: '100vw', // Full width of the screen
                    zIndex: 1000, // Ensure it stays on top of other elements
                }}
            >
                <Box sx={{p: 10, background: 'lightgrey', borderRadius:'10px'}}>
                <CircularProgress sx={{padding: '5px', color:'black'}} />
                </Box>
            </Box>
            ) : error ? (
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={error}
                /> // Show error message
            ) : (
                <>
                    {productsToReview.length === 0? (
                         <Box
                         sx={{
                             display: 'flex',
                             justifyContent: 'center',
                             alignItems: 'center',
                             height: '100vh', // Full height to cover the entire screen
                             position: 'fixed', // Fix the loader in the center of the screen
                             top: 0,
                             textAlign:'center',
                             left: { xs: 0, md: 120 }, // 0px for small screens and 120px for medium and larger screens
                             width: '100vw', // Full width of the screen
                             zIndex: 1000, // Ensure it stays on top of other elements
                             color:'lightgrey'
                         }}
                     >
                         <Box sx={{ borderRadius:'10px'}}>
                         <ArticleIcon fontSize="large" sx={{fontSize:100}} />
                         <Typography variant="h6" color="textSecondary" align="center">No Reviews Pending...</Typography>                        
                          </Box>
                     </Box>
                    ) : (
                        <>
                        
                        <Box fullWidth>
                            <Paper sx={{padding: '10px'}}>
                                <Typography variant='h5'>Manage Feedback</Typography>
                                <Typography variant='caption'>Gaining your feedback is a crucial part of our business, to improve and make sure we can make everyone happy! We really appreciate
                                    the time you take to fill out these reviews. As a reward, you will be awarded with points. In the future we will develop a system where you can spend these points
                                    on coins, or free deliveries. If your review is not 5 stars, please reach out before submitting your review so we can help sort out the problem. Thanks!
                                </Typography><br></br><br></br>
                                <Typography variant="caption">You currently have products from <strong>{itemsNeedReviewing}</strong> orders to review.</Typography>
                            </Paper>
                        </Box>

                        <List>
                            {productsToReview.flatMap(order =>
                                order.line_items.map((item, index) => {
                                    // Find the corresponding image for each item
                                    const imageEntry = images.find(img => img.name === item.name);
                                    const itemId = `${item.name}-${item._id}-${order._id}`; // Use the line item's ID for tracking
                                    
                                    // Check if the review has already been submitted for this item
                                    const hasSubmitted = submittedReviews.has(itemId);
    
                                    return (
                                        <ListItem fullWidth key={itemId} sx={{p: 0}}> 
                                            <Card variant="outlined" fullWidth sx={{ width: '100%'}}>
                                                <CardContent>
                                                    <Box display="flex" alignItems="center">
                                                        <ListItemAvatar>
                                                            <Avatar
                                                                src={imageEntry ? imageEntry.imageUrl : "https://via.placeholder.com/50"} 
                                                                alt={item.name}
                                                            />
                                                        </ListItemAvatar>
                                                        <Typography variant="h6" sx={{ marginLeft: 2 }}>
                                                            {item.name}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        From Order ID: {order._id} - Price: £{(item.unit_price).toFixed(2)}
                                                    </Typography>
    
                                                    {/* Render input fields only if the review hasn't been submitted */}
                                                    {!hasSubmitted ? (
                                                        <>
                                                            <Rating 
                                                                name={`rating-${itemId}`} 
                                                                value={reviews[itemId]?.rating || 5} 
                                                                onChange={(event, newValue) => handleReviewChange(itemId, 'rating', newValue)} 
                                                                sx={{ margin: '10px 0' }}
                                                            />
                                                            <TextField 
                                                                fullWidth 
                                                                variant="outlined" 
                                                                placeholder="Subject Header" 
                                                                value={reviews[itemId]?.subject || ''} 
                                                                onChange={(e) => handleReviewChange(itemId, 'subject', e.target.value)} 
                                                                sx={{ marginBottom: 1 }}
                                                            />
                                                            <TextField 
                                                                fullWidth 
                                                                variant="outlined" 
                                                                placeholder="Write your review..." 
                                                                multiline 
                                                                rows={4} 
                                                                value={reviews[itemId]?.message || ''} 
                                                                onChange={(e) => handleReviewChange(itemId, 'message', e.target.value)} 
                                                            />
                                                        </>
                                                    ) : (
                                                        <Typography variant="body2" color="text.success">
                                                            Thank you for your review!
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                                {!hasSubmitted && (
                                                    <CardActions>
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary" 
                                                            onClick={() => handleSubmitReview(itemId)}
                                                            disabled={!reviews[itemId]?.subject || !reviews[itemId]?.message} // Disable if fields are empty
                                                        >
                                                            Submit Review
                                                        </Button>
                                                    </CardActions>
                                                )}
                                            </Card>
                                        </ListItem>
                                    );
                                })
                            )}
                        </List>
                        </>
                    )}
                </>
            )}
        </Box>
    );
    
}

export default ProductReview;
