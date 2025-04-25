import React from 'react';
import { ArrowUp, Mail, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 pt-12 pb-8">
      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/logo.svg" alt="Tripplanner.io" className="h-8 mr-3" />
              <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Tripplanner.io
              </h3>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Your AI-powered travel companion that crafts personalized itineraries and simplifies your journey planning.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={scrollToTop}
                className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors duration-200 text-blue-600 group"
                aria-label="Back to top"
              >
                <ArrowUp className="h-4 w-4 group-hover:transform group-hover:-translate-y-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/create-trip" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Explore
                </a>
              </li>
              <li>
                <a href="/become-friend" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Become a Friend
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:support@tripplanner.io" 
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  <span>support@tripplanner.io</span>
                </a>
              </li>
              <li className="pt-2">
                <div className="flex space-x-3">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-pink-100 transition-colors duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4 text-gray-600 hover:text-pink-600" />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors duration-200"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-4 w-4 text-gray-600 hover:text-blue-400" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © {currentYear} Tripplanner.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 