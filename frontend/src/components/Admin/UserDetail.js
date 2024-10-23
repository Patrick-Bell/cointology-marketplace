import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  IconButton,
  Box,
  Button,
  Divider
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserDetail = () => {

    const { id } = useParams();
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/user/${id}`);
                setUser(response.data);
                console.log('user information', response.data)
            } catch (e) {
                console.error("Error fetching user:", e);
            }
        };

        // Call the function immediately after defining it
        fetchUser();
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    // Calculating total amount spent by the user
    const totalAmountSpent = user.orders.reduce((acc, order) => acc + order.total_price, 0);
    const cashPayment = user.orders.filter(order => order.order_type === 'cash').length
    const cardPayment = user.orders.filter(order => order.order_type === 'card').length
    const latestOrder = [...user.orders].reverse()[0];

    return (
        <Box sx={{ padding: "20px", marginTop: "64px" }}>
            {/* User Info Section */}
            <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Account Details</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1">Role: {user.role}</Typography>
                            <Typography variant="subtitle1">Date Joined: {new Date(user.joined).toLocaleString('en-GB')}</Typography>
                            <Typography variant="subtitle1">Last Login: {new Date(user.last_login).toLocaleString('en-GB')}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Personal Contact Details */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Personal Contact Details</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1">Email: {user.email}</Typography>
                            <Typography variant="subtitle1">Phone: {user.phone_number}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Shipping Address */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Shipping Address</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1">Address Line 1: {user.address_line_1}</Typography>
                            <Typography variant="subtitle1">Post Code: {user.post_code}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Total Amount Spent */}

                <Grid item xs={12} md={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Order Information</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 10px'}}>
                            <Typography variant="subtitle1">Total Spent</Typography>
                            <Typography>£{totalAmountSpent}</Typography>
                            </Typography>
                            <Typography sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 10px'}}>
                            <Typography variant="subtitle1">Cash Payments</Typography>
                            <Typography>{cashPayment}</Typography>
                            </Typography>
                            <Typography sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 10px'}}>
                            <Typography variant="subtitle1">Card Payments</Typography>
                            <Typography>{cardPayment}</Typography>
                            </Typography>
                            <Typography sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 10px'}}>
                            <Typography variant="subtitle1">Last Order</Typography>
                            <Typography>{ new Date(latestOrder.order_date).toLocaleDateString('en-GB')}</Typography>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
            </Grid>
            

            {/* Statistics Section */}
            <Grid container spacing={4} sx={{ mt: 0 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <IconButton>
                                <FavoriteIcon color="primary" sx={{ fontSize: 40 }} />
                            </IconButton>
                            <Typography variant="h6">{user.favourites.length} Favourites</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <IconButton>
                                <ShoppingCartIcon color="primary" sx={{ fontSize: 40 }} />
                            </IconButton>
                            <Typography variant="h6">{user.orders.length} Orders</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <IconButton>
                                <RateReviewIcon color="primary" sx={{ fontSize: 40 }} />
                            </IconButton>
                            <Typography variant="h6">{user.reviews.length} Reviews</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* User Actions */}
        </Box>
    );
};

export default UserDetail;
