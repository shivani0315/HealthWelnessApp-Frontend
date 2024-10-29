import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NutritionList = () => {
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNutrition = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/nutrition', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNutrition(response.data);
      } catch (err) {
        setError('Failed to fetch nutrition data.');
      } finally {
        setLoading(false);
      }
    };

    fetchNutrition();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ul>
      {nutrition.map((item) => (
        <li key={item.id}>{item.date}: {item.calories} kcal</li>
      ))}
    </ul>
  );
};

export default NutritionList;
