import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // login(email, password) returns a promise resolving to { success, user }
  const login = async (email, password) => {
    // simulate network latency
    await new Promise((r) => setTimeout(r, 400));

    // demo account
    if (email === 'demo@fitlog.com' && password === 'demo123') {
      const demoUser = { name: 'Demo User', email: 'demo@fitlog.com' };
      setUser(demoUser);
      return { success: true, user: demoUser };
    }

    // simple mock authentication: accept any non-empty credentials
    if (email && password) {
      const userObj = { name: email.split('@')[0], email };
      setUser(userObj);
      return { success: true, user: userObj };
    }

    return { success: false };
  };

  const logout = () => setUser(null);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
