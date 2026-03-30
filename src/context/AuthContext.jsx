import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * Hook tùy chỉnh để sử dụng AuthContext.
 * @returns {Object} Giá trị của AuthContext bao gồm người dùng hiện tại và các hàm xác thực.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Provider quản lý trạng thái xác thực người dùng (đăng nhập, đăng ký, đăng xuất).
 * 
 * @param {Object} props - Thuộc tính của component.
 * @param {React.ReactNode} props.children - Các component con.
 * @returns {JSX.Element | null} AuthContext Provider hoặc null trong khi đang tải.
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Khởi tạo người dùng giả lập nếu chưa tồn tại
    const mockUsers = localStorage.getItem('candy_users');
    if (!mockUsers) {
      const initialUsers = [
        { id: 1, name: 'Admin', email: 'admin@candy.com', password: 'admin123', role: 'admin' }
      ];
      localStorage.setItem('candy_users', JSON.stringify(initialUsers));
    }

    const savedUser = localStorage.getItem('candy_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Đăng nhập người dùng bằng email và mật khẩu.
   * @param {string} email - Địa chỉ email của người dùng.
   * @param {string} password - Mật khẩu của người dùng.
   * @returns {Object} Kết quả đăng nhập { success: boolean, message?: string }.
   */
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('candy_users') || '[]');
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'Tài khoản không tồn tại' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Mật khẩu không chính xác' };
    }

    // Tạo token giả lập (Mock JWT)
    const token = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })) + '.' + 
                  btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) })) + '.' + 
                  'mock_signature';
    
    const sessionUser = { ...user, token };
    // Không lưu lại mật khẩu trong session
    delete sessionUser.password;
    
    setCurrentUser(sessionUser);
    localStorage.setItem('candy_user', JSON.stringify(sessionUser));
    return { success: true };
  };

  /**
   * Đăng ký một người dùng mới.
   * @param {string} name - Tên người dùng.
   * @param {string} email - Địa chỉ email.
   * @param {string} password - Mật khẩu.
   * @returns {Object} Kết quả đăng ký { success: boolean, message?: string }.
   */
  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('candy_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email đã tồn tại' };
    }

    const newUser = { 
      id: Date.now(), 
      name, 
      email, 
      password, // Trong ứng dụng thực tế, mật khẩu này cần được mã hóa (hashing)
      role: 'user' 
    };
    
    users.push(newUser);
    localStorage.setItem('candy_users', JSON.stringify(users));

    const token = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })) + '.' + 
                  btoa(JSON.stringify({ id: newUser.id, email: newUser.email, role: newUser.role, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) })) + '.' + 
                  'mock_signature';

    const sessionUser = { ...newUser, token };
    delete sessionUser.password;

    setCurrentUser(sessionUser);
    localStorage.setItem('candy_user', JSON.stringify(sessionUser));
    return { success: true };
  };

  /**
   * Đăng nhập thông qua tài khoản mạng xã hội giả lập.
   * @param {string} provider - Tên nhà cung cấp (Google, Facebook, v.v.).
   * @returns {Object} Kết quả đăng nhập.
   */
  const socialLogin = (provider) => {
    const socialUser = {
      id: `social-${Date.now()}`,
      name: `${provider} User`,
      email: `${provider.toLowerCase()}@example.com`,
      role: 'user',
      token: btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })) + '.' + 
             btoa(JSON.stringify({ id: `social-${Date.now()}`, email: `${provider.toLowerCase()}@example.com`, role: 'user', exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) })) + '.' + 
             'mock_social_signature'
    };
    setCurrentUser(socialUser);
    localStorage.setItem('candy_user', JSON.stringify(socialUser));
    return { success: true };
  };

  /** Đăng xuất người dùng */
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('candy_user');
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, socialLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
