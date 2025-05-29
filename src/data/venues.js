import culturalCenterImage from '../assets/cultural_center.webp';
import nabHallImage from '../assets/nab_hall.webp';
import grandStandImage from '../assets/grand_stand.webp';
import diamondFieldImage from '../assets/diamond_field.webp';
import jubileeParkImage from '../assets/jubilee_park.webp';
import comGymImage from '../assets/com_gym.webp';
import researchBldgImage from '../assets/research_bldg.webp';
import binhiThirdImage from '../assets/binhi_third.webp';
import cteImage from '../assets/cte.png';
import foreignLanguagesImage from '../assets/foreign_languages.webp';

// Default venues data
const defaultVenues = [
  {
    id: 1,
    name: "Grand Cultural Center",
    description:
      "The crown jewel for grand performances and significant university events, the Grand Cultural Center boasts a large auditorium with extensive seating. It's the premier venue for cultural shows, major academic ceremonies like graduations and convocations, and high-profile keynote speeches. Equipped with professional sound and lighting systems for an unforgettable experience.",
    participants: 400,
    image: culturalCenterImage,
    department: "Student Affairs Office",
    location: "Main Campus, Cultural Center Building",
    features: ["Audio System", "Lighting System", "Air Conditioning", "Stage"],
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    name: "NAB Hall Function",
    description:
      "A versatile multi-purpose hall within the New Academic Building, the NAB Hall Function offers a spacious and adaptable setting for a wide array of university events. Perfect for large lectures, departmental assemblies, student orientations, and mid-sized conferences. Features flexible seating arrangements to suit your event's needs.",
    participants: 500,
    image: nabHallImage,
    department: "Academic Affairs",
    location: "New Academic Building, 2nd Floor",
    features: ["Projector", "Audio System", "Air Conditioning", "WiFi"],
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 3,
    name: "Grand Stand",
    description:
      "Overlooking our expansive outdoor fields, the Grand Stand provides ample tiered seating for spectators. This iconic venue is perfect for athletic events, university-wide parades, outdoor ceremonies, and large student gatherings where a vast audience is expected. Experience the energy of campus life from this central viewing point.",
    participants: 500,
    image: grandStandImage,
    department: "Sports and Recreation",
    location: "Athletic Complex",
    features: ["Outdoor Setting", "Parking", "Security"],
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 4,
    name: "Diamond Field",
    description:
      "A well-maintained open field, often utilized for baseball and softball, but versatile enough for various outdoor sports and recreational activities. The Diamond Field is a key resource for physical education classes, intramural sports, and outdoor student organizations looking for a dynamic open space.",
    participants: 500,
    image: diamondFieldImage,
    department: "Physical Education Department",
    location: "Athletic Complex, Field Area",
    features: ["Outdoor Setting", "Sports Equipment", "Parking"],
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 5,
    name: "Jubilee Park",
    description:
      "A serene and beautifully landscaped green space, Jubilee Park offers a peaceful retreat amidst the bustling campus. It's an ideal spot for informal gatherings, outdoor study groups, or simply enjoying a quiet moment. Perfect for small outdoor events, picnics, or as a scenic backdrop for casual meet-ups.",
    participants: 500,
    image: jubileeParkImage,
    department: "Campus Facilities",
    location: "Central Campus",
    features: ["Outdoor Setting", "Landscaping", "WiFi"],
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 6,
    name: "COM Gym",
    description:
      "The dedicated gymnasium of the College of Medicine, the COM Gym is a modern indoor facility suitable for various sports, fitness activities, and health-related events. It's an excellent venue for inter-college sports competitions, wellness programs, and practical demonstrations for health sciences students.",
    participants: 500,
    image: comGymImage,
    department: "College of Medicine",
    location: "COM Building, Ground Floor",
    features: ["Sports Equipment", "Air Conditioning", "Sound System", "Security"],
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 7,
    name: "Research Hall Function",
    description:
      "Situated within the university's research building, the Research Hall Function room is specifically designed to facilitate academic inquiry and dissemination. It's the go-to venue for research presentations, scientific seminars, data workshops, and collaborative meetings among researchers. Equipped to support advanced technical presentations.",
    participants: 500,
    image: researchBldgImage,
    department: "Research and Development",
    location: "Research Building, 3rd Floor",
    features: ["Projector", "Audio System", "WiFi", "Air Conditioning"],
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 8,
    name: "BINHI 3rd Floor Room",
    description:
      "Located on the third floor of the BINHI building, this room offers a versatile space suitable for smaller classes, specialized workshops, or breakout sessions. It provides a quiet and focused environment for learning and collaboration, supporting the various academic and research initiatives housed within the BINHI facility.",
    participants: 50,
    image: binhiThirdImage,
    department: "BINHI Office",
    location: "BINHI Building, 3rd Floor",
    features: ["Projector", "WiFi", "Air Conditioning"],
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 9,
    name: "BINHI Conference Room",
    description:
      "A modern and well-equipped conference room within the BINHI building, designed for productive meetings and focused discussions. Ideal for committee meetings, project planning sessions, small group collaborations, and video conferences. Features comfortable seating and essential presentation technology.",
    participants: 25,
    image: binhiThirdImage, // Using same image as placeholder
    department: "BINHI Office",
    location: "BINHI Building, 2nd Floor",
    features: ["Video Conferencing", "Projector", "WiFi", "Air Conditioning"],
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 10,
    name: "Center of Teaching Excellence",
    description:
      "Dedicated to fostering educational innovation and professional growth, the CTE is a modern facility designed for workshops, seminars, and collaborative discussions. Ideal for faculty development programs, curriculum planning sessions, and intimate academic gatherings. Equipped with flexible learning spaces and presentation tools.",
    participants: 100,
    image: cteImage,
    department: "Center for Teaching Excellence",
    location: "CTE Building",
    features: ["Projector", "Audio System", "WiFi", "Air Conditioning"],
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 11,
    name: "Center for Foreign Languages",
    description:
      "This specialized room, often utilized as a rehearsal space by the university, is home to the Center for Foreign Languages. It provides a focused environment ideal for language classes, cultural practice sessions, and rehearsals for performing arts groups. Equipped to support auditory learning and collaborative practice.",
    participants: 500,
    image: foreignLanguagesImage,
    department: "Center for Foreign Languages",
    location: "Language Center Building",
    features: ["Audio System", "Stage", "WiFi", "Air Conditioning"],
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
];

// Key for localStorage
const VENUES_STORAGE_KEY = 'wevo_venues_data';

// Initialize venues from localStorage or use default data
const initializeVenues = () => {
  try {
    const storedVenues = localStorage.getItem(VENUES_STORAGE_KEY);
    if (storedVenues) {
      const parsedVenues = JSON.parse(storedVenues);
      // Validate that stored data is an array and has venues
      if (Array.isArray(parsedVenues) && parsedVenues.length > 0) {
        return parsedVenues;
      }
    }
  } catch (error) {
    console.warn('Failed to load venues from localStorage:', error);
  }
  
  // If no valid stored data, use default and save to localStorage
  saveVenuesToStorage(defaultVenues);
  return [...defaultVenues];
};

// Save venues to localStorage
const saveVenuesToStorage = (venuesData) => {
  try {
    localStorage.setItem(VENUES_STORAGE_KEY, JSON.stringify(venuesData));
  } catch (error) {
    console.error('Failed to save venues to localStorage:', error);
  }
};

// Initialize venues
let venues = initializeVenues();

// Functions to manage venues with persistence
export const addVenue = (venue) => {
  console.log('addVenue - Input venue:', venue);
  console.log('addVenue - Input venue image:', venue.image);
  
  const newVenue = {
    ...venue,
    id: Math.max(...venues.map(v => v.id), 0) + 1,
    createdAt: new Date().toISOString(),
  };
  
  console.log('addVenue - New venue with ID:', newVenue);
  console.log('addVenue - New venue image:', newVenue.image);
  
  venues.push(newVenue);
  saveVenuesToStorage(venues);
  
  console.log('addVenue - Venues array after addition:', venues);
  console.log('addVenue - Total venues count:', venues.length);
  
  return newVenue;
};

export const updateVenue = (id, updates) => {
  console.log('updateVenue - ID:', id);
  console.log('updateVenue - Updates:', updates);
  console.log('updateVenue - Updates image:', updates.image);
  
  const index = venues.findIndex(v => v.id === id);
  if (index !== -1) {
    const originalVenue = venues[index];
    console.log('updateVenue - Original venue:', originalVenue);
    
    venues[index] = { ...venues[index], ...updates };
    
    console.log('updateVenue - Updated venue:', venues[index]);
    console.log('updateVenue - Updated venue image:', venues[index].image);
    
    saveVenuesToStorage(venues);
    return venues[index];
  }
  console.log('updateVenue - Venue not found with ID:', id);
  return null;
};

export const deleteVenue = (id) => {
  console.log('deleteVenue - ID:', id);
  const index = venues.findIndex(v => v.id === id);
  if (index !== -1) {
    const deletedVenue = venues[index];
    console.log('deleteVenue - Deleting venue:', deletedVenue);
    venues.splice(index, 1);
    saveVenuesToStorage(venues);
    console.log('deleteVenue - Venues count after deletion:', venues.length);
    return deletedVenue;
  }
  console.log('deleteVenue - Venue not found with ID:', id);
  return null;
};

export const getVenueById = (id) => {
  const venue = venues.find(v => v.id === id);
  console.log('getVenueById - ID:', id);
  console.log('getVenueById - Found venue:', venue);
  if (venue) {
    console.log('getVenueById - Venue image:', venue.image);
  }
  return venue;
};

export const getAllVenues = () => {
  console.log('getAllVenues - Current venues count:', venues.length);
  console.log('getAllVenues - All venues:', venues);
  
  // Log each venue's image for debugging
  venues.forEach((venue, index) => {
    console.log(`getAllVenues - Venue ${index + 1} (${venue.name}) image:`, venue.image);
  });
  
  return [...venues];
};

// Utility function to reset venues to default (for testing/admin purposes)
export const resetVenuesToDefault = () => {
  venues = [...defaultVenues];
  saveVenuesToStorage(venues);
  return venues;
};

// Utility function to export venues data (for backup)
export const exportVenuesData = () => {
  return JSON.stringify(venues, null, 2);
};

// Utility function to import venues data (for restore)
export const importVenuesData = (venuesJson) => {
  try {
    const importedVenues = JSON.parse(venuesJson);
    if (Array.isArray(importedVenues)) {
      venues = importedVenues;
      saveVenuesToStorage(venues);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to import venues data:', error);
    return false;
  }
};

export default venues; 