import { toast } from 'react-hot-toast';

/**
 * Cấu hình kiểu dáng mặc định cho thông báo toast.
 */
export const toastStyles = {
  success: {
    icon: '🧁',
    className: 'rounded-[20px] bg-on_surface text-on_primary font-bold text-[14px] px-6 py-4 shadow-xl shadow-on_surface/20',
  },
  error: {
    icon: '❌',
    className: 'rounded-[20px] bg-error text-on_error font-bold text-[14px] px-6 py-4 shadow-xl shadow-error/20',
  }
};

/**
 * Hiển thị thông báo thành công với giao diện tùy chỉnh.
 * @param {string} message - Nội dung thông báo.
 */
export const showSuccessToast = (message) => {
  toast.success(message, toastStyles.success);
};

/**
 * Hiển thị thông báo lỗi với giao diện tùy chỉnh.
 * @param {string} message - Nội dung thông báo.
 */
export const showErrorToast = (message) => {
  toast.error(message, toastStyles.error);
};
