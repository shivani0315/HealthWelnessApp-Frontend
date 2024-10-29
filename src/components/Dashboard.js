import React, { useEffect, useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LogExercise from './Exercise/LogExercise';
import LogNutrition from './Nutrition/LogNutrition';
import GoalSettingPage from './Goals/GoalsSettingPage';

const Dashboard = () => {
  const [exerciseData, setExerciseData] = useState({});
  const [nutritionData, setNutritionData] = useState({});
  const [goalData, setGoalData] = useState({ steps: 10000, workouts: 5, calories: 2000 }); // Default values
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const [exercisesResponse, nutritionResponse, goalsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/exercises', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5000/api/nutrition', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5000/api/goals', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Process exercise data
      const exerciseLabels = exercisesResponse.data.map(item => new Date(item.date).toLocaleDateString());
      const exerciseHours = exercisesResponse.data.map(item => item.duration);
      setExerciseData({
        labels: exerciseLabels,
        datasets: [
          {
            label: 'Hours Exercised',
            data: exerciseHours,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.4,
          },
        ],
      });

      // Process nutrition data
      const nutritionLabels = nutritionResponse.data.map(item => new Date(item.date).toLocaleDateString());
      const nutritionCalories = nutritionResponse.data.map(item => item.calories);
      const nutritionGoalCalories = nutritionResponse.data.map(item => item.goalCalories);
      setNutritionData({
        labels: nutritionLabels,
        datasets: [
          {
            label: 'Calories Consumed',
            data: nutritionCalories,
            backgroundColor: 'rgba(153,102,255,0.4)',
            borderColor: 'rgba(153,102,255,1)',
            tension: 0.4,
          },
          {
            label: 'Calorie Goal',
            data: nutritionGoalCalories,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderDash: [5, 5],
          },
        ],
      });

      // Store goal data, matching goal types to their respective values
      const userGoals = goalsResponse.data.reduce((acc, goal) => {
        acc[goal.type.toLowerCase()] = goal.target; // Assuming type is like 'Steps', 'Workouts', 'Calories'
        return acc;
      }, {});
      setGoalData(prevState => ({
        ...prevState,
        ...userGoals,
      }));

      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Unauthorized. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch data. Please try again later.');
      }
      console.error(error);
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Logged Exercises</h2>
          <Line
            data={exerciseData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw} hrs`,
                  },
                },
              },
            }}
          />
          <button onClick={() => setShowExerciseModal(true)} className="mt-4 bg-blue-500 text-white p-2 rounded">
            Log Exercise
          </button>
          <Link to="/exercise-list" className="mt-4 bg-gray-500 text-white p-2 rounded block text-center">
            View Exercise List
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Logged Nutrition</h2>
          <Line
            data={nutritionData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw} kcal`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Calories',
                  },
                },
              },
            }}
          />
          <button onClick={() => setShowNutritionModal(true)} className="mt-4 bg-blue-500 text-white p-2 rounded">
            Log Nutrition
          </button>
          <Link to="/nutrition-list" className="mt-4 bg-gray-500 text-white p-2 rounded block text-center">
            View Nutrition List
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Goals</h2>
        <ul className="list-disc list-inside">
          <li className="mb-2">Daily Steps: {goalData.steps || '10,000'}</li>
          <li className="mb-2">Weekly Workouts: {goalData.workouts || '5'}</li>
          <li>Calorie Target: {goalData.calories || '2,000'}/day</li>
        </ul>
        <button onClick={() => setShowGoalModal(true)} className="mt-4 bg-green-500 text-white p-2 rounded">
          Set New Goal
        </button>
        <Link to="/goals-list" className="mt-4 bg-gray-500 text-white p-2 rounded block text-center">
          View Goals List
        </Link>
      </div>

      {/* Modals for logging and setting goals */}
      {showExerciseModal && <LogExercise onClose={() => setShowExerciseModal(false)} fetchData={fetchData} />}
      {showNutritionModal && <LogNutrition onClose={() => setShowNutritionModal(false)} fetchData={fetchData} />}
      {showGoalModal && <GoalSettingPage onClose={() => setShowGoalModal(false)} />}

    </div>
  );
};

export default Dashboard;
