export const getLocalStorageItem = (key: string) => {
  const item = localStorage.getItem(
    import.meta.env.VITE_LOCAL_STORAGE_PREFIX + key
  );
  try {
    return item ? JSON.parse(item) : null;
  } catch {
    return item;
  }
};

export const setLocalStorageItem = (key: string, value: any) => {
  const serializedValue =
    typeof value === "string" ? value : JSON.stringify(value);
  localStorage.setItem(
    import.meta.env.VITE_LOCAL_STORAGE_PREFIX + key,
    serializedValue
  );
};

export const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(import.meta.env.VITE_LOCAL_STORAGE_PREFIX + key);
};
