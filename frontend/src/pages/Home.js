// pages/Home.jsx - Home Page (Protected)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiActivity, 
  FiBarChart2, 
  FiCalendar, 
  FiTarget,
  FiTrendingUp,
  FiClock,
  FiBell
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [recentLogs, setRecentLogs] = useState([]);
  const [stats, setStats] = useState({
    totalLogs: 0,
    streak: 0,
    avgCalories: 0,
    avgSteps: 0
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    fetchHomeData();
    setGreeting(getGreeting());
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fetchHomeData = async () => {
    try {
      const [logsResponse, statsResponse] = await Promise.all([
        axios.get('/logs/recent'),
        axios.get('/stats/summary')
      ]);
      
      setRecentLogs(logsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      toast.error('Failed to load home data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Log Activity',
      description: 'Record your workout',
      icon: <FiActivity className="text-blue-500" />,
      link: '/activities',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: 'Add Nutrition',
      description: 'Track your meals',
      icon: <FiBarChart2 className="text-green-500" />,
      link: '/nutrition',
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Log Sleep',
      description: 'Record sleep hours',
      icon: <FiClock className="text-purple-500" />,
      link: '/sleep',
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: 'Set Goals',
      description: 'Define your targets',
      icon: <FiTarget className="text-orange-500" />,
      link: '/profile?tab=goals',
      color: 'bg-orange-50 hover:bg-orange-100'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Greeting */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{greeting}, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">Track your health journey with FitLog</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FiBell className="text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Logs"
          value={stats.totalLogs}
          icon={<FiActivity />}
          change="+12%"
          color="blue"
        />
        <StatCard
          title="Current Streak"
          value={`${stats.streak} days`}
          icon={<FiTrendingUp />}
          change="🔥"
          color="green"
        />
        <StatCard
          title="Avg Calories"
          value={stats.avgCalories}
          icon={<FiBarChart2 />}
          change="-5%"
          color="red"
        />
        <StatCard
          title="Avg Steps"
          value={stats.avgSteps.toLocaleString()}
          icon={<FiCalendar />}
          change="+8%"
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`${action.color} border rounded-xl p-6 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-white shadow-sm">
                  {action.icon}
                </div>
                <span className="text-sm text-gray-500">+ Add</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Logs & Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Logs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity Logs</h2>
              <Link 
                to="/activities"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            {recentLogs.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-5xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No activity logs yet</h3>
                <p className="text-gray-500 mb-4">Start tracking your health journey</p>
                <Link
                  to="/activities"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:opacity-90"
                >
                  <FiActivity />
                  <span>Add Your First Log</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div 
                    key={log._id} 
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        log.type === 'activity' ? 'bg-blue-50' :
                        log.type === 'nutrition' ? 'bg-green-50' :
                        log.type === 'sleep' ? 'bg-purple-50' : 'bg-gray-50'
                      }`}>
                        {log.type === 'activity' && <FiActivity className="text-blue-500" />}
                        {log.type === 'nutrition' && <FiBarChart2 className="text-green-500" />}
                        {log.type === 'sleep' && <FiClock className="text-purple-500" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{log.title}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-sm text-gray-500">
                            {new Date(log.date).toLocaleDateString()}
                          </span>
                          {log.duration && (
                            <span className="text-sm text-gray-500">
                              • {log.duration} min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {log.calories && (
                        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                          {log.calories} cal
                        </span>
                      )}
                      <Link
                        to={`/log/${log._id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Goals */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Weekly Goals</h2>
            <div className="space-y-4">
              <GoalProgress
                title="Activity Minutes"
                current={120}
                target={300}
                unit="min"
                color="blue"
              />
              <GoalProgress
                title="Water Intake"
                current={2.5}
                target={3}
                unit="L"
                color="blue"
              />
              <GoalProgress
                title="Sleep Hours"
                current={42}
                target={56}
                unit="hours"
                color="purple"
              />
              <GoalProgress
                title="Step Count"
                current={45000}
                target={70000}
                unit="steps"
                color="green"
              />
            </div>
            <button className="w-full mt-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Edit Goals
            </button>
          </div>

          {/* Health Tips */}
          <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl p-6">
            <h3 className="font-semibold mb-3">💡 Health Tip of the Day</h3>
            <p className="text-sm opacity-90">
              Drinking a glass of water before meals can help control appetite and aid digestion.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AchievementCard
            title="7-Day Streak"
            description="Logged activities for 7 consecutive days"
            icon="🔥"
            unlocked={true}
          />
          <AchievementCard
            title="Hydration Master"
            description="Drank 3L water for 5 days straight"
            icon="💧"
            unlocked={true}
          />
          <AchievementCard
            title="Sleep Champion"
            description="Averaged 8+ hours of sleep this week"
            icon="😴"
            unlocked={false}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, change, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    red: 'bg-red-50 border-red-100',
    purple: 'bg-purple-50 border-purple-100'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-6 hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-lg bg-white shadow-sm">
          {icon}
        </div>
        <span className={`text-sm font-medium ${
          change.includes('+') || change === '🔥' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
};

const GoalProgress = ({ title, current, target, unit, color }) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  const colorBars = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500'
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <span className="text-sm text-gray-500">
          {current}/{target} {unit}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorBars[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const AchievementCard = ({ title, description, icon, unlocked }) => (
  <div className={`border rounded-xl p-4 ${unlocked ? 'bg-white' : 'bg-gray-50 opacity-75'}`}>
    <div className="flex items-start space-x-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <h4 className={`font-medium ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
          {title}
        </h4>
        <p className={`text-sm mt-1 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {description}
        </p>
        {!unlocked && (
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
            Locked
          </span>
        )}
      </div>
    </div>
  </div>
);

export default Home;