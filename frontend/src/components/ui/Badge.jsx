import React from 'react';
import { Tag as AntTag } from 'antd';

/**
 * Enhanced Badge component (Mapping to Ant Design Tag).
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Badge content.
 * @param {'primary' | 'secondary' | 'tertiary' | 'outline' | 'surface'} [props.variant='primary'] - Badge style variant.
 * @param {string} [props.className=''] - Additional CSS classes.
 */
const Badge = ({ children, variant = 'primary', className = '', ...props }) => {
  // Mapping variants to colors/styles
  const colorMap = {
    primary: '#FF76B8',
    secondary: '#8E44AD',
    tertiary: '#2ECC71',
    outline: 'default',
    surface: 'default',
  };

  const customStyle = {
    borderRadius: 99,
    fontWeight: 900,
    padding: '0 12px',
    height: 24,
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: 10,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    border: variant === 'outline' ? '1px solid #eee' : 'none',
    backgroundColor: variant === 'surface' ? '#f5f5f5' : undefined,
  };

  return (
    <AntTag 
      color={typeof colorMap[variant] === 'string' && colorMap[variant].startsWith('#') ? colorMap[variant] : undefined}
      className={`${className}`}
      style={customStyle}
      {...props}
    >
      {children}
    </AntTag>
  );
};

export default Badge;
