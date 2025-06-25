import React from 'react';
import { Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-content font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold text-primary">ServiceHub Pro</span>
            </div>
            <p className="text-base-content/70 mb-6 max-w-md">
              Your trusted marketplace for professional electronic repair services. 
              Connecting customers with skilled technicians across Bangladesh.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost hover:btn-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost hover:btn-primary transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-base-content">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-base-content/70 hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/services" className="text-base-content/70 hover:text-primary transition-colors">
                  All Services
                </a>
              </li>
              <li>
                <a href="/login" className="text-base-content/70 hover:text-primary transition-colors">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="text-base-content/70 hover:text-primary transition-colors">
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-base-content">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-base-content/70">
                <Mail size={16} />
                <span className="text-sm">support@servicehubpro.com</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/70">
                <Phone size={16} />
                <span className="text-sm">+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/70">
                <MapPin size={16} />
                <span className="text-sm">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-base-content/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-base-content/60 text-sm">
              © {new Date().getFullYear()} ServiceHub Pro. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
