import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    Button,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { ArrowUpward, ArrowDownward, People, ShoppingCart, MonetizationOn, CheckCircle, Cancel, Timer, Replay } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthenticateContext';

function MainDash() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [cancelledOrders, setCancelledOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [avgOrderValue, setAvgOrderValue] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [returnRate, setReturnRate] = useState(0);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Set default to current month (1-12)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Set default to current year


    const { signout } = useAuth()




    // Year options from 2020 to the current year
    const yearOptions = Array.from({ length: 1}, (v, i) => {
        return {
            value: new Date().getFullYear() - i,
            label: (new Date().getFullYear() - i)
        };
    });

    // Month options
    const months = Array.from({ length: 12 }, (v, i) => {
        return {
            value: i + 1,
            label: new Date(0, i).toLocaleString('default', { month: 'long' }) // Get month name
        };
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get('/api/all-users');
                const ordersResponse = await axios.get('/api/all-orders');
                const productsResponse = await axios.get('/api/products');

                // Filter users and orders by selected month and year
                const filteredUsers = usersResponse.data.filter(user => {
                    const createdAt = new Date(user.joined);
                    return createdAt.getMonth() + 1 === selectedMonth && createdAt.getFullYear() === selectedYear; // Month is zero-based
                });

                const filteredOrders = ordersResponse.data.filter(order => {
                    const orderDate = new Date(order.order_date);
                    return orderDate.getMonth() + 1 === selectedMonth && orderDate.getFullYear() === selectedYear; // Month is zero-based
                });

                const totalUsers = filteredUsers.length;
                const totalOrders = filteredOrders.length;
                const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.total_price, 0);
                const completedOrders = filteredOrders.filter(order => order.order_status === 'delivered').length;
                const cancelledOrders = filteredOrders.filter(order => order.order_status === 'cancelled').length;
                const returnedOrders = filteredOrders.filter(order => order.order_status === 'returned').length;



                setTotalUsers(totalUsers);
                setActiveUsers(activeUsers);
                setTotalOrders(totalOrders);
                setTotalRevenue(totalRevenue);
                setAvgOrderValue(totalOrders ? totalRevenue / totalOrders : 0);
                setCancelledOrders(cancelledOrders);
                setTotalProducts(productsResponse.data.length);
                setCompletedOrders(completedOrders);
                setReturnRate((returnedOrders / totalOrders) * 100);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMonth, selectedYear]); // Fetch data when selectedMonth or selectedYear changes

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const getIcon = (value, goodTrend) => (
        <IconButton>
            {value >= goodTrend ? <ArrowUpward sx={{ color: 'green' }} /> : <ArrowDownward sx={{ color: 'red' }} />}
        </IconButton>
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Year and Month Selectors */}
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Month</InputLabel>
                        <Select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            label="Month"
                        >
                            {months.map((month) => (
                                <MenuItem key={month.value} value={month.value}>
                                    {month.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            label="Year"
                        >
                            {yearOptions.map((year) => (
                                <MenuItem key={year.value} value={year.value}>
                                    {year.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Total Users */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">Total Users</Typography>
                        <People fontSize="large" sx={{ fontSize: 60 }} />
                        <Typography variant="h5">{totalUsers}</Typography>
                    </Paper>
                </Grid>

                {/* Active Users */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">New Users (Last 30 Days)</Typography>
                        <People fontSize="large" sx={{ fontSize: 60 }} />
                        <Typography variant="h5">{activeUsers}</Typography>
                        {getIcon(activeUsers, 100)} {/* Example: Threshold for good is 100 */}
                    </Paper>
                </Grid>

                {/* Total Orders */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">Total Orders</Typography>
                        <ShoppingCart fontSize="large" sx={{ fontSize: 60 }} />
                        <Typography variant="h5">{totalOrders}</Typography>
                    </Paper>
                </Grid>

                {/* Cancelled Orders */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">Cancelled Orders</Typography>
                        <Cancel fontSize="large" sx={{ fontSize: 60 }} />
                        <Typography variant="h5">{cancelledOrders}</Typography>
                        {getIcon(cancelledOrders, 3)} {/* Example: Threshold for good is < 20 */}
                    </Paper>
                </Grid>

                {/* Total Revenue */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">Total Revenue</Typography>
                        <MonetizationOn fontSize="large" sx={{ fontSize: 60 }} />
                        <Typography variant="h5">${totalRevenue.toFixed(2)}</Typography>
                        {getIcon(totalRevenue, 400)}
                    </Paper>
                </Grid>

                {/* Average Order Value */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">Average Order Value</Typography>
                        <MonetizationOn fontSize="large" sx={{ fontSize: 60 }} />
                        <Typography variant="h5">${avgOrderValue.toFixed(2)}</Typography>
                        {getIcon(avgOrderValue, 30)}
                    </Paper>
                </Grid>

                {/* Total Products */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">Total Products</Typography>
                        <ShoppingCart fontSize="large" sx={{ fontSize: 60 }} />
                        <Typography variant="h5">{totalProducts}</Typography>
                    </Paper>
                </Grid>

                {/* Return Rate */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">Return Rate</Typography>
                        <Replay fontSize="large" sx={{ fontSize: 60 }} />
                        <Typography variant="h5">{(returnRate ? returnRate.toFixed(2) + '%' : 'N/A')}</Typography>
                        {getIcon(returnRate, 0)} {/* Example: Threshold for good is < 5% */}
                    </Paper>
                </Grid>

                {/* Completed Orders */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">Completed Orders</Typography>
                        <CheckCircle fontSize="large" sx={{ fontSize: 60 }} />
                        <Typography variant="h5">{completedOrders}</Typography>
                    </Paper>
                </Grid>

                {/* Links Section */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Quick Links</Typography>
                        <Button href="/home" variant="outlined" sx={{ m: 1 }}>
                            Home
                        </Button>
                        <Button href="/" variant="outlined" sx={{ m: 1 }}>
                            Product Page
                        </Button>
                        <Button onClick={signout} variant="outlined" sx={{ m: 1 }}>
                            Logout
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default MainDash;
