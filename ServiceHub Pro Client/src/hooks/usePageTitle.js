import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ServiceHub Pro` : 'ServiceHub Pro - All Kind of Services';
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

export default usePageTitle;
