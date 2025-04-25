import React, { useState, useEffect, useRef, useMemo } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, Source, Layer, GeolocateControl } from 'react-map-gl';
import { useCallback } from 'react';
import useSupercluster from 'use-supercluster';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HiOutlineHome, HiOutlineLocationMarker, HiViewList, HiMap } from "react-icons/hi";
import { extractCoordinates, calculateCenter, calculateBounds } from '@/utils/geoUtils';
import { BiRestaurant } from "react-icons/bi";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdLocalHospital, 
  MdCurrencyExchange, 
  MdLocalAtm, 
  MdLocalDining,
  MdPlace
} from "react-icons/md";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Define color palette for different days (using more distinct colors)
const dayColors = [
  '#FF5252', // red
  '#FF9800', // orange
  '#FFEB3B', // yellow
  '#4CAF50', // green
  '#2196F3', // blue
  '#673AB7', // purple
  '#F06292', // pink
  '#009688', // teal
  '#795548', // brown
  '#607D8B', // blue-grey
  '#E91E63', // bright pink
  '#00BCD4', // cyan
  '#FFC107', // amber
  '#8BC34A', // light green
  '#3F51B5', // indigo
];

// Define category colors
const categoryColors = {
  hotel: '#2196F3', // blue
  place: '#4CAF50', // green
  food: '#FF5252',   // red
  hospital: '#673AB7', // purple
  atm: '#FFC107', // amber
  exchange: '#009688', // teal
  restaurant: '#FF9800', // orange
};

// Define nearby essentials types with Google Places API types
const essentialTypes = [
  { id: 'hospital', label: 'Hospitals', icon: MdLocalHospital, googleType: 'hospital' },
  { id: 'atm', label: 'ATMs', icon: MdLocalAtm, googleType: 'atm' },
  { id: 'exchange', label: 'Currency Exchange', icon: MdCurrencyExchange, googleType: 'currency_exchange' },
  { id: 'restaurant', label: 'Places to Eat', icon: MdLocalDining, googleType: 'restaurant' },
];

/**
 * Generates sample coordinates around a center point for testing when real coordinates are missing
 * This is only used for demonstration purposes when places don't have real coordinates
 */
const generateSampleCoordinates = (centerLat, centerLng, day, index) => {
  // Create a spiral pattern outward from the center
  const angle = (index * 0.5) + (day * 0.8);
  const radius = 0.01 + (0.005 * index) + (0.01 * day); // Gradually increasing radius
  
  const lat = centerLat + (radius * Math.cos(angle));
  const lng = centerLng + (radius * Math.sin(angle));
  
  return { lat, lng };
};

// Create a reusable marker component with category-specific styling
const MapMarker = ({ item, onClick, color, category }) => {
  const markerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    hover: { 
      scale: 1.2,
      transition: { duration: 0.2 }
    }
  };

  const getIcon = () => {
    switch(category) {
      case 'hotel': 
        return <HiOutlineHome className="w-3 h-3 text-white" />;
      case 'food': 
        return <BiRestaurant className="w-3 h-3 text-white" />;
      case 'hospital':
        return <MdLocalHospital className="w-3 h-3 text-white" />;
      case 'atm':
        return <MdLocalAtm className="w-3 h-3 text-white" />;
      case 'exchange':
        return <MdCurrencyExchange className="w-3 h-3 text-white" />;
      case 'restaurant':
        return <MdLocalDining className="w-3 h-3 text-white" />;
      default: 
        return <HiOutlineLocationMarker className="w-3 h-3 text-white" />;
    }
  };

  const getCategoryColor = () => {
    return categoryColors[category] || color;
  };

  return (
    <motion.div 
      onClick={onClick} 
      className="cursor-pointer"
      variants={markerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div 
        className={`
          w-6 h-6 rounded-full flex items-center justify-center text-white 
          transform transition shadow-md
          ${category === 'hotel' ? 'border-2 border-white' : ''}
        `} 
        style={{ 
          backgroundColor: getCategoryColor(),
          zIndex: category === 'hotel' ? 3 : (category === 'food' ? 2 : 1)
        }}
      >
        {getIcon()}
      </div>
    </motion.div>
  );
};

// Create a cluster marker
const ClusterMarker = ({ pointCount, onClick }) => {
  const size = Math.min(30, 20 + (pointCount / 100) * 20);
  
  const clusterVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      }
    },
    hover: { 
      scale: 1.1,
      boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <motion.div 
      className="flex items-center justify-center rounded-full bg-blue-500 text-white font-bold cursor-pointer shadow-md border-2 border-white"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        zIndex: 4 
      }}
      onClick={onClick}
      variants={clusterVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {pointCount}
    </motion.div>
  );
};

export default function TripMap({ trip }) {
  // State hooks
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 2
  });
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(3);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [visibleDays, setVisibleDays] = useState({});
  const [showHotels, setShowHotels] = useState(true);
  const [showPlaces, setShowPlaces] = useState(true);
  const [showFood, setShowFood] = useState(true);
  const [activeDayFilter, setActiveDayFilter] = useState(null);
  const [showEssentials, setShowEssentials] = useState(false);
  const [essentialsType, setEssentialsType] = useState(null);
  const [nearbyEssentials, setNearbyEssentials] = useState([]);
  const [isLoadingEssentials, setIsLoadingEssentials] = useState(false);
  const mapRef = useRef();

  // Extract and prepare location data from trip
  useEffect(() => {
    if (!trip || !trip.tripData) return;
    
    const allLocations = [];
    const daysSet = new Set();
    
    // Extract hotels
    if (trip.tripData.hotels && Array.isArray(trip.tripData.hotels)) {
      trip.tripData.hotels.forEach((hotel, index) => {
        // Extract coordinates using the utility function
        const coords = extractCoordinates(hotel);
        
        if (coords) {
          allLocations.push({
            id: `hotel-${index}`,
            latitude: coords.lat,
            longitude: coords.lng,
            name: hotel.hotelName,
            address: hotel.hotelAddress,
            type: 'hotel',
            day: index + 1, // Assuming one hotel per day
            price: hotel.price,
            rating: hotel.rating,
            image: hotel.image || null
          });
          
          daysSet.add(index + 1);
        }
      });
    }
    
    // Extract itinerary places
    if (trip.tripData.itinerary && Array.isArray(trip.tripData.itinerary)) {
      trip.tripData.itinerary.forEach((dayItem, dayIndex) => {
        const day = dayIndex + 1;
        daysSet.add(day);
        
        if (dayItem.plan && Array.isArray(dayItem.plan)) {
          dayItem.plan.forEach((place, placeIndex) => {
            // Extract coordinates using the utility function
            const coords = extractCoordinates(place);
            
            if (coords) {
              allLocations.push({
                id: `place-${day}-${placeIndex}`,
                latitude: coords.lat,
                longitude: coords.lng,
                name: place.placeName,
                details: place.placeDetails,
                type: 'place',
                day: day,
                time: place.time,
                ticketPricing: place.ticketPricing,
                image: place.image || null
              });
            }
          });
        }
      });
    }
    
    // Extract food places
    if (trip.tripData.foodPlaces && Array.isArray(trip.tripData.foodPlaces)) {
      trip.tripData.foodPlaces.forEach((food, foodIndex) => {
        // Get day from food item or default to 1
        const day = food.day || 1;
        daysSet.add(day);
        
        // Extract coordinates using the utility function
        const coords = extractCoordinates(food);
        
        if (coords) {
          allLocations.push({
            id: `food-${day}-${foodIndex}`,
            latitude: coords.lat,
            longitude: coords.lng,
            name: food.restaurantName || food.name,
            details: food.description || food.details,
            type: 'food',
            day: day,
            time: food.time,
            price: food.priceRange || food.price,
            cuisine: food.cuisine,
            image: food.image || null
          });
        }
      });
    }
    
    // If we don't have any coordinates, generate sample coordinates for demonstration
    if (allLocations.length === 0 && trip.userSelection?.location?.label) {
      // Try to extract user selection coordinates as a center point
      let centerLat = 40.7128; // Default to New York if nothing else available
      let centerLng = -74.0060;
      
      const userLocationCoords = extractCoordinates(trip.userSelection.location);
      if (userLocationCoords) {
        centerLat = userLocationCoords.lat;
        centerLng = userLocationCoords.lng;
      }
      
      // Generate sample hotels
      const dayCount = trip.userSelection.noOfDays || 3;
      for (let day = 1; day <= dayCount; day++) {
        const coords = generateSampleCoordinates(centerLat, centerLng, day, 0);
        
        allLocations.push({
          id: `sample-hotel-${day}`,
          latitude: coords.lat,
          longitude: coords.lng,
          name: `Hotel for Day ${day}`,
          address: `Sample Address ${day}`,
          type: 'hotel',
          day: day,
          price: '$150',
          rating: '4.5'
        });
        
        daysSet.add(day);
        
        // Generate sample places for each day
        for (let i = 1; i <= 3; i++) {
          const placeCoords = generateSampleCoordinates(centerLat, centerLng, day, i);
          
          allLocations.push({
            id: `sample-place-${day}-${i}`,
            latitude: placeCoords.lat,
            longitude: placeCoords.lng,
            name: `Sample Place ${i} on Day ${day}`,
            details: 'This is a sample place for demonstration',
            type: 'place',
            day: day,
            time: `${10 + i}:00`,
            ticketPricing: i % 2 === 0 ? 'Free' : '$20'
          });
        }
        
        // Generate sample food places for each day
        for (let i = 1; i <= 2; i++) {
          const foodCoords = generateSampleCoordinates(centerLat, centerLng, day, i + 3);
          
          allLocations.push({
            id: `sample-food-${day}-${i}`,
            latitude: foodCoords.lat,
            longitude: foodCoords.lng,
            name: `Restaurant ${i} on Day ${day}`,
            details: 'Delicious food for your trip',
            type: 'food',
            day: day,
            time: `${12 + i}:00`,
            price: i % 2 === 0 ? '$$ · Moderate' : '$$$ · Expensive',
            cuisine: i % 2 === 0 ? 'Italian' : 'Local Cuisine'
          });
        }
      }
    }
    
    // Set initial visible days
    const initialVisibleDays = {};
    daysSet.forEach(day => {
      initialVisibleDays[day] = true;
    });
    
    setVisibleDays(initialVisibleDays);
    setLocations(allLocations);
    
    // Set initial map center
    if (allLocations.length > 0) {
      // Calculate center and appropriate zoom level
      const center = calculateCenter(allLocations);
      
      if (center) {
        setViewport({
          latitude: center.lat,
          longitude: center.lng,
          zoom: 10
        });
      }
    }
  }, [trip]);

  // Update bounds when map moves
  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    
    const bounds = mapRef.current.getMap().getBounds().toArray().flat();
    setBounds(bounds);
  }, []);

  // Fetch nearby essentials when essentialsType changes
  useEffect(() => {
    const fetchNearbyEssentials = async () => {
      if (!essentialsType || !showEssentials || !mapRef.current) return;
      
      setIsLoadingEssentials(true);
      setNearbyEssentials([]); // Clear previous results
      console.log("Fetching nearby essentials for:", essentialsType);

      try {
        // Get current center coordinates
        const map = mapRef.current.getMap();
        const center = map.getCenter();
        console.log("Map center:", center);
        
        // Find the matching essential type config
        const essentialConfig = essentialTypes.find(t => t.id === essentialsType);
        if (!essentialConfig) return;

        // Use Google Places API instead of Mapbox
        const googleApiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
        const location = `${center.lat},${center.lng}`;
        const radius = 5000; // 5km radius
        const type = essentialConfig.googleType;
        
        // Google Places Nearby Search API
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Use a CORS proxy if needed
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${googleApiKey}`;
        
        console.log("Calling Google Places API for:", type);
        
        // Using fetch with the proxy to avoid CORS issues
        const response = await fetch(placesUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // Add any other necessary headers for the proxy
          }
        });
        
        if (!response.ok) {
          throw new Error(`Google Places API returned ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Google Places API response:", data);
        
        // Process and save the results
        if (data.results && data.results.length > 0) {
          const essentials = data.results.slice(0, 5).map((place, index) => {
            return {
              id: `${essentialsType}-${place.place_id || index}`,
              name: place.name,
              details: place.vicinity || 'No address available',
              type: essentialsType,
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
              rating: place.rating,
              totalRatings: place.user_ratings_total,
              priceLevel: place.price_level,
              openNow: place.opening_hours?.open_now,
              photoReference: place.photos?.[0]?.photo_reference,
              day: 0 // Essential POIs don't have day
            };
          });
          
          console.log("Processed essentials from Google Places:", essentials);
          setNearbyEssentials(essentials);
        } else {
          console.log("No results found in Google Places API, falling back to sample data");
          generateSampleEssentialsWithBetterData();
        }
      } catch (error) {
        console.error("Error fetching from Google Places API:", error);
        // Fallback to more realistic sample data
        generateSampleEssentialsWithBetterData();
      } finally {
        setIsLoadingEssentials(false);
      }
    };
    
    const generateSampleEssentialsWithBetterData = () => {
      if (!mapRef.current) return;
      
      const map = mapRef.current.getMap();
      const center = map.getCenter();
      const essentials = [];
      
      console.log("Generating more realistic sample essentials around:", center);
      
      // More realistic data for each type
      const sampleData = {
        hospital: [
          { name: "Central Hospital", details: "Full-service medical center • Open 24hrs", rating: 4.3 },
          { name: "Mercy Medical Center", details: "ER and specialty care • 2.3mi", rating: 4.5 },
          { name: "St. Luke's Hospital", details: "Cardiology specialists • 1.8mi", rating: 4.2 },
          { name: "Family Health Clinic", details: "Primary care • Open until 8PM", rating: 4.0 },
          { name: "Children's Healthcare", details: "Pediatric specialists • 2.5mi", rating: 4.7 }
        ],
        atm: [
          { name: "Chase ATM", details: "24/7 access • No fee for members", rating: 4.1 },
          { name: "Bank of America ATM", details: "In-store location • Open till 10PM", rating: 3.9 },
          { name: "Wells Fargo ATM", details: "Drive-thru available • 0.7mi", rating: 4.0 },
          { name: "Citibank ATM", details: "Inside mall • Multiple currencies", rating: 4.2 },
          { name: "TD Bank ATM", details: "Accessible 24/7 • No surcharge", rating: 4.0 }
        ],
        exchange: [
          { name: "Global Currency Exchange", details: "Best rates • 15 currencies", rating: 4.4 },
          { name: "Travel Money Express", details: "No commission • Open till 7PM", rating: 4.2 },
          { name: "Foreign Exchange Center", details: "Competitive rates • Same day", rating: 4.1 },
          { name: "International Money Transfer", details: "Multiple services • 1.2mi", rating: 3.9 },
          { name: "Airport Currency Services", details: "Located in terminal • All major currencies", rating: 3.8 }
        ],
        restaurant: [
          { name: "The Garden Table", details: "Vegetarian & Vegan • $$ • 4.6 ★", rating: 4.6 },
          { name: "Sakura Japanese Grill", details: "Sushi & Hibachi • $$$ • 4.3 ★", rating: 4.3 },
          { name: "Trattoria Milano", details: "Authentic Italian • $$ • 4.7 ★", rating: 4.7 },
          { name: "Spice Route Indian Cuisine", details: "North & South Indian • $$ • 4.4 ★", rating: 4.4 },
          { name: "El Mariachi Taqueria", details: "Mexican Street Food • $ • 4.5 ★", rating: 4.5 }
        ]
      };
      
      const samples = sampleData[essentialsType] || [];
      
      // Generate 5 sample points with better data
      for (let i = 0; i < samples.length; i++) {
        // Create a point at a slight offset from the center
        const offsetLat = center.lat + (Math.random() - 0.5) * 0.02;
        const offsetLng = center.lng + (Math.random() - 0.5) * 0.02;
        
        essentials.push({
          id: `sample-${essentialsType}-${i}`,
          name: samples[i].name,
          details: samples[i].details,
          type: essentialsType,
          latitude: offsetLat,
          longitude: offsetLng,
          rating: samples[i].rating,
          day: 0
        });
      }
      
      console.log("Generated realistic sample essentials:", essentials);
      setNearbyEssentials(essentials);
    };
    
    fetchNearbyEssentials();
  }, [essentialsType, showEssentials]);

  // Toggle essentials display
  const toggleEssentials = (type) => {
    console.log("Toggling essentials:", type, "Current state:", essentialsType, showEssentials);
    
    if (essentialsType === type && showEssentials) {
      setShowEssentials(false);
      setEssentialsType(null);
    } else {
      setShowEssentials(true);
      setEssentialsType(type);
    }
  };

  // When showing essentials, add a "Refresh" button to fetch again if needed
  const refreshEssentials = () => {
    if (essentialsType && showEssentials) {
      // Re-trigger the effect by toggling the state
      const currentType = essentialsType;
      setEssentialsType(null);
      setTimeout(() => setEssentialsType(currentType), 100);
    }
  };

  // Filter visible locations based on filters
  const filteredLocations = useMemo(() => {
    let filtered = locations.filter(location => {
      // Filter by type
      if (location.type === 'hotel' && !showHotels) return false;
      if (location.type === 'place' && !showPlaces) return false;
      if (location.type === 'food' && !showFood) return false;
      
      // Filter by day
      if (activeDayFilter !== null && location.day !== activeDayFilter) return false;
      
      return visibleDays[location.day] === true;
    });
    
    // Add nearby essentials if they're being shown
    if (showEssentials && essentialsType) {
      filtered = [...filtered, ...nearbyEssentials];
    }
    
    return filtered;
  }, [locations, visibleDays, showHotels, showPlaces, showFood, activeDayFilter, nearbyEssentials, showEssentials, essentialsType]);

  // Prepare points for clustering
  const points = useMemo(() => {
    // Log the filtered locations for debugging
    console.log("Filtered locations:", filteredLocations);
    console.log("Nearby essentials:", nearbyEssentials);
    
    return filteredLocations.map(location => ({
      type: 'Feature',
      properties: {
        cluster: false,
        locationId: location.id,
        category: location.type,
        day: location.day,
        name: location.name
      },
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)]
      }
    }));
  }, [filteredLocations]);

  // Get clusters using the useSupercluster hook
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  // Handle day visibility toggle
  const toggleDayVisibility = (day) => {
    setVisibleDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  // Toggle showing/hiding all days
  const toggleAllDays = (value) => {
    const days = { ...visibleDays };
    Object.keys(days).forEach(day => {
      days[day] = value;
    });
    setVisibleDays(days);
    setActiveDayFilter(null);
  };

  // Filter by specific day
  const filterByDay = (day) => {
    // If already filtered by this day, remove filter
    if (activeDayFilter === day) {
      setActiveDayFilter(null);
      return;
    }
    
    setActiveDayFilter(day);
    
    // Find locations for this day to center the map
    const dayLocations = locations.filter(loc => loc.day === day);
    if (dayLocations.length > 0) {
      const center = calculateCenter(dayLocations);
      if (center && mapRef.current) {
        mapRef.current.getMap().flyTo({
          center: [center.lng, center.lat],
          zoom: 13,
          duration: 1000
        });
      }
    }
  };

  // Handle cluster click for zooming
  const handleClusterClick = (clusterId, longitude, latitude) => {
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(clusterId),
      20
    );

    mapRef.current.getMap().easeTo({
      center: [longitude, latitude],
      zoom: expansionZoom,
      duration: 500
    });
  };

  // Get all days in the itinerary
  const days = [...new Set(locations.map(loc => loc.day))].sort((a, b) => a - b);

  // When a new location is selected, animate to it
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.getMap().flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 15,
        duration: 1000
      });
    }
  }, [selectedLocation]);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-2xl">Trip Map</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Checkbox 
                id="show-hotels" 
                checked={showHotels}
                onCheckedChange={setShowHotels}
              />
              <label htmlFor="show-hotels" className="cursor-pointer ml-1 flex items-center gap-1">
                <HiOutlineHome className="h-4 w-4" /> Hotels
              </label>
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <Checkbox 
                id="show-places" 
                checked={showPlaces}
                onCheckedChange={setShowPlaces}
              />
              <label htmlFor="show-places" className="cursor-pointer ml-1 flex items-center gap-1">
                <HiOutlineLocationMarker className="h-4 w-4" /> Attractions
              </label>
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <Checkbox 
                id="show-food" 
                checked={showFood}
                onCheckedChange={setShowFood}
              />
              <label htmlFor="show-food" className="cursor-pointer ml-1 flex items-center gap-1">
                <BiRestaurant className="h-4 w-4" /> Food
              </label>
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <Checkbox 
                id="show-all-days" 
                checked={activeDayFilter === null && Object.values(visibleDays).every(v => v === true)}
                onCheckedChange={(checked) => toggleAllDays(checked)}
              />
              <label htmlFor="show-all-days" className="cursor-pointer ml-1">All Days</label>
            </Badge>
          </div>
        </div>
        
        <CardDescription>Interactive visualization of your journey</CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-4 pb-2 overflow-x-auto scrollbar-thin">
          {days.map((day) => (
            <Badge 
              key={day}
              variant={activeDayFilter === day ? "default" : (visibleDays[day] ? "secondary" : "outline")} 
              className="cursor-pointer transition-all"
              style={{ 
                backgroundColor: activeDayFilter === day ? dayColors[(day - 1) % dayColors.length] : undefined,
                opacity: activeDayFilter !== null && activeDayFilter !== day ? 0.5 : 1
              }}
              onClick={() => filterByDay(day)}
            >
              Day {day}
            </Badge>
          ))}
        </div>
        
        {/* Nearby Essentials Section */}
        <div className="flex flex-wrap items-center gap-2 mt-4 border-t pt-4">
          <div className="font-medium text-sm mr-2">Nearby Essentials:</div>
          
          {essentialTypes.map(type => (
            <Badge
              key={type.id}
              variant={essentialsType === type.id && showEssentials ? "default" : "outline"}
              className="cursor-pointer transition-all flex items-center gap-1"
              style={{
                backgroundColor: essentialsType === type.id && showEssentials ? categoryColors[type.id] : undefined,
                color: essentialsType === type.id && showEssentials ? 'white' : undefined
              }}
              onClick={() => toggleEssentials(type.id)}
            >
              <type.icon className="h-3.5 w-3.5" />
              <span>{type.label}</span>
              {isLoadingEssentials && essentialsType === type.id && (
                <span className="ml-1 animate-spin">⟳</span>
              )}
            </Badge>
          ))}
          
          {showEssentials && (
            <button 
              className="ml-2 text-sm text-blue-500 hover:text-blue-700"
              onClick={refreshEssentials}
            >
              Refresh
            </button>
          )}
          
          {showEssentials && nearbyEssentials.length > 0 && (
            <div className="w-full mt-2 text-xs text-gray-500">
              Showing {nearbyEssentials.length} nearby {essentialTypes.find(t => t.id === essentialsType)?.label.toLowerCase()}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 mt-4">
        <Tabs defaultValue="map">
          <TabsList className="w-full">
            <TabsTrigger value="map" className="flex-1"><HiMap className="mr-2" /> Map View</TabsTrigger>
            <TabsTrigger value="list" className="flex-1"><HiViewList className="mr-2" /> List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="m-0">
            <div style={{ height: '500px', position: 'relative' }}>
              <Map
                ref={mapRef}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                initialViewState={viewport}
                mapStyle="mapbox://styles/dikondaashish/cm9of3svt00jo01s60rp69xq1"
                onLoad={onMapLoad}
                onMoveEnd={(evt) => {
                  setZoom(evt.viewState.zoom);
                  setBounds(mapRef.current.getMap().getBounds().toArray().flat());
                }}
              >
                {/* Render clusters and points */}
                <AnimatePresence>
                  {clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const { cluster: isCluster, point_count: pointCount } = cluster.properties;

                    // Handle clusters
                    if (isCluster) {
                      return (
                        <Marker 
                          key={`cluster-${cluster.id}`} 
                          longitude={longitude} 
                          latitude={latitude}
                        >
                          <ClusterMarker 
                            pointCount={pointCount} 
                            onClick={() => handleClusterClick(cluster.id, longitude, latitude)}
                          />
                        </Marker>
                      );
                    }

                    // Find original location to display
                    const locationId = cluster.properties.locationId;
                    const location = filteredLocations.find(loc => loc.id === locationId);
                    if (!location) return null;
                    
                    const dayIndex = (location.day - 1) % dayColors.length;
                    const color = dayColors[dayIndex >= 0 ? dayIndex : 0];

                    // Individual locations
                    return (
                      <Marker
                        key={location.id}
                        longitude={location.longitude}
                        latitude={location.latitude}
                      >
                        <MapMarker 
                          item={location}
                          onClick={() => setSelectedLocation(location)}
                          color={color}
                          category={location.type}
                        />
                      </Marker>
                    );
                  })}
                </AnimatePresence>

                {/* Manually render nearby essentials as markers without clustering */}
                {showEssentials && nearbyEssentials.length > 0 && (
                  <AnimatePresence>
                    {nearbyEssentials.map(location => (
                      <Marker
                        key={location.id}
                        longitude={parseFloat(location.longitude)}
                        latitude={parseFloat(location.latitude)}
                      >
                        <MapMarker 
                          item={location}
                          onClick={() => setSelectedLocation(location)}
                          color={categoryColors[location.type]}
                          category={location.type}
                        />
                      </Marker>
                    ))}
                  </AnimatePresence>
                )}

                {/* Popup for selected location */}
                <AnimatePresence>
                  {selectedLocation && (
                    <Popup
                      longitude={selectedLocation.longitude}
                      latitude={selectedLocation.latitude}
                      anchor="bottom"
                      closeOnClick={false}
                      onClose={() => setSelectedLocation(null)}
                      className="z-50 rounded-lg overflow-hidden shadow-lg max-w-xs"
                      maxWidth="300px"
                    >
                      <motion.div 
                        className="p-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {selectedLocation.image && (
                          <div className="mb-2 overflow-hidden rounded-md h-32">
                            <img 
                              src={selectedLocation.image} 
                              alt={selectedLocation.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <h3 className="font-bold text-sm">{selectedLocation.name}</h3>
                        
                        <div className="text-xs mt-1">
                          <div className="flex items-center gap-1 flex-wrap mt-1 mb-2">
                            {selectedLocation.day > 0 && (
                              <Badge 
                                variant="outline" 
                                style={{ 
                                  backgroundColor: dayColors[(selectedLocation.day - 1) % dayColors.length],
                                  color: 'white',
                                  fontWeight: 'bold'
                                }}
                              >
                                Day {selectedLocation.day}
                              </Badge>
                            )}
                            
                            <Badge 
                              variant="outline"
                              style={{
                                backgroundColor: categoryColors[selectedLocation.type] || '#666',
                                color: 'white'
                              }}
                            >
                              {selectedLocation.type === 'hotel' ? 'Hotel' : 
                               selectedLocation.type === 'food' ? 'Restaurant' :
                               selectedLocation.type === 'hospital' ? 'Hospital' :
                               selectedLocation.type === 'atm' ? 'ATM' :
                               selectedLocation.type === 'exchange' ? 'Currency Exchange' :
                               selectedLocation.type === 'restaurant' ? 'Restaurant' :
                               'Attraction'}
                            </Badge>
                          </div>
                          
                          {selectedLocation.type === 'place' && (
                            <>
                              {selectedLocation.time && <p className="mt-1">⏰ {selectedLocation.time}</p>}
                              {selectedLocation.details && 
                                <p className="mt-1 text-gray-600">{selectedLocation.details}</p>
                              }
                              {selectedLocation.ticketPricing && 
                                <p className="mt-1">🎫 {selectedLocation.ticketPricing}</p>
                              }
                            </>
                          )}
                          
                          {selectedLocation.type === 'hotel' && (
                            <>
                              {selectedLocation.address && 
                                <p className="mt-1">📍 {selectedLocation.address}</p>
                              }
                              {selectedLocation.price && <p className="mt-1">💰 {selectedLocation.price}</p>}
                              {selectedLocation.rating && <p className="mt-1">⭐ {selectedLocation.rating}</p>}
                            </>
                          )}
                          
                          {selectedLocation.type === 'food' && (
                            <>
                              {selectedLocation.time && <p className="mt-1">⏰ {selectedLocation.time}</p>}
                              {selectedLocation.details && 
                                <p className="mt-1 text-gray-600">{selectedLocation.details}</p>
                              }
                              {selectedLocation.price && <p className="mt-1">💰 {selectedLocation.price}</p>}
                              {selectedLocation.cuisine && <p className="mt-1">🍴 {selectedLocation.cuisine}</p>}
                            </>
                          )}
                          
                          {/* Display for nearby essentials */}
                          {(selectedLocation.type === 'hospital' || 
                            selectedLocation.type === 'atm' || 
                            selectedLocation.type === 'exchange' || 
                            selectedLocation.type === 'restaurant') && (
                            <>
                              {selectedLocation.details && 
                                <p className="mt-1 text-gray-600">{selectedLocation.details}</p>
                              }
                              {selectedLocation.rating && 
                                <p className="mt-1">⭐ {selectedLocation.rating} {selectedLocation.totalRatings ? `(${selectedLocation.totalRatings})` : ''}</p>
                              }
                              {selectedLocation.openNow !== undefined && 
                                <p className="mt-1">{selectedLocation.openNow ? '✅ Open now' : '❌ Closed'}</p>
                              }
                              <p className="mt-2 text-xs">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-xs p-1 h-auto"
                                  onClick={() => {
                                    // Open in Google Maps
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${selectedLocation.latitude},${selectedLocation.longitude}&query_place_id=${selectedLocation.id.includes('sample') ? null : selectedLocation.id.split('-')[1]}`, '_blank');
                                  }}
                                >
                                  Open in Google Maps
                                </Button>
                              </p>
                            </>
                          )}
                        </div>
                      </motion.div>
                    </Popup>
                  )}
                </AnimatePresence>
                
                {/* Map controls */}
                <NavigationControl position="top-right" />
                <FullscreenControl position="top-right" />
                <GeolocateControl position="top-right" />
              </Map>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="m-0 max-h-[500px] overflow-y-auto">
            <div className="p-4">
              {/* Nearby Essentials List */}
              {showEssentials && nearbyEssentials.length > 0 && (
                <div className="mb-6">
                  <h3 
                    className="text-lg font-bold mb-2 pb-1 border-b flex items-center justify-between"
                    style={{ borderColor: categoryColors[essentialsType] }}
                  >
                    <div className="flex items-center">
                      <span 
                        className="flex w-6 h-6 rounded-full mr-2 text-white text-sm items-center justify-center"
                        style={{ backgroundColor: categoryColors[essentialsType] }}
                      >
                        <MdPlace />
                      </span>
                      Nearby {essentialTypes.find(t => t.id === essentialsType)?.label}
                    </div>
                  </h3>

                  <div className="space-y-3 pl-4">
                    {nearbyEssentials.map(item => (
                      <motion.div 
                        key={item.id} 
                        className="flex items-start p-2 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setSelectedLocation(item);
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="bg-white p-1 rounded-full mr-2 shadow-sm">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: categoryColors[item.type] }}
                          >
                            {item.type === 'hospital' && <MdLocalHospital className="text-white w-3 h-3" />}
                            {item.type === 'atm' && <MdLocalAtm className="text-white w-3 h-3" />}
                            {item.type === 'exchange' && <MdCurrencyExchange className="text-white w-3 h-3" />}
                            {item.type === 'restaurant' && <MdLocalDining className="text-white w-3 h-3" />}
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.details && <p className="text-sm text-gray-500">{item.details}</p>}
                          {item.rating && <p className="text-xs mt-1">⭐ {item.rating}</p>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Trip Days */}
              {days.map(day => {
                if (activeDayFilter !== null && activeDayFilter !== day) return null;
                if (!visibleDays[day]) return null;
                
                const dayLocations = filteredLocations.filter(loc => loc.day === day);
                const color = dayColors[(day - 1) % dayColors.length];
                
                return (
                  <div key={`day-${day}`} className="mb-6">
                    <h3 
                      className="text-lg font-bold mb-2 pb-1 border-b flex items-center justify-between"
                      style={{ borderColor: color }}
                    >
                      <div className="flex items-center">
                        <span 
                          className="flex w-6 h-6 rounded-full mr-2 text-white text-sm items-center justify-center"
                          style={{ backgroundColor: color }}
                        >
                          {day}
                        </span>
                        Day {day}
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer"
                        onClick={() => filterByDay(day)}
                      >
                        {activeDayFilter === day ? "Show All Days" : "Focus Day"}
                      </Badge>
                    </h3>
                    
                    <div className="space-y-3 pl-4">
                      {/* Hotels for this day */}
                      {showHotels && dayLocations
                        .filter(loc => loc.type === 'hotel')
                        .map(hotel => (
                          <motion.div 
                            key={hotel.id} 
                            className="flex items-start p-2 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedLocation(hotel);
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="bg-white p-1 rounded-full mr-2 shadow-sm">
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: categoryColors.hotel }}
                              >
                                <HiOutlineHome className="text-white w-3 h-3" />
                              </div>
                            </div>
                            
                            <div className="flex-grow">
                              <h4 className="font-medium">{hotel.name}</h4>
                              {hotel.address && <p className="text-sm text-gray-500">{hotel.address}</p>}
                              <div className="flex text-sm mt-1 gap-2">
                                {hotel.price && <span>{hotel.price}</span>}
                                {hotel.rating && <span>⭐ {hotel.rating}</span>}
                              </div>
                            </div>
                            
                            {hotel.image && (
                              <div className="w-16 h-16 rounded-md overflow-hidden ml-2 flex-shrink-0">
                                <img 
                                  src={hotel.image} 
                                  alt={hotel.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                    
                      {/* Places for this day */}
                      {showPlaces && dayLocations
                        .filter(loc => loc.type === 'place')
                        .sort((a, b) => {
                          // Sort by time if available
                          if (a.time && b.time) {
                            return a.time.localeCompare(b.time);
                          }
                          return 0;
                        })
                        .map(place => (
                          <motion.div 
                            key={place.id} 
                            className="flex items-start p-2 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedLocation(place);
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="bg-white p-1 rounded-full mr-2 shadow-sm">
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: categoryColors.place }}
                              >
                                <HiOutlineLocationMarker className="text-white w-3 h-3" />
                              </div>
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{place.name}</h4>
                                {place.time && <span className="text-xs text-orange-600">{place.time}</span>}
                              </div>
                              {place.details && <p className="text-sm text-gray-500">{place.details}</p>}
                              {place.ticketPricing && <p className="text-sm mt-1">🎫 {place.ticketPricing}</p>}
                            </div>
                            
                            {place.image && (
                              <div className="w-16 h-16 rounded-md overflow-hidden ml-2 flex-shrink-0">
                                <img 
                                  src={place.image} 
                                  alt={place.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      
                      {/* Food places for this day */}
                      {showFood && dayLocations
                        .filter(loc => loc.type === 'food')
                        .sort((a, b) => {
                          // Sort by time if available
                          if (a.time && b.time) {
                            return a.time.localeCompare(b.time);
                          }
                          return 0;
                        })
                        .map(food => (
                          <motion.div 
                            key={food.id} 
                            className="flex items-start p-2 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedLocation(food);
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="bg-white p-1 rounded-full mr-2 shadow-sm">
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: categoryColors.food }}
                              >
                                <BiRestaurant className="text-white w-3 h-3" />
                              </div>
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{food.name}</h4>
                                {food.time && <span className="text-xs text-orange-600">{food.time}</span>}
                              </div>
                              {food.details && <p className="text-sm text-gray-500">{food.details}</p>}
                              {food.cuisine && <p className="text-sm">Cuisine: {food.cuisine}</p>}
                              {food.price && <p className="text-sm mt-1">💰 {food.price}</p>}
                            </div>
                            
                            {food.image && (
                              <div className="w-16 h-16 rounded-md overflow-hidden ml-2 flex-shrink-0">
                                <img 
                                  src={food.image} 
                                  alt={food.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      
                      {dayLocations.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No places to visit on this day</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 