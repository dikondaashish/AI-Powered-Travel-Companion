/**
 * Weather Service for OpenWeatherMap API
 * Handles API calls with caching to minimize API usage
 */

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second delay between retries

// Initialize cache from sessionStorage if available
const initializeCache = () => {
  try {
    const storedCurrentCache = sessionStorage.getItem('weatherCache_current');
    const storedForecastCache = sessionStorage.getItem('weatherCache_forecast');
    
    return {
      current: storedCurrentCache ? JSON.parse(storedCurrentCache) : {},
      forecast: storedForecastCache ? JSON.parse(storedForecastCache) : {}
    };
  } catch (error) {
    console.warn('Failed to load weather cache from session storage:', error);
    return { current: {}, forecast: {} };
  }
};

// Cache for weather data
const weatherCache = initializeCache();

// Update sessionStorage when cache changes
const updateSessionCache = (type, cache) => {
  try {
    sessionStorage.setItem(`weatherCache_${type}`, JSON.stringify(cache));
  } catch (error) {
    console.warn(`Failed to update ${type} cache in session storage:`, error);
  }
};

/**
 * Retry a function multiple times with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} - Result of the function
 */
const retryWithBackoff = async (fn, maxAttempts = MAX_RETRY_ATTEMPTS, delay = RETRY_DELAY) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, error.message);
      lastError = error;
      
      if (attempt < maxAttempts) {
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  throw lastError;
};

/**
 * Fetch current weather for a location
 * @param {string} location - City name or coordinates
 * @param {boolean} useRetry - Whether to use retry mechanism
 * @returns {Promise} - Weather data
 */
export const getCurrentWeather = async (location, useRetry = true) => {
  if (!location) {
    console.error('Location not provided for weather data');
    return null;
  }
  
  // Normalize location name for caching
  const normalizedLocation = location.toLowerCase().trim();
  
  // Check cache first
  const cachedData = weatherCache.current[normalizedLocation];
  if (cachedData && Date.now() - cachedData.timestamp < WEATHER_CACHE_DURATION) {
    console.log('Using cached current weather data for', location);
    return cachedData.data;
  }
  
  const fetchWeatherData = async () => {
    console.log(`Fetching current weather for "${location}"`);
    let apiUrl;
    
    // Check if location contains coordinates
    if (typeof location === 'object' && location.lat && location.lon) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(normalizedLocation)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    }
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText;
      console.error(`Weather API error (${response.status}): ${errorMessage}`);
      
      if (response.status === 404) {
        throw new Error(`Location "${location}" not found`);
      } else if (response.status === 401) {
        throw new Error('Invalid API key');
      } else if (response.status === 429) {
        throw new Error('API rate limit exceeded');
      } else {
        throw new Error(`Weather API error: ${errorMessage}`);
      }
    }
    
    const data = await response.json();
    
    // Cache the results
    weatherCache.current[normalizedLocation] = {
      timestamp: Date.now(),
      data
    };
    
    // Update session storage
    updateSessionCache('current', weatherCache.current);
    
    return data;
  };
  
  try {
    if (useRetry) {
      return await retryWithBackoff(fetchWeatherData);
    } else {
      return await fetchWeatherData();
    }
  } catch (error) {
    console.error('Error fetching current weather:', error);
    
    // Return last cached data if available (even if expired)
    if (cachedData) {
      console.log('Returning expired cached data as fallback');
      return cachedData.data;
    }
    
    return { error: error.message };
  }
};

/**
 * Fetch 5-day forecast for a location
 * @param {string} location - City name or coordinates
 * @param {boolean} useRetry - Whether to use retry mechanism
 * @returns {Promise} - Forecast data
 */
export const getWeatherForecast = async (location, useRetry = true) => {
  if (!location) {
    console.error('Location not provided for forecast data');
    return null;
  }
  
  // Normalize location name for caching
  const normalizedLocation = typeof location === 'string' 
    ? location.toLowerCase().trim()
    : `${location.lat},${location.lon}`;
  
  // Check cache first
  const cachedData = weatherCache.forecast[normalizedLocation];
  if (cachedData && Date.now() - cachedData.timestamp < WEATHER_CACHE_DURATION) {
    console.log('Using cached forecast data for', location);
    return cachedData.data;
  }
  
  const fetchForecastData = async () => {
    console.log(`Fetching forecast for "${location}"`);
    let apiUrl;
    
    // Check if location contains coordinates
    if (typeof location === 'object' && location.lat && location.lon) {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(normalizedLocation)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    }
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText;
      console.error(`Forecast API error (${response.status}): ${errorMessage}`);
      
      if (response.status === 404) {
        throw new Error(`Location "${location}" not found`);
      } else if (response.status === 401) {
        throw new Error('Invalid API key');
      } else if (response.status === 429) {
        throw new Error('API rate limit exceeded');
      } else {
        throw new Error(`Weather API error: ${errorMessage}`);
      }
    }
    
    const data = await response.json();
    
    // Process and organize the forecast data by day
    const processedData = processForecastData(data);
    
    // Cache the results
    weatherCache.forecast[normalizedLocation] = {
      timestamp: Date.now(),
      data: processedData,
      rawData: data
    };
    
    // Update session storage
    updateSessionCache('forecast', weatherCache.forecast);
    
    return processedData;
  };
  
  try {
    if (useRetry) {
      return await retryWithBackoff(fetchForecastData);
    } else {
      return await fetchForecastData();
    }
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    
    // Return last cached data if available (even if expired)
    if (cachedData) {
      console.log('Returning expired cached data as fallback');
      return cachedData.data;
    }
    
    return { error: error.message };
  }
};

/**
 * Try to get a nearby city when original location is not found
 * @param {string} cityName - Original city name
 * @returns {Promise} - Nearby city or null
 */
export const findNearbyCities = async (cityName) => {
  try {
    // Use geocoding API to find coordinates for the location
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=3&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // Return alternatives if found
    return data.length > 0 ? data.map(city => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon
    })) : null;
  } catch (error) {
    console.error('Error finding nearby cities:', error);
    return null;
  }
};

/**
 * Process and organize forecast data by day
 * @param {Object} forecastData - Raw forecast data from API
 * @returns {Array} - Processed daily forecast
 */
const processForecastData = (forecastData) => {
  if (!forecastData || !forecastData.list || !Array.isArray(forecastData.list)) {
    console.error('Invalid forecast data structure:', forecastData);
    return [];
  }

  const dailyForecasts = {};
  
  // Group forecast data by day
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (!dailyForecasts[day]) {
      dailyForecasts[day] = {
        date: day,
        day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
        temps: [],
        precipitation: [],
        weatherIcons: [],
        descriptions: [],
        winds: []
      };
    }
    
    dailyForecasts[day].temps.push(item.main.temp);
    dailyForecasts[day].precipitation.push(item.pop || 0); // Probability of precipitation
    dailyForecasts[day].weatherIcons.push(item.weather[0].icon);
    dailyForecasts[day].descriptions.push(item.weather[0].description);
    dailyForecasts[day].winds.push(item.wind.speed);
  });
  
  // Calculate daily summaries
  return Object.values(dailyForecasts).map(day => {
    // Get most frequent weather icon and description for the day
    const iconFrequency = {};
    day.weatherIcons.forEach(icon => {
      iconFrequency[icon] = (iconFrequency[icon] || 0) + 1;
    });
    
    const descFrequency = {};
    day.descriptions.forEach(desc => {
      descFrequency[desc] = (descFrequency[desc] || 0) + 1;
    });
    
    const mainIcon = Object.entries(iconFrequency)
      .sort((a, b) => b[1] - a[1])[0][0];
      
    const mainDescription = Object.entries(descFrequency)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    return {
      date: day.date,
      day: day.day,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      precipitation: Math.round(Math.max(...day.precipitation) * 100), // Convert to percentage
      icon: mainIcon,
      description: mainDescription,
      wind: Math.round((day.winds.reduce((a, b) => a + b, 0) / day.winds.length) * 3.6) // Convert m/s to km/h
    };
  }).slice(0, 5); // Limit to 5 days
};

/**
 * Get weather icon URL from icon code
 * @param {string} iconCode - OpenWeatherMap icon code
 * @returns {string} - URL to weather icon
 */
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Get all weather data for a location with a backup approach
 * @param {string} location - City name 
 * @returns {Promise} - Object with current and forecast data
 */
export const getWeatherData = async (location) => {
  try {
    // Try to get weather data with city name
    const [current, forecast] = await Promise.all([
      getCurrentWeather(location),
      getWeatherForecast(location)
    ]);
    
    // Check if we got errors from both APIs
    const currentError = current && current.error;
    const forecastError = forecast && forecast.error;
    
    if (currentError && forecastError) {
      // If the error is "location not found", try to find nearby cities
      if (currentError.includes('not found')) {
        const alternatives = await findNearbyCities(location);
        
        if (alternatives && alternatives.length > 0) {
          return {
            current: null,
            forecast: null,
            alternatives,
            error: `Location "${location}" not found. Did you mean one of these?`
          };
        }
      }
      
      return { current: null, forecast: null, error: currentError };
    }
    
    return { current, forecast, error: null };
    
  } catch (error) {
    console.error('Error in getWeatherData:', error);
    return { current: null, forecast: null, error: error.message };
  }
};

// Check if API key is valid
export const isApiKeyValid = () => {
  return OPENWEATHER_API_KEY && OPENWEATHER_API_KEY.length > 10;
};

export default {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherIconUrl,
  getWeatherData,
  findNearbyCities,
  isApiKeyValid
}; 