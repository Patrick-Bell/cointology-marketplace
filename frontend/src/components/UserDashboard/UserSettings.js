import React, { useState } from 'react';
import { Box, Typography, Switch, Paper, Divider } from '@mui/material';

function UserSettings() {
    const [updateStatusEmails, setUpdateStatusEmails] = useState(true);
    const [promotionalEmails, setPromotionalEmails] = useState(false);
    const [transactionalEmails, setTransactionalEmails] = useState(true);
    const [alertsEmails, setAlertsEmails] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [showProfile, setShowProfile] = useState(true);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [language, setLanguage] = useState('English');

    const handleToggleProfileVisibility = () => {
        setShowProfile((prev) => !prev);
    };

    const handleToggleTwoFactorAuth = () => {
        setTwoFactorAuth((prev) => !prev);
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    return (
        <>
        <Box fullWidth>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">Notifications</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">Allow Update Status Emails</Typography>
                    <Switch checked={updateStatusEmails} onChange={() => setUpdateStatusEmails((prev) => !prev)} color="primary" />
                </Box>
                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">Receive Promotional Emails</Typography>
                    <Switch checked={promotionalEmails} onChange={() => setPromotionalEmails((prev) => !prev)} color="primary" />
                </Box>
                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">Receive Transactional Emails</Typography>
                    <Switch checked={transactionalEmails} onChange={() => setTransactionalEmails((prev) => !prev)} color="primary" />
                </Box>
                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">Receive Alerts and Updates</Typography>
                    <Switch checked={alertsEmails} onChange={() => setAlertsEmails((prev) => !prev)} color="primary" />
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="h6" sx={{ margin: '10px 0' }}>Theme Settings</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">Dark Theme</Typography>
                    <Switch checked={isDarkTheme} onChange={() => setIsDarkTheme((prev) => !prev)} color="primary" />
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="h6" sx={{ margin: '10px 0' }}>Privacy Settings</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">Profile Visibility</Typography>
                    <Switch checked={showProfile} onChange={handleToggleProfileVisibility} color="primary" />
                </Box>
                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">Enable Two-Factor Authentication</Typography>
                    <Switch checked={twoFactorAuth} onChange={handleToggleTwoFactorAuth} color="primary" />
                </Box>
                <Divider />
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="h6" sx={{ margin: '10px 0' }}>Language Settings</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">Select Language</Typography>
                    <select value={language} onChange={handleLanguageChange} style={{ padding: '4px', borderRadius: '4px' }}>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        {/* Add more languages as needed */}
                    </select>
                </Box>
            </Paper>
        </Box>
        </>
    );
}

export default UserSettings;
