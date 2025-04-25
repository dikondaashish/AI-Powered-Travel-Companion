import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { usePlacePhoto } from '@/context/PlacePhotoContext';

function UserTripCardItem({trip}) {
    const [photoUrl, setPhotoUrl] = useState();
    const [loading, setLoading] = useState(false);
    const { getPhotoUrl, photoCache } = usePlacePhoto();
    
    useEffect(() => {
      const locationName = trip?.userSelection?.location?.label;
      if (locationName) {
        // If already in cache, use it immediately
        if (photoCache[locationName]) {
          setPhotoUrl(photoCache[locationName]);
          return;
        }
        
        // Otherwise fetch it (with debounce)
        setLoading(true);
        const timer = setTimeout(() => {
          fetchPhoto(locationName);
        }, 100); // Small delay to prevent request spikes
        
        return () => clearTimeout(timer);
      }
    }, [trip, photoCache]);
    
    const fetchPhoto = async (locationName) => {
      try {
        const url = await getPhotoUrl(locationName);
        setPhotoUrl(url);
      } catch (error) {
        console.error('Error fetching photo:', error);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <Link to={'/view-trip/'+trip?.id}>
        <div className='hover:scale-105 transition-all'>
          <div className='rounded-xl h-[220px] relative'>
            {loading ? (
              <div className='h-full w-full rounded-xl bg-gray-200 animate-pulse'></div>
            ) : (
              <img 
                src={photoUrl || '/placeholder.jpg'} 
                className='object-cover rounded-xl h-full w-full'
                loading='lazy'
              />
            )}
          </div>
          <div>
            <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
            <h2 className='text-sm text-gray-500'>{trip?.userSelection.noOfDays} Days trip with {trip?.userSelection?.budget} Budget</h2>
          </div>
        </div>
      </Link>
    )
}

export default UserTripCardItem