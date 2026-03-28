import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Initialize mock users if not exists
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

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('candy_users') || '[]');
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'Tài khoản không tồn tại' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Mật khẩu không chính xác' };
    }

    const token = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })) + '.' + 
                  btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) })) + '.' + 
                  'mock_signature';
    
    const sessionUser = { ...user, token };
    // Don't store password in session
    delete sessionUser.password;
    
    setCurrentUser(sessionUser);
    localStorage.setItem('candy_user', JSON.stringify(sessionUser));
    return { success: true };
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('candy_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email đã tồn tại' };
    }

    const newUser = { 
      id: Date.now(), 
      name, 
      email, 
      password, // In a real app, this would be hashed
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
