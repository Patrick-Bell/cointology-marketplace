import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from '@mui/material';
import { Person, Home, Receipt } from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function OrderDetail() {
    const [order, setOrder] = useState(null);
    const [images, setImages] = useState({});
    const { id } = useParams(); // Retrieve order id from URL

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`/api/orders/${id}`); // Replace with your API endpoint
                console.log('order', response.data);
                setOrder(response.data);
                await fetchImages(response.data.line_items); // Fetch images after setting order
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        const fetchImages = async (lineItems) => {
            if (lineItems && Array.isArray(lineItems)) {
                const imagePromises = lineItems.map(async (item) => {
                    return await findImage(item.name);
                });

                const resolvedImages = await Promise.all(imagePromises);
                const imageMap = resolvedImages.reduce((acc, image, index) => {
                    acc[lineItems[index].name] = image || null; // Map names to images
                    return acc;
                }, {});

                setImages(imageMap);
            }
        };

        fetchOrderDetails();
    }, [id]); // No need to include order in dependencies

    const findImage = async (name) => {
        try {
            const response = await axios.get(`/api/get-image/${name}`);
            return response.data; // Return the image URL
        } catch (e) {
            console.log(`Error fetching image for ${name}:`, e);
            return null; // Return null if there's an error
        }
    };

    if (!order) {
        return <Typography variant="h6">Loading...</Typography>; // Placeholder while data is being fetched
    }

    const { name, email, phone, line_items, total_price, order_status, order_type, order_date, order_message, shipping_address, estimated_delivery, shipping_method, shipping } = order;

    return (
        <Box sx={{ padding: 2, marginTop: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ width: '100%', maxWidth: '1200px', padding: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Order Details
                </Typography>

                <Divider sx={{ marginBottom: 2 }} />

                <Grid container spacing={3}>
                    {/* Customer Information */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Person sx={{ marginRight: 1 }} /> Customer Information
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="Name" secondary={name} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Email" secondary={email} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Phone" secondary={phone} />
                            </ListItem>
                        </List>
                    </Grid>

                    {/* Shipping Information */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Home sx={{ marginRight: 1 }} /> Shipping Information
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="Address" secondary={`${shipping_address.address_line_1}, ${shipping_address.city}, ${shipping_address.address_line_2}, ${shipping_address.postal_code}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Shipping Method" secondary={shipping_method.toUpperCase() + ' - ' + '£'+(order.order_type === 'card' ? (order.shipping / 100).toFixed(2) : order.shipping)} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Estimated Delivery" secondary={estimated_delivery ? (new Date(estimated_delivery.earliestDate).toLocaleDateString()) + ' - ' + (new Date(estimated_delivery.latestDate).toLocaleDateString()): 'N/A'} />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>

                {/* Divider Between Customer and Shipping Information */}
                <Divider sx={{ margin: '16px 0' }} />

                {/* Order Summary */}
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Receipt sx={{ marginRight: 1 }} /> Order Summary
                </Typography>
                <List>
                    {Array.isArray(line_items) && line_items.map((item, index) => (
                        <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* Image of the product */}
                            <ListItemAvatar>
                                <Avatar
                                    src={images[item.name] || '/path/to/placeholder.jpg'} // Use fetched image or placeholder
                                    alt={item.name}
                                    sx={{ width: 56, height: 56, marginRight: 2 }}
                                />
                            </ListItemAvatar>
                            {/* Product name, price, and quantity */}
                            <ListItemText
                                primary={item.name}
                                secondary={`Unit Price: $${item.unit_price}, Quantity: ${item.quantity}`}
                            />
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ margin: '16px 0' }} />

                <Grid container spacing={2}>
                    {/* Order Type and Status */}
                    <Grid item xs={12} md={6}>
                        <Chip label={`Order Type: ${order_type}`} sx={{ marginBottom: 1 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Chip label={`Order Status: ${order_status}`} sx={{ marginBottom: 1 }} />
                    </Grid>
                </Grid>

                <Divider sx={{ margin: '16px 0' }} />

                {/* Total Price and Order Date */}
                <Typography variant="h6">Total Price: ${total_price}</Typography>
                <Typography variant="body1" color="text.secondary">Order Date: {order_date ? new Date(order_date).toLocaleString() : 'N/A'}</Typography>
                <Typography variant="body1" color="text.secondary">Order Message: {order_message}</Typography>
            </Paper>
        </Box>
    );
}

export default OrderDetail;
