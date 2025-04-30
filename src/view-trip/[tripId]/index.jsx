import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import PackingChecklist from '../components/PackingChecklist';
import WeatherForecast from '../components/WeatherForecast';
import LocalEvents from '../components/LocalEvents';
import TravelNotes from '../components/TravelNotes';
import BudgetSummary from '../components/BudgetSummary';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAutoAwesome, MdOutlineExplore, MdFlightTakeoff, MdLocationOn, MdErrorOutline, MdMap } from "react-icons/md";
import { HiSparkles } from 'react-icons/hi2';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaPlaneDeparture } from "react-icons/fa";
import { BiRestaurant } from "react-icons/bi";
import TripMap from '../components/TripMap';
import { useSEO } from '@/context/SEOContext';

function Viewtrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);
    const { pageSEO } = useSEO();

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => {
            setAnimationComplete(true);
        }, 1500);
        
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        tripId && GetTripData();
    }, [tripId]);

    /**
     * Used to get Trip Information from Firebase
     */
    const GetTripData = async () => {
        setLoading(true);
        setError(false);
        
        try {
            const docRef = doc(db, 'AITrips', tripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document:", docSnap.data());
                setTrip(docSnap.data());
            } else {
                console.log("No Such Document");
                setError(true);
                toast('No trip found!');
            }
        } catch (err) {
            console.error("Error fetching trip:", err);
            setError(true);
            toast('Error loading trip data');
        } finally {
            setLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    // Get destination name for SEO
    const destinationName = trip?.userSelection?.location?.label || '';

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-20 px-4 sm:px-6">
            {/* Dynamic SEO for trip page */}
            {pageSEO.viewTrip(tripId, destinationName)}
            
            {/* AI Data Processing Animation */}
            <AnimatePresence>
                {loading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-white/80 backdrop-blur-sm"
                    >
                        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#f56551]/10 flex items-center justify-center">
                                    <MdAutoAwesome className="text-[#f56551] text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">AI Trip Analysis</h3>
                                    <p className="text-sm text-gray-500">Processing your travel data</p>
                                </div>
                            </div>
                            
                            <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
                                <motion.div 
                                    className="absolute h-full bg-gradient-to-r from-[#f56551] to-[#f79577]"
                                    initial={{ width: 0 }}
                                    animate={{ 
                                        width: ["0%", "40%", "60%", "85%", "95%"] 
                                    }}
                                    transition={{ 
                                        duration: 3,
                                        times: [0, 0.3, 0.5, 0.8, 1],
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                            
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <motion.div 
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <HiSparkles className="text-yellow-500" />
                                    </motion.div>
                                    <span className="text-sm font-medium">Processing places & recommendations</span>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-gray-200"></div>
                                <motion.div 
                                    className="absolute"
                                    animate={{
                                        x: [0, 250, 0],
                                        y: [0, -5, 0, 5, 0]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    style={{ left: 0, top: "50%" }}
                                >
                                    <FaPlaneDeparture className="text-[#f56551] h-5 w-5" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4"
                >
                    <div className="rounded-full bg-red-100 p-2 text-red-600">
                        <MdErrorOutline className="text-xl" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-red-800">Trip not found</h3>
                        <p className="text-red-700">We couldn't find the trip you're looking for. It may have been deleted or the ID might be incorrect.</p>
                    </div>
                </motion.div>
            )}
            
            {!loading && !error && (
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center bg-purple-100 px-4 py-1 rounded-full text-purple-800 font-medium text-sm mb-4">
                            <MdAutoAwesome className="mr-2" />
                            <span>AI-Generated Travel Plan</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#f56551] to-[#f79577]">
                            Your Perfect Itinerary
                        </h1>
                        
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We've crafted a personalized travel experience just for you
                        </p>
                    </motion.div>
                    
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-12"
                    >
                        {/* Trip Overview Card */}
                        <motion.div variants={itemVariants} className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
                            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-gradient-to-br from-[#f56551]/10 to-[#f79577]/10 rounded-full blur-3xl"></div>
                            
                            <InfoSection trip={trip} />
                        </motion.div>

                        {/* Hotels Section */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-2xl shadow-md p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-100 p-2 rounded-xl">
                                    <MdLocationOn className="text-blue-600 text-xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Recommended Stays</h2>
                            </div>
                            <Hotels trip={trip} />
                        </motion.div>
                        
                        {/* Packing Checklist Section */}
                        <motion.div variants={itemVariants}>
                            <PackingChecklist trip={trip} />
                        </motion.div>
                        
                        {/* Weather Forecast Section */}
                        <motion.div variants={itemVariants}>
                            <WeatherForecast trip={trip} />
                        </motion.div>
                        
                        {/* Places Section */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-2xl shadow-md p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-amber-100 p-2 rounded-xl">
                                    <MdOutlineExplore className="text-amber-600 text-xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Your Journey</h2>
                            </div>
                            <PlacesToVisit trip={trip} />
                        </motion.div>
                        
                        {/* Budget Summary Section */}
                        <motion.div variants={itemVariants}>
                            <BudgetSummary trip={trip} />
                        </motion.div>
                        
                        {/* Travel Notes Section */}
                        <motion.div variants={itemVariants}>
                            <TravelNotes trip={trip} />
                        </motion.div>
                        
                        {/* Trip Map Section */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-2xl shadow-md p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-green-100 p-2 rounded-xl">
                                    <MdMap className="text-green-600 text-xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Interactive Map</h2>
                            </div>
                            <TripMap trip={trip} />
                        </motion.div>
                        
                        {/* Local Events Section */}
                        <motion.div variants={itemVariants}>
                            <LocalEvents trip={trip} />
                        </motion.div>
                        
                        {/* AI Insight Card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-r from-[#f56551]/10 to-[#f79577]/10 rounded-2xl p-6 sm:p-8"
                        >
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#f56551] to-[#f79577] flex items-center justify-center">
                                    <HiSparkles className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">AI Travel Insights</h3>
                                    <p className="text-gray-700">
                                        This travel plan was specifically crafted for {trip?.userSelection?.traveler || 'you'} with a {trip?.userSelection?.budget || 'moderate'} budget 
                                        for {trip?.userSelection?.noOfDays || 'several'} days. Our AI analyzed thousands of options to create this perfect itinerary.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Footer */}
                        <motion.div variants={itemVariants}>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default Viewtrip;