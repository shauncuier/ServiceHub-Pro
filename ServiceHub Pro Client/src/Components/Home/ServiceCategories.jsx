import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, Zap, TrendingUp } from 'lucide-react';

const ServiceCategories = ({ serviceCategories }) => {
    return (
        <div className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Zap className="w-4 h-4 mr-2" />
                        Quick Access
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6">
                        Popular Service 
                        <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Categories
                        </span>
                    </h2>
                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                        Find the perfect repair service for your device with our most popular categories
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {serviceCategories.map((category, index) => (
                        <Link 
                            key={index}
                            to={`/services?search=${encodeURIComponent(category.name.split(' ')[0])}`}
                            className="group relative overflow-hidden"
                        >
                            {/* Main Card */}
                            <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-base-200 dark:to-base-300 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 dark:border-base-300">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                                
                                {/* Icon Container */}
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 group-hover:rotate-3">
                                        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                                            {category.icon}
                                        </span>
                                    </div>
                                    {/* Floating decoration */}
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                                </div>

                                {/* Content */}
                                <div className="relative text-center">
                                    <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors duration-300">
                                        {category.name}
                                    </h3>
                                    <p className="text-base-content/60 text-sm mb-4 leading-relaxed">
                                        {category.description}
                                    </p>
                                    
                                    {/* Stats Badge */}
                                    <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-4">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {category.count} services
                                    </div>

                                    {/* Call to Action */}
                                    <div className="flex items-center justify-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                                        Explore Services
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-1 -left-1 w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse" style={{animationDelay: '0.3s'}}></div>
                        </Link>
                    ))}
                </div>

                {/* View All Services Link */}
                <div className="text-center mt-12">
                    <Link 
                        to="/services" 
                        className="inline-flex items-center btn btn-outline btn-lg hover:btn-primary group transition-all duration-300"
                    >
                        <span>View All Services</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-yellow-200/20 to-orange-300/20 rounded-full blur-xl animate-float-slow"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-purple-300/20 rounded-full blur-xl animate-float-reverse"></div>
            </div>
        </div>
    );
};

export default ServiceCategories;
