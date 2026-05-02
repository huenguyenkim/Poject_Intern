import React, { useEffect, useRef, useState } from 'react';

/**
 * LazySection Component: Chỉ render nội dung bên trong khi xuất hiện trong Viewport.
 * Giải quyết vấn đề performance khi có hàng trăm DOM nodes (Scalability).
 */
const LazySection = ({ children, threshold = 0.1, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Ngừng quan sát sau khi đã render
        }
      },
      {
        root: null, // viewport
        rootMargin: '200px', // Render sớm hơn một chút trước khi người dùng cuộn tới
        threshold
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [threshold]);

  return (
    <div ref={sectionRef} className={`min-h-[200px] ${className}`}>
      {isVisible ? children : (
        <div className="w-full h-64 bg-surface_container_low animate-pulse rounded-[40px] border-2 border-dashed border-surface_container flex items-center justify-center">
             <span className="text-on_surface_variant/40 font-black uppercase tracking-widest text-xs">🍭 Preparing Sweets...</span>
        </div>
      )}
    </div>
  );
};

export default LazySection;
