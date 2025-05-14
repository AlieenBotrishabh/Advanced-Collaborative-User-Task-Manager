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
      {/* Hero Section with enhanced gradient background and animated elements */}
      <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-green-50">
        <Navbar />
        
        <div className="flex-grow w-full flex flex-col items-center justify-center text-center px-4 md:px-6 py-16 md:py-24 relative overflow-hidden">
          {/* Enhanced decorative background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
            <div className="absolute top-40 right-20 w-56 h-56 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "3s" }}></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="inline-block mb-4 px-6 py-2 bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-full text-green-600 font-semibold border border-green-100">
              Simplify Your Life with Task Manager
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">TogethrTask</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Stay productive with our intuitive task management system designed for individuals and Teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 w-full sm:w-auto"
                to="/register"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with cards in one line */}
      <div className="w-full bg-gradient-to-b from-gray-900 to-gray-800 py-24" id="features">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-2 px-6 py-2 bg-gray-800 rounded-full text-green-400 font-semibold border border-gray-700">
              Our Capabilities
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Powerful Features</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-blue-500 mx-auto"></div>
            <p className="text-gray-300 max-w-2xl mx-auto mt-6 text-lg">
              Discover the tools that will transform your productivity and streamline your workflow
            </p>
          </div>

          {/* Features in one line with responsive fallback */}
          <div className="w-full flex flex-col lg:flex-row justify-center gap-6 px-4">
            {[
              { img: image7, title: "Create Tasks", desc: "Easily create, categorize, and prioritize your daily activities with an intuitive interface.", icon: "✓" },
              { img: image8, title: "Team Collaboration", desc: "Work together seamlessly with real-time updates, comments, and shared progress tracking.", icon: "👥" },
              { img: image9, title: "Smart Reminders", desc: "Never miss a deadline with customizable notifications and calendar integration.", icon: "🔔" }
            ].map((feature, index) => (
              <div
                key={index}
                className="w-full lg:w-1/3 bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700 rounded-2xl shadow-xl p-8 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:border-green-500 hover:translate-y-[-8px] group"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <img
                    src={feature.img}
                    alt=""
                    className="w-12 h-12"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">{feature.title}</h2>
                <p className="text-gray-300 text-center">{feature.desc}</p>
                <div className="mt-8 pt-6 border-t border-gray-700 w-full">
                  <button className="w-full text-center py-2 text-green-400 hover:text-white transition-colors duration-200 flex items-center justify-center group">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet the Creator with improved styling */}
      <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-2 px-6 py-2 bg-gray-800 rounded-full text-green-400 font-semibold border border-gray-700">
              About Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Meet The Creator</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-blue-500 mx-auto"></div>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-xl p-8 overflow-hidden hover:border-green-500 transition-colors duration-300">
            <div className="w-full md:w-2/5 flex justify-center mb-8 md:mb-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500 blur-lg opacity-50 scale-110 animate-pulse"></div>
                <img
                  src="/api/placeholder/400/400"
                  alt="Rishabh Kumar"
                  className="w-64 h-64 object-cover rounded-full border-4 border-white relative z-10 shadow-2xl"
                />
              </div>
            </div>
            <div className="w-full md:w-3/5 flex flex-col text-center md:text-left">
              <div className="inline-block mb-2 px-4 py-1 bg-gray-800 rounded-full text-green-400 text-sm font-semibold border border-gray-700 w-fit mx-auto md:mx-0">
                Developer & Founder
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Rishabh Kumar</h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Hi devs, my name is Rishabh Kumar. I am a passionate CS undergrad
                who loves solving problems and building innovative projects that make a difference.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href="https://github.com/AlieenBotrishabh" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-300 flex items-center gap-2 hover:text-green-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.547-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/rishabh-kumar-932692291/" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-300 flex items-center gap-2 hover:text-blue-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
                <a href="https://portfolio-webiste-obw7.vercel.app/" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-300 flex items-center gap-2 hover:text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                  </svg>
                  <span>Portfolio</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action section */}
      <div className="w-full bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Productivity?</h2>
          <p className="text-xl text-white text-opacity-90 mb-10 max-w-3xl mx-auto">
            Join thousands of users who have already improved their task management experience
          </p>
          <Link
            className="bg-white text-gray-900 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 inline-block"
            to="/register"
          >
            Start Your Free Trial
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;