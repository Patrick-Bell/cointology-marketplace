import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Card, CardContent, Button, IconButton } from '@mui/material';
import { Delete, Email, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import ArticleIcon from '@mui/icons-material/Article';


const Reports = () => {
    const [activeTab, setActiveTab] = useState(0); // 0 for Users, 1 for Products, 2 for Orders
    const [productReports, setProductReports] = useState([]);
    const [orderReports, setOrderReports] = useState([]);
    const [userReports, setUserReports] = useState([]);

    const handleView = (reportId) => {
        console.log(`Looking at ${reportId}`)
        window.location.href=`/reports/${reportId}`
    }


    // Fetch reports from the API
    const fetchReports = async () => {
        try {
            const response = await axios.get('/api/reports'); // Your existing API call
            const reports = response.data;

            // Filter reports based on the report type
            const orderReports = reports.filter(report => report.report_type === 'orders');
            const productReports = reports.filter(report => report.report_type === 'products');
            const userReports = reports.filter(report => report.report_type === 'users');

            console.log('Order Reports:', orderReports, 'User Reports:', userReports);

            setProductReports(productReports);
            setOrderReports(orderReports);
            setUserReports(userReports);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleDelete = async (reportId) => {
        try{
            const response = await axios.delete(`/api/delete-report/${reportId}`)
            console.log(response.data)
            fetchReports()
            toast.success('Report Successfully Deleted!')

        }catch(e) {
            console.log(e)
        }
    }

    // Function to render report content based on the active tab
    const renderReportContent = () => {
        let reports = [];
        switch (activeTab) {
            case 0: // Users
                reports = userReports;
                break;
            case 1: // Products
                reports = productReports;
                break;
            case 2: // Orders
                reports = orderReports;
                break;
            default:
                return null;
        }

        if (reports.length === 0) {
            return  <Box>
                <Box
                    sx={{
                        display: 'flex', // Enable flexbox
                        justifyContent: 'center', // Center horizontally
                        alignItems: 'center', // Center vertically
                        color:'lightgrey'
                     }}
                    >
            <ArticleIcon fontSize="large" sx={{ fontSize: 100 }} /> {/* Adjust the size here */}
                    </Box>  
                        <Typography variant="h6" color="textSecondary" align="center">
                            No reports in this category.
                        </Typography>
                    </Box>
                }

        return reports.map((report, index) => (
            <Card key={index} sx={{ mb: 2 }}>
                <CardContent sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant="body2"><strong>{report.report_name}</strong>  ({new Date(report.generated).toLocaleDateString('en-GB')})</Typography>
                    <Box>
                    <IconButton onClick={() => handleView(report.id)}>
                        <Visibility />
                    </IconButton>
                     <IconButton onClick={() => handleDelete(report.id)}>
                        <Delete sx={{color: 'red'}} />
                    </IconButton>
                    </Box>
                </CardContent>
            </Card>
        ));
    };

    return (
        <>
        <ToastContainer />
        <Paper elevation={3}>
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Reports</Typography>
            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                <Tab label="Users" />
                <Tab label="Products" />
                <Tab label="Orders" />
            </Tabs>
                {renderReportContent()} {/* Call the render function to show the content */}
        </Box>
        </Paper>
        </>
    );
};

export default Reports;
