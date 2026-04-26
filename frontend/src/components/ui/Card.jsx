import React from 'react';
import { Card as AntCard } from 'antd';

/**
 * Enhanced Card component wrapping Ant Design's Card.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Card content.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {boolean} [props.bordered=false] - Whether the card has a border (maps to variant).
 */
const Card = ({ children, className = '', bordered = false, ...props }) => {
  return (
    <AntCard 
      variant={bordered ? 'outlined' : 'borderless'}
      className={`
        !rounded-[32px] !border-surface_container !shadow-sm 
        hover:!shadow-xl hover:!shadow-secondary/10 !transition-all !duration-500 
        !relative !overflow-hidden !group 
        ${className}
      `}
      styles={{
        body: { padding: 0 } // Default to no padding to maintain layout compatibility
      }}
      {...props}
    >
      {children}
    </AntCard>
  );
};

export default Card;
