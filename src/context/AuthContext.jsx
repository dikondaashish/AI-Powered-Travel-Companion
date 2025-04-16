import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const auth = getAuth();

  // Sign in with email and password
  async function login(email, password) {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      // Store user data in localStorage for app usage
      const userData = userDoc.data();
      localStorage.setItem('user', JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: `${userData.firstName} ${userData.lastName}`,
        given_name: userData.firstName,
        picture: userData.profilePicture,
        gender: userData.gender
      }));
      
      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Sign in with Google
  async function googleLogin() {
    try {
      setError('');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user document if it doesn't exist
        const userData = {
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          email: result.user.email,
          profilePicture: result.user.photoURL,
          gender: 'Not specified',
          createdAt: new Date()
        };
        
        await setDoc(userRef, userData);
      }
      
      // Store user data in localStorage for app usage
      const userData = userDoc.exists() ? userDoc.data() : {
        firstName: result.user.displayName?.split(' ')[0] || '',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || ''
      };
      
      localStorage.setItem('user', JSON.stringify({
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        given_name: userData.firstName,
        picture: result.user.photoURL,
        gender: userData.gender || 'Not specified'
      }));
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Register new user with email and password
  async function signup(email, password, firstName, lastName, gender) {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Set default profile picture based on gender
      let profilePicture = '/placeholder.jpg';
      if (gender === 'Male') {
        profilePicture = '/boy.jpg';
      } else if (gender === 'Female') {
        profilePicture = '/girl.jpg';
      }
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName,
        lastName,
        email,
        gender,
        profilePicture,
        createdAt: new Date()
      });
      
      // Store user data in localStorage for app usage
      localStorage.setItem('user', JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: `${firstName} ${lastName}`,
        given_name: firstName,
        picture: profilePicture,
        gender
      }));
      
      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Logout the user
  function logout() {
    localStorage.removeItem('user');
    return signOut(auth);
  }

  // Password reset
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Update user profile
  async function updateUserProfile(userId, data) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, data);
      
      // Update localStorage with new data
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      
      const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUserData = {
        ...currentUserData,
        name: `${userData.firstName} ${userData.lastName}`,
        given_name: userData.firstName,
        picture: userData.profilePicture,
        gender: userData.gender
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value = {
    currentUser,
    login,
    googleLogin,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 