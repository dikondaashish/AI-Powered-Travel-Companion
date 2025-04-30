import React from 'react';
import { Check, MapPin, Calendar, Wallet, NotebookPen, Sparkles, Map, PanelLeftClose, Star, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useSEO } from '@/context/SEOContext';

function HowItWorks() {
  const { pageSEO } = useSEO();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const faqs = [
    {
      question: "How does the AI create travel plans?",
      answer: "Our advanced AI analyzes thousands of data points including travel trends, user reviews, local attractions, seasonal events, and your personal preferences to create a tailored itinerary that maximizes your enjoyment while respecting your budget and time constraints."
    },
    {
      question: "Is the itinerary stored? Can I access it later?",
      answer: "Absolutely. Every trip you create is saved in MyTrip, where you can view you trips and you can share it anytime with your friends and family."
    },
    {
      question: "Is the service completely free?",
      answer: "Yes, all users can use Our AI Travel Guide free of cost for now. If we ever plan to move to a paid model, we'll notify all users via email in advance. Also, our code is open-source you can use in github, so you can always access it freely."
    },
    {
      question: "What data do you use to generate my trip?",
      answer: "We use your selected destination, travel dates, budget, travel style, and preferences like food, activities, and weather to create your perfect plan."
    },
    {
      question: "Sometimes my trip fails to generate—why?",
      answer: "f you select a very long trip (6+ days) or too many preferences, the AI might time out. We're working on breaking longer trips into smaller segments and retrying automatically."
    },
    {
      question: "How accurate are the budget estimates?",
      answer: "Our budget estimates are based on real-time data from various sources and are typically accurate within 10-15%. Prices for attractions, accommodations, and dining are regularly updated to reflect current rates, taxes, and seasonal variations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
      {pageSEO.howItWorks()}

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            How It Works
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Discover how our AI-powered platform makes travel planning effortless,
            personalized, and delightfully simple.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Feature 1: Plan Trip with AI */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-6 lg:p-8 group hover:shadow-2xl transition-all duration-300">
            <div className="absolute -right-20 -top-20 h-40 w-40 bg-gradient-to-bl from-blue-100 to-indigo-100 rounded-full opacity-70 group-hover:scale-150 transition-all duration-500"></div>

            <div className="relative z-10">
              <div className="h-14 w-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Plan Your Trip with AI</h3>

              <p className="text-gray-700 mb-6">
                Our AI analyzes your preferences, budget, and travel style to create personalized itineraries tailored just for you.
              </p>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Tell us about your dream destination and preferences</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Set your budget, trip duration, and interests</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Get an AI-generated itinerary in seconds</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Refine and customize until it's perfect</p>
                </div>
              </div>
            </div>

            <div className="mt-10 relative z-10">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-100">
                <img
                  src="/AI_trip_planning.png"
                  alt="AI Travel Planning"
                  className="w-full h-full object-cover"
                />

              </div>
            </div>
          </div>

          {/* Feature 2: Explore Itinerary Details */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-6 lg:p-8 group hover:shadow-2xl transition-all duration-300">
            <div className="absolute -left-20 -top-20 h-40 w-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-70 group-hover:scale-150 transition-all duration-500"></div>

            <div className="relative z-10">
              <div className="h-14 w-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore Itinerary Details</h3>

              <p className="text-gray-700 mb-6">
                Dive deep into your personalized travel plan with comprehensive details about each activity, attraction, and recommendation.
              </p>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Day-by-day itinerary breakdowns</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Detailed information about each attraction</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Local tips and hidden gems</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Estimated timing and duration for each activity</p>
                </div>
              </div>
            </div>

            <div className="mt-10 relative z-10">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-100">
                <img
                  src="/Screenshot 2025-04-20 at 1.54.59 PM.png"
                  alt="Detailed Itinerary"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Feature 3: Interactive Map */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-6 lg:p-8 group hover:shadow-2xl transition-all duration-300">
            <div className="absolute -right-20 -top-20 h-40 w-40 bg-gradient-to-bl from-green-100 to-teal-100 rounded-full opacity-70 group-hover:scale-150 transition-all duration-500"></div>

            <div className="relative z-10">
              <div className="h-14 w-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <Map className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Use the Interactive Map</h3>

              <p className="text-gray-700 mb-6">
                Visualize your entire journey with our interactive map feature that helps you navigate your destination with ease.
              </p>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">See all attractions and activities mapped out</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Get directions between locations</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Discover nearby restaurants, shops, and points of interest</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Adjust your route in real-time while traveling</p>
                </div>
              </div>
            </div>

            <div className="mt-10 relative z-10">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-100">
                <img
                  src="/website_map.png"
                  alt="Interactive Map"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Feature 4: Budget & Notes */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-6 lg:p-8 group hover:shadow-2xl transition-all duration-300">
            <div className="absolute -left-20 -top-20 h-40 w-40 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full opacity-70 group-hover:scale-150 transition-all duration-500"></div>

            <div className="relative z-10">
              <div className="h-14 w-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <Wallet className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Manage Budget & Notes</h3>

              <p className="text-gray-700 mb-6">
                Keep track of your expenses and capture important travel notes all in one convenient place.
              </p>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Set and track your travel budget</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Log expenses and see spending breakdowns</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Add personal notes for each destination</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">Create packing lists and travel reminders</p>
                </div>
              </div>
            </div>

            <div className="mt-10 relative z-10">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-100">
                <img
                  src="/money-sheet.png"
                  alt="Budget Management"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section - NEW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Travel Guide vs Traditional Planning</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            See how our AI-powered approach saves you time and enhances your travel experience.
          </p>
        </div>

        <div className="overflow-hidden bg-white rounded-2xl shadow-xl">
          <div className="grid grid-cols-3">
            <div className="p-6 border-b border-r border-gray-100 bg-gray-50">
              <p className="font-semibold text-lg text-gray-900">Feature</p>
            </div>
            <div className="p-6 border-b border-r border-gray-100 bg-blue-50">
              <p className="font-semibold text-lg text-blue-700">AI Travel Guide</p>
            </div>
            <div className="p-6 border-b border-gray-100">
              <p className="font-semibold text-lg text-gray-500">Traditional Planning</p>
            </div>

            {/* Row 1 */}
            <div className="p-6 border-b border-r border-gray-100">
              <p className="text-gray-700">Planning Time</p>
            </div>
            <div className="p-6 border-b border-r border-gray-100 bg-blue-50">
              <p className="text-gray-700"><span className="font-semibold text-blue-700">Minutes</span> - AI generates complete itineraries instantly</p>
            </div>
            <div className="p-6 border-b border-gray-100">
              <p className="text-gray-700"><span className="font-semibold">Hours or Days</span> - Requires extensive research and manual coordination</p>
            </div>

            {/* Row 2 */}
            <div className="p-6 border-b border-r border-gray-100">
              <p className="text-gray-700">Personalization</p>
            </div>
            <div className="p-6 border-b border-r border-gray-100 bg-blue-50">
              <p className="text-gray-700"><span className="font-semibold text-blue-700">High</span> - Learns your preferences and adapts recommendations</p>
            </div>
            <div className="p-6 border-b border-gray-100">
              <p className="text-gray-700"><span className="font-semibold">Limited</span> - Generic recommendations from guidebooks or websites</p>
            </div>

            {/* Row 3 */}
            <div className="p-6 border-b border-r border-gray-100">
              <p className="text-gray-700">Hidden Gems</p>
            </div>
            <div className="p-6 border-b border-r border-gray-100 bg-blue-50">
              <p className="text-gray-700"><span className="font-semibold text-blue-700">Abundant</span> - AI analyzes thousands of local spots beyond tourist traps</p>
            </div>
            <div className="p-6 border-b border-gray-100">
              <p className="text-gray-700"><span className="font-semibold">Rare</span> - Usually limited to popular tourist destinations</p>
            </div>

            {/* Row 4 */}
            <div className="p-6 border-b border-r border-gray-100">
              <p className="text-gray-700">Real-time Updates</p>
            </div>
            <div className="p-6 border-b border-r border-gray-100 bg-blue-50">
              <p className="text-gray-700"><span className="font-semibold text-blue-700">Yes</span> - Adapts to weather, closures, and changing conditions</p>
            </div>
            <div className="p-6 border-b border-gray-100">
              <p className="text-gray-700"><span className="font-semibold">No</span> - Static plans that don't adapt to changes</p>
            </div>

            {/* Row 5 */}
            <div className="p-6 border-r border-gray-100">
              <p className="text-gray-700">Cost Optimization</p>
            </div>
            <div className="p-6 border-r border-gray-100 bg-blue-50">
              <p className="text-gray-700"><span className="font-semibold text-blue-700">Intelligent</span> - Finds the best values and suggests budget optimizations</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700"><span className="font-semibold">Manual</span> - Requires extensive comparison shopping</p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started in 3 Simple Steps</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our streamlined process makes trip planning easier than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-50">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Create an Account</h3>
            <p className="text-gray-600">
              Sign up in seconds to access our full range of AI-powered travel planning tools.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-50">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Describe Your Dream Trip</h3>
            <p className="text-gray-600">
              Tell us your destination, preferences, budget, and travel style.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-50">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Receive Your Itinerary</h3>
            <p className="text-gray-600">
              Get a personalized travel plan you can refine, share, and take with you on your journey.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials - NEW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Travelers Say</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Join thousands of happy travelers who have simplified their travel planning with our AI guide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-50 flex flex-col">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-6 flex-grow">
              "I planned my entire Europe trip in under 30 minutes! The AI suggested places I would never have found on my own, and the budget tracker kept me from overspending."
            </p>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Emily Rodriguez</p>
                <p className="text-sm text-gray-500">Barcelona, Spain Trip</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-50 flex flex-col">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-6 flex-grow">
              "As a family of five, planning vacations used to be so stressful. The AI Travel Guide gave us a perfect balance of kid-friendly activities and adult experiences, all within our budget!"
            </p>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Michael Thompson</p>
                <p className="text-sm text-gray-500">Orlando, Florida Trip</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-50 flex flex-col">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-6 flex-grow">
              "The interactive map feature saved us so much time! We could see all nearby attractions and restaurants while out exploring. This app transformed how I travel."
            </p>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sarah Johnson</p>
                <p className="text-sm text-gray-500">Tokyo, Japan Trip</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - NEW */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Everything you need to know about our AI-powered travel planning service.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Manual Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="bg-white p-4 rounded-lg shadow-md transform rotate-2">
                  <img 
                    src="/AI_trip_planning.png" 
                    alt="User Manual" 
                    className="w-32 h-32 object-cover"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Detailed User Manual</h2>
                <p className="text-gray-700 mb-4">
                  Need comprehensive guidance on using our platform? We've created a detailed user manual that covers everything from creating your first trip to using advanced features.
                </p>
                <ul className="text-gray-700 mb-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Learn about all navigation options</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Understand profile management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Get tips for optimal trip planning</span>
                  </li>
                </ul>
                <a 
                  href="/user-manual" 
                  className="inline-block bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                >
                  View User Manual
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 md:p-12 md:flex items-center justify-between">
            <div className="mb-8 md:mb-0 md:max-w-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Plan Your Next Adventure?</h2>
              <p className="text-blue-100 text-lg mb-6">
                Let our AI create the perfect itinerary for your dream destination.
              </p>
              <a
                href="/create-trip"
                className="inline-block bg-white text-blue-600 font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Create My Trip Now
              </a>
            </div>
            <div className="hidden md:block relative w-64 h-64">
              <div className="absolute inset-0 bg-white/10 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-4 bg-white/20 rounded-full animate-ping opacity-75 animation-delay-500"></div>
              <div className="absolute inset-8 bg-white/30 rounded-full animate-ping opacity-75 animation-delay-1000"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks; 
