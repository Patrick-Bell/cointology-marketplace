import axios from 'axios'


// fetch favourites
export const fetchFavs = async (setFavourites, setError) => {
    try {
      const response = await axios.get('/api/favourites', { withCredentials: true });
      setFavourites(response.data || []);  // Make sure to handle empty or undefined data
    } catch (error) {
      console.error('Failed to load favourites:', error);
      setError('Failed to load favourites');
    }
  };


// Fetch Products
export const fetchProducts = async (setAllProducts, setError) => {
    try {
      const response = await axios.get('/api/products');
      setAllProducts(response.data || []); // Fallback to empty array if undefined
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
      setError('Failed to load products');
    }
  };


export const fetchData = async (setLoading, setAllProducts, setError, isUserAuthenticated, setFavourites) => {
    setLoading(true);
    try {
      await fetchProducts(setAllProducts, setError);

      // Fetch favourites only if user is authenticated
      if (isUserAuthenticated) {
         fetchFavs(setFavourites, setError);
      }
    } catch (e) {
      console.error('Fetch error:', e);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

