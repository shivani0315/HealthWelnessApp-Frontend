import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoalsList = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/goals', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter out duplicate goals based on the type
        const uniqueGoals = response.data.filter((goal, index, self) =>
          index === self.findIndex((g) => g.type === goal.type)
        );

        setGoals(uniqueGoals); // Set the filtered unique goals
      } catch (err) {
        setError('Failed to fetch goals.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ul>
      {goals.map((goal) => (
        <li key={goal._id}>{goal.type}: {goal.target}</li>
      ))}
    </ul>
  );
};

export default GoalsList;