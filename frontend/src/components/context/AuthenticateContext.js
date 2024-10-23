import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthenticateProvider = ({ children }) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start loading as true

    const checkAuthStatus = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get('/api/check-auth', { withCredentials: true });
            const userData = response.data;
            console.log(userData)

            if (userData?.user) {
                setUser(userData.user); // Set user state with the entire user object
                if (userData.user.role === 'admin') {
                    setIsAdminAuthenticated(true);
                    setIsUserAuthenticated(true); // Set both true if admin
                    console.log(`Admin logged in`);
                } else if (userData.user.role === 'user') {
                    setIsUserAuthenticated(true);
                    setIsAdminAuthenticated(false);
                    console.log(`User logged in`);
                }
            } else {
                setUser(null); // Clear user
                setIsUserAuthenticated(false);
                setIsAdminAuthenticated(false);
                console.log('No valid session found');
            }
        } catch (e) {
            console.error('Failed to check auth status', e);
            setIsUserAuthenticated(false);
            setIsAdminAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false); // End loading
        }
    };

    const signin = async (email, password) => {
        try {
            const response = await axios.post('/api/login', { email, password }, { withCredentials: true });
            const userData = response.data;
            const message = response.data.message
            console.log('le message', message)
            console.log(userData)

            if (userData.user) {
                setUser(userData.user); // Store user information
                if (userData.user.role === 'admin') {
                    setIsAdminAuthenticated(true);
                    setIsUserAuthenticated(true); // Set both true if admin
                    console.log(`Logged in as admin`);
                } else if (userData.user.role === 'user') {
                    setIsUserAuthenticated(true);
                    setIsAdminAuthenticated(false);
                    console.log(`Logged in as user`);
                }
            }

            return userData

        } catch (e) {
            console.error("Login error:", e);
            setIsUserAuthenticated(false);
            setIsAdminAuthenticated(false);
            setUser(null); // Clear user state on login failure

            throw e; // This will allow the catch block in handleSubmit to trigger

        }

    };

    const signout = async () => {
        try {
            await axios.post('/api/logout', {}, { withCredentials: true });
            console.log("Logout successful");
            setUser(null);
            setIsUserAuthenticated(false);
            setIsAdminAuthenticated(false);
        } catch (e) {
            console.error("Logout error:", e);
        }
    };

    return (
        <AuthContext.Provider value={{ signin, signout, user, isUserAuthenticated, isAdminAuthenticated, checkAuthStatus, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
