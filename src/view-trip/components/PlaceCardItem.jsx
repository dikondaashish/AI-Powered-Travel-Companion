import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { usePlacePhoto } from '@/context/PlacePhotoContext';

function PlaceCardItem({place, onCoordinatesFound}) {
  const [photoUrl, setPhotoUrl] = useState();
  const [loading, setLoading] = useState(false);
  const { getPhotoUrl, photoCache } = usePlacePhoto();
  
  useEffect(() => {
    if (place?.placeName) {
      // If already in cache, use it immediately
      if (photoCache[place.placeName]) {
        setPhotoUrl(photoCache[place.placeName]);
        return;
      }
      
      // Otherwise fetch it (with debounce)
      setLoading(true);
      const timer = setTimeout(() => {
        fetchPhoto();
      }, 100); // Small delay to prevent request spikes
      
      return () => clearTimeout(timer);
    }
  }, [place, photoCache]);
  
  const fetchPhoto = async () => {
    try {
      const url = await getPhotoUrl(place.placeName);
      setPhotoUrl(url);
      
      // If we have onCoordinatesFound callback and the place doesn't already have coordinates
      // Let's extract coordinates from the Google Places API response
      if (onCoordinatesFound && !place.geoCoordinates && photoCache._lastPlaceResponse) {
        const placeResponse = photoCache._lastPlaceResponse;
        
        // Try to extract coordinates from the Google Places API response
        if (placeResponse?.data?.places?.[0]?.location) {
          const location = placeResponse.data.places[0].location;
          if (location.latitude && location.longitude) {
            const coordinates = `${location.latitude},${location.longitude}`;
            onCoordinatesFound(place.placeName, coordinates);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching photo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+place.placeName} target='_blank'>
        <div className='border rounded-xl p-3 mt-2 flex gap-5 
        hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
            <div className='w-[130px] h-[130px] relative'>
              {loading ? (
                <div className='w-full h-full rounded-xl bg-gray-200 animate-pulse'></div>
              ) : (
                <img src={photoUrl || '/placeholder.jpg'}
                  className='w-full h-full rounded-xl object-cover'
                  loading='lazy' // Use native lazy loading
                />
              )}
            </div>
            <div>
                <h2 className='font-bold text-lg'>{place.placeName}</h2>
                <p className='text-sm text-gray-400'>{place.placeDetails}</p>
                <h2 className='mt-2'>🕙 {place.timeToTravel}</h2>
                <h2 className='mt-2'>🎟️ {place.ticketPricing}</h2>
                {place.geoCoordinates && <div className="mt-1 text-xs text-gray-400">📍 Coordinates available</div>}
                {/* <Button size="sm"><FaMapLocationDot /></Button> */}
            </div>
        </div>
    </Link>
  )
}

export default PlaceCardItem