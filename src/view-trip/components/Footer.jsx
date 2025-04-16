import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { motion } from 'framer-motion';

function Footer({ trip }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="pt-12 pb-6">
      <div className="max-w-6xl mx-auto">
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo & Branding */}
            <div className="flex items-center gap-2">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f56551] to-[#f79577] flex items-center justify-center"
              >
                <HiOutlineSparkles className="text-white" />
              </motion.div>
              <span className="font-bold text-gray-800">AI Travel Guide</span>
            </div>
            
            {/* Center attribution */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Created with ❤️ by Team 11
              </p>
              {trip?.timestamp && (
                <p className="text-xs text-gray-400 mt-1">
                  Trip generated on {new Date(trip.timestamp?.toDate()).toLocaleDateString()}
                </p>
              )}
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <motion.a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="text-gray-500 hover:text-[#f56551] transition-colors"
              >
                <FaGithub className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="text-gray-500 hover:text-[#f56551] transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="text-gray-500 hover:text-[#f56551] transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-400 text-center">
          <p>© {currentYear} AI Travel Guide. All rights reserved.</p>
          <p className="mt-1">This is a demo project and not a real commercial product.</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;