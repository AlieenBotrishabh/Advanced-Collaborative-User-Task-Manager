
import React from "react";
import { Link } from "react-router-dom"; // Fixed import
import image4 from "../assets/A4.png";
import image5 from "../assets/A5.png";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12 relative overflow-hidden">
      {/* Background Design Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full opacity-5 translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            Connect with me
          </h1>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        </div>
        
        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          <Link
            to="https://github.com/AlieenBotrishabh"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center"
          >
            <div className="relative p-3 rounded-full bg-gray-800 border border-gray-700 shadow-lg group-hover:shadow-indigo-500/20 group-hover:border-indigo-400 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
              <img
                src={image4}
                alt="GitHub"
                className="w-12 h-12 object-contain transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="mt-3 text-lg font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
              GitHub
            </span>
          </Link>
          
          <Link
            to="https://www.linkedin.com/in/rishabh-kumar-932692291/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center"
          >
            <div className="relative p-3 rounded-full bg-gray-800 border border-gray-700 shadow-lg group-hover:shadow-blue-500/20 group-hover:border-blue-400 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
              <img
                src={image5}
                alt="LinkedIn"
                className="w-12 h-12 object-contain transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="mt-3 text-lg font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
              LinkedIn
            </span>
          </Link>
        </div>
        
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-8"></div>
        
        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} <span className="font-medium text-gray-300">Rishabh Kumar</span>. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Designed with passion and creativity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;