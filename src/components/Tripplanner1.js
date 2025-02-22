import React, { useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './TripPlanner.css';

// Replace this demo key with your own OSI licensed OpenRouteService API key if available.
const ORS_API_KEY = '5b3ce3597851110001cf6248cf81ba6ea51c4b89a5d8a0d0fce679b5';

// Helper: Calculate haversine distance (in km) between two coordinates
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Fetch a nearby point of interest using the Overpass API
async function fetchPOI(lat, lon, interest) {
  let tagFilter = '';
  switch (interest) {
    case 'Historical Sites':
      tagFilter = '["historic"]';
      break;
    case 'Nature':
      tagFilter = '["natural"]';
      break;
    case 'Food & Cuisine':
      tagFilter = '["amenity"="restaurant"]';
      break;
    case 'Adventure':
      tagFilter = '["leisure"="sports_centre"]';
      break;
    default:
      tagFilter = '';
      break;
  }
  const query = `[out:json][timeout:25];
(
  node${tagFilter}(around:500, ${lat}, ${lon});
  way${tagFilter}(around:500, ${lat}, ${lon});
  relation${tagFilter}(around:500, ${lat}, ${lon});
);
out center 1;`;
  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
    headers: { "Content-Type": "text/plain" },
  });
  if (!response.ok) {
    throw new Error("Overpass API request failed");
  }
  const data = await response.json();
  if (data.elements && data.elements.length > 0) {
    const element = data.elements[0];
    return element.tags && element.tags.name ? element.tags.name : "Point of Interest";
  }
  return null;
}

// Helper: Fetch a nearby accommodation using the Overpass API
async function fetchAccommodation(lat, lon, accommodationType) {
  let tagFilter = '';
  switch (accommodationType) {
    case 'hotel':
      tagFilter = '["tourism"="hotel"]';
      break;
    case 'hostel':
      tagFilter = '["tourism"="hostel"]';
      break;
    case 'bnb':
      tagFilter = '["tourism"="guest_house"]';
      break;
    default:
      tagFilter = '["tourism"="hotel"]';
      break;
  }
  const query = `[out:json][timeout:25];
(
  node${tagFilter}(around:500, ${lat}, ${lon});
  way${tagFilter}(around:500, ${lat}, ${lon});
  relation${tagFilter}(around:500, ${lat}, ${lon});
);
out center 1;`;
  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
    headers: { "Content-Type": "text/plain" },
  });
  if (!response.ok) {
    throw new Error("Overpass API request failed for accommodation");
  }
  const data = await response.json();
  if (data.elements && data.elements.length > 0) {
    const element = data.elements[0];
    return element.tags && element.tags.name ? element.tags.name : "Accommodation Option";
  }
  return null;
}

// Helper: Estimate trip cost based on travel style, number of days, and travelers
function estimateCost(days, travelers, travelStyle) {
  let baseCostPerDay = 3000; // base cost per traveler per day in ₹
  if (travelStyle === 'luxury') {
    baseCostPerDay = 6000;
  } else if (travelStyle === 'adventure') {
    baseCostPerDay = 3500;
  } else if (travelStyle === 'budget') {
    baseCostPerDay = 2000;
  }
  return days * travelers * baseCostPerDay;
}

const TripPlanner = () => {
  const [formData, setFormData] = useState({
    startLocation: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    travelStyle: 'balanced', // Options: balanced, luxury, adventure, budget
    interests: [],
    accommodation: 'hotel', // Options: hotel, hostel, bnb
    transportationPreference: 'any', // Options: any, scenic, fast
    vehicle: 'car', // Options: car, bike, foot
  });

  const [routeInfo, setRouteInfo] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [tripCost, setTripCost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle text inputs and select fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkboxes for interests
  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      let updatedInterests = prev.interests;
      if (checked) {
        updatedInterests = [...updatedInterests, value];
      } else {
        updatedInterests = updatedInterests.filter(i => i !== value);
      }
      return { ...prev, interests: updatedInterests };
    });
  };

  // Fetch route information using OSI licensed APIs
  const fetchRouteInfo = async (start, end) => {
    try {
      setLoading(true);
      setError(null);

      // Geocode the starting location using Nominatim API
      const geocodeUrlStart = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(start)}`;
      const startRes = await fetch(geocodeUrlStart);
      const startResults = await startRes.json();
      const startPoint = startResults.length > 0 
        ? { lat: parseFloat(startResults[0].lat), lng: parseFloat(startResults[0].lon) } 
        : null;

      // Geocode the destination using Nominatim API
      const geocodeUrlDest = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(end)}`;
      const destRes = await fetch(geocodeUrlDest);
      const destResults = await destRes.json();
      const endPoint = destResults.length > 0 
        ? { lat: parseFloat(destResults[0].lat), lng: parseFloat(destResults[0].lon) } 
        : null;

      if (!startPoint || !endPoint) {
        throw new Error('Unable to find locations. Please check the addresses.');
      }

      // Set routing profile based on selected vehicle
      let profile = 'driving-car';
      if (formData.vehicle === 'bike') {
        profile = 'cycling-regular';
      } else if (formData.vehicle === 'foot') {
        profile = 'foot-walking';
      }

      // Fetch route information using OpenRouteService API
      const routeUrl = `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${ORS_API_KEY}&start=${startPoint.lng},${startPoint.lat}&end=${endPoint.lng},${endPoint.lat}`;
      const routeRes = await fetch(routeUrl);
      if (!routeRes.ok) {
        const errText = await routeRes.text();
        throw new Error(`Failed to fetch route information: ${errText}`);
      }
      const routeData = await routeRes.json();

      // Parse route information from the ORS response
      const feature = routeData.features && routeData.features[0];
      if (!feature) {
        throw new Error('No route found.');
      }
      const summary = feature.properties.summary;
      const formattedRoute = {
        distance: (summary.distance / 1000).toFixed(2), // overall distance in km (for reference)
        time: Math.round(summary.duration / 60), // overall duration in minutes
        ascent: summary.ascent || 0,
        descent: summary.descent || 0,
        geometry: feature.geometry, // Expecting a GeoJSON LineString
      };
      setRouteInfo(formattedRoute);

      // Generate itinerary based on route info and user preferences
      await generateItinerary(formattedRoute);
    } catch (err) {
      setError(err.message);
      setRouteInfo(null);
      setItinerary([]);
      setTripCost(null);
    } finally {
      setLoading(false);
    }
  };

  // Fully Developed Itinerary Generation Algorithm:
  // 1. Compute total trip days.
  // 2. Segment the route geometry into daily portions using dynamic indices.
  // 3. For each day:
  //    a. Calculate the segment distance using the haversine formula.
  //    b. Use the segment’s midpoint for a POI suggestion.
  //    c. Use the segment’s end for an accommodation suggestion.
  //    d. Include travel style and transportation notes.
  // 4. Update state with the detailed itinerary.
  const generateItinerary = async (route) => {
    if (!route) return;
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (dayDiff <= 0) {
      setError('End date must be after start date.');
      return;
    }
    
    // Estimate overall cost and store it.
    const estimatedCost = estimateCost(dayDiff, formData.travelers, formData.travelStyle);
    setTripCost(estimatedCost);

    const generatedItinerary = [];

    // Define notes based on travel style and transportation preference.
    let styleNote = "";
    if (formData.travelStyle === "luxury") {
      styleNote = "Indulge in premium experiences.";
    } else if (formData.travelStyle === "adventure") {
      styleNote = "Embrace thrilling adventures.";
    } else if (formData.travelStyle === "budget") {
      styleNote = "Opt for cost-effective choices.";
    } else if (formData.travelStyle === "balanced") {
      styleNote = "Enjoy a mix of experiences.";
    }
    
    let transportNote = "";
    if (formData.transportationPreference !== 'any') {
      if (formData.transportationPreference === 'scenic') {
        transportNote = "This route offers scenic views.";
      } else if (formData.transportationPreference === 'fast') {
        transportNote = "The route is optimized for speed.";
      }
    }
    
    // Extract coordinates from the route geometry.
    let coordinates = [];
    if (route.geometry && route.geometry.type === 'LineString') {
      coordinates = route.geometry.coordinates; // Each item is [lon, lat]
    }
    const totalPoints = coordinates.length;
    if (totalPoints < 2) {
      setError("Insufficient route data.");
      return;
    }
    
    // Calculate segmentation indices (from 0 to totalPoints-1) for each day.
    const indices = [];
    for (let i = 0; i <= dayDiff; i++) {
      // Evenly space indices along the route.
      indices.push(Math.floor((totalPoints - 1) * (i / dayDiff)));
    }
    
    // For each day, calculate the segment distance and fetch recommendations.
    for (let i = 0; i < dayDiff; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      
      const startIdx = indices[i];
      const endIdx = indices[i + 1];
      
      // Calculate segment distance by summing distances between consecutive coordinates.
      let segmentDistance = 0;
      for (let j = startIdx; j < endIdx; j++) {
        const [lon1, lat1] = coordinates[j];
        const [lon2, lat2] = coordinates[j + 1];
        segmentDistance += haversineDistance(lat1, lon1, lat2, lon2);
      }
      segmentDistance = Math.round(segmentDistance);
      
      // Use the midpoint of the segment for a POI suggestion.
      const midIndex = Math.floor((startIdx + endIdx) / 2);
      let poiSuggestion = null;
      try {
        const interest = formData.interests.length > 0 
          ? formData.interests[i % formData.interests.length] 
          : 'Explore local attractions';
        poiSuggestion = await fetchPOI(coordinates[midIndex][1], coordinates[midIndex][0], interest);
      } catch (err) {
        console.error('POI fetch error:', err);
      }
      
      // Use the end of the segment for an accommodation recommendation.
      let accommodationSuggestion = null;
      try {
        accommodationSuggestion = await fetchAccommodation(coordinates[endIdx][1], coordinates[endIdx][0], formData.accommodation);
      } catch (err) {
        console.error('Accommodation fetch error:', err);
      }
      
      // Determine the day's primary activity.
      const activity = formData.interests.length > 0 
        ? formData.interests[i % formData.interests.length] 
        : 'Explore local attractions';
      
      generatedItinerary.push({
        day: day.toDateString(),
        activity,
        details: `On ${day.toDateString()}, travel about ${segmentDistance} km. ` +
                 `${poiSuggestion ? 'We recommend visiting: ' + poiSuggestion + '. ' : ''}` +
                 `${accommodationSuggestion ? 'Also, consider staying at: ' + accommodationSuggestion + '. ' : ''}` +
                 `${styleNote} ${transportNote}`
      });
    }
    setItinerary(generatedItinerary);
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('Start date must be before end date.');
      return;
    }
    await fetchRouteInfo(formData.startLocation, formData.destination);
  };

  return (
    <motion.div
      className="trip-planner-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header">
        <h1 className="title">Plan Your Trip</h1>
      </div>

      <form onSubmit={handleSubmit} className="trip-form">
        {/* Location Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label>Starting From</label>
            <input
              type="text"
              name="startLocation"
              value={formData.startLocation}
              onChange={handleInputChange}
              placeholder="Enter starting location"
              required
            />
          </div>
          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="Enter destination"
              required
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group date-input-container">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
            <Calendar className="calendar-icon" />
          </div>
          <div className="form-group date-input-container">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
            <Calendar className="calendar-icon" />
          </div>
        </div>

        {/* Travelers, Budget, Travel Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label>Number of Travelers</label>
            <input
              type="number"
              name="travelers"
              value={formData.travelers}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Budget (in ₹)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="Enter your total budget"
              required
            />
          </div>
          <div className="form-group">
            <label>Travel Style</label>
            <select
              name="travelStyle"
              value={formData.travelStyle}
              onChange={handleInputChange}
            >
              <option value="balanced">Balanced</option>
              <option value="luxury">Luxury</option>
              <option value="adventure">Adventure</option>
              <option value="budget">Budget</option>
            </select>
          </div>
        </div>

        {/* Interests */}
        <div className="form-group">
          <label>Interests</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                value="Historical Sites"
                onChange={handleInterestChange}
              />
              Historical Sites
            </label>
            <label>
              <input
                type="checkbox"
                value="Nature"
                onChange={handleInterestChange}
              />
              Nature
            </label>
            <label>
              <input
                type="checkbox"
                value="Food & Cuisine"
                onChange={handleInterestChange}
              />
              Food & Cuisine
            </label>
            <label>
              <input
                type="checkbox"
                value="Adventure"
                onChange={handleInterestChange}
              />
              Adventure
            </label>
          </div>
        </div>

        {/* Accommodation & Transport */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label>Accommodation Type</label>
            <select
              name="accommodation"
              value={formData.accommodation}
              onChange={handleInputChange}
            >
              <option value="hotel">Hotel</option>
              <option value="hostel">Hostel</option>
              <option value="bnb">BnB</option>
            </select>
          </div>
          <div className="form-group">
            <label>Mode of Transport</label>
            <select
              name="vehicle"
              value={formData.vehicle}
              onChange={handleInputChange}
            >
              <option value="car">Car</option>
              <option value="bike">Bicycle</option>
              <option value="foot">Walking</option>
            </select>
          </div>
        </div>

        {/* Transportation Preference */}
        <div className="form-group">
          <label>Transportation Preference</label>
          <select
            name="transportationPreference"
            value={formData.transportationPreference}
            onChange={handleInputChange}
          >
            <option value="any">Any</option>
            <option value="scenic">Scenic</option>
            <option value="fast">Fast</option>
          </select>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          className="submit-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="loader" />
              Planning your trip...
            </div>
          ) : (
            'Plan My Trip'
          )}
        </motion.button>
      </form>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route Information */}
      <AnimatePresence>
        {routeInfo && (
          <motion.div
            className="route-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <h3>Route Information</h3>
            <div className="info-grid">
              <div>
                <p>Distance:</p>
                <p>{routeInfo.distance} km</p>
              </div>
              <div>
                <p>Estimated Time:</p>
                <p>{routeInfo.time} minutes</p>
              </div>
              {routeInfo.ascent ? (
                <div>
                  <p>Total Ascent:</p>
                  <p>{routeInfo.ascent} m</p>
                </div>
              ) : null}
              {routeInfo.descent ? (
                <div>
                  <p>Total Descent:</p>
                  <p>{routeInfo.descent} m</p>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trip Cost Estimate */}
      <AnimatePresence>
        {tripCost && (
          <motion.div
            className="trip-cost"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <h3>Cost Estimate</h3>
            <p>Estimated Trip Cost: ₹{tripCost}</p>
            {Number(formData.budget) < tripCost ? (
              <p className="warning">Your budget may be insufficient for this trip.</p>
            ) : (
              <p>Your budget seems adequate for the planned trip.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Itinerary Display */}
      <AnimatePresence>
        {itinerary.length > 0 && (
          <motion.div
            className="itinerary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <h3>Your Itinerary</h3>
            {itinerary.map((item, index) => (
              <div key={index} className="itinerary-item">
                <h4>{item.day}</h4>
                <p>{item.activity}</p>
                <p>{item.details}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TripPlanner;
