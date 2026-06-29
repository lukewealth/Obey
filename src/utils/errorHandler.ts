export const getErrorMessage = (error: any, fallback: string = "An error occurred"): string => {
  if (!error) return fallback;
  
  if (typeof error === 'string') return error;
  
  if (error.response?.data) {
    const data = error.response.data;
    
    if (typeof data === 'string') return data;
    
    if (typeof data.error === 'string') return data.error;
    
    if (data.error && typeof data.error === 'object') {
      if (typeof data.error.message === 'string') return data.error.message;
      if (typeof data.error.msg === 'string') return data.error.msg;
    }
    
    if (typeof data.message === 'string') return data.message;
    if (typeof data.msg === 'string') return data.msg;
  }
  
  if (error.message && typeof error.message === 'string') return error.message;
  
  return fallback;
};
