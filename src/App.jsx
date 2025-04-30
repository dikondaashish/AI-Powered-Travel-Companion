import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import Hero from './components/custom/Hero'
import { useSEO } from './context/SEOContext'

function App() {
  const { pageSEO } = useSEO();
  
  // Apply SEO for homepage
  return (
    <>
      {pageSEO.home()}
      {/* Hero */}
      <Hero/>
    </>
  )
}

export default App
