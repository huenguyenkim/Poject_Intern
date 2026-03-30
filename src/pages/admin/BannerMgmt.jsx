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
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

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
          <div className="flex items-center gap-2 text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em]">
            <span>Admin</span>
            <span>›</span>
            <span className="text-on_surface">Banner Management</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-on_surface tracking-tight">Banner Management</h1>
            <p className="text-on_surface_variant font-bold text-lg">Design and schedule promotional banners for your homepage.</p>
          </div>
        </div>
        <Button 
          variant="primary"
          className="px-8 py-4"
        >
          <Plus size={22} strokeWidth={3} /> Add New Banner
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Large Banner (First one) */}
        {banners.length > 0 && (
          <Card className="lg:col-span-2 p-0 overflow-hidden group">
            <div className="relative h-[400px]">
               <img src={banners[0].image} alt={banners[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 space-y-4">
                   <Badge variant="primary" className="px-4 py-1.5 uppercase tracking-widest">
                     {banners[0].tag}
                   </Badge>
                   <h2 className="text-4xl font-black text-on_primary max-w-lg leading-tight drop-shadow-lg">
                     {banners[0].title}
                   </h2>
                </div>
            </div>
             <div className="p-8 flex items-center justify-between">
                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-[13px] font-bold text-on_surface_variant">
                      <LinkIcon size={16} /> <span>{banners[0].link}</span>
                   </div>
                   {banners[0].endDate && (
                     <div className="flex items-center gap-3 text-[13px] font-bold text-on_surface_variant">
                        <Calendar size={16} /> <span>Ends {banners[0].endDate}</span>
                     </div>
                   )}
                </div>
                <div className="flex items-center gap-3">
                   <Button variant="surface" size="sm" className="w-12 h-12 p-0 rounded-2xl text-secondary"><Pencil size={20} /></Button>
                   <Button variant="surface" size="sm" className="w-12 h-12 p-0 rounded-2xl text-primary"><Trash2 size={20} /></Button>
                </div>
            </div>
          </Card>
        )}

        {/* Small Banner 1 */}
        {banners.length > 1 && (
          <Card className="p-0 overflow-hidden group flex flex-col">
            <div className="relative h-[250px]">
               <img src={banners[1].image} alt={banners[1].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 space-y-2">
                   <Badge variant="primary" className="px-3 py-1 uppercase tracking-widest">
                     {banners[1].tag}
                   </Badge>
                   <h3 className="text-xl font-black text-on_primary drop-shadow-md">{banners[1].title}</h3>
                </div>
            </div>
             <div className="p-8 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-[12px] font-bold text-on_surface_variant">
                   <LinkIcon size={14} /> <span>{banners[1].link}</span>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                   <Button variant="surface" size="sm" className="w-10 h-10 p-0 rounded-2xl text-secondary"><Pencil size={18} /></Button>
                   <Button variant="surface" size="sm" className="w-10 h-10 p-0 rounded-2xl text-primary"><Trash2 size={18} /></Button>
                </div>
            </div>
          </Card>
        )}

        {/* Small Banner 2 (Draft) */}
        {banners.length > 2 && (
          <Card className="p-0 overflow-hidden group flex flex-col">
            <div className="relative h-[250px]">
               <img src={banners[2].image} alt={banners[2].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 space-y-2">
                   <Badge variant="tertiary" className="px-3 py-1 uppercase tracking-widest">
                     {banners[2].tag}
                   </Badge>
                   <h3 className="text-xl font-black text-on_primary drop-shadow-md">{banners[2].title}</h3>
                </div>
            </div>
             <div className="p-8 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-[12px] font-bold text-on_surface_variant">
                   <LinkIcon size={14} /> <span>{banners[2].link}</span>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                   <Button variant="surface" size="sm" className="w-10 h-10 p-0 rounded-2xl text-secondary"><Pencil size={18} /></Button>
                   <Button variant="surface" size="sm" className="w-10 h-10 p-0 rounded-2xl text-primary"><Trash2 size={18} /></Button>
                </div>
            </div>
          </Card>
        )}

        {/* Performance Sidebar */}
        <div className="lg:col-span-1 space-y-8">
           <Card className="p-10 space-y-10">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-on_surface">Banner Performance</h3>
                 <RefreshCw size={18} className="text-on_surface_variant/40 hover:text-primary transition-colors cursor-pointer" />
              </div>

              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                          <Eye size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-widest">Total Views</p>
                          <h4 className="text-xl font-black text-on_surface">{performance.views}</h4>
                       </div>
                    </div>
                    <div className="text-success flex items-center gap-1 font-black text-[12px]">
                       <TrendingUp size={14} /> 12%
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center">
                          <MousePointer2 size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-widest">Conversion</p>
                          <h4 className="text-xl font-black text-on_surface">{performance.conversionRate}</h4>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-surface_dim">
                 <p className="text-[10px] font-black text-on_surface_variant uppercase tracking-widest mb-4">Top Performing Campaign</p>
                 <div className="bg-surface_dim p-6 rounded-3xl border border-surface_container flex items-center justify-between">
                    <span className="font-black text-on_surface text-[14px]">{performance.topClickThru}</span>
                    <Badge variant="secondary" className="px-2 py-0.5 uppercase tracking-tighter">LEADER</Badge>
                 </div>
              </div>
           </Card>

           <Card className="bg-secondary p-10 text-on_secondary relative overflow-hidden group border-none">
               <h3 className="text-xl font-black relative z-10 mb-2">Weekly Schedule</h3>
               <p className="text-sm font-bold opacity-80 relative z-10 leading-relaxed">
                  Automate your promotions by setting start and end dates for your banners.
               </p>
               <Button variant="surface" className="mt-8 bg-white border-none text-secondary relative z-10">
                  Open scheduler
               </Button>
               <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
           </Card>
        </div>

        {/* Quick Actions / Configuration */}
        <div className="lg:col-span-2">
           <Card className="p-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-primary/10 text-primary rounded-[28px] flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
                    <ChevronDown size={28} className="rotate-180" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-on_surface">Banner Layout</h3>
                    <p className="text-[13px] font-bold text-on_surface_variant mt-1">Configure how banners are stacked and displayed on the home page.</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                 <Button variant="surface" className="px-6 py-4">Grid View</Button>
                 <Button variant="primary" className="px-6 py-4">Slider Mode</Button>
              </div>
           </Card>
        </div>

      </div>
    </div>
  );
};

export default BannerMgmt;
