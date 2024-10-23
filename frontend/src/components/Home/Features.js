import { Box, Typography, Grid, Button} from "@mui/material"
import { Send, TrackChanges, Stars, Payment, Favorite } from '@mui/icons-material';
import { Link } from "react-router-dom"
import ScrollInView from "../animation/ScrollInView"

function Features() {

    return (

        <>
                <Box
                sx={{
                    backgroundColor: '#e0e0e0', // New background color for Features section
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
                Features
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

                <Grid container spacing={4} justifyContent="center">
                    {/* Feature 1 */}
                    <Grid item xs={12} sm={6} md={3}>
                    <ScrollInView direction='left'>
                        <Box
                            sx={{
                                textAlign: 'center',
                                padding: '20px',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                boxShadow: 2,
                            }}
                        >
                            <TrackChanges sx={{ fontSize: '50px', color: '#9c27b0' }} />
                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                Track Orders
                            </Typography>
                            <Typography variant="body2">
                                Track your orders from purchase to delivery seamlessly.
                            </Typography>
                        </Box>
                        </ScrollInView>
                    </Grid>

                    {/* Feature 2 */}
                    <Grid item xs={12} sm={6} md={3}>
                    <ScrollInView direction='left'>
                        <Box
                            sx={{
                                textAlign: 'center',
                                padding: '20px',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                boxShadow: 2,
                            }}
                        >
                            <Stars sx={{ fontSize: '50px', color: '#9c27b0' }} />
                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                Unique Coins
                            </Typography>
                            <Typography variant="body2">
                                Access a diverse range of unique and rare coins.
                            </Typography>
                        </Box>
                        </ScrollInView>
                    </Grid>

                    {/* Feature 3 */}
                    <Grid item xs={12} sm={6} md={3}>
                    <ScrollInView direction='right'>
                        <Box
                            sx={{
                                textAlign: 'center',
                                padding: '20px',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                boxShadow: 2,
                            }}
                        >
                            <Payment sx={{ fontSize: '50px', color: '#9c27b0' }} />
                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                Flexible Payments
                            </Typography>
                            <Typography variant="body2">
                                Convenient cash and card payment options available.
                            </Typography>
                        </Box>
                        </ScrollInView>
                    </Grid>

                    {/* Feature 4 */}
                    <Grid item xs={12} sm={6} md={3}>
                    <ScrollInView direction='right'>
                        <Box
                            sx={{
                                textAlign: 'center',
                                padding: '20px',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                boxShadow: 2,
                            }}
                        >
                            <Favorite sx={{ fontSize: '50px', color: '#9c27b0' }} />
                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                Favorites
                            </Typography>
                            <Typography variant="body2">
                                Easily add coins to your favorites for quick access.
                            </Typography>
                        </Box>
                        </ScrollInView>
                    </Grid>
                </Grid>
                    <Button
                        href="/products"
                        className='pulse'
                        variant="contained"
                        startIcon={<Send />}
                        sx={{ width:'200px', display:'flex', margin: '25px auto auto', color: 'white', background:'#9c27b0',}}
                    >
                        View our coins!
                    </Button>
            </Box>
        
        </>
    )
}

export default Features