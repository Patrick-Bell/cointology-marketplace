import axios from "axios";
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    CircularProgress,
    Snackbar,
    SnackbarContent
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PaidIcon from '@mui/icons-material/Paid';
import MessageIcon from '@mui/icons-material/Message';
import UserSideBar from "./UserSideBar";
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ScrollInView from '../animation/ScrollInView'

function UserOrders() {
    const [originalOrders, setOriginalOrders] = useState([]); // State to store the full set of orders
    const [orders, setOrders] = useState([]); // State to store user orders
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error
    const [images, setImages] = useState({}); // State to store fetched images
    const [expandedOrderId, setExpandedOrderId] = useState(null); // Track the currently expanded order
    const [activeButton, setActiveButton] = useState('all'); // State to track the active button
    const [toPay, setToPay] = useState(0)
    const [toShipped, setToShipped] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');



    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await axios.get('/api/user-orders', { withCredentials: true });
                console.log('orders', response.data);
                setOrders(response.data);
                setOriginalOrders(response.data)
                await fetchImages(response.data); // Fetch images after setting orders


                const filteredOrdersLength = response.data.filter(order => order.paid === 'not_paid').length;
                setToPay(filteredOrdersLength)

                const filteredOrdersShipped = response.data.filter(order => order.order_status === 'shipped').length
                setToShipped(filteredOrdersShipped)


            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Failed to fetch orders.');
            } finally {
                setLoading(false); // Set loading to false once the fetch is complete
            }
        };

        const fetchImages = async (orders) => {
            const lineItemNames = orders.flatMap(order => order.line_items.map(item => item.name));
            const uniqueNames = [...new Set(lineItemNames)]; // Remove duplicates
            
            const imagePromises = uniqueNames.map(async (name) => {
                const imageUrl = await findImage(name);
                return { name, imageUrl };
            });

            const resolvedImages = await Promise.all(imagePromises);
            const imageMap = resolvedImages.reduce((acc, { name, imageUrl }) => {
                acc[name] = imageUrl || null; // Map names to images
                return acc;
            }, {});

            setImages(imageMap);
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

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };
    

    const getShippingName = (shipping) => {
        if (shipping === 1.99) {
            return 'Standard (cash)';
        } else if (shipping === 0) {
            return 'Free';
        } else if (shipping === 500) {
            return 'Premium';
        } else if (shipping === 750) {
            return 'Next Day';
        } else {
            return 'No Shipping Available';
        }
    };

    const handlePayOrders = () => {
        const filteredOrders = originalOrders.filter(order => order.paid === 'not_paid');
        setOrders(filteredOrders); // Set filtered orders
        setActiveButton('to-pay')
    };

    // Filter for shipped orders
    const handleShippedOrders = () => {
        const filteredOrders = originalOrders.filter(order => order.order_status === 'shipped');
        setOrders(filteredOrders); // Set filtered orders
        setActiveButton('shipped')
    };

    const handleAllOrders = () => {
        setOrders(originalOrders);
        setActiveButton('all')
    };

    const handleProcessedOrders = () => {
        const filteredOrders = originalOrders.filter(order => order.order_status === 'delivered');
        setOrders(filteredOrders);
        setActiveButton('processed')
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
    
        const filteredOrders = originalOrders.filter(order => {
            const orderIdCheck = order.order_id.toLowerCase().includes(value.toLowerCase());
    
            // Check if any line item in the order matches the search value
            const productCheck = order.line_items.some(item => 
                item.name.toLowerCase().includes(value.toLowerCase())
            );
    
            return orderIdCheck || productCheck;
        });
    
        setOrders(filteredOrders);
    };

    const handleCopy = async (orderId) => {
        try {
            await navigator.clipboard.writeText(orderId);
            console.log('Copied to clipboard:', orderId);
            showSnackbar(  <Box sx={{ textAlign: 'center', display:'flex', padding: '10px', borderRadius: '4px'}}>
                Order Id copied to clipboard!
            </Box>)
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };
    
    

    if (loading) {
            <Box
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
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>; // Show error message
    }

    return (
        <>  

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={3000} // Snackbar will disappear after 3 seconds
                onClose={() => setSnackbarOpen(false)}
            >
                <SnackbarContent message={snackbarMessage} />
            </Snackbar>


            <Box fullWidth>
                <Paper>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto', width: '100%', whiteSpace: 'nowrap' }}>
                        <Box>
                            <ScrollInView direction='left'>
                            <Button variant={activeButton === 'all' ? 'outlined' : ''} sx={{fontWeight: activeButton === 'all' ? '900' : '' }} onClick={handleAllOrders}>View All</Button>
                            <Button variant={activeButton === 'to-pay' ? 'outlined' : ''} sx={{fontWeight: activeButton === 'to-pay' ? '900' : '' }} onClick={handlePayOrders}>To Pay ({toPay})</Button>
                            <Button variant={activeButton === 'shipped' ? 'outlined' : ''} sx={{fontWeight: activeButton === 'shipped' ? '900' : '' }} onClick={handleShippedOrders}>Shipped ({toShipped})</Button>
                            <Button variant={activeButton === 'processed' ? 'outlined' : ''} sx={{fontWeight: activeButton === 'processed' ? '900' : '' }} onClick={handleProcessedOrders}>Processed</Button>
                            </ScrollInView>
                        </Box>
                        <Box>
                            <Button disabled>Deleted Orders</Button>
                        </Box>
                    </Box>
                    <Box sx={{m: 2}}>
                        <TextField
                        sx={{margin: '5px 0 15px 0'}}
                        fullWidth
                        onChange={handleSearch}
                        value={searchQuery}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                            placeholder="Search Order Id, Product Name"
                        />
                    </Box>
                </Paper>
            </Box>

            <Box fullWidth>
                <Paper elevation={3} sx={{ p: 3 }}>
                    {orders.length === 0 ? ( // Check if there are no orders
                    <>
                    <Box
                    sx={{
                display: 'flex', // Enable flexbox
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                color:'lightgrey'
                            }}
                        >
            <ArticleIcon fontSize="large" sx={{ fontSize: 100 }} /> {/* Adjust the size here */}
        </Box>                        
        <Typography variant="h6" color="textSecondary" align="center">
                            No orders in this category.
                        </Typography>
                        </>
                    ) : (
                        orders.map(order => (
                            <ScrollInView direction='top'>
                            <Accordion
                                key={order._id}
                                sx={{ marginBottom: 2 }}
                                expanded={expandedOrderId === order._id} // Only expand if the order ID matches
                                onChange={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)} // Close if already open
                            >
                                <AccordionSummary
                                    expandIcon={<IconButton><ExpandMoreIcon /></IconButton>}
                                    aria-controls={`panel-${order._id}-content`}
                                    id={`panel-${order._id}-header`}
                                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                                >
                                    <Typography variant="h8">
                                        {new Date(order.order_date).toLocaleDateString('en-GB')} - <strong>£{order.total_price.toFixed(2)}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography sx={{ m: 1, display:'flex', alignItems:'center' }}>Order ID: <strong>{order.order_id}</strong> 
                                    <IconButton sx={{ marginLeft:'10px', cursor:'pointer'}}>
                                    <ContentCopyIcon fontSize="small" onClick={() => handleCopy(order.order_id)} />
                                    </IconButton>
                                     </Typography>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle1" sx={{ display: 'flex' }}>
                                                    <PersonIcon sx={{ m: '0 5px' }} /> User Details
                                                </Typography>
                                                <Typography sx={{ display: 'flex' }}><PersonIcon sx={{ m: '0 5px' }} /> Name: {order.name}</Typography>
                                                <Typography sx={{ display: 'flex' }}><EmailIcon sx={{ m: '0 5px' }} /> Email: {order.email}</Typography>
                                                <Typography sx={{ display: 'flex' }}><PhoneIcon sx={{ m: '0 5px' }} /> Phone: {order.phone}</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle1"></Typography>
                                                <Typography sx={{ display: 'flex' }}><HomeIcon sx={{ m: '0 5px' }} /> Address: {order.shipping_address.address_line_1}, {order.shipping_address.city}, {order.shipping_address.postal_code}, {order.shipping_address.country}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle1">
                                                    <ReceiptIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> Order Summary
                                                </Typography>
                                                <TableContainer component={Paper}>
                                                    <Table sx={{ textAlign: 'center' }}>
                                                        <TableHead>
                                                            <TableRow sx={{ textAlign: 'center' }}>
                                                                <TableCell>Product</TableCell>
                                                                <TableCell>Unit Price</TableCell>
                                                                <TableCell>Quantity</TableCell>
                                                                <TableCell>Price</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {order.line_items.map((item) => (
                                                                <TableRow key={item.id} sx={{ textAlign: 'center' }}>
                                                                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <img
                                                                            src={images[item.name]} // Use fetched image
                                                                            alt={item.name}
                                                                            style={{
                                                                                width: '50px',
                                                                                height: '50px',
                                                                                objectFit: 'cover',
                                                                                borderRadius: '5px'
                                                                            }}
                                                                        /> <Typography sx={{ m: '0 2.5px' }} >{item.name}</Typography>
                                                                    </TableCell>
                                                                    <TableCell>{item.unit_price}</TableCell>
                                                                    <TableCell>{item.quantity}</TableCell>
                                                                    <TableCell>£{(item.unit_price * item.quantity).toFixed(2)}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TableContainer component={Paper}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell></TableCell>
                                                                <TableCell sx={{ textAlign: 'center' }}>Shipping Method</TableCell>
                                                                <TableCell sx={{ textAlign: 'center' }}>Shipping Cost</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>Shipping</TableCell>
                                                                <TableCell sx={{ textAlign: 'center' }}>{getShippingName(order.shipping)}</TableCell>
                                                                <TableCell sx={{ textAlign: 'center' }}>£{(order.order_type === 'cash' ? order.shipping : (order.shipping / 100).toFixed(2))}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography sx={{ display: 'flex', alignItems: 'center' }}><CreditCardIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> Order Type: <Chip label={order.order_type}></Chip></Typography>
                                                <Typography sx={{ display: 'flex', alignItems: 'center' }}><PaidIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> Payment Status: <Chip label={order.paid}></Chip></Typography>
                                                <Typography sx={{ display: 'flex', alignItems: 'center' }}><MessageIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} /> Order Message: {order.order_message || 'N/A'}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                            </ScrollInView>
                        ))
                    )}
                </Paper>
            </Box>
        </>
    );
}

export default UserOrders;
