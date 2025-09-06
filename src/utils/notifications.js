import toast from 'react-hot-toast';

// Success notifications
export const notifySuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options
  });
};

// Error notifications
export const notifyError = (message, options = {}) => {
  return toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options
  });
};

// Info notifications
export const notifyInfo = (message, options = {}) => {
  return toast(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#3B82F6',
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options
  });
};

// Warning notifications
export const notifyWarning = (message, options = {}) => {
  return toast(message, {
    duration: 3500,
    position: 'top-right',
    style: {
      background: '#F59E0B',
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options
  });
};

// Auto-save notification
export const notifyAutoSave = (options = {}) => {
  return toast.success('Progress saved automatically', {
    duration: 2000,
    position: 'bottom-right',
    style: {
      background: '#059669',
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '12px',
      padding: '8px 12px',
    },
    ...options
  });
};

// Loading notification
export const notifyLoading = (message, options = {}) => {
  return toast.loading(message, {
    position: 'top-center',
    style: {
      background: '#374151',
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options
  });
};

// Custom notification with custom styling
export const notifyCustom = (message, type = 'default', options = {}) => {
  const styles = {
    default: { background: '#6B7280', color: '#ffffff' },
    exam: { background: '#7C3AED', color: '#ffffff' },
    bookmark: { background: '#EC4899', color: '#ffffff' }
  };

  return toast(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      ...styles[type],
    },
    ...options
  });
};

// Dismiss all notifications
export const dismissAll = () => {
  toast.dismiss();
};

// Promise-based notification (for async operations)
export const notifyPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred',
    },
    {
      position: 'top-right',
      style: {
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options
    }
  );
};