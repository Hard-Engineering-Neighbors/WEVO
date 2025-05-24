import culturalCenterImg from "../assets/cultural_center.webp";

const requests = [
  {
    venue: "WVSU Cultural Center",
    image: culturalCenterImg,
    event: "Himig at Hiwaga 2025",
    type: "Seminar",
    date: "April 10, 2021 7:30 AM - April 11, 2021 5:30 PM",
    participants: "250",
    purpose: "Annual cultural showcase featuring local talents and performances",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    images: [
      culturalCenterImg,
      // Add more images if needed
    ]
  },
  // Add more requests as needed
];

export default requests; 

const loadRequests = async () => {
  try {
    const data = await fetchAdminRequests();
    console.log("Fetched admin requests:", data);
    console.log("All reservations before filtering:", reservations);
    setReservations(data);
  } catch (err) {
    console.error("Error fetching admin requests:", err);
  }
}; 