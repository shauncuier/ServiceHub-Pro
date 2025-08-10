import React, { useState, useEffect } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import { useAuth } from '../Auth/AuthContext';
import { api } from '../utils/api';

// Import individual components
import HeroSlider from '../Components/Home/HeroSlider';
import ServiceCategories from '../Components/Home/ServiceCategories';
import FeaturesSection from '../Components/Home/FeaturesSection';
import StatsSection from '../Components/Home/StatsSection';
import FeaturedServices from '../Components/Home/FeaturedServices';
import HowItWorksSection from '../Components/Home/HowItWorksSection';
import TestimonialsSection from '../Components/Home/TestimonialsSection';
import CallToAction from '../Components/Home/CallToAction';

const Home = () => {
    usePageTitle('Home - ServiceHub Pro');
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [realStats, setRealStats] = useState({
        totalServices: 0,
        totalProviders: 0,
        completedJobs: 0,
        happyCustomers: 0
    });
    const [testimonials, setTestimonials] = useState([]);
    const [reviewStats, setReviewStats] = useState({
        totalReviews: 0,
        averageRating: 0,
        responseTime: '15min',
        positiveFeedback: 0
    });

    // Enhanced hero slides data
    const heroSlides = [
        {
            title: "Professional Electronic Repair Services",
            subtitle: "Expert technicians ready to fix your devices",
            description: "Get your smartphones, laptops, TVs, and appliances repaired by certified professionals",
            bg: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop",
            cta: "Find Expert Repair",
            ctaSecondary: "Learn More"
        },
        {
            title: "Fast & Reliable Solutions",
            subtitle: "Same-day service available",
            description: "Quick turnaround times with guaranteed quality and affordable pricing",
            bg: "bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-600",
            image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&h=800&fit=crop",
            cta: "Book Now",
            ctaSecondary: "View Services"
        },
        {
            title: "Trusted by 10,000+ Customers",
            subtitle: "Join our growing community",
            description: "Experience Bangladesh's most reliable service marketplace with verified providers",
            bg: "bg-gradient-to-br from-orange-600 via-red-600 to-pink-600",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop",
            cta: "Get Started",
            ctaSecondary: "Read Reviews"
        }
    ];

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlay) return;
        
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [heroSlides.length, isAutoPlay]);

    // Fetch all real data from database
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                
                // Fetch services data
                const servicesData = await api.services.getAll();
                setServices(servicesData || []);

                // Calculate real statistics from services data
                if (servicesData && servicesData.length > 0) {
                    const uniqueProviders = new Set(servicesData.map(service => service.providerEmail)).size;
                    const totalServices = servicesData.length;
                    
                    // Try to get real booking data for accurate stats
                    let completedJobs = Math.floor(totalServices * 12); // Fallback calculation
                    let happyCustomers = Math.floor(uniqueProviders * 15); // Fallback calculation
                    
                    try {
                        const bookingStats = await api.bookings.getStats();
                        if (bookingStats) {
                            completedJobs = bookingStats.completedJobs || completedJobs;
                            happyCustomers = bookingStats.totalCustomers || happyCustomers;
                        }
                    } catch {
                        console.log('Using calculated booking stats as fallback');
                    }

                    setRealStats({
                        totalServices,
                        totalProviders: uniqueProviders,
                        completedJobs,
                        happyCustomers
                    });
                }

                // Fetch real testimonials/reviews
                try {
                    const reviewsData = await api.reviews.getRecentReviews(4);
                    if (reviewsData && Array.isArray(reviewsData) && reviewsData.length > 0) {
                        // Validate each review before setting
                        const validReviews = reviewsData.filter(review => 
                            review && 
                            typeof review === 'object' && 
                            review.rating !== undefined &&
                            review.rating !== null &&
                            (review.comment || review.review || review.feedback)
                        );
                        
                        if (validReviews.length > 0) {
                            setTestimonials(validReviews);
                        }
                    }

                    const reviewStatsData = await api.reviews.getStats();
                    if (reviewStatsData && typeof reviewStatsData === 'object') {
                        setReviewStats({
                            totalReviews: reviewStatsData.totalReviews || 0,
                            averageRating: reviewStatsData.averageRating || 4.9,
                            responseTime: reviewStatsData.averageResponseTime || reviewStatsData.responseTime || '15min',
                            positiveFeedback: reviewStatsData.positiveFeedbackPercentage || reviewStatsData.positiveFeedback || 99.2
                        });
                    }
                } catch (error) {
                    console.log('Reviews not available, using testimonials fallback:', error.message);
                    // Keep default testimonials if API not available
                    setTestimonials([]);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    // Service categories for quick access (calculated from real data)
    const serviceCategories = [
        {
            name: "Smartphone Repair",
            icon: "📱",
            description: "Screen, battery, charging issues",
            count: services.filter(s => 
                s.serviceName?.toLowerCase().includes('phone') || 
                s.serviceName?.toLowerCase().includes('mobile') ||
                s.serviceName?.toLowerCase().includes('smartphone')
            ).length
        },
        {
            name: "Laptop Repair",
            icon: "💻",
            description: "Hardware, software, performance",
            count: services.filter(s => 
                s.serviceName?.toLowerCase().includes('laptop') || 
                s.serviceName?.toLowerCase().includes('computer') ||
                s.serviceName?.toLowerCase().includes('pc')
            ).length
        },
        {
            name: "TV Repair",
            icon: "📺",
            description: "Display, sound, connectivity",
            count: services.filter(s => 
                s.serviceName?.toLowerCase().includes('tv') || 
                s.serviceName?.toLowerCase().includes('television') ||
                s.serviceName?.toLowerCase().includes('display')
            ).length
        },
        {
            name: "AC Repair",
            icon: "❄️",
            description: "Cooling, cleaning, maintenance",
            count: services.filter(s => 
                s.serviceName?.toLowerCase().includes('ac') || 
                s.serviceName?.toLowerCase().includes('air') ||
                s.serviceName?.toLowerCase().includes('conditioning')
            ).length
        }
    ];

    // Calculate basic stats for hero section
    const heroStats = React.useMemo(() => {
        return {
            totalServices: realStats.totalServices,
            totalProviders: realStats.totalProviders,
            completedJobs: realStats.completedJobs,
        };
    }, [realStats]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-50 to-base-100 overflow-x-hidden">
            {/* Hero Slider Section with enhanced animations */}
            <section className="relative animate-fade-in">
                <HeroSlider 
                    heroSlides={heroSlides}
                    currentSlide={currentSlide}
                    nextSlide={nextSlide}
                    prevSlide={prevSlide}
                    setCurrentSlide={setCurrentSlide}
                    stats={heroStats}
                    user={user}
                    isAutoPlay={isAutoPlay}
                    setIsAutoPlay={setIsAutoPlay}
                />
                
                {/* Floating action button for quick access */}
                <div className="absolute bottom-8 right-8 z-30 hidden lg:block">
                    <div className="relative">
                        <button className="btn btn-circle btn-primary btn-lg shadow-2xl hover:shadow-primary/50 transition-all duration-300 animate-pulse-glow">
                            <span className="text-2xl">🚀</span>
                        </button>
                        <div className="absolute -top-12 -left-20 bg-black/80 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Quick Start
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Categories with enhanced visual design */}
            <section className="relative py-20 animate-slide-in-up animate-delay-200">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5"></div>
                <div className="relative">
                    <ServiceCategories serviceCategories={serviceCategories} />
                </div>
            </section>

            {/* Enhanced Features Section */}
            <section className="relative py-20 animate-fade-in-up animate-delay-300">
                <div className="absolute inset-0">
                    <div className="w-full h-full bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/20"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-orange-300/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-blue-300/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
                </div>
                <div className="relative">
                    <FeaturesSection />
                </div>
            </section>

            {/* How It Works Section with enhanced styling */}
            <section className="relative py-20 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 animate-slide-in-bottom animate-delay-500">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-indigo-200/30 to-purple-300/30 rounded-full blur-3xl animate-float-slow"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-pink-200/30 to-red-300/30 rounded-full blur-3xl animate-float-reverse"></div>
                </div>
                <div className="relative">
                    <HowItWorksSection />
                </div>
            </section>

            {/* Statistics Section with enhanced background */}
            <section className="relative py-20 overflow-hidden animate-zoom-in-rotate animate-delay-700">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10"></div>
                <div className="absolute inset-0">
                    {/* Animated background patterns */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-20 left-20 w-4 h-4 bg-primary rounded-full animate-ping"></div>
                        <div className="absolute top-40 right-32 w-3 h-3 bg-secondary rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-accent rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                        <div className="absolute bottom-20 right-20 w-4 h-4 bg-info rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    </div>
                </div>
                <div className="relative">
                    <StatsSection 
                        services={services} 
                        loading={loading}
                        realStats={realStats}
                    />
                </div>
            </section>

            {/* Featured Services with modern card design */}
            <section className="relative py-20 animate-fade-in-up animate-delay-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50/30 via-red-50/20 to-pink-50/30 dark:from-orange-900/10 dark:via-red-900/5 dark:to-pink-900/10"></div>
                <div className="relative">
                    <FeaturedServices 
                        services={services} 
                        loading={loading} 
                        user={user} 
                    />
                </div>
            </section>

            {/* Enhanced Testimonials Section */}
            <section className="relative py-20 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 animate-slide-in-up animate-delay-200">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-16 left-16 w-32 h-32 bg-gradient-to-br from-violet-300/20 to-purple-400/20 rounded-full blur-2xl animate-float-slow"></div>
                        <div className="absolute top-32 right-24 w-24 h-24 bg-gradient-to-br from-pink-300/20 to-rose-400/20 rounded-full blur-2xl animate-float-reverse"></div>
                        <div className="absolute bottom-24 left-1/4 w-40 h-40 bg-gradient-to-br from-indigo-300/20 to-blue-400/20 rounded-full blur-2xl animate-float-fast"></div>
                    </div>
                </div>
                <div className="relative">
                    <TestimonialsSection 
                        testimonials={testimonials}
                        reviewStats={reviewStats}
                        loading={loading}
                    />
                </div>
            </section>

            {/* Call to Action with dramatic styling */}
            <section className="relative py-32 overflow-hidden animate-scale-in animate-delay-300">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
                <div className="absolute inset-0">
                    {/* Animated mesh background */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20"></div>
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-red-600/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                </div>
                <div className="relative">
                    <CallToAction user={user} />
                </div>
            </section>

            {/* Scroll to top button */}
            <div className="fixed bottom-8 left-8 z-50">
                <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="btn btn-circle btn-primary shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                    aria-label="Scroll to top"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            </div>

            {/* Background decoration elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-200/10 to-orange-300/10 rounded-full blur-3xl animate-spin-slow"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-200/10 to-blue-300/10 rounded-full blur-3xl animate-spin-slow" style={{animationDirection: 'reverse'}}></div>
            </div>
        </div>
    );
};

export default Home;
