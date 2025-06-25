import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, User, Mail, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { useBookings } from '../Context/BookingContext';
import usePageTitle from '../hooks/usePageTitle';
import Swal from 'sweetalert2';

const BookingsPage = () => {
    usePageTitle('My Bookings');
    const { userBookings, providerBookings, updateBookingStatus, loading } = useBookings();
    const [activeTab, setActiveTab] = useState('my-bookings');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'badge-warning';
            case 'working':
                return 'badge-info';
            case 'completed':
                return 'badge-success';
            default:
                return 'badge-neutral';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <AlertCircle className="w-4 h-4" />;
            case 'working':
                return <Clock className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <XCircle className="w-4 h-4" />;
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const result = await Swal.fire({
                title: 'Update Booking Status',
                text: `Are you sure you want to mark this booking as ${newStatus}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update it!'
            });

            if (result.isConfirmed) {
                await updateBookingStatus(bookingId, newStatus);
                Swal.fire({
                    title: 'Updated!',
                    text: 'Booking status has been updated.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to update booking status.',
                icon: 'error'
            });
        }
    };

    const openBookingDetails = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const BookingCard = ({ booking, isProvider = false }) => (
        <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
            <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={booking.serviceImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop'}
                            alt={booking.serviceName}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                            <h3 className="font-bold text-lg text-base-content">{booking.serviceName}</h3>
                            <p className="text-sm text-base-content/60">
                                {isProvider ? `Customer: ${booking.userName}` : `Provider: ${booking.providerName}`}
                            </p>
                        </div>
                    </div>
                    <div className={`badge ${getStatusColor(booking.status)} gap-2`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-base-content/70">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Service Date: {formatDate(booking.serviceTakingDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base-content/70">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-semibold">৳{booking.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base-content/70">
                        <User className="w-4 h-4" />
                        <span className="text-sm">
                            {isProvider ? booking.userEmail : booking.providerEmail}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-base-content/70">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Booked: {formatDate(booking.bookedAt)}</span>
                    </div>
                </div>

                {booking.specialInstruction && (
                    <div className="bg-base-200 p-3 rounded-lg mb-4">
                        <p className="text-sm text-base-content/80">
                            <strong>Special Instructions:</strong> {booking.specialInstruction}
                        </p>
                    </div>
                )}

                <div className="card-actions justify-between">
                    <button
                        onClick={() => openBookingDetails(booking)}
                        className="btn btn-outline btn-sm"
                    >
                        <Eye className="w-4 h-4" />
                        View Details
                    </button>

                    {isProvider && booking.status !== 'completed' && (
                        <div className="flex gap-2">
                            {booking.status === 'pending' && (
                                <button
                                    onClick={() => handleStatusUpdate(booking._id, 'working')}
                                    className="btn btn-info btn-sm"
                                >
                                    Start Work
                                </button>
                            )}
                            {booking.status === 'working' && (
                                <button
                                    onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                    className="btn btn-success btn-sm"
                                >
                                    Mark Complete
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 pt-20">
                <div className="flex justify-center items-center py-20">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                    Manage Your Bookings
                </h1>
                <p className="text-xl text-base-content/80 leading-relaxed mb-4">
                    Comprehensive booking management for both customers and service providers
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="bg-primary/10 rounded-xl p-4">
                        <h3 className="font-semibold text-primary mb-2">As a Customer</h3>
                        <p className="text-sm text-base-content/70">Track services you've booked and their progress</p>
                    </div>
                    <div className="bg-secondary/10 rounded-xl p-4">
                        <h3 className="font-semibold text-secondary mb-2">As a Provider</h3>
                        <p className="text-sm text-base-content/70">Manage requests for your services</p>
                    </div>
                </div>
            </div>
        </div>

                {/* Tabs */}
                <div className="tabs tabs-bordered tabs-lg w-full justify-center mb-8">
                    <button
                        className={`tab ${activeTab === 'my-bookings' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('my-bookings')}
                    >
                        My Bookings ({userBookings.length})
                    </button>
                    <button
                        className={`tab ${activeTab === 'service-requests' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('service-requests')}
                    >
                        Service Requests ({providerBookings.length})
                    </button>
                </div>

                {/* Content */}
                <div className="tab-content">
                    {activeTab === 'my-bookings' && (
                        <div>
                            <h2 className="text-2xl font-bold text-base-content mb-6">
                                Services I've Booked
                            </h2>
                            {userBookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📅</div>
                                    <h3 className="text-xl font-semibold text-base-content mb-2">
                                        No bookings yet
                                    </h3>
                                    <p className="text-base-content/60 mb-4">
                                        You haven't booked any services yet. Explore our services to get started!
                                    </p>
                                    <button 
                                        onClick={() => window.location.href = '/services'}
                                        className="btn btn-primary"
                                    >
                                        Browse Services
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {userBookings.map((booking) => (
                                        <BookingCard
                                            key={booking._id}
                                            booking={booking}
                                            isProvider={false}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'service-requests' && (
                        <div>
                            <h2 className="text-2xl font-bold text-base-content mb-6">
                                Booking Requests for My Services
                            </h2>
                            {providerBookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔧</div>
                                    <h3 className="text-xl font-semibold text-base-content mb-2">
                                        No service requests
                                    </h3>
                                    <p className="text-base-content/60 mb-4">
                                        You haven't received any booking requests yet. Add more services to attract customers!
                                    </p>
                                    <button 
                                        onClick={() => window.location.href = '/add-service'}
                                        className="btn btn-primary"
                                    >
                                        Add New Service
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {providerBookings.map((booking) => (
                                        <BookingCard
                                            key={booking._id}
                                            booking={booking}
                                            isProvider={true}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Statistics */}
                <div className="stats shadow w-full mt-12">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Total Bookings</div>
                        <div className="stat-value text-primary">{userBookings.length}</div>
                        <div className="stat-desc">Services you've booked</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <User className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Service Requests</div>
                        <div className="stat-value text-secondary">{providerBookings.length}</div>
                        <div className="stat-desc">Bookings for your services</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Completed</div>
                        <div className="stat-value text-accent">
                            {[...userBookings, ...providerBookings].filter(b => b.status === 'completed').length}
                        </div>
                        <div className="stat-desc">Successfully completed</div>
                    </div>
                </div>
            </div>

            {/* Booking Details Modal */}
            {showModal && selectedBooking && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-2xl text-base-content">Booking Details</h3>
                            <button 
                                className="btn btn-sm btn-circle btn-ghost"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Service Info */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedBooking.serviceImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop'}
                                    alt={selectedBooking.serviceName}
                                    className="w-20 h-20 rounded-xl object-cover"
                                />
                                <div>
                                    <h4 className="text-xl font-bold text-base-content">{selectedBooking.serviceName}</h4>
                                    <div className={`badge ${getStatusColor(selectedBooking.status)} gap-2 mt-2`}>
                                        {getStatusIcon(selectedBooking.status)}
                                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                    </div>
                                </div>
                            </div>

                            {/* Booking Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <h5 className="font-semibold text-base-content">Booking Information</h5>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span>Service Date: {formatDate(selectedBooking.serviceTakingDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span>Booked On: {formatDate(selectedBooking.bookedAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-primary" />
                                            <span className="font-semibold">Price: ৳{selectedBooking.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h5 className="font-semibold text-base-content">Contact Information</h5>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-secondary" />
                                            <span>Provider: {selectedBooking.providerName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-secondary" />
                                            <span>{selectedBooking.providerEmail}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-accent" />
                                            <span>Customer: {selectedBooking.userName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Special Instructions */}
                            {selectedBooking.specialInstruction && (
                                <div>
                                    <h5 className="font-semibold text-base-content mb-2">Special Instructions</h5>
                                    <div className="bg-base-200 p-4 rounded-lg">
                                        <p className="text-sm text-base-content/80">{selectedBooking.specialInstruction}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-action">
                            <button 
                                className="btn btn-outline"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
                </div>
            )}
        </div>
    );
};

export default BookingsPage;
