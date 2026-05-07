import React from 'react';
import { Dropdown, Spin } from 'antd';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Settings, User, LogOut, ShieldCheck, Package, FileText, Users, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../api/apiClient';
import { logout } from '../../store/authSlice';
import { logoutUserThunk } from '../../store/authThunks';
import NotificationBell from '../ui/NotificationBell';

const resultConfig = {
  users: { title: 'Users', icon: Users },
  orders: { title: 'Orders', icon: Package },
  blogs: { title: 'Blogs', icon: FileText },
};

import LanguageSwitcher from '../navigation/LanguageSwitcher';

const TopUtilityBar = ({ placeholder = 'Search everything...' }) => {
  const { t, i18n } = useTranslation();
  const inputRef = React.useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState({ users: [], orders: [], blogs: [] });
  const [isSearching, setIsSearching] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const SECTION_LABELS = {
    admin: t('admin.dashboard'),
    tasks: t('admin.tasks'),
    products: t('admin.products'),
    categories: t('admin.categories'),
    orders: t('admin.orders'),
    banners: t('admin.banners'),
  };

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults({ users: [], orders: [], blogs: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await apiClient.get('/search', { params: { q: term } });
        setResults(response.data);
      } catch {
        setResults({ users: [], orders: [], blogs: [] });
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const breadcrumbs = React.useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    // Remove the language part if present
    const cleanParts = parts[0] === lang ? parts.slice(1) : parts;
    
    if (cleanParts[0] !== 'admin') return [];

    return cleanParts.map((part, index) => {
      const path = `/${lang}/${cleanParts.slice(0, index + 1).join('/')}`;
      return {
        label: SECTION_LABELS[part] || part.replace(/-/g, ' '),
        path,
      };
    });
  }, [location.pathname, t, i18n.language, lang]);

  const groupedResults = Object.entries(results).filter(([, items]) => items?.length);
  const fullName = user?.fullName || user?.name || 'Admin User';
  const roleLabel = user?.role === 'admin' ? 'Administrator' : user?.role || 'Team Member';

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
    } catch {
      dispatch(logout());
    } finally {
      navigate(`/${lang}/admin/login`, { replace: true });
    }
  };

  const profileItems = [
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: t('header.logout'),
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-surface_container sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-10 min-h-20 flex items-center justify-between gap-8">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on_surface_variant/40" size={18} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsSearchOpen(true);
              }}
              placeholder={t('header.search_placeholder')}
              className="w-full bg-surface_dim/50 py-2.5 pl-12 pr-20 rounded-2xl outline-none border border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-sm"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-white px-2 py-1 text-[10px] font-black text-on_surface_variant shadow-sm">
              Ctrl K
            </span>

            {isSearchOpen && (query.trim().length >= 2 || groupedResults.length > 0) && (
              <>
                <button className="fixed inset-0 z-40 cursor-default" type="button" onClick={() => setIsSearchOpen(false)} />
                <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-[24px] border border-surface_container bg-white shadow-2xl">
                  {isSearching ? (
                    <div className="flex items-center justify-center gap-3 p-6 text-sm font-bold text-on_surface_variant">
                      <Spin size="small" /> {t('common.loading')}
                    </div>
                  ) : groupedResults.length === 0 ? (
                    <div className="p-6 text-sm font-bold text-on_surface_variant">{t('catalog.empty')}</div>
                  ) : (
                    <div className="max-h-[420px] overflow-y-auto py-3">
                      {groupedResults.map(([group, items]) => {
                        const Icon = resultConfig[group]?.icon || Search;
                        return (
                          <div key={group} className="py-2">
                            <div className="px-5 pb-2 text-[10px] font-black uppercase tracking-widest text-on_surface_variant/50">
                              {resultConfig[group]?.title || group}
                            </div>
                            {items.map((item) => (
                              <button
                                key={`${group}-${item.id}`}
                                type="button"
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  setQuery('');
                                  navigate(item.path);
                                }}
                                className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-surface_dim"
                              >
                                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                                  <Icon size={18} />
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-black text-on_surface">{item.title}</span>
                                  <span className="block truncate text-xs font-bold text-on_surface_variant">{item.subtitle}</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on_surface_variant/50">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && <span>/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-primary">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className="hover:text-primary transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-5">
          <LanguageSwitcher />
          
          <NotificationBell />

          <div className="w-px h-8 bg-surface_container" />

          <Dropdown menu={{ items: profileItems }} trigger={['click']} placement="bottomRight">
            <button type="button" className="flex items-center gap-3 pl-2 text-left">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-black text-on_surface uppercase leading-none">{fullName}</p>
                <p className="text-[10px] font-bold text-on_surface_variant uppercase tracking-widest mt-1 flex items-center justify-end gap-1">
                  <ShieldCheck size={11} />
                  {roleLabel}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/20 p-0.5 bg-white">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`} className="w-full h-full object-cover rounded-[14px]" alt="Avatar" />
              </div>
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default TopUtilityBar;
