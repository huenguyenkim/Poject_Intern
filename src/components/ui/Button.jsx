import React from 'react';

/**
 * Component Button tùy chỉnh với các kiểu dáng và kích thước khác nhau.
 * 
 * @param {Object} props - Các thuộc tính của component.
 * @param {React.ReactNode} props.children - Nội dung hiển thị bên trong nút.
 * @param {'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'surface'} [props.variant='primary'] - Kiểu dáng của nút.
 * @param {string} [props.className=''] - Các class CSS bổ sung.
 * @param {'full' | '2xl' | '3xl'} [props.rounded='full'] - Độ bo góc của nút.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Kích thước của nút.
 * @param {Object} props.props - Các thuộc tính HTML button chuẩn khác.
 * @returns {JSX.Element} Component Button đã được định dạng.
 */
const Button = ({ children, variant = 'primary', className = '', rounded = 'full', size = 'md', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-black tracking-tight bouncy-hover transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none group select-none';
  
  const rounding = {
    'full': 'rounded-full',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-[32px]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3.5 text-sm',
    lg: 'px-8 py-4.5 text-base',
  };

  const variants = {
    primary: 'bg-primary text-on_primary shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30',
    secondary: 'bg-secondary text-on_primary shadow-lg shadow-secondary/20 hover:bg-secondary/90 hover:shadow-xl hover:shadow-secondary/30',
    tertiary: 'bg-tertiary text-on_primary shadow-lg shadow-tertiary/20 hover:bg-tertiary/90 hover:shadow-xl hover:shadow-tertiary/30',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'text-primary hover:bg-primary/10 bg-transparent',
    surface: 'bg-surface_container text-on_surface hover:bg-surface_container_high',
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${rounding[rounded] || rounding.full} 
        ${sizes[size] || sizes.md} 
        ${variants[variant] || variants.primary} 
        ${className}
      `} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
