// src/pages/Home.js

import React from 'react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Your Health & Wellness App</h1>
                <p className="text-lg text-gray-700 mb-6">
                    Track your fitness journey, manage your nutrition, and achieve your wellness goals all in one place.
                </p>
                <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-4 mb-8">
                    <a href="/login" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-300">
                        Login
                    </a>
                    <a href="/register" className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded shadow hover:bg-gray-400 transition duration-300">
                        Register
                    </a>
                </div>
            </div>
            <div className="w-full max-w-md">
                <img
                    src="/images/img.png"  // Replace with your actual image
                    alt="Health and Wellness"
                    className="rounded-lg shadow-md"
                />
            </div>
        </div>
    );
};

export default Home;
