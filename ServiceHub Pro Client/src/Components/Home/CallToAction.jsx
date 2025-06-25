import React from 'react';
import { Link } from 'react-router';
import { Search, Zap, TrendingUp, Phone, Mail, Globe } from 'lucide-react';

const CallToAction = ({ user }) => {
    return (
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-20 px-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full animate-pulse" style={{animationDelay: '1000ms'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full animate-pulse" style={{animationDelay: '2000ms'}}></div>
                <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-white rounded-full animate-bounce-slow"></div>
                <div className="absolute bottom-1/4 left-1/4 w-8 h-8 bg-white rounded-full animate-float"></div>
            </div>
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="mb-8">
                    <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 text-sm font-medium mb-6">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Join 10,000+ Satisfied Users
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                        Experience Bangladesh's most trusted service marketplace
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                    <Link 
                        to="/services" 
                        className="btn btn-warning btn-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-warning/50 group"
                    >
                        <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Find Services Now
                    </Link>
                    <Link 
                        to={user ? "/add-service" : "/register"} 
                        className="btn btn-outline btn-lg border-primary-content text-primary-content hover:bg-primary-content hover:text-primary transition-all duration-300 group"
                    >
                        <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {user ? "Add Your Service" : "Become a Provider"}
                    </Link>
                </div>
                
                {/* Contact Info */}
                <div className="flex flex-wrap justify-center gap-6 text-sm opacity-80">
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>+880 1234-567890</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>support@servicehubpro.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Available across Bangladesh</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallToAction;
