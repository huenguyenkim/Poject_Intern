import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold px-6 py-3 rounded-full bouncy-hover transition-colors';
  const variants = {
    primary: 'bg-primary text-on_primary shadow-tinted-primary hover:bg-primary/90',
    secondary: 'bg-secondary text-on_primary shadow-tinted-secondary hover:bg-secondary/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
    ghost: 'text-primary hover:bg-primary/10',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
