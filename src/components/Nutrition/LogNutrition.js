import React, { useState } from 'react';
import axios from 'axios';

const LogNutrition = ({ onClose }) => {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in again.');
        return;
      }

      const nutritionData = { food, calories, protein, carbs, fats };
      await axios.post('https://healthwelnessapp.onrender.com/api/nutrition', nutritionData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Nutrition logged successfully');
      onClose(); // Close modal after logging nutrition
      // Clear input fields
      setFood('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFats('');
    } catch (error) {
      console.error("Error logging nutrition:", error.response?.data || error.message);
      setError('Failed to log nutrition. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold">Log Nutrition</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Food Item"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Protein (g)"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Carbs (g)"
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Fats (g)"
          value={fats}
          onChange={(e) => setFats(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Log Nutrition
        </button>
      </form>
      <button onClick={onClose} className="mt-4 text-red-500">Cancel</button> {/* Cancel button */}
    </div>
  );
};

export default LogNutrition;
