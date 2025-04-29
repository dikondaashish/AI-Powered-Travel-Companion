
# Viaona - An AI-Powered Travel Companion

**Capstone Project - Clark University (Spring 2025)**  
By: Dikonda Ashish, Rayavarapu Ravi Chandu, Emon Tofazzal, Venkat Mynapu

## Project Overview
Viaona is a web-based AI-powered travel companion designed to simplify and personalize trip planning. Accessible at Viaona.com, the platform uses artificial intelligence to generate real-time, customized itineraries based on user inputs such as destination, budget, and available time. By integrating live data sources—like weather updates, local events, and transport schedules—Viaona adapts to changing conditions and user preferences, offering an intuitive, dynamic, and stress-free travel experience. Developed using modern web technologies and Agile methodologies, Viaona is secure, scalable, and optimized for both desktop and mobile use.

## Features
- **Personalized Travel Recommendations** powered by Google Gemini AI
- **Real-Time Data Integration** (weather, events, transport updates)
- **Dynamic User Profiles** that learn and adapt over time
- **Interactive Dashboard** showing travel history and insights
- **Mobile-Responsive Web Application**
- **Secure Authentication** using Firebase Authentication
- **Cloud Hosting** with high availability and performance


## Technologies Used
| Category            | Technology                          |
|---------------------|--------------------------------------|
| Frontend            | React.js, Tailwind CSS               |
| Backend             | Firebase Authentication, Firestore  |
| AI Integration      | Google Gemini API                   |
| APIs                | Google Maps API, Google Places API   |
| Project Management  | Jira, Git, GitHub                    |
| Development Tools   | Visual Studio Code, npm              |

## Key Modules
- **Frontend**
  - `App.jsx`, `TripInputForm.jsx`, `Itinerary.jsx`, `Navbar.jsx`
- **Backend**
  - Firebase Authentication, Firestore Database
  - API Integrations: Google Maps, Places, Gemini AI

## System Architecture
- **Frontend**: React.js with service modules for API calls
- **Backend**: Serverless architecture via Firebase
- **Hosting**: Cloud-based infrastructure (AWS/Firebase)
- **Security**: Secure login (MFA supported), encrypted data, GDPR compliance

## Project Management
- **Approach**: Agile (Scrum Framework with bi-weekly sprints)
- **Version Control**: GitHub
- **Progress Tracking**: Jira

## Functional Requirements
- User Registration and Authentication (Firebase)
- Travel Input Form (city, budget, time)
- AI Recommendation Engine
- Dynamic Trip Creation and Management
- Real-Time Updates (events/weather)
- Responsive UI for Web and Mobile
- Secure Data Handling and Privacy Compliance

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dikondaashish/AI-Powered-Travel-Companion
   cd ai-powered-travel-companion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Firebase Configuration
   - Google Maps/Places API Keys
   - Google Gemini API Key

4. Start the development server:
   ```bash
   npm run dev
   ```
   
## Deployment
- Final production build is hosted on **AWS/Firebase Hosting**.
- Live deployment includes HTTPS security, domain management, and scalability for user growth.

## Future Enhancements
- Advanced ML-based personalization using collaborative filtering
- Integration with flight and hotel booking APIs
- Dedicated mobile app using React Native or Flutter
- Offline capabilities via Progressive Web App (PWA)
- Social sharing and trip collaboration features

## License
This project is developed for academic purposes under the Capstone Program at Clark University.

## Acknowledgments
- Clark University Capstone Advisors
- Firebase, Google Cloud, and Gemini API Teams
- Open-source contributors and libraries used in development
