import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { api } from '../utils/api';

const BookingContext = createContext();

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  const [userBookings, setUserBookings] = useState([]);
  const [providerBookings, setProviderBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user bookings (services booked by current user)
  const fetchUserBookings = useCallback(async () => {
    if (!user?.email) {
      setUserBookings([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching user bookings for:', user.email);
      const bookings = await api.bookings.getUserBookings(user.email);
      
      console.log('✅ User bookings fetched:', bookings?.length || 0);
      setUserBookings(Array.isArray(bookings) ? bookings : []);
      
    } catch (err) {
      console.error('❌ Error fetching user bookings:', err);
      console.error('Full error details:', err);
      
      // More detailed error message
      let errorMessage = 'Failed to load user bookings';
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Make sure the server is running on port 3000.';
      } else if (err.message.includes('Authentication required')) {
        errorMessage = 'Please log in again to access your bookings.';
      } else {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      setUserBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  // Fetch provider bookings (services where current user is the provider)
  const fetchProviderBookings = useCallback(async () => {
    if (!user?.email) {
      setProviderBookings([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching provider bookings for:', user.email);
      const bookings = await api.bookings.getProviderBookings(user.email);
      
      console.log('✅ Provider bookings fetched:', bookings?.length || 0);
      setProviderBookings(Array.isArray(bookings) ? bookings : []);
      
    } catch (err) {
      console.error('❌ Error fetching provider bookings:', err);
      console.error('Full error details:', err);
      
      // More detailed error message
      let errorMessage = 'Failed to load provider bookings';
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Make sure the server is running on port 3000.';
      } else if (err.message.includes('Authentication required')) {
        errorMessage = 'Please log in again to access your bookings.';
      } else {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      setProviderBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  // Update booking status
  const updateBookingStatus = useCallback(async (bookingId, newStatus) => {
    console.log('🔄 Updating booking status:', bookingId, 'to', newStatus);
    
    try {
      await api.bookings.updateStatus(bookingId, { 
        status: newStatus,
        serviceStatus: newStatus 
      });
      
      console.log('✅ Status updated successfully');
      
      // Refresh both user and provider bookings to ensure sync
      await Promise.all([
        fetchUserBookings(),
        fetchProviderBookings()
      ]);
      
      return true;
      
    } catch (error) {
      console.error('❌ Error updating booking status:', error);
      throw error;
    }
  }, [fetchUserBookings, fetchProviderBookings]);

  // Refresh all bookings
  const refreshBookings = useCallback(async () => {
    console.log('🔄 Refreshing all bookings...');
    setError(null);
    
    try {
      await Promise.all([
        fetchUserBookings(),
        fetchProviderBookings()
      ]);
      console.log('✅ All bookings refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing bookings:', err);
      setError(`Failed to refresh bookings: ${err.message}`);
    }
  }, [fetchUserBookings, fetchProviderBookings]);

  // Add new booking to local state (for immediate UI update)
  const addBooking = useCallback((newBooking) => {
    console.log('➕ Adding new booking to local state:', newBooking);
    setUserBookings(prev => [newBooking, ...prev]);
  }, []);

  // Auto-fetch bookings when user changes
  useEffect(() => {
    if (user?.email) {
      console.log('👤 User changed, fetching bookings for:', user.email);
      refreshBookings();
    } else {
      console.log('👤 User logged out, clearing bookings');
      setUserBookings([]);
      setProviderBookings([]);
      setError(null);
    }
  }, [user?.email, refreshBookings]);

  const value = {
    // Data
    userBookings,
    providerBookings,
    
    // State
    loading,
    error,
    
    // Actions
    fetchUserBookings,
    fetchProviderBookings,
    updateBookingStatus,
    refreshBookings,
    addBooking // New function for immediate UI updates
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
