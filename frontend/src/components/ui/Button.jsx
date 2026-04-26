import React from 'react';
import { Button as AntButton } from 'antd';

/**
 * Enhanced Button component wrapping Ant Design's Button.
 * Maintains compatibility with existing props while adding Ant Design's professional features.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Button content.
 * @param {'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'surface'} [props.variant='primary'] - Button style variant.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {'full' | '2xl' | '3xl'} [props.rounded='full'] - Corner roundness level.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size.
 * @param {Object} props.props - Standard HTML button attributes.
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  rounded = 'full', 
  size = 'md', 
  isLoading = false, 
  type, 
  ...props 
}) => {
  // Variant mapping to antd types
  const antType = variant === 'primary' ? 'primary' : 
                  variant === 'outline' ? 'default' : 
                  variant === 'ghost' ? 'text' : 'primary';

  const isOutline = variant === 'outline';

  // Specific overrides for variants not easily themed globally
  const variantColors = {
    secondary: 'bg-secondary hover:bg-secondary/90 text-white',
    tertiary: 'bg-tertiary hover:bg-tertiary/90 text-white',
    surface: 'bg-surface_container hover:bg-surface_container_high text-on_surface border-none',
  };

  const variantClass = variantColors[variant] || '';

  return (
    <AntButton 
      type={antType}
      htmlType={type}
      loading={isLoading}
      className={`bouncy-hover transition-all active:scale-95 ${variantClass} ${className}`}
      style={{
        borderRadius: rounded === '3xl' ? 32 : rounded === '2xl' ? 16 : 999,
        // Override border for outline to match project style
        border: isOutline ? '2px solid' : undefined,
      }}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;
