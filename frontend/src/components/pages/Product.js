import React, { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    AppBar,
    Button,
    Toolbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../context/AuthenticateContext';
import { usePagination } from '../context/PaginationContext';
import { fetchData } from '../../utils/ProductPageFunctions';
import FilterProduct from '../Reuseable/FilterProduct';
import Pages from '../Reuseable/Pages';
import ScrollInView from '../animation/ScrollInView';
import CancelIcon from '@mui/icons-material/Cancel';

function Product() {
    // State variables
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [sortOption, setSortOption] = useState(''); // Default sort option
    const [open, setOpen] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favourites, setFavourites] = useState([]);

    // Contexts
    const { isUserAuthenticated, checkAuthStatus } = useAuth();
    const { currentPage, setCurrentPage, productsPerPage } = usePagination();

    const goToTop = () => {
      window.scrollTo({ top: 0, behavior:'smooth'})
    }

    useEffect(() => {
      goToTop()
    }, [currentPage, open])

    // Check user authentication status
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchData(setLoading, setAllProducts, setError, isUserAuthenticated, setFavourites);
    }, [isUserAuthenticated]);

    // Open/close filter dialog
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    // Filter and sort logic
    const colors = ['bronze', 'silver', 'gold'];
    const ratings = [1, 2, 3, 4, 5];
    const categories = [...new Set(allProducts.map((p) => p.category))];
    const tags = [...new Set(allProducts.flatMap((p) => p.tags))];

    // Calculate average rating of a product
    const calculateAverageRating = (ratings) => {
        if (!Array.isArray(ratings) || ratings.length === 0) return 0;

        const totalRating = ratings.reduce((acc, item) => acc + item.rating_number, 0);
        return totalRating / ratings.length;
    };

    // Filter products based on selected filters
    const filteredProducts = allProducts.filter((product) => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const tagMatch = selectedTags.length === 0 || selectedTags.some((tag) => product.tags.includes(tag));
        const ratingMatch = selectedRatings.length === 0 || selectedRatings.some(selectedRating => {
            const averageRating = calculateAverageRating(product.ratings);
            return Math.round(averageRating) === Math.round(selectedRating);
        });
        const colorMatch = selectedColors.length === 0 || selectedColors.some((color) => product.color.includes(color));

        return categoryMatch && tagMatch && ratingMatch && colorMatch;
    });

    // Sort products based on selected sorting option
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
    });

    // Pagination products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Check if a product is in the favourites
    const isProductFavourite = (productId) => {
        return isUserAuthenticated && Array.isArray(favourites) ? favourites.includes(productId) : false;
    };

    // Loading and Error handling in render
    if (loading) return <Typography variant="h6">Loading products...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    // Main return
    return (
        <>
            <ToastContainer />
            <Box display="flex" sx={{ fontFamily: 'Arial, sans-serif', height: '100vh' }}>
                {/* Sidebar for filters on larger screens */}
                <Box
                    sx={{
                        width: '250px',
                        padding: '20px',
                        borderRight: '1px solid lightgrey',
                        position: 'fixed',
                        height: '100%',
                        overflowY: 'auto',
                        bgcolor: '#f9f9f9',
                        marginTop: '50px',
                        display: { xs: 'none', sm: 'block' },
                    }}
                >
                    <FilterProduct
                        categories={categories}
                        tags={tags}
                        colors={colors}
                        ratings={ratings}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        selectedColors={selectedColors}
                        setSelectedColors={setSelectedColors}
                        selectedRatings={selectedRatings}
                        setSelectedRatings={setSelectedRatings}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        setCurrentPage={setCurrentPage}
                    />
                </Box>

                {/* Main product display area */}
                <Box
                    sx={{
                        flex: 1,
                        marginLeft: { xs: 0, sm: '290px' },
                        marginTop: '50px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* No products found */}
                    {currentProducts.length === 0 ? (
                        <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          height: '100%', 
                          padding: '20px', 
                          textAlign: 'center' 
                        }}
                      >
                        <CancelIcon fontSize='large' sx={{color:'GrayText', fontSize:'150px'}} />
                        <Typography 
                          variant="h6" 
                          color="textSecondary" 
                          sx={{ marginBottom: '10px' }}
                        >
                          No Products Found
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          Try adjusting your filters or check back later.
                        </Typography>
                      </Box>
                      
                    ) : (
                        <>
                            <Box fullWidth sx={{ display: 'flex', textAlign: 'left', justifyContent: 'space-evenly', p: 4 }}>
                                <Typography variant="subtitle1">
                                Showing {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, sortedProducts.length)} of <strong>{sortedProducts.length}</strong> products
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {currentProducts.map((product) => (
                                    <ScrollInView direction='bottom'>
                                    <Box key={product.id} sx={{ margin: '10px' }}>
                                        <ProductCard product={product} isFavourite={isProductFavourite(product.id)} />
                                    </Box>
                                    </ScrollInView>
                                ))}
                            </Box>
                        </>
                    )}

                    <Pages currentPage={currentPage} sortedProducts={sortedProducts} setCurrentPage={setCurrentPage} productsPerPage={productsPerPage} />
                </Box>

                {/* Mobile filter button */}
                <Box sx={{ position: 'fixed', bottom: '25px', right: '25px', background: '#9c27b0', borderRadius: '50%', display: { xs: 'block', sm: 'none' } }}>
                    <IconButton onClick={handleOpen}>
                        <FilterAltIcon sx={{ color: 'white' }} />
                    </IconButton>
                </Box>

                {/* Mobile filter dialog */}
                <Dialog fullScreen open={open} onClose={handleClose}>
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Filter
                            </Typography>
                            <Button autoFocus color="inherit" onClick={handleClose}>
                                Apply
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
                        <FilterProduct
                            categories={categories}
                            tags={tags}
                            colors={colors}
                            ratings={ratings}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                            selectedColors={selectedColors}
                            setSelectedColors={setSelectedColors}
                            selectedRatings={selectedRatings}
                            setSelectedRatings={setSelectedRatings}
                            sortOption={sortOption}
                            setSortOption={setSortOption}
                            setCurrentPage={setCurrentPage}
                        />
                    </Box>
                </Dialog>
            </Box>
        </>
    );
}

export default Product;
