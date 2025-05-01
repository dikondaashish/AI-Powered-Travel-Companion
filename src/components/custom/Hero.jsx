import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineLightBulb, HiOutlineMicrophone } from 'react-icons/hi'
import { FiArrowRight, FiMapPin, FiSearch } from 'react-icons/fi'
import { RiCompass3Line, RiMapPinTimeLine, RiRoadMapLine, RiRobot2Line } from 'react-icons/ri'
import { MdClose, MdOutlineAutoAwesome, MdOutlineTravelExplore } from 'react-icons/md'
import { HiSparkles } from 'react-icons/hi2'
import { AiFillStar } from 'react-icons/ai'

function Hero() {
  const [searchInput, setSearchInput] = useState('')
  const [activeTab, setActiveTab] = useState('popular')
  const [isVisible, setIsVisible] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [aiMoodScore, setAiMoodScore] = useState(89)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)
  
  // AI Predicted locations based on user behavior
  const aiPredictions = [
    { location: "Boston, MA, USA", confidence: 92, reason: "Based on your interest in cultural experiences" },
    { location: "New York, USA", confidence: 87, reason: "Based on your searches for eco-tourism" },
    { location: "Delhi, IN", confidence: 85, reason: "Similar to your past trips" },
  ]

  // Popular destinations data
  const destinations = [
    { name: 'Chicago, IL, USA', image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=2940&auto=format&fit=crop', tags: ['3 Days', '3 to 5 People Travelers'], link: '/view-trip/1745958781034' },
    { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2938&auto=format&fit=crop', tags: ['Beach', 'Culture'], link: '/view-trip/1745958877022' },
    { name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2940&auto=format&fit=crop', tags: ['Historic', 'Culture'], link: '/view-trip/1745958964696' },
  ]

  useEffect(() => {
    // Animation trigger on component mount
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Show AI suggestion after 5 seconds
    const timer = setTimeout(() => {
      setShowSuggestion(true)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  // Simulated AI voice recognition
  const handleVoiceSearch = () => {
    setIsListening(true)
    setIsProcessing(true)
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsListening(false)
      setSearchInput("New York City in autumn with Central Park's fall foliage.")
    }, 2000)
  }

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.2,
        duration: 0.7,
        ease: "easeOut"
      } 
    })
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.8,
        duration: 0.5,
        ease: "easeOut"
      } 
    }
  }

  const featureItems = [
    {
      icon: <HiOutlineLightBulb className="w-6 h-6 text-purple-600" />,
      title: "AI-Powered Suggestions",
      description: "Get personalized recommendations based on your preferences and past trips"
    },
    {
      icon: <HiOutlineCalendar className="w-6 h-6 text-blue-600" />,
      title: "Smart Itineraries",
      description: "Plan your perfect day with AI-optimized schedules and routes"
    },
    {
      icon: <RiRoadMapLine className="w-6 h-6 text-orange-600" />,
      title: "Local Experiences",
      description: "Discover hidden gems and authentic local experiences"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Hero Main Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Column - Hero Text */}
          <div className="lg:w-1/2 space-y-8">
 
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              custom={0}
              variants={fadeInUpVariants}
              className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mb-4"
            >
              <span className="flex items-center">
                <MdOutlineAutoAwesome className="mr-1" />
                AI-Powered Travel Planning
              </span>
            </motion.div>
            
            <motion.h1
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              custom={1}
              variants={fadeInUpVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f56551] to-[#f79577]">
                Plan Your Next Adventure
              </span>
              <br /> with the Power of AI
            </motion.h1>
            
            <motion.p
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              custom={2}
              variants={fadeInUpVariants}
              className="text-xl text-gray-600"
              style={{ fontSize: "15px" }}
            >
              Skip the Spreadsheet Chaos. Get a Done-for-You Itinerary — Beach Vibes, Foodie Tours, or Epic Road Trips. We've Got You.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4 flex justify-center lg:justify-start"
            >
              <a href="https://www.producthunt.com/posts/viaona?embed=true&utm_source=badge&utm_medium=badge&utm_souce=badge-viaona" target="_blank">
                <img 
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=960103&theme=light&t=1746134256498" 
                  alt="Viaona - Ai&#0032;Powered&#0032;Travel&#0046;&#0032;Uniquely&#0032;Yours🧠📍🏝🛫 | Product Hunt" 
                  style={{ width: "250px", height: "54px" }} 
                  width="250" 
                  height="54" 
                />
              </a>
            </motion.div>
            
            
            {/* Search Bar */}
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              custom={3}
              variants={fadeInUpVariants}
              className="relative mt-6 max-w-lg"
            >
              <div className="flex overflow-hidden rounded-full border bg-white shadow-md">
                <div className="flex items-center pl-4">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Where do you want to go?"
                  className="w-full py-4 px-4 outline-none"
                />
                <div className="flex">
                  <button 
                    onClick={handleVoiceSearch}
                    className={`flex items-center justify-center h-10 w-10 my-auto mr-1 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    <HiOutlineMicrophone className="h-5 w-5" />
                  </button>
                  <Link to={'/create-trip'}>
                    <Button className="m-1 rounded-full bg-gradient-to-r from-[#f56551] to-[#f79577] hover:opacity-90 px-6">
                      <FiArrowRight className="mr-2" /> Plan Trip
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Voice processing indicator */}
              <AnimatePresence>
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 bg-white p-3 rounded-lg shadow-md w-full"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0s" }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                      <span className="text-sm text-gray-600">Processing your voice input...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* AI Suggestion Popup */}
              <AnimatePresence>
                {showSuggestion && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 bg-white p-4 rounded-lg shadow-md w-full z-10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <HiSparkles className="text-yellow-500 mr-2" />
                        <span className="font-medium text-gray-800">AI Suggestion</span>
                      </div>
                      <button 
                        onClick={() => setShowSuggestion(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MdClose />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Based on your location and the season, you might enjoy:</p>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="font-medium text-blue-800">Cherry Blossom Season in Japan</p>
                      <p className="text-sm text-blue-700">Perfect timing for a 10-day cultural exploration</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Popular Searches Tags */}
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              custom={4}
              variants={fadeInUpVariants}
              className="flex flex-wrap gap-2 mt-4"
            >
              <span className="text-sm text-gray-500">Popular:</span>
              {['Boston', 'Paris', 'New York', 'Chicago', 'Delhi'].map((item, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white border rounded-full text-sm hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
          
          {/* Right Column - Image */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={scaleIn}
            className="lg:w-1/2 relative"
          >
            <div className="relative z-10">
              <img 
                src="/landing.png" 
                alt="Travel destination" 
                className="rounded-lg shadow-2xl max-w-full object-cover" 
              />
              
              {/* Floating AI insights Elements */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -left-10 top-1/4 bg-white p-3 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiMapPin className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Next Destination</p>
                    <p className="text-sm font-medium">New York, US</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute -right-5 bottom-1/3 bg-white p-3 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <RiCompass3Line className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">AI Suggestion</p>
                    <p className="text-sm font-medium">4 Days, 12 Activities</p>
                  </div>
                </div>
              </motion.div>
              
              {/* AI Processing Visualization */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white p-4 rounded-xl shadow-lg max-w-sm w-full"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                        <RiRobot2Line className="text-purple-600 h-3 w-3" />
                      </div>
                      <span className="text-xs font-medium">AI Travel Planner</span>
                    </div>
                    <div className="text-xs text-gray-500">Analyzing data...</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, delay: 1.8 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      ></motion.div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Processing travel patterns</span>
                      <span>85%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs pt-1">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">AI confidence:</span>
                      <div className="flex text-yellow-400">
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar className="text-gray-300" />
                      </div>
                    </div>
                    <span className="font-medium">Excellent match</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute -z-10 top-1/3 right-1/4 w-64 h-64 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -z-10 bottom-1/3 left-1/4 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          </motion.div>
        </div>
      </div>
      
      {/* AI Predictions Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        className="max-w-7xl mx-auto mt-24 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-purple-100 px-4 py-1 rounded-full text-purple-800 font-medium text-sm">
            <HiSparkles className="mr-2" />
            AI-Predicted Destinations For You
          </div>
          <h2 className="text-3xl font-bold mt-3">Your Next Adventure Awaits</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2">
            Our AI has analyzed thousands of travel patterns to find perfect matches for your preferences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiPredictions.map((prediction, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{prediction.location}</h3>
                  <div className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {prediction.confidence}% match
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{prediction.reason}</p>
                
                <div className="pt-3 border-t flex justify-between items-center">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-6 h-1.5 rounded-full bg-purple-100"></div>
                    ))}
                  </div>
                  <Link to={'/create-trip'}>
                    <Button 
                      variant="outline" 
                      className="text-xs rounded-full border-gray-200 hover:bg-gray-50"
                    >
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.7 }}
        className="max-w-7xl mx-auto mt-24"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Plan with AI</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Experience the power of artificial intelligence in creating the perfect travel itinerary tailored just for you.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureItems.map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Popular Destinations */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.7 }}
        className="max-w-7xl mx-auto mt-24"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Destinations</h2>
          
          <div className="flex gap-4">
            {['popular', 'recommended', 'trending'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeTab === tab 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="rounded-xl overflow-hidden shadow-lg group relative"
            >
              <div className="h-72 w-full overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="flex gap-2 mb-2">
                  {destination.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">{tag}</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                <Link to={destination.link || '/create-trip'}>
                  <button className="mt-3 flex items-center gap-1 text-sm text-white/90 hover:text-white group-hover:underline">
                    <span>Plan your trip</span>
                    <FiArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
      <Link to={'/create-trip'}>
            <Button 
              variant="outline" 
              className="px-8 py-6 rounded-full border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              Explore More Destinations <FiArrowRight className="ml-2" />
            </Button>
      </Link>
        </div>
      </motion.div>
      
      {/* Call to action */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.7 }}
        className="max-w-7xl mx-auto mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to explore the world?</h2>
            <p className="mb-8 text-blue-100">Start planning your dream trip today with our AI-powered itinerary generator.</p>
            <Link to={'/create-trip'}>
              <Button className="rounded-full bg-white text-blue-600 hover:bg-blue-50 px-8 py-6">
                Get Started, It's Free <FiArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1468078809804-4c7b3e60a478?q=80&w=2940&auto=format&fit=crop" 
              alt="Travel" 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/20"></div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Hero