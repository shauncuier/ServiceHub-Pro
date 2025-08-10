import React from 'react';
import { Link } from 'react-router';
import { Search, Zap, TrendingUp, Phone, Mail, Globe, ArrowRight, Star, Shield, Award, CheckCircle } from 'lucide-react';

const CallToAction = ({ user }) => {
    return (
        <div className="relative py-32 px-4 overflow-hidden">
            {/* Enhanced Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
            
            {/* Animated mesh background */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/30"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/40 to-purple-600/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/40 to-red-600/40 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400/30 to-orange-600/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Floating geometric shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-float-slow"></div>
                <div className="absolute top-32 right-32 w-6 h-6 bg-cyan-400/30 rounded-full animate-float-reverse"></div>
                <div className="absolute bottom-40 left-40 w-3 h-3 bg-pink-400/30 rounded-full animate-float-fast"></div>
                <div className="absolute bottom-20 right-20 w-5 h-5 bg-purple-400/30 rounded-full animate-bounce-slow"></div>
                
                {/* Animated lines */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto text-center relative z-10">
                {/* Header Section */}
                <div className="mb-16">
                    <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-sm font-medium mb-8 text-white">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Join 50,000+ Satisfied Users
                        <div className="ml-3 flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-yellow-400 font-bold">4.9/5</span>
                        </div>
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-tight">
                        Ready to 
                        <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                            Get Started?
                        </span>
                    </h2>
                    
                    <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-white/80 leading-relaxed max-w-4xl mx-auto">
                        Experience Bangladesh's most trusted service marketplace with 
                        <span className="text-cyan-400 font-semibold"> verified professionals</span> and 
                        <span className="text-purple-400 font-semibold"> guaranteed quality</span>
                    </p>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                        <div className="text-white font-bold text-lg">100% Secure</div>
                        <div className="text-white/70 text-sm">Verified & Insured</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <Award className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                        <div className="text-white font-bold text-lg">Quality Guaranteed</div>
                        <div className="text-white/70 text-sm">Money Back Promise</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <CheckCircle className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                        <div className="text-white font-bold text-lg">24/7 Support</div>
                        <div className="text-white/70 text-sm">Always Here to Help</div>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col lg:flex-row gap-6 justify-center mb-16">
                    <Link 
                        to="/services" 
                        className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-6 px-12 rounded-2xl shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 text-lg"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center">
                            <Search className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                            Find Services Now
                            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                    </Link>
                    
                    <Link 
                        to={user ? "/add-service" : "/register"} 
                        className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 hover:scale-105 text-lg"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center">
                            <Zap className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                            {user ? "Add Your Service" : "Become a Provider"}
                            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                    </Link>
                </div>
                
                {/* Enhanced Contact Info */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                    <div className="text-white/80 text-lg mb-6 font-medium">Get in touch with us</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/70">
                        <div className="flex items-center justify-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors duration-300">
                            <div className="p-2 bg-green-500/20 rounded-full">
                                <Phone className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <div className="font-medium text-white">Call Us</div>
                                <div className="text-sm">+880 1234-567890</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors duration-300">
                            <div className="p-2 bg-blue-500/20 rounded-full">
                                <Mail className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="font-medium text-white">Email Us</div>
                                <div className="text-sm">support@servicehubpro.com</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors duration-300">
                            <div className="p-2 bg-purple-500/20 rounded-full">
                                <Globe className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="font-medium text-white">Coverage</div>
                                <div className="text-sm">All across Bangladesh</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
        </div>
    );
};

export default CallToAction;
