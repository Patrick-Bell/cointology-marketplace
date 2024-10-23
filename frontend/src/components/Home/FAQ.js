import { Box, Typography, Accordion, AccordionSummary, AccordionDetails,  } from "@mui/material"
import ScrollInView from "../animation/ScrollInView"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function FAQ() {

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
              FAQs
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





                <ScrollInView direction='top'>
            <Accordion sx={{margin: '5px 0'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          What is Cointology?
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
      </Accordion>
      </ScrollInView>

      <ScrollInView direction='top'>
      <Accordion sx={{margin: '5px 0'}}>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          How does the cash payment work?
        </AccordionSummary>
        <AccordionDetails>
          If you want to check out using cash, you select the cash option and fill out the form. Once completed, you will recieve a confirmation email and someone on our team will reach out regarding the collection details. Dependent on how far
          you live, it may take up to 2-3 days for your delivery to arrive. Cash deliveries hold a standard delivery fee of <strong>£1.99</strong> and failure to provide payment upon delivery can lead to your address being blacklisted.
        </AccordionDetails>
      </Accordion>
      </ScrollInView>

      <ScrollInView direction='top'>
      <Accordion sx={{margin: '5px 0'}}>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          How can I track my order?
        </AccordionSummary>
        <AccordionDetails>
          You will recieve emails throughout the order process. If you sign up, you track your package in real time and get more updated reports on the expected delivery date of your package.
        </AccordionDetails>
      </Accordion>
      </ScrollInView>
    </Box>
        
        
        </>
    )
}

export default FAQ