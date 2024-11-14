//frontend\src\components\Goals\ProgressBar.js
import React from 'react';

const ProgressBar = ({ value, max }) => {
  const progress = Math.min((value / max) * 100, 100);

  return (
    <div className="relative w-full h-4 bg-gray-200 rounded">
      <div
        style={{ width: `${progress}%` }}
        className="absolute top-0 left-0 h-4 bg-green-500 rounded"
      ></div>
    </div>
  );
};

export default ProgressBar;