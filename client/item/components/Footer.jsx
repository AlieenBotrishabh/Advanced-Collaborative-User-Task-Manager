import React from "react";
import { Link } from "react-router-dom"; // Fix import (was "react-router")
import image4 from "../assets/A4.png";
import image5 from "../assets/A5.png";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-8 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4">Connect with me</h1>
      
      {/* Social Links */}
      <div className="flex space-x-6">
        <Link
          to="https://github.com/AlieenBotrishabh"
          target="_blank"
          className="flex items-center space-x-2 hover:text-gray-400 transition duration-300"
        >
          <img
            src={image4}
            alt="GitHub"
            className="w-[40px] hover:scale-110 transition-transform duration-300"
          />
          <span className="hidden md:block text-lg">GitHub</span>
        </Link>

        <Link
          to="https://www.linkedin.com/in/rishabh-kumar-932692291/"
          target="_blank"
          className="flex items-center space-x-2 hover:text-gray-400 transition duration-300"
        >
          <img
            src={image5}
            alt="LinkedIn"
            className="w-[40px] hover:scale-110 transition-transform duration-300"
          />
          <span className="hidden md:block text-lg">LinkedIn</span>
        </Link>
      </div>

      {/* Copyright */}
      <p className="text-sm text-gray-400 mt-4">
        © {new Date().getFullYear()} Rishabh Kumar. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
