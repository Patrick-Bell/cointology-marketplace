import { useState, useEffect } from 'react'
import { Box, Typography,  } from "@mui/material"
import ScrollInView from "../animation/ScrollInView"
import HomeProductCard from "../ProductCard/HomeProductCard"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import axios from 'axios';

function SwiperProducts() {
    const [products, setProducts] = useState([])

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products')
            console.log(response.data)
            const products = response.data
            const saleProducts = products.filter(item => item.tags.includes('limited'))
            setProducts(saleProducts)

        }catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])


    return (

        <>

<Box sx={{ padding: '40px', background:'white' }}>

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
    Products
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


{/* Wrap Swiper in ScrollInView for animation on scroll */}
<ScrollInView direction="left">
    <Box
        sx={{
            display: 'flex', // Use flex to center the Swiper
            justifyContent: 'center', // Center horizontally
            alignItems: 'center', // Center vertically if needed
            overflow: 'hidden', // Prevent horizontal scroll
            paddingBottom: '40px', // Adds space at the bottom of the Swiper
        }}
    >
        <Swiper
            spaceBetween={20} // Space between slides
            loop={true} // Enable infinite loop mode
            pagination={{ clickable: true, el: '.custom-pagination' }} // Enable clickable pagination
            navigation // Enable navigation buttons
            modules={[Navigation, Pagination]} // Register modules here
            style={{ width: '100%', padding: '20px 0' }} // Max width for Swiper
            breakpoints={{
                // Define breakpoints for different screen sizes
                640: {
                    slidesPerView: 1, // 1 slide on small screens
                },
                768: {
                    slidesPerView: 2, // 2 slides on medium screens
                },
                1024: {
                    slidesPerView: 3, // 3 slides on larger screens
                },
                1280: {
                    slidesPerView: 4, // 4 slides on extra-large screens
                },
            }}
        >
            {Array.isArray(products) && products.length > 0 ? (
                products.map((item, i) => (
                    <SwiperSlide key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <HomeProductCard product={item} />
                    </SwiperSlide>
                ))
            ) : (
                <SwiperSlide>
                    <Typography align='center'>No products available at this time.</Typography>
                </SwiperSlide>
            )}
        </Swiper>
    </Box>
</ScrollInView>

{/* Pagination Box Below the Swiper */}
<Box
    className="custom-pagination" // Use a custom class for pagination
    sx={{
        textAlign: 'center',
        '& .swiper-pagination-bullet': {
            width: '12px',
            height: '12px',
            background: 'gray', // Default bullet color
        },
        '& .swiper-pagination-bullet-active': {
            background: '#9c27b0', // Active bullet color
        },
    }}
/>
</Box>
        
        </>
    )
}

export default SwiperProducts