import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Load notification preference from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('notificationsEnabled');
    if (savedPreference !== null) {
      setNotificationsEnabled(JSON.parse(savedPreference));
    }
  }, []);

  // Save notification preference to localStorage when it changes
  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem('notificationsEnabled', JSON.stringify(newState));
  };

  const value = {
    notificationsEnabled,
    toggleNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
