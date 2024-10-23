import { Box, Typography, Grid, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { Send } from '@mui/icons-material';
import ScrollInView from "../animation/ScrollInView"

function AboutUs() {


    return (

        <>
            <Box
                sx={{
                    backgroundColor: '#fbfdec', // Set background color for About Us section
                    padding: '40px', // Add padding
                }}
            >
                
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 0',
            }}
        >
            {/* Left Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />

            {/* Text in the center */}
            <Typography
                variant="h4"
                sx={{
                    padding: '0 10px', // Add space between the lines and the text
                    whiteSpace: 'nowrap', // Prevent the text from breaking onto multiple lines
                }}
            >
                About Us
            </Typography>

            {/* Right Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />
        </Box>



                <Grid container spacing={4}>
                    {/* Left Side Content */}
                    <Grid item xs={12} md={6}>
                    <ScrollInView direction='left'>
                        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                            Cointology: Your Marketplace for Coins
                        </Typography>
                        <Typography variant="body1">
                            Cointology is a premier online marketplace dedicated to enthusiasts and collectors of coins. We provide a platform where users can both purchase and sell authentic minted coins from around the world. Whether you're a seasoned collector seeking rare finds or a newcomer eager to start your collection, Cointology offers a user-friendly interface and a wide selection of coins that cater to all interests and budgets.
                            <br /><br />
                            Our marketplace ensures the authenticity and quality of every coin listed, so buyers can shop with confidence. Sellers can showcase their unique collections and connect with like-minded individuals passionate about numismatics. At Cointology, we are committed to creating a vibrant community for coin lovers, offering resources, insights, and support for all your collecting needs.
                        </Typography>
                        </ScrollInView>

                        <ScrollInView direction='bottom'>
                        <Link to='/products'>
                    <Button
                        variant="outlined"
                        startIcon={<Send />}
                        sx={{ marginTop: '16px', color: 'white', background:'#9c27b0',}}
                    >
                        View our coins!
                    </Button>
                    </Link>
                    </ScrollInView>

                    </Grid>

                    {/* Right Side Content */}
                    <Grid item xs={12} md={6}>
                    <ScrollInView direction='right'>
                        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                            Our Mission
                        </Typography>
                        <Typography variant="body1">
                            At Cointology, our mission is to create a trusted and accessible marketplace for coin enthusiasts, where quality, authenticity, and customer satisfaction are at the forefront of everything we do. We strive to foster a community where collectors can connect, share their passion, and discover new opportunities. Our commitment to excellence ensures that every transaction is secure, and every customer feels valued. We aim to elevate the experience of buying and selling coins by providing exceptional service, expert knowledge, and a diverse range of high-quality coins.
                        </Typography>
                        <Typography variant="h6" sx={{ marginTop: '40px', marginBottom: '20px' }}>
                            Our Vision
                        </Typography>
                        <Typography variant="body1">
                            Our vision is to be the leading global marketplace for coin collectors and enthusiasts, recognized for our dedication to authenticity, innovation, and customer-centric service. We envision a world where collectors of all levels can easily access a vast selection of coins, engage with a supportive community, and enjoy a seamless buying and selling experience. By leveraging technology and fostering partnerships within the numismatic community, we aim to empower collectors to build, grow, and share their collections with pride.
                        </Typography>
                        </ScrollInView>
                    </Grid>
                </Grid>
            </Box>
        
        </>
    )
}

export default AboutUs