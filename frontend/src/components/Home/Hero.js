import { Box, Typography, Button } from "@mui/material"
import { Link } from "react-router-dom"
import Image from '../styles/hero.webp';
import { Send } from '@mui/icons-material';
import ScrollInView from "../animation/ScrollInView";

function Hero() {


    return (

        <>
        
            <Box
                sx={{
                    position: 'relative', // Allows absolute positioning for children
                    width: '100%',
                    height: '100vh', // Full height of the viewport
                    marginTop: '64px',
                    overflow: 'hidden', // Hide overflow
                }}
            >
                {/* Full-width Image */}
                <img
                    src={Image} // Adjust the path as needed
                    alt="Hero"
                    style={{
                        height: '100%', // Set to full height
                        width: '100%', // Set to full width
                        objectFit: 'cover', // Ensure the image covers the entire area
                    }}
                />

                {/* Text Overlay */}
                <Box
                    sx={{
                        position: 'absolute', // Position it over the image
                        top: '50%', // Center vertically
                        left: '40px', // Align to the left with some padding
                        transform: 'translateY(-50%)', // Adjust to truly center
                        color: 'white', // Change text color for readability
                        padding: '20px', // Add some padding for aesthetics
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Semi-transparent background for contrast
                        borderRadius: '10px'
                    }}
                >
                    <Typography variant="h2" sx={{ fontWeight: '900' }}>COINTOLOGY</Typography>
                    <Typography variant="body1" sx={{ marginTop: '16px' }}>
                        Welcome to Cointology, a marketplace dedicated to the purchase of coins!
                    </Typography>
                    <Box sx={{display:'flex'}}>
                    <ScrollInView direction='left'>
                    <Link to='/'>
                    <Button
                        variant="outlined"
                        startIcon={<Send />}
                        sx={{ marginTop: '16px', color: 'white', background:'#9c27b0'}}
                    >
                        Get Started
                    </Button>
                    </Link>
                    </ScrollInView>
                    <ScrollInView direction='left'>
                    <Link to='/register'>
                    <Button
                        variant="outlined"
                        startIcon={<Send />}
                        sx={{ marginTop: '16px', color: 'white', marginLeft:'10px'}}
                    >
                        Register!
                    </Button>
                    </Link>
                    </ScrollInView>
                </Box>
                </Box>
            </Box>
        
        </>
    )
}

export default Hero