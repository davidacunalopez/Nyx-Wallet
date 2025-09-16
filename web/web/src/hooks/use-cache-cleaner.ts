import { useCallback } from 'react';
import { useOffline } from './use-offline';

export function useCacheCleaner() {
  const { clearCache } = useOffline();

  const clearAllCache = useCallback(async () => {
    try {
      // Clear offline cache
      await clearCache();
      
      // Clear localStorage cache
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('cache') || 
          key.includes('price') || 
          key.includes('stellar') ||
          key.includes('balance') ||
          key.includes('transaction')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear sessionStorage cache
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (
          key.includes('cache') || 
          key.includes('price') || 
          key.includes('stellar') ||
          key.includes('balance') ||
          key.includes('transaction')
        )) {
          sessionKeysToRemove.push(key);
        }
      }
      
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      console.log('✅ Cache cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
      return false;
    }
  }, [clearCache]);

  const clearSpecificCache = useCallback(async (pattern: string) => {
    try {
      // Clear localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(pattern)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear sessionStorage
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.includes(pattern)) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      console.log(`✅ Cache cleared for pattern: ${pattern}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to clear cache for pattern ${pattern}:`, error);
      return false;
    }
  }, []);

  return {
    clearAllCache,
    clearSpecificCache,
  };
}
