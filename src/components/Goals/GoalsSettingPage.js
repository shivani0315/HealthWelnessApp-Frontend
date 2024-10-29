import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import GoalsList from './GoalsList';

const GoalSettingPage = () => {
    const [progress, setProgress] = useState({
        steps: 0,
        workouts: 0,
        calories: 0,
    });
    const [goals, setGoals] = useState([]);
    const [newGoalType, setNewGoalType] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // New state for error messages

    const fetchGoalData = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/goals', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.length > 0) {
                const uniqueGoals = response.data.filter((goal, index, self) =>
                    index === self.findIndex((g) => g.type === goal.type)
                );

                setGoals(uniqueGoals);
                calculateProgress(uniqueGoals);
            }
        } catch (error) {
            console.error('Error fetching goal data:', error.response ? error.response.data : error.message);
        }
    }, []);

    const calculateProgress = (fetchedGoals) => {
        const currentProgress = {
            steps: 8000,
            workouts: 3,
            calories: 1800,
        };

        setProgress({
            steps: Math.min((currentProgress.steps / (fetchedGoals.find(goal => goal.type === 'Steps')?.target || 1)) * 100, 100) || 0,
            workouts: Math.min((currentProgress.workouts / (fetchedGoals.find(goal => goal.type === 'Workouts')?.target || 1)) * 100, 100) || 0,
            calories: Math.min((currentProgress.calories / (fetchedGoals.find(goal => goal.type === 'Calories')?.target || 1)) * 100, 100) || 0,
        });
    };

    const handleGoalUpdate = async (goalType, newTarget) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                'http://localhost:5000/api/goals/update', 
                { type: goalType, target: newTarget }, 
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchGoalData();
        } catch (error) {
            console.error('Error updating goal:', error.response ? error.response.data : error.message);
        }
    };

    const handleSetNewGoal = async () => {
        setErrorMessage(''); // Reset any previous error message

        // Check if required fields are provided
        if (!newGoalType || !newGoalTarget) {
            setErrorMessage('Both goal type and target are required.');
            console.error('Both type and target must be provided.');
            return;
        }

        // Check for duplicates
        if (goals.some(goal => goal.type === newGoalType)) {
            setErrorMessage(`Goal of type "${newGoalType}" already exists.`);
            console.error(`Goal of type "${newGoalType}" already exists.`);
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await axios.post(
                'http://localhost:5000/api/goals', 
                { type: newGoalType, target: newGoalTarget }, 
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchGoalData();
            setNewGoalType('');
            setNewGoalTarget('');
        } catch (error) {
            console.error('Error setting new goal:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchGoalData();
    }, [fetchGoalData]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Set and Track Your Goals</h1>

            <GoalsList goals={goals} />

            <div>
                <h2>Daily Steps (Target: {goals.find(goal => goal.type === 'Steps')?.target || 0})</h2>
                <ProgressBar value={progress.steps} max={100} />
                <button onClick={() => handleGoalUpdate('Steps', 12000)} className="mt-2 bg-blue-500 text-white p-2 rounded">
                    Update Step Goal
                </button>
            </div>

            <div className="mt-4">
                <h2>Weekly Workouts (Target: {goals.find(goal => goal.type === 'Workouts')?.target || 0})</h2>
                <ProgressBar value={progress.workouts} max={100} />
                <button onClick={() => handleGoalUpdate('Workouts', 7)} className="mt-2 bg-blue-500 text-white p-2 rounded">
                    Update Workout Goal
                </button>
            </div>

            <div className="mt-4">
                <h2>Calorie Target (Target: {goals.find(goal => goal.type === 'Calories')?.target || 0})</h2>
                <ProgressBar value={progress.calories} max={100} />
                <button onClick={() => handleGoalUpdate('Calories', 2200)} className="mt-2 bg-blue-500 text-white p-2 rounded">
                    Update Calorie Goal
                </button>
            </div>

            {/* New Goal Form */}
            <div className="mt-6">
                <h2>Set a New Goal</h2>
                <input 
                    type="text" 
                    value={newGoalType} 
                    onChange={(e) => setNewGoalType(e.target.value)} 
                    placeholder="Goal Type (e.g., Steps)" 
                    className="p-2 border rounded mt-2"
                />
                <input 
                    type="number" 
                    value={newGoalTarget} 
                    onChange={(e) => setNewGoalTarget(e.target.value)} 
                    placeholder="Target (e.g., 10000)" 
                    className="p-2 border rounded mt-2 ml-2"
                />
                <button onClick={handleSetNewGoal} className="bg-green-500 text-white p-2 rounded ml-2">
                    Set New Goal
                </button>
                {/* Display error message */}
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default GoalSettingPage;
