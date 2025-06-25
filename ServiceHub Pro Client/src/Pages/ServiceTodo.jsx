import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Mail, CheckCircle, AlertCircle, RefreshCw, ChevronDown, Star, User, MessageSquare } from 'lucide-react';
import { useBookings } from '../Context/BookingContext';
import usePageTitle from '../hooks/usePageTitle';
import Swal from 'sweetalert2';

const ServiceTodo = () => {
  usePageTitle('Service To-Do');
  const { providerBookings, loading, error, updateBookingStatus, refreshBookings } = useBookings();
  const [filter, setFilter] = useState('all');
  const [statusUpdating, setStatusUpdating] = useState({});

  // Transform providerBookings to ensure consistent data structure
  const bookings = providerBookings.map(booking => ({
    _id: booking._id,
    serviceName: booking.serviceName,
    serviceImage: booking.serviceImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    price: booking.price || booking.servicePrice || 0,
    customerName: booking.userName || booking.customerName || 'Customer',
    customerEmail: booking.userEmail || booking.customerEmail,
    serviceStatus: booking.status || booking.serviceStatus || 'pending',
    serviceTakingDate: booking.serviceTakingDate || booking.bookedAt ? new Date(booking.serviceTakingDate || booking.bookedAt).toLocaleDateString() : 'Date not specified',
    specialInstruction: booking.specialInstruction || booking.customerNotes || '',
    bookedAt: new Date(booking.bookedAt || Date.now())
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
      case 'working': return 'Working';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.serviceStatus === filter);

  // Handle status change using shared context with confirmation
  const handleStatusChange = async (bookingId, newStatus) => {
    const result = await Swal.fire({
      title: 'Change Service Status',
      text: `Are you sure you want to change the status to "${getStatusText(newStatus)}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, change it'
    });

    if (!result.isConfirmed) return;

    setStatusUpdating(prev => ({ ...prev, [bookingId]: true }));

    try {
      // Use shared context method for updating status
      await updateBookingStatus(bookingId, newStatus);

      Swal.fire({
        icon: 'success',
        title: 'Status Updated & Synced',
        text: `Service status changed to ${getStatusText(newStatus)} and synced across all pages.`,
        timer: 3000,
        showConfirmButton: false
      });

    } catch (err) {
      console.error('Error updating status:', err);

      let errorMessage = 'Unable to update status. Please try again.';
      if (err.message) {
        errorMessage = err.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: errorMessage,
        footer: 'Status was not saved. Check console for details.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setStatusUpdating(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center pt-20">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content">Loading your service bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-4">Service To-Do</h1>
          <p className="text-lg text-base-content/70">
            Manage and track all booked services where you are the service provider. Update status to keep customers informed.
          </p>
          
          {/* Error Display */}
          {error && (
            <div className="alert alert-error shadow-lg max-w-md mx-auto mt-4">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Error Loading Data</h3>
                <div className="text-xs">{error}</div>
              </div>
              <button 
                onClick={refreshBookings} 
                className="btn btn-sm btn-outline"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-lg">
            <div className="stat-title">Total Bookings</div>
            <div className="stat-value text-primary">{bookings.length}</div>
          </div>
          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-lg">
            <div className="stat-title">Pending</div>
            <div className="stat-value text-warning">{bookings.filter(b => b.serviceStatus === 'pending').length}</div>
          </div>
          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-lg">
            <div className="stat-title">Working</div>
            <div className="stat-value text-info">{bookings.filter(b => b.serviceStatus === 'working').length}</div>
          </div>
          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-lg">
            <div className="stat-title">Completed</div>
            <div className="stat-value text-success">{bookings.filter(b => b.serviceStatus === 'completed').length}</div>
          </div>
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
            Pending ({bookings.filter(b => b.serviceStatus === 'pending').length})
          </button>
          <button 
            className={`tab ${filter === 'working' ? 'tab-active' : ''}`}
            onClick={() => setFilter('working')}
          >
            Working ({bookings.filter(b => b.serviceStatus === 'working').length})
          </button>
          <button 
            className={`tab ${filter === 'completed' ? 'tab-active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({bookings.filter(b => b.serviceStatus === 'completed').length})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <CheckCircle className="mx-auto h-12 w-12 text-base-content/30 mb-4" />
              <h3 className="text-lg font-medium text-base-content mb-2">
                {filter === 'all' ? 'No service bookings yet' : `No ${filter} services`}
              </h3>
              <p className="text-base-content/70">
                {filter === 'all' 
                  ? 'Service bookings will appear here when customers book your services.'
                  : `You don't have any ${filter} services at the moment.`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredBookings.map((booking, index) => (
              <div 
                key={booking._id} 
                className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
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

                    {/* Booking Information */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="card-title text-xl mb-2">{booking.serviceName}</h2>
                          <div className="flex items-center gap-3">
                            <div className={`badge ${getStatusColor(booking.serviceStatus)} badge-lg`}>
                              {getStatusText(booking.serviceStatus)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-primary font-bold text-lg">
                            <DollarSign className="w-5 h-5" />
                            <span>৳{booking.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Customer Information</h3>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="font-medium text-base-content">{booking.customerName}</p>
                              <div className="flex items-center gap-1 text-sm text-base-content/60 mt-1">
                                <Mail className="w-3 h-3" />
                                <span>{booking.customerEmail}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-base-content/80 mb-1">Service Date:</p>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{booking.serviceTakingDate}</span>
                              </div>
                            </div>

                            {booking.specialInstruction && (
                              <div>
                                <p className="text-sm font-medium text-base-content/80 mb-1">Special Instructions:</p>
                                <p className="text-sm text-base-content/70 italic bg-base-200 p-3 rounded-lg">
                                  "{booking.specialInstruction}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Service Management */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Service Management</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-base-content/60" />
                              <span className="text-sm">Booked: {booking.bookedAt.toLocaleDateString()}</span>
                            </div>

                            {/* Status Dropdown */}
                            <div className="form-control">
                              <label className="label">
                                <span className="label-text font-semibold">Update Service Status</span>
                              </label>
                              <div className="dropdown dropdown-end w-full">
                                <label tabIndex={0} className="btn btn-outline w-full justify-between">
                                  <span className="flex items-center gap-2">
                                    <div className={`badge ${getStatusColor(booking.serviceStatus)} badge-sm`}></div>
                                    {getStatusText(booking.serviceStatus)}
                                  </span>
                                  <ChevronDown className="w-4 h-4" />
                                </label>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full border border-base-300">
                                  <li>
                                    <button
                                      onClick={() => handleStatusChange(booking._id, 'pending')}
                                      disabled={statusUpdating[booking._id]}
                                      className={`flex items-center gap-3 ${booking.serviceStatus === 'pending' ? 'active' : ''}`}
                                    >
                                      <div className="badge badge-warning badge-sm"></div>
                                      Pending
                                      {booking.serviceStatus === 'pending' && <CheckCircle className="w-4 h-4 text-success" />}
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => handleStatusChange(booking._id, 'working')}
                                      disabled={statusUpdating[booking._id]}
                                      className={`flex items-center gap-3 ${booking.serviceStatus === 'working' ? 'active' : ''}`}
                                    >
                                      <div className="badge badge-info badge-sm"></div>
                                      Working
                                      {booking.serviceStatus === 'working' && <CheckCircle className="w-4 h-4 text-success" />}
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => handleStatusChange(booking._id, 'completed')}
                                      disabled={statusUpdating[booking._id]}
                                      className={`flex items-center gap-3 ${booking.serviceStatus === 'completed' ? 'active' : ''}`}
                                    >
                                      <div className="badge badge-success badge-sm"></div>
                                      Completed
                                      {booking.serviceStatus === 'completed' && <CheckCircle className="w-4 h-4 text-success" />}
                                    </button>
                                  </li>
                                </ul>
                              </div>
                              {statusUpdating[booking._id] && (
                                <label className="label">
                                  <span className="label-text-alt text-info">
                                    <span className="loading loading-spinner loading-xs mr-1"></span>
                                    Updating status...
                                  </span>
                                </label>
                              )}
                            </div>

                            {/* Contact Customer */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => window.open(`mailto:${booking.customerEmail}`)}
                                className="btn btn-outline btn-sm flex-1"
                              >
                                <Mail className="w-4 h-4 mr-1" />
                                Email Customer
                              </button>
                            </div>
                          </div>
                        </div>
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

export default ServiceTodo;
