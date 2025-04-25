import React, { useState } from 'react'
import PlaceCardItem from './PlaceCardItem'
import { useInView } from 'react-intersection-observer'
import { db } from '@/service/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'

function PlacesToVisit({trip}) {
  // State to track places with coordinates added
  const [updatedPlaces, setUpdatedPlaces] = useState({});
  
  // Handle when coordinates are found for a place
  const handleCoordinatesFound = async (placeName, coordinates) => {
    if (!trip?.id || updatedPlaces[placeName]) return;
    
    // Avoid updating the same place multiple times
    setUpdatedPlaces(prev => ({
      ...prev,
      [placeName]: true
    }));
    
    try {
      // Clone the trip data
      const updatedTrip = { ...trip };
      let updated = false;
      
      // Update the coordinates in the trip data
      if (updatedTrip.tripData?.itinerary) {
        updatedTrip.tripData.itinerary.forEach(day => {
          if (day.plan) {
            day.plan.forEach(place => {
              if (place.placeName === placeName && !place.geoCoordinates) {
                place.geoCoordinates = coordinates;
                updated = true;
              }
            });
          }
        });
      }
      
      if (updated) {
        // Update the document in Firestore
        const tripRef = doc(db, 'AITrips', trip.id);
        await updateDoc(tripRef, {
          tripData: updatedTrip.tripData
        });
        console.log(`Updated coordinates for ${placeName}`);
      }
    } catch (error) {
      console.error('Error updating coordinates:', error);
    }
  };
  
  return (
    <div>
        <h2 className='font-bold text-lg'>Places to Visit</h2>
    
        <div>
            {trip.tripData?.itinerary.map((item,index)=>(
                <div className='mt-5' key={`day-${index}`}>
                    <h2 className='font-medium text-lg'>{item.day}</h2>
                    <div className='grid md:grid-cols-2 gap-5'>
                    {item.plan.map((place, placeIndex)=>{
                        // Use intersection observer to lazy load
                        const { ref, inView } = useInView({
                          triggerOnce: true,  // Only trigger once
                          threshold: 0.1,     // Trigger when 10% visible
                          rootMargin: '100px' // Load a bit earlier
                        });
                        
                        return (
                          <div 
                            ref={ref}
                            className='' 
                            key={`place-${placeIndex}`}
                          >
                            <h2 className='font-medium text-sm text-orange-600'>{place.time}</h2>
                            {/* Only render the PlaceCardItem when in view */}
                            {inView ? (
                              <PlaceCardItem 
                                place={place} 
                                onCoordinatesFound={handleCoordinatesFound} 
                              />
                            ) : (
                              <div className='border rounded-xl p-3 mt-2 flex gap-5 h-[146px]'>
                                <div className='w-[130px] h-[130px] bg-gray-100 rounded-xl animate-pulse'></div>
                                <div className='flex-1'>
                                  <div className='bg-gray-100 h-6 w-3/4 rounded animate-pulse'></div>
                                  <div className='bg-gray-100 h-4 w-full mt-2 rounded animate-pulse'></div>
                                  <div className='bg-gray-100 h-4 w-1/2 mt-2 rounded animate-pulse'></div>
                                  <div className='bg-gray-100 h-4 w-1/2 mt-2 rounded animate-pulse'></div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                    })}
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default PlacesToVisit