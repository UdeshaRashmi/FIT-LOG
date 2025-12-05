// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FiActivity, 
  FiCoffee, 
  FiMoon, 
  FiTrendingUp, 
  FiTarget,
  FiCalendar,
  FiBarChart2,
  FiDroplet,
  FiHeart,
  FiClock
} from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalActivities: 0,
    caloriesBurned: 0,
    avgSleep: 0,
    waterIntake: 0,
    currentStreak: 0,
    goalsAchieved: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/activities/recent')
      ]);
      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories Burned',
        data: [320, 450, 380, 520, 480, 600, 420],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Steps',
        data: [8000, 9500, 7200, 11000, 8900, 12500, 6800],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const barChartData = {
    labels: ['Activity', 'Nutrition', 'Sleep', 'Hydration'],
    datasets: [
      {
        label: 'Weekly Average',
        data: [85, 70, 90, 65],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(168, 85, 247, 0.7)',
          'rgba(6, 182, 212, 0.7)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(6, 182, 212)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Progress'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your health and fitness progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FiActivity className="text-blue-500" size={24} />}
            title="Total Activities"
            value={stats.totalActivities}
            change="+12%"
            color="blue"
          />
          <StatCard
            icon={<FiTrendingUp className="text-green-500" size={24} />}
            title="Calories Burned"
            value={stats.caloriesBurned.toLocaleString()}
            change="+8%"
            color="green"
          />
          <StatCard
            icon={<FiMoon className="text-purple-500" size={24} />}
            title="Avg Sleep"
            value={`${stats.avgSleep}h`}
            change="+1.2h"
            color="purple"
          />
          <StatCard
            icon={<FiDroplet className="text-cyan-500" size={24} />}
            title="Water Intake"
            value={`${stats.waterIntake}L`}
            change="+15%"
            color="cyan"
          />
          <StatCard
            icon={<FiTarget className="text-orange-500" size={24} />}
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            change="🔥"
            color="orange"
          />
          <StatCard
            icon={<FiHeart className="text-red-500" size={24} />}
            title="Goals Achieved"
            value={stats.goalsAchieved}
            change="+3"
            color="red"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Weekly Progress</h2>
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-80">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Category Performance</h2>
              <FiBarChart2 className="text-gray-400" />
            </div>
            <div className="h-80">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                <Link to="/activities" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        activity.type === 'running' ? 'bg-blue-100' :
                        activity.type === 'cycling' ? 'bg-green-100' :
                        activity.type === 'swimming' ? 'bg-cyan-100' : 'bg-gray-100'
                      }`}>
                        <FiActivity className={
                          activity.type === 'running' ? 'text-blue-600' :
                          activity.type === 'cycling' ? 'text-green-600' :
                          activity.type === 'swimming' ? 'text-cyan-600' : 'text-gray-600'
                        } />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.name}</h4>
                        <p className="text-sm text-gray-500">
                          {activity.duration} min • {activity.calories} calories
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Goals */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/activities/new"
                  className="flex flex-col items-center justify-center p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <FiActivity className="text-blue-600 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-900">Log Activity</span>
                </Link>
                <Link
                  to="/nutrition/new"
                  className="flex flex-col items-center justify-center p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 transition-colors"
                >
                  <FiCoffee className="text-green-600 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-900">Add Meal</span>
                </Link>
                <Link
                  to="/sleep/new"
                  className="flex flex-col items-center justify-center p-4 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <FiMoon className="text-purple-600 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-900">Log Sleep</span>
                </Link>
                <Link
                  to="/profile/goals"
                  className="flex flex-col items-center justify-center p-4 border-2 border-orange-200 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <FiTarget className="text-orange-600 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-900">Set Goals</span>
                </Link>
              </div>
            </div>

            {/* Daily Goals */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Daily Goals</h2>
              <div className="space-y-4">
                <GoalProgress label="10,000 Steps" progress={75} />
                <GoalProgress label="8 Hours Sleep" progress={90} />
                <GoalProgress label="2L Water" progress={60} />
                <GoalProgress label="30 Min Exercise" progress={100} />
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-bold">81%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full mt-2">
                  <div className="h-full bg-white rounded-full w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100',
    cyan: 'bg-cyan-50 border-cyan-100',
    orange: 'bg-orange-50 border-orange-100',
    red: 'bg-red-50 border-red-100'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-2xl p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white rounded-xl shadow-sm">
          {icon}
        </div>
        <span className={`text-sm font-semibold ${
          change.includes('+') || change === '🔥' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
};

const GoalProgress = ({ label, progress }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span className="font-semibold">{progress}%</span>
    </div>
    <div className="h-2 bg-white/30 rounded-full overflow-hidden">
      <div 
        className="h-full bg-white rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default Dashboard;