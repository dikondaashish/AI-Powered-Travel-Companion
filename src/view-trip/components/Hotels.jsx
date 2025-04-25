import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import HotelCardItem from './HotelCardItem'
import { useInView } from 'react-intersection-observer'
import { db } from '@/service/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'

function Hotels({trip}) {
  // State to track hotels with coordinates added
  const [updatedHotels, setUpdatedHotels] = useState({});
  
  // Handle when coordinates are found for a hotel
  const handleCoordinatesFound = async (hotelName, coordinates) => {
    if (!trip?.id || updatedHotels[hotelName]) return;
    
    // Avoid updating the same hotel multiple times
    setUpdatedHotels(prev => ({
      ...prev,
      [hotelName]: true
    }));
    
    try {
      // Clone the trip data
      const updatedTrip = { ...trip };
      let updated = false;
      
      // Update the coordinates in the trip data
      if (updatedTrip.tripData?.hotels) {
        updatedTrip.tripData.hotels.forEach(hotel => {
          if (hotel.hotelName === hotelName && !hotel.geoCoordinates) {
            hotel.geoCoordinates = coordinates;
            updated = true;
          }
        });
      }
      
      if (updated) {
        // Update the document in Firestore
        const tripRef = doc(db, 'AITrips', trip.id);
        await updateDoc(tripRef, {
          tripData: updatedTrip.tripData
        });
        console.log(`Updated coordinates for hotel ${hotelName}`);
      }
    } catch (error) {
      console.error('Error updating hotel coordinates:', error);
    }
  };
  
  return (
    <div>
        <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>

        <div className='grid grid-cols-2 my-5 md:grid-cols-3 xl:grid-cols-4 gap-5'>
            {trip?.tripData?.hotels?.map((hotel,index)=>{
                // Use intersection observer to lazy load
                const { ref, inView } = useInView({
                    triggerOnce: true,  // Only trigger once
                    threshold: 0.1,     // Trigger when 10% visible
                    rootMargin: '100px' // Load a bit earlier
                });
                
                return (
                    <div ref={ref} key={`hotel-${index}`}>
                        {inView ? (
                            <HotelCardItem 
                              hotel={hotel} 
                              onCoordinatesFound={handleCoordinatesFound}
                            />
                        ) : (
                            <div className='hover:scale-105 transition-all cursor-pointer'>
                                <div className='rounded-xl h-[180px] w-full bg-gray-100 animate-pulse'></div>
                                <div className='my-2 flex flex-col gap-2'>
                                    <div className='bg-gray-100 h-5 w-3/4 rounded animate-pulse'></div>
                                    <div className='bg-gray-100 h-4 w-full rounded animate-pulse'></div>
                                    <div className='bg-gray-100 h-4 w-1/2 rounded animate-pulse'></div>
                                    <div className='bg-gray-100 h-4 w-1/4 rounded animate-pulse'></div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    
    </div>
  )
}

export default Hotels