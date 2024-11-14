//frontend\src\components\Exercise\LogExercise.js
import React, { useState } from 'react';
import axios from 'axios';

const LogExercise = ({ onClose }) => {
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://healthwelnessapp.onrender.com/api/exercises', { type, duration, distance, calories }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Exercise logged successfully');
      onClose(); // Close modal after logging exercise
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold">Log Exercise</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Type of exercise"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Distance (km)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Calories burned"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Log Exercise
        </button>
      </form>
      <button onClick={onClose} className="mt-4 text-red-500">Cancel</button> {/* Cancel button */}
    </div>
  );
};

export default LogExercise;
