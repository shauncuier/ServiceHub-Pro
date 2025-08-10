import React from 'react';
import { Wrench, Shield, Clock, CheckCircle, Star, Sparkles, Award, Users } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: Wrench,
            title: "Expert Technicians",
            description: "Certified professionals with verified skills and years of experience in electronic repairs",
            color: "text-blue-600",
            bgGradient: "from-blue-500/20 to-indigo-500/20",
            borderColor: "border-blue-200 dark:border-blue-800",
            hoverBg: "group-hover:from-blue-500/30 group-hover:to-indigo-500/30",
            features: ["Verified Skills", "Licensed Professionals", "5+ Years Experience"],
            badge: "Top Rated",
            stats: "1000+ Experts"
        },
        {
            icon: Shield,
            title: "Quality Guarantee",
            description: "All repairs come with warranty, insurance coverage, and 100% satisfaction guarantee",
            color: "text-emerald-600",
            bgGradient: "from-emerald-500/20 to-green-500/20",
            borderColor: "border-emerald-200 dark:border-emerald-800",
            hoverBg: "group-hover:from-emerald-500/30 group-hover:to-green-500/30",
            features: ["Service Warranty", "Insurance Coverage", "Money Back Guarantee"],
            badge: "Guaranteed",
            stats: "99.9% Success"
        },
        {
            icon: Clock,
            title: "Quick Service",
            description: "Same-day service available with real-time tracking and progress updates",
            color: "text-purple-600",
            bgGradient: "from-purple-500/20 to-pink-500/20",
            borderColor: "border-purple-200 dark:border-purple-800",
            hoverBg: "group-hover:from-purple-500/30 group-hover:to-pink-500/30",
            features: ["Same Day Service", "Real-time Tracking", "24/7 Support"],
            badge: "Fast Track",
            stats: "< 24hrs Avg"
        }
    ];

    return (
        <div className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-6">
                        <Star className="w-4 h-4 mr-2" />
                        Premium Features
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6">
                        Why Choose 
                        <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            ServiceHub Pro?
                        </span>
                    </h2>
                    <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
                        Experience the difference with our premium service marketplace designed for your convenience and peace of mind
                    </p>
                </div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className={`group relative overflow-hidden rounded-3xl border-2 ${feature.borderColor} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-base-200/80 dark:to-base-300/80 backdrop-blur-sm`}
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} ${feature.hoverBg} transition-all duration-500`}></div>
                            
                            {/* Content */}
                            <div className="relative p-8">
                                {/* Badge */}
                                <div className="absolute top-6 right-6">
                                    <div className={`inline-flex items-center bg-gradient-to-r ${feature.bgGradient} px-3 py-1 rounded-full text-xs font-bold ${feature.color} border border-current/20`}>
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        {feature.badge}
                                    </div>
                                </div>

                                {/* Icon */}
                                <div className="mb-8">
                                    <div className={`inline-flex p-4 bg-gradient-to-br ${feature.bgGradient} rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                                        <feature.icon className={`w-12 h-12 ${feature.color}`} />
                                    </div>
                                    {/* Floating decoration */}
                                    <div className={`absolute top-16 left-16 w-4 h-4 ${feature.color.replace('text-', 'bg-')} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-ping`}></div>
                                </div>

                                {/* Title & Description */}
                                <h3 className={`text-2xl font-bold mb-4 ${feature.color} group-hover:scale-105 transition-transform duration-300`}>
                                    {feature.title}
                                </h3>
                                <p className="text-base-content/70 leading-relaxed mb-6 text-lg">
                                    {feature.description}
                                </p>

                                {/* Features List */}
                                <ul className="space-y-3 mb-6">
                                    {feature.features.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle className={`w-5 h-5 ${feature.color} flex-shrink-0`} />
                                            <span className="text-base-content/80 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Stats */}
                                <div className={`inline-flex items-center bg-gradient-to-r ${feature.bgGradient} px-4 py-2 rounded-full`}>
                                    <Award className={`w-4 h-4 ${feature.color} mr-2`} />
                                    <span className={`font-bold text-sm ${feature.color}`}>{feature.stats}</span>
                                </div>
                            </div>

                            {/* Hover Effects */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        </div>
                    ))}
                </div>

                {/* Call to Action Section */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8 rounded-3xl border-2 border-primary/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/20 rounded-full">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-xl text-base-content">Join 50,000+ Happy Customers</div>
                                <div className="text-base-content/70">Experience the ServiceHub Pro difference today</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-warning">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 fill-current" />
                            ))}
                            <span className="ml-2 font-bold text-lg">4.9/5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
