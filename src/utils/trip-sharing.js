// Import libraries for PDF generation
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Converts a trip page to PDF and triggers download
 * @param {string} elementId - The ID of the element to capture for the PDF
 * @param {string} filename - The name of the PDF file to download
 */
export const downloadTripAsPDF = async (elementId, filename = 'trip-plan.pdf') => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error(`Element with ID ${elementId} not found`);
      return false;
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Copies the current trip URL to clipboard
 * @returns {Promise<boolean>} Success status
 */
export const copyTripLink = async () => {
  try {
    const currentUrl = window.location.href;
    await navigator.clipboard.writeText(currentUrl);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Opens email client with trip details
 * @param {string} tripTitle - The title of the trip
 * @param {string} tripLocation - The location of the trip
 * @returns {boolean} Success status
 */
export const shareTripViaEmail = (tripTitle, tripLocation) => {
  try {
    const subject = encodeURIComponent(`Check out my travel plan to ${tripLocation}!`);
    const body = encodeURIComponent(
      `Hi there,\n\nI've created a travel plan for ${tripTitle} using AI Travel Guide. Check it out here: ${window.location.href}\n\nEnjoy!`
    );
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
    return true;
  } catch (error) {
    console.error('Error opening email client:', error);
    return false;
  }
}; 