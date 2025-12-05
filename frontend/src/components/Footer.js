// Simple Footer Component
// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiGithub } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-gray-900">
              FitLog
            </Link>
            <p className="text-gray-600 text-sm mt-1">Health Tracker App</p>
          </div>
          
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <Link to="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-blue-600 text-sm">
              Terms
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 text-sm">
              Contact
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <FiGithub />
            </a>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-600 text-sm">
              © {currentYear} FitLog. Made with <FiHeart className="inline text-red-400" /> for health enthusiasts.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;