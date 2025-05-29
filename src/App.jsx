import "./App.css";
import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  MapPin,
  Bell,
  Shield,
  Smartphone,
  Zap,
  Heart,
  ArrowRight,
} from "lucide-react";
import DashboardPage from "./pages/DashboardPage";
import {
  PageTransition,
  FadeIn,
  ScaleOnHover,
  ButtonPress,
} from "./components/AnimationWrapper";

function App() {
  const scrollToExplore = () => {
    const exploreSection = document.getElementById("explore-section");
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: Calendar,
      title: "Real-Time Availability",
      description:
        "Check venue availability instantly with our live calendar system. No more double bookings or scheduling conflicts.",
      color: "bg-blue-50 border-blue-200 text-blue-600",
    },
    {
      icon: Users,
      title: "User-Friendly Interface",
      description:
        "Intuitive design that makes booking venues as simple as a few clicks. Built for students, faculty, and staff.",
      color: "bg-green-50 border-green-200 text-green-600",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Get instant updates on your booking status, reminders, and important announcements via real-time notifications.",
      color: "bg-purple-50 border-purple-200 text-purple-600",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Your data is protected with enterprise-level security. Reliable uptime ensures the system is always available.",
      color: "bg-orange-50 border-orange-200 text-orange-600",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description:
        "Access WEVO from any device - desktop, tablet, or smartphone. Book venues on the go with our mobile-friendly design.",
      color: "bg-pink-50 border-pink-200 text-pink-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Quick booking process with automated workflows. Get your venue reserved in minutes, not hours.",
      color: "bg-yellow-50 border-yellow-200 text-yellow-600",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Check Availability",
      description:
        "Browse our interactive calendar to see which venues are available for your preferred dates and times.",
    },
    {
      step: "2",
      title: "Select & Reserve",
      description:
        "Choose your ideal venue, fill in event details, and upload any required documents for your booking.",
    },
    {
      step: "3",
      title: "Get Approved",
      description:
        "Our admin team reviews your request and sends you a notification with the approval status.",
    },
    {
      step: "4",
      title: "Enjoy Your Event",
      description:
        "Your venue is confirmed! Focus on your event while we handle the scheduling logistics.",
    },
  ];

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
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
                Keeps West Visayas State University in sync by providing
                real-time updates on venue availability and streamlining
                communication between student organizations and campus
                administration.
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
                      <button
                        onClick={scrollToExplore}
                        className="border-2 border-[#0458A9] text-[#0458A9] px-10 py-2 rounded-full hover:bg-[#0458A9] transition-all duration-200 hover:text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
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
                WEVO is an interactive web application designed to simplify
                venue reservations and provide a real-time monitoring of events.
              </p>
            </footer>
          </FadeIn>
        </div>

        {/* Explore Section */}
        <div id="explore-section" className="bg-gray-50 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* About WEVO Section */}
            <FadeIn delay={0} direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0458A9] mb-6">
                  About WEVO
                </h2>
                <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  WEVO (WVSU Event Venue Outlet) revolutionizes how West Visayas
                  State University manages venue reservations. Built by
                  students, for students, our platform eliminates the chaos of
                  manual scheduling and brings intelligent automation to campus
                  event management.
                </p>
              </div>
            </FadeIn>

            {/* Problem & Solution */}
            <FadeIn delay={100} direction="up">
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-red-100">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <Clock className="text-red-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    The Problem
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Manual scheduling causing double bookings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Poor communication between departments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Time-consuming approval processes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>No real-time venue availability tracking</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-lg border border-green-100">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Our Solution
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Automated scheduling with conflict prevention</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Centralized communication platform</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Streamlined digital approval workflow</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Live calendar with instant updates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </FadeIn>

            {/* Features Grid */}
            <FadeIn delay={200} direction="up">
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0458A9] text-center mb-12">
                  Why Choose WEVO?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                        feature.color.split(" ")[1] +
                        " " +
                        feature.color.split(" ")[2]
                      }`}
                    >
                      <div
                        className={`w-12 h-12 ${
                          feature.color.split(" ")[0]
                        } rounded-full flex items-center justify-center mb-4`}
                      >
                        <feature.icon
                          className={feature.color.split(" ")[2]}
                          size={24}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* How It Works */}
            <FadeIn delay={300} direction="up">
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0458A9] text-center mb-12">
                  How WEVO Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                  {howItWorks.map((step, index) => (
                    <div key={index} className="text-center relative">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 bg-[#0458A9] rounded-full flex items-center justify-center mx-auto text-white text-xl font-bold">
                          {step.step}
                        </div>
                        {index < howItWorks.length - 1 && (
                          <div className="hidden lg:block absolute top-8 left-1/2 transform translate-x-4">
                            <ArrowRight className="text-[#0458A9]" size={24} />
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Stats Section */}
            <FadeIn delay={400} direction="up">
              <div className="bg-gradient-to-r from-[#0458A9] to-blue-600 rounded-xl p-12 text-white text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">
                  Built for WVSU Community
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="text-4xl font-bold mb-2">24/7</div>
                    <div className="text-blue-100">System Availability</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">100%</div>
                    <div className="text-blue-100">Digital Process</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">∞</div>
                    <div className="text-blue-100">Possibilities</div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Team Section */}
            <FadeIn delay={500} direction="up">
              <div className="text-center">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#0458A9] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0458A9] mb-4">
                    Made with ❤️ by Hard Engineering Neighbors
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    We're a passionate student-led development team from Brgy.
                    Aganan, Zone 4, Pavia, Iloilo. Our mission is to create
                    innovative solutions that enhance the educational experience
                    through smart technology and user-centered design.
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
                    <MapPin size={16} />
                    <span className="text-sm">
                      Brgy. Aganan, Zone 4, Pavia, Iloilo
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* CTA Section */}
            <FadeIn delay={600} direction="up">
              <div className="text-center mt-16">
                <h2 className="text-3xl font-bold text-[#0458A9] mb-6">
                  Ready to Transform Your Campus Experience?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Join the WEVO community and discover how easy venue booking
                  can be. Start scheduling smarter today!
                </p>
                <ButtonPress>
                  <ScaleOnHover>
                    <Link
                      to="/login"
                      className="bg-[#0458A9] text-white px-12 py-4 rounded-full hover:bg-[#03407a] transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-medium mx-auto w-fit"
                    >
                      Get Started Now <ChevronRight size={20} />
                    </Link>
                  </ScaleOnHover>
                </ButtonPress>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default App;
