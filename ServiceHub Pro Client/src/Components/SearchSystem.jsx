import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Search, X, MapPin, DollarSign, User } from 'lucide-react';
import { api } from '../utils/api';

const SearchSystem = ({ placeholder = "Search services...", className = "" }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle clicks outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      // Fetch all services and filter locally for better performance
      const response = await api.services.getAll();
      const services = Array.isArray(response) ? response : response.services || [];

      // Filter services based on search query
      const filteredServices = services.filter(service => 
        service.serviceName?.toLowerCase().includes(query.toLowerCase()) ||
        service.serviceDescription?.toLowerCase().includes(query.toLowerCase()) ||
        service.providerName?.toLowerCase().includes(query.toLowerCase()) ||
        service.serviceArea?.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredServices.slice(0, 8)); // Limit to 8 results for better UX
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      setShowResults(true);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    searchRef.current?.focus();
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery('');
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-primary/20 text-primary font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="input input-bordered w-full pl-12 pr-12 bg-base-100/80 border-base-300/50 focus:border-primary focus:bg-base-100 focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-full shadow-sm hover:shadow-md focus:shadow-lg"
          onFocus={() => searchQuery.trim() && setShowResults(true)}
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/40 hover:text-error transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <span className="loading loading-spinner loading-sm text-primary"></span>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
        >
          {/* Search Header */}
          <div className="px-4 py-3 border-b border-base-300 bg-base-200/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-base-content">
                {loading ? 'Searching...' : `${searchResults.length} results for "${searchQuery}"`}
              </span>
              {searchResults.length > 0 && (
                <Link
                  to={`/services?search=${encodeURIComponent(searchQuery)}`}
                  onClick={handleResultClick}
                  className="text-sm text-primary hover:text-primary-focus font-medium"
                >
                  See all results
                </Link>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="py-2">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <span className="loading loading-spinner loading-md text-primary"></span>
                <p className="mt-2 text-sm text-base-content/70">Searching services...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((service) => (
                  <Link
                    key={service._id}
                    to={`/services/${service._id}`}
                    onClick={handleResultClick}
                    className="block px-4 py-3 hover:bg-base-200 transition-colors border-b border-base-200 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      {/* Service Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={service.serviceImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop'}
                          alt={service.serviceName}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop';
                          }}
                        />
                      </div>

                      {/* Service Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base-content truncate">
                          {highlightText(service.serviceName, searchQuery)}
                        </h3>
                        <p className="text-sm text-base-content/70 line-clamp-1 mt-1">
                          {highlightText(
                            service.serviceDescription?.substring(0, 60) + 
                            (service.serviceDescription?.length > 60 ? '...' : ''), 
                            searchQuery
                          )}
                        </p>
                        
                        {/* Service Details */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-base-content/60">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{highlightText(service.providerName, searchQuery)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{service.serviceArea}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span className="font-medium text-primary">৳{service.servicePrice}</span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs text-primary">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : searchQuery.trim() && !loading ? (
              <div className="px-4 py-8 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="font-medium text-base-content mb-1">No services found</h3>
                <p className="text-sm text-base-content/70">
                  Try searching with different keywords or browse all services
                </p>
                <Link
                  to="/services"
                  onClick={handleResultClick}
                  className="btn btn-sm btn-primary mt-3"
                >
                  Browse All Services
                </Link>
              </div>
            ) : null}
          </div>

          {/* Quick Actions */}
          {searchQuery.trim() && !loading && (
            <div className="px-4 py-3 border-t border-base-300 bg-base-200/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-base-content/60">
                  Press Enter to search all services
                </span>
                <Link
                  to={`/services?search=${encodeURIComponent(searchQuery)}`}
                  onClick={handleResultClick}
                  className="text-primary hover:text-primary-focus font-medium"
                >
                  View all results →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSystem;
