import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Plus, 
  Link as LinkIcon, 
  Calendar, 
  Pencil, 
  Trash2, 
  Eye, 
  TrendingUp,
  MousePointer2,
  ChevronDown,
  RefreshCw,
  Search
} from 'lucide-react';

const BannerMgmt = () => {
  const { banners } = useStore();
  const [loading, setLoading] = useState(false);

  // Performance data mock
  const performance = {
    views: '12.4k',
    topClickThru: 'Summer Carnival',
    conversionRate: '4.8%'
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[11px] font-black text-[#b0a9bc] uppercase tracking-[0.2em]">
            <span>Admin</span>
            <span>›</span>
            <span className="text-[#2d2a4a]">Banner Management</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-[#2d2a4a] tracking-tight">Banner Management</h1>
            <p className="text-[#8e8a9d] font-bold text-lg">Design and schedule promotional banners for your homepage.</p>
          </div>
        </div>
        <button className="bg-primary hover:bg-[#d92d6a] text-white px-8 py-4 rounded-2xl font-black text-[15px] flex items-center gap-3 shadow-lg shadow-pink-100 transition-all hover:scale-[1.05]">
          <Plus size={22} strokeWidth={3} /> Add New Banner
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Large Banner (First one) */}
        {banners.length > 0 && (
          <div className="lg:col-span-2 bg-white rounded-[45px] border border-[#ece8f1] overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <div className="relative h-[400px]">
               <img src={banners[0].image} alt={banners[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
               <div className="absolute bottom-10 left-10 space-y-4">
                  <span className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                    {banners[0].tag}
                  </span>
                  <h2 className="text-4xl font-black text-white max-w-lg leading-tight drop-shadow-lg">
                    {banners[0].title}
                  </h2>
               </div>
            </div>
            <div className="p-8 flex items-center justify-between">
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[13px] font-bold text-[#8e8a9d]">
                     <LinkIcon size={16} /> <span>{banners[0].link}</span>
                  </div>
                  {banners[0].endDate && (
                    <div className="flex items-center gap-3 text-[13px] font-bold text-[#8e8a9d]">
                       <Calendar size={16} /> <span>Ends {banners[0].endDate}</span>
                    </div>
                  )}
               </div>
               <div className="flex items-center gap-3">
                  <button className="p-4 bg-[#f4ebff] text-[#7c3aed] rounded-2xl hover:scale-110 transition-transform">
                     <Pencil size={20} />
                  </button>
                  <button className="p-4 bg-[#fff0f3] text-[#f13a7b] rounded-2xl hover:scale-110 transition-transform">
                     <Trash2 size={20} />
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* Small Banner 1 */}
        {banners.length > 1 && (
          <div className="bg-white rounded-[45px] border border-[#ece8f1] overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-[250px]">
               <img src={banners[1].image} alt={banners[1].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
               <div className="absolute bottom-6 left-6 space-y-2">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
                    {banners[1].tag}
                  </span>
                  <h3 className="text-xl font-black text-white drop-shadow-md">{banners[1].title}</h3>
               </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
               <div className="flex items-center gap-3 text-[12px] font-bold text-[#8e8a9d]">
                  <LinkIcon size={14} /> <span>{banners[1].link}</span>
               </div>
               <div className="flex items-center justify-end gap-3 mt-6">
                  <button className="p-3.5 bg-[#f4ebff] text-[#7c3aed] rounded-2xl hover:scale-110 transition-transform">
                     <Pencil size={18} />
                  </button>
                  <button className="p-3.5 bg-[#fff0f3] text-[#f13a7b] rounded-2xl hover:scale-110 transition-transform">
                     <Trash2 size={18} />
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* Small Banner 2 (Draft) */}
        {banners.length > 2 && (
          <div className="bg-white rounded-[45px] border border-[#ece8f1] overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-[250px]">
               <img src={banners[2].image} alt={banners[2].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
               <div className="absolute bottom-6 left-6 space-y-2">
                  <span className="bg-[#4a8fb1] text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
                    {banners[2].tag}
                  </span>
                  <h3 className="text-xl font-black text-white drop-shadow-md">{banners[2].title}</h3>
               </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
               <div className="flex items-center gap-3 text-[12px] font-bold text-[#8e8a9d]">
                  <LinkIcon size={14} /> <span>{banners[2].link}</span>
               </div>
               <div className="flex items-center justify-end gap-3 mt-6">
                  <button className="p-3.5 bg-[#f4ebff] text-[#7c3aed] rounded-2xl hover:scale-110 transition-transform">
                     <Pencil size={18} />
                  </button>
                  <button className="p-3.5 bg-[#fff0f3] text-[#f13a7b] rounded-2xl hover:scale-110 transition-transform">
                     <Trash2 size={18} />
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* Banner Performance Summary */}
        <div className="bg-gradient-to-br from-[#7c3aed] to-[#d946ef] rounded-[45px] p-10 shadow-lg shadow-purple-100/50 flex flex-col justify-between group overflow-hidden relative">
           <div className="relative z-10 space-y-1">
              <p className="text-[13px] font-black text-white/80 uppercase tracking-widest flex items-center gap-2">
                 Banner Performance
              </p>
              <h2 className="text-5xl font-black text-white tracking-tight">{performance.views} Views</h2>
              <p className="text-[14px] font-bold text-white/70 leading-relaxed max-w-[240px] pt-2">
                 Combined reach across all active banners this week.
              </p>
           </div>
           
           <div className="relative z-10 space-y-6 mt-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10">
                 <div className="flex items-center gap-3">
                    <TrendingUp size={18} className="text-white/80" />
                    <span className="text-[13px] font-bold text-white/80">Top Click-thru</span>
                 </div>
                 <span className="bg-white text-[#7c3aed] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight">
                    {performance.topClickThru}
                 </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10">
                 <div className="flex items-center gap-3">
                    <MousePointer2 size={18} className="text-white/80" />
                    <span className="text-[13px] font-bold text-white/80">Conversion Rate</span>
                 </div>
                 <span className="text-white font-black text-lg">{performance.conversionRate}</span>
              </div>
           </div>

           <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors"></div>
        </div>

        {/* Small Banner 3 */}
        {banners.length > 3 && (
          <div className="bg-white rounded-[45px] border border-[#ece8f1] overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-[250px]">
               <img src={banners[3].image} alt={banners[3].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
               <div className="absolute bottom-6 left-6 space-y-2">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
                    {banners[3].tag}
                  </span>
                  <h3 className="text-xl font-black text-white drop-shadow-md">{banners[3].title}</h3>
               </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
               <div className="flex items-center gap-3 text-[12px] font-bold text-[#8e8a9d]">
                  <LinkIcon size={14} /> <span>{banners[3].link}</span>
               </div>
               <div className="flex items-center justify-end gap-3 mt-6">
                  <button className="p-3.5 bg-[#f4ebff] text-[#7c3aed] rounded-2xl hover:scale-110 transition-transform">
                     <Pencil size={18} />
                  </button>
                  <button className="p-3.5 bg-[#fff0f3] text-[#f13a7b] rounded-2xl hover:scale-110 transition-transform">
                     <Trash2 size={18} />
                  </button>
               </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Tools */}
      <div className="flex justify-center pt-6">
        <button 
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1000);
          }}
          className="flex items-center gap-3 text-[14px] font-black text-primary px-10 py-4 rounded-full border-2 border-primary/20 hover:bg-primary/5 transition-all shadow-sm active:scale-95"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
          Load More Banners
        </button>
      </div>

    </div>
  );
};

export default BannerMgmt;
