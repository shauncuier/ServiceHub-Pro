import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Slide from './Slide';

const SlideDemo = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // Real slide data with high-quality images
    const slides = [
        {
            title: "Professional Smartphone Repair",
            subtitle: "Expert Screen & Battery Replacement",
            description: "Get your iPhone, Samsung, and other smartphones repaired by certified technicians with genuine parts and warranty.",
            backgroundImage: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=1920&h=1080&fit=crop&q=80",
            backgroundGradient: "bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"
        },
        {
            title: "Laptop & Computer Services",
            subtitle: "Hardware Upgrades & Software Solutions",
            description: "Complete laptop repair services including motherboard repair, RAM upgrades, SSD installation, and virus removal.",
            backgroundImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1920&h=1080&fit=crop&q=80",
            backgroundGradient: "bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800"
        },
        {
            title: "Home Appliance Repair",
            subtitle: "TV, AC & Electronics Maintenance",
            description: "Professional repair services for televisions, air conditioners, refrigerators, and other home electronics.",
            backgroundImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&q=80",
            backgroundGradient: "bg-gradient-to-br from-orange-600 via-red-700 to-pink-800"
        }
    ];

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlay) return;
        
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [slides.length, isAutoPlay]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const toggleAutoPlay = () => {
        setIsAutoPlay(!isAutoPlay);
    };

    return (
        <div className="relative w-full h-[80vh] overflow-hidden rounded-2xl shadow-2xl">
            {/* Slides Container */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                            index === currentSlide ? 'translate-x-0' : 
                            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                        }`}
                    >
                        <Slide
                            title={slide.title}
                            subtitle={slide.subtitle}
                            description={slide.description}
                            backgroundImage={slide.backgroundImage}
                            backgroundGradient={slide.backgroundGradient}
                        >
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                                <button className="btn btn-warning btn-lg hover:scale-105 transition-all duration-300 shadow-xl">
                                    Book Service Now
                                </button>
                                <button className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-black transition-all duration-300">
                                    Learn More
                                </button>
                            </div>
                        </Slide>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-20 group"
            >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <button 
                onClick={nextSlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-20 group"
            >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide 
                                ? 'bg-white w-10' 
                                : 'bg-white/50 w-3 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>

            {/* Play/Pause Control */}
            <button 
                onClick={toggleAutoPlay}
                className="absolute top-6 right-6 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 z-20"
                title={isAutoPlay ? 'Pause slideshow' : 'Play slideshow'}
            >
                {isAutoPlay ? (
                    <Pause className="w-5 h-5" />
                ) : (
                    <Play className="w-5 h-5" />
                )}
            </button>

            {/* Slide Counter */}
            <div className="absolute top-6 left-6 bg-black/30 text-white px-3 py-1 rounded-full backdrop-blur-sm text-sm font-medium z-20">
                {currentSlide + 1} / {slides.length}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
                <div 
                    className="h-full bg-white transition-all duration-300"
                    style={{ 
                        width: `${((currentSlide + 1) / slides.length) * 100}%` 
                    }}
                ></div>
            </div>
        </div>
    );
};

export default SlideDemo;
