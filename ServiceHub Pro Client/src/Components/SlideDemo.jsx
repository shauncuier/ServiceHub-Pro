import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import Slide from './Slide';

const SlideDemo = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [slideDirection, setSlideDirection] = useState('next');
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const slideContainerRef = useRef(null);
    const progressRef = useRef(null);

    // Enhanced slide data with high-quality images and metadata
    const slides = [
        {
            id: 'smartphone-repair',
            title: "Professional Smartphone Repair",
            subtitle: "Expert Screen & Battery Replacement",
            description: "Get your iPhone, Samsung, and other smartphones repaired by certified technicians with genuine parts and warranty.",
            backgroundImage: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=1920&h=1080&fit=crop&q=80",
            backgroundGradient: "bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800",
            duration: 5000,
            keywords: ["smartphone", "iPhone", "Samsung", "screen repair", "battery replacement"]
        },
        {
            id: 'laptop-services',
            title: "Laptop & Computer Services",
            subtitle: "Hardware Upgrades & Software Solutions",
            description: "Complete laptop repair services including motherboard repair, RAM upgrades, SSD installation, and virus removal.",
            backgroundImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1920&h=1080&fit=crop&q=80",
            backgroundGradient: "bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800",
            duration: 5000,
            keywords: ["laptop", "computer", "hardware", "software", "upgrades"]
        },
        {
            id: 'appliance-repair',
            title: "Home Appliance Repair",
            subtitle: "TV, AC & Electronics Maintenance",
            description: "Professional repair services for televisions, air conditioners, refrigerators, and other home electronics.",
            backgroundImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&q=80",
            backgroundGradient: "bg-gradient-to-br from-orange-600 via-red-700 to-pink-800",
            duration: 5000,
            keywords: ["TV", "air conditioner", "refrigerator", "appliances", "electronics"]
        },
        {
            id: 'quality-service',
            title: "Quality Assurance",
            subtitle: "100% Satisfaction Guaranteed",
            description: "All our services come with comprehensive warranty and 24/7 customer support for complete peace of mind.",
            backgroundImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop&q=80",
            backgroundGradient: "bg-gradient-to-br from-purple-600 via-pink-600 to-red-700",
            duration: 4000,
            keywords: ["quality", "warranty", "support", "guarantee", "professional"]
        }
    ];

    // Enhanced auto-slide functionality with custom durations
    useEffect(() => {
        if (!isAutoPlay || isTransitioning) return;
        
        const currentSlideDuration = slides[currentSlide]?.duration || 5000;
        
        const interval = setInterval(() => {
            nextSlide();
        }, currentSlideDuration);
        
        return () => clearInterval(interval);
    }, [currentSlide, isAutoPlay, isTransitioning]);

    // Progress bar animation
    useEffect(() => {
        if (progressRef.current && isAutoPlay && !isTransitioning) {
            const duration = slides[currentSlide]?.duration || 5000;
            progressRef.current.style.animation = 'none';
            progressRef.current.offsetHeight; // Trigger reflow
            progressRef.current.style.animation = `progress-fill ${duration}ms linear`;
        }
    }, [currentSlide, isAutoPlay, isTransitioning]);

    // Touch gesture handlers
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            } else if (e.key === ' ') {
                e.preventDefault();
                toggleAutoPlay();
            } else if (e.key === 'Escape' && isFullscreen) {
                toggleFullscreen();
            } else if (e.key === 'r' || e.key === 'R') {
                resetSlider();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    // Fullscreen handling
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setSlideDirection('next');
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsTransitioning(false), 700);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setSlideDirection('prev');
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsTransitioning(false), 700);
    };

    const goToSlide = (index) => {
        if (isTransitioning || index === currentSlide) return;
        setIsTransitioning(true);
        setSlideDirection(index > currentSlide ? 'next' : 'prev');
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 700);
    };

    const toggleAutoPlay = () => {
        setIsAutoPlay(!isAutoPlay);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = async () => {
        if (!slideContainerRef.current) return;

        try {
            if (!isFullscreen) {
                await slideContainerRef.current.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    };

    const resetSlider = () => {
        setCurrentSlide(0);
        setIsAutoPlay(true);
        setIsMuted(true);
    };

    return (
        <div 
            ref={slideContainerRef}
            className={`relative w-full overflow-hidden shadow-2xl transition-all duration-300 group ${
                isFullscreen ? 'h-screen rounded-none' : 'h-[80vh] rounded-2xl'
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Interactive slide presentation"
            tabIndex="0"
        >
            {/* Slides Container */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                            index === currentSlide ? 'translate-x-0 opacity-100' : 
                            slideDirection === 'next' 
                                ? (index < currentSlide ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0')
                                : (index < currentSlide ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0')
                        }`}
                        aria-hidden={index !== currentSlide}
                    >
                        <Slide
                            title={slide.title}
                            subtitle={slide.subtitle}
                            description={slide.description}
                            backgroundImage={slide.backgroundImage}
                            backgroundGradient={slide.backgroundGradient}
                        >
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                                <button 
                                    className="btn btn-warning btn-lg hover:scale-105 transition-all duration-300 shadow-xl animate-bounce-slow"
                                    onClick={() => console.log(`Booking service: ${slide.title}`)}
                                >
                                    Book Service Now
                                </button>
                                <button 
                                    className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                                    onClick={() => console.log(`Learn more about: ${slide.title}`)}
                                >
                                    Learn More
                                </button>
                            </div>
                            
                            {/* Slide Metadata */}
                            <div className="mt-6 text-white/60 text-sm">
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {slide.keywords.map((keyword, idx) => (
                                        <span 
                                            key={idx}
                                            className="px-2 py-1 bg-white/10 rounded-full text-xs backdrop-blur-sm"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Slide>
                    </div>
                ))}
            </div>

            {/* Enhanced Navigation Arrows */}
            <button 
                onClick={prevSlide}
                disabled={isTransitioning}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-20 group/nav opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 group-hover/nav:-translate-x-1 transition-transform" />
            </button>
            
            <button 
                onClick={nextSlide}
                disabled={isTransitioning}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-20 group/nav opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 group-hover/nav:translate-x-1 transition-transform" />
            </button>

            {/* Enhanced Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        onClick={() => goToSlide(index)}
                        disabled={isTransitioning}
                        className={`h-3 rounded-full transition-all duration-300 hover:scale-110 focus:scale-110 disabled:opacity-50 ${
                            index === currentSlide 
                                ? 'bg-white w-10 shadow-lg' 
                                : 'bg-white/50 w-3 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                        title={slide.title}
                    />
                ))}
            </div>

            {/* Enhanced Control Panel */}
            <div className="absolute top-6 right-6 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={toggleAutoPlay}
                    className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                    aria-label={isAutoPlay ? 'Pause slideshow' : 'Play slideshow'}
                >
                    {isAutoPlay ? (
                        <Pause className="w-5 h-5" />
                    ) : (
                        <Play className="w-5 h-5" />
                    )}
                </button>

                <button 
                    onClick={toggleMute}
                    className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                    ) : (
                        <Volume2 className="w-5 h-5" />
                    )}
                </button>

                <button 
                    onClick={resetSlider}
                    className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                    aria-label="Reset slider"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>

                <button 
                    onClick={toggleFullscreen}
                    className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                    {isFullscreen ? (
                        <Minimize2 className="w-5 h-5" />
                    ) : (
                        <Maximize2 className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Enhanced Slide Counter */}
            <div className="absolute top-6 left-6 bg-black/30 text-white px-3 py-1 rounded-full backdrop-blur-sm text-sm font-medium z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span aria-live="polite">
                    {currentSlide + 1} / {slides.length}
                </span>
                <span className="ml-2 text-xs text-white/70">
                    ({slides[currentSlide]?.title})
                </span>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
                <div 
                    ref={progressRef}
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-300"
                    style={{ 
                        width: `${((currentSlide + 1) / slides.length) * 100}%` 
                    }}
                ></div>
            </div>

            {/* Slide Thumbnails (shown on hover) */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        onClick={() => goToSlide(index)}
                        disabled={isTransitioning}
                        className={`w-16 h-10 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 disabled:opacity-50 ${
                            index === currentSlide 
                                ? 'border-white shadow-lg scale-110' 
                                : 'border-white/30 hover:border-white/60'
                        }`}
                        aria-label={`Preview slide ${index + 1}: ${slide.title}`}
                    >
                        <img 
                            src={slide.backgroundImage} 
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Keyboard Shortcuts Guide (hidden by default) */}
            <div className="absolute top-20 left-6 bg-black/30 text-white p-3 rounded-lg backdrop-blur-sm text-xs z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="font-medium mb-1">Keyboard Shortcuts:</div>
                <div>← → Navigate | Space Play/Pause | R Reset | Esc Exit Fullscreen</div>
            </div>
        </div>
    );
};

export default SlideDemo;
