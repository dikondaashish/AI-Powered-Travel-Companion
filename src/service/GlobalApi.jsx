import axios from "axios"
import { apiMonitor } from './APIMonitoring';

const BASE_URL='https://places.googleapis.com/v1/places:searchText'
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Cache for place details and photos
const placeCache = {};
const photoCache = {};

const config={
    headers:{
        'Content-Type':'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
        'X-Goog-FieldMask':[
            'places.photos',
            'places.displayName',
            'places.id',
            'places.location',
            'places.formattedAddress',
            'places.internationalPhoneNumber',
            'places.rating'
        ]
    }
}

export const GetPlaceDetails = async (data) => {
  // Create a cache key from the query
  const cacheKey = data.textQuery;
  
  // Check if we have a valid cached response
  if (placeCache[cacheKey] && 
      (Date.now() - placeCache[cacheKey].timestamp < CACHE_DURATION)) {
    console.log('Using cached place details for:', cacheKey);
    return placeCache[cacheKey].data;
  }
  
  // If not in cache or expired, make the API call
  try {
    const response = await axios.post(BASE_URL, data, config);
    
    // Track the API call
    apiMonitor.trackRequest('placeDetails');
    
    // Cache the response with a timestamp
    placeCache[cacheKey] = {
      data: response,
      timestamp: Date.now()
    };
    
    return response;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

// For photos, add a function that checks cache
export const GetPlacePhoto = async (photoRef) => {
  if (photoCache[photoRef] && 
      (Date.now() - photoCache[photoRef].timestamp < CACHE_DURATION)) {
    console.log('Using cached photo for:', photoRef);
    return photoCache[photoRef].url;
  }
  
  // Track the API call
  apiMonitor.trackRequest('placePhotos');
  
  const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoRef);
  
  // Cache the photo URL
  photoCache[photoRef] = {
    url: photoUrl,
    timestamp: Date.now()
  };
  
  return photoUrl;
};

export const PHOTO_REF_URL='https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACE_API_KEY
