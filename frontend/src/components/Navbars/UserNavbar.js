import { AppBar, Toolbar, Typography, Box, Button, Badge, Tooltip, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthenticateContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../styles/cointology-logo.png'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RotateBounce from '../animation/RotateBounce';

function UserNavbar() {
    const { getTotalQuantity, cartItems } = useCart();
    const [quantity, setQuantity] = useState(0);
    const settings = [
        { icon: <PersonOutlineIcon/>,  name: 'Profile', path: '/my-dashboard' },
        { icon: <ShoppingCartIcon/>, name: 'Cart', path: '/cart' },
    ];

    const navigate = useNavigate()
    
    const [anchorElUser, setAnchorElUser] = useState(null);

    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            const response = axios.post('/api/logout')
            console.log(response.data)
            navigate('/')
            window.location.reload()

        }catch(e) {
            console.log(e)
        }
    }

    // Update quantity from the cart context
    useEffect(() => {
        const totalQuantity = getTotalQuantity();
        setQuantity(totalQuantity);
        console.log(totalQuantity);
    }, [cartItems]); // Re-run if cartItems change

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="fixed" sx={{background: '#282828'}}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Left Side: Shop Name */}
                <Box>
                     <img src={Logo} alt="Cointology Logo" style={{ width: '75px', height: 'auto', padding:'5px' }} />
                    </Box>

                {/* Center: Navigation Links */}
                <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/products">Products</Button>
                </Box>





                {/* Right Side: Shopping Cart Icon and Login */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button color="inherit" component={Link} to="/cart">
                        <Badge badgeContent={quantity ? quantity : 0} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </Button>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={user ? user.email : ''} src="/static/images/avatar/1.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting.name} onClick={handleCloseUserMenu} component={Link} to={setting.path}>
                                    <Typography sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                                        {setting.name}
                                        </Typography>
                                </MenuItem>
                            ))}
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>

                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default UserNavbar;
