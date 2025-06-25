import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, MapPin, DollarSign, Plus } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';
import { useAuth } from '../Auth/AuthContext';
import { api } from '../utils/api';

const AllServices = () => {
    usePageTitle('All Services');
    const { user } = useAuth();
    
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [filterArea, setFilterArea] = useState('');

    // Fetch services from database - real data only
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                console.log('Fetching services from database...');
                const data = await api.services.getAll();
                console.log('✅ Successfully fetched services from database:', data.length);
                setServices(data);
                setFilteredServices(data);
            } catch (err) {
                console.error('❌ Error fetching services from database:', err);
                setError(err.message || 'Failed to load services from database');
                setServices([]);
                setFilteredServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Filter and search logic
    useEffect(() => {
        let filtered = [...services];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(service =>
                service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.providerName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Area filter
        if (filterArea) {
            filtered = filtered.filter(service =>
                service.serviceArea.toLowerCase().includes(filterArea.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.serviceName.localeCompare(b.serviceName);
                case 'price-low':
                    return a.servicePrice - b.servicePrice;
                case 'price-high':
                    return b.servicePrice - a.servicePrice;
                case 'provider':
                    return a.providerName.localeCompare(b.providerName);
                default:
                    return 0;
            }
        });

        setFilteredServices(filtered);
    }, [services, searchQuery, filterArea, sortBy]);

    // Handle search
    const handleSearch = async () => {
        if (searchQuery.trim()) {
            try {
                setLoading(true);
                const searchResults = await api.services.search(searchQuery);
                setFilteredServices(searchResults);
            } catch (err) {
                console.error('Search error:', err);
                // Fallback to client-side search
            } finally {
                setLoading(false);
            }
        }
    };

    // Get unique areas for filter
    const areas = [...new Set(services.map(service => service.serviceArea))];

    return (
        <div className="min-h-screen bg-base-100 pt-20">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-base-content mb-4">
                        All Services
                    </h1>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Browse all available services from our trusted service providers across Bangladesh
                    </p>
                </div>

                {/* Smart Search Interface */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 mb-8 border border-primary/10">
                    {/* Search Hero */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4 shadow-lg">
                            <Search className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                            Find Your Perfect Service
                        </h2>
                        <p className="text-base-content/60">Search through {services.length} available services</p>
                    </div>

                    {/* Advanced Search Bar */}
                    <div className="max-w-4xl mx-auto mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-base-content/40" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by service name, description, or provider..."
                                className="input input-bordered input-lg w-full pl-12 pr-32 bg-base-100/80 backdrop-blur-sm border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <button 
                                    className="btn btn-primary btn-sm shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Smart Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-6">
                        <div className="dropdown dropdown-hover">
                            <div tabIndex={0} role="button" className="btn btn-outline btn-sm gap-2 hover:btn-primary transition-all duration-300">
                                <MapPin className="w-4 h-4" />
                                {filterArea || 'All Areas'}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-xl border border-base-300">
                                <li>
                                    <button onClick={() => setFilterArea('')} className={!filterArea ? 'active' : ''}>
                                        🌍 All Areas
                                    </button>
                                </li>
                                {areas.map(area => (
                                    <li key={area}>
                                        <button 
                                            onClick={() => setFilterArea(area)}
                                            className={filterArea === area ? 'active' : ''}
                                        >
                                            📍 {area}
                                        </button>
                                    </li>
                                ))}
                            </div>
                        </div>

                        <div className="dropdown dropdown-hover">
                            <div tabIndex={0} role="button" className="btn btn-outline btn-sm gap-2 hover:btn-primary transition-all duration-300">
                                <DollarSign className="w-4 h-4" />
                                {sortBy === 'name' ? 'Name A-Z' : 
                                 sortBy === 'price-low' ? 'Price: Low to High' :
                                 sortBy === 'price-high' ? 'Price: High to Low' : 'Provider Name'}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-xl border border-base-300">
                                <li>
                                    <button onClick={() => setSortBy('name')} className={sortBy === 'name' ? 'active' : ''}>
                                        🔤 Name A-Z
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setSortBy('price-low')} className={sortBy === 'price-low' ? 'active' : ''}>
                                        💰 Price: Low to High
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setSortBy('price-high')} className={sortBy === 'price-high' ? 'active' : ''}>
                                        💎 Price: High to Low
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setSortBy('provider')} className={sortBy === 'provider' ? 'active' : ''}>
                                        👤 Provider Name
                                    </button>
                                </li>
                            </div>
                        </div>

                        {user && (
                            <Link 
                                to="/add-service" 
                                className="btn btn-secondary btn-sm gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                <Plus className="w-4 h-4" />
                                Add Service
                            </Link>
                        )}

                        {(searchQuery || filterArea || sortBy !== 'name') && (
                            <button 
                                className="btn btn-ghost btn-sm gap-2 hover:btn-error transition-all duration-300"
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilterArea('');
                                    setSortBy('name');
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Clear All
                            </button>
                        )}
                    </div>
                    
                    {/* Smart Results Display */}
                    <div className="flex items-center justify-center gap-4 pt-4 border-t border-base-content/10">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <span className="text-base-content/70">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="loading loading-spinner loading-xs"></span>
                                        Searching...
                                    </span>
                                ) : (
                                    <>
                                        <span className="font-bold text-primary">{filteredServices.length}</span>
                                        <span> of </span>
                                        <span className="font-medium">{services.length}</span>
                                        <span> services found</span>
                                    </>
                                )}
                            </span>
                        </div>
                        
                        {filteredServices.length > 0 && !loading && (
                            <div className="badge badge-success badge-sm">
                                {((filteredServices.length / services.length) * 100).toFixed(0)}% match
                            </div>
                        )}
                    </div>
                </div>

                {/* Error State */}
                {error && !loading && (
                    <div className="alert alert-warning mb-8">
                        <div>
                            <h3 className="font-bold">Connection Issue</h3>
                            <div className="text-xs">{error}. Showing sample data.</div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="loading loading-spinner loading-lg text-primary"></div>
                        <span className="ml-3 text-base-content/70">Loading services...</span>
                    </div>
                )}

                {/* Services - One Column Layout */}
                {!loading && (
                    <div className="space-y-6">
                        {filteredServices.map((service, index) => (
                            <div 
                                key={service._id} 
                                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
                                style={{animationDelay: `${index * 0.1}s`}}
                            >
                                <div className="card-body p-0">
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Service Image */}
                                        <figure className="lg:w-80 h-64 lg:h-auto overflow-hidden">
                                            <img
                                                src={service.serviceImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'}
                                                alt={service.serviceName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </figure>
                                        
                                        {/* Service Information */}
                                        <div className="flex-1 p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-start justify-between h-full">
                                                <div className="flex-1 lg:pr-6">
                                                    {/* Service Name */}
                                                    <h3 className="text-2xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                                                        {service.serviceName}
                                                    </h3>
                                                    
                                                    {/* Service Description - Max 100 characters */}
                                                    <p className="text-base-content/70 text-base mb-4 leading-relaxed">
                                                        {service.serviceDescription?.length > 100 
                                                            ? `${service.serviceDescription.substring(0, 100)}...` 
                                                            : service.serviceDescription
                                                        }
                                                    </p>
                                                    
                                                    {/* Service Provider Image & Name */}
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <img
                                                            src={service.providerImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                                                            alt={service.providerName}
                                                            className="w-10 h-10 rounded-full border-2 border-primary/20"
                                                        />
                                                        <div>
                                                            <div className="font-semibold text-base-content">{service.providerName}</div>
                                                            <div className="text-sm text-base-content/60">Service Provider</div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Service Area */}
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <MapPin className="w-5 h-5 text-primary" />
                                                        <span className="text-base-content font-medium">Service Area: </span>
                                                        <span className="badge badge-outline badge-primary">{service.serviceArea}</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Right Side - Price & Action */}
                                                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-6 pt-4 lg:pt-0">
                                                    {/* Service Price */}
                                                    <div className="text-center lg:text-right">
                                                        <div className="text-sm text-base-content/60 mb-1">Service Price</div>
                                                        <div className="flex items-center gap-1 justify-center lg:justify-end">
                                                            <DollarSign className="w-5 h-5 text-primary" />
                                                            <span className="text-3xl font-bold text-primary">৳{service.servicePrice}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* View Details Button */}
                                                    <Link 
                                                        to={`/services/${service._id}`}
                                                        className="btn btn-primary btn-lg group-hover:btn-secondary transition-colors shadow-lg hover:shadow-xl hover:scale-105"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && filteredServices.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">
                            {services.length === 0 ? '🛠️' : '🔍'}
                        </div>
                        <h3 className="text-2xl font-bold text-base-content mb-2">
                            {services.length === 0 ? 'No services available yet' : 'No services found'}
                        </h3>
                        <p className="text-base-content/70 mb-6">
                            {services.length === 0 
                                ? 'Be the first to add a service and start connecting with customers'
                                : 'Try adjusting your search criteria or browse all services'
                            }
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {services.length === 0 ? (
                                // Show when no services exist at all
                                user ? (
                                    <Link to="/add-service" className="btn btn-primary">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add Your First Service
                                    </Link>
                                ) : (
                                    <Link to="/login" className="btn btn-primary">
                                        Login to Add Services
                                    </Link>
                                )
                            ) : (
                                // Show when services exist but search returned no results
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilterArea('');
                                        setSortBy('name');
                                    }}
                                >
                                    Clear Filters
                                </button>
                            )}
                            
                            {/* Always show add service button for logged in users */}
                            {services.length > 0 && user && (
                                <Link to="/add-service" className="btn btn-outline">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Service
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllServices;
