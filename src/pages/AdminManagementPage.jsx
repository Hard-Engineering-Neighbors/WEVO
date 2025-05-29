import React, { useState, useEffect } from "react";
import AdminLeftSidebar from "../components/Sidebar/AdminLeftSidebar";
import AdminRightSidebar from "../components/Sidebar/AdminRightSidebar";
import { Search, ListFilter, Filter, PlusSquare, Eye } from "lucide-react";
import {
  fetchVenues,
  createVenue,
  editVenue,
  removeVenue,
} from "../api/venues";
import AdminVenueDetailsModal from "../components/AdminVenueDetailsModal";
import AddVenueModal from "../components/AddVenueModal";
import EditVenueModal from "../components/EditVenueModal";
// import { useNavigate } from "react-router-dom"; // If navigation from details is needed later

export default function AdminManagementPage() {
  // const navigate = useNavigate(); // If needed later
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [venueSearchTerm, setVenueSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venueModalOpen, setVenueModalOpen] = useState(false);
  const [addVenueModalOpen, setAddVenueModalOpen] = useState(false);
  const [editVenueModalOpen, setEditVenueModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Force refresh mechanism

  // Force refresh venues data
  const forceRefreshVenues = async () => {
    setIsLoading(true);
    try {
      const venuesData = await fetchVenues();
      setVenues(venuesData);
      setFilteredVenues(venuesData);
      setRefreshKey((prev) => prev + 1); // Trigger re-render
    } catch (error) {
      console.error("Error refreshing venues:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load venues on component mount
  useEffect(() => {
    const loadVenues = async () => {
      setIsLoading(true);
      try {
        const venuesData = await fetchVenues();
        setVenues(venuesData);
        setFilteredVenues(venuesData);
      } catch (error) {
        console.error("Error loading venues:", error);
        alert("Failed to load venues. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    loadVenues();
  }, [refreshKey]); // Include refreshKey as dependency

  // Filter venues based on search term
  useEffect(() => {
    if (!venueSearchTerm.trim()) {
      setFilteredVenues(venues);
    } else {
      const filtered = venues.filter(
        (venue) =>
          venue.name.toLowerCase().includes(venueSearchTerm.toLowerCase()) ||
          venue.description
            ?.toLowerCase()
            .includes(venueSearchTerm.toLowerCase()) ||
          venue.participants?.toString().includes(venueSearchTerm) ||
          venue.department
            ?.toLowerCase()
            .includes(venueSearchTerm.toLowerCase()) ||
          venue.location?.toLowerCase().includes(venueSearchTerm.toLowerCase())
      );
      setFilteredVenues(filtered);
    }
  }, [venueSearchTerm, venues]);

  // Global search functionality
  useEffect(() => {
    if (!globalSearchTerm.trim()) {
      setFilteredVenues(venues);
    } else {
      const filtered = venues.filter(
        (venue) =>
          venue.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
          venue.description
            ?.toLowerCase()
            .includes(globalSearchTerm.toLowerCase()) ||
          venue.department
            ?.toLowerCase()
            .includes(globalSearchTerm.toLowerCase()) ||
          venue.location?.toLowerCase().includes(globalSearchTerm.toLowerCase())
      );
      setFilteredVenues(filtered);
    }
  }, [globalSearchTerm, venues]);

  // Handlers for venue actions
  const handleVenueDetails = (venue) => {
    setSelectedVenue(venue);
    setVenueModalOpen(true);
  };

  const handleAddVenue = () => {
    setAddVenueModalOpen(true);
  };

  const handleSaveNewVenue = async (newVenue) => {
    try {
      // Force refresh to get the latest data including the new venue
      await forceRefreshVenues();
    } catch (error) {
      console.error("Error refreshing venues:", error);
    }
  };

  const handleEditVenue = (venue) => {
    setSelectedVenue(venue);
    setVenueModalOpen(false); // Close details modal
    setEditVenueModalOpen(true); // Open edit modal
  };

  const handleSaveEditedVenue = async (updatedVenue) => {
    try {
      // Force refresh to get the latest data including edits
      await forceRefreshVenues();

      // Reset selected venue
      setSelectedVenue(null);
    } catch (error) {
      console.error("Error refreshing venues:", error);
    }
  };

  const handleDeleteVenue = async (venue) => {
    try {
      await removeVenue(venue.id);

      // Force refresh to reflect deletion
      await forceRefreshVenues();

      // Close the modal and reset selected venue
      setVenueModalOpen(false);
      setSelectedVenue(null);

      alert(`Venue "${venue.name}" has been deleted successfully!`);
    } catch (error) {
      console.error("Error deleting venue:", error);
      alert("Failed to delete venue. Please try again.");
    }
  };

  const handleVenueSearch = (value) => {
    setVenueSearchTerm(value);
  };

  const handleGlobalSearch = (value) => {
    setGlobalSearchTerm(value);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <div className="flex flex-col lg:flex-row flex-1">
        <AdminLeftSidebar active="Management" />

        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-6 order-2 lg:order-none">
          {/* Top Search Bar (Functional Global Search) */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl border border-gray-300 rounded-full">
              <Search
                size={25}
                className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-[#56708A]"
              />
              <input
                type="text"
                placeholder="Search venues by name, description, department, location..."
                value={globalSearchTerm}
                onChange={(e) => handleGlobalSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-transparent rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-[#56708A] focus:border-[#56708A] text-xs md:text-base"
              />
            </div>
          </div>

          {/* Search Results Summary */}
          {globalSearchTerm && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">
                Search Results for "{globalSearchTerm}"
              </h3>
              <div className="text-sm text-gray-600">
                <span>{filteredVenues.length} venues found</span>
              </div>
            </div>
          )}

          {/* Venues Section - Full Width */}
          <section className="bg-white rounded-xl shadow p-4 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-[#56708A]">Venues</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isLoading
                    ? "Loading..."
                    : `${filteredVenues.length} venues ${
                        venueSearchTerm || globalSearchTerm
                          ? "found"
                          : "available"
                      }`}
                </p>
              </div>
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
                  title="Add New Venue"
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
                placeholder="Search venues by name, description, department, location..."
                value={venueSearchTerm}
                onChange={(e) => handleVenueSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#56708A] focus:border-[#56708A]"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="col-span-full flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading venues...</div>
                </div>
              ) : filteredVenues.length > 0 ? (
                filteredVenues.map((venue) => (
                  <div
                    key={`${venue.id}-${refreshKey}`} // Include refreshKey in key to force re-render
                    className="flex flex-col bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors p-4"
                  >
                    <img
                      src={venue.image_url || "/images/placeholder_venue.png"}
                      alt={venue.name}
                      className="w-full h-48 object-cover rounded-lg mb-4 bg-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder_venue.png";
                      }}
                    />
                    <div className="flex flex-col flex-grow">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {venue.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3 flex-grow">
                        {venue.description}
                      </p>
                      <div className="space-y-1 mb-4">
                        <p className="text-sm text-[#56708A] font-medium">
                          Capacity: {venue.capacity} participants
                        </p>
                        <p className="text-sm text-gray-500">
                          Managed by: {venue.department || "Administration"}
                        </p>
                        {venue.status && venue.status !== "active" && (
                          <p
                            className={`text-sm font-medium ${
                              venue.status === "maintenance"
                                ? "text-orange-600"
                                : "text-red-600"
                            }`}
                          >
                            Status:{" "}
                            {venue.status === "maintenance"
                              ? "Under Maintenance"
                              : "Inactive"}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleVenueDetails(venue)}
                        className="bg-[#56708A] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#455b74] transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={16} /> View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Search size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    No venues found
                  </h3>
                  <p className="text-gray-500 text-base mb-6">
                    {venueSearchTerm || globalSearchTerm
                      ? `No venues match your search criteria`
                      : "No venues are currently available"}
                  </p>
                  {(venueSearchTerm || globalSearchTerm) && (
                    <button
                      onClick={() => {
                        setVenueSearchTerm("");
                        setGlobalSearchTerm("");
                      }}
                      className="px-6 py-3 bg-[#56708A] text-white rounded-md hover:bg-[#455b74] transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        </main>

        <AdminRightSidebar />
      </div>

      {/* Admin Venue Details Modal */}
      <AdminVenueDetailsModal
        open={venueModalOpen}
        onClose={() => setVenueModalOpen(false)}
        venue={selectedVenue}
        onEdit={handleEditVenue}
        onDelete={handleDeleteVenue}
      />

      {/* Add Venue Modal */}
      <AddVenueModal
        open={addVenueModalOpen}
        onClose={() => setAddVenueModalOpen(false)}
        onSave={handleSaveNewVenue}
      />

      {/* Edit Venue Modal */}
      <EditVenueModal
        open={editVenueModalOpen}
        onClose={() => setEditVenueModalOpen(false)}
        venue={selectedVenue}
        onSave={handleSaveEditedVenue}
      />
    </div>
  );
}
