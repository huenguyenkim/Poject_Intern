import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Camera, Save, Info, Gift, 
  Edit3, X, Loader2, Check, AlertCircle, Image as ImageIcon, ChevronDown
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import { useTranslation } from 'react-i18next';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import PageTransition from '../../components/layout/PageTransition';
import { updateProfileThunk, checkUsernameThunk } from '../../store/authThunks';

// --- HELPER: Image Processing ---
const processImage = (file, targetWidth, targetHeight, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (targetWidth === targetHeight) {
          const size = Math.min(width, height);
          const xOffset = (width - size) / 2;
          const yOffset = (height - size) / 2;
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, targetWidth, targetHeight);
        } else {
          const targetRatio = targetWidth / targetHeight;
          const currentRatio = width / height;
          let drawWidth, drawHeight, xOffset = 0, yOffset = 0;

          if (currentRatio > targetRatio) {
            drawHeight = height;
            drawWidth = height * targetRatio;
            xOffset = (width - drawWidth) / 2;
          } else {
            drawWidth = width;
            drawHeight = width / targetRatio;
            yOffset = (height - drawHeight) / 2;
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight, 0, 0, targetWidth, targetHeight);
        }
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

// --- HELPER: Formatting ---
const formatFullName = (name) => {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const calculateAge = (dobString) => {
  if (!dobString) return 0;
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// --- HELPER: Initials ---
const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const UserProfile = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user: currentUser, status } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    dob: '',
    gender: '',
    address: '',
    avatarUrl: '',
    coverUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [usernameStatus, setUsernameStatus] = useState('idle');
  const [hasChanges, setHasChanges] = useState(false);

  // Sync data with currentUser
  useEffect(() => {
    if (currentUser) {
      const initialData = {
        name: currentUser.fullName || currentUser.name || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
        dob: currentUser.dob || '',
        gender: currentUser.gender || '',
        address: currentUser.address || '',
        avatarUrl: currentUser.avatarUrl || '',
        coverUrl: currentUser.coverUrl || ''
      };
      setProfileData(initialData);
    }
  }, [currentUser]);

  // Change detection
  useEffect(() => {
    if (!currentUser) return;
    const initialData = {
      name: currentUser.fullName || currentUser.name || '',
      username: currentUser.username || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      bio: currentUser.bio || '',
      dob: currentUser.dob || '',
      gender: currentUser.gender || '',
      address: currentUser.address || '',
      avatarUrl: currentUser.avatarUrl || '',
      coverUrl: currentUser.coverUrl || ''
    };
    const isChanged = JSON.stringify(profileData) !== JSON.stringify(initialData);
    setHasChanges(isChanged);
  }, [profileData, currentUser]);

  const validate = () => {
    const newErrors = {};
    
    // Full Name Validation
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỳỵỷỹ\s|_]+$/;
    if (!profileData.name.trim()) {
      newErrors.name = t('profile.error_name_required');
    } else if (profileData.name.length < 2 || profileData.name.length > 50) {
      newErrors.name = t('profile.error_name_length');
    } else if (!nameRegex.test(profileData.name)) {
      newErrors.name = t('profile.error_name_invalid');
    }

    // Username Validation
    if (profileData.username && !/^[a-zA-Z0-9._]+$/.test(profileData.username)) {
      newErrors.username = t('profile.error_username_invalid');
    }

    // Bio Validation
    if (profileData.bio && profileData.bio.length > 160) {
      newErrors.bio = t('profile.error_bio_length');
    }

    // DOB Validation
    if (profileData.dob) {
      const age = calculateAge(profileData.dob);
      if (new Date(profileData.dob) > new Date()) {
        newErrors.dob = t('profile.error_dob_future');
      } else if (age < 13) {
        newErrors.dob = t('profile.error_age_limit');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkUsername = async (val) => {
    if (!val || val === currentUser?.username) {
      setUsernameStatus('idle');
      return;
    }
    if (!/^[a-zA-Z0-9._]+$/.test(val)) return;

    setUsernameStatus('checking');
    try {
      const available = await dispatch(checkUsernameThunk(val)).unwrap();
      setUsernameStatus(available ? 'available' : 'taken');
    } catch {
      setUsernameStatus('idle');
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (usernameStatus === 'taken') {
      showErrorToast(t('profile.error_username_taken'));
      return;
    }

    // Prepare data: Format Full Name
    const finalData = {
      ...profileData,
      name: formatFullName(profileData.name)
    };

    try {
      const resultAction = await dispatch(updateProfileThunk({ 
        id: currentUser.id, 
        profileData: finalData 
      }));
      
      if (updateProfileThunk.fulfilled.match(resultAction)) {
        showSuccessToast(t('profile.save_success'));
        setIsEditing(false);
      } else {
        showErrorToast(resultAction.payload || t('common.error'));
      }
    } catch (err) {
      showErrorToast(t('common.error'));
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm(t('profile.confirm_cancel'));
      if (!confirm) return;
    }
    setIsEditing(false);
    // Reset data
    setProfileData({
      name: currentUser.fullName || currentUser.name || '',
      username: currentUser.username || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      bio: currentUser.bio || '',
      dob: currentUser.dob || '',
      gender: currentUser.gender || '',
      address: currentUser.address || '',
      avatarUrl: currentUser.avatarUrl || '',
      coverUrl: currentUser.coverUrl || ''
    });
    setErrors({});
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showErrorToast(t('profile.error_invalid_type'));
      return;
    }

    const maxSize = type === 'avatar' ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showErrorToast(t('profile.error_too_large', { size: type === 'avatar' ? '2MB' : '5MB' }));
      return;
    }

    try {
      const targetW = type === 'avatar' ? 400 : 1200;
      const targetH = type === 'avatar' ? 400 : 675;
      const processed = await processImage(file, targetW, targetH);
      setProfileData(prev => ({ ...prev, [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: processed }));
    } catch (err) {
      showErrorToast(t('common.error'));
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('profile.greeting_morning');
    if (hour < 18) return t('profile.greeting_afternoon');
    return t('profile.greeting_evening');
  };

  const translateGender = (gender) => {
    if (!gender) return t('profile.not_updated');
    if (gender === 'Nam' || gender === 'Male') return t('profile.gender_male');
    if (gender === 'Nữ' || gender === 'Female') return t('profile.gender_female');
    if (gender === 'Khác' || gender === 'Other') return t('profile.gender_other');
    return gender;
  };

  return (
    <PageTransition>
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-6xl mx-auto pb-20">
        
        {/* --- HEADER & COVER SECTION --- */}
        <div className="relative mb-48 sm:mb-32">
          {/* Cover Photo */}
          <div className="h-40 sm:h-64 md:h-80 w-full rounded-[24px] sm:rounded-[45px] overflow-hidden relative bg-gradient-to-r from-primary/20 to-secondary/20 shadow-inner group">
            {profileData.coverUrl ? (
              <img src={profileData.coverUrl} className="w-full h-full object-cover" alt="Cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-30">
                <ImageIcon size={64} strokeWidth={1} />
              </div>
            )}
            
            {isEditing && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="bg-white/90 p-3 sm:p-4 rounded-2xl cursor-pointer hover:scale-110 transition-transform shadow-xl flex items-center gap-2 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  <Camera size={18} /> {t('profile.change_cover')}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                </label>
              </div>
            )}
          </div>

          {/* Avatar Positioned Overlay */}
          <div className="absolute -bottom-40 sm:-bottom-24 left-0 sm:left-12 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 w-full sm:w-[calc(100%-4rem)] px-4 sm:px-0">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 sm:border-8 border-white bg-white shadow-2xl overflow-hidden relative">
                {profileData.avatarUrl ? (
                  <img src={profileData.avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl sm:text-6xl font-black">
                    {getInitials(profileData.name)}
                  </div>
                )}
                
                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={32} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
                  </label>
                )}
              </div>
            </div>

            <div className="flex-1 pb-0 sm:pb-6 text-center sm:text-left">
              <p className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-widest mb-1">{getGreeting()}</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-on_surface tracking-tight leading-tight mb-1 sm:mb-2 px-2 sm:px-0">
                {profileData.name || 'User'}
              </h1>
              <p className="text-[10px] sm:text-xs md:text-sm font-bold text-on_surface_variant opacity-60 tracking-widest uppercase">
                @{profileData.username || 'username'} <span className="hidden sm:inline mx-2">•</span> <br className="sm:hidden" /> ROLE: {currentUser?.role?.toUpperCase() || 'CUSTOMER'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pb-0 sm:pb-6 w-full sm:w-auto">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto bg-white text-on_surface border-2 border-surface_container px-6 py-3 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-surface_container transition-all active:scale-95 shadow-sm"
                >
                  <Edit3 size={16} strokeWidth={2.5} /> {t('profile.edit_profile')}
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none bg-white text-red-500 border-2 border-red-100 px-6 py-3 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all active:scale-95 shadow-sm"
                  >
                    <X size={16} strokeWidth={2.5} /> {t('profile.cancel')}
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!hasChanges || status === 'loading' || usernameStatus === 'taken' || !!errors.bio}
                    className="flex-1 sm:flex-none bg-primary text-white px-8 py-3 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:grayscale disabled:scale-100"
                  >
                    {status === 'loading' ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} strokeWidth={2.5} />
                    )}
                    {t('profile.save')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 px-4 sm:px-0">
          
          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6 sm:order-2 lg:order-1">
            <div className="bg-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 shadow-sm border border-surface_container/20">
              <h3 className="text-[10px] sm:text-xs font-black text-on_surface_variant uppercase tracking-[0.25em] mb-4 sm:mb-6 flex items-center gap-2">
                <Info size={14} className="text-primary" /> {t('profile.bio')}
              </h3>
              
              {isEditing ? (
                <div className="space-y-2">
                  <textarea 
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className={`w-full bg-[#fbf9fc] border-2 ${errors.bio ? 'border-red-500 ring-2 ring-red-100' : 'border-transparent'} rounded-2xl p-4 text-xs sm:text-sm font-bold text-on_surface outline-none focus:border-primary/20 transition-all h-28 sm:h-32 resize-none`}
                    placeholder={t('profile.bio_placeholder')}
                  />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-black text-red-500">{errors.bio}</span>
                    <span className={`text-[9px] font-black ${profileData.bio.length > 160 ? 'text-red-500' : 'text-on_surface_variant/40'}`}>
                      {profileData.bio.length}/160
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm font-bold text-on_surface opacity-70 leading-relaxed italic">
                  {profileData.bio || t('profile.bio_empty')}
                </p>
              )}
            </div>

            <div className="bg-[#FFF0F8] rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 shadow-sm border border-primary/5">
              <h3 className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-[0.25em] mb-4 sm:mb-6 flex items-center gap-2">
                <Gift size={14} /> {t('profile.your_offers')}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white p-3 sm:p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-on_surface_variant opacity-50 uppercase tracking-widest">{t('profile.loyalty_points')}</p>
                    <p className="text-lg sm:text-xl font-black text-primary">2,450</p>
                  </div>
                  <Badge variant="surface" className="bg-primary/10 text-primary border-none text-[9px] font-black">GOLD MEMBER</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Main Info Form */}
          <div className="lg:col-span-8 sm:order-1 lg:order-2">
            <div className="bg-white rounded-[28px] sm:rounded-[45px] p-6 sm:p-10 md:p-12 shadow-sm border border-surface_container/20 h-full">
              <div className="flex items-center gap-4 mb-8 sm:mb-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                  <User size={20} sm:size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-on_surface tracking-tight uppercase">{t('profile.basic_info')}</h2>
                  <p className="text-[9px] sm:text-[10px] font-black text-on_surface_variant opacity-40 uppercase tracking-widest">{t('profile.update_info_hint')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-10 gap-y-6 sm:gap-y-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.full_name')}</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profileData.name} 
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} 
                      className={`w-full bg-[#fbf9fc] border-2 ${errors.name ? 'border-red-500 ring-2 ring-red-100' : 'border-transparent'} rounded-[16px] sm:rounded-[20px] px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-on_surface outline-none focus:border-primary/20 transition-all`}
                    />
                  ) : (
                    <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#fbf9fc] rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm font-bold text-on_surface truncate">
                      {profileData.name}
                    </div>
                  )}
                  {errors.name && <p className="text-[9px] font-black text-red-500 ml-2">{errors.name}</p>}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.username')}</label>
                  {isEditing ? (
                    <div className="relative">
                      <input 
                        type="text" 
                        value={profileData.username} 
                        onBlur={(e) => checkUsername(e.target.value)}
                        onChange={(e) => {
                          setProfileData({ ...profileData, username: e.target.value });
                          setUsernameStatus('idle');
                        }} 
                        className={`w-full bg-[#fbf9fc] border-2 ${errors.username || usernameStatus === 'taken' ? 'border-red-200' : usernameStatus === 'available' ? 'border-green-200' : 'border-transparent'} rounded-[16px] sm:rounded-[20px] px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-on_surface outline-none focus:border-primary/20 transition-all pr-12`}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {usernameStatus === 'checking' && <Loader2 size={16} className="animate-spin text-primary" />}
                        {usernameStatus === 'available' && <Check size={16} className="text-green-500" />}
                        {usernameStatus === 'taken' && <AlertCircle size={16} className="text-red-500" />}
                      </div>
                    </div>
                  ) : (
                    <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#fbf9fc] rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm font-bold text-on_surface truncate">
                      @{profileData.username}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.gender')}</label>
                  {isEditing ? (
                    <div className="relative">
                      <select 
                        value={profileData.gender}
                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                        className="w-full bg-[#fbf9fc] border-2 border-transparent rounded-[16px] sm:rounded-[20px] px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-on_surface outline-none focus:border-primary/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">{t('profile.gender_select')}</option>
                        <option value="Male">{t('profile.gender_male')}</option>
                        <option value="Female">{t('profile.gender_female')}</option>
                        <option value="Other">{t('profile.gender_other')}</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-on_surface_variant pointer-events-none" />
                    </div>
                  ) : (
                    <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#fbf9fc] rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm font-bold text-on_surface">
                      {translateGender(profileData.gender)}
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.dob')}</label>
                  {isEditing ? (
                    <input 
                      type="date" 
                      value={profileData.dob} 
                      onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })} 
                      className={`w-full bg-[#fbf9fc] border-2 ${errors.dob ? 'border-red-500 ring-2 ring-red-100' : 'border-transparent'} rounded-[16px] sm:rounded-[20px] px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-on_surface outline-none focus:border-primary/20 transition-all`}
                    />
                  ) : (
                    <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#fbf9fc] rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm font-bold text-on_surface flex items-center gap-3">
                      <Calendar size={14} className="opacity-40" /> {profileData.dob ? new Date(profileData.dob).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US') : t('profile.not_updated')}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.email')}</label>
                  <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#fbf9fc] rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm font-bold text-on_surface opacity-60 flex items-center gap-3 truncate">
                    <Mail size={14} className="opacity-40" /> {profileData.email}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.phone')}</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profileData.phone} 
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} 
                      className="w-full bg-[#fbf9fc] border-2 border-transparent rounded-[16px] sm:rounded-[20px] px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-on_surface outline-none focus:border-primary/20 transition-all"
                      placeholder="+84..."
                    />
                  ) : (
                    <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#fbf9fc] rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm font-bold text-on_surface flex items-center gap-3">
                      <Phone size={14} className="opacity-40" /> {profileData.phone || t('profile.not_updated')}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-on_surface_variant uppercase tracking-[0.2em] ml-1">{t('profile.address')}</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profileData.address} 
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} 
                      className="w-full bg-[#fbf9fc] border-2 border-transparent rounded-[16px] sm:rounded-[20px] px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-on_surface outline-none focus:border-primary/20 transition-all"
                    />
                  ) : (
                    <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#fbf9fc] rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm font-bold text-on_surface flex items-center gap-3">
                      <MapPin size={14} className="opacity-40" /> {profileData.address || t('profile.not_updated')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserProfile;
