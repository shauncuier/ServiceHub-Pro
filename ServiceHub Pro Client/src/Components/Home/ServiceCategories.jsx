import React from 'react';
import { Link } from 'react-router';

const ServiceCategories = ({ serviceCategories }) => {
    return (
        <div className="py-16 px-4 bg-base-200">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">Popular Service Categories</h2>
                    <p className="text-lg text-base-content/70">Find the repair service you need quickly</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {serviceCategories.map((category, index) => (
                        <Link 
                            key={index}
                            to={`/services?search=${encodeURIComponent(category.name.split(' ')[0])}`}
                            className="group card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="card-body text-center">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {category.icon}
                                </div>
                                <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-base-content/60">{category.description}</p>
                                <div className="badge badge-primary badge-sm mt-2">
                                    {category.count} services
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceCategories;
