import { message } from './AntdGlobal';

/**
 * showSuccessToast: Displays a success notification using the global Ant Design message instance.
 * @param {string} content - The message content to display.
 */
export const showSuccessToast = (content) => {
  if (!message) {
    console.warn('[Toast] Message instance not yet initialized. Falling back to console.');
    console.log('Success:', content);
    return;
  }
  
  message.success({
    content,
    icon: '🧁',
    duration: 3,
  });
};

/**
 * showErrorToast: Displays an error notification using the global Ant Design message instance.
 * @param {string} content - The error message content to display.
 */
export const showErrorToast = (content) => {
  if (!message) {
    console.warn('[Toast] Message instance not yet initialized. Falling back to console.');
    console.error('Error:', content);
    return;
  }

  message.error({
    content,
    icon: '❌',
    duration: 5,
  });
};

/**
 * showWarningToast: Displays a warning notification.
 * @param {string} content - The warning message content.
 */
export const showWarningToast = (content) => {
  if (!message) {
    console.warn('Warning:', content);
    return;
  }

  message.warning({
    content,
    icon: '⚠️',
    duration: 4,
  });
};


/**
 * showInfoToast: Displays an info notification.
 * @param {string} content - The info message content.
 */
export const showInfoToast = (content) => {
  if (!message) {
    console.warn('Info:', content);
    return;
  }

  message.info({
    content,
    icon: 'ℹ️',
    duration: 3,
  });
};

// Default styles (maintained for potential future overrides)
export const toastStyles = {};
