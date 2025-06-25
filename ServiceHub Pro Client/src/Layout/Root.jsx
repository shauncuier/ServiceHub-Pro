import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { ThemeProvider } from '../Context/ThemeContext';
import { AuthProvider } from '../Auth/AuthContext';
import { BookingProvider } from '../Context/BookingContext';

const Root = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BookingProvider>
                    <div className="min-h-screen bg-base-100 text-base-content">
                        <Navbar />
                        <main>
                            <Outlet />
                        </main>
                        <Footer />
                    </div>
                </BookingProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default Root;
