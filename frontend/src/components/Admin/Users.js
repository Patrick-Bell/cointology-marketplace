import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    Typography,
    IconButton
} from '@mui/material';
import axios from 'axios';
import { Email, Visibility } from '@mui/icons-material';

function Users() {
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/all-users'); // Fetch user data from the API
                const data = response.data
                setUsersData(data); // Assuming the response data is an array of users
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleViewClick = (userId) => {
        window.location.href = `/users/${userId}`
    };

    const handleEmailClick = (userEmail) => {
        // Create a mailto link
        const mailtoLink = `mailto:${userEmail}`;
        window.location.href = mailtoLink; // Use the mailto link
    };
    
    if (loading) return <Typography variant="h6">Loading...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    return (
        <TableContainer component={Paper}>
            <Typography variant="h5" sx={{ p: 2 }}>
                User List
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Number of Orders</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(usersData) && usersData.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>...{user._id.slice(-6)}</TableCell> {/* Slice ID to get last 6 digits */}
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.orders.length}</TableCell>
                            <TableCell>
                            <IconButton onClick={() => handleViewClick(user._id)}>
                                        <Visibility />
                                    </IconButton>
                                <IconButton onClick={() => handleEmailClick(user.email)}>
                                        <Email />
                                    </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Users;
