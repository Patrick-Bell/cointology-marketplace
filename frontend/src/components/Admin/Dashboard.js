import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import Sidebar from './Sidebar';
import AddProductForm from './AddProductForm';
import Inventory from './Inventory';
import Order from './Order'
import '../styles/Dashboard.css'; // Import your CSS file
import Users from './Users';
import MainDash from './MainDash';
import Reports from './Reports';
import GenerateReport from './GenerateReport'


// Main Admin Dashboard Component
const AdminDashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentView, setCurrentView] = useState('mainDash');
    const [product, setProduct] = useState({
        name: '',
        price: '',
        other_price: '',
        stock: '',
        frontImage: '',
        backImage: '',
        tags: [],
        category: ''
    });
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setProducts(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchProducts();
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev); // Toggle mobile drawer
    };

    const handleMenuClick = (view) => {
        setCurrentView(view);
        if (mobileOpen) handleDrawerToggle(); // Close drawer on mobile after selection
    };

    const renderContent = () => {
        switch (currentView) {
            case 'add-product':
                return (
                    <AddProductForm /> 
                )
            case 'inventory':
                return (
                    <Inventory products={products} handleDelete={async (id) => {
                        console.log(`Deleting product with id: ${id}`);
                        try {
                            await axios.delete(`/api/delete-product/${id}`);
                            setProducts(products.filter(product => product.id !== id));
                        } catch (err) {
                            console.log(err);
                        }
                    }} />
                );
            case 'orders':
                return <Order />
            case 'users':
                return <Users />
            case 'mainDash': 
            return <MainDash />
            case 'reports':
            return <Reports />
            case 'gen-report':
            return <GenerateReport />
            default:
                return <Typography variant="h6">Please select an option from the sidebar.</Typography>;
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{ mr: 2, display: { md: 'none' } }} // Show only on mobile
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Admin Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: '240px',
                    },
                }}
            >
                <Sidebar
                    handleDrawerToggle={handleDrawerToggle}
                    handleMenuClick={handleMenuClick}
                />
            </Drawer>

            {/* Main Content Area with Flexbox Layout */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    bgcolor: 'background.default',
                    mt: 8,
                }}
            >
                {/* Sidebar for larger screens */}
                <Box className="sidebar" sx={{ width: '240px', flexShrink: 0, borderRight: '1px solid #ddd' }}>
                    <Sidebar
                        handleDrawerToggle={handleDrawerToggle}
                        handleMenuClick={handleMenuClick}
                    />
                </Box>

                {/* Content Area */}
                <Box
                    className="main-content"
                    sx={{
                        flexGrow: 1,
                        p: 2,
                        bgcolor: 'background.paper',
                        minHeight: '100vh', // Full height content
                    }}
                >
                    {renderContent()}
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
