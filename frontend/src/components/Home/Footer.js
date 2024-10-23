import { Box, Container, Typography, Grid, IconButton, Button, TextField } from "@mui/material"
import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import footerBackground from '../styles/background.png'
import { useEffect } from "react";

function Footer(){

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
    }, []);


    return (


        <>
        <Box
            sx={{
                backgroundImage: `url(${footerBackground})`, // You can add a background image here
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                padding: '50px 0',
                position: 'relative',
                zIndex: 1,
            }}
        >
            <Container maxWidth="lg">

                <Grid container spacing={4}>
                    
                    {/* Column 1: Navigation Links */}
<Grid item xs={12} sm={6} md={3}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>Navigation</Typography>
    <ul style={{ listStyle: 'none', padding: 0, m: 3, color:'white' }}>
        <li className='footer-list'>
            <Link className='footer-list' to="/">Home</Link>
        </li>
        <li className='footer-list'> 
            <Link className='footer-list' href="/about" >About</Link>
        </li>
        <li className='footer-list'>
            <Link className='footer-list' href="/features">Features</Link>
        </li>
        <li className='footer-list'>
            <Link className='footer-list' href="/sell-coin"> Sell Coin</Link>
        </li>
        <li className='footer-list'>
            <Link className='footer-list' href="/contact">Contact</Link>
        </li>
        <li className='footer-list'>
            <Link className='footer-list' to="/cart">Cart</Link>
        </li>
        <li className='footer-list'>
            <Link className='footer-list' to="/products">Products</Link>
        </li>
        <li className='footer-list'>
            <Link className='footer-list' to="/shipping">Shipping & Delivery</Link>
        </li>
        <li className='footer-list'>
            <Link className='footer-list' href="/payment">Payment</Link>
        </li>
    </ul>
</Grid>



                    {/* Column 2: Authentication Links */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Account</Typography>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><Button component='a' href="/login" variant="text" sx={{ color: 'white' }}>Log In</Button></li>
                            <li><Button component='a' href="/register" variant="contained" className="pulse" sx={{ backgroundColor: '#9c27b0', color: 'white' }}>Register</Button></li>
                        </ul>
                    </Grid>

                    {/* Column 3: Social Links */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Follow Us</Typography>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <IconButton sx={{ color: 'white' }} component="a" href="https://facebook.com" target="_blank">
                                <Facebook />
                            </IconButton>
                            <IconButton sx={{ color: 'white' }} component="a" href="https://twitter.com" target="_blank">
                                <Twitter />
                            </IconButton>
                            <IconButton sx={{ color: 'white' }} component="a" href="https://instagram.com" target="_blank">
                                <Instagram />
                            </IconButton>
                            <IconButton sx={{ color: 'white' }} component="a" href="https://linkedin.com" target="_blank">
                                <LinkedIn />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Column 4: Newsletter Subscription */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Subscribe to Our Newsletter</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>Get the latest updates, deals, and more.</Typography>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <TextField
                                variant="outlined"
                                placeholder="Enter your email"
                                size="small"
                                sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: '4px' }}
                            />
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#9c27b0', color: 'white', textTransform: 'none' }}
                            >
                                Subscribe
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Horizontal Line */}
                <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.3)', mt: 4, mb: 4 }} />

                {/* Bottom Section with Extra Links */}
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Help & Support</Typography>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li className='footer-list'><Link className='footer-list' to="/faq" color="inherit" underline="none">FAQ</Link></li>
                            <li className='footer-list'><Link className='footer-list' to="/faq" color="inherit" underline="none">Customer Support</Link></li>
                            <li className='footer-list'><Link className='footer-list' to="/faq" color="inherit" underline="none">Returns & Refunds</Link></li>
                        </ul>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Legal</Typography>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li className='footer-list'><Link className='footer-list' href="/privacy-policy" color="inherit" underline="none">Privacy Policy</Link></li>
                            <li className='footer-list'><Link className='footer-list' href="/terms-conditions" color="inherit" underline="none">Terms & Conditions</Link></li>
                            <li className='footer-list'><Link className='footer-list' href="/disclaimer" color="inherit" underline="none">Disclaimer</Link></li>
                        </ul>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Contact Us</Typography>
                        <Typography variant="body2">123 Coin Street, CoinCity, CO 12345</Typography>
                        <Typography variant="body2">Phone: +123 456 7890</Typography>
                        <Typography variant="body2">Email: support@cointology.com</Typography>
                    </Grid>
                </Grid>

                {/* Bottom Copyright Section */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2">
                        © {new Date().getFullYear()} Cointology. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
        
        </>
    )
}

export default Footer