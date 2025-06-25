import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = ({ testimonials = [], reviewStats, loading }) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // Fallback testimonials if no real data is available
    const fallbackTestimonials = [
        {
            id: 1,
            name: "Rashid Ahmed",
            location: "Dhaka",
            service: "Smartphone Repair",
            rating: 5,
            comment: "Excellent service! My iPhone screen was replaced perfectly and the technician was very professional. Fast delivery and reasonable price.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
        },
        {
            id: 2,
            name: "Fatima Khan",
            location: "Chittagong",
            service: "Laptop Repair",
            rating: 5,
            comment: "Amazing experience! My laptop was running very slow, but after their service it's working like new. Highly recommend ServiceHub Pro.",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=100&h=100&fit=crop"
        },
        {
            id: 3,
            name: "Mohammad Hassan",
            location: "Sylhet",
            service: "AC Repair",
            rating: 5,
            comment: "Professional and reliable service. My AC was not cooling properly, they fixed it completely. Great customer support and fair pricing.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
        },
        {
            id: 4,
            name: "Nusrat Jahan",
            location: "Comilla",
            service: "TV Repair",
            rating: 5,
            comment: "Quick and efficient service! My smart TV had display issues, they solved it within hours. Very satisfied with their professional approach.",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
        }
    ];

    // Filter and validate testimonials data to prevent undefined errors
    const validTestimonials = React.useMemo(() => {
        if (!testimonials || !Array.isArray(testimonials)) {
            return [];
        }
        
        return testimonials
            .filter(testimonial => {
                // More thorough validation
                if (!testimonial || typeof testimonial !== 'object') {
                    return false;
                }
                
                // Check if rating exists and is a valid number
                const hasValidRating = testimonial.rating !== undefined && 
                                     testimonial.rating !== null && 
                                     !isNaN(Number(testimonial.rating));
                
                // Check if comment exists
                const hasValidComment = testimonial.comment || 
                                      testimonial.review || 
                                      testimonial.feedback;
                
                return hasValidRating && hasValidComment;
            })
            .map(testimonial => {
                // Safely normalize the data structure
                try {
                    return {
                        id: testimonial._id || testimonial.id || Math.random().toString(36),
                        name: testimonial.customerName || testimonial.name || 'Anonymous User',
                        location: testimonial.customerLocation || testimonial.location || 'Bangladesh',
                        service: testimonial.serviceName || testimonial.service || 'Electronic Repair',
                        rating: Math.max(1, Math.min(5, Number(testimonial.rating) || 5)), // Ensure rating is 1-5
                        comment: testimonial.comment || testimonial.review || testimonial.feedback || 'Great service!',
                        avatar: testimonial.customerImage || testimonial.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
                    };
                } catch (error) {
                    console.warn('Error normalizing testimonial:', error);
                    return null;
                }
            })
            .filter(Boolean); // Remove any null results from map
    }, [testimonials]);

    // Use validated testimonials if available, otherwise use fallback
    const displayTestimonials = validTestimonials.length > 0 ? validTestimonials : fallbackTestimonials;

    // Auto-rotate testimonials with safety check
    useEffect(() => {
        if (displayTestimonials.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % displayTestimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [displayTestimonials.length]);

    // Reset current testimonial if it's out of bounds
    useEffect(() => {
        if (currentTestimonial >= displayTestimonials.length) {
            setCurrentTestimonial(0);
        }
    }, [displayTestimonials.length, currentTestimonial]);

    const nextTestimonial = () => {
        if (displayTestimonials.length > 0) {
            setCurrentTestimonial((prev) => (prev + 1) % displayTestimonials.length);
        }
    };

    const prevTestimonial = () => {
        if (displayTestimonials.length > 0) {
            setCurrentTestimonial((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
        }
    };

    const currentReview = displayTestimonials[currentTestimonial] || fallbackTestimonials[0] || {
        id: 'fallback',
        name: 'ServiceHub Pro Customer',
        location: 'Bangladesh',
        service: 'Electronic Repair',
        rating: 5,
        comment: 'Excellent service experience!',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    };

    // Default review stats if not provided
    const defaultReviewStats = {
        totalReviews: 2500,
        averageRating: 4.9,
        responseTime: '15min',
        positiveFeedback: 99.2
    };

    const displayReviewStats = reviewStats || defaultReviewStats;

    return (
        <div className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full animate-float"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-500 rounded-full animate-float-reverse"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500 rounded-full animate-bounce-slow"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Read genuine reviews from satisfied customers who trust ServiceHub Pro for their electronic repair needs
                    </p>
                    {loading && (
                        <div className="mt-4">
                            <span className="loading loading-spinner loading-sm text-primary"></span>
                            <span className="ml-2 text-sm text-base-content/60">Loading customer reviews...</span>
                        </div>
                    )}
                </div>

                {/* Main testimonial display */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-base-100 rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-105 transition-all duration-500 animate-scale-in">
                        {/* Quote icon */}
                        <div className="absolute top-6 left-6 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Quote className="w-6 h-6 text-primary" />
                        </div>

                        {/* Data source indicator */}
                        {testimonials && testimonials.length > 0 && (
                            <div className="absolute top-6 right-6 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                Real Reviews
                            </div>
                        )}

                        {/* Rating stars */}
                        <div className="flex justify-center mb-6 animate-fade-in-delay-1">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-6 h-6 ${i < (currentReview.rating || 5) ? 'text-warning fill-current' : 'text-base-300'}`}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                />
                            ))}
                        </div>

                        {/* Testimonial text */}
                        <blockquote className="text-lg md:text-xl text-center text-base-content leading-relaxed mb-8 animate-slide-in-up">
                            "{currentReview.comment || currentReview.review || currentReview.feedback}"
                        </blockquote>

                        {/* Customer info */}
                        <div className="flex items-center justify-center gap-4 animate-fade-in-delay-2">
                            <img
                                src={currentReview.avatar || currentReview.customerImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'}
                                alt={currentReview.name || currentReview.customerName}
                                className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20"
                            />
                            <div className="text-center">
                                <h4 className="text-lg font-semibold text-base-content">
                                    {currentReview.name || currentReview.customerName}
                                </h4>
                                <p className="text-base-content/60">
                                    {currentReview.location || currentReview.customerLocation || 'Bangladesh'}
                                </p>
                                <p className="text-sm text-primary font-medium">
                                    {currentReview.service || currentReview.serviceName || 'Electronic Repair'}
                                </p>
                            </div>
                        </div>

                        {/* Navigation arrows */}
                        <button 
                            onClick={prevTestimonial}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-base-100 hover:bg-primary hover:text-white text-base-content p-2 rounded-full shadow-lg transition-all duration-300 group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        
                        <button 
                            onClick={nextTestimonial}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-base-100 hover:bg-primary hover:text-white text-base-content p-2 rounded-full shadow-lg transition-all duration-300 group"
                        >
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Testimonial indicators */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {displayTestimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentTestimonial(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentTestimonial ? 'bg-primary w-8' : 'bg-base-300 hover:bg-primary/50'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Review & Trust Metrics (Real data with fallback) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in-up">
                    {[
                        { 
                            number: `${displayReviewStats.totalReviews?.toLocaleString() || '2,500'}+`, 
                            label: "Customer Reviews" 
                        },
                        { 
                            number: `${displayReviewStats.averageRating || '4.9'}★`, 
                            label: "Average Rating" 
                        },
                        { 
                            number: displayReviewStats.responseTime || '15min', 
                            label: "Avg Response Time" 
                        },
                        { 
                            number: `${displayReviewStats.positiveFeedback || '99.2'}%`, 
                            label: "Positive Feedback" 
                        }
                    ].map((metric, index) => (
                        <div 
                            key={index} 
                            className="text-center p-6 bg-base-100/50 backdrop-blur-sm rounded-xl border border-base-300/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{metric.number}</div>
                            <div className="text-sm text-base-content/70">{metric.label}</div>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    {[
                        { icon: "🏆", label: "Best Service 2024" },
                        { icon: "🛡️", label: "Verified Reviews" },
                        { icon: "⚡", label: "Quick Response" },
                        { icon: "💯", label: "Quality Guaranteed" }
                    ].map((badge, index) => (
                        <div 
                            key={index}
                            className="flex items-center gap-3 px-4 py-2 bg-base-100/70 backdrop-blur-sm border border-base-300/30 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <span className="text-xl">{badge.icon}</span>
                            <span className="text-sm font-medium text-base-content/80">{badge.label}</span>
                        </div>
                    ))}
                </div>

                {/* Data source disclaimer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-base-content/50">
                        {testimonials && testimonials.length > 0 
                            ? `Showing ${testimonials.length} recent reviews from our database`
                            : 'Sample testimonials shown - Real reviews will appear when available'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;
