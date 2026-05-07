import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const changeLanguage = (newLang) => {
    if (newLang === i18n.language) return;
    
    // Replace the language segment in the current path
    const pathParts = location.pathname.split('/');
    // pathParts[0] is always empty string for absolute paths like "/en/profile"
    if (pathParts[1] === lang) {
      pathParts[1] = newLang;
    } else {
      // Fallback if URL is not prefixed as expected
      pathParts.splice(1, 0, newLang);
    }
    
    const newPath = pathParts.join('/') + location.search;
    i18n.changeLanguage(newLang);
    navigate(newPath, { replace: true });
  };

  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 border border-surface_container shadow-sm transition-all hover:bg-white hover:shadow-md">
      <Globe size={14} className="text-primary" />
      <div className="flex gap-1">
        <button 
          onClick={() => changeLanguage('vi')}
          className={`text-[10px] font-black px-2.5 py-1 rounded-md transition-all ${i18n.language === 'vi' ? 'bg-primary text-white shadow-sm' : 'text-on_surface_variant hover:bg-primary/10'}`}
        >
          VI
        </button>
        <button 
          onClick={() => changeLanguage('en')}
          className={`text-[10px] font-black px-2.5 py-1 rounded-md transition-all ${i18n.language === 'en' ? 'bg-primary text-white shadow-sm' : 'text-on_surface_variant hover:bg-primary/10'}`}
        >
          EN
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
