import { useState, useEffect, createContext, useContext } from 'react';

// Create the Pagination Context
const PaginationContext = createContext();

// Create a PaginationProvider component
export const PaginationProvider = ({ children, totalProducts }) => {
    // State for current page and products per page
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(9); // Default products per page
   

    // Provide the context value
    return (
        <PaginationContext.Provider
            value={{
                currentPage,
                setCurrentPage,
                productsPerPage,
                setProductsPerPage, // Allows dynamic adjustment of products per page
            }}
        >
            {children}
        </PaginationContext.Provider>
    );
};

// Custom hook to use PaginationContext
export const usePagination = () => {
    const context = useContext(PaginationContext);

    // Ensure usePagination is used within a PaginationProvider
    if (!context) {
        throw new Error('usePagination must be used within a PaginationProvider');
    }

    return context;
};
