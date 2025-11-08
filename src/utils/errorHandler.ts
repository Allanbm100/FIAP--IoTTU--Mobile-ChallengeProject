import i18n from '../i18n';

export function extractErrorMessage(error: any): string {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 400) {
      if (data && data.message && typeof data.message === 'string') {
        return data.message;
      }
      return i18n.t('validation.invalidData');
    }
    
    if (status === 401 || status === 403) {
      return i18n.t('validation.noPermission');
    }
    
    if (status === 404) {
      return i18n.t('validation.notFound');
    }
    
    if (status === 409) {
      if (data && data.message && typeof data.message === 'string') {
        return data.message;
      }
      return i18n.t('validation.duplicate');
    }
    
    if (status >= 500) {
      return i18n.t('validation.serverError');
    }
    
    if (data) {
      const serverMessage = data.detail || data.message || data.error;
      if (serverMessage && typeof serverMessage === 'string') {
        return serverMessage;
      }
    }
  }
  
  if (error.message === 'Network Error' || !error.response) {
    return i18n.t('validation.networkError');
  }
  
  return error.message || i18n.t('validation.unknownError');
}
