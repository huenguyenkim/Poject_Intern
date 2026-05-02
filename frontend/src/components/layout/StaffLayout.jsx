import React from 'react';
import { Layout, Avatar } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { LogOut, Candy } from 'lucide-react';

const { Header, Content } = Layout;

const StaffLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/admin/login'); // Reusing admin login for staff for simplicity
    };

    return (
        <Layout className="min-h-screen bg-gray-50">
            <Header className="bg-white px-4 flex items-center justify-between border-b shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg shadow-sm">
                        <Candy size={20} className="text-white" />
                    </div>
                    <span className="font-black text-lg text-gray-800 tracking-tight">Kho Hàng</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 py-1 px-3 rounded-full border border-gray-100">
                        <Avatar size="small" className="bg-primary/20 text-primary font-bold">
                            {user?.name?.charAt(0) || 'S'}
                        </Avatar>
                        <span className="text-sm font-bold text-gray-600 truncate max-w-[80px]">{user?.name}</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 -mr-2 text-gray-400 hover:text-red-500 transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </Header>
            <Content className="p-0 w-full max-w-md mx-auto">
                <Outlet />
            </Content>
        </Layout>
    );
};

export default StaffLayout;
