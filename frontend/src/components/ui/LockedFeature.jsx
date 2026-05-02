import React from 'react';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from './Button';

const LockedFeature = ({ children, requiredTier = 'PREMIUM', featureName = 'Tính năng cao cấp' }) => {
  const { user } = useSelector((state) => state.auth);
  
  // Logic Điều kiện: Kiểm tra quyền truy cập
  // Admin luôn có quyền, hoặc user có tier >= requiredTier
  const hasAccess = user?.role === 'ADMIN' || 
                   (requiredTier === 'BASIC') || 
                   (requiredTier === 'PREMIUM' && (user?.tier === 'PREMIUM' || user?.tier === 'VIP')) ||
                   (requiredTier === 'VIP' && user?.tier === 'VIP');

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      {/* Blurred Preview */}
      <div className="opacity-40 pointer-events-none blur-[2px] grayscale transition-all">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/20 backdrop-blur-[6px] rounded-[32px] border-2 border-dashed border-primary/20 p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center mb-4 relative">
          <Lock size={32} className="text-primary" />
          <Crown size={18} className="absolute -top-1 -right-1 text-secondary animate-bounce" />
        </div>
        
        <h3 className="text-xl font-black text-on_surface uppercase tracking-tight mb-2">
          {featureName}
        </h3>
        
        <p className="text-sm font-bold text-on_surface_variant mb-6 max-w-[200px]">
          Bạn cần nâng cấp lên gói <span className="text-primary">{requiredTier}</span> để mở khóa tính năng này.
        </p>

        <Button variant="primary" size="sm" className="px-8 rounded-full shadow-lg shadow-primary/20 flex items-center gap-2 group-hover:scale-105 transition-all">
          <Sparkles size={16} />
          NÂNG CẤP NGAY
        </Button>
      </div>
    </div>
  );
};

export default LockedFeature;
