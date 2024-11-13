// src/components/ChartComponent.js
import React, { useEffect } from 'react';
import { Chart } from 'chart.js';

const ChartComponent = ({ exerciseData, nutritionData }) => {
  useEffect(() => {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Create the chart
    const myChart = new Chart(ctx, {
      type: 'line', // Change to desired chart type
      data: {
        labels: exerciseData.map(e => new Date(e.date).toLocaleDateString()),
        datasets: [
          {
            label: 'Exercises',
            data: exerciseData.map(e => e.calories),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Nutrition',
            data: nutritionData.map(n => n.calories),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Cleanup on unmount
    return () => {
      myChart.destroy();
    };
  }, [exerciseData, nutritionData]); // Re-run effect when data changes

  return <canvas id="myChart" width="400" height="200"></canvas>;
};

export default ChartComponent;
