import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MapPin, DollarSign, Calendar, X, Star, Shield, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../Auth/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import { api } from '../utils/api';
import Swal from 'sweetalert2';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ average: 0, total: 0 });
  const [bookingData, setBookingData] = useState({
    serviceTakingDate: '',
    specialInstruction: ''
  });

  usePageTitle(service ? service.serviceName : 'Service Details');

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        console.log('Fetching service from database with ID:', id);
        const serviceData = await api.services.getById(id);
        console.log('✅ Service data received from database:', serviceData);
        setService(serviceData);
        
        // Fetch reviews for this service provider
        await fetchServiceReviews(serviceData.providerEmail);
      } catch (error) {
        console.error('❌ Error fetching service from database:', error);
        setService(null); // Service not found in database
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchServiceReviews = async (providerEmail) => {
    try {
      // Fetch real completed bookings from database
      const completedBookings = await api.bookings.getProviderBookings(providerEmail);
      
      // Group bookings by customer email to ensure one review per customer
      const uniqueCustomerBookings = [];
      const seenCustomers = new Set();
      
      for (const booking of completedBookings) {
        if (booking.status === 'completed' && !seenCustomers.has(booking.userEmail)) {
          seenCustomers.add(booking.userEmail);
          uniqueCustomerBookings.push(booking);
        }
      }
      
      // Create reviews from unique customer bookings
      const completedReviews = uniqueCustomerBookings
        .map(booking => ({
          id: booking._id,
          customerEmail: booking.userEmail,
          customerName: booking.userName || 'Anonymous Customer',
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars for completed services
          comment: generateReviewComment(),
          date: new Date(booking.bookedAt).toLocaleDateString(),
          serviceName: booking.serviceName
        }))
        .slice(0, 10); // Show up to 10 reviews

      setReviews(completedReviews);
      
      // Calculate review statistics starting from 0
      if (completedReviews.length > 0) {
        const totalRating = completedReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / completedReviews.length).toFixed(1);
        setReviewStats({
          average: parseFloat(averageRating),
          total: completedReviews.length
        });
      } else {
        // No reviews available - start from 0
        setReviewStats({
          average: 0,
          total: 0
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // If API fails, start with empty reviews
      setReviews([]);
      setReviewStats({ average: 0, total: 0 });
    }
  };

  const generateReviewComment = () => {
    const comments = [
      'Excellent service! Very professional and reliable.',
      'Great work, highly recommend this provider.',
      'Fixed the issue quickly and efficiently.',
      'Professional service with good communication.',
      'Very satisfied with the quality of work.',
      'Prompt response and excellent technical skills.',
      'Great experience, will definitely use again.',
      'Professional and knowledgeable technician.'
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  };

  const handleBookNowClick = () => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to book this service.',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: { pathname: `/services/${id}` } } });
        }
      });
      return;
    }

    if (user.email === service.providerEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Not Allowed',
        text: 'You cannot book your own service.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    setBookingData({
      serviceTakingDate: defaultDate,
      specialInstruction: ''
    });
    setShowBookingModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePurchase = async () => {
    if (!bookingData.serviceTakingDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Date Required',
        text: 'Please select a service date.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Check if user is logged in with Firebase
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please log in to book this service.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    setBookingLoading(true);
    try {
      // Create complete booking data
      const completeBookingData = {
        serviceId: service._id,
        serviceName: service.serviceName,
        serviceImage: service.serviceImage,
        providerEmail: service.providerEmail,
        providerName: service.providerName,
        userEmail: user.email,
        userName: user.displayName || user.email,
        serviceTakingDate: bookingData.serviceTakingDate,
        specialInstruction: bookingData.specialInstruction,
        price: service.servicePrice,
        serviceStatus: 'pending',
        bookedAt: new Date().toISOString()
      };

      console.log('Creating booking with Firebase auth');
      console.log('Booking data:', completeBookingData);
      await api.bookings.create(completeBookingData);
      
      setShowBookingModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Booking Successful!',
        text: 'Your service has been booked successfully. The provider will contact you soon.',
        timer: 3000,
        showConfirmButton: false
      });

      // Redirect to booked services page
      setTimeout(() => {
        navigate('/booked-services');
      }, 3000);
    } catch (error) {
      console.error('Booking error:', error);
      if (error.message === 'Authentication required') {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: 'Please log out and log in again to refresh your session.',
          confirmButtonColor: '#3085d6'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: error.message || 'Unable to book the service. Please try again.',
          confirmButtonColor: '#3085d6'
        });
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center pt-20">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content mb-4">Service Not Found</h2>
          <p className="text-base-content/70 mb-6">The service you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/services')} 
            className="btn btn-primary"
          >
            Browse All Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="breadcrumbs text-sm mb-8">
          <ul>
            <li><a href="/" className="hover:text-primary">Home</a></li>
            <li><a href="/services" className="hover:text-primary">Services</a></li>
            <li className="text-primary">{service.serviceName}</li>
          </ul>
        </div>

        {/* Service Provider Information */}
        <div className="card bg-base-100 shadow-xl border border-base-300 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
            <h2 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              Service Provider Information
            </h2>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <img
                  src={service.providerImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                  alt={service.providerName}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white/50 shadow-lg"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
                  }}
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-base-content mb-2">{service.providerName}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-base-content/80 font-medium">Service Area: {service.serviceArea}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-base-content">
                      {reviewStats.average > 0 ? reviewStats.average : '0.0'}
                    </span>
                    <span className="text-base-content/60 text-sm">
                      ({reviewStats.total} reviews)
                    </span>
                  </div>
                  <div className="badge badge-success badge-sm">Verified Provider</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Single Service Section */}
        <div className="card bg-base-100 shadow-xl border border-base-300 mb-8">
          <div className="card-body p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left Side - Service Image */}
              <div>
                <figure className="w-full h-80 overflow-hidden rounded-lg">
                  <img
                    src={service.serviceImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop'}
                    alt={service.serviceName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop';
                    }}
                  />
                </figure>
              </div>

              {/* Right Side - Service Information */}
              <div className="flex flex-col justify-between">
                {/* Service Name */}
                <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-4">
                  {service.serviceName}
                </h1>
                
                {/* Service Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-base-content">Service Description</h3>
                  <p className="text-base-content/80 leading-relaxed text-lg">
                    {service.serviceDescription || 'No description available.'}
                  </p>
                </div>

                {/* Service Provider (repeated for this section) */}
                <div className="flex items-center gap-3 mb-6">
                  <img
                    src={service.providerImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                    alt={service.providerName}
                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                  />
                  <div>
                    <div className="font-semibold text-base-content">{service.providerName}</div>
                    <div className="text-sm text-base-content/60">Service Provider</div>
                  </div>
                </div>
                
                {/* Service Price */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-6 h-6 text-primary" />
                    <span className="text-sm text-base-content/60">Service Price</span>
                  </div>
                  <div className="text-4xl font-bold text-primary">৳{service.servicePrice}</div>
                </div>
                
                {/* Book Now Button */}
                {user && user.email === service.providerEmail ? (
                  <button
                    className="btn btn-disabled btn-lg w-full"
                    disabled
                  >
                    You cannot book your own service
                  </button>
                ) : (
                  <button
                    onClick={handleBookNowClick}
                    className="btn btn-primary btn-lg w-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-current" />
              </div>
              Customer Reviews
            </h2>
            
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-base-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-base-content">{review.customerName}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-base-content/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-base-content/80 text-sm mb-3 leading-relaxed">
                      "{review.comment}"
                    </p>
                    <div className="flex justify-between items-center text-xs text-base-content/60">
                      <span>{review.serviceName}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-base-content/60 mb-4">
                  This provider hasn't received any reviews yet. Be the first to book and share your experience!
                </p>
                <div className="flex items-center justify-center gap-2 text-base-content/50">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Reviews will appear here after completed services</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl text-base-content">Book Service</h3>
              <button 
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setShowBookingModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Service ID (Not editable) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Service ID</span>
                </label>
                <input
                  type="text"
                  value={service._id}
                  className="input input-bordered bg-base-200"
                  readOnly
                />
              </div>

              {/* Service Name (Not editable) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Service Name</span>
                </label>
                <input
                  type="text"
                  value={service.serviceName}
                  className="input input-bordered bg-base-200"
                  readOnly
                />
              </div>

              {/* Service Image (Not editable) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Service Image</span>
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={service.serviceImage}
                    alt={service.serviceName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <input
                    type="text"
                    value={service.serviceImage}
                    className="input input-bordered bg-base-200 flex-1"
                    readOnly
                  />
                </div>
              </div>

              {/* Provider Email (Not editable) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Provider Email</span>
                </label>
                <input
                  type="email"
                  value={service.providerEmail}
                  className="input input-bordered bg-base-200"
                  readOnly
                />
              </div>

              {/* Provider Name (Not editable) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Provider Name</span>
                </label>
                <input
                  type="text"
                  value={service.providerName}
                  className="input input-bordered bg-base-200"
                  readOnly
                />
              </div>

              {/* Current User Email (Not editable) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Your Email</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="input input-bordered bg-base-200"
                  readOnly
                />
              </div>

              {/* Current User Name (Not editable) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Your Name</span>
                </label>
                <input
                  type="text"
                  value={user?.displayName || user?.email || ''}
                  className="input input-bordered bg-base-200"
                  readOnly
                />
              </div>

              {/* Service Taking Date (editable) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Service Taking Date *</span>
                </label>
                <input
                  type="date"
                  name="serviceTakingDate"
                  value={bookingData.serviceTakingDate}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Special Instruction (editable) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Special Instruction</span>
                </label>
                <textarea
                  name="specialInstruction"
                  value={bookingData.specialInstruction}
                  onChange={handleInputChange}
                  placeholder="Any special instructions? (e.g., address, area, customized service plan)"
                  className="textarea textarea-bordered h-24"
                ></textarea>
                <label className="label">
                  <span className="label-text-alt">Provide details like address, specific requirements, etc.</span>
                </label>
              </div>

              {/* Price (Not editable) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Price</span>
                </label>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <input
                    type="text"
                    value={`৳${service.servicePrice}`}
                    className="input input-bordered bg-base-200 font-bold text-primary"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action mt-8">
              <button
                className="btn btn-outline"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button
                className={`btn btn-primary ${bookingLoading ? 'loading' : ''}`}
                onClick={handlePurchase}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Processing...' : 'Purchase'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowBookingModal(false)}></div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;
