import { useEffect, useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Card, Button, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FaqImg from '../styles/faq.png';
import ScrollInView from '../animation/ScrollInView';
import Footer from '../Home/Footer';

function Faq() {
    const [expanded, setExpanded] = useState(null);

    // Simplified handleChange function
    const handleChange = (panel) => {
        setExpanded(expanded === panel ? null : panel);
    };

    // Sample FAQ data categorized
    const faqCategories = [
        {
            category: 'Orders & Shipping',
            faqs: [
                { question: 'How can I track my order?', answer: 'Once your order is shipped, you will receive an email with tracking details.' },
                { question: 'Can I change my shipping address?', answer: 'Yes, you can change your shipping address before the order is shipped.' },
                { question: 'What should I do if my order hasn’t arrived?', answer: 'If your order hasn’t arrived within the expected time frame, please contact our support team for assistance.' },
                { question: 'Do you ship internationally?', answer: 'Yes, we offer international shipping. Additional charges may apply.' },
            ]
        },
        {
            category: 'Payments & Refunds',
            faqs: [
                { question: 'What payment methods do you accept?', answer: 'We accept Visa, MasterCard, American Express, and more.' },
                { question: 'How do I request a refund?', answer: 'You can request a refund by contacting our support team.' },
                { question: 'Can I use multiple payment methods', answer: 'No, we only allow one payment method per order.' },
                { question: 'When will my refund be processed?', answer: 'Refunds are typically processed within 5-7 business days after approval.' },
            ]
        },
        {
            category: 'Account & Settings',
            faqs: [
                { question: 'How do I reset my password?', answer: 'Go to the account settings page and click on "Reset Password".' },
                { question: 'Can I delete my account?', answer: 'Yes, contact support for assistance with account deletion.' },
                { question: 'How do I update my email address?', answer: 'You can update your email address in the account settings under "Profile".' },
                { question: 'What should I do if I forget my password?', answer: 'Use the "Forgot Password" link on the login page to reset your password.' },
            ]
        },
        {
            category: 'Product Information',
            faqs: [
                { question: 'How do I find product specifications?', answer: 'Product specifications can be found in the product description section on the product page.' },
                { question: 'Do you offer product warranties?', answer: 'Yes, we offer warranties on select products. Please check the product details for more information.' },
                { question: 'What if I receive a defective product?', answer: 'If you receive a defective product, please contact our support team for a replacement or refund.' },
                { question: 'How do I leave a product review?', answer: 'You can leave a review on the product page under the review section.' },
            ]
        },
        {
            category: 'Technical Support',
            faqs: [
                { question: 'How do I contact technical support?', answer: 'You can reach our technical support team via the contact form on our website or through email.' },
                { question: 'What should I do if I experience an error?', answer: 'Please clear your cache and cookies, then try again. If the issue persists, contact support.' },
                { question: 'Is there a mobile app available?', answer: 'Yes, we have a mobile app available for download on both iOS and Android platforms.' },
                { question: 'How do I report a bug?', answer: 'You can report bugs using the feedback form available on the website.' },
            ]
        },
        {
            category: 'Shipping & Delivery',
            faqs: [
                { question: 'What shipping options are available?', answer: 'We offer standard, expedited, and overnight shipping options.' },
                { question: 'Do you offer free shipping?', answer: 'Yes, we offer free shipping on orders over a certain amount. Please check our shipping policy for details.' },
                { question: 'How do I change my shipping method?', answer: 'You can change your shipping method during the checkout process.' },
                { question: 'What if my package is lost in transit?', answer: 'If your package is lost, please contact our support team to initiate an investigation.' },
            ]
        },
    ];

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    

    return (
        <>
        <Box sx={{ p:'30px', marginTop: '64px', background:'#e0e0e0', minHeight:'calc(100vh - 124px)' }}>
            {/* Immersive FAQ Header with Image and Heading Side by Side */}
            <Box sx={{
                background: '#262326', // Dark background matching the image
                borderRadius: '12px',
                position: 'relative',
                p: 4,
                mb: 4,
                overflow: 'hidden',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)' // Soft shadow for depth
            }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography 
                            variant="h4" 
                            color="white" 
                            sx={{ 
                                fontWeight: 'bold', 
                                mb: 2, 
                                zIndex: 2,
                                position: 'relative', 
                                textAlign: 'center'
                            }}
                        >
                            Frequently Asked Questions
                        </Typography>
                        <Typography 
                            variant="body1" 
                            color="#b0bec5" // Light grey for readability
                            sx={{ zIndex: 2, position: 'relative', textAlign: 'center' }}
                        >
                            Find answers to our most commonly asked questions below.
                        </Typography>
                    </Grid>

                    <Grid 
                        item xs={12} md={6} 
                        sx={{ 
                            position: 'relative', 
                            display: 'flex', 
                            justifyContent: { xs: 'center', md: 'flex-end' } 
                        }}
                    >
                        <Box 
                            component="img" 
                            src={FaqImg} 
                            alt="FAQ" 
                            sx={{
                                maxWidth: { xs: '300px', md: '400px' }, 
                                width: '100%', 
                                zIndex: 1,
                                position: 'relative', 
                                borderRadius: '12px',
                                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)' // Stronger shadow on image
                            }} 
                        />
                    </Grid>

                    {/* Decorative circles */}
                    <Box 
                        sx={{
                            position: 'absolute', 
                            top: '10%', 
                            right: '-50px', 
                            width: '300px', 
                            height: '300px', 
                            backgroundColor: '#9c27b0', // Matching the primary color
                            opacity: 0.5, // Light opacity for the decorative circle
                            borderRadius: '50%',
                            zIndex: 0
                        }} 
                    />
                     <Box 
                        sx={{
                            position: 'absolute', 
                            bottom: '-120px', 
                            left: '300px', 
                            width: '200px', 
                            height: '200px', 
                            backgroundColor: '#e1bee7', 
                            opacity: 0.4, // Light pastel effect
                            borderRadius: '50%', 
                            zIndex: 0
                        }} 
                    />
                    <Box 
                        sx={{
                            position: 'absolute', 
                            bottom: '10%', 
                            left: '-80px', 
                            width: '200px', 
                            height: '200px', 
                            backgroundColor: '#e1bee7', 
                            opacity: 0.4, // Light pastel effect
                            borderRadius: '50%', 
                            zIndex: 0
                        }} 
                    />
                </Grid>
            </Box>

            {/* Categories of FAQs */}
            <ScrollInView direction='bottom'>
            <Grid container spacing={4}>
                {faqCategories.map((category,index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card sx={{ 
                            p: 3, 
                            borderRadius: '12px', 
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', 
                            textAlign: 'center', 
                            backgroundColor: '#f5f5f5',
                            transition: 'transform 0.2s ease', // Subtle hover effect
                            '&:hover': {
                                transform: 'scale(1.02)',
                            }
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                                {category.category}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                {category.faqs.map((faq, idx) => (
                                    <Accordion
                                        key={idx}
                                        expanded={expanded === `panel${index}${idx}`}
                                        onChange={() => handleChange(`panel${index}${idx}`)} // Simplified onChange
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5',
                                            },
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<IconButton><ExpandMoreIcon /></IconButton>}
                                            aria-controls={`panel${index}${idx}-content`}
                                            id={`panel${index}${idx}-header`}
                                            sx={{ backgroundColor: '#f3f3f3', color: '#333' }}
                                        >
                                            <Typography>{faq.question}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ backgroundColor: '#fafafa' }}>
                                            <Typography sx={{textAlign:'left'}}>{faq.answer}</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            </ScrollInView>

            {/* Back to Home Button */}
            <Box sx={{ mt: 5, textAlign: 'center' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    href="/" 
                    sx={{ 
                        backgroundColor: '#9c27b0', 
                        padding: '10px 20px',
                        '&:hover': {
                            backgroundColor: '#7b1fa2',
                        }
                    }}
                >
                    Back to Home
                </Button>
            </Box>

        </Box>
        <Footer/>

        </>
    );
}

export default Faq;
