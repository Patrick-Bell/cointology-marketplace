import { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
    Typography,
    Toolbar,
    AppBar,
    Menu,
    MenuItem,
    Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthenticateContext'
import { motion } from 'framer-motion';

function UserSideBar({ setActiveSection, activeSection }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu

    const { signout } = useAuth()

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Navigation items for the sidebar
    const navItems = [
        { text: 'Home', icon: <ArrowBackIcon />, section: 'back' },
        { text: 'Dashboard', icon: <DashboardIcon />, section: 'dashboard' },
        { text: 'Orders', icon: <ListAltIcon />, section: 'orders' },
        { text: 'Items to Review', icon: <RateReviewIcon />, section: 'review' },
        { text: 'Track Order', icon: <LocalShippingIcon />, section: 'track-package' },
        { text: 'My Favourites', icon: <FavoriteIcon />, section: 'favourites' },
        { text: 'Profile', icon: <AccountCircleIcon />, section: 'profile' },
        { text: 'Settings', icon: <SettingsIcon />, section: 'settings' },
    ];

    const drawerWidth = 240;

    const drawer = (
        <Box sx={{ width: drawerWidth, backgroundColor: '#fafafa', height: '100%', p: 2 }}>
           
            <Box>
            {navItems.map((item) => (
                <ListItem 
                    button 
                    key={item.text} 
                    component={item.section === 'back' ? Link : 'div'}  // Use Link for the 'Back' section
                    to={item.section === 'back' ? '/' : ''}  // Set the destination for 'Back'
                    onClick={() => setActiveSection(item.section)}
                    sx={{
                        backgroundColor: activeSection === item.section ? '#9c27b0' : 'transparent',
                        color: activeSection === item.section ? '#fff' : '#9c27b0',
                        borderRadius: '8px',
                        cursor:'pointer',
                        my: 1,
                        '&:hover': {
                            backgroundColor: '#9c27b0',
                            color: '#fff',
                            transition: 'all 0.3s ease',
                            '& .MuiListItemIcon-root': {
                                color: '#fff',
                            }
                        }
                    }}
                >
                    <ListItemIcon sx={{ color: activeSection === item.section ? '#fff' : '#9c27b0' }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItem>
            ))}

            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar for mobile menu button */}
            <AppBar
                position="fixed"
                sx={{ 
                    width: { md: `calc(100% - ${drawerWidth}px)` }, 
                    ml: { md: `${drawerWidth}px` }, 
                    backgroundColor: '#fff',
                    boxShadow: 'none',
                    borderBottom: '1px solid #e0e0e0',
                }}
            >
                <Toolbar sx={{ minHeight: '70px', display: 'flex', justifyContent: 'space-between', p: 1 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 3, display: { md: 'none' }, color: '#9c27b0' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                        Dashboard
                    </Typography>
                    <IconButton onClick={handleMenuClick}>
                        <Avatar sx={{ bgcolor: '#9c27b0' }}></Avatar> 
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <Link className='nav' to='/'><MenuItem onClick={handleClose}>Home</MenuItem></Link>
                        <Link className='nav' to='/products'><MenuItem onClick={handleClose}>Shop</MenuItem></Link>
                        <Link className='nav' to='/cart'><MenuItem onClick={handleClose}>Cart</MenuItem></Link>
                        <MenuItem onClick={signout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Drawer for mobile and desktop */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="user navigation"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#fafafa', borderRight: 'none' },
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#fafafa', borderRight: 'none' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}

export default UserSideBar;
