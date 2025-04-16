import React, { useState, useContext, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { storage } from '../service/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditProfileDialog = ({ open, onClose }) => {
  const { currentUser, updateUserProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    bio: '',
    location: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user data from localStorage
  useEffect(() => {
    if (open) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const names = userData.name ? userData.name.split(' ') : ['', ''];
      
      setFormData({
        firstName: userData.given_name || names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        bio: userData.bio || '',
        location: userData.location || '',
      });
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Profile picture must be less than 5MB');
        return;
      }
      setProfilePicture(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      let profilePicture = userData.picture;

      if (profilePicture && currentUser) {
        try {
          const storageRef = ref(storage, `profile-pictures/${currentUser.uid}/${Date.now()}-${profilePicture.name}`);
          await uploadBytes(storageRef, profilePicture);
          profilePicture = await getDownloadURL(storageRef);
        } catch (uploadError) {
          console.error("Error uploading profile picture:", uploadError);
          setError('Failed to upload profile picture');
          setLoading(false);
          return;
        }
      }

      const updatedData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        location: formData.location,
      };

      if (profilePicture) {
        updatedData.profilePicture = profilePicture;
      }

      if (currentUser) {
        await updateUserProfile(currentUser.uid, updatedData);
        onClose();
      } else {
        setError('You must be logged in to update your profile');
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  // Get user picture from localStorage
  const userPicture = JSON.parse(localStorage.getItem('user') || '{}').picture;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar
              src={profilePicture ? URL.createObjectURL(profilePicture) : userPicture}
              sx={{ width: 100, height: 100 }}
            />
            <Button
              component="label"
              variant="outlined"
              size="small"
            >
              Change Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </Button>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfileDialog; 