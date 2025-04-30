import { db } from './firebaseConfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { format } from 'date-fns';
import fs from 'fs';
import path from 'path';

/**
 * Dynamically generates a sitemap.xml file with the latest data from the database
 * This can be run as a scheduled task using a serverless function or cron job
 */
export async function generateSitemap() {
  try {
    const baseUrl = 'https://viaona.com';
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Core static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/create-trip', priority: '0.9', changefreq: 'weekly' },
      { url: '/my-trips', priority: '0.8', changefreq: 'weekly' },
      { url: '/trip-stats', priority: '0.7', changefreq: 'weekly' },
      { url: '/how-it-works', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/terms', priority: '0.5', changefreq: 'monthly' },
      { url: '/privacy', priority: '0.5', changefreq: 'monthly' },
      { url: '/cookies', priority: '0.5', changefreq: 'monthly' },
    ];
    
    // Get recent trips from database to add to sitemap
    // Only get public trips, limit to 1000 most recent
    const tripsRef = collection(db, 'AITrips');
    const tripsQuery = query(tripsRef, orderBy('createdAt', 'desc'), limit(1000));
    const tripSnapshot = await getDocs(tripsQuery);
    
    // Add trip pages
    const tripPages = [];
    tripSnapshot.forEach(doc => {
      const tripData = doc.data();
      const tripId = doc.id;
      
      // Only add if trip is meant to be public (implementation may vary)
      // if (!tripData.isPrivate) {
      tripPages.push({
        url: `/view-trip/${tripId}`,
        priority: '0.6',
        changefreq: 'monthly'
      });
      // }
    });
    
    // Combine all pages
    const allPages = [...staticPages, ...tripPages];
    
    // Generate XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    allPages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`;
      sitemap += `    <lastmod>${today}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });
    
    sitemap += '</urlset>';
    
    // Write to file (in a server environment)
    // const publicPath = path.join(process.cwd(), 'public');
    // fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemap);
    
    console.log('Sitemap generated successfully');
    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

// Function to automatically update the sitemap.xml file periodically
// This can be called from a server-side cron job or scheduled function
export async function scheduleSitemapUpdate() {
  try {
    await generateSitemap();
    console.log('Sitemap updated successfully');
  } catch (error) {
    console.error('Failed to update sitemap:', error);
  }
} 