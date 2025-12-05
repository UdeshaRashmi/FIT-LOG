// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiActivity, 
  FiCoffee, 
  FiMoon, 
  FiUser, 
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiCalendar
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Time to log your morning workout!', time: '2 min ago', read: false },
    { id: 2, message: 'You\'re on a 7-day streak! 🔥', time: '1 hour ago', read: false },
    { id: 3, message: 'Weekly report is ready 📊', time: '3 hours ago', read: true },
    { id: 4, message: 'Drink more water today 💧', time: '5 hours ago', read: true }
  ]);

  const navItems = [
    { path: '/', icon: <FiHome />, label: 'Home', exact: true },
    { path: '/dashboard', icon: <FiBarChart2 />, label: 'Dashboard' },
    { path: '/activities', icon: <FiActivity />, label: 'Activities' },
    { path: '/nutrition', icon: <FiCoffee />, label: 'Nutrition' },
    { path: '/sleep', icon: <FiMoon />, label: 'Sleep' },
    { path: '/reports', icon: <FiBarChart2 />, label: 'Reports' },
  ];

  const profileItems = [
    { path: '/profile', icon: <FiUser />, label: 'Profile' },
    { path: '/settings', icon: <FiSettings />, label: 'Settings' },
    { type: 'divider' },
    { action: 'logout', icon: <FiLogOut />, label: 'Logout', color: 'text-red-600' }
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FiActivity className="text-white text-xl" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </motion.div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    FitLog
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Health Tracker</p>
                </div>
              </Link>

              {/* Date Display */}
              <div className="hidden lg:flex items-center space-x-2 ml-6 px-3 py-1 bg-gray-50 rounded-lg">
                <FiCalendar className="text-gray-400" size={14} />
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                    isActive(item.path, item.exact)
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <span className={`transition-transform duration-200 ${
                    isActive(item.path, item.exact) ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  
                  {isActive(item.path, item.exact) && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button (Desktop) */}
              <button className="hidden lg:flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <FiSearch />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <FiBell />
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-600">{unreadCount} unread</p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-100">
                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </motion.div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">
                      {user?.email}
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      {/* Profile Header */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            {user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {profileItems.map((item, index) => {
                          if (item.type === 'divider') {
                            return <div key={`divider-${index}`} className="my-2 border-t border-gray-100"></div>;
                          }

                          if (item.action === 'logout') {
                            return (
                              <button
                                key={item.label}
                                onClick={handleLogout}
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors ${item.color || 'text-gray-700'}`}
                              >
                                {item.icon}
                                <span>{item.label}</span>
                              </button>
                            );
                          }

                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Quick Stats */}
                      <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">7</div>
                            <div className="text-xs text-gray-600">Day Streak</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">85%</div>
                            <div className="text-xs text-gray-600">Goals</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {isMobileMenuOpen ? (
                  <FiX className="text-xl" />
                ) : (
                  <FiMenu className="text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-lg md:hidden z-40"
          >
            <div className="container mx-auto px-4 py-4">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                      isActive(item.path, item.exact)
                        ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 border border-blue-100'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-xl mb-2 ${
                      isActive(item.path, item.exact) ? 'text-blue-500' : ''
                    }`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Profile Links */}
              <div className="space-y-2">
                {profileItems.map((item, index) => {
                  if (item.type === 'divider') {
                    return <div key={`divider-${index}`} className="my-2 border-t border-gray-200"></div>;
                  }

                  if (item.action === 'logout') {
                    return (
                      <button
                        key={item.label}
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Today's Progress</h4>
                  <span className="text-sm text-blue-600 font-medium">65%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 w-2/3"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for dropdowns */}
      {(isProfileDropdownOpen || isNotificationsOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setIsNotificationsOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;