import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="font-bold text-xl">FIT-LOG</div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/activities" className="hover:underline">Activities</Link>
        <Link to="/nutrition" className="hover:underline">Nutrition</Link>
        <Link to="/sleep" className="hover:underline">Sleep</Link>
        <Link to="/reports" className="hover:underline">Reports</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
        <Link to="/settings" className="hover:underline">Settings</Link>
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/register" className="hover:underline">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
