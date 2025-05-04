import "./App.css";
import "./index.css";
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function App() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-between text-center p-6">
      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center space-y-4">
        {/* Logo */}
        <img
          src="/wevoLogoPng.png"
          alt="Wevo Logo"
          className="w-auto max-h-40 mb-4"
        />

        {/* Tagline */}
        <div className="text-4xl text-blue-600 font-semibold">
          Smart Scheduling for a Smarter Campus
        </div>

        {/* Paragraph */}
        <p className="text-base max-w-3xl text-gray-500">
          Keeps West Visayas State University in sync by providing real-time
          updates on venue availability and streamlining communication between
          student organizations and campus administration.
        </p>

        {/* Buttons */}
        <div className="flex space-x-4 mt-4">
          <div className="flex space-x-4 mt-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-10 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2"
            >
              Get Started <ChevronRight size={18} />
            </Link>

            <button className="border border-blue-600 text-blue-600 px-10 py-2 rounded-full hover:bg-blue-50 transition">
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-sm text-gray-400 pb-4">
        <p className="font-bold">
          All Rights Reserved: Hard Engineering Neighbors{" "}
        </p>
        <p>
          WEVO is an an interactive web application designed to simplify venue
          reservations and provide a real-time monitoring of events.
        </p>
      </footer>
    </div>
  );
}

export default App;
