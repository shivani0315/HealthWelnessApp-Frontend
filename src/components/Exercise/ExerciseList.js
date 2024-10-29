import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/exercises', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExercises(response.data);
      } catch (err) {
        setError('Failed to fetch exercises.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ul>
      {exercises.map((exercise) => (
        <li key={exercise.id}>{exercise.name} - {exercise.duration} hours</li>
      ))}
    </ul>
  );
};

export default ExerciseList;
