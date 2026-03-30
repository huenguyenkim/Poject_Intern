import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`
        bg-white rounded-[32px] border border-surface_container shadow-sm 
        hover:shadow-xl hover:shadow-secondary/10 transition-all duration-500 
        relative overflow-hidden group 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
