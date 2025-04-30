import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList, TravelPreferences } from '@/constants/options';
import { chatSession } from '@/service/AIModal';
import React, { useEffect, useState, useRef } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineUserGroup, HiSparkles } from 'react-icons/hi';
import { RiCompass3Line, RiRobot2Line, RiRoadMapLine, RiMapPinLine } from "react-icons/ri";
import { FiArrowRight, FiMapPin, FiDollarSign, FiSearch, FiClock, FiInfo } from 'react-icons/fi';
import { MdOutlineTravelExplore, MdAutoAwesome, MdFlightTakeoff } from "react-icons/md";
import { FaPlaneDeparture } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import AuthDialog from '@/components/custom/AuthDialog';
import { useAuth } from '@/context/AuthContext';
import { useSEO } from '@/context/SEOContext';

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const progressBarRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { currentUser } = useAuth();
  const [userJustLoggedIn, setUserJustLoggedIn] = useState(false);
  const [showDurationWarning, setShowDurationWarning] = useState(false);
  const { pageSEO } = useSEO();
  
  const steps = [
    { id: 'destination', title: 'Destination', icon: <HiOutlineLocationMarker className="h-6 w-6" /> },
    { id: 'days', title: 'Trip Duration', icon: <HiOutlineCalendar className="h-6 w-6" /> },
    { id: 'budget', title: 'Budget', icon: <FiDollarSign className="h-6 w-6" /> },
    { id: 'preferences', title: 'Preferences', icon: <RiCompass3Line className="h-6 w-6" /> },
    { id: 'travelers', title: 'Travelers', icon: <HiOutlineUserGroup className="h-6 w-6" /> },
  ];

  const navigate = useNavigate();
  
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  }

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    // Start processing animation after component loads
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Show duration warning toast when user reaches the Trip Duration step
  useEffect(() => {
    if (activeStep === 1 && !showDurationWarning) {
      setShowDurationWarning(true);
      toast(
        <div className="flex items-start">
          <FiInfo className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Recommended Trip Duration</p>
            <p className="text-sm">For the best trip recommendations, please select a duration of 3 to 4 days. Choosing more than 4 days may occasionally cause errors, as the AI currently has limitations when generating large travel plans.</p>
          </div>
        </div>,
        {
          duration: 8000,
          position: "top-center",
          className: "bg-blue-50 border border-blue-200 text-gray-800"
        }
      );
    }
  }, [activeStep, showDurationWarning]);

  // Detect when user logs in through the auth dialog and automatically generate trip
  useEffect(() => {
    if (currentUser && userJustLoggedIn && isFormComplete()) {
      // Reset flag
      setUserJustLoggedIn(false);
      // Generate trip with slight delay to ensure authentication is complete
      setTimeout(() => {
        OnGenerateTrip();
      }, 500);
    }
  }, [currentUser, userJustLoggedIn]);
  
  // Flight animation progress for loading
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          const newProgress = prev + 1;
          return newProgress > 100 ? 0 : newProgress;
        });
      }, 100);
    } else {
      setLoadingProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const OnGenerateTrip = async () => {
    if (!currentUser) {
      setOpenAuthDialog(true);
      setUserJustLoggedIn(true); // Set flag to indicate we want to generate after login
      return;
    }

    if (!formData?.location || !formData?.noOfDays || !formData?.budget || !formData?.traveler) {
      toast("Please fill all details");
      return;
    }
    
    setLoading(true);
    toast('Our AI is crafting your perfect trip...');
    
    // Get all selected preference titles to create a comma-separated string
    const preferencesString = [
      ...(formData?.preferences?.locationTypes || []),
      ...(formData?.preferences?.learning || []),
      ...(formData?.preferences?.activities || []),
      ...(formData?.preferences?.relaxation || [])
    ].join(', ');
    
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget)
      .replace('{preferences}', preferencesString)
      .replace('{totalDays}', formData?.noOfDays);
    
    const result = await chatSession.sendMessage(FINAL_PROMPT);

    console.log("--", result?.response?.text());
    setLoading(false);
    SaveAiTrip(result?.response?.text());
  }

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();

    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse (TripData),
      userEmail: user?.email,
      id: docId
    });
    
    setLoading(false);
    navigate('/view-trip/'+docId);
  }

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const isStepComplete = (stepIndex) => {
    switch (stepIndex) {
      case 0: return !!formData?.location;
      case 1: return !!formData?.noOfDays;
      case 2: return !!formData?.budget;
      case 3: return !!formData?.preferences;
      case 4: return !!formData?.traveler;
      default: return false;
    }
  };

  const isFormComplete = () => {
    return !!formData?.location && 
           !!formData?.noOfDays && 
           !!formData?.budget &&
           !!formData?.preferences &&
           !!formData?.traveler;
  };

  // Flight path animation for loading
  const flightPath = {
    curve: {
      x: [0, 50, 100, 150, 200, 220, 200],
      y: [0, -10, -15, -10, -5, 0, 10],
      scale: [1, 1.1, 1.2, 1.1, 1, 0.9, 1],
      rotate: [0, 10, 15, 10, 5, 0, -5],
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-20 px-4 sm:px-6 overflow-hidden">
      {pageSEO.createTrip()}
      
      <div className="max-w-6xl mx-auto">
        {/* Header with AI processing animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-purple-100 px-4 py-1 rounded-full text-purple-800 font-medium text-sm mb-4">
            <MdAutoAwesome className="mr-2" />
            <span>AI-Powered Trip Creator</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#f56551] to-[#f79577]">
            Design Your Dream Adventure
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tell us your preferences, and our AI travel planner will craft a personalized itinerary just for you.
          </p>
        </motion.div>

        {/* AI Processing Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: animationComplete ? 0 : 1, scale: animationComplete ? 0.9 : 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className={`${animationComplete ? 'hidden' : 'block'} max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mb-12`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <RiRobot2Line className="text-purple-600" />
              </div>
              <span className="font-medium">AI Trip Planner</span>
            </div>
            <span className="text-sm text-gray-500">Initializing...</span>
          </div>
          
          <div className="space-y-3">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5 }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                ref={progressBarRef}
              ></motion.div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Loading travel intelligence</span>
              <span>Please wait</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animationComplete ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex justify-between items-center max-w-3xl mx-auto px-4 sm:px-0">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative">
                <button
                  onClick={() => isStepComplete(index) && setActiveStep(index)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    activeStep === index
                      ? 'bg-gradient-to-r from-[#f56551] to-[#f79577] text-white shadow-lg'
                      : index < activeStep || isStepComplete(index)
                      ? 'bg-green-100 text-green-600 border border-green-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.icon}
                </button>
                <span className={`text-xs font-medium ${activeStep === index ? 'text-[#f56551]' : 'text-gray-500'}`}>
                  {step.title}
                </span>
                
                {index < steps.length - 1 && (
                  <div className="absolute h-[2px] w-[calc(100%-4rem)] bg-gray-200 top-6 left-12 -z-10">
                    <div 
                      className="h-full bg-gradient-to-r from-[#f56551] to-[#f79577] transition-all duration-500"
                      style={{ width: index < activeStep ? '100%' : '0%' }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto relative overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-purple-300 rounded-full filter blur-3xl opacity-10"></div>
            <div className="absolute -z-10 bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl opacity-10"></div>
            
            {/* Step 1: Destination */}
            {activeStep === 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <HiOutlineLocationMarker className="mr-2 text-[#f56551]" />
                  Where would you like to go?
                </h2>
                <p className="text-gray-600 mb-8">
                  Enter your dream destination and our AI will craft the perfect itinerary for you.
                </p>
                
                <div className="mb-6 relative">
                  <div className="flex items-center absolute left-3 top-3 text-gray-400">
                    <FiSearch />
                  </div>
                  <GooglePlacesAutocomplete
                    apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                    selectProps={{
                      place,
                      placeholder: "Search for a city, country, or landmark...",
                      onChange: (v) => { setPlace(v); handleInputChange('location', v) },
                      styles: {
                        control: (provided) => ({
                          ...provided,
                          padding: '8px',
                          paddingLeft: '30px',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        }),
                      }
                    }}
                  />
                </div>
                
                {formData?.location && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 p-4 rounded-lg flex items-start mb-6"
                  >
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <RiMapPinLine className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Selected Destination</h3>
                      <p className="text-gray-700">{formData.location.label}</p>
                    </div>
                  </motion.div>
                )}
                
                <div className="flex justify-between mt-10">
                  <div></div> {/* Empty div for spacing */}
                  <Button 
                    onClick={nextStep}
                    disabled={!formData?.location}
                    className={`rounded-full px-6 ${
                      formData?.location 
                        ? 'bg-gradient-to-r from-[#f56551] to-[#f79577] hover:opacity-90' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue <FiArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Trip Duration */}
            {activeStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <HiOutlineCalendar className="mr-2 text-[#f56551]" />
                  How many days are you planning to travel?
                </h2>
                <p className="text-gray-600 mb-8">
                  Tell us the duration of your trip so we can plan the perfect daily itinerary.
                </p>
                
                <div className="mb-6">
                  <div className="relative">
                    <div className="flex items-center absolute left-3 top-3 text-gray-400">
                      <FiClock />
                    </div>
                    <Input 
                      placeholder="Number of days (e.g. 3)" 
                      type="number" 
                      value={formData?.noOfDays || ''}
                      onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                      className="pl-10 py-6 text-lg rounded-xl"
                    />
                  </div>
                </div>
                
                {formData?.noOfDays && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 p-4 rounded-lg flex items-start mb-6"
                  >
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <HiOutlineCalendar className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Trip Duration</h3>
                      <p className="text-gray-700">{formData.noOfDays} {parseInt(formData.noOfDays) === 1 ? 'day' : 'days'}</p>
                    </div>
                  </motion.div>
                )}
                
                <div className="flex justify-between mt-10">
                  <Button 
                    onClick={prevStep}
                    variant="outline" 
                    className="rounded-full px-6"
                  >
                    Back
                  </Button>
                  
                  <Button 
                    onClick={nextStep}
                    disabled={!formData?.noOfDays}
                    className={`rounded-full px-6 ${
                      formData?.noOfDays 
                        ? 'bg-gradient-to-r from-[#f56551] to-[#f79577] hover:opacity-90' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue <FiArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Budget */}
            {activeStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <FiDollarSign className="mr-2 text-[#f56551]" />
                  What's your budget for this trip?
                </h2>
                <p className="text-gray-600 mb-8">
                  Select your budget range to help us suggest appropriate accommodations and activities.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SelectBudgetOptions.map((item, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      onClick={() => handleInputChange('budget', item.title)}
                      className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                        formData?.budget === item.title 
                          ? 'bg-gradient-to-br from-white to-gray-50 border-[#f56551] border-2 shadow-lg' 
                          : 'bg-white border border-gray-200 hover:shadow-md'
                      }`}
                    >
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                      
                      {formData?.budget === item.title && (
                        <div className="mt-3 inline-flex items-center text-[#f56551] text-sm">
                          <HiSparkles className="mr-1" /> Selected
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-10">
                  <Button 
                    onClick={prevStep}
                    variant="outline" 
                    className="rounded-full px-6"
                  >
                    Back
                  </Button>
                  
                  <Button 
                    onClick={nextStep}
                    disabled={!formData?.budget}
                    className={`rounded-full px-6 ${
                      formData?.budget 
                        ? 'bg-gradient-to-r from-[#f56551] to-[#f79577] hover:opacity-90' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue <FiArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 4: Preferences */}
            {activeStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <RiCompass3Line className="mr-2 text-[#f56551]" />
                  What are your travel preferences?
                </h2>
                <p className="text-gray-600 mb-8">
                  Select your preferences to customize your trip experience.
                </p>

                {/* Preferences Categories */}
                <div className="space-y-6">
                  {/* Location Types */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FiMapPin className="mr-2 text-[#f56551]" />
                      Location Types
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {TravelPreferences.locationTypes.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            const currentPrefs = formData?.preferences || {};
                            const locationTypes = currentPrefs.locationTypes || [];
                            
                            // Toggle selection
                            const newLocationTypes = locationTypes.includes(item.title)
                              ? locationTypes.filter(type => type !== item.title)
                              : [...locationTypes, item.title];
                            
                            handleInputChange('preferences', {
                              ...currentPrefs,
                              locationTypes: newLocationTypes
                            });
                          }}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            formData?.preferences?.locationTypes?.includes(item.title)
                              ? 'bg-gradient-to-r from-[#f56551]/20 to-[#f79577]/20 border border-[#f56551]/30'
                              : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{item.icon}</span>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-xs text-gray-500">{item.desc}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Preferences */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <HiSparkles className="mr-2 text-[#f56551]" />
                      Learning Preferences
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                      {TravelPreferences.learning.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            const currentPrefs = formData?.preferences || {};
                            const learning = currentPrefs.learning || [];
                            
                            // Toggle selection
                            const newLearning = learning.includes(item.title)
                              ? learning.filter(type => type !== item.title)
                              : [...learning, item.title];
                            
                            handleInputChange('preferences', {
                              ...currentPrefs,
                              learning: newLearning
                            });
                          }}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            formData?.preferences?.learning?.includes(item.title)
                              ? 'bg-gradient-to-r from-[#f56551]/20 to-[#f79577]/20 border border-[#f56551]/30'
                              : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{item.icon}</span>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-xs text-gray-500">{item.desc}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MdOutlineTravelExplore className="mr-2 text-[#f56551]" />
                      Physical Activities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                      {TravelPreferences.activities.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            const currentPrefs = formData?.preferences || {};
                            const activities = currentPrefs.activities || [];
                            
                            // Toggle selection
                            const newActivities = activities.includes(item.title)
                              ? activities.filter(type => type !== item.title)
                              : [...activities, item.title];
                            
                            handleInputChange('preferences', {
                              ...currentPrefs,
                              activities: newActivities
                            });
                          }}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            formData?.preferences?.activities?.includes(item.title)
                              ? 'bg-gradient-to-r from-[#f56551]/20 to-[#f79577]/20 border border-[#f56551]/30'
                              : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{item.icon}</span>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-xs text-gray-500">{item.desc}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Relaxation */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FiClock className="mr-2 text-[#f56551]" />
                      Relaxation Options
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                      {TravelPreferences.relaxation.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            const currentPrefs = formData?.preferences || {};
                            const relaxation = currentPrefs.relaxation || [];
                            
                            // Toggle selection
                            const newRelaxation = relaxation.includes(item.title)
                              ? relaxation.filter(type => type !== item.title)
                              : [...relaxation, item.title];
                            
                            handleInputChange('preferences', {
                              ...currentPrefs,
                              relaxation: newRelaxation
                            });
                          }}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            formData?.preferences?.relaxation?.includes(item.title)
                              ? 'bg-gradient-to-r from-[#f56551]/20 to-[#f79577]/20 border border-[#f56551]/30'
                              : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{item.icon}</span>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-xs text-gray-500">{item.desc}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-10">
                  <Button 
                    onClick={prevStep}
                    variant="outline" 
                    className="rounded-full px-6"
                  >
                    Back
                  </Button>
                  
                  <Button 
                    onClick={nextStep}
                    disabled={!formData?.preferences || 
                             (!formData?.preferences?.locationTypes?.length && 
                              !formData?.preferences?.learning?.length && 
                              !formData?.preferences?.activities?.length && 
                              !formData?.preferences?.relaxation?.length)}
                    className={`rounded-full px-6 ${
                      formData?.preferences &&
                      (formData?.preferences?.locationTypes?.length ||
                       formData?.preferences?.learning?.length ||
                       formData?.preferences?.activities?.length ||
                       formData?.preferences?.relaxation?.length)
                        ? 'bg-gradient-to-r from-[#f56551] to-[#f79577] hover:opacity-90' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue <FiArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 5: Travelers */}
            {activeStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <HiOutlineUserGroup className="mr-2 text-[#f56551]" />
                  Who's traveling with you?
                </h2>
                <p className="text-gray-600 mb-8">
                  Select your travel group to help us tailor activities and accommodations.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {SelectTravelesList.map((item, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      onClick={() => handleInputChange('traveler', item.people)}
                      className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                        formData?.traveler === item.people 
                          ? 'bg-gradient-to-br from-white to-gray-50 border-[#f56551] border-2 shadow-lg' 
                          : 'bg-white border border-gray-200 hover:shadow-md'
                      }`}
                    >
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                      
                      {formData?.traveler === item.people && (
                        <div className="mt-3 inline-flex items-center text-[#f56551] text-sm">
                          <HiSparkles className="mr-1" /> Selected
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-10">
                  <Button 
                    onClick={prevStep}
                    variant="outline" 
                    className="rounded-full px-6"
                  >
                    Back
                  </Button>
                  
                  <Button 
                    onClick={OnGenerateTrip}
                    disabled={!isFormComplete() || loading}
                    className="rounded-full px-8 py-6 bg-gradient-to-r from-[#f56551] to-[#f79577] hover:opacity-90 transition-all duration-300 relative overflow-hidden"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="relative w-36 h-8">
                          {/* Flight path with dot trail */}
                          <div className="absolute left-0 top-4 w-full h-[2px] bg-white/30 rounded"></div>
                          
                          {/* Flight icon that moves along the path */}
                          <motion.div 
                            className="absolute"
                            animate={{
                              x: [0, 150],
                              y: [0, -5, 0, 5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                            style={{ left: "0%", top: "50%" }}
                          >
                            <FaPlaneDeparture className="text-white h-5 w-5" />
                          </motion.div>
                          
                          {/* Animated dots for the flight path */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div 
                              key={i}
                              className="absolute w-1.5 h-1.5 bg-white rounded-full"
                              style={{ 
                                left: `${(i + 1) * 20}%`, 
                                top: "50%",
                                opacity: 0.7 - (i * 0.1)
                              }}
                              animate={{
                                opacity: [0.7 - (i * 0.1), 0.3, 0.7 - (i * 0.1)]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                          
                          <span className="absolute right-0 whitespace-nowrap text-white">
                            Crafting your trip...
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <MdFlightTakeoff className="mr-2 text-xl" />
                        Generate Your Trip
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={openAuthDialog} 
        onClose={() => {
          setOpenAuthDialog(false);
          // If user logged in while dialog was open, attempt to generate trip
          if (currentUser && userJustLoggedIn && isFormComplete()) {
            OnGenerateTrip();
            setUserJustLoggedIn(false);
          }
        }} 
      />
    </div>
  )
}

export default CreateTrip