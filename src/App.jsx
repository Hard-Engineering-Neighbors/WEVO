import "./App.css";
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import DashboardPage from "./pages/DashboardPage";
import {
  PageTransition,
  FadeIn,
  ScaleOnHover,
  ButtonPress,
} from "./components/AnimationWrapper";

function App() {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen items-center justify-between text-center p-6">
        {/* Main content */}
        <div className="flex-grow flex flex-col items-center justify-center space-y-4">
          {/* Logo */}
          <FadeIn delay={25} direction="up">
            <ScaleOnHover scale="hover:scale-110">
              <img
                src="/wevoLogoPng.png"
                alt="Wevo Logo"
                className="w-auto max-h-40 mb-4 transition-transform duration-300"
              />
            </ScaleOnHover>
          </FadeIn>

          {/* Tagline */}
          <FadeIn delay={50} direction="up">
            <div className="text-4xl text-[#0458A9] font-semibold">
              Smart Scheduling for a Smarter Campus
            </div>
          </FadeIn>

          {/* Paragraph */}
          <FadeIn delay={75} direction="up">
            <p className="text-base max-w-3xl text-gray-500">
              Keeps West Visayas State University in sync by providing real-time
              updates on venue availability and streamlining communication
              between student organizations and campus administration.
            </p>
          </FadeIn>

          {/* Buttons */}
          <FadeIn delay={100} direction="up">
            <div className="flex space-x-4 mt-4">
              <div className="flex space-x-4 mt-4">
                <ButtonPress>
                  <ScaleOnHover>
                    <Link
                      to="/login"
                      className="bg-[#0458A9] text-white px-10 py-2 rounded-full hover:bg-[#03407a] transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Get Started <ChevronRight size={18} />
                    </Link>
                  </ScaleOnHover>
                </ButtonPress>

                <ButtonPress>
                  <ScaleOnHover>
                    <button className="border-2 border-[#0458A9] text-[#0458A9] px-10 py-2 rounded-full hover:bg-[#0458A9] transition-all duration-200 hover:text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Explore
                    </button>
                  </ScaleOnHover>
                </ButtonPress>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Footer */}
        <FadeIn delay={125} direction="up">
          <footer className="text-sm text-gray-400 pb-4">
            <p className="font-bold">
              All Rights Reserved: Hard Engineering Neighbors{" "}
            </p>
            <p>
              WEVO is an interactive web application designed to simplify venue
              reservations and provide a real-time monitoring of events.
            </p>
          </footer>
        </FadeIn>
      </div>
    </PageTransition>
  );
}

export default App;
