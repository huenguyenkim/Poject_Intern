import React from 'react';

const Badge = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all select-none';
  
  const variants = {
    primary: 'bg-primary/10 text-primary border border-primary/10',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/10',
    tertiary: 'bg-tertiary/10 text-tertiary border border-tertiary/10',
    outline: 'border border-surface_container text-on_surface_variant hover:border-primary/30 hover:text-primary',
  };

  return (
    <span 
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
