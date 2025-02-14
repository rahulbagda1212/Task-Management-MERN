import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
};
