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
      <div className="Home w-full min-h-screen flex flex-col bg-white from-blue-50 to-gray-200">
        <Navbar />

        {/* Hero Section */}
        <div className="flex-grow w-full flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-4 drop-shadow-md">
            Manage, Organize & Prioritize Your Tasks
          </h1>
          <p className="text-2xl text-gray-700 mb-6">
            Stay productive with our easy-to-use task management system.
          </p>
          <Link
            className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-green-700 transition duration-300"
            to="/register"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-gray-900 py-12">
        <h1 className="text-5xl font-bold text-center text-white mb-12">
          Key Features
        </h1>

        <div className="w-full flex flex-wrap justify-center gap-8 px-4">
          {[  
            { img: image7, title: "Create Tasks", desc: "Save your daily activity and track progress." },
            { img: image8, title: "Collaborate", desc: "Work together and track shared tasks." },
            { img: image9, title: "Reminders", desc: "Set deadlines & get notified on time." }
          ].map((feature, index) => (
            <div
              key={index}
              className="w-[400px] h-[320px] bg-gray-800 text-white border border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:border-gray-400 hover:bg-white hover:text-gray-900"
            >
              <img
                src={feature.img}
                alt=""
                className="w-[90px] mb-4 transition-transform duration-300 hover:scale-110"
              />
              <h2 className="text-2xl font-semibold">{feature.title}</h2>
              <p className="text-gray-400 text-center mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meet the Creator */}
      <div className="w-full bg-gradient-to-br from-gray-900 to-gray-700 py-12">
        <h1 className="text-5xl font-bold text-center text-white mb-6">
          Meet The Creator
        </h1>

        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8">
          <div className="w-2/4 h-[400px] flex justify-center">
            <img
              src="" 
              alt="Rishabh Kumar"
              className="w-[300px] h-[300px] object-cover rounded-full border-4 border-gray-400 shadow-lg"
            />
          </div>
          <div className="w-2/4 flex flex-col items-center text-center md:text-left">
            <h1 className="text-4xl font-bold text-white">Rishabh Kumar</h1>
            <p className="text-lg text-gray-300 mt-4 px-4">
              Hi devs, my name is Rishabh Kumar. I am a passionate CS undergrad
              who loves solving problems and building innovative projects.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
