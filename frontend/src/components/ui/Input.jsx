import React, { forwardRef } from 'react';

/**
 * Robust Input component using standard HTML input for maximum compatibility with react-hook-form.
 * Styled to match the Candy design system.
 */
const Input = forwardRef(({ label, icon: Icon, error, className = '', containerClassName = '', type = 'text', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-2 ${containerClassName} w-full`}>
      {label && (
        <label className="text-[11px] font-black text-on_surface uppercase tracking-[0.2em] ml-1 opacity-70">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-6 pointer-events-none text-on_surface_variant/40">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full bg-surface_dim py-4 rounded-[20px] 
            font-bold text-on_surface border-2 border-transparent 
            focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 
            transition-all outline-none placeholder:text-on_surface_variant/30
            ${Icon ? 'pl-14 pr-6' : 'px-6'}
            ${error ? 'border-error/20 bg-error/5 text-error' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] font-black text-error pl-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
