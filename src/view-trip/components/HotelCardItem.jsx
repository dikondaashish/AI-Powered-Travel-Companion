import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlacePhoto } from '@/context/PlacePhotoContext';

function HotelCardItem({ hotel, onCoordinatesFound }) {
    const [photoUrl, setPhotoUrl] = useState();
    const [loading, setLoading] = useState(false);
    const { getPhotoUrl, photoCache } = usePlacePhoto();
    
    useEffect(() => {
      if (hotel?.hotelName) {
        // If already in cache, use it immediately
        if (photoCache[hotel.hotelName]) {
          setPhotoUrl(photoCache[hotel.hotelName]);
          return;
        }
        
        // Otherwise fetch it (with debounce)
        setLoading(true);
        const timer = setTimeout(() => {
          fetchPhoto();
        }, 100); // Small delay to prevent request spikes
        
        return () => clearTimeout(timer);
      }
    }, [hotel, photoCache]);
    
    const fetchPhoto = async () => {
      try {
        const url = await getPhotoUrl(hotel.hotelName);
        setPhotoUrl(url);
        
        // If we have onCoordinatesFound callback and the hotel doesn't already have coordinates
        // Let's extract coordinates from the Google Places API response
        if (onCoordinatesFound && !hotel.geoCoordinates && photoCache._lastPlaceResponse) {
          const placeResponse = photoCache._lastPlaceResponse;
          
          // Try to extract coordinates from the Google Places API response
          if (placeResponse?.data?.places?.[0]?.location) {
            const location = placeResponse.data.places[0].location;
            if (location.latitude && location.longitude) {
              const coordinates = `${location.latitude},${location.longitude}`;
              onCoordinatesFound(hotel.hotelName, coordinates);
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
        <Link to={'https://www.google.com/maps/search/?api=1&query='+hotel.hotelName + "," + hotel?.hotelAddress} target='_blank' >
            <div className='hover:scale-105 transition-all cursor-pointer'>
                <div className='rounded-xl h-[180px] w-full relative'>
                  {loading ? (
                    <div className='h-full w-full rounded-xl bg-gray-200 animate-pulse'></div>
                  ) : (
                    <img 
                      src={photoUrl || '/placeholder.jpg'} 
                      className='rounded-xl h-full w-full object-cover'
                      loading='lazy'
                    />
                  )}
                </div>
                <div className='my-2 flex flex-col gap-2'>
                    <h2 className='font-medium '>{hotel?.hotelName}</h2>
                    <h2 className='text-xs text-gray-500 '>📍 {hotel?.hotelAddress}</h2>
                    <h2 className='text-sm'>💰 {hotel?.price}</h2>
                    <h2 className='text-sm'>⭐ {hotel?.rating}</h2>
                    {hotel.geoCoordinates && <div className="text-xs text-gray-400">📍 Coordinates available</div>}
                </div>
            </div>
        </Link>
    )
}

export default HotelCardItem