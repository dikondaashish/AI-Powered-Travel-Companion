<div align="center">

# ✨ VIAONA ✨

**Your AI-Powered Travel Companion**

[![viaona.com](https://img.shields.io/badge/Via-viaona.com-48BB78?style=flat-square&logo=vercel)](https://www.viaona.com)
[![GitHub license](https://img.shields.io/github/license/dikondaashish/AI-Powered-Travel-Companion)](https://github.com/dikondaashish/AI-Powered-Travel-Companion)
![GitHub stars](https://img.shields.io/github/stars/dikondaashish/AI-Powered-Travel-Companion?style=social)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=flat&logo=google-cloud&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

<img src="./public/AI_trip_planning.png" alt="Viaona AI Travel Planner" width="600px" />

*Unlocking extraordinary destinations through artificial intelligence*

</div>

## 🚀 `The Vision`

Viaona reimagines travel planning through the power of AI. Say goodbye to hours spent researching destinations, accommodations, and activities. Our intelligent system crafts personalized itineraries in seconds, adapting to your preferences, budget, and time constraints.

> "Travel is the only thing you buy that makes you richer." – Anonymous

## 🔍 `Key Features`

<table>
  <tr>
    <td width="50%">
      <h3>🧠 AI-Powered Recommendations</h3>
      <p>Our Google Gemini-powered AI analyzes thousands of data points to create your perfect travel plan, considering your unique preferences.</p>
    </td>
    <td width="50%">
      <h3>🌦️ Real-Time Adaptability</h3>
      <p>Dynamic itineraries that adjust to weather changes, local events, and real-world conditions as they happen.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔄 Interactive Trip Builder</h3>
      <p>Refine and customize your AI-generated itineraries with an intuitive drag-and-drop interface.</p>
    </td>
    <td width="50%">
      <h3>📊 Smart Travel Insights</h3>
      <p>Visualize your travel patterns, preferences, and spending habits through beautiful, interactive dashboards.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🗺️ Interactive Maps</h3>
      <p>Explore your destinations with integrated Google Maps showing attractions, restaurants, and points of interest.</p>
    </td>
    <td width="50%">
      <h3>📱 Responsive Design</h3>
      <p>Seamlessly plan trips on any device, from desktop to mobile, with our adaptive interface.</p>
    </td>
  </tr>
</table>

## 🛠️ `Technology Stack`

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

### AI & APIs
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)
![MeetBite](https://img.shields.io/badge/MeetBite-FF6B6B?style=for-the-badge&logoColor=white)
![WeatherAPI](https://img.shields.io/badge/WeatherAPI-38B2AC?style=for-the-badge&logo=weather&logoColor=white)
![Google Places API](https://img.shields.io/badge/Google_Places_API-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Google Place Autocomplete](https://img.shields.io/badge/Place_Autocomplete-4285F4?style=for-the-badge&logo=google&logoColor=white)

### DevOps
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white)

</div>

## 🏗️ `System Architecture`

```mermaid
graph TD
    A[User Interface] --> B[React Frontend]
    B --> C[Firebase Authentication]
    B --> D[API Gateway]
    D --> E[Google Gemini AI]
    D --> F[Google Maps/Places]
    D --> G[External APIs]
    E --> H[Trip Generator]
    H --> I[Firestore Database]
    I --> B
```

## 💻 `Quick Start`

```bash
# Clone the repository
git clone https://github.com/dikondaashish/AI-Powered-Travel-Companion

# Navigate to project directory
cd AI-Powered-Travel-Companion

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your local development version.

## 📱 `User Journey`

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>1. Enter Destination</strong></td>
      <td align="center"><strong>2. Set Preferences</strong></td>
      <td align="center"><strong>3. Get AI Itinerary</strong></td>
    </tr>
    <tr>
      <td><img src="./public/website_map.png" width="180" /></td>
      <td><img src="./public/money-sheet.png" width="180" /></td>
      <td><img src="./public/Screenshot 2025-04-20 at 1.54.59 PM.png" width="180" /></td>
    </tr>
  </table>
</div>

## 🧩 `Core Components`

- **Trip Generator Engine**: Processes user inputs through Gemini AI to create personalized itineraries
- **Dynamic Recommendation System**: Adapts suggestions based on user feedback and changing conditions
- **Interactive Map Visualization**: Displays trip details spatially with custom markers and routes
- **User Profile Management**: Stores preferences and learns from past trips to enhance future recommendations
- **Budget Optimization Tool**: Helps users maximize experiences while respecting financial constraints

## 🚀 `Future Roadmap`

- [ ] **Q3 2025**: Enhanced personalization with deep learning models
- [ ] **Q4 2025**: Integration with booking platforms for seamless reservations
- [ ] **Q1 2026**: Mobile app launch with offline capabilities
- [ ] **Q2 2026**: Social features for trip sharing and collaborative planning
- [ ] **Q3 2026**: AR features for on-location guidance and exploration

## 👥 `The Team`

<div align="center">

| <img src="https://github.com/identicons/dikondaashish.png" width="80" height="80" /> | <img src="https://github.com/identicons/user.png" width="80" height="80" /> | <img src="https://github.com/identicons/user2.png" width="80" height="80" /> | <img src="https://github.com/identicons/user3.png" width="80" height="80" /> |
|:---:|:---:|:---:|:---:|
| **Dikonda Ashish** | **Rayavarapu Ravi Chandu** | **Emon Tofazzal** | **Venkat Mynapu** |
| Full Stack Developer | AI Specialist | UX/UI Designer | Backend Engineer |

</div>

## 📄 `License`

This project is developed for academic purposes under the Capstone Program at Clark University.

## 🙏 `Acknowledgments`

- Clark University Capstone Advisors for their guidance
- Google Cloud and Firebase teams for their robust platforms
- The open-source community for countless inspirational libraries
- All beta testers who provided valuable feedback

<div align="center">

---

<h3>Try Viaona today and revolutionize your travel planning!</h3>

[![Visit Website](https://img.shields.io/badge/Visit_Viaona-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://viaona.com)
[![GitHub Repo](https://img.shields.io/badge/Star_on_GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dikondaashish/AI-Powered-Travel-Companion)

</div>
