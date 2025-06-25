import React from 'react';
import { Wrench, Shield, Clock, CheckCircle } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: Wrench,
            title: "Expert Technicians",
            description: "Certified professionals with verified skills and years of experience in electronic repairs",
            color: "text-primary",
            bgColor: "bg-primary/10",
            features: ["Verified Skills", "Licensed Professionals", "5+ Years Experience"]
        },
        {
            icon: Shield,
            title: "Quality Guarantee",
            description: "All repairs come with warranty, insurance coverage, and 100% satisfaction guarantee",
            color: "text-secondary",
            bgColor: "bg-secondary/10",
            features: ["Service Warranty", "Insurance Coverage", "Money Back Guarantee"]
        },
        {
            icon: Clock,
            title: "Quick Service",
            description: "Same-day service available with real-time tracking and progress updates",
            color: "text-accent",
            bgColor: "bg-accent/10",
            features: ["Same Day Service", "Real-time Tracking", "24/7 Support"]
        }
    ];

    return (
        <div className="py-20 px-4 bg-base-100">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                        Why Choose ServiceHub Pro?
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Experience the difference with our premium service marketplace designed for your convenience
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-base-300">
                            <div className="card-body">
                                <div className={`p-4 ${feature.bgColor} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`w-10 h-10 ${feature.color}`} />
                                </div>
                                <h3 className={`text-xl font-bold mb-4 ${feature.color}`}>{feature.title}</h3>
                                <p className="text-base-content/70 leading-relaxed mb-4">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.features.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className={`w-4 h-4 ${feature.color}`} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
