import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';
import { db } from '@/service/firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { toast } from "sonner";
import { FiUser, FiUpload, FiMapPin, FiTrash2, FiPlus } from "react-icons/fi";
import { MdLanguage, MdRestaurant, MdAttachMoney, MdHome, MdWork, MdHotel, MdPlace } from "react-icons/md";
import Autocomplete from 'react-google-places-autocomplete';

const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'russian', label: 'Russian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'korean', label: 'Korean' }
];

const PROFICIENCY_OPTIONS = [
  { value: 'native', label: 'Native' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'basic', label: 'Basic Words' }
];

const FOOD_PREFERENCE_OPTIONS = [
  { value: 'omnivore', label: 'Omnivore' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'gluten-free', label: 'Gluten-Free' }
];

const FOOD_RESTRICTION_OPTIONS = [
  { value: 'egg', label: 'Egg' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'nut', label: 'Nut' },
  { value: 'peanut', label: 'Peanut' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'soy', label: 'Soy' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'fish', label: 'Fish' },
  { value: 'corn', label: 'Corn' }
];

const INCOME_BAND_OPTIONS = [
  { value: 'under-50k', label: 'Under $50K' },
  { value: '50k-100k', label: '$50K–$100K' },
  { value: '100k-150k', label: '$100K–$150K' },
  { value: '150k-200k', label: '$150K–$200K' },
  { value: '200k-300k', label: '$200K–$300K' },
  { value: '300k-500k', label: '$300K–$500K' },
  { value: 'over-500k', label: 'Over $500K' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const ADDRESS_LABEL_OPTIONS = [
  { value: 'home', label: 'Home', icon: <MdHome className="h-4 w-4 mr-2" /> },
  { value: 'work', label: 'Work', icon: <MdWork className="h-4 w-4 mr-2" /> },
  { value: 'hotel', label: 'Hotel', icon: <MdHotel className="h-4 w-4 mr-2" /> },
  { value: 'other', label: 'Other', icon: <MdPlace className="h-4 w-4 mr-2" /> }
];

const EditProfileDialog = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const fileInputRef = useRef(null);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    languages: [],
    foodPreference: '',
    foodRestrictions: [],
    incomeBand: '',
    addresses: []
  });

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showLabelSelection, setShowLabelSelection] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');

  // Load user data when dialog opens
  useEffect(() => {
    if (isOpen && currentUser) {
      loadUserData();
    }
  }, [isOpen, currentUser]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Loaded user data:', userData);
        console.log('Loaded addresses:', userData.addresses || []);
        
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          gender: userData.gender || '',
          languages: userData.languages || [],
          foodPreference: userData.foodPreference || '',
          foodRestrictions: userData.foodRestrictions || [],
          incomeBand: userData.incomeBand || '',
          addresses: userData.addresses || []
        });
        
        if (userData.profilePicture) {
          setProfileImagePreview(userData.profilePicture);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageAdd = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', proficiency: '' }]
    }));
  };

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    setFormData(prev => ({ ...prev, languages: updatedLanguages }));
  };

  const handleLanguageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleFoodRestrictionToggle = (value) => {
    setFormData(prev => {
      const restrictions = prev.foodRestrictions.includes(value)
        ? prev.foodRestrictions.filter(item => item !== value)
        : [...prev.foodRestrictions, value];
      
      return { ...prev, foodRestrictions: restrictions };
    });
  };

  const handlePlaceSelect = (place) => {
    if (place && place.value) {
      console.log('Selected Place:', place);
      setSelectedPlace(place);
      setShowLabelSelection(true);
      setSelectedLabel('home'); // Default selection
    } else {
      console.error('Invalid place selection:', place);
      toast.error('Failed to add address');
    }
  };

  const handleAddressAdd = () => {
    if (selectedPlace && selectedLabel) {
      const newAddress = {
        id: Date.now().toString(),
        placeId: selectedPlace.value.place_id,
        formattedAddress: selectedPlace.label || selectedPlace.value.description,
        label: selectedLabel,
        // Only include coordinates if they exist in the response
        ...(selectedPlace.value.geometry?.location?.lat && {
          lat: selectedPlace.value.geometry.location.lat,
          lng: selectedPlace.value.geometry.location.lng
        })
      };
      
      // Log the new address being added
      console.log('Adding address:', newAddress);
      
      setFormData(prev => ({
        ...prev,
        addresses: [...prev.addresses, newAddress]
      }));
      
      // Reset the selection state
      setSelectedPlace(null);
      setShowLabelSelection(false);
      setSelectedLabel('');
      
      toast.success('Address added successfully');
    }
  };

  const handleCancelAddAddress = () => {
    setSelectedPlace(null);
    setShowLabelSelection(false);
    setSelectedLabel('');
  };

  const handleAddressRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr.id !== id)
    }));
    toast.success('Address removed');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size - limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    
    try {
      setUploadingImage(true);
      setProfileImage(file);
      
      // Show local preview immediately
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        // Compress the image before storing it
        const compressedImage = await compressImage(base64data, 800, 0.7);
        
        setProfileImagePreview(base64data); // Show full quality preview
        setCloudinaryUrl(compressedImage); // Store compressed image
      };
      reader.readAsDataURL(file);
      
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Helper function to compress image
  const compressImage = (base64, maxWidth, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const width = Math.min(maxWidth, img.width);
        const scaleFactor = width / img.width;
        const height = img.height * scaleFactor;
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG and compress
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Use the Cloudinary URL if it exists, otherwise keep existing profile picture URL
      const profilePictureUrl = cloudinaryUrl || profileImagePreview;
      
      // Update user document in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        languages: formData.languages,
        foodPreference: formData.foodPreference,
        foodRestrictions: formData.foodRestrictions,
        incomeBand: formData.incomeBand,
        addresses: formData.addresses,
        profilePicture: profilePictureUrl,
        updatedAt: new Date()
      });
      
      // Update localStorage with new data
      const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUserData = {
        ...currentUserData,
        name: `${formData.firstName} ${formData.lastName}`,
        given_name: formData.firstName,
        picture: profilePictureUrl,
        gender: formData.gender
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      toast.success('Profile updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Update your personal information and preferences
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="relative">
                  <img 
                    src={profileImagePreview || '/placeholder.jpg'} 
                    alt="Profile" 
                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-md hover:bg-primary/90"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <FiUpload className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {uploadingImage ? 'Uploading...' : 'Click to upload a new profile picture'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <MdLanguage className="h-5 w-5" />
                  Language Skills
                </h3>
                
                {formData.languages.map((lang, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label>Language</Label>
                      <Select
                        value={lang.language}
                        onValueChange={(value) => handleLanguageChange(index, 'language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGE_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Label>Proficiency</Label>
                      <Select
                        value={lang.proficiency}
                        onValueChange={(value) => handleLanguageChange(index, 'proficiency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select proficiency" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROFICIENCY_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleLanguageRemove(index)}
                      className="mb-1"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLanguageAdd}
                  className="w-full"
                >
                  <FiPlus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <MdRestaurant className="h-5 w-5" />
                  Food Preferences
                </h3>
                
                <div className="space-y-2">
                  <Label>Dietary Preference</Label>
                  <Select
                    value={formData.foodPreference}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, foodPreference: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select dietary preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOOD_PREFERENCE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Food Restrictions</Label>
                  <div className="flex flex-wrap gap-2">
                    {FOOD_RESTRICTION_OPTIONS.map(option => (
                      <div
                        key={option.value}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                          formData.foodRestrictions.includes(option.value)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => handleFoodRestrictionToggle(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <MdAttachMoney className="h-5 w-5" />
                  Income Band
                </h3>
                
                <div className="space-y-2">
                  <Select
                    value={formData.incomeBand}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, incomeBand: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select income band" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOME_BAND_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="addresses" className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <FiMapPin className="h-5 w-5" />
                Saved Addresses
              </h3>
              
              <div className="space-y-2">
                <Label>Add New Address</Label>
                {!showLabelSelection ? (
                  <Autocomplete
                    apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                    selectProps={{
                      placeholder: "Search for an address...",
                      onChange: handlePlaceSelect,
                      styles: {
                        control: (provided) => ({
                          ...provided,
                          padding: '4px',
                          borderRadius: '0.375rem',
                          border: '1px solid #e2e8f0',
                        }),
                      },
                      value: null,
                    }}
                  />
                ) : (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                    <div>
                      <p className="text-sm font-medium mb-1">Selected Address:</p>
                      <p className="text-sm">{selectedPlace?.label || selectedPlace?.value?.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Choose a label for this address:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {ADDRESS_LABEL_OPTIONS.map(option => (
                          <div
                            key={option.value}
                            className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer border ${
                              selectedLabel === option.value
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => setSelectedLabel(option.value)}
                          >
                            {option.icon}
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2">
                      <Button type="button" variant="outline" size="sm" onClick={handleCancelAddAddress}>
                        Cancel
                      </Button>
                      <Button type="button" size="sm" onClick={handleAddressAdd}>
                        Save Address
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 mt-4">
                {formData.addresses && formData.addresses.length > 0 ? (
                  formData.addresses.map(address => (
                    <div key={address.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex-1">
                        <div className="flex items-center">
                          {address.label && (
                            <span className="inline-flex items-center text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded-full mr-2">
                              {address.label === 'home' && <MdHome className="h-3 w-3 mr-1" />}
                              {address.label === 'work' && <MdWork className="h-3 w-3 mr-1" />}
                              {address.label === 'hotel' && <MdHotel className="h-3 w-3 mr-1" />}
                              {address.label === 'other' && <MdPlace className="h-3 w-3 mr-1" />}
                              {ADDRESS_LABEL_OPTIONS.find(opt => opt.value === address.label)?.label || 'Address'}
                            </span>
                          )}
                          <p className="font-medium">{address.formattedAddress}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddressRemove(address.id)}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No addresses saved yet</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploadingImage}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog; 