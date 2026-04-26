import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * HOC: withAuth
 * Demonstrates: HOC (Higher-Order Component), Hooks (useSelector, useLocation), Router (Navigate)
 * 
 * Bọc các Component cần bảo vệ. Nếu Store Redux không có `token`, đẩy về `/admin/login`.
 * @param {React.ComponentType} WrappedComponent Component cần bọc
 */
const withAuth = (WrappedComponent) => {
  // Trả về một Component function mới
  const WithAuthComponent = (props) => {
    // Consume State từ Redux Store
    const token = useSelector((state) => state.auth.token);
    const location = useLocation();

    // Nếu không có Token (Chưa đăng nhập), Redirect
    if (!token) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Nếu hợp lệ, Render Component gốc, đẩy Props qua (Props Passing)
    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithAuthComponent;
};

export default withAuth;
