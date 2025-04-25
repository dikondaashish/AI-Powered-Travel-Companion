import React, { createContext, useContext, useState } from 'react';
import { GetPlaceDetails, GetPlacePhoto } from '@/service/GlobalApi';

const PlacePhotoContext = createContext();

export function PlacePhotoProvider({ children }) {
  const [photoCache, setPhotoCache] = useState({
    _lastPlaceResponse: null // Special property to store the last response
  });
  
  const getPhotoUrl = async (placeName) => {
    // Check if already in cache
    if (photoCache[placeName]) {
      return photoCache[placeName];
    }
    
    try {
      const data = { textQuery: placeName };
      const response = await GetPlaceDetails(data);
      
      // Store the last response for coordinate extraction
      setPhotoCache(prev => ({
        ...prev,
        _lastPlaceResponse: response
      }));
      
      if (response.data?.places?.[0]?.photos?.length > 0) {
        // Use the first available photo instead of always index 3
        const photoRef = response.data.places[0].photos[0].name;
        const photoUrl = await GetPlacePhoto(photoRef);
        
        // Update cache
        setPhotoCache(prev => ({
          ...prev,
          [placeName]: photoUrl
        }));
        
        return photoUrl;
      }
      return null;
    } catch (error) {
      console.error('Error fetching photo:', error);
      return null;
    }
  };
  
  return (
    <PlacePhotoContext.Provider value={{ getPhotoUrl, photoCache }}>
      {children}
    </PlacePhotoContext.Provider>
  );
}

export const usePlacePhoto = () => useContext(PlacePhotoContext); 