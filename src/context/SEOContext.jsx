import React, { createContext, useContext } from 'react';
import { Helmet } from 'react-helmet-async';

// Create SEO context
const SEOContext = createContext();

export const useSEO = () => useContext(SEOContext);

export function SEOProvider({ children }) {
  // Base URL for the website
  const baseUrl = 'https://viaona.com';
  
  // Default SEO values
  const defaultSEO = {
    title: 'Viaona - AI-Powered Travel Companion | Personalized Trip Planner',
    description: 'Create your dream vacation with Viaona, the AI travel planner that builds personalized itineraries based on your preferences. Get custom travel plans for any destination in seconds.',
    keywords: 'AI travel planner, personalized itinerary, custom travel plans, travel app, vacation planner, trip organizer, smart travel assistant, AI vacation planner',
    canonical: baseUrl,
    openGraph: {
      type: 'website',
      url: baseUrl,
      title: 'Viaona - AI-Powered Travel Companion | Personalized Trip Planner',
      description: 'Create your dream vacation with Viaona, the AI travel planner that builds personalized itineraries based on your preferences. Get custom travel plans for any destination in seconds.',
      image: `${baseUrl}/AI_trip_planning.png`,
    },
    twitter: {
      card: 'summary_large_image',
      url: baseUrl,
      title: 'Viaona - AI-Powered Travel Companion | Personalized Trip Planner',
      description: 'Create your dream vacation with Viaona, the AI travel planner that builds personalized itineraries based on your preferences. Get custom travel plans for any destination in seconds.',
      image: `${baseUrl}/AI_trip_planning.png`,
    }
  };

  // Update SEO for each page
  const updateSEO = ({
    title = defaultSEO.title,
    description = defaultSEO.description,
    keywords = defaultSEO.keywords,
    canonical = defaultSEO.canonical,
    openGraph = {},
    twitter = {},
    schema = null
  }) => {
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonical} />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:type" content={openGraph.type || defaultSEO.openGraph.type} />
        <meta property="og:url" content={openGraph.url || defaultSEO.openGraph.url} />
        <meta property="og:title" content={openGraph.title || title} />
        <meta property="og:description" content={openGraph.description || description} />
        <meta property="og:image" content={openGraph.image || defaultSEO.openGraph.image} />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content={twitter.card || defaultSEO.twitter.card} />
        <meta name="twitter:url" content={twitter.url || defaultSEO.twitter.url} />
        <meta name="twitter:title" content={twitter.title || title} />
        <meta name="twitter:description" content={twitter.description || description} />
        <meta name="twitter:image" content={twitter.image || defaultSEO.twitter.image} />
        
        {/* Schema.org JSON-LD */}
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}
      </Helmet>
    );
  };

  // Page-specific SEO configurations
  const pageSEO = {
    home: () => updateSEO({
      canonical: baseUrl,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Viaona - AI-Powered Travel Companion",
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/create-trip?destination={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    }),
    
    createTrip: () => updateSEO({
      title: 'Create Your Personalized Travel Itinerary | Viaona',
      description: 'Plan your perfect trip with our AI-powered itinerary creator. Choose your destination, duration, budget, and preferences to get a customized travel plan.',
      keywords: 'create travel itinerary, plan vacation, custom trip planner, AI trip planning, travel itinerary generator',
      canonical: `${baseUrl}/create-trip`,
      openGraph: {
        title: 'Create Your Personalized Travel Itinerary | Viaona',
        description: 'Plan your perfect trip with our AI-powered itinerary creator. Choose your destination, duration, budget, and preferences to get a customized travel plan.',
        url: `${baseUrl}/create-trip`,
      },
      twitter: {
        title: 'Create Your Personalized Travel Itinerary | Viaona',
        description: 'Plan your perfect trip with our AI-powered itinerary creator. Choose your destination, duration, budget, and preferences to get a customized travel plan.',
        url: `${baseUrl}/create-trip`,
      },
      schema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Create Your Personalized Travel Itinerary",
        "description": "Plan your perfect trip with our AI-powered itinerary creator. Choose your destination, duration, budget, and preferences to get a customized travel plan.",
        "url": `${baseUrl}/create-trip`,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}/create-trip`
        }
      }
    }),
    
    viewTrip: (tripId, destination) => updateSEO({
      title: `${destination || 'Your'} Travel Itinerary | Viaona`,
      description: `View your personalized ${destination || ''} travel itinerary with daily plans, accommodations, and activities tailored to your preferences.`,
      keywords: `${destination} itinerary, travel plan, vacation itinerary, daily travel plan, ${destination} vacation`,
      canonical: `${baseUrl}/view-trip/${tripId}`,
      openGraph: {
        title: `${destination || 'Your'} Travel Itinerary | Viaona`,
        description: `View your personalized ${destination || ''} travel itinerary with daily plans, accommodations, and activities tailored to your preferences.`,
        url: `${baseUrl}/view-trip/${tripId}`,
      },
      twitter: {
        title: `${destination || 'Your'} Travel Itinerary | Viaona`,
        description: `View your personalized ${destination || ''} travel itinerary with daily plans, accommodations, and activities tailored to your preferences.`,
        url: `${baseUrl}/view-trip/${tripId}`,
      },
      schema: {
        "@context": "https://schema.org",
        "@type": "TravelAction",
        "name": `${destination || 'Travel'} Itinerary`,
        "description": `Personalized ${destination || ''} travel itinerary with daily plans, accommodations, and activities.`,
        "url": `${baseUrl}/view-trip/${tripId}`
      }
    }),
    
    myTrips: () => updateSEO({
      title: 'My Travel Itineraries | Viaona',
      description: 'Access all your saved travel itineraries in one place. Review, edit, and share your personalized trip plans created with our AI travel planner.',
      keywords: 'saved itineraries, my trips, travel plans, vacation itineraries, trip collection, travel history',
      canonical: `${baseUrl}/my-trips`,
      openGraph: {
        title: 'My Travel Itineraries | Viaona',
        description: 'Access all your saved travel itineraries in one place. Review, edit, and share your personalized trip plans created with our AI travel planner.',
        url: `${baseUrl}/my-trips`,
      },
      twitter: {
        title: 'My Travel Itineraries | Viaona',
        description: 'Access all your saved travel itineraries in one place. Review, edit, and share your personalized trip plans created with our AI travel planner.',
        url: `${baseUrl}/my-trips`,
      }
    }),
    
    tripStats: () => updateSEO({
      title: 'Travel Insights & Statistics | Viaona',
      description: 'Analyze your travel patterns, preferences, and spending with our comprehensive travel statistics dashboard. Get insights to plan better trips.',
      keywords: 'travel statistics, trip analytics, travel insights, vacation statistics, trip data, travel patterns, travel spending analysis',
      canonical: `${baseUrl}/trip-stats`,
      openGraph: {
        title: 'Travel Insights & Statistics | Viaona',
        description: 'Analyze your travel patterns, preferences, and spending with our comprehensive travel statistics dashboard. Get insights to plan better trips.',
        url: `${baseUrl}/trip-stats`,
      },
      twitter: {
        title: 'Travel Insights & Statistics | Viaona',
        description: 'Analyze your travel patterns, preferences, and spending with our comprehensive travel statistics dashboard. Get insights to plan better trips.',
        url: `${baseUrl}/trip-stats`,
      }
    }),
    
    howItWorks: () => updateSEO({
      title: 'How Viaona Works | AI-Powered Travel Planning Explained',
      description: 'Learn how our AI-powered travel planner creates personalized itineraries based on your preferences, budget, and travel style to craft the perfect trip.',
      keywords: 'how AI travel planner works, travel itinerary creation, AI vacation planning, custom travel planning process, smart trip planner explanation',
      canonical: `${baseUrl}/how-it-works`,
      openGraph: {
        title: 'How Viaona Works | AI-Powered Travel Planning Explained',
        description: 'Learn how our AI-powered travel planner creates personalized itineraries based on your preferences, budget, and travel style to craft the perfect trip.',
        url: `${baseUrl}/how-it-works`,
      },
      twitter: {
        title: 'How Viaona Works | AI-Powered Travel Planning Explained',
        description: 'Learn how our AI-powered travel planner creates personalized itineraries based on your preferences, budget, and travel style to craft the perfect trip.',
        url: `${baseUrl}/how-it-works`,
      },
      schema: {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Create a Personalized Travel Itinerary with Viaona",
        "description": "Learn how our AI-powered travel planner creates personalized itineraries based on your preferences.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select Your Destination",
            "text": "Choose where you want to travel to start planning your trip."
          },
          {
            "@type": "HowToStep",
            "name": "Set Trip Duration",
            "text": "Specify how many days you'll be traveling."
          },
          {
            "@type": "HowToStep",
            "name": "Choose Budget Level",
            "text": "Select your budget range to get appropriate recommendations."
          },
          {
            "@type": "HowToStep",
            "name": "Add Preferences",
            "text": "Tell us what you love - activities, cuisines, accommodations."
          },
          {
            "@type": "HowToStep",
            "name": "Get Your Itinerary",
            "text": "Our AI creates a personalized trip plan based on your inputs."
          }
        ]
      }
    }),
    
    contact: () => updateSEO({
      title: 'Contact Viaona | Get Help with Your AI Travel Planner',
      description: 'Have questions about our AI travel planner? Contact our team for assistance with creating itineraries, account issues, or feedback on your experience.',
      keywords: 'contact travel planner, AI trip planner help, travel itinerary assistance, contact Viaona, travel planning support',
      canonical: `${baseUrl}/contact`,
      openGraph: {
        title: 'Contact Viaona | Get Help with Your AI Travel Planner',
        description: 'Have questions about our AI travel planner? Contact our team for assistance with creating itineraries, account issues, or feedback on your experience.',
        url: `${baseUrl}/contact`,
      },
      twitter: {
        title: 'Contact Viaona | Get Help with Your AI Travel Planner',
        description: 'Have questions about our AI travel planner? Contact our team for assistance with creating itineraries, account issues, or feedback on your experience.',
        url: `${baseUrl}/contact`,
      },
      schema: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Viaona",
        "description": "Contact our team for assistance with creating itineraries, account issues, or feedback.",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}/contact`
        }
      }
    })
  };

  // Context value
  const seoContextValue = {
    updateSEO,
    pageSEO
  };

  return (
    <SEOContext.Provider value={seoContextValue}>
      {children}
    </SEOContext.Provider>
  );
} 