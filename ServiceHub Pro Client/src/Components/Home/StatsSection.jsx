import React, { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import { Users, Wrench, Award, CheckCircle } from 'lucide-react';

const StatsSection = ({ services, loading, realStats }) => {
    const [startAnimation, setStartAnimation] = useState(false);
    const sectionRef = useRef(null);

    // Use real stats from props or calculate from services
    const displayStats = React.useMemo(() => {
        if (realStats && (realStats.totalServices > 0 || realStats.totalProviders > 0)) {
            return realStats;
        }

        if (!services || services.length === 0) {
            return {
                totalServices: 0,
                totalProviders: 0,
                completedJobs: 0,
                happyCustomers: 0
            };
        }

        const uniqueProviders = new Set(services.map(service => service.providerEmail)).size;
        const totalServices = services.length;
        
        return {
            totalServices,
            totalProviders: uniqueProviders,
            completedJobs: Math.floor(totalServices * 12),
            happyCustomers: Math.floor(uniqueProviders * 15)
        };
    }, [services, realStats]);

    const statsData = [
        { 
            icon: Wrench, 
            label: "Services Available", 
            value: displayStats.totalServices, 
            suffix: "+",
            color: "text-primary",
            bgColor: "bg-primary",
            delay: 0
        },
        { 
            icon: Award, 
            label: "Expert Providers", 
            value: displayStats.totalProviders, 
            suffix: "+",
            color: "text-secondary",
            bgColor: "bg-secondary",
            delay: 0.2
        },
        { 
            icon: CheckCircle, 
            label: "Jobs Completed", 
            value: displayStats.completedJobs, 
            suffix: "+",
            color: "text-success",
            bgColor: "bg-success",
            delay: 0.4
        },
        { 
            icon: Users, 
            label: "Happy Customers", 
            value: displayStats.happyCustomers, 
            suffix: "+",
            color: "text-info",
            bgColor: "bg-info",
            delay: 0.6
        }
    ];

    // Intersection Observer for scroll detection
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !startAnimation && !loading) {
                        setStartAnimation(true);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [startAnimation, loading]);

    // Reset animation when data changes
    useEffect(() => {
        if (!loading && (services.length > 0 || (realStats && realStats.totalServices > 0))) {
            setStartAnimation(false);
        }
    }, [services, loading, realStats]);

    return (
        <div 
            ref={sectionRef}
            className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10"
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                        Trusted by Thousands
                    </h2>
                    <p className="text-lg text-base-content/70">
                        Join our growing community of satisfied customers and service providers
                    </p>
                    {loading && (
                        <div className="mt-4">
                            <span className="loading loading-spinner loading-sm text-primary"></span>
                            <span className="ml-2 text-sm text-base-content/60">Loading real statistics...</span>
                        </div>
                    )}
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {statsData.map((stat, index) => (
                        <div 
                            key={index} 
                            className="text-center group"
                            style={{ 
                                animationDelay: `${stat.delay}s`,
                                animation: startAnimation ? 'fadeInUp 0.8s ease-out forwards' : 'none'
                            }}
                        >
                            <div className="p-6 bg-base-100 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-base-300 relative overflow-hidden">
                                {/* Background Gradient Effect */}
                                <div className={`absolute inset-0 ${stat.bgColor}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                
                                {/* Icon */}
                                <div className={`w-12 h-12 ${stat.color} mx-auto mb-4 p-2 bg-base-200 rounded-full group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                                    <stat.icon className="w-full h-full" />
                                </div>
                                
                                {/* Animated Counter */}
                                <div className={`text-4xl font-bold mb-2 ${stat.color} transition-all duration-300 relative z-10`}>
                                    {loading ? (
                                        <span className="loading loading-dots loading-sm"></span>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            {startAnimation && stat.value > 0 ? (
                                                <CountUp
                                                    start={0}
                                                    end={stat.value}
                                                    duration={2.5}
                                                    delay={stat.delay}
                                                    separator=","
                                                    preserveValue={true}
                                                    useEasing={true}
                                                    easingFn={(t, b, c, d) => {
                                                        t /= d;
                                                        t--;
                                                        return c * (t * t * t + 1) + b;
                                                    }}
                                                />
                                            ) : (
                                                0
                                            )}
                                            <span className="ml-1">{stat.suffix}</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Label */}
                                <div className="text-sm font-medium text-base-content/70 relative z-10">
                                    {stat.label}
                                </div>
                                
                                {/* Progress Bar Effect */}
                                {startAnimation && !loading && (
                                    <div className="mt-3 relative z-10">
                                        <div className={`w-12 h-1 ${stat.bgColor} mx-auto rounded-full opacity-60 animate-pulse`}></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Real-time Data Indicator */}
                {!loading && services.length > 0 && (
                    <div className="text-center mt-8">
                        <div 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-base-100/50 backdrop-blur-sm border border-base-300/50 rounded-full text-sm"
                            style={{ 
                                animationDelay: '1s',
                                animation: startAnimation ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                            }}
                        >
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-base-content/70">
                                Real-time data from {services.length} active services
                            </span>
                        </div>
                    </div>
                )}

                {/* Platform Performance Indicators */}
                {startAnimation && !loading && displayStats.totalServices > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {[
                            { label: "Platform Growth", value: "+28%", icon: "📈" },
                            { label: "Service Quality", value: "4.8/5", icon: "⭐" },
                            { label: "Response Time", value: "< 2hrs", icon: "⚡" },
                            { label: "Success Rate", value: "99.1%", icon: "✅" }
                        ].map((metric, index) => (
                            <div 
                                key={index} 
                                className="text-center p-4 bg-base-100/70 rounded-xl border border-base-300/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                style={{ 
                                    animationDelay: `${(index * 0.15) + 1.2}s`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                <div className="text-lg mb-1">{metric.icon}</div>
                                <div className="text-lg font-bold text-success">{metric.value}</div>
                                <div className="text-xs text-base-content/60 font-medium">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Platform Achievements */}
                {startAnimation && !loading && displayStats.totalServices > 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {[
                            { label: "Verified Platform", icon: "🏆", condition: displayStats.totalProviders > 0 },
                            { label: "Trusted Service", icon: "🛡️", condition: displayStats.totalServices >= 5 },
                            { label: "Growing Community", icon: "🚀", condition: displayStats.totalServices >= 10 },
                            { label: "Excellence Award", icon: "⭐", condition: displayStats.totalServices >= 20 }
                        ].filter(badge => badge.condition).map((badge, index) => (
                            <div 
                                key={index}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full text-sm font-medium"
                                style={{ 
                                    animationDelay: `${(index * 0.1) + 1.8}s`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                <span>{badge.icon}</span>
                                <span className="text-base-content/80">{badge.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsSection;
