/**
 * Maps backend validation errors (NestJS ConstraintErrors) to react-hook-form errors.
 * 
 * @param {Object} apiError - The error object returned from the API.
 * @param {Function} setError - The react-hook-form setError function.
 */
export const mapBackendErrors = (apiError, setError) => {
  const messages = apiError?.response?.data?.message;
  
  if (Array.isArray(messages)) {
    messages.forEach((msg) => {
      // NestJS ValidationPipe often returns strings like "fieldName must be ..."
      // We try to extract the field name. 
      // Note: This is simpler if backend returns structured errors, 
      // but for standard NestJS array, we can check common field names.
      const commonFields = ['email', 'password', 'fullName', 'productName', 'price', 'stock', 'categoryName', 'phone', 'address'];
      const field = commonFields.find(f => msg.toLowerCase().includes(f.toLowerCase()));
      
      if (field) {
        setError(field, { type: 'manual', message: msg });
      }
    });
  }
};

/**
 * Trims all string fields in an object recursively.
 * 
 * @param {Object} data - The form data object.
 * @returns {Object} The sanitized data.
 */
export const sanitizeData = (data) => {
  const sanitized = { ...data };
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key].trim();
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null && !Array.isArray(sanitized[key])) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });
  return sanitized;
};
