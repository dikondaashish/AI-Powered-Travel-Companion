/**
 * Utility functions for handling geolocation data
 */

/**
 * Attempts to extract latitude and longitude from various coordinate formats
 * @param {Object|String} source - The source data which may contain coordinates
 * @returns {Object|null} - { lat, lng } if valid coordinates found, null otherwise
 */
export function extractCoordinates(source) {
  if (!source) return null;

  try {
    // Case 1: String format like "40.7501,-73.9777"
    if (typeof source === 'string') {
      const coords = source.split(',').map(coord => parseFloat(coord.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return { lat: coords[0], lng: coords[1] };
      }
    }
    
    // Case 2: Object with lat/lng properties
    if (source.lat !== undefined && source.lng !== undefined) {
      const lat = typeof source.lat === 'function' ? source.lat() : source.lat;
      const lng = typeof source.lng === 'function' ? source.lng() : source.lng;
      
      if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
        return { lat: parseFloat(lat), lng: parseFloat(lng) };
      }
    }
    
    // Case 3: Object with latitude/longitude properties
    if (source.latitude !== undefined && source.longitude !== undefined) {
      if (!isNaN(parseFloat(source.latitude)) && !isNaN(parseFloat(source.longitude))) {
        return { lat: parseFloat(source.latitude), lng: parseFloat(source.longitude) };
      }
    }
    
    // Case 4: Google Maps API format with geometry
    if (source.geometry && source.geometry.location) {
      const { lat, lng } = source.geometry.location;
      const latitude = typeof lat === 'function' ? lat() : lat;
      const longitude = typeof lng === 'function' ? lng() : lng;
      
      if (!isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
        return { lat: parseFloat(latitude), lng: parseFloat(longitude) };
      }
    }
    
    // Case 5: Object with coordinates property
    if (source.coordinates) {
      if (Array.isArray(source.coordinates) && source.coordinates.length >= 2) {
        // GeoJSON format [longitude, latitude]
        return { lat: parseFloat(source.coordinates[1]), lng: parseFloat(source.coordinates[0]) };
      } else if (source.coordinates.lat !== undefined && source.coordinates.lng !== undefined) {
        return { 
          lat: parseFloat(source.coordinates.lat), 
          lng: parseFloat(source.coordinates.lng) 
        };
      }
    }
    
    // Case 6: Object with geoCoordinates property as a string
    if (source.geoCoordinates) {
      return extractCoordinates(source.geoCoordinates);
    }
  } catch (error) {
    console.error("Error extracting coordinates:", error);
  }
  
  return null;
}

/**
 * Calculates the center point of a collection of coordinates
 * @param {Array} locations - Array of objects with lat/lng properties
 * @returns {Object|null} - { lat, lng } center point or null if no valid coordinates
 */
export function calculateCenter(locations) {
  if (!locations || !locations.length) return null;
  
  const validLocations = locations
    .map(loc => extractCoordinates(loc))
    .filter(Boolean);
  
  if (!validLocations.length) return null;
  
  const totalLat = validLocations.reduce((sum, coord) => sum + coord.lat, 0);
  const totalLng = validLocations.reduce((sum, coord) => sum + coord.lng, 0);
  
  return {
    lat: totalLat / validLocations.length,
    lng: totalLng / validLocations.length
  };
}

/**
 * Calculates bounds that encompass all locations
 * @param {Array} locations - Array of objects with lat/lng properties
 * @returns {Object|null} - { ne: {lat, lng}, sw: {lat, lng} } bounds or null
 */
export function calculateBounds(locations) {
  if (!locations || !locations.length) return null;
  
  const validLocations = locations
    .map(loc => extractCoordinates(loc))
    .filter(Boolean);
  
  if (!validLocations.length) return null;
  
  let minLat = validLocations[0].lat;
  let maxLat = validLocations[0].lat;
  let minLng = validLocations[0].lng;
  let maxLng = validLocations[0].lng;
  
  validLocations.forEach(coord => {
    minLat = Math.min(minLat, coord.lat);
    maxLat = Math.max(maxLat, coord.lat);
    minLng = Math.min(minLng, coord.lng);
    maxLng = Math.max(maxLng, coord.lng);
  });
  
  // Add some padding
  const latPadding = (maxLat - minLat) * 0.1;
  const lngPadding = (maxLng - minLng) * 0.1;
  
  return {
    ne: { lat: maxLat + latPadding, lng: maxLng + lngPadding },
    sw: { lat: minLat - latPadding, lng: minLng - lngPadding }
  };
}

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 * @param {Object} coord1 - { lat, lng } first coordinate
 * @param {Object} coord2 - { lat, lng } second coordinate
 * @returns {number} - Distance in kilometers
 */
export function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
} 