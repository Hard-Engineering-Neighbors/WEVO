import venues, { addVenue, updateVenue, deleteVenue, getVenueById, getAllVenues } from "../data/venues";

export function fetchVenues() {
  // TODO: Replace with real API call
  return Promise.resolve(getAllVenues());
}

export function createVenue(venueData) {
  // TODO: Replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newVenue = addVenue(venueData);
      resolve(newVenue);
    }, 500); // Simulate API delay
  });
}

export function editVenue(id, updates) {
  // TODO: Replace with real API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const updatedVenue = updateVenue(id, updates);
      if (updatedVenue) {
        resolve(updatedVenue);
      } else {
        reject(new Error("Venue not found"));
      }
    }, 500); // Simulate API delay
  });
}

export function removeVenue(id) {
  // TODO: Replace with real API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const deletedVenue = deleteVenue(id);
      if (deletedVenue) {
        resolve(deletedVenue);
      } else {
        reject(new Error("Venue not found"));
      }
    }, 500); // Simulate API delay
  });
}

export function getVenue(id) {
  // TODO: Replace with real API call
  return Promise.resolve(getVenueById(id));
} 