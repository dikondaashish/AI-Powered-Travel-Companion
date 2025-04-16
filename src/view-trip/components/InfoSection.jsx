import { Button } from '@/components/ui/button'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState, useRef } from 'react'
import { IoIosSend } from "react-icons/io";
import { IoCalendar, IoWallet, IoPeople } from "react-icons/io5";
import { motion } from 'framer-motion';
import { MdDownload, MdContentCopy } from 'react-icons/md';
import { FaShareAlt } from 'react-icons/fa';
import { toast } from 'sonner';
import { FiDownload, FiLink, FiMail } from 'react-icons/fi';
import { downloadTripAsPDF, copyTripLink, shareTripViaEmail } from '@/utils/trip-sharing';

function InfoSection({trip}) {
  const [photoUrl, setPhotoUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState('');
  const tripSectionRef = useRef(null);
  
  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip])

  const GetPlacePhoto = async () => {
    setLoading(true);
    try {
      const data = {
        textQuery: trip?.userSelection?.location?.label
      }
      await GetPlaceDetails(data).then(resp => {
        console.log(resp.data.places[0].photos[6].name);
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
        setPhotoUrl(PhotoUrl);
      });
    } catch (error) {
      console.error("Error fetching place photo:", error);
    } finally {
      setLoading(false);
    }
  }
  
  /**
   * Downloads trip information as a PDF
   */
  const handleDownload = async () => {
    setProcessingAction('download');
    try {
      const success = await downloadTripAsPDF('trip-content', trip?.userSelection?.location?.label || 'trip');
      if (success) {
        toast.success("Trip details downloaded as PDF");
      } else {
        toast.error("Could not download trip details. Please try again.");
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Could not download trip details. Please try again.");
    } finally {
      setProcessingAction('');
    }
  };
  
  /**
   * Copies the current URL to clipboard
   */
  const handleShare = async () => {
    setProcessingAction('share');
    try {
      const success = await copyTripLink();
      if (success) {
        toast.success("Trip link copied to clipboard!");
      } else {
        toast.error("Couldn't copy link. Please copy manually from your address bar.");
      }
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Couldn't copy link. Please copy manually from your address bar.");
    } finally {
      setProcessingAction('');
    }
  };
  
  /**
   * Opens email client with trip information
   */
  const handleSendEmail = () => {
    setProcessingAction('email');
    try {
      if (!trip || !trip.userSelection) {
        toast.error("Trip data not available for sharing");
        return;
      }
      
      const destination = trip.userSelection?.location?.label || 'Destination';
      const days = trip.userSelection?.noOfDays || '0';
      const subject = `Trip Plan for ${destination}`;
      const body = `Check out my ${days}-day trip to ${destination}!\n\nView it here: ${window.location.href}`;
      
      const success = shareTripViaEmail(subject, body);
      if (success) {
        toast.success("Email client opened");
      } else {
        toast.error("Could not open email client. Please try again.");
      }
    } catch (error) {
      console.error("Email open failed:", error);
      toast.error("Could not open email client. Please try again.");
    } finally {
      setProcessingAction('');
    }
  };
  
  return (
    <div id="trip-content" className="bg-white rounded-2xl shadow-md overflow-hidden" ref={tripSectionRef}>
      <div className="relative">
        {/* Image skeleton loader */}
        {loading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        
        {/* Main image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-[340px] w-full"
        >
          <img 
            src={photoUrl ? photoUrl : '/placeholder.jpg'} 
            className="h-full w-full object-cover"
            alt={trip?.userSelection?.location?.label || "Destination"}
            onLoad={() => setLoading(false)}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Location name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold">
              {trip?.userSelection?.location?.label || "Your Destination"}
            </h1>
          </div>
        </motion.div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Trip details */}
          <div className="flex flex-wrap gap-3">
            <motion.div 
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700"
            >
              <IoCalendar className="text-[#f56551]" />
              <span>{trip?.userSelection?.noOfDays || "0"} {trip?.userSelection?.noOfDays === 1 ? 'Day' : 'Days'}</span>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700"
            >
              <IoWallet className="text-[#f56551]" />
              <span>{trip?.userSelection?.budget || "Budget"}</span>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700"
            >
              <IoPeople className="text-[#f56551]" />
              <span>{trip?.userSelection?.traveler || "0"} {trip?.userSelection?.traveler === 1 ? 'Traveler' : 'Travelers'}</span>
            </motion.div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex items-center gap-2 rounded-full"
              disabled={processingAction === 'download'}
              onClick={handleDownload}
            >
              {processingAction === 'download' ? (
                <div className="flex items-center">
                  <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full mr-2"></div>
                  <span className="hidden sm:inline">Processing...</span>
                </div>
              ) : (
                <>
                  <MdDownload />
                  <span className="hidden sm:inline">Download</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              className="flex items-center gap-2 rounded-full"
              disabled={processingAction === 'share'}
              onClick={handleShare}
            >
              {processingAction === 'share' ? (
                <div className="flex items-center">
                  <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full mr-2"></div>
                  <span className="hidden sm:inline">Processing...</span>
                </div>
              ) : (
                <>
                  <MdContentCopy className="sm:mr-1" />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </Button>
            
            <Button
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f56551] to-[#f79577] hover:from-[#f56551]/90 hover:to-[#f79577]/90"
              disabled={processingAction === 'email'}
              onClick={handleSendEmail}
            >
              {processingAction === 'email' ? (
                <div className="flex items-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-white/20 rounded-full mr-2"></div>
                  <span className="hidden sm:inline">Processing...</span>
                </div>
              ) : (
                <>
                  <IoIosSend />
                  <span className="hidden sm:inline">Email</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TripShareButtons = ({ tripData, tripId }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2 transition-all hover:bg-indigo-50"
        onClick={() => downloadTripAsPDF(tripData, tripId)}
      >
        <FiDownload className="w-4 h-4" />
        <span className="hidden sm:inline">Download PDF</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2 transition-all hover:bg-indigo-50"
        onClick={() => copyTripLink(tripId)}
      >
        <FiLink className="w-4 h-4" />
        <span className="hidden sm:inline">Copy Link</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2 transition-all hover:bg-indigo-50"
        onClick={() => shareTripViaEmail(tripData, tripId)}
      >
        <FiMail className="w-4 h-4" />
        <span className="hidden sm:inline">Share via Email</span>
      </Button>
    </div>
  );
};

export default InfoSection