import { Box, Typography, Grid, Card, CardContent, Button, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthenticateContext';
import { useCart } from '../context/CartContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';


function Dashboard({ setActiveSection }) {
    const { user } = useAuth();  // User context for displaying user info
    const { getTotalQuantity } = useCart()
    const [orderData, setOrderData] = useState([]);
    const [lastMonthOrder, setLastMonthOrder] = useState(0)
    const [ordersReview, setOrdersReview] = useState(null)
    const [favs, setFavs] = useState(0)
    const [totalOrders, setTotalOrders] = useState(0)
    const [joined, setJoined] = useState()

    const quantity = getTotalQuantity()
    console.log('here is the user', user)

    const fetchUser = async () => {
        try {
            const response = await axios.get(`/api/user/${user.id}`)
            console.log(response.data)
            setJoined(response.data.joined)
        }catch(e) {
            console.log(e)
        }
    }


    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders-from-last-6-months');
            const orders = response.data;
    
            // Get today's date and the date from 6 months ago
            const today = new Date();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(today.getMonth() - 5); // Start counting from five months ago to include the current month
    
            // Create an object to store orders grouped by month-year
            const sortByMonth = {};
            
            // Create an array of all months in the last 6 months, including the current month
            const months = [];
            for (let m = 0; m < 6; m++) {
                const monthDate = new Date(sixMonthsAgo);
                monthDate.setMonth(monthDate.getMonth() + m);
                const monthName = monthDate.toLocaleString('default', { month: 'long' });
                const year = monthDate.getFullYear();
                const key = `${monthName}-${year}`;
                months.push(key);
                sortByMonth[key] = 0; // Initialize the count for each month to 0
            }
    
            // Loop through the orders and count them
            orders.forEach(order => {
                const date = new Date(order.order_date);
                const monthName = date.toLocaleString('default', { month: 'long' });
                const year = date.getFullYear();
                const key = `${monthName}-${year}`;
    
                // Check if the order falls within the last 6 months
                    // Increment the count for the respective month
                    if (sortByMonth[key] !== undefined) {
                        sortByMonth[key] += 1; // Increase count for existing months
                    }
            });

            console.log(sortByMonth)
    
            // Convert the object to an array with month names and counts
            const sortedOrders = months.map(month => {
                return { month: month, orders: sortByMonth[month] } ; // Use the initialized counts
            });
    
            // Sort the orders by year and month in descending order
            sortedOrders.sort((a, b) => {
                const [monthA, yearA] = a.month.split('-');
                const [monthB, yearB] = b.month.split('-');
    
                const dateA = new Date(yearA, new Date(Date.parse(monthA + " 1")).getMonth());
                const dateB = new Date(yearB, new Date(Date.parse(monthB + " 1")).getMonth());
    
                return dateA - dateB; // Sort in descending order
            });
    
            // Set the state with the sorted orders for the chart
            setOrderData(sortedOrders); // Assuming you use React state for the chart data
    
        } catch (e) {
            console.log('Error fetching orders:', e);
        }
    };
    

    const fetchOrdersLastMonth = async () => {
        try {
            const response = await axios.get('/api/orders-from-last-1-month')
            const orders = response.data
            const lastMonth = orders.length
            setLastMonthOrder(lastMonth)

        }catch(e) {
            console.log(e)
        }
    }
    
    const findOrdersToReview = async () => {
        try {
            const response = await axios.get('/api/user-orders', { withCredentials: true });

            const orders = response.data

            const unreviewedLineItems = Array.isArray(orders) && orders.map(order => {
                // Filter line items where reviewed is false
                const unreviewedItems = order.line_items.filter(item => item.reviewed === false);
            
              })

            setOrdersReview(unreviewedLineItems.length)
        }catch(e) {
            console.log(e)
        }
    }

    const getFavourites = async () => {
        try {
            const response = await axios.get('/api/favourites')
            const favourites = response.data
            setFavs(favourites.length)
        }catch(e) {
            console.log(e)
        }
    }

    const fetchUserOrders = async () => {
        try {
            const response = await axios.get('/api/user-orders')
            const orders = response.data
            setTotalOrders(orders.length)

        }catch(e) {
            console.log(e)
        }
    }
    

    useEffect(() => {
        fetchOrders();
        fetchOrdersLastMonth()
        findOrdersToReview()
        getFavourites()
        fetchUserOrders()
        fetchUser()
    }, []);

    return (
        <Box>
            {/* Welcome Message */}
            <Typography variant="h4" gutterBottom>
                Welcome, {user?.name || "User"}!
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                Here’s your latest activity at a glance.
            </Typography>

            {/* Quick Summary Cards */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 2, borderRadius: '12px', boxShadow: 3 }}>
                        <CardContent>
                            <Avatar sx={{ bgcolor: '#3f51b5', mb: 2 }}>O</Avatar>
                            <Typography variant="h6">Recent Orders</Typography>
                            <Typography variant="body2" color="textSecondary">
                                You’ve placed <CountUp duration={10} end={lastMonthOrder} /> orders in the last month.
                            </Typography>
                            <Button onClick={() => setActiveSection('orders')} variant="contained" sx={{ mt: 2 }} fullWidth>
                                View Orders
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Other Cards... */}
                {/* Card for Pending Reviews */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 2, borderRadius: '12px', boxShadow: 3 }}>
                        <CardContent>
                            <Avatar sx={{ bgcolor: '#ff5722', mb: 2 }}>R</Avatar>
                            <Typography variant="h6">Pending Reviews</Typography>
                            <Typography variant="body2" color="textSecondary">
                                You have products from <CountUp duration={10} end={ordersReview} /> orders to review.
                            </Typography>
                            <Button onClick={() => setActiveSection('review')} variant="contained" sx={{ mt: 2 }} fullWidth>
                                Write a Review
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card for Favorites */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 2, borderRadius: '12px', boxShadow: 3 }}>
                        <CardContent>
                            <Avatar sx={{ bgcolor: '#009688', mb: 2 }}>F</Avatar>
                            <Typography variant="h6">Favorites</Typography>
                            <Typography variant="body2" color="textSecondary">
                                You’ve saved <CountUp duration={10} end={favs} /> favorite items.
                            </Typography>
                            <Button onClick={() => setActiveSection('favourites')} variant="contained" sx={{ mt: 2 }} fullWidth>
                                View Favorites
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Account Overview Section */}
            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" gutterBottom>
                    Account Overview
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2, borderRadius: '12px', boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6">Total Orders</Typography>
                                <Typography variant="body2">
                                    You have placed {totalOrders} orders in total.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card for Items in Cart */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2, borderRadius: '12px', boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6">Items in Cart</Typography>
                                <Typography variant="body2">
                                    You currently have {quantity} items in your cart.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card for Wishlist Items */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2, borderRadius: '12px', boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6">Member</Typography>
                                <Typography variant="body2">
                                    You have been a memeber since {new Date (joined).toLocaleDateString('en-GB')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                </Grid>
            </Box>

            {/* Order Trend Chart */}
            <Box sx={{ mt: 5 }}>
    <Typography variant="h5" gutterBottom>
        Order Trends (Last 6 Months)
    </Typography>
    <Card sx={{ p: 3, borderRadius: '12px', boxShadow: 3, backgroundColor: '#f9f9f9' }}>
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={orderData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
            <XAxis 
                dataKey="month" 
                tick={{ fill: 'black', fontSize: 12, dy: 10 }} // Change tick color to black
                
            />
            <YAxis 
                tick={{ fill: 'black', fontSize: 12 }} // Change tick color to black

            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} 
                itemStyle={{ color: '#333' }} 
            />
            <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#9c27b0" 
                strokeWidth={3} 
                dot={{ stroke: '#3f51b5', strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 10, fill: 'black' }} 
            />
        </LineChart>
    </ResponsiveContainer>
</Card>

</Box>

        </Box>
    );
}

export default Dashboard;
