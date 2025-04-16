import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useNavigation } from 'react-router-dom';
import { RiMapPinLine, RiCompass3Line } from "react-icons/ri";
import { MdOutlineExplore } from "react-icons/md";
import { BarChart3, Settings, LogOut } from "lucide-react";
import AuthDialog from './AuthDialog';
import EditProfileDialog from './EditProfileDialog';
import { useAuth } from '@/context/AuthContext';

function Header() {
  const { currentUser, logout } = useAuth();
  const user = currentUser ? JSON.parse(localStorage.getItem('user')) : null;
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Add scroll event listener to create transparency effect
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className='max-w-7xl mx-auto p-4 flex justify-between items-center'>
        {/* Logo Section */}
        <a href='/' className='flex items-center transition-transform hover:scale-105'>
          <img src='/logo.svg' alt="AI Travel Guide" className='h-10' />
        </a>

        {/* Navigation and User Section */}
        <div className='flex items-center gap-4'>
          {user ? (
            <div className='flex items-center gap-3'>
              <a href='/create-trip'>
                <Button 
                  variant="outline" 
                  className="rounded-full transition-all duration-300 hover:bg-primary hover:text-white flex items-center gap-2"
                >
                  <MdOutlineExplore className="h-4 w-4" />
                  <span>Create Trip</span>
                </Button>
              </a>
              <a href='/my-trips'>
                <Button 
                  variant="outline" 
                  className="rounded-full transition-all duration-300 hover:bg-primary hover:text-white flex items-center gap-2"
                >
                  <RiMapPinLine className="h-4 w-4" />
                  <span>My Trips</span>
                </Button>
              </a>
              <a href='/trip-stats'>
                <Button 
                  variant="outline" 
                  className="rounded-full transition-all duration-300 hover:bg-primary hover:text-white flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Trip Stats</span>
                </Button>
              </a>
              <Popover>
                <PopoverTrigger>
                  <div className='relative group'>
                    <img 
                      src={user?.picture} 
                      className='h-10 w-10 rounded-full border-2 border-transparent transition-all duration-300 group-hover:border-primary object-cover'
                      alt={user?.name}
                    />
                    <div className='absolute -bottom-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-white'></div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user?.picture} 
                        className='h-10 w-10 rounded-full'
                        alt={user?.name}
                      />
                      <div>
                        <p className="font-medium text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="border-t pt-2 space-y-1">
                      <button 
                        className='w-full text-left text-sm py-2 px-3 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2' 
                        onClick={() => setOpenEditProfile(true)}
                      >
                        <Settings className="h-4 w-4" />
                        Edit Profile
                      </button>
                      <button 
                        className='w-full text-left text-sm py-2 px-3 rounded-md hover:bg-gray-100 text-red-500 transition-colors flex items-center gap-2' 
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button 
              onClick={() => setOpenDialog(true)}
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg transition-all duration-300 px-6"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog isOpen={openDialog} onClose={() => setOpenDialog(false)} />
      
      {/* Edit Profile Dialog */}
      <EditProfileDialog isOpen={openEditProfile} onClose={() => setOpenEditProfile(false)} />
    </div>
  )
}

export default Header