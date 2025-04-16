import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Droplets, Sun, Wind, Loader2, CloudFog, CloudLightning, CloudSnow, ThermometerSun, ThermometerSnowflake, AlertTriangle, RefreshCw, MapPin, Info } from 'lucide-react';
import { getCurrentWeather, getWeatherForecast, getWeatherIconUrl, getWeatherData, isApiKeyValid } from '@/service/WeatherService';
import { Button } from '@/components/ui/button';

const WeatherForecast = ({ trip }) => {
  const destination = trip?.userSelection?.location?.label;
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedAlternative, setSelectedAlternative] = useState(null);

  // Track if weather data has ever been successfully loaded
  const [hasLoadedBefore, setHasLoadedBefore] = useState(false);

  // Function to fetch weather data with full error handling
  const fetchWeatherData = useCallback(async () => {
    // Skip if no destination
    if (!destination) {
      setLoading(false);
      setError("No destination specified for this trip");
      return;
    }

    // Verify API key validity
    if (!isApiKeyValid()) {
      setLoading(false);
      setError("Weather API key is missing or invalid");
      console.error("OpenWeatherMap API key is missing or invalid");
      return;
    }

    setLoading(true);
    setError(null);
    setAlternatives([]);

    // Extract city name from destination or use selected alternative
    let location;
    if (selectedAlternative) {
      location = {
        lat: selectedAlternative.lat,
        lon: selectedAlternative.lon
      };
    } else {
      // Extract city name from destination (e.g., "Paris, France" -> "Paris")
      location = destination.split(',')[0].trim();
    }

    try {
      console.log(`Fetching weather data for ${selectedAlternative ? selectedAlternative.name : location}`);
      
      // Use the enhanced getWeatherData function
      const result = await getWeatherData(location);
      
      if (result.error) {
        console.error("Weather data error:", result.error);
        setError(result.error);
        
        if (result.alternatives && result.alternatives.length > 0) {
          setAlternatives(result.alternatives);
        }
      } else {
        // Set current weather if available
        if (result.current && !result.current.error) {
          setCurrentWeather(result.current);
          setHasLoadedBefore(true);
        }
        
        // Set forecast if available
        if (result.forecast && !result.forecast.error && Array.isArray(result.forecast)) {
          setForecast(result.forecast);
          setHasLoadedBefore(true);
        }
        
        // If we still have no data, show an error
        if ((!result.current || result.current.error) && (!result.forecast || result.forecast.error || !Array.isArray(result.forecast) || result.forecast.length === 0)) {
          setError("Could not retrieve complete weather information");
        } else {
          setError(null);
        }
      }
    } catch (err) {
      console.error("Weather data fetch error:", err);
      setError(err.message || "An unexpected error occurred while fetching weather data");
    } finally {
      setLoading(false);
    }
  }, [destination, selectedAlternative]);

  // Initial data fetch and when destination changes
  useEffect(() => {
    // Reset state when destination changes
    setCurrentWeather(null);
    setForecast([]);
    setLoading(true);
    setError(null);
    setAlternatives([]);
    setSelectedAlternative(null);
    setRetryCount(0);

    fetchWeatherData();
  }, [destination, fetchWeatherData]);

  // Handle manual retry
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchWeatherData();
  };

  // Handle selection of alternative city
  const handleSelectAlternative = (alt) => {
    setSelectedAlternative(alt);
    setRetryCount(0);
  };

  // Get weather icon component based on weather condition
  const getWeatherIcon = (condition, size = 6) => {
    const iconClass = `h-${size} w-${size}`;
    
    if (!condition) return <Cloud className={iconClass} />;
    
    const code = condition.toLowerCase();
    
    if (code.includes('clear')) return <Sun className={`${iconClass} text-yellow-500`} />;
    if (code.includes('rain')) return <CloudRain className={`${iconClass} text-blue-400`} />;
    if (code.includes('cloud')) return <Cloud className={`${iconClass} text-gray-400`} />;
    if (code.includes('mist') || code.includes('fog')) return <CloudFog className={`${iconClass} text-gray-400`} />;
    if (code.includes('snow')) return <CloudSnow className={`${iconClass} text-blue-200`} />;
    if (code.includes('thunder')) return <CloudLightning className={`${iconClass} text-purple-500`} />;
    
    // Default icon
    return <Cloud className={iconClass} />;
  };

  // Format temperature for display
  const formatTemp = (temp) => {
    return `${Math.round(temp)}°`;
  };

  // Convert wind speed to readable format
  const formatWind = (speed) => {
    return `${speed} km/h`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Cloud className="text-blue-600 h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Weather Forecast</h2>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-500">Loading weather data{retryCount > 0 ? ` (Attempt ${retryCount + 1})` : ''}...</span>
        </div>
      </div>
    );
  }

  // Complete error state (no data available at all)
  if (error && !currentWeather && !forecast.length && !hasLoadedBefore) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Cloud className="text-blue-600 h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Weather Forecast</h2>
        </div>
        
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 mb-1">Weather data unavailable</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        
        {/* Alternative cities suggestions */}
        {alternatives.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Did you mean one of these locations?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {alternatives.map((alt, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm"
                      className="justify-start"
                      onClick={() => handleSelectAlternative(alt)}
                    >
                      <span>{alt.name}, {alt.state ? `${alt.state}, ` : ''}{alt.country}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleRetry}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Cloud className="text-blue-600 h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Weather Forecast</h2>
            {selectedAlternative && (
              <p className="text-sm text-gray-500">
                Showing weather for {selectedAlternative.name}, {selectedAlternative.country}
              </p>
            )}
          </div>
        </div>
        
        {/* Retry button */}
        {error && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleRetry}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Retry</span>
          </Button>
        )}
      </div>
      
      {/* Error message - shows when we have partial data or an error during refresh */}
      {error && (currentWeather || forecast.length > 0 || hasLoadedBefore) && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-amber-500 mt-0.5" />
            <p className="text-sm text-amber-700">
              {error} {selectedAlternative ? "" : "Showing the most recent available data."}
            </p>
          </div>
        </div>
      )}
      
      {/* Current Weather */}
      {currentWeather && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex items-center">
              <img
                src={getWeatherIconUrl(currentWeather.weather[0].icon)}
                alt={currentWeather.weather[0].description}
                className="h-16 w-16 object-contain"
              />
              <div className="ml-2">
                <div className="text-4xl font-bold">
                  {formatTemp(currentWeather.main.temp)}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {currentWeather.weather[0].description}
                </div>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <ThermometerSun className="h-5 w-5 text-orange-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">High</div>
                  <div className="font-medium">{formatTemp(currentWeather.main.temp_max)}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <ThermometerSnowflake className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Low</div>
                  <div className="font-medium">{formatTemp(currentWeather.main.temp_min)}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Wind className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Wind</div>
                  <div className="font-medium">{formatWind(Math.round(currentWeather.wind.speed * 3.6))}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Droplets className="h-5 w-5 text-blue-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Humidity</div>
                  <div className="font-medium">{currentWeather.main.humidity}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-800 mb-4">5-Day Forecast</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {forecast.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-3 text-center"
              >
                <div className="font-medium text-gray-700 mb-1">{day.day}</div>
                <img
                  src={getWeatherIconUrl(day.icon)}
                  alt={day.description}
                  className="h-10 w-10 mx-auto"
                />
                <div className="text-xs text-gray-500 capitalize mb-2">{day.description}</div>
                
                <div className="flex justify-between px-2">
                  <div className="text-blue-500 font-medium">{formatTemp(day.low)}</div>
                  <div className="text-orange-500 font-medium">{formatTemp(day.high)}</div>
                </div>
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Droplets className="h-3 w-3 mr-1" />
                    {day.precipitation}%
                  </div>
                  <div className="flex items-center">
                    <Wind className="h-3 w-3 mr-1" />
                    {day.wind}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* No data state - only show if we have no current or forecast data */}
      {!currentWeather && !forecast.length && (
        <div className="text-center py-8 text-gray-500">
          <Cloud className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p>Weather information is not available for this location</p>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 mx-auto mt-4"
            onClick={handleRetry}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-400 text-right">
        Data from OpenWeatherMap
      </div>
    </div>
  );
};

export default WeatherForecast; 