import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import InventoryIcon from '@mui/icons-material/Inventory';
import SellIcon from '@mui/icons-material/Sell';
import { DocumentScanner, MonitorHeart, Person, ReportRounded } from '@mui/icons-material';


const drawerWidth = 240;

const Sidebar = ({ handleDrawerToggle, mobileOpen, handleMenuClick, isMobile }) => {
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                border:'none',
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    border:"none"
                },
            }}
            variant={isMobile ? "temporary" : "permanent"}
            anchor="left"
            open={mobileOpen} // Open the drawer if in mobile view
            onClose={handleDrawerToggle} // Close on mobile if toggled
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                <ListItem button onClick={() => handleMenuClick('mainDash')}>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuClick('add-product')}>
                        <ListItemIcon><AddShoppingCartIcon /></ListItemIcon>
                        <ListItemText primary="Add Product" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuClick('inventory')}>
                        <ListItemIcon><InventoryIcon /></ListItemIcon>
                        <ListItemText primary="Inventory" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuClick('orders')}>
                        <ListItemIcon><SellIcon /></ListItemIcon>
                        <ListItemText primary="Orders" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuClick('users')}>
                        <ListItemIcon><Person /></ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuClick('reports')}>
                        <ListItemIcon><DocumentScanner /></ListItemIcon>
                        <ListItemText primary="Reports" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuClick('gen-report')}>
                        <ListItemIcon><DocumentScanner /></ListItemIcon>
                        <ListItemText primary="Generate Report" />
                    </ListItem>
                    <ListItem button onClick={() => handleMenuClick('settings')}>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
