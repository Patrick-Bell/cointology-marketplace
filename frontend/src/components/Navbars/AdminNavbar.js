import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate()

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const response = axios.post('/api/logout')
            console.log(response.data)
            navigate('/')
            window.location.reload()


        }catch(e) {
            console.log(e)
        }
    };

    return (
        <AppBar position="fixed" sx={{background:'black'}}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Admin Dashboard
                </Typography>

                <Typography variant="body1" sx={{ marginRight: 2 }}>
                    Hello, Admin
                </Typography>

                <IconButton onClick={handleMenuClick}>
                    <Avatar alt="Admin" src="/path/to/admin-avatar.jpg" />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <Link className='nav' to='/dashboard'><MenuItem onClick={handleClose}>Dashboard</MenuItem></Link>
                    <Link className='nav' to='/cart'><MenuItem onClick={handleClose}>Cart</MenuItem></Link>
                    <Link className='nav' to='/products'><MenuItem onClick={handleClose}>Products</MenuItem></Link>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default AdminNavbar;
