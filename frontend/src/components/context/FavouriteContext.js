import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const FavouriteContext = createContext();

export const FavouriteProvider = ({ children }) => {
    const [favourites, setFavourites] = useState([]); // Initial state is an empty array

    // Function to fetch favourites from the server
    const fetchFavourites = async () => {
        try {
            const response = await axios.get('/api/favourites', { withCredentials: true }); // Adjust API endpoint as needed
            setFavourites(response.data)
        } catch (error) {
            console.error('Error fetching favourites:', error);
            setFavourites([]); // Set to empty array on error
        }
    };


    const fetchUserFavourites = async () => {
        try {
            const response = await axios.get('/api/user-favourites', { withCredentials: true }); // Adjust API endpoint as needed
            setFavourites(response.data); // Ensure favourites is an array
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching favourites:', error);
            setFavourites([]); // Set to empty array on error
        }
    };
    

    // Add a product to favourites
    const addToFavourites = async (productId) => {
        try {
            const response = await axios.post(`/api/add-to-favourites/${productId}`, null, { withCredentials: true });
            console.log(response.data);
            await fetchFavourites(); // Update the favourites list
            toast.success('Product added to favourites!')
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message)
        }
    };

    // Remove a product from favourites
    const removeFromFavourites = async (productId) => {
        try {
            const response = await axios.delete(`/api/remove-from-favourites/${productId}`, { withCredentials: true });
            console.log(response.data);
            await fetchFavourites(); // Update the favourites list
        } catch (error) {
            console.error(error);
        }
    };

   
    // Provide context values
    return (
        <>
            <FavouriteContext.Provider value={{ favourites, addToFavourites, removeFromFavourites, fetchFavourites, fetchUserFavourites }}>
                {children}
            </FavouriteContext.Provider>
        </>
    );
};

// Custom hook to use the Favourite Context
export const useFavourite = () => {
    const context = useContext(FavouriteContext);
    if (!context) {
        throw new Error('useFavourite must be used within a FavouriteProvider');
    }
    return context;
};
