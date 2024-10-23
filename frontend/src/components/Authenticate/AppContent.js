import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, matchPath } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Import Helmet
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import ProductPage from '../pages/Product';
import Cart from '../pages/Cart';
import Dashboard from '../Admin/Dashboard';
import UserOrders from '../UserDashboard/UserOrders';
import ProtectedRoute from './ProtectedRoute';
import { AppBar, Toolbar, Button, Typography, Grid, Badge, Box } from '@mui/material';
import { useAuth } from '../context/AuthenticateContext';
import Login from '../pages/Login';
import NotFoundPage from '../pages/NotFoundPage';
import OrderDetail from '../Admin/OrderDetail';
import CashPayment from '../pages/CashPayment';
import Success from '../pages/Success';
import Cancel from '../pages/Cancel';
import UserDetail from '../Admin/UserDetail';
import ProductDetail from '../pages/ProductDetail';
import ReportDeail from '../Admin/ReportDetail';
import ProductReview from '../UserDashboard/ProductReview';
import HomePage from '../pages/HomePage';
import PublicNavbar from '../Navbars/PublicNavbar';
import UserNavbar from '../Navbars/UserNavbar';
import TrackPackage from '../UserDashboard/TrackPackage';
import UserDashboard from '../UserDashboard/UserDashboard';
import AdminNavbar from '../Navbars/AdminNavbar';
import Register from '../pages/Register';
import ResetPassword from '../pages/ResetPassword';
import ConfirmPassword from '../pages/ConfirmPassword';
import Shipping from '../pages/Shipping';
import Faq from '../pages/Faq';
import Img from '../styles/cointology-logo.png'

function AppContent() {
    const { isUserAuthenticated, isAdminAuthenticated, user, checkAuthStatus } = useAuth();
    const location = useLocation();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Determine the user role based on the authentication state
    const userRole = user?.role;

    let AppBarComponent;
    if (isAdminAuthenticated) {
        AppBarComponent = <AdminNavbar />;
    } else if (isUserAuthenticated) {
        AppBarComponent = <UserNavbar />;
    } else {
        AppBarComponent = <PublicNavbar />;
    }

    const noNavbarRoutes = ['/confirm-password/:token']; // Routes that should not show navbar
    const shouldShowNavbar = !noNavbarRoutes.some(route => matchPath(route, location.pathname));

    // Define titles and meta descriptions for each route
    const getPageMeta = (path) => {

        if (matchPath("/product/:id", path)) {
            return { title: 'Product Details', description: 'View details of the selected product' };
        }

        if (matchPath("/cash-payment/:id", path)) {
            return { title: 'Cash Checkout', description: 'Checkout with Cash Payment' }
        }

        if (matchPath("/confirm-password/:token", path)) {
            return { title: "Confirm Password", description: 'Confirm new password'  }
        }

        switch (path) {
            case '/':
                return { title: 'Home Page', description: 'Welcome to our Home Page' };
            case '/cart':
                return { title: 'Shopping Cart', description: 'Your cart items' };
            case '/products':
                return { title: 'Products', description: 'View all products' }
            case '/login':
                return { title: 'Login', description: 'Login to your account' };
            case '/reset-password':
                return { title: 'Reset Password', description: 'Reset password' };
            case '/register':
                return { title: 'Register', description: 'Create a new account' };
            case '/dashboard':
                return { title: 'Admin Dashboard', description: 'Admin Management Dashboard' };
            case '/faq':
                return { title: 'Frequently Asked Questions', description: 'Get answers to common questions' };
            case '/my-dashboard':
                return { title: `${user.name}'s Dashboard`, description: 'Your personal dashboard' };
            case '/shipping':
                return { title: 'Shipping & Delivery', description: 'Shipping, Delivery & Payment' };
            case '/cancel':
                return { title: 'Payment Cancelled', description: 'Card Payment Cancelled' }
            case '/success':
                return { title: 'Payment Successful', description: 'Card Payment Successful'}
            default:
                return { title: 'Page Not Found', description: 'Oops! This page does not exist.' };
        }
    };

    // Get the current path and its corresponding meta data
    const { title, description } = getPageMeta(location.pathname);

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                {/* You can also add icons or other meta tags here */}
                <link rel="icon" href={Img} />
            </Helmet>

            {shouldShowNavbar && AppBarComponent}

            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path='/cash-payment/:id' element={<CashPayment />} />
                <Route path='/success' element={<Success />} />
                <Route path='/product/:id' element={<ProductDetail />} />
                <Route path='/products' element={<ProductPage />} />
                <Route path='/register' element={<Register />} />
                <Route path='/cancel' element={<Cancel />} />
                <Route path='/reset-password/' element={<ResetPassword />} />
                <Route path='/confirm-password/:token' element={<ConfirmPassword />} />
                <Route path='/shipping' element={<Shipping />} />
                <Route path='/faq' element={<Faq />} />

                {/* User-Only Routes (Protected) */}
                <Route
                    path="/my-dashboard"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isUserAuthenticated}
                            requiredRole="user"
                            userRole={userRole}
                        >
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Admin-Only Routes (Protected) */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAdminAuthenticated}
                            requiredRole="admin"
                            userRole={userRole}
                        >
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders/:id"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAdminAuthenticated}
                            requiredRole="admin"
                            userRole={userRole}
                        >
                            <OrderDetail />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users/:id"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAdminAuthenticated}
                            requiredRole="admin"
                            userRole={userRole}
                        >
                            <UserDetail />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports/:id"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAdminAuthenticated}
                            requiredRole="admin"
                            userRole={userRole}
                        >
                            <ReportDeail />
                        </ProtectedRoute>
                    }
                />

                <Route path="/not-authorized" element={<NotFoundPage />} />

                {/* Catch all invalid routes */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default AppContent;
