import { Box} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import Footer from '../Home/Footer';
import Features from '../Home/Features';
import AboutUs from '../Home/AboutUs';
import SwiperProducts from '../Home/SwiperProducts';
import SellCoin from '../Home/SellCoin';
import FAQ from '../Home/FAQ';
import Hero from '../Home/Hero';



function HomePage() {

    return (
        <>
        <Box sx={{overflow:'hidden', background:'black'}}>
            
            {/* Hero Section */}
            <Hero/>

            <ToastContainer />

            {/* About Us Section */}
            <AboutUs/>

            {/* Products Section */}
            <SwiperProducts />

            {/* Features Section */}
            <Features/>

            {/* Sell Your Coin Section */}
            <SellCoin/>
           
            {/* FAQ Section */}
            <FAQ/>

            {/* Footer Section */}
            <Footer/>

        </Box>

        </>
    );
}

export default HomePage;
