import UserSideBar from "./UserSideBar"
import UserOrders from "./UserOrders"
import TrackPackage from "./TrackPackage"
import ProductReview from "./ProductReview"
import FavouritesPage from './FavouritesPage'
import { useState } from 'react'
import { Box } from "@mui/material"
import UserSettings from "./UserSettings"
import UserDetails from "./UserDetails"
import Dashboard from "./Dashboard"

function UserDashboard() {
    const [activeSection, setActiveSection] = useState('dashboard');

    const renderActiveSection = () => {
        if (activeSection === 'orders') {
            return <UserOrders />
        } else if (activeSection === 'track-package') {
            return <TrackPackage />
        } else if (activeSection === 'review') {
            return <ProductReview />
        } else if (activeSection === 'favourites') {
            return <FavouritesPage />
        } else if (activeSection === 'settings') {
            return <UserSettings/>
        } else if (activeSection === 'profile') {
            return <UserDetails/>
        } else if (activeSection === 'dashboard') {
            return <Dashboard setActiveSection={setActiveSection} />
        }
    }

    //

    return (
        <>
            {/* Pass setActiveSection to UserSideBar */}
            <UserSideBar setActiveSection={setActiveSection} activeSection={activeSection} />
            <Box sx={{ marginTop:'80px', p: 3, marginLeft: { md: '240px' }}}>            
                {renderActiveSection()}
            </Box>
        </>
    );
}

export default UserDashboard;
