import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, Zap, Users } from 'lucide-react';

const FeaturedServices = ({ services, loading, user }) => {
    return (
        <div className="py-20 px-4 bg-base-100">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">Popular Services</h2>
                    <p className="text-lg text-base-content/70">Discover our most trusted and popular repair services</p>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="loading loading-spinner loading-lg text-primary"></div>
                        <span className="ml-3 text-base-content/70">Loading popular services...</span>
                    </div>
                ) : (
                    <>
                        {services.length > 0 ? (
                            <>
                                {/* Popular Services Grid - 2 Column Layout (as per requirements) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    {services.slice(0, 6).map((service, index) => (
                                        <div 
                                            key={service._id} 
                                            className="group card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-base-300"
                                            style={{animationDelay: `${index * 0.1}s`}}
                                        >
                                            <div className="card-body p-6">
                                                <div className="flex gap-4">
                                                    {/* Service Image */}
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={service.serviceImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=150&fit=crop'}
                                                            alt={service.serviceName}
                                                            className="w-24 h-20 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    
                                                    {/* Service Information */}
                                                    <div className="flex-1 min-w-0">
                                                        {/* Service Name */}
                                                        <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors mb-2 line-clamp-1">
                                                            {service.serviceName}
                                                        </h3>
                                                        
                                                        {/* Service Description (max 100 characters as required) */}
                                                        <p className="text-base-content/70 text-sm mb-3 leading-relaxed">
                                                            {service.serviceDescription?.length > 100 
                                                                ? `${service.serviceDescription.substring(0, 100)}...` 
                                                                : service.serviceDescription || 'Professional service available'
                                                            }
                                                        </p>
                                                        
                                                        {/* Service Provider Image & Name */}
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="avatar">
                                                                <div className="w-6 h-6 rounded-full ring ring-primary/30 ring-offset-1">
                                                                    <img
                                                                        src={service.providerImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50'}
                                                                        alt={service.providerName}
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-base-content/80 font-medium">
                                                                {service.providerName}
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Service Price */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-lg font-bold text-primary">
                                                                ৳{service.servicePrice}
                                                            </div>
                                                            
                                                            {/* View Detail Button */}
                                                            <Link 
                                                                to={`/services/${service._id}`}
                                                                className="btn btn-primary btn-sm hover:scale-105 transition-all duration-300 group"
                                                            >
                                                                <span>View Detail</span>
                                                                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Show All Button (as required) */}
                                <div className="text-center">
                                    <Link 
                                        to="/services" 
                                        className="btn btn-outline btn-lg hover:scale-105 transition-all duration-300 group shadow-lg"
                                    >
                                        <span>Show All</span>
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔧</div>
                                <h3 className="text-xl font-semibold text-base-content mb-2">No Services Available</h3>
                                <p className="text-base-content/70 mb-6">Be the first to add a service and connect with customers</p>
                                {user ? (
                                    <Link to="/add-service" className="btn btn-primary btn-lg">
                                        <Zap className="w-5 h-5" />
                                        Add Your Service
                                    </Link>
                                ) : (
                                    <Link to="/register" className="btn btn-primary btn-lg">
                                        <Users className="w-5 h-5" />
                                        Join as Provider
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FeaturedServices;
