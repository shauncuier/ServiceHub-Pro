import React from 'react';
import { Link } from 'react-router';
import { Home } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

const ErrorPage = () => {
    usePageTitle('Page Not Found');

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 relative overflow-hidden">
            <div className="text-center max-w-lg mx-auto relative z-10">
                {/* Animated 404 Display with CSS animations */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-8xl md:text-9xl font-bold text-primary mb-4 animate-scale-in hover:scale-105 transition-transform duration-300 cursor-default">
                        404
                    </h1>
                    
                    <h2 className="text-2xl md:text-3xl font-semibold text-base-content mb-4 animate-slide-in-left">
                        Page Not Found
                    </h2>
                    
                    <p className="text-base-content/70 text-lg animate-slide-in-right">
                        The page you're looking for doesn't exist.
                    </p>
                </div>

                {/* Animated Action Button */}
                <div className="animate-fade-in-up-delayed">
                    <Link 
                        to="/" 
                        className="btn btn-primary btn-lg group hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        <div className="flex items-center group-hover:-translate-x-1 transition-transform duration-200">
                            <Home className="w-5 h-5 mr-2" />
                            Back to Home
                        </div>
                    </Link>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-20 w-16 h-16 bg-primary/10 rounded-full animate-float-slow"></div>
                <div className="absolute bottom-20 right-20 w-12 h-12 bg-secondary/10 rounded-full animate-float-reverse"></div>
                <div className="absolute top-1/3 right-10 w-8 h-8 bg-accent/10 rounded-full animate-float-fast"></div>
                <div className="absolute bottom-1/3 left-10 w-6 h-6 bg-primary/5 rounded-full animate-float"></div>
            </div>

            {/* Background animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-gradient"></div>
        </div>
    );
};

export default ErrorPage;
