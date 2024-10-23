import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { Label, LabelImportant } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';


const GenerateReport = () => {
    const reportTypes = ['users (coming soon)', 'products', 'orders'];
    const [selectedReportType, setSelectedReportType] = useState(reportTypes[1]);
    const [reports, setReports] = useState({
        users: [],
        products: [],
        orders: []
    });
    const [startDate, setStartDate] = useState(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month'));
    const [reportName, setReportName] = useState('')
    const [loading, setLoading] = useState(false); // Loading state

    const handleInputChange = (e) => {
        setReportName(e.target.value); // Update the state with the input value
    };

    const handleGenerateReport = async () => {
        // Validate date range
        if (startDate.isAfter(endDate)) {
            toast.error('Start date must be before end date.');
            return;
        }

        const reportType = selectedReportType; // Get the selected report type
        setLoading(true); // Start loading

        try {
            const response = await axios.get(`/api/generate-${reportType}/report`, {
                params: {
                    reportName: reportName,
                    startDate: startDate.toISOString(), // Format to ISO string
                    endDate: endDate.toISOString()     // Format to ISO string
                }
            });

            console.log(response.data);
            // Update reports state and show success message
            setReports((prevReports) => ({
                ...prevReports,
                [reportType]: response.data // Assuming response data is an array of reports
            }));
            toast.success(`Successfully generated ${reportType} report!`);
        } catch (e) {
            console.error("Error generating report:", e);
            toast.error(`Error generating ${reportType} report.`);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleClear = () => {
        setStartDate(dayjs().startOf('month'));
        setEndDate(dayjs().endOf('month'));
        setSelectedReportType(reportTypes[1]);
        setReportName('')
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Generate Report
                </Typography>

                {/* Dropdown for selecting report type */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                   <Typography>Report Type</Typography>
                    <Select
                        labelId="report-type-label"
                        value={selectedReportType}
                        onChange={(e) => setSelectedReportType(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    >
                        {reportTypes.map((type) => (
                            <MenuItem key={type} value={type} disabled={type === 'users (coming soon)'}>
                                {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalize the first letter */}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <ToastContainer />

                <FormControl fullWidth sx={{mb: 2}}>
                    <TextField
                    type='text'
                    InputLabelProps={{ shrink: true }}
                    value={(reportName)}
                    placeholder='This will be shown on your report'
                    label="Name your report"
                    onChange={handleInputChange}
                    >
                    </TextField>
                </FormControl>

                {/* Date Range Picker without Grid */}
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>Select Date Range</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Box sx={{ mr: 1 }}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Box>
                        <Typography variant="h5" sx={{ mx: 1 }}>to</Typography>
                        <Box sx={{ ml: 1 }}>
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Box>
                    </Box>
                </LocalizationProvider>
                
                {/* Buttons for generating and clearing the report */}
                <Box sx={{ display: 'block', justifyContent: 'space-between', mt: 5 }}>
                    <Button variant="contained" onClick={handleGenerateReport} sx={{ width: '100%' }} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Generate Report'}
                    </Button>
                    <Button variant="outlined" onClick={handleClear} sx={{ width: '100%', mt: 1 }}>
                        Clear
                    </Button>
                </Box>
            </Paper>

        </Box>
    );
};

export default GenerateReport;
