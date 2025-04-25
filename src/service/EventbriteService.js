/**
 * Eventbrite API Service
 * Provides methods to fetch local events based on location and date range
 */

// Private token used for authentication - never expose this in client-side code
const PRIVATE_TOKEN = import.meta.env.VITE_EVENTBRITE_PRIVATE_TOKEN;
const API_BASE_URL = 'https://www.eventbriteapi.com/v3';

// Cache for event data to minimize API calls
const eventCache = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Format date to ISO 8601 format required by Eventbrite API
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
const formatDate = (date) => {
  if (!date) return null;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

/**
 * Generate a cache key based on search parameters
 * @param {Object} params - Search parameters
 * @returns {string} - Cache key
 */
const generateCacheKey = (params) => {
  return `${params.latitude}_${params.longitude}_${params.startDate}_${params.endDate}`;
};

/**
 * Fetch events from Eventbrite API
 * @param {Object} params - Search parameters
 * @param {number} params.latitude - Location latitude
 * @param {number} params.longitude - Location longitude
 * @param {string} params.startDate - Trip start date (YYYY-MM-DD)
 * @param {string} params.endDate - Trip end date (YYYY-MM-DD)
 * @returns {Promise<Array>} - Array of event objects
 */
export const fetchEvents = async (params) => {
  try {
    // Validate required parameters
    if (!params || !params.latitude || !params.longitude || !params.startDate || !params.endDate) {
      console.error('Missing required parameters for Eventbrite API call');
      return { events: [] };
    }

    // Generate cache key and check cache
    const cacheKey = generateCacheKey(params);
    const cachedData = eventCache[cacheKey];
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Using cached Eventbrite data');
      return cachedData.data;
    }

    // Format dates for API
    const startDate = formatDate(params.startDate);
    const endDate = formatDate(params.endDate);
    
    if (!startDate || !endDate) {
      console.error('Invalid date format for Eventbrite API call');
      return { events: [] };
    }

    // Construct API URL with query parameters
    const queryParams = new URLSearchParams({
      'location.latitude': params.latitude,
      'location.longitude': params.longitude,
      'start_date.range_start': startDate,
      'start_date.range_end': endDate,
      'sort_by': 'date',
      'expand': 'venue',
      'page_size': 5
    });

    const url = `${API_BASE_URL}/events/search/?${queryParams.toString()}`;

    // Make the API request with authorization header
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRIVATE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Eventbrite API error:', response.status, errorData);
      return { events: [] };
    }

    const data = await response.json();
    
    // Process and simplify event data
    const events = data.events.map(event => ({
      id: event.id,
      name: event.name?.text || 'Unnamed Event',
      start: event.start?.local || '',
      description: event.description?.text || 'No description available',
      url: event.url || '',
      imageUrl: event.logo?.url || null,
      venue: event.venue?.name || 'Location not specified',
      address: event.venue?.address?.localized_address_display || ''
    }));

    // Cache the results
    const result = { events };
    eventCache[cacheKey] = {
      timestamp: Date.now(),
      data: result
    };

    return result;
  } catch (error) {
    console.error('Error fetching events from Eventbrite:', error);
    // Return empty array on error, don't expose API errors to client
    return { events: [] };
  }
};

export default {
  fetchEvents
}; 