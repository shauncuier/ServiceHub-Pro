import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Menu, X, LogOut, ChevronDown, Grid3X3, User, Settings } from 'lucide-react';
import { Link } from 'react-router';
import { Tooltip } from 'react-tooltip';
import { useTheme } from '../Context/ThemeContext';
import { useAuth } from '../Auth/AuthContext';
import SearchSystem from './SearchSystem';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const userDropdownRef = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
            Swal.fire({
                icon: 'success',
                title: 'Logged Out',
                text: 'You have been successfully logged out.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Logout Failed',
                text: 'Unable to logout. Please try again.',
                confirmButtonColor: '#3085d6'
            });
        }
    };

    const closeDropdown = () => {
        if (dropdownRef.current) {
            dropdownRef.current.blur();
        }
        if (userDropdownRef.current) {
            userDropdownRef.current.blur();
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                dropdownRef.current.blur();
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                userDropdownRef.current.blur();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/60">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                                <div className="relative">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                                    </svg>
                                    <div className="absolute -top-1 -right-2 w-3 h-3 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="flex flex-col">
                                <h1 className="font-bold text-xl text-base-content group-hover:text-primary transition-colors duration-300 leading-tight">
                                    ServiceHub <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pro</span>
                                </h1>
                                <p className="text-xs text-base-content/60 font-medium tracking-wider uppercase">
                                    Tech Repair Services
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation & Search */}
                    <div className="hidden md:flex items-center space-x-6 flex-1 max-w-2xl mx-6">
                        <nav className="flex items-center space-x-1">
                            <Link 
                                to="/" 
                                className="px-4 py-2 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                            >
                                Home
                            </Link>
                            <Link 
                                to="/services" 
                                className="px-4 py-2 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                            >
                                Services
                            </Link>
                        </nav>
                        
                        {/* Global Search */}
                        <div className="flex-1 max-w-md">
                            <SearchSystem 
                                placeholder="Search services..." 
                                className="w-full" 
                            />
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-3">
                        {user ? (
                            <>
                                {/* Dashboard Dropdown */}
                                <div className="hidden md:block">
                                    <div className="dropdown dropdown-end" ref={dropdownRef}>
                                        <div 
                                            tabIndex={0} 
                                            role="button" 
                                            className="btn btn-ghost btn-sm gap-2 hover:bg-base-200 border border-base-300/50 hover:border-base-300"
                                        >
                                            <Grid3X3 className="w-4 h-4" />
                                            <span className="text-sm font-medium">Dashboard</span>
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
                                        <ul 
                                            tabIndex={0} 
                                            className="dropdown-content z-[1] menu p-3 shadow-xl bg-base-100 border border-base-300 rounded-xl w-56 mt-2"
                                        >
                                            <li className="mb-2">
                                                <Link 
                                                    to="/add-service" 
                                                    onClick={closeDropdown}
                                                    className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-all duration-200"
                                                >
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="font-medium">Add Service</span>
                                                </Link>
                                            </li>
                                            <li className="mb-2">
                                                <Link 
                                                    to="/manage-services" 
                                                    onClick={closeDropdown}
                                                    className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-all duration-200"
                                                >
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span className="font-medium">Manage Services</span>
                                                </Link>
                                            </li>
                                            <div className="divider my-2"></div>
                                            <li className="mb-2">
                                                <Link 
                                                    to="/booked-services" 
                                                    onClick={closeDropdown}
                                                    className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-all duration-200"
                                                >
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    <span className="font-medium">Booked Services</span>
                                                </Link>
                                            </li>
                                            <li className="mb-2">
                                                <Link 
                                                    to="/bookings" 
                                                    onClick={closeDropdown}
                                                    className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-all duration-200"
                                                >
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                    <span className="font-medium">My Bookings</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link 
                                                    to="/service-todo" 
                                                    onClick={closeDropdown}
                                                    className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-all duration-200"
                                                >
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    <span className="font-medium">Service To-Do</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* User Profile Dropdown */}
                                <div className="dropdown dropdown-end" ref={userDropdownRef}>
                                    <div 
                                        tabIndex={0} 
                                        role="button" 
                                        className="btn btn-ghost btn-circle btn-sm hover:bg-base-200 transition-all duration-200"
                                        data-tooltip-id="user-tooltip"
                                        data-tooltip-content={userName}
                                        data-tooltip-place="bottom"
                                    >
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                                            <img 
                                                src={user.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} 
                                                alt={userName} 
                                                className="w-full h-full rounded-full object-cover bg-base-100"
                                            />
                                        </div>
                                    </div>
                                    <ul 
                                        tabIndex={0} 
                                        className="dropdown-content z-[1] menu p-3 shadow-xl bg-base-100 border border-base-300 rounded-xl w-64 mt-2"
                                    >
                                        {/* User Info Header */}
                                        <li className="mb-3">
                                            <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                                                    <img 
                                                        src={user.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} 
                                                        alt={userName} 
                                                        className="w-full h-full rounded-full object-cover bg-base-100"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-base-content text-sm">{userName}</p>
                                                    <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </li>
                                        
                                        <div className="divider my-2"></div>
                                        
                                        {/* Profile Menu Items */}
                                        <li className="mb-2">
                                            <Link 
                                                to="/profile-settings" 
                                                onClick={closeDropdown}
                                                className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-all duration-200 w-full text-left"
                                            >
                                                <User className="w-4 h-4" />
                                                <span className="font-medium">Profile Settings</span>
                                            </Link>
                                        </li>
                                        <li className="mb-2">
                                            <button className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-all duration-200 w-full text-left">
                                                <Settings className="w-4 h-4" />
                                                <span className="font-medium">Preferences</span>
                                            </button>
                                        </li>
                                        
                                        <div className="divider my-2"></div>
                                        
                                        {/* Logout Button */}
                                        <li>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    closeDropdown();
                                                }}
                                                className="flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-lg transition-all duration-200 w-full text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span className="font-medium">Logout</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="px-4 py-2 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                        
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                            aria-label="Toggle theme"
                            data-tooltip-id="theme-tooltip"
                            data-tooltip-content={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            data-tooltip-place="bottom"
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5" />
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-base-300 bg-base-100/95 backdrop-blur">
                        <div className="max-w-7xl mx-auto px-6 py-4">
                            <div className="space-y-1">
                                {/* Mobile Search */}
                                <div className="px-4 py-3">
                                    <SearchSystem 
                                        placeholder="Search services..." 
                                        className="w-full" 
                                    />
                                </div>
                                
                                <div className="h-px bg-base-300 my-4"></div>
                                
                                <Link
                                    to="/"
                                    className="block px-4 py-3 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/services"
                                    className="block px-4 py-3 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Services
                                </Link>
                                
                                {user ? (
                                    <>
                                        <div className="h-px bg-base-300 my-4"></div>
                                        
                                        {/* User Info */}
                                        <div className="flex items-center gap-3 px-4 py-3 bg-base-200/50 rounded-lg">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                                                <img 
                                                    src={user.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} 
                                                    alt={userName} 
                                                    className="w-full h-full rounded-full object-cover bg-base-100"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-base-content">{userName}</p>
                                                <p className="text-xs text-base-content/60">{user.email}</p>
                                            </div>
                                        </div>

                                        <Link
                                            to="/add-service"
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Add Service
                                        </Link>
                                        <Link
                                            to="/manage-services"
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            Manage Services
                                        </Link>
                                        <Link
                                            to="/booked-services"
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                            Booked Services
                                        </Link>
                                        <Link
                                            to="/service-todo"
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            Service To-Do
                                        </Link>
                                        <Link
                                            to="/profile-settings"
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            Profile Settings
                                        </Link>
                                        
                                        <div className="h-px bg-base-300 my-4"></div>
                                        
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-px bg-base-300 my-4"></div>
                                        <Link
                                            to="/login"
                                            className="block px-4 py-3 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-all duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block px-4 py-3 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center mt-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Tooltips */}
            <Tooltip 
                id="user-tooltip" 
                border="1px solid hsl(var(--bc) / 0.2)"
                style={{ 
                    backgroundColor: 'hsl(var(--bc) / 0.1)', 
                    color: 'hsl(var(--bc))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '6px 12px'
                }}
            />
            <Tooltip 
                id="theme-tooltip" 
                border="1px solid hsl(var(--bc) / 0.2)"
                style={{ 
                    backgroundColor: 'hsl(var(--bc) / 0.1)', 
                    color: 'hsl(var(--bc))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '6px 12px'
                }}
            />
        </>
    );
};

export default Navbar;
