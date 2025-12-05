 // src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, 
  FiTarget, 
  FiAward, 
  FiActivity, 
  FiTrendingUp,
  FiCalendar,
  FiEdit2,
  FiShare2,
  FiDownload,
  FiStar
} from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalActivities: 156,
    totalCalories: 125400,
    currentStreak: 21,
    goalsCompleted: 8,
    avgSleep: 7.5,
    avgSteps: 8500
  });

  const [achievements, setAchievements] = useState([
    { id: 1, name: 'First Workout', description: 'Completed your first activity', icon: '🎯', unlocked: true, date: '2024-01-15' },
    { id: 2, name: 'Week Warrior', description: '7 consecutive days of activity', icon: '🔥', unlocked: true, date: '2024-01-22' },
    { id: 3, name: 'Month Master', description: '30 days of consistent tracking', icon: '🏆', unlocked: true, date: '2024-02-14' },
    { id: 4, name: 'Hydration Hero', description: 'Drank 2L daily for a week', icon: '💧', unlocked: true, date: '2024-02-20' },
    { id: 5, name: 'Sleep Champion', description: 'Averaged 8+ hours sleep for month', icon: '😴', unlocked: false },
    { id: 6, name: 'Marathon Runner', description: 'Run 100km total distance', icon: '🏃', unlocked: false }
  ]);

  const [goals, setGoals] = useState([
    { id: 1, title: 'Run 5km in under 30min', progress: 75, target: 100, type: 'performance', deadline: '2024-03-15' },
    { id: 2, title: 'Lose 5kg weight', progress: 40, target: 100, type: 'weight', deadline: '2024-04-01' },
    { id: 3, title: 'Meditate 30 days straight', progress: 65, target: 100, type: 'consistency', deadline: '2024-03-31' },
    { id: 4, title: 'Complete 100 workouts', progress: 85, target: 100, type: 'milestone', deadline: '2024-05-01' }
  ]);

  const progressChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Activity Minutes',
        data: [1200, 1350, 1420, 1580, 1650, 1800],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
      },
      {
        label: 'Calories Burned',
        data: [45000, 48000, 52000, 55000, 58000, 62000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiUser /> },
    { id: 'goals', label: 'Goals', icon: <FiTarget /> },
    { id: 'achievements', label: 'Achievements', icon: <FiAward /> },
    { id: 'stats', label: 'Statistics', icon: <FiTrendingUp /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl text-white p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden">
                  <div className="w-full h-full bg-blue-400 flex items-center justify-center text-4xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  <FiEdit2 />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                <p className="opacity-90">{user?.email}</p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <FiCalendar />
                    <span>Joined January 2024</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiActivity />
                    <span>{stats.totalActivities} Activities</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl transition-colors">
                <FiShare2 />
                <span>Share Profile</span>
              </button>
              <button className="flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-xl transition-colors">
                <FiDownload />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Activities"
            value={stats.totalActivities}
            icon={<FiActivity />}
            color="blue"
          />
          <StatCard
            title="Calories"
            value={(stats.totalCalories / 1000).toFixed(1) + 'k'}
            icon={<FiTrendingUp />}
            color="green"
          />
          <StatCard
            title="Streak"
            value={stats.currentStreak + ' days'}
            icon={<FiAward />}
            color="orange"
          />
          <StatCard
            title="Goals"
            value={stats.goalsCompleted}
            icon={<FiTarget />}
            color="purple"
          />
          <StatCard
            title="Avg Sleep"
            value={stats.avgSleep + 'h'}
            icon={<FiUser />}
            color="indigo"
          />
          <StatCard
            title="Avg Steps"
            value={stats.avgSteps.toLocaleString()}
            icon={<FiActivity />}
            color="red"
          />
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Progress Overview</h2>
              <div className="h-80 mb-8">
                <Line
                  data={progressChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Monthly Progress'
                      }
                    }
                  }}
                />
              </div>
              
              {/* Recent Activities */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Personal Best</h4>
                      <FiStar className="text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">8.2 km</p>
                    <p className="text-gray-600">Longest run this month</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Consistency</h4>
                      <FiAward className="text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">21 days</p>
                    <p className="text-gray-600">Current activity streak</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:opacity-90">
                  + New Goal
                </button>
              </div>
              
              <div className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">{goal.title}</h3>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            goal.type === 'performance' ? 'bg-blue-100 text-blue-800' :
                            goal.type === 'weight' ? 'bg-green-100 text-green-800' :
                            goal.type === 'consistency' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {goal.type}
                          </span>
                          <span className="text-gray-500 text-sm">
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-gray-900">{goal.progress}%</span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            goal.type === 'performance' ? 'bg-blue-500' :
                            goal.type === 'weight' ? 'bg-green-500' :
                            goal.type === 'consistency' ? 'bg-purple-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Progress: {goal.progress}/{goal.target}</span>
                      <span>{Math.ceil((goal.target - goal.progress) / 10)} days remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                <div className="text-gray-600">
                  {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`border rounded-xl p-6 text-center transition-all ${
                      achievement.unlocked
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50 opacity-75'
                    }`}
                  >
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <h3 className={`font-semibold mb-2 ${
                      achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm mb-4 ${
                      achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked ? (
                      <div className="text-xs text-green-600 font-medium">
                        Unlocked on {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">Locked</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Breakdown</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Running', value: 45, color: 'bg-blue-500' },
                      { label: 'Cycling', value: 25, color: 'bg-green-500' },
                      { label: 'Strength Training', value: 15, color: 'bg-purple-500' },
                      { label: 'Yoga', value: 10, color: 'bg-pink-500' },
                      { label: 'Walking', value: 5, color: 'bg-orange-500' }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700">{item.label}</span>
                          <span className="font-medium">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-6">
                    <MetricItem label="Avg Heart Rate" value="72 bpm" change="+2%" />
                    <MetricItem label="Recovery Time" value="28h" change="-5%" />
                    <MetricItem label="VO2 Max" value="42 ml/kg/min" change="+8%" />
                    <MetricItem label="Sleep Quality" value="82%" change="+12%" />
                  </div>
                </div>
              </div>
              
              {/* Monthly Summary */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">156</div>
                      <div className="text-gray-600">Total Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">1,240</div>
                      <div className="text-gray-600">Total km</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">125.4k</div>
                      <div className="text-gray-600">Total Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">92%</div>
                      <div className="text-gray-600">Goal Completion</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    orange: 'bg-orange-50 border-orange-100',
    purple: 'bg-purple-50 border-purple-100',
    indigo: 'bg-indigo-50 border-indigo-100',
    red: 'bg-red-50 border-red-100'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4 text-center hover:shadow-md transition-shadow`}>
      <div className="flex justify-center mb-3">
        <div className={`p-3 rounded-lg ${
          color === 'blue' ? 'bg-blue-100 text-blue-600' :
          color === 'green' ? 'bg-green-100 text-green-600' :
          color === 'orange' ? 'bg-orange-100 text-orange-600' :
          color === 'purple' ? 'bg-purple-100 text-purple-600' :
          color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
          'bg-red-100 text-red-600'
        }`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
};

const MetricItem = ({ label, value, change }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-700">{label}</span>
    <div className="flex items-center space-x-3">
      <span className="font-medium text-gray-900">{value}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        change.startsWith('+') 
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {change}
      </span>
    </div>
  </div>
);

export default Profile;