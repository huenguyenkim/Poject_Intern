import React from 'react';

/**
 * Component Placeholder hiển thị trạng thái "Đang phát triển" hoặc nội dung tạm thời.
 * Sử dụng để hiển thị các trang hoặc tính năng chưa hoàn thiện.
 * 
 * @param {Object} props - Các thuộc tính của component.
 * @param {string} [props.title="Coming Soon"] - Tiêu đề chính hiển thị.
 * @param {string} [props.subtitle="We're working hard to bring you this feature."] - Nội dung mô tả chi tiết.
 * @returns {JSX.Element} Component Placeholder đã được định dạng.
 */
const Placeholder = ({ title = "Coming Soon", subtitle = "We're working hard to bring you this feature." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-20 text-center min-h-[400px]">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <div className="w-10 h-10 bg-primary/20 rounded-full"></div>
      </div>
      <h2 className="text-3xl font-black text-on_surface uppercase tracking-[0.2em] mb-4 italic">
        {title}
      </h2>
      <p className="text-on_surface_variant font-medium max-w-md">
        {subtitle}
      </p>
    </div>
  );
};

export default Placeholder;
