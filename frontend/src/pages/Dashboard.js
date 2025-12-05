// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

import { 
  FiActivity, 
  FiBarChart2, 
  FiCalendar, 
  FiTarget,
  FiTrendingUp,
  FiClock,
  FiHeart,
  FiDroplet,
  FiSun,
  FiMoon,
  FiThermometer,
  FiWatch,
  FiZap,
  FiAward,
  FiChevronRight,
  FiDownload,
  FiFilter,
  FiEye
} from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
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
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardStats, setDashboardStats] = useState({
    totalActivities: 156,
    totalCalories: 125400,
    avgHeartRate: 72,
    avgSleep: 7.5,
    weightChange: -2.5,
    bmi: 22.5,
    streak: 21,
    goalCompletion: 85
  });

  const [performanceMetrics, setPerformanceMetrics] = useState([
    { label: 'VO2 Max', value: '42', unit: 'ml/kg/min', change: '+8%', status: 'excellent' },
    { label: 'Recovery', value: '92', unit: '%', change: '+5%', status: 'good' },
    { label: 'HRV', value: '65', unit: 'ms', change: '+12%', status: 'improving' },
    { label: 'Sleep Score', value: '88', unit: '/100', change: '+3%', status: 'good' }
  ]);

  const [recentAchievements, setRecentAchievements] = useState([
    { id: 1, title: 'Month Master', description: '30 days of activity', icon: '🏆', date: 'Today', points: 100 },
    { id: 2, title: 'Distance King', description: 'Ran 100km total', icon: '👑', date: '2 days ago', points: 75 },
    { id: 3, title: 'Early Bird', description: '5am wakeups for week', icon: '🐦', date: '3 days ago', points: 50 }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const activityChartData = {
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

  const sleepChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sleep Hours',
        data: [7.5, 6.8, 8.2, 7.0, 6.5, 9.0, 8.5],
        backgroundColor: 'rgba(168, 85, 247, 0.7)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1
      }
    ]
  };

  const nutritionChartData = {
    labels: ['Protein', 'Carbs', 'Fat', 'Fiber'],
    datasets: [
      {
        data: [85, 150, 65, 30],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)'
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
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'This Year' }
  ];

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
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive insights into your health journey</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <FiFilter className="text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:opacity-90">
                <FiDownload />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FiActivity className="text-blue-600 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalActivities}</div>
                <div className="text-sm text-gray-600">Total Activities</div>
              </div>
            </div>
            <div className="text-xs text-green-600 font-medium">+12% from last month</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <FiTrendingUp className="text-green-600 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalCalories.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Calories Burned</div>
              </div>
            </div>
            <div className="text-xs text-green-600 font-medium">+8% from last month</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiMoon className="text-purple-600 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.avgSleep}h</div>
                <div className="text-sm text-gray-600">Avg Sleep</div>
              </div>
            </div>
            <div className="text-xs text-green-600 font-medium">+0.5h from last week</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <FiTarget className="text-red-600 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.goalCompletion}%</div>
                <div className="text-sm text-gray-600">Goal Completion</div>
              </div>
            </div>
            <div className="text-xs text-green-600 font-medium">+15% from last month</div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Activity Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiActivity className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Activity Trends</h3>
              </div>
              <FiBarChart2 className="text-gray-400" />
            </div>
            <div className="h-80">
              <Line data={activityChartData} options={chartOptions} />
            </div>
          </div>

          {/* Sleep Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiMoon className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Sleep Patterns</h3>
              </div>
              <FiCalendar className="text-gray-400" />
            </div>
            <div className="h-80">
              <Bar data={sleepChartData} options={chartOptions} />
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
        >
          {/* Performance Metrics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-gray-50 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-gray-900">{metric.label}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        metric.status === 'excellent' ? 'bg-green-100 text-green-800' :
                        metric.status === 'good' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {metric.status}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {metric.value}
                      <span className="text-sm text-gray-600 ml-1">{metric.unit}</span>
                    </div>
                    <div className={`text-sm ${
                      metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change} from last month
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Nutrition Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Nutrition Breakdown</h3>
              <FiEye className="text-gray-400" />
            </div>
            <div className="h-64">
              <Doughnut data={nutritionChartData} options={chartOptions} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-lg font-bold text-blue-600">85g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-lg font-bold text-green-600">150g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Achievements & Health Summary */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Recent Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Achievements</h3>
              <FiAward className="text-yellow-500" />
            </div>
            
            <div className="space-y-4">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{achievement.date}</div>
                    <div className="font-bold text-yellow-600">{achievement.points} pts</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Total Points</div>
                  <div className="text-2xl font-bold text-gray-900">2,850</div>
                </div>
                <Link to="/profile?tab=achievements" className="text-blue-600 hover:text-blue-700 font-medium">
                  View All →
                </Link>
              </div>
            </div>
          </div>

          {/* Health Summary */}
          <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-6">Health Summary</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Overall Health Score</span>
                  <span className="font-bold">88/100</span>
                </div>
                <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full w-4/5"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{dashboardStats.bmi}</div>
                  <div className="text-sm opacity-90">BMI</div>
                  <div className="text-xs mt-1">Healthy Range</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{dashboardStats.avgHeartRate}</div>
                  <div className="text-sm opacity-90">Resting HR</div>
                  <div className="text-xs mt-1">Optimal</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Current Streak</span>
                  <span className="font-bold">{dashboardStats.streak} days</span>
                </div>
                <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full w-3/4"></div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/20">
                <h4 className="font-bold mb-3">💡 Recommendations</h4>
                <ul className="space-y-2 text-sm opacity-90">
                  <li className="flex items-center">
                    <FiCheckCircle className="mr-2" />
                    <span>Increase protein intake by 15g</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="mr-2" />
                    <span>Add 10 min stretching post-workout</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="mr-2" />
                    <span>Aim for 30 min earlier bedtime</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;