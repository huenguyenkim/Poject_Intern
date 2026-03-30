import React, { forwardRef } from 'react';

/**
 * Component Input tùy chỉnh hỗ trợ nhãn (label), biểu tượng (icon) và thông báo lỗi.
 * 
 * @param {Object} props - Các thuộc tính của component.
 * @param {string} [props.label] - Nhãn hiển thị phía trên ô nhập liệu.
 * @param {React.ElementType} [props.icon] - Biểu tượng hiển thị bên trong ô nhập liệu.
 * @param {string} [props.error] - Thông điệp lỗi hiển thị phía dưới ô nhập liệu.
 * @param {string} [props.className=''] - Các class CSS bổ sung cho ô nhập liệu.
 * @param {string} [props.containerClassName=''] - Các class CSS bổ sung cho container bên ngoài.
 * @param {Object} props.props - Các thuộc tính HTML input chuẩn khác.
 * @param {React.Ref} ref - Tham chiếu đến phần tử input.
 * @returns {JSX.Element} Component Input đã được định dạng.
 */
const Input = forwardRef(({ label, icon: Icon, error, className = '', containerClassName = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label className="text-[11px] font-black text-on_surface uppercase tracking-[0.2em] ml-1 opacity-70">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on_surface_variant/40 group-focus-within:text-primary transition-colors">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-surface_dim py-4 ${Icon ? 'pl-14' : 'px-6'} pr-6 rounded-2xl 
            font-bold text-on_surface border-2 border-transparent 
            focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 
            transition-all outline-none placeholder-on_surface_variant/30 
            ${error ? 'border-error/20 bg-error/5' : ''}
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
