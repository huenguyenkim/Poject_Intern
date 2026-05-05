import React, { useState } from 'react';
import { Bell, Package, AlertCircle, MessageSquare, Info } from 'lucide-react';
import { useNotifications, useMarkAsRead } from '../../hooks/useNotifications';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useParams } from 'react-router-dom';

const NotificationBell = () => {
    const { user } = useSelector(state => state.auth);
    const { data: notifications, isLoading } = useNotifications(user);
    const { mutate: markAsRead } = useMarkAsRead();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { lang } = useParams();

    const isAdmin = location.pathname.startsWith('/admin');
    const targetPath = isAdmin ? '/admin/notifications' : `/${lang || 'vi'}/notifications`;

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    const getIcon = (type) => {
        switch (type) {
            case 'ORDER': return <Package size={16} className="text-blue-500" />;
            case 'TASK': return <AlertCircle size={16} className="text-orange-500" />;
            case 'MESSAGE': return <MessageSquare size={16} className="text-green-500" />;
            default: return <Info size={16} className="text-gray-500" />;
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-surface_container/20 transition-colors"
            >
                <Bell size={24} className="text-on_surface_variant" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-80 bg-white rounded-[32px] shadow-2xl border border-surface_container/50 overflow-hidden z-50"
                        >
                            <div className="p-6 border-b border-surface_container flex justify-between items-center">
                                <h3 className="font-black text-on_surface uppercase tracking-tight">Thông báo</h3>
                                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                                    {unreadCount} chưa đọc
                                </span>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {isLoading ? (
                                    <div className="p-8 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div></div>
                                ) : notifications?.length === 0 ? (
                                    <div className="p-12 text-center text-on_surface_variant/40 font-bold">
                                        <Bell size={32} className="mx-auto mb-3 opacity-20" />
                                        Không có thông báo nào
                                    </div>
                                ) : (
                                    notifications?.map(notif => (
                                        <div 
                                            key={notif.id}
                                            onClick={() => { if(!notif.isRead) markAsRead(notif.id); }}
                                            className={`p-5 border-b border-surface_container/30 cursor-pointer transition-colors hover:bg-surface_dim flex gap-4 ${!notif.isRead ? 'bg-primary/5' : ''}`}
                                        >
                                            <div className="mt-1">{getIcon(notif.type)}</div>
                                            <div className="flex-grow">
                                                <h4 className={`text-sm leading-tight mb-1 ${!notif.isRead ? 'font-black text-on_surface' : 'font-bold text-on_surface_variant'}`}>
                                                    {notif.title}
                                                </h4>
                                                <p className="text-xs text-on_surface_variant/70 mb-2 line-clamp-2">{notif.content}</p>
                                                <span className="text-[9px] font-black uppercase text-on_surface_variant/40">
                                                    {format(new Date(notif.createdAt), 'HH:mm, dd/MM')}
                                                </span>
                                            </div>
                                            {!notif.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-4 bg-surface_dim text-center">
                                <Link 
                                    to={targetPath}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-[10px] font-black text-on_surface_variant/60 uppercase tracking-widest hover:text-primary transition-colors"
                                >
                                    Xem tất cả thông báo
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
