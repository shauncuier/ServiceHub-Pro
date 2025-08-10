import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Star, Zap } from 'lucide-react';

const Slide = ({ 
    title, 
    subtitle, 
    description, 
    backgroundImage, 
    backgroundGradient = "bg-gradient-to-r from-blue-600 to-purple-600",
    children,
    slideIndex = 0,
    isActive = true,
    parallaxEffect = true,
    particleEffect = false,
    animationType = 'fade'
}) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    // Mouse tracking for parallax effect
    useEffect(() => {
        if (!parallaxEffect) return;

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            setMousePosition({
                x: (clientX / innerWidth - 0.5) * 20,
                y: (clientY / innerHeight - 0.5) * 20
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [parallaxEffect]);

    // Generate floating particles
    const generateParticles = () => {
        if (!particleEffect) return null;
        
        return Array.from({ length: 6 }).map((_, index) => (
            <div
                key={index}
                className="absolute animate-float-slow"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                }}
            >
                <div className="w-4 h-4 bg-white/20 rounded-full blur-sm"></div>
            </div>
        ));
    };

    // Animation classes based on type and state
    const getAnimationClasses = () => {
        const baseClasses = "transition-all duration-1000 ease-out";
        
        if (!isActive) return `${baseClasses} opacity-0 scale-95`;
        
        switch (animationType) {
            case 'slide-left':
                return `${baseClasses} animate-slide-in-left`;
            case 'slide-right':
                return `${baseClasses} animate-slide-in-right`;
            case 'zoom':
                return `${baseClasses} animate-scale-in`;
            case 'fade':
            default:
                return `${baseClasses} animate-fade-in`;
        }
    };

    return (
        <div 
            className={`relative w-full h-full ${backgroundGradient} overflow-hidden group`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="img"
            aria-label={title}
        >
            {/* Enhanced Background Image with Parallax */}
            {backgroundImage && (
                <div className="absolute inset-0 opacity-30">
                    <img 
                        src={backgroundImage} 
                        alt={title || 'Slide background'}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                            parallaxEffect ? 'group-hover:scale-105' : ''
                        }`}
                        style={parallaxEffect ? {
                            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(${isHovered ? 1.05 : 1})`
                        } : {}}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
                </div>
            )}

            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Geometric shapes */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse blur-xl"
                     style={{ animationDuration: '4s' }}></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse blur-xl" 
                     style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
                <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse blur-xl" 
                     style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
                
                {/* Floating icons */}
                <div className="absolute top-1/4 left-1/3 animate-float-slow opacity-30">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Sparkles className="w-8 h-8 text-white/60" />
                    </div>
                </div>
                <div className="absolute bottom-1/3 right-1/4 animate-float-reverse opacity-30">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Star className="w-6 h-6 text-white/60" />
                    </div>
                </div>
                <div className="absolute top-1/2 right-1/3 animate-float-fast opacity-20">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Heart className="w-5 h-5 text-white/60" />
                    </div>
                </div>
                <div className="absolute bottom-1/4 left-1/5 animate-float-slow opacity-25" style={{ animationDelay: '1.5s' }}>
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Zap className="w-7 h-7 text-white/60" />
                    </div>
                </div>

                {/* Particle effects */}
                {generateParticles()}
            </div>
            
            {/* Enhanced Content */}
            <div className="relative z-10 flex items-center justify-center h-full px-6">
                <div className={`text-center text-white max-w-4xl ${getAnimationClasses()}`}>
                    {title && (
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            <span className="block animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                                {title.split(' ').slice(0, -1).join(' ')}
                            </span>
                            {title.split(' ').length > 1 && (
                                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                                    {title.split(' ').slice(-1)[0]}
                                </span>
                            )}
                        </h1>
                    )}
                    
                    {subtitle && (
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 opacity-90 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            {subtitle}
                        </h2>
                    )}
                    
                    {description && (
                        <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-80 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                            {description}
                        </p>
                    )}
                    
                    {/* Custom content */}
                    {children && (
                        <div className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
                            {children}
                        </div>
                    )}

                    {/* Decorative elements */}
                    <div className="flex justify-center mt-8 space-x-4 opacity-60">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                </div>
            </div>

            {/* Slide number indicator */}
            <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Slide {slideIndex + 1}
            </div>

            {/* Enhanced border effects */}
            <div className="absolute inset-0 border-2 border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        </div>
    );
};

export default Slide;
