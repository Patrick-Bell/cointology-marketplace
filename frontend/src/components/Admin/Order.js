import { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Paper,
    Chip,
    TextField
} from '@mui/material';
import { Visibility, Edit, LocalShipping } from '@mui/icons-material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ShippingModal from './ShippingModal'; // Import the modal
import PaymentModal from './PaymentModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Order() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [openModal, setOpenModal] = useState(false); // Modal open state
    const [openPayModal, setOpenPayModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null); // Track which order is being edited
    const [searchQuery, setSearchQuery] = useState(''); // Add state for search query
    const [sortOrder, setSortOrder] = useState('desc'); // State to track sorting order (ascending or descending)

    const navigate = useNavigate();

    // Fetch orders function
    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/all-orders');
            setOrders(response.data);
            setFilteredOrders(response.data); // Set initial filtered orders
        } catch (e) {
            console.log(e);
        }
    };

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        const statusColors = {
            pending: '#A9A9A9',            // Dark Gray
            shipped: '#4DD0E1',            // Light Cyan
            delivery_attempted: '#FFB74D', // Light Orange
            delivered: '#66BB6A',          // Light Green
            cancelled: '#EF5350',          // Lighter Red
        };

        return statusColors[status] || '#000000'; // Default to black if status is unknown
    };

    const handleViewDetails = (orderId) => {
        window.open(`/orders/${orderId}`, '_blank'); 
    };

    const handleEditPaidStatus = (orderId) => {
        console.log('Edit paid status for order:', orderId);
    };

    const handleEditOrderStatus = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenModal(true);
    };

    const handleEditPayStatus = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenPayModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedOrderId(null);
        fetchOrders(); // Call fetchOrders here
    };

    const handleClosePayModal = () => {
        setOpenPayModal(false);
        setSelectedOrderId(null);
    };

    // Filter orders based on search query
    useEffect(() => {
        const filtered = orders.filter((order) => {
            const orderID = order.order_id.toLowerCase();
            const orderType = order.order_type.toLowerCase();
            const orderStatus = order.order_status.toLowerCase();
            const query = searchQuery.toLowerCase();
            return (
                orderID.includes(query) ||
                orderType.includes(query) ||
                orderStatus.includes(query)
            );
        });
        setFilteredOrders(filtered);
    }, [searchQuery, orders]); // Include orders in the dependency array to re-filter when it changes

    const handleSortByDate = () => {
        const sortedOrders = [...filteredOrders].sort((a, b) => {
            const dateA = new Date(a.order_date);
            const dateB = new Date(b.order_date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        console.log('triggering sorted date')
        setFilteredOrders(sortedOrders); // Update filtered orders with sorted orders
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sorting order
    };

    return (
        <>
            <ToastContainer />
            <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <TableContainer component={Paper} sx={{ maxHeight: 700 }} stickyHeader>
            <Typography variant="h5" sx={{ p: 2 }}>
                        Order Details
                    </Typography>

                    <TextField
                        label="Search Orders"
                        variant="outlined"
                        value={searchQuery}
                        placeholder='Search for Order ID, Order Type, Order Status'
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ width: '98%', m: 1 }} // Full width minus 2px and margin 1 unit
                    />

                    <Typography sx={{margin: '0 10px'}}>Number of orders: <strong>{filteredOrders.length}</strong></Typography>

                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">ID</TableCell>
                                <TableCell align="center">
                                        Order Date
                                        <IconButton sx={{m: '0 5px'}} onClick={handleSortByDate}>
                                            <SwapVertIcon sx={{ position: 'absolute' }} />
                                        </IconButton>
                                </TableCell>
                                <TableCell align="center">Order Type</TableCell>
                                <TableCell align="center">Order Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(filteredOrders) && filteredOrders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell align="center">...{order.order_id.slice(-6)}</TableCell>
                                    <TableCell align="center">{new Date(order.order_date).toLocaleString()}</TableCell>
                                    <TableCell align="center">
                                        <Chip label={order.order_type} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={order.order_status} sx={{ backgroundColor: getStatusColor(order.order_status), color: 'white' }} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleViewDetails(order.order_id)}>
                                            <Visibility />
                                        </IconButton>
                                        <IconButton onClick={() => handleEditPayStatus(order.order_id)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleEditOrderStatus(order.order_id)}>
                                            <LocalShipping />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Shipping Modal */}
                {selectedOrderId && (
                    <ShippingModal
                        orderId={selectedOrderId}
                        open={openModal}
                        onClose={handleCloseModal}
                    />
                )}

                {selectedOrderId && (
                    <PaymentModal
                        orderId={selectedOrderId}
                        open={openPayModal}
                        onClose={handleClosePayModal}
                    />
                )}
            </Box>
        </>
    );
}

export default Order;
