// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiActivity, 
  FiCoffee, 
  FiMoon, 
  FiTarget,
  FiTrendingUp,
  FiClock,
  FiHeart,
  FiDroplet,
  FiSun,
  FiBell,
  FiZap,
  FiStar,
  FiAward,
  FiUsers,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [waterIntake, setWaterIntake] = useState(1.8);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [dailyStats, setDailyStats] = useState({
    steps: 8450,
    calories: 1850,
    activeMinutes: 45,
    sleepHours: 7.5,
    waterIntake: 1.8,
    meditation: 10,
    heartRate: 72,
    weight: 68.5
  });

  const [weeklyProgress, setWeeklyProgress] = useState([
    { day: 'Mon', steps: 8200, calories: 1750, active: 40 },
    { day: 'Tue', steps: 9100, calories: 1950, active: 50 },
    { day: 'Wed', steps: 7800, calories: 1650, active: 35 },
    { day: 'Thu', steps: 9500, calories: 2050, active: 55 },
    { day: 'Fri', steps: 8800, calories: 1900, active: 45 },
    { day: 'Sat', steps: 11000, calories: 2250, active: 65 },
    { day: 'Sun', steps: 7200, calories: 1600, active: 30 }
  ]);

  const [quickActions, setQuickActions] = useState([
    {
      title: 'Start Workout',
      description: 'Begin your exercise routine',
      icon: <FiActivity className="text-2xl" />,
      link: '/activities/new',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      title: 'Log Meal',
      description: 'Track your nutrition',
      icon: <FiCoffee className="text-2xl" />,
      link: '/nutrition/new',
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      title: 'Record Sleep',
      description: 'Log sleep quality',
      icon: <FiMoon className="text-2xl" />,
      link: '/sleep/new',
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      title: 'Meditate',
      description: '10 min mindfulness',
      icon: <FiHeart className="text-2xl" />,
      link: '/activities?type=meditation',
      color: 'from-indigo-500 to-violet-500',
      gradient: 'bg-gradient-to-br from-indigo-500 to-violet-500'
    }
  ]);

  const [healthTips, setHealthTips] = useState([
    { id: 1, tip: 'Drink water before meals for better digestion', icon: '💧' },
    { id: 2, tip: 'Take a 5-minute walk every hour', icon: '🚶' },
    { id: 3, tip: 'Sleep 7-9 hours for optimal recovery', icon: '😴' },
    { id: 4, tip: 'Include protein in every meal', icon: '🥩' }
  ]);

  const [communityStats, setCommunityStats] = useState({
    activeUsers: 12542,
    workoutsLogged: 85642,
    caloriesBurned: 15420000,
    totalSteps: 215000000
  });

  useEffect(() => {
    fetchHomeData();
    setGreeting(getGreeting());
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fetchHomeData = () => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const addWater = (amount) => {
    setWaterIntake(prev => {
      const newAmount = prev + amount;
      toast.success(`Added ${amount}L water! 🚰`);
      return Math.min(newAmount, 5);
    });
  };

  const logQuickActivity = (type) => {
    toast.success(`Quick ${type} logged! 🎯`);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-gray-600">Loading your health journey...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
    >
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWelcome(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <FiActivity className="text-white text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to FitLog, {user?.name}! 👋
                </h2>
                <p className="text-gray-600 mb-6">
                  Start your journey to better health today. Track activities, monitor nutrition, and achieve your fitness goals.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-green-600">
                    <FiCheckCircle className="mr-2" />
                    <span>Track workouts and activities</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <FiCheckCircle className="mr-2" />
                    <span>Monitor nutrition and water intake</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <FiCheckCircle className="mr-2" />
                    <span>Set and achieve fitness goals</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="w-full mt-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Start Tracking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl shadow-xl">
            <FiActivity className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {greeting}, <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{user?.name}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal health companion. Track, analyze, and improve your fitness journey.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { title: 'Today\'s Steps', value: '8,450', unit: 'steps', icon: <FiTrendingUp />, color: 'blue', progress: 85 },
            { title: 'Calories Burned', value: '1,850', unit: 'cal', icon: <FiZap />, color: 'orange', progress: 75 },
            { title: 'Active Minutes', value: '45', unit: 'min', icon: <FiClock />, color: 'purple', progress: 90 },
            { title: 'Sleep Score', value: '7.5', unit: 'hours', icon: <FiMoon />, color: 'indigo', progress: 94 }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                  <div className={`text-${stat.color}-500 text-xl`}>{stat.icon}</div>
                </div>
                <div className={`text-sm font-bold ${getProgressColor(stat.progress)}`}>
                  {stat.progress}%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-4">{stat.title}</div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-full ${getProgressBarColor(stat.progress)}`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Water Tracker & Quick Actions */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        >
          {/* Water Tracker */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">💧 Water Intake</h3>
                  <p className="opacity-90">Stay hydrated today!</p>
                </div>
                <FiDroplet className="text-2xl opacity-80" />
              </div>
              
              <div className="text-center mb-8">
                <div className="text-5xl font-bold mb-2">{waterIntake}L</div>
                <div className="text-sm opacity-90">of 3L goal</div>
              </div>

              {/* Water Bottle Visualization */}
              <div className="relative h-48 mb-6">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-40 bg-white/20 rounded-b-2xl overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(waterIntake / 3) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="absolute bottom-0 left-0 right-0 bg-white"
                  />
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-white/30 rounded-full"></div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[0.25, 0.5, 0.75, 1].map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addWater(amount)}
                    className="py-3 bg-white/20 rounded-xl hover:bg-white/30 backdrop-blur-sm transition-colors"
                  >
                    +{amount}L
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Quick Start</h2>
                  <p className="text-gray-600">Jump right into your health routine</p>
                </div>
                <FiZap className="text-2xl text-yellow-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Link
                      to={action.link}
                      className={`block ${action.gradient} rounded-xl p-6 text-white hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                          {action.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                        <p className="text-sm opacity-90">{action.description}</p>
                        <motion.div 
                          className="mt-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                          whileHover={{ scale: 1.2 }}
                        >
                          <FiActivity className="text-white" />
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Weekly Progress</h2>
              <p className="text-gray-600">Your activity trend this week</p>
            </div>
            <FiCalendar className="text-2xl text-blue-500" />
          </div>

          <div className="overflow-x-auto">
            <div className="flex space-x-4 min-w-max pb-4">
              {weeklyProgress.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex flex-col items-center"
                >
                  <div className="text-sm text-gray-600 mb-2">{day.day}</div>
                  <div className="relative w-16 h-32 bg-gray-100 rounded-xl overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.steps / 12000) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-500"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-bold">{day.steps.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">steps</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">42.5k</div>
              <div className="text-sm text-gray-600">Weekly Steps</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">+8.5%</div>
              <div className="text-sm text-gray-600">vs Last Week</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">5 days</div>
              <div className="text-sm text-gray-600">Active Streak</div>
            </div>
          </div>
        </motion.div>

        {/* Health Tips & Community */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Health Tips */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">💡 Health Tips</h2>
                <p className="text-gray-600">Daily wellness advice</p>
              </div>
              <FiStar className="text-2xl text-yellow-500" />
            </div>

            <div className="space-y-4">
              {healthTips.map((tip, index) => (
                <motion.div
                  key={tip.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start space-x-3 p-4 bg-white/50 rounded-xl backdrop-blur-sm"
                >
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <p className="text-gray-800">{tip.tip}</p>
                    <button className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium">
                      Learn more →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white/50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-medium">Daily Challenge</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  +50 points
                </span>
              </div>
              <p className="text-gray-600 mt-2">Take 10,000 steps today</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-green-500 w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">👥 Community</h2>
                <p className="text-gray-600">Join the fitness movement</p>
              </div>
              <FiUsers className="text-2xl text-purple-500" />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {communityStats.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="bg-white/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {(communityStats.workoutsLogged / 1000).toFixed(0)}k+
                  </div>
                  <div className="text-sm text-gray-600">Workouts Logged</div>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3">🔥 Trending Challenge</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <FiTarget className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold">January Fitness Challenge</h4>
                    <p className="text-sm text-gray-600">15,432 participants</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all">
                  Join Challenge
                </button>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3">🏆 Leaderboard</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah J.', points: 5420, rank: 1 },
                    { name: 'Mike C.', points: 4980, rank: 2 },
                    { name: 'Alex T.', points: 4560, rank: 3 }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-bold">
                          {user.rank}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <span className="font-bold text-purple-600">{user.points.toLocaleString()} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Health?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of people who have improved their health with FitLog. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;