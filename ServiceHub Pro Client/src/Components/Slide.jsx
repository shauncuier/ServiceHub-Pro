import React from 'react';

const Slide = ({ 
    title, 
    subtitle, 
    description, 
    backgroundImage, 
    backgroundGradient = "bg-gradient-to-r from-blue-600 to-purple-600",
    children 
}) => {
    return (
        <div className={`relative w-full h-full ${backgroundGradient} overflow-hidden`}>
            {/* Background Image */}
            {backgroundImage && (
                <div className="absolute inset-0 opacity-30">
                    <img 
                        src={backgroundImage} 
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full px-6">
                <div className="text-center text-white max-w-4xl">
                    {title && (
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                            {title}
                        </h1>
                    )}
                    
                    {subtitle && (
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 opacity-90 animate-fade-in-delay-1">
                            {subtitle}
                        </h2>
                    )}
                    
                    {description && (
                        <p className="text-lg md:text-xl mb-8 opacity-80 animate-fade-in-delay-2">
                            {description}
                        </p>
                    )}
                    
                    {/* Custom content */}
                    {children && (
                        <div className="animate-fade-in-delay-3">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Slide;
