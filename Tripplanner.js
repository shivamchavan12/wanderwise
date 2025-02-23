// import React, { useState } from 'react';
// import { Calendar, Luggage, Shield, Utensils, Map } from 'lucide-react';
// import { motion } from 'framer-motion';
// import './TripPlanner.css';

// const ORS_API_KEY = '5b3ce3597851110001cf6248cf81ba6ea51c4b89a5d8a0d0fce679b5'; // Replace with your ORS API key
// const OPENAI_API_KEY = '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'; // Replace with your OpenAI API key
// const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
// const PEXELS_API_KEY = 'EZVHwYLiDg5oJvO30ybHbTXEuFOVH4AC123xj7SaeP1nigk4Fcdw8Hk1'; // Replace with your Pexels API key

// // Function to call OpenAI API for travel recommendations
// async function openaiChat(prompt, systemMessage = 'You are an expert travel assistant.') {
//   try {
//     console.log("OpenAI prompt:", prompt);
//     const response = await fetch(OPENAI_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${OPENAI_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: 'gpt-3.5-turbo',
//         messages: [
//           { role: 'system', content: systemMessage },
//           { role: 'user', content: prompt }
//         ],
//         temperature: 0.7,
//         stream: false
//       })
//     });
    
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`OpenAI API request failed: ${response.status} - ${errorText}`);
//     }
    
//     const data = await response.json();
//     console.log("Full OpenAI response:", data);
    
//     if (data.choices && data.choices[0] && data.choices[0].message) {
//       console.log("OpenAI message content:", data.choices[0].message.content);
//       return data.choices[0].message.content;
//     } else {
//       throw new Error('Unexpected OpenAI API response structure');
//     }
//   } catch (error) {
//     console.error('OpenAI Error:', error);
//     return null;
//   }
// }

// // Function to fetch images from the Pexels API
// async function fetchPexelsImages(query) {
//   try {
//     console.log("Fetching images for:", query);
//     const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6`, {
//       headers: { Authorization: PEXELS_API_KEY }
//     });
//     if (!response.ok) throw new Error('Pexels API request failed');
//     const data = await response.json();
//     console.log("Fetched images:", data.photos);
//     return data.photos;
//   } catch (error) {
//     console.error('Pexels API Error:', error);
//     return [];
//   }
// }

// // Function to fetch destination coordinates and return a static map URL from OpenRouteService
// async function fetchMapUrl(destination) {
//   try {
//     console.log("Fetching map for:", destination);
//     const geoResponse = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(destination)}`);
//     if (!geoResponse.ok) throw new Error('Geocoding API request failed');
//     const geoData = await geoResponse.json();
//     const features = geoData.features;
//     if (features && features.length > 0) {
//       const [lon, lat] = features[0].geometry.coordinates;
//       const url = `https://api.openrouteservice.org/v2/maps/staticmap?api_key=${ORS_API_KEY}&layer=basic&zoom=12&center=${lon},${lat}&size=600,400`;
//       console.log("Map URL:", url);
//       return url;
//     }
//     return null;
//   } catch (error) {
//     console.error('Geocoding Error:', error);
//     return null;
//   }
// }

// function TripPlanner() {
//   const [formData, setFormData] = useState({
//     startLocation: '',
//     destination: '',
//     startDate: '',
//     endDate: '',
//     travelers: 2,
//     budget: 10000,
//     travelStyle: 'balanced',
//     interests: [],
//     specialNeeds: ''
//   });

//   // Local state for the interests input text
//   const [interestsText, setInterestsText] = useState('');

//   const [recommendations, setRecommendations] = useState({
//     itinerary: [],
//     accommodations: [],
//     transport: [],
//     packing: [],
//     safety: [],
//     cuisine: []
//   });
  
//   const [images, setImages] = useState([]);
//   const [mapUrl, setMapUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('itinerary');

//   // generateTravelPlan now accepts a data parameter with current form inputs
//   const generateTravelPlan = async (data) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Itinerary generation
//       const itineraryPrompt = `Create a detailed ${data.travelStyle} travel itinerary from ${data.startLocation} to ${data.destination} for ${data.travelers} people from ${data.startDate} to ${data.endDate}. Budget: ₹${data.budget}. Interests: ${data.interests.join(', ')}. Include daily activities, transportation modes, and time allocations.`;
//       const itineraryResponse = await openaiChat(itineraryPrompt);
//       const parsedItinerary = parseItinerary(itineraryResponse);

//       // Accommodations
//       const accommodationPrompt = `Suggest ${data.travelStyle} accommodations in ${data.destination} for ${data.travelers} people with a budget of ₹${data.budget}. Include brief descriptions and price estimates.`;
//       const accommodationResponse = await openaiChat(accommodationPrompt);
//       const parsedAccommodations = parseList(accommodationResponse);

//       // Transportation options
//       const transportPrompt = `Suggest transportation options between ${data.startLocation} and ${data.destination} for ${data.travelers} people with a budget of ₹${data.budget}. Consider ${data.specialNeeds || 'no special needs'}.`;
//       const transportResponse = await openaiChat(transportPrompt);
//       const parsedTransport = parseList(transportResponse);

//       // Packing list
//       const packingPrompt = `Create a packing list for a ${data.travelStyle} trip to ${data.destination} from ${data.startDate} to ${data.endDate}. Consider ${data.interests.join(', ')} activities.`;
//       const packingResponse = await openaiChat(packingPrompt);
//       const parsedPacking = parseList(packingResponse);

//       // Safety tips
//       const safetyPrompt = `Provide safety tips for traveling to ${data.destination} considering ${data.travelers} travelers with ${data.specialNeeds || 'no special needs'}.`;
//       const safetyResponse = await openaiChat(safetyPrompt);
//       const parsedSafety = parseList(safetyResponse);

//       // Cuisine recommendations
//       const cuisinePrompt = `Recommend local foods to try in ${data.destination} considering interests in ${data.interests.join(', ')} and ${data.specialNeeds || 'no dietary restrictions'}.`;
//       const cuisineResponse = await openaiChat(cuisinePrompt);
//       const parsedCuisine = parseList(cuisineResponse);

//       setRecommendations({
//         itinerary: parsedItinerary,
//         accommodations: parsedAccommodations,
//         transport: parsedTransport,
//         packing: parsedPacking,
//         safety: parsedSafety,
//         cuisine: parsedCuisine
//       });

//       // Fetch images for the gallery
//       const fetchedImages = await fetchPexelsImages(data.destination);
//       setImages(fetchedImages);

//       // Fetch static map URL
//       const mapImageUrl = await fetchMapUrl(data.destination);
//       setMapUrl(mapImageUrl);

//     } catch (error) {
//       setError('Failed to generate travel plan. Please check your inputs and try again.');
//       console.error('Generation error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper to parse itinerary: expects days separated by double newlines and each day with a title and activities
//   const parseItinerary = (response) => {
//     if (!response) return [];
//     const days = response.split('\n\n');
//     const parsed = days.map(day => {
//       const lines = day.split('\n').filter(line => line.trim() !== '');
//       return { title: lines[0] || 'Day', activities: lines.slice(1) };
//     });
//     console.log("Parsed itinerary:", parsed);
//     return parsed;
//   };

//   // Helper to parse list responses
//   const parseList = (response) => {
//     if (!response) return [];
//     return response.split('\n').filter(item => item.trim());
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Merge interests input into form data
//     const updatedInterests = interestsText.split(',').map(i => i.trim()).filter(i => i !== '');
//     const newFormData = { ...formData, interests: updatedInterests };

//     // Date validation
//     if (new Date(newFormData.startDate) >= new Date(newFormData.endDate)) {
//       setError('End date must be after start date');
//       return;
//     }

//     console.log("Form submitted with data:", newFormData);
//     setFormData(newFormData);
//     await generateTravelPlan(newFormData);
//   };

//   // Returns an emoji based on transport suggestion
//   function getTransportIcon(transport) {
//     const lower = transport.toLowerCase();
//     if (lower.includes('flight')) return '✈️';
//     if (lower.includes('train')) return '🚆';
//     if (lower.includes('car')) return '🚗';
//     return '🚌';
//   }

//   return (
//     <motion.div className="planner-container">
//       <div className="header">
//         <h1>
//           Smart Travel Planner <Map size={32} />
//         </h1>
//       </div>

//       <form onSubmit={handleSubmit} className="planning-form">
//         <div className="form-group">
//           <label>Start Location</label>
//           <input
//             type="text"
//             value={formData.startLocation}
//             onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
//             placeholder="City or address"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Destination</label>
//           <input
//             type="text"
//             value={formData.destination}
//             onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
//             placeholder="City or place to visit"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Start Date</label>
//           <input
//             type="date"
//             value={formData.startDate}
//             onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>End Date</label>
//           <input
//             type="date"
//             value={formData.endDate}
//             onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Travelers</label>
//           <input
//             type="number"
//             min="1"
//             value={formData.travelers}
//             onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Budget (₹)</label>
//           <input
//             type="number"
//             min="0"
//             value={formData.budget}
//             onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Travel Style</label>
//           <input
//             type="text"
//             value={formData.travelStyle}
//             onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
//             placeholder="e.g. balanced, luxury, budget"
//           />
//         </div>
//         <div className="form-group">
//           <label>Interests (comma separated)</label>
//           <input
//             type="text"
//             value={interestsText}
//             onChange={(e) => setInterestsText(e.target.value)}
//             placeholder="Culture, adventure, food..."
//           />
//         </div>
//         <div className="form-group">
//           <label>Special Needs/Preferences</label>
//           <input
//             type="text"
//             value={formData.specialNeeds}
//             onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
//             placeholder="Dietary restrictions, accessibility needs, etc."
//           />
//         </div>

//         <motion.button whileHover={{ scale: 1.05 }} type="submit">
//           {loading ? 'Generating...' : 'Create Smart Plan'}
//         </motion.button>
//       </form>

//       {error && <div className="error">{error}</div>}

//       <div className="recommendations-tabs">
//         {['itinerary', 'accommodations', 'transport', 'packing', 'safety', 'cuisine', 'gallery', 'map'].map(tab => (
//           <button
//             key={tab}
//             className={activeTab === tab ? 'active' : ''}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>

//       <div className="recommendations-container">
//         {activeTab === 'itinerary' && (
//           <motion.div className="itinerary-section">
//             {recommendations.itinerary.length ? recommendations.itinerary.map((day, index) => (
//               <div key={index} className="day-card">
//                 <h3>{day.title}</h3>
//                 <ul>
//                   {day.activities.map((activity, i) => (
//                     <li key={i}>{activity}</li>
//                   ))}
//                 </ul>
//               </div>
//             )) : <p>No itinerary available based on your input.</p>}
//           </motion.div>
//         )}

//         {activeTab === 'accommodations' && (
//           <div className="accommodations-grid">
//             {recommendations.accommodations.length ? recommendations.accommodations.map((item, index) => {
//               const parts = item.includes(':') ? item.split(':') : [item];
//               return (
//                 <div key={index} className="accommodation-card">
//                   <h4>{parts[0]}</h4>
//                   {parts.length > 1 && <p>{parts.slice(1).join(':')}</p>}
//                 </div>
//               );
//             }) : <p>No accommodations suggestions available.</p>}
//           </div>
//         )}

//         {activeTab === 'transport' && (
//           <div className="transport-list">
//             {recommendations.transport.length ? recommendations.transport.map((item, index) => (
//               <div key={index} className="transport-item">
//                 <div className="transport-icon">{getTransportIcon(item)}</div>
//                 <p>{item}</p>
//               </div>
//             )) : <p>No transportation options available.</p>}
//           </div>
//         )}

//         {activeTab === 'packing' && (
//           <div className="list-section">
//             {recommendations.packing.length ? (
//               <ul>
//                 {recommendations.packing.map((item, index) => <li key={index}>{item}</li>)}
//               </ul>
//             ) : <p>No packing list available.</p>}
//           </div>
//         )}

//         {activeTab === 'safety' && (
//           <div className="list-section">
//             {recommendations.safety.length ? (
//               <ul>
//                 {recommendations.safety.map((item, index) => <li key={index}>{item}</li>)}
//               </ul>
//             ) : <p>No safety tips available.</p>}
//           </div>
//         )}

//         {activeTab === 'cuisine' && (
//           <div className="list-section">
//             {recommendations.cuisine.length ? (
//               <ul>
//                 {recommendations.cuisine.map((item, index) => <li key={index}>{item}</li>)}
//               </ul>
//             ) : <p>No cuisine recommendations available.</p>}
//           </div>
//         )}

//         {activeTab === 'gallery' && (
//           <div className="gallery-section">
//             {images.length ? (
//               images.map((img) => (
//                 <img key={img.id} src={img.src.medium} alt={img.photographer} />
//               ))
//             ) : <p>No images found.</p>}
//           </div>
//         )}

//         {activeTab === 'map' && (
//           <div className="map-section">
//             {mapUrl ? (
//               <img src={mapUrl} alt={`Map of ${formData.destination}`} />
//             ) : <p>Map not available.</p>}
//           </div>
//         )}
//       </div>

//       <div className="smart-features">
//         <div className="feature-card budget-analyzer">
//           <h3>Budget Analyzer</h3>
//           <p>Estimated Total: ₹{formData.budget}</p>
//           <div className="budget-breakdown">
//             {/* Future budget breakdown visualization can be added here */}
//           </div>
//         </div>

//         <div className="feature-card collaboration">
//           <h3>Group Collaboration</h3>
//           <div className="collaboration-interface">
//             {/* Future real-time collaboration features can be added here */}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default TripPlanner;

//SECOD CODE

import React, { useState } from 'react';
import { Calendar, Luggage, Shield, Utensils, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import './TripPlanner.css';

const ORS_API_KEY = '5b3ce3597851110001cf6248cf81ba6ea51c4b89a5d8a0d0fce679b5'; // Replace with your ORS API key
const MISTRAL_API_KEY = 'ypklpLr8eEIxjRjgMJDrsl3Z5DXkAMy1'; // Replace with your Mistral API key
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const PEXELS_API_KEY = 'EZVHwYLiDg5oJvO30ybHbTXEuFOVH4AC123xj7SaeP1nigk4Fcdw8Hk1'; // Replace with your Pexels API key

// Function to call Mistral API for travel recommendations
async function mistralChat(prompt, systemMessage = 'You are an expert travel assistant.') {
  try {
    console.log("Mistral prompt:", prompt);
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest', // Change this to your desired Mistral model if needed
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 250,
        stream: false
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mistral API request failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Full Mistral response:", data);
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log("Mistral message content:", data.choices[0].message.content);
      return data.choices[0].message.content;
    } else {
      throw new Error('Unexpected Mistral API response structure');
    }
  } catch (error) {
    console.error('Mistral API Error:', error);
    return null;
  }
}

// Function to fetch images from the Pexels API (unchanged)
async function fetchPexelsImages(query) {
  try {
    console.log("Fetching images for:", query);
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    if (!response.ok) throw new Error('Pexels API request failed');
    const data = await response.json();
    console.log("Fetched images:", data.photos);
    return data.photos;
  } catch (error) {
    console.error('Pexels API Error:', error);
    return [];
  }
}

// Function to fetch destination coordinates and return a static map URL from OpenRouteService (unchanged)
async function fetchMapUrl(destination) {
  try {
    console.log("Fetching map for:", destination);
    const geoResponse = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(destination)}`);
    if (!geoResponse.ok) throw new Error('Geocoding API request failed');
    const geoData = await geoResponse.json();
    const features = geoData.features;
    if (features && features.length > 0) {
      const [lon, lat] = features[0].geometry.coordinates;
      const url = `https://api.openrouteservice.org/v2/maps/staticmap?api_key=${ORS_API_KEY}&layer=basic&zoom=12&center=${lon},${lat}&size=600,400`;
      console.log("Map URL:", url);
      return url;
    }
    return null;
  } catch (error) {
    console.error('Geocoding Error:', error);
    return null;
  }
}

function TripPlanner() {
  const [formData, setFormData] = useState({
    startLocation: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 10000,
    travelStyle: 'balanced',
    interests: [],
    specialNeeds: ''
  });

  // Local state for the interests input text
  const [interestsText, setInterestsText] = useState('');

  const [recommendations, setRecommendations] = useState({
    itinerary: [],
    accommodations: [],
    transport: [],
    packing: [],
    safety: [],
    cuisine: []
  });
  
  const [images, setImages] = useState([]);
  const [mapUrl, setMapUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');

  // generateTravelPlan now accepts a data parameter with current form inputs
  const generateTravelPlan = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      // Itinerary generation
      const itineraryPrompt = `Create a detailed ${data.travelStyle} travel itinerary from ${data.startLocation} to ${data.destination} for ${data.travelers} people from ${data.startDate} to ${data.endDate}. Budget: ₹${data.budget}. Interests: ${data.interests.join(', ')}. Include daily activities, transportation modes, and time allocations.`;
      const itineraryResponse = await mistralChat(itineraryPrompt);
      const parsedItinerary = parseItinerary(itineraryResponse);

      // Accommodations
      const accommodationPrompt = `Suggest ${data.travelStyle} accommodations in ${data.destination} for ${data.travelers} people with a budget of ₹${data.budget}. Include brief descriptions and price estimates.`;
      const accommodationResponse = await mistralChat(accommodationPrompt);
      const parsedAccommodations = parseList(accommodationResponse);

      // Transportation options
      const transportPrompt = `Suggest transportation options between ${data.startLocation} and ${data.destination} for ${data.travelers} people with a budget of ₹${data.budget}. Consider ${data.specialNeeds || 'no special needs'}.`;
      const transportResponse = await mistralChat(transportPrompt);
      const parsedTransport = parseList(transportResponse);

      // Packing list
      const packingPrompt = `Create a packing list for a ${data.travelStyle} trip to ${data.destination} from ${data.startDate} to ${data.endDate}. Consider ${data.interests.join(', ')} activities.`;
      const packingResponse = await mistralChat(packingPrompt);
      const parsedPacking = parseList(packingResponse);

      // Safety tips
      const safetyPrompt = `Provide safety tips for traveling to ${data.destination} considering ${data.travelers} travelers with ${data.specialNeeds || 'no special needs'}.`;
      const safetyResponse = await mistralChat(safetyPrompt);
      const parsedSafety = parseList(safetyResponse);

      // Cuisine recommendations
      const cuisinePrompt = `Recommend local foods to try in ${data.destination} considering interests in ${data.interests.join(', ')} and ${data.specialNeeds || 'no dietary restrictions'}.`;
      const cuisineResponse = await mistralChat(cuisinePrompt);
      const parsedCuisine = parseList(cuisineResponse);

      setRecommendations({
        itinerary: parsedItinerary,
        accommodations: parsedAccommodations,
        transport: parsedTransport,
        packing: parsedPacking,
        safety: parsedSafety,
        cuisine: parsedCuisine
      });

      // Fetch images for the gallery
      const fetchedImages = await fetchPexelsImages(data.destination);
      setImages(fetchedImages);

      // Fetch static map URL
      const mapImageUrl = await fetchMapUrl(data.destination);
      setMapUrl(mapImageUrl);

    } catch (error) {
      setError('Failed to generate travel plan. Please check your inputs and try again.');
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse itinerary: expects days separated by double newlines and each day with a title and activities
  const parseItinerary = (response) => {
    if (!response) return [];
    const days = response.split('\n\n');
    const parsed = days.map(day => {
      const lines = day.split('\n').filter(line => line.trim() !== '');
      return { title: lines[0] || 'Day', activities: lines.slice(1) };
    });
    console.log("Parsed itinerary:", parsed);
    return parsed;
  };

  // Helper to parse list responses
  const parseList = (response) => {
    if (!response) return [];
    return response.split('\n').filter(item => item.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Merge interests input into form data
    const updatedInterests = interestsText.split(',').map(i => i.trim()).filter(i => i !== '');
    const newFormData = { ...formData, interests: updatedInterests };

    // Date validation
    if (new Date(newFormData.startDate) >= new Date(newFormData.endDate)) {
      setError('End date must be after start date');
      return;
    }

    console.log("Form submitted with data:", newFormData);
    setFormData(newFormData);
    await generateTravelPlan(newFormData);
  };

  // Returns an emoji based on transport suggestion
  function getTransportIcon(transport) {
    const lower = transport.toLowerCase();
    if (lower.includes('flight')) return '✈️';
    if (lower.includes('train')) return '🚆';
    if (lower.includes('car')) return '🚗';
    return '🚌';
  }

  return (
    <motion.div className="planner-container">
      <div className="header">
        <h1>
          Smart Travel Planner <Map size={32} />
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="planning-form">
        <div className="form-group">
          <label>Start Location</label>
          <input
            type="text"
            value={formData.startLocation}
            onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
            placeholder="City or address"
            required
          />
        </div>
        <div className="form-group">
          <label>Destination</label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="City or place to visit"
            required
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Travelers</label>
          <input
            type="number"
            min="1"
            value={formData.travelers}
            onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
            required
          />
        </div>
        <div className="form-group">
          <label>Budget (₹)</label>
          <input
            type="number"
            min="0"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            required
          />
        </div>
        <div className="form-group">
          <label>Travel Style</label>
          <input
            type="text"
            value={formData.travelStyle}
            onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
            placeholder="e.g. balanced, luxury, budget"
          />
        </div>
        <div className="form-group">
          <label>Interests (comma separated)</label>
          <input
            type="text"
            value={interestsText}
            onChange={(e) => setInterestsText(e.target.value)}
            placeholder="Culture, adventure, food..."
          />
        </div>
        <div className="form-group">
          <label>Special Needs/Preferences</label>
          <input
            type="text"
            value={formData.specialNeeds}
            onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
            placeholder="Dietary restrictions, accessibility needs, etc."
          />
        </div>

        <motion.button whileHover={{ scale: 1.05 }} type="submit">
          {loading ? 'Generating...' : 'Create Smart Plan'}
        </motion.button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="recommendations-tabs">
        {['itinerary', 'accommodations', 'transport', 'packing', 'safety', 'cuisine', 'gallery', 'map'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="recommendations-container">
        {activeTab === 'itinerary' && (
          <motion.div className="itinerary-section">
          {loading ? (
            <p>Loading itinerary...</p>
          ) : recommendations.itinerary && recommendations.itinerary.length > 0 ? (
            recommendations.itinerary.map((day, index) => (
              <div key={index} className="day-card">
                <h3>{day.title}</h3>
                <ul>
                  {day.activities && day.activities.length > 0 ? (
                    day.activities.map((activity, i) => <li key={i}>{activity}</li>)
                  ) : (
                    <li>No activities available</li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <p>No itinerary available based on your input.</p>
          )}
        </motion.div>                
        )}

        {activeTab === 'accommodations' && (
          <div className="accommodations-grid">
            {recommendations.accommodations.length ? recommendations.accommodations.map((item, index) => {
              const parts = item.includes(':') ? item.split(':') : [item];
              return (
                <div key={index} className="accommodation-card">
                  <h4>{parts[0]}</h4>
                  {parts.length > 1 && <p>{parts.slice(1).join(':')}</p>}
                </div>
              );
            }) : <p>No accommodations suggestions available.</p>}
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="transport-list">
            {recommendations.transport.length ? recommendations.transport.map((item, index) => (
              <div key={index} className="transport-item">
                <div className="transport-icon">{getTransportIcon(item)}</div>
                <p>{item}</p>
              </div>
            )) : <p>No transportation options available.</p>}
          </div>
        )}

        {activeTab === 'packing' && (
          <div className="list-section">
            {recommendations.packing.length ? (
              <ul>
                {recommendations.packing.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            ) : <p>No packing list available.</p>}
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="list-section">
            {recommendations.safety.length ? (
              <ul>
                {recommendations.safety.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            ) : <p>No safety tips available.</p>}
          </div>
        )}

        {activeTab === 'cuisine' && (
          <div className="list-section">
            {recommendations.cuisine.length ? (
              <ul>
                {recommendations.cuisine.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            ) : <p>No cuisine recommendations available.</p>}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="gallery-section">
            {images.length ? (
              images.map((img) => (
                <img key={img.id} src={img.src.medium} alt={img.photographer} />
              ))
            ) : <p>No images found.</p>}
          </div>
        )}

        {activeTab === 'map' && (
          <div className="map-section">
            {mapUrl ? (
              <img src={mapUrl} alt={`Map of ${formData.destination}`} />
            ) : <p>Map not available.</p>}
          </div>
        )}
      </div>

      <div className="smart-features">
        <div className="feature-card budget-analyzer">
          <h3>Budget Analyzer</h3>
          <p>Estimated Total: ₹{formData.budget}</p>
          <div className="budget-breakdown">
            {/* Future budget breakdown visualization can be added here */}
          </div>
        </div>

        <div className="feature-card collaboration">
          <h3>Group Collaboration</h3>
          <div className="collaboration-interface">
            {/* Future real-time collaboration features can be added here */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TripPlanner;
