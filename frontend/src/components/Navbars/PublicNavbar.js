import { AppBar, Toolbar, Typography, Box, Button, Badge, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';
import footerImg from '../styles/background.png'
import Logo from '../styles/cointology-logo.png'

function PublicNavbar() {
    const { getTotalQuantity, cartItems } = useCart();
    const [quantity, setQuantity] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Handle Drawer Toggle
    const toggleDrawer = (open) => () => {
        setIsDrawerOpen(open);
    };

    useEffect(() => {
        setQuantity(getTotalQuantity());
    }, [cartItems]);

    // List for Drawer (Mobile Menu)
    const drawerList = (
        <Box sx={{ width: 250, height:'100%', background:`#282828`}} onClick={toggleDrawer(false)}>
            <List>
                <ListItem sx={{color:'white'}} button component={Link} to="/">
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem sx={{color:'white'}}  button component={Link} to="/products">
                    <ListItemText primary="Products" />
                </ListItem>
                <ListItem sx={{color:'white'}}  button component={Link} to="/">
                    <ListItemText primary="About" />
                </ListItem>
                <ListItem  sx={{color:'white'}} button component={Link} to="/cart">
                    <ListItemText primary="Cart" />
                </ListItem>
                <ListItem  sx={{color:'white'}} button component={Link} to="/login">
                    <ListItemText primary="Login" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" sx={{ background: '#282828', width: '100%' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Left Side: Shop Name */}
                    <Box>
                     <img src={Logo} alt="Cointology Logo" style={{ width: '75px', height: 'auto', padding:'5px' }} />
                    </Box>

                    {/* Center: Navigation Links - Hidden on small screens */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' }, // Show only on medium and larger screens
                            justifyContent: 'center',
                            flexGrow: 1,
                        }}
                    >
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/products">Products</Button>
                    </Box>

                    {/* Right Side: Shopping Cart Icon, Login, and Hamburger Menu for small screens */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button color="inherit" component={Link} to="/cart">
                            <Badge badgeContent={quantity ? quantity : 0} color="secondary">
                                <ShoppingCart />
                            </Badge>
                        </Button>
                        <Button
                            sx={{
                                background: '#9c27b0',
                                color: 'white',
                                display: { xs: 'none', md: 'inline-flex' }, // Hide login button on small screens
                            }}
                            component={Link} to="/login"
                        >
                            Login
                        </Button>

                        {/* Hamburger Menu for small screens */}
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ display: { xs: 'inline-flex', md: 'none' } }} // Show only on small screens
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer for Mobile Menu */}
            <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
                {drawerList}
            </Drawer>
        </>
    );
}

export default PublicNavbar;
