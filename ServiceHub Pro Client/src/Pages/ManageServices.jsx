import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Edit, Trash2, Eye, DollarSign, MapPin, Star, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../Auth/AuthContext';
import { api } from '../utils/api';
import usePageTitle from '../hooks/usePageTitle';
import Swal from 'sweetalert2';

const ManageServices = () => {
  usePageTitle('Manage Services');
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug logging
  console.log('ManageServices - Auth state:', { user, isAuthenticated: isAuthenticated(), authLoading });

  // Fetch provider's services from API
  const fetchServices = async () => {
    if (!user?.email) {
      console.log('No user email available for fetching services');
      setLoading(false);
      return;
    }
    
    console.log('Fetching services for user:', user.email);
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.services.getByProvider(user.email);
      console.log('Services API response:', response);
      
      // Transform services data to include additional fields
      const transformedServices = (Array.isArray(response) ? response : response.services || []).map(service => ({
        ...service,
        status: service.status || 'active',
        bookings: service.bookings || 0,
        rating: service.rating || 4.5,
        imageURL: service.serviceImage || service.imageURL || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400'
      }));
      
      console.log('Transformed services:', transformedServices);
      setServices(transformedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to fetch services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [user?.email]);

  const handleDeleteService = async (serviceId, serviceName) => {
    const result = await Swal.fire({
      title: 'Delete Service',
      text: `Are you sure you want to delete "${serviceName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        // Delete via API
        await api.services.delete(serviceId);
        
        // Update local state
        setServices(prev => prev.filter(service => service._id !== serviceId));
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your service has been deleted.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error deleting service:', err);
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err.message || 'Unable to delete the service. Please try again.',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      // Update via API
      await api.services.update(serviceId, { status: newStatus });
      
      // Update local state
      setServices(prev => 
        prev.map(service => 
          service._id === serviceId 
            ? { ...service, status: newStatus }
            : service
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Service ${newStatus === 'active' ? 'activated' : 'paused'} successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Error updating service status:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message || 'Unable to update service status. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content">Loading your services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-base-content mb-2">Manage Your Services</h1>
            <p className="text-lg text-base-content/70">
              Manage your service listings and track their performance. Only you can see and edit your services.
            </p>
          </div>
          <Link to="/add-service" className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <Plus className="w-5 h-5 mr-2" />
            Add New Service
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error shadow-lg mb-8">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="font-bold">Error Loading Services</h3>
              <div className="text-xs">{error}</div>
            </div>
            <button 
              onClick={fetchServices} 
              className="btn btn-sm btn-outline"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 border border-base-300 rounded-lg">
            <div className="stat-title">Total Services</div>
            <div className="stat-value text-primary">{services.length}</div>
          </div>
          <div className="stat bg-base-100 border border-base-300 rounded-lg">
            <div className="stat-title">Active Services</div>
            <div className="stat-value text-success">{services.filter(s => s.status === 'active').length}</div>
          </div>
          <div className="stat bg-base-100 border border-base-300 rounded-lg">
            <div className="stat-title">Total Bookings</div>
            <div className="stat-value text-info">{services.reduce((sum, s) => sum + s.bookings, 0)}</div>
          </div>
          <div className="stat bg-base-100 border border-base-300 rounded-lg">
            <div className="stat-title">Average Rating</div>
            <div className="stat-value text-warning">
              {services.length > 0 ? (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1) : '0.0'}
            </div>
          </div>
        </div>

        {/* Services List */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Plus className="mx-auto h-12 w-12 text-base-content/30 mb-4" />
              <h3 className="text-lg font-medium text-base-content mb-2">No services yet</h3>
              <p className="text-base-content/70 mb-6">
                Start by adding your first service to connect with customers.
              </p>
              <Link to="/add-service" className="btn btn-primary">
                Add Your First Service
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {services.map((service) => (
              <div key={service._id} className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Service Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={service.imageURL}
                        alt={service.serviceName}
                        className="w-full lg:w-48 h-32 lg:h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Service Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="card-title text-xl">{service.serviceName}</h2>
                        <div className="flex items-center gap-2">
                          <div className={`badge ${service.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                            {service.status}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-base-content/70 mb-4 line-clamp-2">
                        {service.serviceDescription}
                      </p>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-primary">৳{service.servicePrice || service.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-base-content/60" />
                          <span className="text-base-content/70">{service.serviceArea}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{service.rating}</span>
                        </div>
                        <div className="text-base-content/60">
                          {service.bookings} bookings
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/services/${service._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                        <Link
                          to={`/add-service?edit=${service._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => toggleServiceStatus(service._id, service.status)}
                          className={`btn btn-sm ${service.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                        >
                          {service.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id, service.serviceName)}
                          className="btn btn-outline btn-error btn-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
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

export default ManageServices;
