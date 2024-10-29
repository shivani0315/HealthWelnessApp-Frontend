//frontend\src\components\Goals\SetGoal.js
import React, { useState } from 'react';
import axios from 'axios';

const SetGoal = ({ onClose }) => {
  const [type, setType] = useState('');
  const [target, setTarget] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/goals', { type, target }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Goal set successfully');
      onClose(); // Close modal after setting goal
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold">Set Goal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Type of goal"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Set Goal
        </button>
      </form>
      <button onClick={onClose} className="mt-4 text-red-500">Cancel</button> {/* Cancel button */}
    </div>
  );
};

export default SetGoal;
