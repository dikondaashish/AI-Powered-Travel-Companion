import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AuthDialog = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin, signup, resetPassword, error, setError } = useAuth();

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

  const [resetForm, setResetForm] = useState({
    email: ''
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    // Clear validation errors when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle signup form changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
    // Clear validation errors when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle gender selection
  const handleGenderChange = (value) => {
    setSignupForm(prev => ({ ...prev, gender: value }));
    if (formErrors.gender) {
      setFormErrors(prev => ({ ...prev, gender: '' }));
    }
  };

  // Handle reset form changes
  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetForm(prev => ({ ...prev, [name]: value }));
    // Clear validation errors when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate login form
  const validateLoginForm = () => {
    const errors = {};
    if (!loginForm.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) errors.email = 'Email is invalid';
    
    if (!loginForm.password) errors.password = 'Password is required';
    else if (loginForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate signup form
  const validateSignupForm = () => {
    const errors = {};
    if (!signupForm.firstName) errors.firstName = 'First name is required';
    if (!signupForm.lastName) errors.lastName = 'Last name is required';
    
    if (!signupForm.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) errors.email = 'Email is invalid';
    
    if (!signupForm.password) errors.password = 'Password is required';
    else if (signupForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    if (!signupForm.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (signupForm.password !== signupForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (!signupForm.gender) errors.gender = 'Please select your Gender';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate reset form
  const validateResetForm = () => {
    const errors = {};
    if (!resetForm.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(resetForm.email)) errors.email = 'Email is invalid';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    
    try {
      setLoading(true);
      await login(loginForm.email, loginForm.password);
      toast.success('Login successful! Welcome back.');
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await googleLogin();
      toast.success('Login successful! Welcome back.');
      onClose();
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignupForm()) return;
    
    try {
      setLoading(true);
      await signup(
        signupForm.email, 
        signupForm.password, 
        signupForm.firstName, 
        signupForm.lastName, 
        signupForm.gender
      );
      toast.success('Account created successfully! Welcome aboard.');
      onClose();
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use. Please login or use a different email.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!validateResetForm()) return;
    
    try {
      setLoading(true);
      await resetPassword(resetForm.email);
      toast.success('Password reset email sent! Please check your inbox.');
      setIsPasswordReset(false);
      setActiveTab('login');
      setResetForm({ email: '' });
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Password reset failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset form and errors when closing the dialog
  const handleDialogClose = () => {
    setLoginForm({ email: '', password: '' });
    setSignupForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: ''
    });
    setResetForm({ email: '' });
    setFormErrors({});
    setIsPasswordReset(false);
    setActiveTab('login');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {isPasswordReset 
              ? 'Reset Password' 
              : (activeTab === 'login' ? 'Welcome Back' : 'Create an Account')}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            {isPasswordReset 
              ? 'Enter your email to receive a password reset link' 
              : (activeTab === 'login' ? 'Sign in to your account' : 'Fill out the form to get started')}
          </DialogDescription>
        </DialogHeader>
        
        {!isPasswordReset ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <div className="space-y-4">
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full rounded-full flex gap-3 items-center justify-center py-6 border shadow-sm hover:shadow-md transition-all bg-white text-gray-800 hover:bg-gray-50"
                  disabled={loading}
                >
                  <FcGoogle className="h-5 w-5" />
                  <span>Continue with Google</span>
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input 
                        id="login-email" 
                        name="email"
                        type="email" 
                        placeholder="Enter your email" 
                        className="pl-10"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="p-0 h-auto text-sm text-blue-600"
                        onClick={() => setIsPasswordReset(true)}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    <div className="relative">
                      <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input 
                        id="login-password" 
                        name="password"
                        type="password" 
                        placeholder="Enter your password" 
                        className="pl-10"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                      />
                    </div>
                    {formErrors.password && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input 
                        id="first-name" 
                        name="firstName"
                        placeholder="First Name" 
                        className="pl-10"
                        value={signupForm.firstName}
                        onChange={handleSignupChange}
                      />
                    </div>
                    {formErrors.firstName && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input 
                        id="last-name" 
                        name="lastName"
                        placeholder="Last Name" 
                        className="pl-10"
                        value={signupForm.lastName}
                        onChange={handleSignupChange}
                      />
                    </div>
                    {formErrors.lastName && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      id="signup-email" 
                      name="email"
                      type="email" 
                      placeholder="Enter your email" 
                      className="pl-10"
                      value={signupForm.email}
                      onChange={handleSignupChange}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    onValueChange={handleGenderChange} 
                    value={signupForm.gender}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.gender && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.gender}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      id="signup-password" 
                      name="password"
                      type="password" 
                      placeholder="Create a password" 
                      className="pl-10"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                    />
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      id="confirm-password" 
                      name="confirmPassword"
                      type="password" 
                      placeholder="Confirm your password" 
                      className="pl-10"
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange}
                    />
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
              
              <div className="mt-4">
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full rounded-full flex gap-3 items-center justify-center py-2 border shadow-sm hover:shadow-md transition-all bg-white text-gray-800 hover:bg-gray-50"
                  disabled={loading}
                >
                  <FcGoogle className="h-4 w-4" />
                  <span className="text-sm">Or Sign Up with Google</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <form onSubmit={handlePasswordReset}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input 
                    id="reset-email" 
                    name="email"
                    type="email" 
                    placeholder="Enter your email" 
                    className="pl-10"
                    value={resetForm.email}
                    onChange={handleResetChange}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Reset Password'}
              </Button>
              
              <Button 
                type="button"
                variant="ghost" 
                className="w-full text-sm text-gray-500 hover:text-gray-800"
                onClick={() => setIsPasswordReset(false)}
                disabled={loading}
              >
                Back to Login
              </Button>
            </div>
          </form>
        )}
        
        <p className="text-xs text-gray-500 text-center mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog; 