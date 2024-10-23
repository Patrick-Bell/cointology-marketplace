import { useState } from 'react'
import { Box, Typography, Grid, List, ListItem, Collapse, ListItemText, Button } from "@mui/material"
import ScrollInView from "../animation/ScrollInView"
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import sellCoin from '../styles/sell-coin-2.webp'
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer'



function SellCoin() {

    const steps = [
        {
            title: '1. Take a Picture',
            description: 'Capture clear images of your coin from different angles.',
        },
        {
            title: '2. Send Us the Picture',
            description: 'Upload the images using our submission form below. It will also be useful and speed up the process if you sent us a message where you got the coin from or any documentation you recieved when purchasing the coin.',
        },
        {
            title: '3. Free Evaluation',
            description: 'Our team of experts will assess the condition and value of your coin. We will contact you and show you the evaluation of the coin',
        },
        {
            title: '4. Receive an Offer',
            description: 'If it meets our criteria, we will make you an offer to buy it.',
        },
        {
            title: '5. Get Paid',
            description: "If you accept the offer, you’ll receive payment quickly and securely! If you'd prefer to exchange the coin with another on our website, that is something we can also provide.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
        console.log('open-index', openIndex, 'index', index)
    };

    const { ref, inView } = useInView({
        triggerOnce: false,  // Run once when it comes into view
        threshold: 0.5,  // Percentage of element visibility (50% of the element must be visible to trigger)
    });


    return (

        <>

<Box
            sx={{
                backgroundColor: '#fbfdec', // Background color for Sell Your Coin section
                padding: '40px',
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
                Sell Your Coin
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
                    <List>
                        {steps.map((step, index) => (
                            <Box key={index}>
                            <ScrollInView direction='bottom'>
                                <ListItem button onClick={() => handleToggle(index)}>
                                    <ListItemText
                                        primary={step.title}
                                        sx={{ color: 'black' }}
                                    />
                                    {openIndex === index ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                                    <Typography variant="body2" sx={{ paddingLeft: 2, color: 'black' }}>
                                        {step.description}
                                    </Typography>
                                </Collapse>
                                </ScrollInView>

                            </Box>
                        ))}
                    </List>
                    <Typography variant="body1" sx={{ marginTop: '20px', color: 'black' }} ref={ref}>
                        <strong>Do you have a coin you’d like to sell? At Cointology, we make it easy for you!</strong>
                        <br /><br />
                        Simply follow the steps above to send us a picture of your coin for a free evaluation. 
                        Our team of experts will assess the condition and value of your coin. If it meets our criteria, 
                        we will make you an offer to buy it. Selling your coin has never been easier and you could earn up to <strong>£{inView ? <CountUp duration={5} end={1000}/> : '1000'}</strong>.
                    </Typography>
                    <ScrollInView direction='bottom'>
                    <Button
                        variant="contained"
                        className='pulse'
                        sx={{ marginTop: '20px', backgroundColor: '#9c27b0' }}
                    >
                        Send Your Coin
                    </Button>
                    </ScrollInView>
                </Grid>

                {/* Right Side Content */}
                <Grid item xs={12} md={6}>
                <ScrollInView direction='right'>
                    <img
                        src={sellCoin} // Placeholder image; replace with actual stock image later
                        alt="Sell Your Coin"
                        style={{
                            width: '100%', // Responsive width
                            borderRadius: '10px', // Rounded corners
                            boxShadow: 2,
                        }}
                    />
                </ScrollInView>
                </Grid>
            </Grid>
        </Box>
        
        
        </>
    )
}

export default SellCoin