import React, { useState, useEffect } from "react";
import AdminLeftSidebar from "../components/Sidebar/AdminLeftSidebar";
import AdminRightSidebar from "../components/Sidebar/AdminRightSidebar";
import {
  Search,
  ListFilter,
  Filter,
  User,
  Bookmark,
  PlusSquare,
  Eye,
} from "lucide-react";
// import { useNavigate } from "react-router-dom"; // If navigation from details is needed later

// Dummy Data
const dummyUsers = [
  {
    id: 1,
    orgName: "CIPHER",
    name: "Esther Howard",
    avatarUrl: "", // Placeholder for avatar image URL
  },
  {
    id: 2,
    orgName: "WVSU Spark Hub",
    name: "Cameron Williamson",
    avatarUrl: "",
  },
  {
    id: 3,
    orgName: "CICT Student Council",
    name: "Brooklyn Simmons",
    avatarUrl: "",
  },
  {
    id: 4,
    orgName: "Link.Exe",
    name: "Jenny Wilson",
    avatarUrl: "",
  },
  {
    id: 5,
    orgName: "Photography Club",
    name: "Robert Fox",
    avatarUrl: "",
  },
];

const dummyVenues = [
  {
    id: 1,
    name: "WVSU Cultural Center",
    description:
      "A dynamic space on campus where students and communities connect through art, culture, and shared experiences.",
    imageUrl: "../assets/cultural_center.webp", // Placeholder image path
  },
  {
    id: 2,
    name: "MED Gym",
    description:
      "Multi-purpose gymnasium for sports, large gatherings, and university-wide events.",
    imageUrl: "../assets/cultural_center.webp",
  },
  {
    id: 3,
    name: "College of ICT Auditorium",
    description:
      "State-of-the-art auditorium suitable for seminars, conferences, and presentations.",
    imageUrl: "/images/ict_auditorium.jpg",
  },
  {
    id: 4,
    name: "Research and Development Center Hall",
    description:
      "A modern hall for research presentations and academic discussions.",
    imageUrl: "/images/rdc_hall.jpg",
  },
];

export default function AdminManagementPage() {
  // const navigate = useNavigate(); // If needed later
  const [users, setUsers] = useState(dummyUsers);
  const [venues, setVenues] = useState(dummyVenues);

  // Placeholder handlers for details/add actions
  const handleUserDetails = (userId) => {
    console.log("View details for user:", userId);
    // navigate(`/admin/users/${userId}`); // Example navigation
  };

  const handleVenueDetails = (venueId) => {
    console.log("View details for venue:", venueId);
    // navigate(`/admin/venues/${venueId}`); // Example navigation
  };

  const handleAddVenue = () => {
    console.log("Open add venue form/modal");
    // Open modal or navigate to add venue page
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <div className="flex flex-col lg:flex-row flex-1">
        <AdminLeftSidebar active="Management" />

        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-6 order-2 lg:order-none">
          {/* Top Search Bar (Consistent with other admin pages) */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl border border-gray-300 rounded-full">
              <Search
                size={25}
                className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-[#56708A]"
              />
              <input
                type="text"
                placeholder="Search for event venues, locations, keywords, etc."
                className="w-full pl-12 pr-12 py-4 border-transparent rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-[#56708A] focus:border-[#56708A] text-xs md:text-base"
              />
              <Bookmark
                size={25}
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-[#56708A] hover:text-[#56708A]/80 cursor-pointer"
              />
            </div>
          </div>

          {/* Main Content Grid: Registered Users and Venues */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registered Users Section */}
            <section className="bg-white rounded-xl shadow p-4 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h2 className="text-2xl font-bold text-[#56708A]">
                  Registered Users
                </h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                    <ListFilter size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                    <Filter size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search for a specific user"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#56708A] focus:border-[#56708A]"
                />
              </div>
              <div className="space-y-3 max-h-[300px] md:max-h-[400px] lg:max-h-[500px] overflow-y-auto pr-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User size={20} className="text-gray-600" />
                      </span>
                      <div>
                        <div className="font-medium text-gray-800">
                          {user.orgName}
                        </div>
                        <div className="text-xs text-gray-500">{user.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUserDetails(user.id)}
                      className="bg-[#56708A] text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-[#455b74] transition-colors flex items-center gap-1.5"
                    >
                      <Eye size={14} /> Details
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Venues Section */}
            <section className="bg-white rounded-xl shadow p-4 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h2 className="text-2xl font-bold text-[#56708A]">Venues</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                    <ListFilter size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                    <Filter size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={handleAddVenue}
                    className="p-2 bg-[#56708A] text-white border border-[#56708A] rounded-lg hover:bg-[#455b74] transition-colors"
                  >
                    <PlusSquare size={20} />
                  </button>
                </div>
              </div>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search for a specific venue"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#56708A] focus:border-[#56708A]"
                />
              </div>
              <div className="space-y-4 max-h-[300px] md:max-h-[400px] lg:max-h-[500px] overflow-y-auto pr-2">
                {venues.map((venue) => (
                  <div
                    key={venue.id}
                    className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <img
                      src={venue.imageUrl || "/images/placeholder_venue.png"}
                      alt={venue.name}
                      className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-lg flex-shrink-0 bg-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder_venue.png";
                      }}
                    />
                    <div className="flex flex-col justify-between flex-grow h-full">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {venue.name}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 md:line-clamp-none">
                          {venue.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleVenueDetails(venue.id)}
                        className="bg-[#56708A] text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-[#455b74] transition-colors self-end mt-2 flex items-center gap-1.5"
                      >
                        <Eye size={14} /> Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        <AdminRightSidebar />
      </div>
    </div>
  );
}
