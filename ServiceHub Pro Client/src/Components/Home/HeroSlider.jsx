import React from 'react';
import { Link } from 'react-router';
import { Search, Zap, ChevronLeft, ChevronRight, Users, Wrench, Shield, CheckCircle, Clock, Award } from 'lucide-react';

const HeroSlider = ({ 
    heroSlides, 
    currentSlide, 
    nextSlide, 
    prevSlide, 
    setCurrentSlide, 
    stats, 
    user 
}) => {
    return (
        <div className="relative h-[85vh] min-h-[600px] overflow-hidden">
            {heroSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                        index === currentSlide ? 'translate-x-0' : 
                        index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                    }`}
                >
                    <div className={`w-full h-full ${slide.bg} relative overflow-hidden`}>
                        {/* Enhanced Background Image */}
                        <div className="absolute inset-0 opacity-30">
                            <img 
                                src={slide.image} 
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        </div>
                        
                        {/* Animated Background Elements */}
                        <div className="absolute inset-0">
                            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
                            <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                            <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                            <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
                            
                            {/* Floating Icons */}
                            <div className="absolute top-1/4 left-1/3 animate-float-slow">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                                    <Wrench className="w-8 h-8 text-white/60" />
                                </div>
                            </div>
                            <div className="absolute bottom-1/3 right-1/4 animate-float-reverse">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-white/60" />
                                </div>
                            </div>
                        </div>
                        
                        {/* Enhanced Content */}
                        <div className="relative z-10 h-full flex items-center">
                            <div className="max-w-7xl mx-auto px-6 w-full">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    {/* Text Content */}
                                    <div className="text-white space-y-6">
                                        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium animate-fade-in-up">
                                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                            #1 Service Platform in Bangladesh
                                        </div>
                                        
                                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-slide-in-left">
                                            <span className="block">ServiceHub</span>
                                            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                                Pro
                                            </span>
                                        </h1>
                                        
                                        <h2 className="text-xl md:text-2xl font-semibold text-white/90 animate-fade-in-up-delayed">
                                            {slide.title}
                                        </h2>
                                        
                                        <p className="text-lg text-white/80 animate-fade-in-up-delayed">
                                            {slide.description}
                                        </p>
                                        
                                        {/* Quick Stats */}
                                        <div className="flex flex-wrap gap-6 py-4 animate-slide-in-right">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-yellow-400">{stats.totalServices}+</div>
                                                <div className="text-sm text-white/70">Services</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-400">{stats.totalProviders}+</div>
                                                <div className="text-sm text-white/70">Providers</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-400">{stats.completedJobs}+</div>
                                                <div className="text-sm text-white/70">Jobs Done</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up">
                                            <Link 
                                                to="/services" 
                                                className="btn btn-warning btn-lg shadow-2xl hover:shadow-warning/50 transition-all duration-300 hover:scale-105"
                                            >
                                                <Search className="w-5 h-5" />
                                                {slide.cta}
                                            </Link>
                                            {user ? (
                                                <Link 
                                                    to="/add-service" 
                                                    className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                                                >
                                                    <Zap className="w-5 h-5" />
                                                    Add Your Service
                                                </Link>
                                            ) : (
                                                <Link 
                                                    to="/register" 
                                                    className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                                                >
                                                    <Users className="w-5 h-5" />
                                                    Join as Provider
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Visual Elements */}
                                    <div className="hidden lg:block relative animate-slide-in-right">
                                        <div className="relative">
                                            {/* Floating Cards */}
                                            <div className="absolute -top-4 -left-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-xl animate-float">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                        <CheckCircle className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-semibold">Quality Assured</div>
                                                        <div className="text-white/70 text-sm">100% Satisfaction</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-xl animate-float-reverse">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <Clock className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-semibold">Same Day</div>
                                                        <div className="text-white/70 text-sm">Fast Service</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Main Visual */}
                                            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
                                                <div className="text-center">
                                                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                                                        <Award className="w-12 h-12 text-white" />
                                                    </div>
                                                    <div className="text-3xl font-bold text-white mb-2">4.9★</div>
                                                    <div className="text-white/80">Average Rating</div>
                                                    <div className="text-white/60 text-sm">From {stats.happyCustomers}+ reviews</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Enhanced Navigation */}
            <button 
                onClick={prevSlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-20 group"
            >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-20 group"
            >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Enhanced Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
