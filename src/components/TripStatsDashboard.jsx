import React, { useEffect, useState } from 'react';
import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import { useAuth } from '@/context/AuthContext';
import { 
  PieChart, 
  Pie, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell, 
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  Globe, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Award, 
  PlaneTakeoff, 
  TrendingUp,
  Share,
  Plus,
  ExternalLink
} from "lucide-react";
import html2canvas from 'html2canvas';

const COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];
const RADIAN = Math.PI / 180;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// AnimatedCard component with Framer Motion
const AnimatedCard = ({ children, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    {children}
  </motion.div>
);

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
        <p className="text-gray-600 font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const WorldMap = ({ visitedCountries }) => {
  return (
    <div className="relative h-60 w-full overflow-hidden rounded-lg">
      <img 
        src="/world-map.svg" 
        alt="World Map" 
        className="w-full h-full object-cover opacity-80"
      />
      {visitedCountries.map((country, idx) => (
        <motion.div
          key={idx}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: idx * 0.05 }}
          className="absolute w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            top: `${country.position.y}%`, 
            left: `${country.position.x}%`,
            boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.3)'
          }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="absolute inset-0 bg-red-500 rounded-full"
            style={{
              boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.3)'
            }}
          />
          <div className="absolute top-0 left-0 transform -translate-y-full -translate-x-1/2 w-max pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              {country.name}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  // Don't show labels for segments with 0%
  if (percent === 0) return null;
  
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-sm font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Trip Card Component with image fetching
const TripCard = ({ trip, index }) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      fetchPlacePhoto(trip.userSelection.location.label);
    }
  }, [trip]);

  const fetchPlacePhoto = async (placeName) => {
    try {
      setLoading(true);
      const data = { textQuery: placeName };
      const response = await GetPlaceDetails(data);
      
      if (response.data?.places?.[0]?.photos?.[3]?.name) {
        const photoUrl = PHOTO_REF_URL.replace('{NAME}', response.data.places[0].photos[3].name);
        setPhotoUrl(photoUrl);
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {loading ? (
          <div className="h-full w-full bg-gray-200 animate-pulse" />
        ) : (
          <img 
            src={photoUrl || '/placeholder.jpg'} 
            alt={trip.userSelection?.location?.label}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h4 className="font-bold text-white truncate">{trip.userSelection?.location?.label}</h4>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
            {trip.userSelection?.budget}
          </span>
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            {trip.userSelection?.noOfDays} Days
          </span>
        </div>
        <Button
          onClick={() => window.location.href = `/view-trip/${trip.id}`}
          variant="outline" 
          size="sm"
          className="w-full group"
        >
          <span>View Details</span>
          <ExternalLink className="ml-2 h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>
    </motion.div>
  );
};

function TripStatsDashboard() {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    countriesVisited: 0,
    citiesExplored: 0,
    totalDaysTraveled: 0,
    estimatedTotalSpend: 0,
    mostVisitedDestination: '',
    favoriteType: '',
    visitedCountries: [],
    tripsByMonth: [],
    budgetDistribution: [],
    travelStyleBreakdown: [],
    achievements: [],
    recentTrips: []
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData && currentUser) {
      fetchTrips(userData);
    }
  }, [currentUser]);

  const fetchTrips = async (user) => {
    try {
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
      const querySnapshot = await getDocs(q);
      
      const tripsData = [];
      querySnapshot.forEach((doc) => {
        tripsData.push({ id: doc.id, ...doc.data() });
      });
      
      setTrips(tripsData);
      calculateStats(tripsData);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (trips) => {
    // Skip calculation if no trips
    if (!trips || trips.length === 0) {
      setStats({
        ...stats,
        totalTrips: 0,
        achievements: [{ name: "Ready to Travel", description: "Create your first trip!" }]
      });
      return;
    }
    
    // Extract unique countries and cities
    const countries = new Set();
    const cities = new Set();
    const destinations = {};
    const travelTypes = {};
    let totalDays = 0;
    let totalBudget = 0;
    
    // Month and year mapping for the chart
    const monthYearCounts = {};
    // Budget categories
    const budgetCounts = {
      "Budget": 0,
      "Moderate": 0,
      "Luxury": 0
    };
    // Travel style categories - using traveler field
    const styleCounts = {};
    
    console.log("Processing", trips.length, "trips for statistics");
    
    trips.forEach(trip => {
      // Debug logging to see the trip structure
      console.log("Trip structure sample:", {
        id: trip.id,
        userSelection: trip.userSelection ? {
          traveler: trip.userSelection.traveler,
          budget: trip.userSelection.budget,
          travelType: trip.userSelection.travelType
        } : null,
        traveler: trip.traveler
      });
      
      // Count countries and cities
      const country = trip.userSelection?.location?.country || "Unknown";
      const city = trip.userSelection?.location?.label || "Unknown";
      
      countries.add(country);
      cities.add(city);
      
      // Count destinations
      destinations[city] = (destinations[city] || 0) + 1;
      
      // Try to get traveler field from multiple possible locations
      let traveler = null;
      
      // Check for traveler values in different possible locations
      if (trip.userSelection?.traveler) {
        traveler = trip.userSelection.traveler;
        console.log("Found traveler in userSelection.traveler:", traveler);
      } else if (trip.traveler) {
        traveler = trip.traveler;
        console.log("Found traveler in trip.traveler:", traveler);
      } else if (trip.userSelection?.travelType) {
        traveler = trip.userSelection.travelType;
        console.log("Using travelType as fallback:", traveler);
      }
      
      // Clean up traveler value - remove "People" suffix if present
      if (traveler && typeof traveler === 'string') {
        // Convert "3 to 5 People" to just "Family"
        if (traveler.includes("People")) {
          if (traveler === "1") {
            traveler = "Just Me";
          } else if (traveler === "2 People") {
            traveler = "A Couple";
          } else if (traveler.includes("3 to 5")) {
            traveler = "Family";
          } else if (traveler.includes("5 to 10")) {
            traveler = "Friends";
          }
        }
        
        if (traveler.trim() !== "") {
          console.log("Adding traveler to counts:", traveler);
          styleCounts[traveler] = (styleCounts[traveler] || 0) + 1;
        }
      }
      
      // Add days
      const days = parseInt(trip.userSelection?.noOfDays || 0);
      totalDays += days;
      
      // Estimate budget (simplified)
      const budget = trip.userSelection?.budget || "Moderate";
      let budgetMultiplier = 1;
      if (budget === "Budget") budgetMultiplier = 100;
      if (budget === "Moderate") budgetMultiplier = 200;
      if (budget === "Luxury") budgetMultiplier = 400;
      
      totalBudget += days * budgetMultiplier;
      
      // Month and year data
      const date = new Date(trip.createdAt?.seconds * 1000 || Date.now());
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthYearKey = `${MONTHS[month]} ${year}`;
      
      monthYearCounts[monthYearKey] = (monthYearCounts[monthYearKey] || 0) + 1;
      
      // Budget distribution
      budgetCounts[budget] = (budgetCounts[budget] || 0) + 1;
    });
    
    // Log the style counts for debugging
    console.log("Final style counts:", styleCounts);
    
    // Find most visited destination and favorite travel type
    const mostVisitedDestination = Object.entries(destinations).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
    
    // Only set favorite type if we have meaningful data
    let favoriteType = "None";
    if (Object.keys(styleCounts).length > 0) {
      const sortedStyles = Object.entries(styleCounts).sort((a, b) => b[1] - a[1]);
      if (sortedStyles.length > 0) {
        favoriteType = sortedStyles[0][0];
      }
    }
    
    console.log("Favorite travel type:", favoriteType);
    
    // Prepare chart data
    const tripsByMonth = Object.entries(monthYearCounts).map(([monthYear, count]) => ({
      monthYear,
      trips: count
    })).sort((a, b) => {
      // Sort by year and month
      const [aMonth, aYear] = a.monthYear.split(' ');
      const [bMonth, bYear] = b.monthYear.split(' ');
      
      if (aYear !== bYear) {
        return parseInt(aYear) - parseInt(bYear);
      }
      
      return MONTHS.indexOf(aMonth) - MONTHS.indexOf(bMonth);
    });
    
    const budgetDistribution = Object.entries(budgetCounts)
      .filter(([name, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value
      }));
    
    const travelStyleBreakdown = Object.entries(styleCounts)
      .filter(([name, value]) => name.trim() !== '' && value > 0)
      .map(([name, value]) => ({
        name,
        value
      }));
    
    // Log for debugging
    console.log("Travel Style Breakdown (processed):", travelStyleBreakdown);
    
    // Mock data for world map (in a real app, these would be calculated from actual coordinates)
    const visitedCountries = Array.from(countries).map((country, index) => ({
      name: country,
      code: `C${index}`,
      position: { 
        x: 20 + Math.random() * 60, 
        y: 20 + Math.random() * 60 
      }
    }));
    
    // Generate achievements
    const achievements = [];
    if (trips.length >= 1) achievements.push({ name: "First Trip", description: "You've planned your first trip!" });
    if (trips.length >= 5) achievements.push({ name: "Frequent Traveler", description: "You've planned 5+ trips" });
    if (countries.size >= 3) achievements.push({ name: "Globe Trotter", description: "Visited 3+ countries" });
    if (totalDays >= 30) achievements.push({ name: "Nomad", description: "30+ days on the road" });
    
    // Get recent trips (last 3)
    const recentTrips = [...trips]
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, 3);
    
    setStats({
      totalTrips: trips.length,
      countriesVisited: countries.size,
      citiesExplored: cities.size,
      totalDaysTraveled: totalDays,
      estimatedTotalSpend: totalBudget,
      mostVisitedDestination,
      favoriteType,
      visitedCountries,
      tripsByMonth,
      budgetDistribution,
      travelStyleBreakdown,
      achievements,
      recentTrips
    });
  };

  const generateShareableImage = async () => {
    try {
      const element = document.getElementById('trip-stats-dashboard');
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = data;
      link.download = 'my-travel-stats.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 mt-16 bg-white/50 backdrop-blur-sm">
        <Skeleton className="h-12 w-64 mb-6 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full mt-6 rounded-xl" />
      </div>
    );
  }

  return (
    <div id="trip-stats-dashboard" className="w-full max-w-7xl mx-auto px-4 py-8 mt-16 space-y-10">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-indigo-50 to-violet-50 p-6 rounded-2xl border border-indigo-100"
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              src={user?.picture} 
              alt={user?.name} 
              className="w-16 h-16 rounded-full border-4 border-white shadow-md"
            />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -bottom-2 -right-2 bg-green-500 h-5 w-5 rounded-full border-2 border-white"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
              Welcome Back, {user?.given_name}!
            </h1>
            <p className="text-gray-600 mt-1">Here's a summary of your travel adventures</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button 
            onClick={generateShareableImage}
            variant="outline" 
            className="flex items-center gap-2 transition-all duration-300 hover:bg-indigo-50"
          >
            <Share className="w-4 h-4" />
            <span>Share My Stats</span>
          </Button>
          <Button 
            onClick={() => window.location.href = '/create-trip'}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Trip</span>
          </Button>
        </div>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { 
            icon: <PlaneTakeoff className="w-6 h-6 text-indigo-600" />,
            bgColor: 'bg-indigo-100',
            label: 'Total Trips Planned',
            value: stats.totalTrips
          },
          { 
            icon: <Globe className="w-6 h-6 text-violet-600" />,
            bgColor: 'bg-violet-100',
            label: 'Countries Visited',
            value: stats.countriesVisited
          },
          { 
            icon: <MapPin className="w-6 h-6 text-green-600" />,
            bgColor: 'bg-green-100',
            label: 'Cities Explored',
            value: stats.citiesExplored
          },
          { 
            icon: <Calendar className="w-6 h-6 text-amber-600" />,
            bgColor: 'bg-amber-100',
            label: 'Total Days Traveled',
            value: stats.totalDaysTraveled
          },
          { 
            icon: <DollarSign className="w-6 h-6 text-red-600" />,
            bgColor: 'bg-red-100',
            label: 'Estimated Total Spend',
            value: `$${stats.estimatedTotalSpend}`
          },
          { 
            icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
            bgColor: 'bg-blue-100',
            label: 'Most Visited',
            value: stats.mostVisitedDestination
          },
        ].map((stat, index) => (
          <AnimatedCard key={index} index={index}>
            <Card className="border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1 truncate max-w-[150px]">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatedCard index={0}>
          <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Trips by Month</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={stats.tripsByMonth} 
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="monthYear" 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 15 }} />
                    <Bar 
                      dataKey="trips" 
                      fill="#7C3AED" 
                      name="Trips" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
        
        <AnimatedCard index={1}>
          <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Budget Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.budgetDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1500}
                      animationBegin={200}
                      minAngle={15}
                    >
                      {stats.budgetDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ paddingTop: 30 }}
                      formatter={(value, entry, index) => `${value}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
        
        <AnimatedCard index={2}>
          <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Travel Style</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="80%" 
                    data={stats.travelStyleBreakdown
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 5)
                      .map((item, index) => ({
                        ...item,
                        // Use descriptive name for display
                        displayName: item.name,
                        fill: COLORS[index % COLORS.length]
                      }))} 
                    startAngle={0} 
                    endAngle={360}
                    barSize={20}
                  >
                    <RadialBar
                      minAngle={15}
                      background
                      clockWise
                      dataKey="value"
                      name="Count"
                      cornerRadius={10}
                      label={{ 
                        position: 'insideStart', 
                        fill: '#fff', 
                        fontWeight: 'bold',
                        formatter: (value) => value > 0 ? value : ''
                      }}
                      animationDuration={1500}
                      animationBegin={200}
                    />
                    <Legend 
                      iconSize={10} 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{ paddingLeft: 20 }}
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color }}>
                          {entry.payload.displayName}
                        </span>
                      )}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      formatter={(value, name, entry) => [value, entry.payload.displayName]}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
        
        <AnimatedCard index={3}>
          <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Visited Countries</h3>
              <div className="h-72 flex items-center justify-center">
                <WorldMap visitedCountries={stats.visitedCountries} />
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>
      
      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Your Travel Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {stats.achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="border-2 border-amber-200 bg-amber-50 overflow-hidden hover:shadow-md transition-all duration-300">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="bg-amber-100 p-3 rounded-full mb-3">
                    <Award className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                  <p className="text-sm text-gray-600 mt-2">{achievement.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {stats.achievements.length === 0 && (
            <Card className="col-span-full border-2 border-gray-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Award className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="font-medium text-lg text-gray-800">No Achievements Yet</h4>
                <p className="text-gray-600 mt-2">Start planning trips to earn achievements!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
      
      {/* Recent Trips */}
      {stats.recentTrips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Recent Trips</h3>
            {trips.length > 3 && (
              <Button 
                onClick={() => window.location.href = '/my-trips'}
                variant="ghost" 
                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
              >
                View All Trips
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stats.recentTrips.map((trip, index) => (
              <TripCard key={trip.id} trip={trip} index={index} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default TripStatsDashboard; 