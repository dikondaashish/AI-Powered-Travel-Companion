import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, Clock, Loader2, Info, X, CalendarDays, MapPin as MapIcon, Clock as ClockIcon, Users, Tag, Calendar as CalendarIcon } from 'lucide-react';
import { fetchEvents } from '@/service/EventbriteService';
import { geocodeLocation } from '@/service/GeocodingService';
import { Button } from '@/components/ui/button';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';

const EventDetailsModal = ({ event, isOpen, onClose }) => {
  if (!event) return null;
  
  // Create a function to build Eventbrite search URL based on event name and location
  const getEventbriteUrl = (eventName, location) => {
    const searchQuery = encodeURIComponent(`${eventName} ${location}`);
    return `https://www.eventbrite.com/d/online/${searchQuery}/?page=1`;
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 top-[10%] mx-auto max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden z-50 max-h-[80vh] flex flex-col"
          >
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Event image */}
            <div className="relative h-60 w-full bg-gradient-to-r from-blue-400 to-purple-500">
              <img 
                src={event.image} 
                alt={event.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://source.unsplash.com/random/800x400/?event';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">{event.name}</h3>
              </div>
            </div>
            
            {/* Event details */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <CalendarDays className="text-blue-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{event.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <ClockIcon className="text-purple-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 col-span-1 sm:col-span-2">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <MapIcon className="text-emerald-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">About This Event</h4>
                <p className="text-gray-700">{event.description}</p>
              </div>
              
              {/* These would be real in a production app */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{Math.floor(Math.random() * 200) + 50} attendees</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Tag className="h-4 w-4" />
                  <span>${Math.floor(Math.random() * 50)}-${Math.floor(Math.random() * 100) + 50}</span>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="border-t p-4 flex flex-wrap gap-3 justify-end bg-gray-50">
              <Button 
                variant="outline"
                onClick={onClose}
                className="flex-shrink-0"
              >
                Close
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-shrink-0 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                onClick={() => window.open(getEventbriteUrl(event.name, event.location), '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Book Tickets
              </Button>
              
              <Button 
                variant="default" 
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(event.location)}`, '_blank')}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const LocalEvents = ({ trip }) => {
  const [localEvents, setLocalEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState('');

  // Helper function to extract location label from trip data
  const extractLocationLabel = (tripData) => {
    if (!tripData) return null;
    
    try {
      // Priority 1: Check userSelection.location.label
      if (tripData.userSelection?.location?.label) {
        return tripData.userSelection.location.label;
      }
      
      // Priority 2: Check tripData.location or tripData.destination
      if (tripData.tripData?.location) {
        return typeof tripData.tripData.location === 'string' 
          ? tripData.tripData.location 
          : tripData.tripData.location.label || null;
      }
      
      if (tripData.tripData?.destination) {
        return tripData.tripData.destination;
      }
      
      // Priority 3: Check trip name for location mentions
      if (tripData.name) {
        const tripNameParts = tripData.name.split(/\s+in\s+|\s+to\s+/i);
        if (tripNameParts.length > 1) {
          return tripNameParts[1].trim();
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error extracting location label:", error);
      return null;
    }
  };

  // Get trip data from Firebase if needed
  useEffect(() => {
    const fetchTripFromFirebase = async () => {
      if (!trip) return;
      
      // If trip is just an ID or missing location data, fetch complete trip from Firebase
      if (typeof trip === 'string' || !extractLocationLabel(trip)) {
        try {
          const tripId = typeof trip === 'string' ? trip : trip.id;
          console.log(`Fetching trip details from Firebase for ID: ${tripId}`);
          
          const tripDoc = await getDoc(doc(db, "trips", tripId));
          if (tripDoc.exists()) {
            const tripData = tripDoc.data();
            const label = extractLocationLabel(tripData);
            if (label) {
              setLocationLabel(label);
              console.log(`Found location label from Firebase: ${label}`);
            } else {
              console.warn("No location label found in Firebase trip data");
            }
          } else {
            console.warn("Trip document not found in Firebase");
          }
        } catch (error) {
          console.error("Error fetching trip from Firebase:", error);
        }
      } else {
        // Trip object has the necessary data
        const label = extractLocationLabel(trip);
        if (label) {
          setLocationLabel(label);
          console.log(`Using location label from props: ${label}`);
        }
      }
    };
    
    fetchTripFromFirebase();
  }, [trip]);

  // Format date for display
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Truncate long text with ellipsis
  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Mock data function - generates sample local events data for testing
  const getMockLocalEvents = (lat, lng, locationName = 'this area') => {
    console.log(`Fetching local events near coordinates: lat=${lat}, lng=${lng} for ${locationName}`);
    
    // Generate random dates within the next 30 days
    const generateRandomDate = () => {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30));
      return futureDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    };
    
    // Array of possible event types with specific data - customized for the location
    const eventTypes = [
      {
        category: 'Food & Drink',
        events: [
          {
            name: `${locationName} Food Festival`,
            description: `Experience the flavors of ${locationName} with over 30 vendors offering traditional dishes and innovative fusion creations.`,
            location: 'City Center Plaza'
          },
          {
            name: 'Local Wine Tasting Tour',
            description: `Sample the finest wines from the ${locationName} region guided by expert sommeliers.`,
            location: 'Regional Vineyards'
          },
          {
            name: `${locationName} Cooking Class`,
            description: `Learn to prepare authentic ${locationName} dishes from professional chefs in this hands-on cooking workshop.`,
            location: 'Culinary Institute'
          }
        ]
      },
      {
        category: 'Arts & Culture',
        events: [
          {
            name: `${locationName} Art Exhibition`,
            description: `Featuring works from renowned ${locationName} artists exploring themes of nature and urban life.`,
            location: 'Modern Art Museum'
          },
          {
            name: `Historical Tour of ${locationName}`,
            description: `Discover the rich history of ${locationName} with expert guides sharing fascinating stories about historical landmarks.`,
            location: 'Old Town District'
          },
          {
            name: `${locationName} Theater Festival`,
            description: `An immersive theatrical experience bringing to life the legends and stories that shaped the local culture.`,
            location: 'Community Theater'
          }
        ]
      },
      {
        category: 'Music & Entertainment',
        events: [
          {
            name: `${locationName} Jazz Night`,
            description: `Enjoy an evening of soulful jazz performances by talented ${locationName} musicians in an intimate setting.`,
            location: 'Blue Note Club'
          },
          {
            name: `${locationName} Summer Concert Series`,
            description: 'Open-air concerts featuring a mix of popular bands and emerging artists across various music genres.',
            location: 'Riverside Park Amphitheater'
          },
          {
            name: `${locationName} Folk Music Festival`,
            description: `Celebrate the cultural heritage of ${locationName} through authentic folk music and dance performances.`,
            location: 'Heritage Square'
          }
        ]
      },
      {
        category: 'Outdoor & Recreation',
        events: [
          {
            name: `${locationName} Farmers Market`,
            description: 'Shop for fresh, locally-grown produce, handmade crafts, and artisanal food products directly from producers.',
            location: 'Community Park'
          },
          {
            name: `${locationName} Nature Tour`,
            description: `Explore ${locationName}'s natural beauty with expert naturalists who will identify flora and fauna while sharing ecological insights.`,
            location: 'National Park Visitor Center'
          },
          {
            name: `${locationName} Outdoor Yoga Retreat`,
            description: 'Rejuvenate your body and mind with yoga sessions in the beautiful outdoor settings, suitable for all experience levels.',
            location: 'Central Park'
          }
        ]
      }
    ];
    
    // Select random events from different categories
    let selectedEvents = [];
    eventTypes.forEach(category => {
      // Select 1-2 random events from each category
      const numEventsToSelect = Math.floor(Math.random() * 2) + 1;
      const shuffledEvents = [...category.events].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < Math.min(numEventsToSelect, shuffledEvents.length); i++) {
        const event = shuffledEvents[i];
        selectedEvents.push({
          id: `${category.category.toLowerCase().replace(/[&\s]/g, '-')}-${i}-${Date.now()}`,
          name: event.name,
          date: generateRandomDate(),
          time: `${Math.floor(Math.random() * 12) + 1}:${Math.random() > 0.5 ? '00' : '30'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
          location: event.location,
          description: event.description,
          category: category.category,
          image: `https://source.unsplash.com/random/300x200/?${encodeURIComponent(event.name.toLowerCase().replace(locationName, '').trim() || 'event')}`
        });
      }
    });
    
    // Shuffle the final array so events from different categories are mixed
    return selectedEvents.sort(() => 0.5 - Math.random());
  };

  // Helper function to extract coordinates from trip data
  const extractCoordinates = (trip) => {
    // Check if we have valid input
    if (!trip) return null;
    
    try {
      // Format 1: Check userSelection location with direct lat/lng properties
      if (trip.userSelection?.location?.lat && trip.userSelection?.location?.lng) {
        return { lat: trip.userSelection.location.lat, lng: trip.userSelection.location.lng };
      }
      
      // Format 2: Check for coordinates in a coordinates property
      if (trip.userSelection?.location?.coordinates?.lat && trip.userSelection?.location?.coordinates?.lng) {
        return { lat: trip.userSelection.location.coordinates.lat, lng: trip.userSelection.location.coordinates.lng };
      }
  
      // Format 3: Check if there's a geometry property (Google Places format)
      if (trip.userSelection?.location?.geometry?.location) {
        const { lat, lng } = trip.userSelection.location.geometry.location;
        return { lat: typeof lat === 'function' ? lat() : lat, lng: typeof lng === 'function' ? lng() : lng };
      }
      
      // Format 4: Check for hotels with geoCoordinates as string (e.g., "40.7501,-73.9777")
      if (trip.tripData?.hotels && trip.tripData.hotels.length > 0) {
        for (const hotel of trip.tripData.hotels) {
          if (hotel.geoCoordinates) {
            const [lat, lng] = hotel.geoCoordinates.split(',').map(coord => parseFloat(coord.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
              console.log(`Using hotel coordinates: ${lat}, ${lng}`);
              return { lat, lng };
            }
          }
        }
      }
      
      // Format 5: Check for generatedItinerary location
      if (trip.generatedItinerary?.location) {
        const itinLocation = trip.generatedItinerary.location;
        if (itinLocation.coordinates || (itinLocation.lat && itinLocation.lng)) {
          return itinLocation.coordinates || { lat: itinLocation.lat, lng: itinLocation.lng };
        }
      }
      
      // Format 6: Check for destination or location string anywhere in the object
      if (trip.destination) {
        // This would require geocoding the location name, so we'll log it for debugging
        console.log(`Found destination name but needs geocoding: ${trip.destination}`);
        // We could call the geocodeLocation function here if needed
      }
      
      // Log the structure for debugging
      console.log("Trip data structure for debugging:", 
        Object.keys(trip).map(key => `${key}: ${typeof trip[key]}`).join(', ')
      );
      
      // No coordinates found
      return null;
    } catch (error) {
      console.error("Error extracting coordinates:", error);
      return null;
    }
  };

  // Get lat/long and dates from trip data
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      
      // Check if trip exists
      if (!trip) {
        setError('Trip information not available');
        setLoading(false);
        return;
      }

      try {
        // Extract coordinates using our helper function
        let coordinates = extractCoordinates(trip);
        let locationSourceInfo = "direct coordinates";
        
        // If no coordinates found but we have a location name, try to geocode it
        if (!coordinates) {
          // First try using the location label we extracted
          let locationName = locationLabel;
          
          // If no label was set, try other sources
          if (!locationName) {
            locationName = 
              (trip.userSelection?.location?.label) || 
              (trip.destination) || 
              (trip.tripData?.destination) ||
              (trip.tripData?.location);
          }
          
          // Final fallback: Try to extract location from trip name
          if (!locationName && trip.name) {
            // Try to extract location name from trip name (e.g., "Weekend in Paris")
            const possibleCities = [
              'New York', 'Paris', 'London', 'Tokyo', 'Rome', 'Barcelona', 'Sydney', 
              'Dubai', 'Singapore', 'Hong Kong', 'Bangkok', 'Amsterdam', 'Berlin', 
              'Madrid', 'Vienna', 'Istanbul', 'Venice', 'Prague', 'San Francisco', 
              'Los Angeles', 'Chicago', 'Miami', 'Las Vegas'
            ];
            
            for (const city of possibleCities) {
              if (trip.name.includes(city)) {
                locationName = city;
                locationSourceInfo = `extracted from trip name: ${trip.name}`;
                break;
              }
            }
          }
          
          if (locationName && typeof locationName === 'string') {
            console.log(`Attempting to geocode location: ${locationName}`);
            try {
              // Use the geocodeLocation service to convert name to coordinates
              coordinates = await geocodeLocation(locationName);
              console.log(`Geocoded coordinates for ${locationName}:`, coordinates);
              if (coordinates) {
                locationSourceInfo = `geocoded from "${locationName}"`;
                
                // Store the location name for display
                if (!locationLabel) {
                  setLocationLabel(locationName);
                }
              }
            } catch (geocodeError) {
              console.error('Error geocoding location:', geocodeError);
            }
          }
        }
        
        if (!coordinates) {
          const tripDataStr = JSON.stringify(trip).substring(0, 500) + '...';
          const debugObj = { 
            tripData: tripDataStr,
            coordinateCheck: 'Failed to extract coordinates',
            checkTime: new Date().toISOString(),
            locationLabel: locationLabel || 'Not found'
          };
          
          // Add extra info for developers
          if (process.env.NODE_ENV === 'development') {
            debugObj.availableKeys = Object.keys(trip);
            if (trip.tripData) {
              debugObj.tripDataKeys = Object.keys(trip.tripData);
            }
            if (trip.userSelection) {
              debugObj.userSelectionKeys = Object.keys(trip.userSelection);
            }
            // Add first few characters of trip name if available
            if (trip.name) {
              debugObj.tripName = trip.name.substring(0, 50);
            }
          }
          
          setError('Location coordinates not available, cannot fetch local events');
          setDebugInfo(debugObj);
          setLoading(false);
          return;
        }
      
        // For MVP, use mock data instead of making actual API calls
        console.log(`Using coordinates (${locationSourceInfo}):`, coordinates);
        
        // Get mock events with location context
        const locationContext = locationLabel || 'your destination';
        const events = getMockLocalEvents(coordinates.lat, coordinates.lng, locationContext);
        setLocalEvents(events);
        
        // When ready to implement actual API call:
        // const response = await fetch(`https://api.example.com/events?lat=${coordinates.lat}&lng=${coordinates.lng}`);
        // const data = await response.json();
        // setLocalEvents(data.events);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching local events:', error);
        setError('Failed to fetch local events');
        setDebugInfo({
          error: error.message,
          stack: error.stack,
          locationLabel: locationLabel,
          timestamp: new Date().toISOString()
        });
        setLoading(false);
      }
    };

    // Only fetch events when we have the trip data
    fetchEvents();
  }, [trip, locationLabel]);

  // Handle opening event details
  const handleViewEventDetails = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Handle closing event details
  const handleCloseEventDetails = () => {
    setIsModalOpen(false);
    // Clear the selected event after the animation completes
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const getRandomPlaceholderImage = (seed) => {
    const placeholders = [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496024840928-4c417adf211d?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=300&auto=format&fit=crop'
    ];
    // Use the seed to get a consistent image for the same event
    const index = Math.abs(hashCode(seed)) % placeholders.length;
    return placeholders[index];
  };
  
  // Simple string hash function
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
      {/* Header styled similar to the hotel recommendations */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 rounded-full p-3">
          <CalendarIcon className="text-blue-600 h-5 w-5" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {locationLabel ? `${locationLabel} Events` : 'Local Events'}
        </h2>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-500">Finding events for your trip...</span>
        </div>
      )}
      
      {/* Error state */}
      {!loading && error && (
        <>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm text-amber-700">
                  {error}
                </p>
                {debugInfo && process.env.NODE_ENV === 'development' && (
                  <details className="mt-2 text-xs text-gray-500">
                    <summary>Technical Details (Development Mode)</summary>
                    <div className="mt-2 p-2 bg-gray-100 rounded whitespace-pre-wrap overflow-x-auto">
                      <h4 className="font-medium mb-1 text-gray-700">Trip Data Debug</h4>
                      <p className="mb-2">This information will help developers fix the issue:</p>
                      <pre className="text-[11px] leading-tight">
                        {JSON.stringify(debugInfo, null, 2)}
                      </pre>
                      <div className="mt-3 bg-amber-100 p-2 rounded text-amber-800">
                        <p className="text-xs font-medium">Potential Fixes:</p>
                        <ul className="list-disc pl-4 mt-1 text-xs">
                          <li>Ensure the trip data includes location information</li>
                          <li>Check if the location coordinates are in the correct format</li>
                          <li>Try reloading the page or creating a new trip</li>
                        </ul>
                      </div>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">
              You can still explore local events by visiting the destination's official tourism website
              or event listings like Eventbrite and Meetup.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => window.open(`https://www.eventbrite.com/d/${trip?.userSelection?.location?.label ? trip.userSelection.location.label.split(',')[0] : trip?.tripData?.destination || 'events'}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                <span>Search on Eventbrite</span>
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open(`https://www.tripadvisor.com/Attractions`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                <span>Browse TripAdvisor</span>
              </Button>
            </div>
            
            {/* Manually enter location option */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 border-t pt-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Developer Tools</h3>
                <p className="text-xs text-gray-500 mb-4">
                  This section is only visible in development mode and allows testing events with manual coordinates.
                </p>
                <Button
                  className="w-full"
                  onClick={() => {
                    // Example coordinates for New York City
                    const mockedEvents = getMockLocalEvents(40.7128, -74.0060);
                    setLocalEvents(mockedEvents);
                    setError(null);
                  }}
                >
                  Load Mock Events for New York
                </Button>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* No events found */}
      {!loading && !error && localEvents.length === 0 && (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-gray-500">We couldn't find any local events for your destination during your trip dates.</p>
          
          <Button 
            variant="outline" 
            className="mt-4 mx-auto"
            onClick={() => window.open(`https://www.eventbrite.com/d/${trip?.userSelection?.location?.label ? trip.userSelection.location.label.split(',')[0] : trip?.tripData?.destination || 'events'}`, '_blank')}
          >
            Search Events on Eventbrite
          </Button>
        </div>
      )}
      
      {/* Display events in a card format similar to hotel recommendations */}
      {!loading && !error && localEvents.length > 0 && (
        <div>
          {/* All events, without category grouping */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                onClick={() => handleViewEventDetails(event)}
              >
                {/* Event Image */}
                <div className="relative h-48 bg-gray-100">
                  <img 
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = getRandomPlaceholderImage(event.name);
                    }}
                  />
                </div>
                
                {/* Event Details */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{event.name}</h3>
                  
                  {/* Location with icon */}
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                  
                  {/* Date/Time with icon */}
                  <div className="flex items-start gap-2 mb-3">
                    <Clock className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{event.date}</p>
                      <p className="text-sm text-gray-600">{event.time}</p>
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">
                      {event.category}
                    </span>
                    
                    {/* Rating stars - randomly generated for mock */}
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm font-medium text-gray-600">
                        {(Math.floor(Math.random() * 10) + 35) / 10}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Event Details Modal */}
      <EventDetailsModal 
        event={selectedEvent} 
        isOpen={isModalOpen} 
        onClose={handleCloseEventDetails} 
      />
    </div>
  );
};

export default LocalEvents; 