import React, { useState } from 'react';

const UserManual = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              
            </h1>
            <p className="text-xl text-gray-600 mt-20">AI-Powered Travel Companion</p>
            <p className="text-lg font-medium text-gray-500">User Manual • Version 1.0 • April 2025</p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-5 sticky top-20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Table of Contents</h2>
              <nav className="space-y-2">
                <button 
                  onClick={() => scrollToSection('introduction')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm ${activeSection === 'introduction' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  1. Introduction
                </button>
                <button 
                  onClick={() => scrollToSection('getting-started')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm ${activeSection === 'getting-started' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  2. Getting Started
                </button>
                <button 
                  onClick={() => scrollToSection('create-trip')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm ${activeSection === 'create-trip' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  3. Create Trip
                </button>
                <button 
                  onClick={() => scrollToSection('view-trip')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm ${activeSection === 'view-trip' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  4. View Trip
                </button>
                <button 
                  onClick={() => scrollToSection('profile-management')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm ${activeSection === 'profile-management' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  5. Profile Management
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm ${activeSection === 'faq' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  6. Frequently Asked Questions
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm ${activeSection === 'contact' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  7. Contact Us
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-8">
              <p className="text-sm text-gray-500 mb-4">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

              <div className="prose max-w-none text-gray-600">
                {/* Introduction */}
                <section id="introduction" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">1. Introduction</h2>
                  <p className="mb-4">
                    Welcome to <strong>Viaona</strong>, your AI-powered travel companion!
                  </p>
                  <p className="mb-4">
                    With Viaona, you can effortlessly plan your dream trips, explore personalized itineraries, and manage your travel preferences. 
                    Whether you're a solo traveler, a couple, a family, or a group of friends, Viaona tailors your travel experience according to your 
                    specific needs.
                  </p>
                  <p>
                    Our intelligent system analyzes thousands of options to create the perfect travel plan just for you, taking into account your budget, 
                    preferences, and travel style.
                  </p>
                </section>

                {/* Getting Started */}
                <section id="getting-started" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">2. Getting Started</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Create an Account</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Sign up with your email address, or log in using your existing credentials</li>
                    <li>Link your social media accounts for quicker login</li>
                    <li>Secure your account with a strong password</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Set Up Your Profile</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Customize your profile by entering personal details:
                      <ul className="list-circle pl-6 mt-2">
                        <li>Name and contact information</li>
                        <li>Dietary restrictions</li>
                        <li>Travel style preferences</li>
                        <li>Language preferences</li>
                        <li>Special accommodations</li>
                      </ul>
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Start Planning Your Trip</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Navigate to the "Create Trip" section to begin planning your personalized adventure</li>
                    <li>Follow the simple step-by-step process to design your perfect getaway</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Authentication Flow</h3>
                  <p className="mb-4">
                    We've standardized the login experience throughout the site. When you attempt to create a trip or access features requiring 
                    authentication, you'll be directed to our consistent AuthDialog instead of different login interfaces.
                  </p>
                </section>

                {/* Create Trip */}
                <section id="create-trip" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">3. Create Trip</h2>
                  <p className="mb-4">
                    The Create Trip page allows you to generate a personalized travel plan based on your preferences.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Steps to Create a Trip:</h3>
                  
                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">1. Enter Your Destination</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Type the name of the city, country, or landmark you'd like to visit</li>
                    <li>The AI will suggest the best travel options for that location</li>
                    <li>Browse popular destinations or search for specific places</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">2. Select Trip Duration</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Choose the number of days you plan to spend on your trip</li>
                    <li>Set specific start and end dates for accurate planning</li>
                  </ul>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                    <p className="text-yellow-700">
                      <strong>Important:</strong> We recommend planning trips of 3-4 days for optimal AI generation results. 
                      Longer trips might cause generation errors, so we suggest keeping your itineraries within this range for the best experience.
                    </p>
                  </div>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">3. Set Your Budget</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Select your budget range:
                      <ul className="list-circle pl-6 mt-2">
                        <li>Budget-Friendly</li>
                        <li>Moderate</li>
                        <li>Luxury</li>
                      </ul>
                    </li>
                    <li>This helps the AI suggest accommodations and activities that align with your financial preferences</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">4. Choose Your Travel Preferences</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Location Types:</h5>
                      <ul className="list-disc pl-6">
                        <li>Urban</li>
                        <li>Beach</li>
                        <li>Mountains</li>
                        <li>Countryside</li>
                        <li>Historical destinations</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Learning Preferences:</h5>
                      <ul className="list-disc pl-6">
                        <li>Local culture</li>
                        <li>Cuisine</li>
                        <li>History</li>
                        <li>Art</li>
                        <li>Nature</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Physical Activities:</h5>
                      <ul className="list-disc pl-6">
                        <li>Hiking</li>
                        <li>Water sports</li>
                        <li>Cycling</li>
                        <li>Walking tours</li>
                        <li>Adventure sports</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Relaxation Options:</h5>
                      <ul className="list-disc pl-6">
                        <li>Spa treatments</li>
                        <li>Scenic views</li>
                        <li>Resort lounging</li>
                        <li>Cultural experiences</li>
                        <li>Entertainment venues</li>
                      </ul>
                    </div>
                  </div>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">5. Add Travelers</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Specify if you're traveling:
                      <ul className="list-circle pl-6 mt-2">
                        <li>Alone</li>
                        <li>With a partner</li>
                        <li>With family</li>
                        <li>With friends</li>
                      </ul>
                    </li>
                    <li>Add specific information about your travel companions</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">6. Generate Your Trip</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>After filling in all the necessary information, click on the "Generate Your Trip" button</li>
                    <li>Review your personalized itinerary within seconds</li>
                    <li>Make adjustments as needed</li>
                  </ul>
                </section>

                {/* View Trip */}
                <section id="view-trip" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">4. View Trip</h2>
                  <p className="mb-4">
                    Once you've created a trip, you can view the detailed itinerary and other travel information.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Trip Details:</h3>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Destination & Dates</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Your trip destination</li>
                    <li>Number of days</li>
                    <li>Budget overview</li>
                    <li>Travel dates</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Itinerary</h4>
                  <p className="mb-2">A day-by-day breakdown of your trip, including:</p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Activities with descriptions</li>
                    <li>Timings and durations</li>
                    <li>Ticket prices and booking options</li>
                    <li>Address/coordinates with navigation links</li>
                    <li>Additional notes and recommendations</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Packing Checklist</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>A smart packing list tailored for your destination and trip duration</li>
                    <li>Check off items as you pack</li>
                    <li>Customizable with personal items</li>
                    <li>Weather-appropriate suggestions</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Weather Forecast</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Stay updated with the weather forecast for your destination</li>
                    <li>5-day outlook for planning appropriate activities</li>
                    <li>Temperature ranges and precipitation predictions</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Recommended Stays</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Hotel recommendations based on your selected budget and preferences</li>
                    <li>Photos and detailed descriptions</li>
                    <li>User ratings and reviews</li>
                    <li>Proximity to planned activities</li>
                    <li>Booking links and price comparison</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Budget Breakdown</h4>
                  <p className="mb-2">Summary of estimated spending across different categories:</p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Accommodations</li>
                    <li>Food and dining</li>
                    <li>Tickets and attractions</li>
                    <li>Transportation</li>
                    <li>Miscellaneous expenses</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Interactive Map</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>View an interactive map with your trip's major locations</li>
                    <li>Hotels, restaurants, and attractions clearly marked</li>
                    <li>Distance calculations between points of interest</li>
                    <li>Public transportation options</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Event Calendar</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Local events and activities happening during your travel dates</li>
                    <li>Festivals, concerts, and special exhibitions</li>
                    <li>Seasonal attractions and opportunities</li>
                  </ul>
                  
                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Trip Stats</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>View statistics about your trips</li>
                    <li>Track your travel patterns and preferences</li>
                    <li>Analyze budget allocation across different trips</li>
                  </ul>
                </section>

                {/* Profile Management */}
                <section id="profile-management" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">5. Profile Management</h2>
                  <p className="mb-4">
                    Your Profile is where you can manage personal information, travel preferences, and saved addresses.
                  </p>
                  <p className="mb-4">
                    The Edit Profile option in the quick links has been improved with a dedicated EditProfileDialog component in the Footer, 
                    providing a more direct and consistent way to update your profile information.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">How to Edit Your Profile:</h3>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Personal Information</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Update your name, gender, and other basic details</li>
                    <li>Upload a new profile picture</li>
                    <li>Manage contact information</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Preferences</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Travel preferences</li>
                    <li>Language settings</li>
                    <li>Dietary restrictions (vegetarian, vegan, gluten-free, etc.)</li>
                    <li>Accessibility requirements</li>
                    <li>Notification settings</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Saved Addresses</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Add or edit your home address</li>
                    <li>Save frequently visited locations</li>
                    <li>Store important addresses for trip planning</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-700 mt-5 mb-2">Logout</h4>
                  <ul className="list-disc pl-6 mb-4">
                    <li>When you're finished, you can log out of your account from the Profile page</li>
                    <li>Remember to log out when using shared devices</li>
                  </ul>
                </section>

                {/* FAQs */}
                <section id="faq" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">6. Frequently Asked Questions</h2>

                  <div className="space-y-6 mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Q: How does the AI generate my travel plan?</h3>
                      <p className="text-gray-600">
                        <strong>A:</strong> The AI uses a combination of your travel preferences, budget, and destination information to recommend the best itinerary. 
                        It analyzes thousands of options, including flights, accommodations, activities, and food choices, to craft a personalized trip.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Q: Can I edit my itinerary after it's generated?</h3>
                      <p className="text-gray-600">
                        <strong>A:</strong> Yes! You can modify your trip by adding or removing activities, changing hotel recommendations, or adjusting your budget. 
                        Your itinerary remains flexible until you finalize your bookings.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Q: What if my destination isn't available?</h3>
                      <p className="text-gray-600">
                        <strong>A:</strong> The AI may not have full data on some remote or niche locations, but you can still plan a general trip, 
                        and the AI will suggest similar alternatives based on your preferences.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Q: Can I share my trip with others?</h3>
                      <p className="text-gray-600">
                        <strong>A:</strong> Yes! You can share your trip via email or social media links. This makes it easy to coordinate with travel companions 
                        or get feedback on your plans.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Q: How accurate are the weather forecasts?</h3>
                      <p className="text-gray-600">
                        <strong>A:</strong> Weather forecasts are sourced from reliable data providers like OpenWeatherMap, and we strive to give you 
                        the most accurate and up-to-date information. Remember that weather conditions can change, so check for updates closer to your travel date.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Contact Us */}
                <section id="contact" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">7. Contact Us</h2>
                  <p className="mb-4">
                    If you need help or have any questions, feel free to contact our support team:
                  </p>

                  <div className="flex space-x-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg flex-1">
                      <h3 className="text-lg font-medium text-blue-700 mb-2">Support</h3>
                      <p className="text-gray-600 mb-1">Email: <a href="mailto:support@viaona.com" className="text-blue-600 hover:text-blue-800">support@viaona.com</a></p>
                      <p className="text-gray-600 mb-1">Support Hours: Monday-Friday, 9 AM - 6 PM EST</p>
                      <p className="text-gray-600">Response Time: Within 24 hours</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg flex-1">
                      <h3 className="text-lg font-medium text-purple-700 mb-2">Feedback</h3>
                      <p className="text-gray-600 mb-1">Email: <a href="mailto:feedback@viaona.com" className="text-blue-600 hover:text-blue-800">feedback@viaona.com</a></p>
                      <p className="text-gray-600">We're constantly working to improve your experience. If you have suggestions or feedback, please share them with us.</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Social Media:</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Facebook</a>
                    <a href="#" className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition">Twitter</a>
                    <a href="#" className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition">Instagram</a>
                  </div>
                </section>

                {/* SEO Section */}
                <section id="seo" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">8. SEO Optimization</h2>
                  <p className="mb-4">
                    While this doesn't directly affect your user experience, we've implemented comprehensive SEO optimizations to make our platform more discoverable:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Enhanced metadata and descriptions</li>
                    <li>Improved social media sharing capabilities</li>
                    <li>Optimized page structure for search engines</li>
                    <li>Dynamic sitemaps that update with real trip data</li>
                  </ul>
                </section>

                {/* Navigation Options */}
                <section id="navigation" className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">9. Navigation Options</h2>
                  <p className="mb-4">
                    We've enhanced the quick links section in the footer with the following navigation options:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li><strong>Create Trip:</strong> Start planning a new AI-generated trip</li>
                    <li><strong>View Trip:</strong> Access your saved and planned trips</li>
                    <li><strong>Trip Stats:</strong> View statistics about your trips</li>
                    <li><strong>Edit Profile:</strong> Update your profile information</li>
                  </ul>
                </section>

                {/* Copyright Footer */}
                <div className="mt-12 pt-6 border-t text-center text-gray-500 text-sm">
                  <p>© 2025 Viaona. All rights reserved.</p>
                  <p className="mt-1">This user manual is the property of Viaona and may not be reproduced without permission.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManual;