import { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser, clearTokens, apiLogout as apiLogoutService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await apiLogoutService();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  // Derive display name from user object
  const getDisplayName = () => {
    if (!user) return '';
    if (user.user_type === 'thai') {
      return `${user.first_name_th || ''} ${user.last_name_th || ''}`.trim();
    }
    return `${user.first_name_en || ''} ${user.last_name_en || ''}`.trim();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, getDisplayName }}>
      {children}
    </AuthContext.Provider>
  );
};
