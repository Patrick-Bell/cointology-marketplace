import React from 'react';
import {
  Box, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PolicyIcon from '@mui/icons-material/Policy';
import Image from '../styles/shipping-footer.webp'; // Assuming you have this image
import shippingImage from '../styles/shipping-picture.png';
import Footer from '../Home/Footer';
import ScrollInView from '../animation/ScrollInView';
import VisaImg from '../styles/visa.avif'
import MasterCardImg from '../styles/mastercard.avif'
import AmericanExpressImg from '../styles/american-express.avif'
import ApplyPayImg from '../styles/apple-pay.avif'
import KlarnaImg from '../styles/klarna.avif'

const Shipping = () => {

  // Shipping Methods Data
  const shippingMethods = [
    { method: 'Standard (Cash)', cost: '£1.99', delivery: '2-3 Business Days' },
    { method: 'Standard', cost: 'Free', delivery: '5-7 Business Days' },
    { method: 'Premium', cost: '£5.00', delivery: '3-5 Business Days' },
    { method: 'Next Day', cost: '£7.50', delivery: 'Next Business Day' }
  ];

  const paymentMethods = [
    { image: VisaImg, desc: 'We accept Visa Payments' },
    { image: MasterCardImg, desc: 'We accept Mastercard Payments' },
    { image: AmericanExpressImg, desc: 'We accept American Express Payments' },
    { image: ApplyPayImg, desc: 'We do not accept Apple Pay but are working to integrate this' },
    { image: KlarnaImg, desc: 'We do not accept Klarna Pay and have no plans on integrating this' },
  ]

  // Returns Policy Information
  const returnsPolicy = [
    { point: 'Return Period', description: 'Items can be returned within 30 days of delivery.' },
    { point: 'Condition', description: 'Items must be in original condition with documentation / box.' },
    { point: 'Return Shipping', description: 'Free return shipping on defective or incorrect items.' },
    { point: 'Refund Processing', description: 'Refunds processed within 5-7 business days after receipt.' },
    { point: 'Non-refundable Items', description: 'Personalized and intimate items cannot be returned. Also, items are that randomised cannot be returned unless the item is damaged.' }
  ];

  // Additional Policies
  const additionalPolicies = [
    { title: 'Order Processing Time', content: 'All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.' },
    { title: 'International Shipping', content: 'We currently do not support international shipping. We can only deliver within the UK.' },
    { title: 'Tracking Information', content: 'You will receive an email with tracking information after your order ships. Sign in to track your package anytime or receive updates via email.' },
    { title: 'Shipping to Incorrect Addresses', content: 'Please ensure your shipping address is correct. We are not responsible for orders shipped to incorrect addresses due to customer error.' }
  ];

  return (
    <>
      {/* Hero Image and Title Section */}
      <Box
        sx={{
          height: '30vh',
          backgroundImage: `url(${Image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          textAlign: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h3"
          component="div"
          fontWeight="bold"
          sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', px: 2, py: 1 }}
        >
          Shipping & Delivery
        </Typography>
      </Box>

      {/* Main Content Section */}
      
      <Box sx={{ background: '#fbfdec', padding: 4 }}>
        <Grid container spacing={3}>

          {/* Shipping Methods Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '20px 0' }}>
              <Box sx={{ width: '25px', height: '25px', backgroundColor: '#9c27b0', margin: '0 10px' }} />
              <Typography variant="h4">Shipping</Typography>
            </Box>

            <Typography sx={{ marginBottom: '10px' }}>
              We offer four shipping methods. For cash payments, we provide one standard method, while card payments have three options. See the table below for details.
            </Typography>

            <TableContainer component={Paper}>
                <ScrollInView direction='bottom'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Shipping Method</TableCell>
                    <TableCell align="right">Cost</TableCell>
                    <TableCell align="right">Estimated Delivery</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shippingMethods.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.method}</TableCell>
                      <TableCell align="right">{row.cost}</TableCell>
                      <TableCell align="right">{row.delivery}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </ScrollInView>
            </TableContainer>

            
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '20px 0' }}>
              <Box sx={{ width: '25px', height: '25px', backgroundColor: '#9c27b0', margin: '0 10px' }} />
              <Typography variant="h4">Payments</Typography>
            </Box>

            <Typography sx={{ marginBottom: '10px' }}>
              We only accept cash payments for our cash on delivery orders. Below is more information on the card payment types we accept and do not accept.
            </Typography>

            <TableContainer component={Paper}>
            <ScrollInView direction='bottom'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Payment Types</TableCell>
                    <TableCell align="right">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentMethods.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell><img style={{height:'20px', width:'auto'}} src={row.image}></img></TableCell>
                      <TableCell align="right">{row.desc}</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </ScrollInView>
            </TableContainer>


          </Grid>

          {/* Shipping Image Section */}
          <Grid item xs={12} md={6}>
            <img
              style={{
                width: '100%', // Responsive width
                borderRadius: '10px', // Rounded corners
                boxShadow: 2,
              }}
              src={shippingImage}
              alt="Shipping"
            />
          </Grid>
        </Grid>



        {/* Returns and Refunds Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '20px 0' }}>
            <Box sx={{ width: '25px', height: '25px', backgroundColor: '#9c27b0', margin: '0 10px' }} />
            <Typography variant="h4">Returns & Refunds</Typography>
          </Box>

          <TableContainer component={Paper}>
            <ScrollInView direction='left'>
            <Table>
              <TableBody>
                {returnsPolicy.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell><strong>{row.point}</strong></TableCell>
                    <TableCell>{row.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </ScrollInView>
          </TableContainer>

          <Box mt={3}>
            <Typography variant="body1">
              If you have any questions about returns, please contact our support team at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>.
            </Typography>
            <ScrollInView direction='bottom'>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Start a Return
            </Button>
            </ScrollInView>
          </Box>
        </Grid>



        {/* Additional Shipping Policies Section */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '20px 0' }}>
            <Box sx={{ width: '25px', height: '25px', backgroundColor: '#9c27b0', margin: '0 10px' }} />
            <Typography variant="h4">Additional Shipping Policies</Typography>
          </Box>

          {additionalPolicies.map((policy, index) => (
            <ScrollInView direction='bottom'>
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography><strong>{policy.title}</strong></Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{policy.content}</Typography>
              </AccordionDetails>
            </Accordion>
            </ScrollInView>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Shipping;
