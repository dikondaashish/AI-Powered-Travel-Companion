/**
 * Geocoding Service
 * Provides methods to convert location names to coordinates
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Cache for geocoding results to minimize API calls
const geocodeCache = {};

/**
 * Convert a location name to coordinates using Google Maps Geocoding API
 * @param {string} locationName - Name of the location to geocode
 * @returns {Promise<{lat: number, lng: number}|null>} - Coordinates or null if not found
 */
export const geocodeLocation = async (locationName) => {
  if (!locationName) return null;
  
  // Check cache first
  if (geocodeCache[locationName]) {
    return geocodeCache[locationName];
  }
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.error('Geocoding failed:', data.status);
      return null;
    }
    
    const location = data.results[0].geometry.location;
    
    // Cache result
    geocodeCache[locationName] = location;
    
    return location;
  } catch (error) {
    console.error('Error geocoding location:', error);
    return null;
  }
};

export default {
  geocodeLocation
}; 