import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import Header from './components/custom/Header.jsx'
import Footer from './components/custom/Footer.jsx'
import { Toaster } from './components/ui/sonner.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Viewtrip from './view-trip/[tripId]/index.jsx'
import MyTrips from './my-trips/index.jsx'
import TripStatsDashboard from './components/TripStatsDashboard.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { PlacePhotoProvider } from './context/PlacePhotoContext.jsx'
import { SEOProvider } from './context/SEOContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
import HowItWorks from './components/custom/HowItWorks.jsx'
import ContactUs from './components/custom/ContactUs.jsx'
import TermsOfService from './components/custom/TermsOfService.jsx'
import PrivacyPolicy from './components/custom/PrivacyPolicy.jsx'
import CookiePolicy from './components/custom/CookiePolicy.jsx'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'/create-trip',
    element:<CreateTrip/>
  },
  {
    path:'/view-trip/:tripId',
    element:<Viewtrip/>
  },
  {
    path:'/my-trips',
    element:<MyTrips/>
  },
  {
    path:'/trip-stats',
    element:<TripStatsDashboard/>
  },
  {
    path:'/how-it-works',
    element:<HowItWorks/>
  },
  {
    path:'/contact',
    element:<ContactUs/>
  },
  {
    path:'/terms',
    element:<TermsOfService/>
  },
  {
    path:'/privacy',
    element:<PrivacyPolicy/>
  },
  {
    path:'/cookies',
    element:<CookiePolicy/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
        <AuthProvider>
          <PlacePhotoProvider>
            <SEOProvider>
              <Header/>
              <Toaster  />
              <RouterProvider router={router} />
              <Footer />
              <Analytics />
              <SpeedInsights/>
            </SEOProvider>
          </PlacePhotoProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
