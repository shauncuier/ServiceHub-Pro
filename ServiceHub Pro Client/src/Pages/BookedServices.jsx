import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, MapPin, Phone, Mail, Star, RefreshCw, AlertCircle, CheckCircle, PlayCircle, PauseCircle, Timer } from 'lucide-react';
import { useBookings } from '../Context/BookingContext';
import { useAuth } from '../Auth/AuthContext';
import { api } from '../utils/api';
import usePageTitle from '../hooks/usePageTitle';
import Swal from 'sweetalert2';

const BookedServices = () => {
  usePageTitle('Booked Services');
  const { userBookings, loading, error, refreshBookings } = useBookings();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  // Force refresh when component mounts to ensure latest data
  useEffect(() => {
    const forceRefresh = async () => {
      console.log('🔄 BookedServices mounted - forcing refresh...');
      await refreshBookings();
    };
    
    forceRefresh();
  }, [refreshBookings]);

  // Use userBookings directly with proper status field mapping
  const bookings = userBookings.map(booking => ({
    _id: booking._id,
    serviceId: booking.serviceId,
    serviceName: booking.serviceName,
    serviceImage: booking.serviceImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    price: booking.price || booking.servicePrice || 0,
    providerName: booking.providerName,
    providerEmail: booking.providerEmail,
    providerPhone: booking.providerPhone || 'Not provided',
    providerImage: booking.providerImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    serviceArea: booking.serviceArea || 'Location not specified',
    status: booking.status || booking.serviceStatus || 'pending', // Use both field names
    bookedAt: new Date(booking.bookedAt || Date.now()),
    completedAt: booking.completedAt ? new Date(booking.completedAt) : null,
    estimatedTime: booking.estimatedTime || '2-3 hours',
    customerNotes: booking.specialInstruction || booking.customerNotes || ''
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'working': return 'badge-info';
      case 'completed': return 'badge-success';
      default: return 'badge-neutral';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'working': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <PauseCircle className="w-4 h-4" />;
      case 'working': return <PlayCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Timer className="w-4 h-4" />;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pending': return 'Waiting for service provider to start work';
      case 'working': return 'Service provider is currently working on your request';
      case 'completed': return 'Service has been completed successfully';
      default: return 'Status information';
    }
  };

  const getCardBorderColor = (status) => {
    switch (status) {
      case 'pending': return 'border-l-warning border-l-4';
      case 'working': return 'border-l-info border-l-4';
      case 'completed': return 'border-l-success border-l-4';
      default: return 'border-l-base-300 border-l-4';
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  const handleCancelBooking = async (bookingId, serviceName) => {
    const result = await Swal.fire({
      title: 'Cancel Booking',
      text: `Are you sure you want to cancel your booking for "${serviceName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      try {
        // Delete booking via API
        await api.bookings.delete(bookingId);
        
        // Refresh bookings from shared context
        await refreshBookings();
        
        Swal.fire({
          icon: 'success',
          title: 'Booking Cancelled',
          text: 'Your booking has been cancelled successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error cancelling booking:', err);
        Swal.fire({
          icon: 'error',
          title: 'Cancellation Failed',
          text: err.message || 'Unable to cancel the booking. Please try again.',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  const handleLeaveReview = async (booking) => {
    const { value: formValues } = await Swal.fire({
      title: 'Leave a Review',
      html: `
        <div class="text-left space-y-4">
          <p class="mb-4 text-gray-700">How was your experience with <strong>${booking.serviceName}</strong>?</p>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2 text-gray-700">Rating</label>
            <select id="rating" class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
              <option value="4">⭐⭐⭐⭐ Good (4/5)</option>
              <option value="3">⭐⭐⭐ Average (3/5)</option>
              <option value="2">⭐⭐ Poor (2/5)</option>
              <option value="1">⭐ Very Poor (1/5)</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2 text-gray-700">Review Title</label>
            <input 
              type="text" 
              id="reviewTitle" 
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Brief title for your review"
              maxlength="100"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700">Review Comment</label>
            <textarea 
              id="reviewComment" 
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Share your detailed experience..." 
              rows="4"
              maxlength="500"
            ></textarea>
            <div class="text-xs text-gray-500 mt-1">Maximum 500 characters</div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit Review',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6b7280',
      width: '500px',
      preConfirm: () => {
        const rating = document.getElementById('rating').value;
        const title = document.getElementById('reviewTitle').value.trim();
        const comment = document.getElementById('reviewComment').value.trim();
        
        if (!comment) {
          Swal.showValidationMessage('Please write a review comment');
          return false;
        }
        
        if (comment.length < 10) {
          Swal.showValidationMessage('Review comment must be at least 10 characters long');
          return false;
        }
        
        return { 
          rating: parseInt(rating), 
          title: title || `Review for ${booking.serviceName}`,
          comment: comment 
        };
      }
    });

    if (formValues) {
      try {
        // Show loading
        Swal.fire({
          title: 'Submitting Review...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Prepare review data
        const reviewData = {
          serviceId: booking.serviceId,
          serviceName: booking.serviceName,
          bookingId: booking._id,
          providerEmail: booking.providerEmail,
          providerName: booking.providerName,
          customerEmail: user?.email,
          customerName: user?.displayName || user?.name,
          rating: formValues.rating,
          title: formValues.title,
          comment: formValues.comment,
          reviewDate: new Date().toISOString()
        };

        console.log('📝 Submitting review:', reviewData);

        // Submit review via API
        const result = await api.reviews.create(reviewData);
        
        console.log('✅ Review submitted successfully:', result);

        Swal.fire({
          icon: 'success',
          title: 'Review Submitted!',
          html: `
            <div class="text-center">
              <p class="mb-2">Thank you for your feedback!</p>
              <div class="flex justify-center items-center gap-1 mb-2">
                ${Array.from({length: formValues.rating}, () => '⭐').join('')}
              </div>
              <p class="text-sm text-gray-600">Your review helps other customers make informed decisions.</p>
            </div>
          `,
          timer: 3000,
          showConfirmButton: false
        });

      } catch (err) {
        console.error('❌ Error submitting review:', err);
        
        Swal.fire({
          icon: 'error',
          title: 'Review Submission Failed',
          text: err.message || 'Unable to submit your review. Please try again later.',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  // Manual refresh handler
  const handleManualRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    await refreshBookings();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center pt-20">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 pt-20 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-base-content">My Booked Services</h1>
            <button 
              onClick={handleManualRefresh}
              className="btn btn-circle btn-outline btn-sm"
              title="Refresh bookings"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <p className="text-lg text-base-content/70">
            View all services you have booked and track their progress. Only your bookings are shown here.
          </p>
          
          {/* Error Display */}
          {error && (
            <div className="alert alert-error shadow-lg max-w-md mx-auto mt-4">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Error Loading Bookings</h3>
                <div className="text-xs">{error}</div>
              </div>
              <button 
                onClick={handleManualRefresh} 
                className="btn btn-sm btn-outline"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {/* Real-time data indicator */}
          {!loading && !error && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-base-content/60">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="tabs tabs-boxed mb-8 justify-center">
          <button 
            className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({bookings.length})
          </button>
          <button 
            className={`tab ${filter === 'pending' ? 'tab-active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button 
            className={`tab ${filter === 'working' ? 'tab-active' : ''}`}
            onClick={() => setFilter('working')}
          >
            In Progress ({bookings.filter(b => b.status === 'working').length})
          </button>
          <button 
            className={`tab ${filter === 'completed' ? 'tab-active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({bookings.filter(b => b.status === 'completed').length})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Calendar className="mx-auto h-12 w-12 text-base-content/30 mb-4" />
              <h3 className="text-lg font-medium text-base-content mb-2">
                {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
              </h3>
              <p className="text-base-content/70 mb-6">
                {filter === 'all' 
                  ? 'Start by booking your first service from our marketplace.'
                  : `You don't have any ${filter} bookings at the moment.`
                }
              </p>
              <button 
                onClick={handleManualRefresh}
                className="btn btn-outline btn-primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Check for New Bookings
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className={`card bg-base-100 shadow-xl border border-base-300 ${getCardBorderColor(booking.status)}`}>
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Service Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceName}
                        className="w-full lg:w-48 h-32 lg:h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="card-title text-xl">{booking.serviceName}</h2>
                        <div className={`badge ${getStatusColor(booking.status)} badge-lg flex items-center gap-1`}>
                          {getStatusIcon(booking.status)}
                          {getStatusText(booking.status)}
                        </div>
                      </div>

                      {/* Status Description */}
                      <div className="mb-4">
                        <p className="text-sm text-base-content/60 italic">
                          {getStatusDescription(booking.status)}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-primary">৳{booking.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-base-content/60" />
                          <span className="text-base-content/70">{booking.serviceArea}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-base-content/60" />
                          <span className="text-base-content/70">
                            Booked: {booking.bookedAt.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-base-content/60" />
                          <span className="text-base-content/70">
                            Est. Time: {booking.estimatedTime}
                          </span>
                        </div>
                      </div>

                      {/* Provider Info */}
                      <div className="flex items-center gap-3 mb-4 p-3 bg-base-200 rounded-lg">
                        <img
                          src={booking.providerImage}
                          alt={booking.providerName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-base-content">{booking.providerName}</p>
                          <div className="flex items-center gap-4 text-sm text-base-content/60">
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{booking.providerPhone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{booking.providerEmail}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Customer Notes */}
                      {booking.customerNotes && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-base-content/80 mb-1">Your Notes:</p>
                          <p className="text-sm text-base-content/70 italic">"{booking.customerNotes}"</p>
                        </div>
                      )}

                      {/* Completion Date */}
                      {booking.status === 'completed' && booking.completedAt && (
                        <div className="mb-4">
                          <p className="text-sm text-success">
                            ✓ Completed on {booking.completedAt.toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id, booking.serviceName)}
                            className="btn btn-outline btn-error btn-sm"
                          >
                            Cancel Booking
                          </button>
                        )}
                        
                        {booking.status === 'completed' && (
                          <button
                            onClick={() => handleLeaveReview(booking)}
                            className="btn btn-primary btn-sm hover:scale-105 transition-transform"
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Leave Review
                          </button>
                        )}

                        <button
                          onClick={() => window.open(`tel:${booking.providerPhone}`)}
                          className="btn btn-outline btn-sm"
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call Provider
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedServices;
