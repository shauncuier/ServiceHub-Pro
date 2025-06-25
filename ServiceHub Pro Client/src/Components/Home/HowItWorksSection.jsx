import React from 'react';
import { Search, UserCheck, Calendar, Wrench, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
    const steps = [
        {
            step: 1,
            icon: Search,
            title: "Browse Services",
            description: "Search and explore hundreds of electronic repair services from verified technicians in your area.",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            delay: "0s"
        },
        {
            step: 2,
            icon: UserCheck,
            title: "Choose Provider",
            description: "Select the best service provider based on ratings, reviews, and pricing that fits your budget.",
            color: "text-green-600",
            bgColor: "bg-green-100",
            delay: "0.2s"
        },
        {
            step: 3,
            icon: Calendar,
            title: "Book Service",
            description: "Schedule your repair service at your convenient time with special instructions if needed.",
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            delay: "0.4s"
        },
        {
            step: 4,
            icon: Wrench,
            title: "Get Repaired",
            description: "Professional technician arrives at your location and fixes your device with genuine parts.",
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            delay: "0.6s"
        },
        {
            step: 5,
            icon: CheckCircle,
            title: "Enjoy & Review",
            description: "Your device is working perfectly! Leave a review to help other customers make better choices.",
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
            delay: "0.8s"
        }
    ];

    return (
        <div className="py-20 px-4 bg-base-200 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 right-20 w-64 h-64 bg-primary rounded-full animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-secondary rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent rounded-full animate-bounce-slow"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                        How ServiceHub Pro Works
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
                        Getting your electronic devices repaired has never been easier. Follow these simple steps to connect with professional technicians.
                    </p>
                </div>

                {/* Steps grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
                    {steps.map((step, index) => (
                        <div 
                            key={step.step}
                            className="relative group animate-slide-in-up"
                            style={{ animationDelay: step.delay }}
                        >
                            {/* Connection line for desktop */}
                            {index < steps.length - 1 && (
                                <div className="hidden xl:block absolute top-16 left-full w-8 z-0">
                                    <ArrowRight className="w-6 h-6 text-base-content/30 animate-pulse" />
                                </div>
                            )}
                            
                            <div className="bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-base-300 relative z-10">
                                {/* Step number */}
                                <div className="absolute -top-4 -right-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                    {step.step}
                                </div>
                                
                                {/* Icon */}
                                <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                    <step.icon className={`w-8 h-8 ${step.color}`} />
                                </div>
                                
                                {/* Content */}
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-base-content/70 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Why choose our process section */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 md:p-12 animate-scale-in">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-base-content mb-4">
                            Why Our Process Works Best
                        </h3>
                        <p className="text-base-content/70 max-w-2xl mx-auto">
                            We've streamlined the entire repair process to ensure maximum convenience and satisfaction for our customers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🚀",
                                title: "Fast & Efficient",
                                description: "Same-day service available with quick turnaround times for most repairs."
                            },
                            {
                                icon: "🛡️",
                                title: "Guaranteed Quality",
                                description: "All repairs come with warranty and 100% satisfaction guarantee."
                            },
                            {
                                icon: "💰",
                                title: "Transparent Pricing",
                                description: "No hidden costs. You know exactly what you pay before booking service."
                            }
                        ].map((benefit, index) => (
                            <div 
                                key={index}
                                className="text-center p-6 bg-base-100/50 backdrop-blur-sm rounded-xl border border-base-300/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.2 + 1}s` }}
                            >
                                <div className="text-4xl mb-4">{benefit.icon}</div>
                                <h4 className="text-lg font-semibold text-base-content mb-3">{benefit.title}</h4>
                                <p className="text-sm text-base-content/70">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to action */}
                <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
                    <h3 className="text-xl font-semibold text-base-content mb-4">
                        Ready to Get Your Device Repaired?
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="btn btn-primary btn-lg hover:scale-105 transition-all duration-300 shadow-xl group">
                            <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Browse Services Now
                        </button>
                        <button className="btn btn-outline btn-lg hover:scale-105 transition-all duration-300">
                            Learn More About Us
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksSection;
