export const getLocalStorageItem = (key: string) => {
  return localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_PREFIX + key);
};

export const setLocalStorageItem = (key: string, value: string) => {
  localStorage.setItem(import.meta.env.VITE_LOCAL_STORAGE_PREFIX + key, value);
};

export const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(import.meta.env.VITE_LOCAL_STORAGE_PREFIX + key);
};
