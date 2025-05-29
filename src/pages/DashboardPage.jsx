import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  RotateCcw,
  Bell,
  User,
  Menu,
  Filter,
  ListFilter,
  Search,
  Bookmark,
  Clock,
} from "lucide-react";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import DashboardSearchBar from "../components/SearchBar/DashboardSearchBar";
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar/Calendar";
import { useAuth } from "../contexts/AuthContext";
import { fetchRequests } from "../api/requests";
import { supabase } from "../supabase/supabaseClient";
import {
  PageTransition,
  FadeIn,
  StaggerContainer,
  ScaleOnHover,
  ButtonPress,
  ProgressiveLoad,
} from "../components/AnimationWrapper";
import {
  CalendarSkeleton,
  StatsCardSkeleton,
  EventListSkeleton,
  SearchBarSkeleton,
  ContentSkeleton,
} from "../components/LoadingSkeletons";
import {
  Calendar as CalendarIcon,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

// Helper function to calculate statistics from requests
const calculateStats = (requests) => {
  const total = requests.length;
  const approved = requests.filter(
    (req) => req.status?.toLowerCase() === "approved"
  ).length;
  const pending = requests.filter(
    (req) => req.status?.toLowerCase() === "pending"
  ).length;
  const rejected = requests.filter(
    (req) => req.status?.toLowerCase() === "rejected"
  ).length;

  // Calculate this month's bookings
  const thisMonth = new Date();
  const thisMonthRequests = requests.filter((req) => {
    if (!req.created_at) return false;
    const reqDate = new Date(req.created_at);
    return (
      reqDate.getMonth() === thisMonth.getMonth() &&
      reqDate.getFullYear() === thisMonth.getFullYear()
    );
  }).length;

  return [
    {
      title: "Total Bookings",
      value: total.toString(),
      icon: CalendarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: total > 0 ? "+12%" : "0%",
    },
    {
      title: "This Month",
      value: thisMonthRequests.toString(),
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: thisMonthRequests > 0 ? "+8%" : "0%",
    },
    {
      title: "Approved",
      value: approved.toString(),
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      trend: approved > 0 ? "+15%" : "0%",
    },
    {
      title: "Pending",
      value: pending.toString(),
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      trend: pending > 0 ? "-5%" : "0%",
    },
  ];
};

// Helper function to transform requests into recent bookings format
const transformRequestsToBookings = (requests) => {
  // Sort requests by creation date, newest first, then take the 3 most recent
  const sortedRequests = requests.sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return dateB - dateA; // Descending order (newest first)
  });

  return sortedRequests
    .slice(0, 3) // Get only the 3 most recent
    .map((request) => {
      // Extract date from various possible sources
      let displayDate = new Date().toISOString().split("T")[0]; // fallback to today

      // Try to get date from the request's associated event data
      if (request.start_time) {
        displayDate = new Date(request.start_time).toISOString().split("T")[0];
      } else if (request.perDayTimes && request.perDayTimes.length > 0) {
        // For multi-day events, use the first date
        displayDate = request.perDayTimes[0].date;
      } else if (request.created_at) {
        // Fallback to creation date
        displayDate = new Date(request.created_at).toISOString().split("T")[0];
      }

      return {
        id: request.id,
        title: request.event || "Untitled Event",
        venue: request.venue || "Unknown Venue",
        date: displayDate,
        status: request.status || "Pending",
        participants: request.participants || 0,
      };
    });
};

function StatsCard({ stat, index }) {
  const Icon = stat.icon;
  return (
    <ScaleOnHover>
      <FadeIn delay={index * 25}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all duration-300 min-h-[120px] md:min-h-[140px]">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-xs font-medium text-gray-600 mb-2">
                {stat.title}
              </p>
              <p className="text-2xl md:text-lg lg:text-xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
            <div
              className={`${stat.bgColor} ${stat.color} p-3 md:p-2 lg:p-3 rounded-lg flex-shrink-0 ml-3 md:ml-2 flex items-center justify-center`}
            >
              <Icon size={24} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
            </div>
          </div>
          <div className="flex items-center w-full">
            <TrendingUp
              size={14}
              className="text-green-500 mr-2 flex-shrink-0"
            />
            <span className="text-sm md:text-xs text-green-500 font-medium">
              {stat.trend}
            </span>
            <span className="text-sm md:text-xs text-gray-500 ml-2">
              vs last month
            </span>
          </div>
        </div>
      </FadeIn>
    </ScaleOnHover>
  );
}

function BookingCard({ booking, index }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ScaleOnHover>
      <FadeIn delay={index * 50}>
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300 hover:border-[#0458A9]">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-gray-900 flex-1 pr-2">
              {booking.title}
            </h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status}
            </span>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <CalendarIcon size={14} className="mr-2" />
              {new Date(booking.date).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Users size={14} className="mr-2" />
              {booking.participants} participants
            </div>
            <div className="text-[#0458A9] font-medium">{booking.venue}</div>
          </div>
        </div>
      </FadeIn>
    </ScaleOnHover>
  );
}

// Real-time hook for requests updates
function useRealtimeRequests(userId, setRequests) {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("user_requests_dashboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "booking_requests",
          filter: `requested_by=eq.${userId}`,
        },
        () => {
          // Refresh requests when there's any change
          fetchRequests(userId).then(setRequests);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, setRequests]);
}

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [requests, setRequests] = useState([]);

  // Set up real-time updates
  useRealtimeRequests(currentUser?.id, setRequests);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      try {
        // Add artificial delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Load real user requests
        const userRequests = await fetchRequests(currentUser.id);
        setRequests(userRequests);

        // Calculate live statistics
        const liveStats = calculateStats(userRequests);
        setStats(liveStats);

        // Transform requests to recent bookings format
        const recentBookingsData = transformRequestsToBookings(userRequests);
        setRecentBookings(recentBookingsData);

        // You can add calendar events loading here
        setCalendarEvents([]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Fallback to empty data on error
        setStats(calculateStats([]));
        setRecentBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser]);

  return (
    <PageTransition>
      <div className="flex flex-col lg:flex-row flex-1">
        <LeftSidebar active="calendar" />

        {/* Center Content */}
        <main className="w-full lg:w-3/5 bg-gray-50 order-2 lg:order-none min-h-screen lg:h-screen lg:overflow-y-hidden overflow-x-hidden">
          {/* New inner wrapper for content */}
          <div className="max-w-screen-xl mx-auto w-full flex flex-col lg:h-full overflow-x-hidden">
            <div className="p-3 md:p-6 space-y-4 lg:flex-1 lg:overflow-y-auto">
              {/* Search Bar */}
              <ProgressiveLoad
                isLoading={isLoading}
                skeleton={<SearchBarSkeleton />}
              >
                <FadeIn delay={50}>
                  <DashboardSearchBar
                    onSearch={(term) => {
                      // Navigate to venues page with search term
                      navigate(`/venues?search=${encodeURIComponent(term)}`);
                    }}
                    placeholder="Search for event venues, locations, or keywords to get started..."
                    disabled={isLoading}
                  />
                </FadeIn>
              </ProgressiveLoad>

              {/* Welcome Section */}
              <ProgressiveLoad
                isLoading={isLoading}
                skeleton={<ContentSkeleton lines={2} className="mb-6" />}
              >
                <FadeIn delay={75}>
                  <div className="bg-gradient-to-r from-[#0458A9] to-[#0374d4] rounded-2xl p-4 md:p-6 text-white">
                    <h1 className="text-xl md:text-2xl font-bold mb-2">
                      Welcome back! 👋
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base">
                      Here's what's happening with your venue bookings today.
                    </p>
                  </div>
                </FadeIn>
              </ProgressiveLoad>

              {/* Stats Cards */}
              <ProgressiveLoad
                isLoading={isLoading}
                skeleton={
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <StatsCardSkeleton key={i} />
                    ))}
                  </div>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <StatsCard key={stat.title} stat={stat} index={index} />
                  ))}
                </div>
              </ProgressiveLoad>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:flex-1 lg:min-h-0">
                {/* Calendar */}
                <ProgressiveLoad
                  isLoading={isLoading}
                  skeleton={<CalendarSkeleton />}
                  className="xl:col-span-2 flex flex-col lg:min-h-0"
                >
                  <FadeIn delay={100}>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[300px] lg:min-h-[auto]">
                      <Calendar
                        events={calendarEvents}
                        primaryColor="#0458A9"
                        layout="dashboard"
                        showReserveButton={true}
                      />
                    </div>
                  </FadeIn>
                </ProgressiveLoad>

                {/* Recent Bookings */}
                <ProgressiveLoad
                  isLoading={isLoading}
                  skeleton={
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="mb-4">
                        <ContentSkeleton lines={1} className="w-1/3" />
                      </div>
                      <EventListSkeleton count={3} />
                    </div>
                  }
                  className="flex flex-col min-h-0"
                >
                  <FadeIn delay={125}>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[300px] lg:min-h-[auto]">
                      <div className="p-4 md:p-6 border-b border-gray-100 flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-base md:text-lg font-semibold text-gray-900">
                            Recent Bookings
                          </h2>
                          <ButtonPress>
                            <button
                              onClick={() => navigate("/requests")}
                              className="text-xs md:text-sm text-[#0458A9] hover:text-[#03407a] font-medium transition-colors"
                            >
                              View All
                            </button>
                          </ButtonPress>
                        </div>
                      </div>
                      <div className="p-4 md:p-6 lg:flex-1 lg:overflow-y-auto">
                        <div className="space-y-3">
                          {recentBookings.length > 0 ? (
                            recentBookings.map((booking, index) => (
                              <BookingCard
                                key={booking.id}
                                booking={booking}
                                index={index}
                              />
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <CalendarIcon
                                size={48}
                                className="mx-auto mb-3 text-gray-300"
                              />
                              <p className="text-sm">
                                No recent bookings found
                              </p>
                              <ButtonPress>
                                <button
                                  onClick={() => navigate("/venues")}
                                  className="mt-3 text-sm text-[#0458A9] hover:text-[#03407a] font-medium transition-colors underline"
                                >
                                  Browse venues to get started
                                </button>
                              </ButtonPress>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                </ProgressiveLoad>
              </div>
            </div>
          </div>{" "}
          {/* End of new inner wrapper */}
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </PageTransition>
  );
}
