import React from "react";
import "./Home.css";


const Home = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center text-white text-center"
        // Using a CC0 image from Wikimedia Commons instead of Unsplash
        style={{ backgroundImage: "src\assests\back.jpg" }}
      >
        <div className="bg-black bg-opacity-50 p-10 rounded-xl text-center">
          <h1 className="text-5xl font-bold">Plan Your Perfect Trip</h1>
          <p className="mt-4 text-lg">Discover, customize, and book your next adventure effortlessly.</p>
          <div className="mt-6 flex justify-center">
            <input type="text" placeholder="Where do you want to go?" className="p-3 w-80 text-black rounded-md" />
            <button className="ml-4 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">Search</button>
          </div>
        </div>
      </div>

      <div className="p-10 text-center">
        <h2 className="text-3xl font-semibold">Why Use WanderWise?</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Personalized Plans", "Best Deals", "Hassle-Free Booking"].map((feature, index) => (
            <div key={index} className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold">{feature}</h3>
              <p className="text-gray-600">
                {feature === "Personalized Plans"
                  ? "Tailor your travel experience with custom itineraries."
                  : feature === "Best Deals"
                  ? "Find the best flights, hotels, and activities at great prices."
                  : "Book everything in one place with ease."}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-10 bg-gray-200 text-center">
        <h2 className="text-3xl font-semibold">Popular Destinations</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Paris", "Bali", "New York"].map((destination, index) => (
            <div key={index} className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold">{destination}</h3>
              <p className="text-gray-600">Explore the beauty of {destination} with curated travel plans.</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-10 text-center">
        <h2 className="text-3xl font-semibold">Ready to Explore?</h2>
        <button className="mt-4 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600">Start Planning</button>
      </div>
    </div>
  );
};

export default Home;
