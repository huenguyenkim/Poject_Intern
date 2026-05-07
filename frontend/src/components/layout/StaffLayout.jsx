import React from 'react';
import { Layout, Avatar } from 'antd';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { LogOut, Candy, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { Header, Content } = Layout;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();

  const changeLanguage = (newLang) => {
    if (newLang === i18n.language) return;
    
    // Replace the language segment in the current path
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === lang) {
      pathParts[1] = newLang;
    } else {
      pathParts.splice(1, 0, newLang);
    }
    
    const newPath = pathParts.join('/') + location.search;
    i18n.changeLanguage(newLang);
    navigate(newPath, { replace: true });
  };

  return (
    <div className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1 border border-gray-100 shadow-sm">
      <Globe size={12} className="text-primary" />
      <div className="flex gap-1">
        <button 
          onClick={() => changeLanguage('vi')}
          className={`text-[8px] font-black px-1.5 py-0.5 rounded transition-all ${i18n.language === 'vi' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary'}`}
        >
          VI
        </button>
        <button 
          onClick={() => changeLanguage('en')}
          className={`text-[8px] font-black px-1.5 py-0.5 rounded transition-all ${i18n.language === 'en' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary'}`}
        >
          EN
        </button>
      </div>
    </div>
  );
};

const StaffLayout = () => {
    const { t } = useTranslation();
    const { lang } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate(`/${lang}/admin/login`); // Reusing admin login for staff for simplicity
    };

    return (
        <Layout className="min-h-screen bg-gray-50 font-sans">
            <Header className="bg-white px-4 flex items-center justify-between border-b shadow-sm sticky top-0 z-50 h-16">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg shadow-sm">
                        <Candy size={20} className="text-white" />
                    </div>
                    <span className="font-black text-lg text-gray-800 tracking-tight">{t('admin.tasks')}</span>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <div className="flex items-center gap-2 bg-gray-50 py-1 px-2 rounded-full border border-gray-100">
                        <Avatar size="small" className="bg-primary/20 text-primary font-bold">
                            {user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'S'}
                        </Avatar>
                        <span className="text-xs font-bold text-gray-600 truncate max-w-[60px]">{user?.fullName || user?.name}</span>
                    </div>
                    <button onClick={handleLogout} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <LogOut size={18} />
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
