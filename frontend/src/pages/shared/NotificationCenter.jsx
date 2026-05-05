import React from 'react';
import { useSelector } from 'react-redux';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../hooks/useNotifications';
import { format } from 'date-fns';
import { 
    Bell, 
    Package, 
    AlertCircle, 
    MessageSquare, 
    Info, 
    CheckCheck,
    Trash2,
    Search,
    Filter
} from 'lucide-react';
import Button from '../../components/ui/Button';

const NotificationCenter = () => {
    const { user } = useSelector(state => state.auth);
    const { data: notifications, isLoading } = useNotifications(user);
    const { mutate: markAsRead } = useMarkAsRead();
    const { mutate: markAllAsRead } = useMarkAllAsRead();

    const getIcon = (type) => {
        switch (type) {
            case 'ORDER': return <Package size={20} className="text-blue-500" />;
            case 'TASK': return <AlertCircle size={20} className="text-orange-500" />;
            case 'MESSAGE': return <MessageSquare size={20} className="text-green-500" />;
            default: return <Info size={20} className="text-gray-500" />;
        }
    };

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 px-2 md:px-0">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-on_surface tracking-tight uppercase italic leading-tight">
                        Trung tâm <span className="text-primary">Thông báo</span>
                    </h1>
                    <p className="text-sm md:text-base text-on_surface_variant/60 font-bold">
                        Bạn có <span className="text-primary">{unreadCount}</span> thông báo chưa đọc
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        className="rounded-2xl py-2.5 px-4 sm:py-3 sm:px-6 text-xs sm:text-sm whitespace-nowrap"
                        onClick={() => markAllAsRead()}
                        disabled={unreadCount === 0}
                    >
                        <CheckCheck size={16} className="mr-2" />
                        Đánh dấu tất cả là đã đọc
                    </Button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-2xl shadow-primary/5 border border-surface_container/50 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 md:p-20 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary mx-auto mb-4"></div>
                        <p className="font-black text-xs md:text-sm text-on_surface_variant uppercase tracking-widest">Đang tải...</p>
                    </div>
                ) : !notifications || notifications.length === 0 ? (
                    <div className="p-12 md:p-20 text-center space-y-4 md:space-y-6">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-surface_dim rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                            <Bell size={32} className="md:size-12" />
                        </div>
                        <div className="space-y-1 md:space-y-2">
                            <h3 className="text-xl md:text-2xl font-black text-on_surface">Hộp thư trống</h3>
                            <p className="text-sm md:text-base text-on_surface_variant/60 font-bold">Bạn không có thông báo nào vào lúc này.</p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-surface_container/30">
                        {notifications.map((notif) => (
                            <div 
                                key={notif.id}
                                onClick={() => { if(!notif.isRead) markAsRead(notif.id); }}
                                className={`group p-5 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6 transition-all cursor-pointer hover:bg-surface_dim relative ${!notif.isRead ? 'bg-primary/[0.02]' : ''}`}
                            >
                                {/* Unread indicator */}
                                {!notif.isRead && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
                                )}

                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${!notif.isRead ? 'bg-primary/10 shadow-lg shadow-primary/10' : 'bg-surface_dim'}`}>
                                    {getIcon(notif.type)}
                                </div>

                                <div className="flex-grow space-y-1 sm:space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                        <h4 className={`text-base sm:text-xl tracking-tight leading-tight ${!notif.isRead ? 'font-black text-on_surface' : 'font-bold text-on_surface_variant'}`}>
                                            {notif.title}
                                        </h4>
                                        <span className="text-[9px] sm:text-xs font-black uppercase text-on_surface_variant/30 tracking-widest">
                                            {format(new Date(notif.createdAt), 'HH:mm, dd/MM/yyyy')}
                                        </span>
                                    </div>
                                    <p className={`text-sm sm:text-lg leading-relaxed max-w-2xl ${!notif.isRead ? 'text-on_surface/80 font-medium' : 'text-on_surface_variant/60 font-medium'}`}>
                                        {notif.content}
                                    </p>
                                    
                                    <div className="pt-2 sm:pt-4 flex items-center gap-4">
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 sm:px-3 py-1 rounded-full">
                                            {notif.type}
                                        </span>
                                        {notif.isRead && (
                                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-on_surface_variant/40 flex items-center gap-1">
                                                <CheckCheck size={10} className="sm:size-12" />
                                                Đã đọc
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
