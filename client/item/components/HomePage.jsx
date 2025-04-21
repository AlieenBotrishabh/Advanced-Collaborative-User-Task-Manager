import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import image7 from "../assets/A7.png";
import image8 from "../assets/A8.png";
import image9 from "../assets/A9.png";

const HomePage = () => {
  return (
    <>
      {/* Hero Section with gradient background and animated elements */}
      <div className="Home w-full min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-gray-100">
        <Navbar />
        
        <div className="flex-grow w-full flex flex-col items-center justify-center text-center px-4 md:px-6 py-16 md:py-24 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 bg-green-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">Manage, Organize</span> & 
              <span className="block mt-2">Prioritize Your Tasks</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Stay productive with our intuitive task management system designed for individuals and teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 w-full sm:w-auto"
                to="/register"
              >
                Get Started Now
              </Link>
              <Link
                className="bg-transparent border-2 border-gray-800 text-gray-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 hover:text-white transition duration-300 w-full sm:w-auto"
                to="/features"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with cards */}
      <div className="w-full bg-gradient-to-b from-gray-900 to-gray-800 py-20" id="features">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-green-400 text-lg font-semibold uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Powerful Features</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-blue-500 mx-auto"></div>
          </div>

          <div className="w-full flex flex-wrap justify-center gap-8 px-4">
            {[
              { img: image7, title: "Create Tasks", desc: "Easily create, categorize, and prioritize your daily activities with an intuitive interface.", icon: "✓" },
              { img: image8, title: "Team Collaboration", desc: "Work together seamlessly with real-time updates, comments, and shared progress tracking.", icon: "👥" },
              { img: image9, title: "Smart Reminders", desc: "Never miss a deadline with customizable notifications and calendar integration.", icon: "🔔" }
            ].map((feature, index) => (
              <div
                key={index}
                className="w-full md:w-96 bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700 rounded-2xl shadow-xl p-8 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:border-green-500 group"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={feature.img}
                    alt=""
                    className="w-12 h-12"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-3">{feature.title}</h2>
                <p className="text-gray-300 text-center">{feature.desc}</p>
                <div className="mt-6 pt-6 border-t border-gray-700 w-full">
                  <button className="w-full text-center py-2 text-green-400 hover:text-white transition-colors duration-200">
                    Learn more →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "1M+", label: "Tasks Completed" },
              { number: "99%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-5xl font-bold text-green-600 mb-2">{stat.number}</h3>
                <p className="text-gray-600 text-xl">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet the Creator with improved styling */}
      <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-green-400 text-lg font-semibold uppercase tracking-wider">About</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Meet The Creator</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-blue-500 mx-auto"></div>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-xl p-8 overflow-hidden">
            <div className="w-full md:w-2/5 flex justify-center mb-8 md:mb-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500 blur-lg opacity-50 scale-110"></div>
                <img
                  src="/api/placeholder/400/400"
                  alt="Rishabh Kumar"
                  className="w-64 h-64 object-cover rounded-full border-4 border-white relative z-10"
                />
              </div>
            </div>
            <div className="w-full md:w-3/5 flex flex-col text-center md:text-left">
              <h3 className="text-2xl font-semibold text-green-400 mb-2">Developer & Founder</h3>
              <h2 className="text-4xl font-bold text-white mb-4">Rishabh Kumar</h2>
              <p className="text-lg text-gray-300 mb-6">
                Hi devs, my name is Rishabh Kumar. I am a passionate CS undergrad
                who loves solving problems and building innovative projects that make a difference.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href="#" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300">
                  <span>GitHub</span>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300">
                  <span>LinkedIn</span>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300">
                  <span>Portfolio</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="w-full bg-gradient-to-r from-green-500 to-blue-600 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to boost your productivity?</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied users who have transformed how they manage tasks and projects.
          </p>
          <Link
            className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 inline-block"
            to="/register"
          >
            Start Free Trial
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;