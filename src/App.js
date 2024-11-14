import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard';
import LogExercise from './components/Exercise/LogExercise';
import LogNutrition from './components/Nutrition/LogNutrition';
import SetGoal from './components/Goals/SetGoal';
import ExerciseList from './components/Exercise/ExerciseList';
import NutritionList from './components/Nutrition/NutritionList';
import GoalsList from './components/Goals/GoalsList';
import Home from './components/Auth/Home';
import GoalSettingPage from './components/Goals/GoalsSettingPage';

// PrivateRoute Component to protect routes
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />; // Redirect to login if no user is found
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/log-exercise" element={<PrivateRoute><LogExercise /></PrivateRoute>} />
            <Route path="/log-nutrition" element={<PrivateRoute><LogNutrition /></PrivateRoute>} />
            <Route path="/set-goal" element={<PrivateRoute><SetGoal /></PrivateRoute>} />
            <Route path="/exercise-list" element={<PrivateRoute><ExerciseList /></PrivateRoute>} />
            <Route path="/nutrition-list" element={<PrivateRoute><NutritionList /></PrivateRoute>} />
            <Route path="/goals-list" element={<PrivateRoute><GoalsList /></PrivateRoute>} />
            <Route path="/goal-setting" element={<PrivateRoute><GoalSettingPage /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
