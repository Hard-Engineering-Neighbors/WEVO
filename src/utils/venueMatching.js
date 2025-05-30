import venuesList from "../data/venues";
import venueSample from "../assets/cultural_center.webp";

// Common synonyms and variations for venue matching
const VENUE_SYNONYMS = {
  'function': ['hall', 'room'],
  'hall': ['function', 'room'],
  'room': ['hall', 'function'],
  'training': ['3rd floor', 'third floor', 'conference'],
  'conference': ['training', 'meeting'],
  'center': ['centre'],
  'centre': ['center'],
  'cultural': ['grand'],
  'grand': ['cultural'],
  'gym': ['gymnasium'],
  'gymnasium': ['gym'],
  'field': ['ground', 'park'],
  'ground': ['field', 'park'],
  'park': ['field', 'ground'],
  'building': ['bldg', 'bld'],
  'bldg': ['building', 'bld'],
  'research': ['research hall'],
  'foreign': ['language', 'languages'],
  'language': ['foreign', 'languages'],
  'languages': ['foreign', 'language']
};

// Function to normalize text for comparison
const normalizeText = (text) => {
  return text.toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' '); // Normalize spaces
};

// Function to get all possible variations of a word
const getWordVariations = (word) => {
  const variations = new Set([word]);
  
  // Add synonyms
  if (VENUE_SYNONYMS[word]) {
    VENUE_SYNONYMS[word].forEach(synonym => variations.add(synonym));
  }
  
  // Add partial matches for compound words
  Object.keys(VENUE_SYNONYMS).forEach(key => {
    if (key.includes(word) || word.includes(key)) {
      variations.add(key);
      if (VENUE_SYNONYMS[key]) {
        VENUE_SYNONYMS[key].forEach(synonym => variations.add(synonym));
      }
    }
  });
  
  return Array.from(variations);
};

// Function to calculate match score between two venue names
const calculateMatchScore = (requestName, venueName) => {
  const normalizedRequest = normalizeText(requestName);
  const normalizedVenue = normalizeText(venueName);
  
  // Exact match gets highest score
  if (normalizedRequest === normalizedVenue) {
    return 100;
  }
  
  const requestWords = normalizedRequest.split(' ').filter(word => word.length > 1);
  const venueWords = normalizedVenue.split(' ').filter(word => word.length > 1);
  
  if (requestWords.length === 0 || venueWords.length === 0) {
    return 0;
  }
  
  let matchingWords = 0;
  let totalWords = requestWords.length;
  
  requestWords.forEach(requestWord => {
    const requestVariations = getWordVariations(requestWord);
    
    const hasMatch = venueWords.some(venueWord => {
      const venueVariations = getWordVariations(venueWord);
      
      // Check for exact word match
      if (requestVariations.includes(venueWord) || venueVariations.includes(requestWord)) {
        return true;
      }
      
      // Check for partial matches (for compound words)
      return requestVariations.some(reqVar => 
        venueVariations.some(venVar => 
          (reqVar.length > 3 && venVar.includes(reqVar)) ||
          (venVar.length > 3 && reqVar.includes(venVar))
        )
      );
    });
    
    if (hasMatch) {
      matchingWords++;
    }
  });
  
  // Calculate score based on percentage of matching words
  const baseScore = (matchingWords / totalWords) * 100;
  
  // Bonus for exact acronym matches (e.g., NAB, COM, CTE)
  const requestAcronyms = requestWords.filter(word => word.length <= 4 && word === word.toUpperCase());
  const venueAcronyms = venueWords.filter(word => word.length <= 4 && word === word.toUpperCase());
  
  if (requestAcronyms.length > 0 && venueAcronyms.length > 0) {
    const acronymMatches = requestAcronyms.filter(req => venueAcronyms.includes(req)).length;
    if (acronymMatches > 0) {
      return Math.min(100, baseScore + (acronymMatches * 10));
    }
  }
  
  return baseScore;
};

// Main function to find the best matching venue
export const findMatchingVenue = (venueName) => {
  if (!venueName) return null;
  
  let bestMatch = null;
  let highestScore = 0;
  
  venuesList.forEach(venue => {
    const score = calculateMatchScore(venueName, venue.name);
    
    if (score > highestScore && score >= 60) { // Minimum 60% match required
      highestScore = score;
      bestMatch = venue;
    }
  });
  
  return bestMatch;
};

// Helper function to get venue image
export const getVenueImage = (venueName) => {
  const venue = findMatchingVenue(venueName);
  return venue?.image || venueSample;
};

// Helper function to get venue data
export const getVenueData = (venueName) => {
  return findMatchingVenue(venueName);
}; 