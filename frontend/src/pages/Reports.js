// src/pages/Reports.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiCalendar, 
  FiDownload,
  FiFilter,
  FiPieChart,
  FiTarget,
  FiActivity,
  FiCoffee,
  FiMoon
} from 'react-icons/fi';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [reports, setReports] = useState({
    activities: [],
    nutrition: [],
    sleep: [],
    summary: {}
  });

  useEffect(() => {
    fetchReportsData();
  }, [timeRange]);

  const fetchReportsData = async () => {
    try {
      const response = await axios.get(`/api/reports?range=${timeRange}`);
      setReports(response.data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const activityChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Activity Minutes',
        data: [45, 60, 30, 75, 90, 45, 60],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Calories Burned',
        data: [320, 450, 280, 520, 600, 350, 480],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const nutritionChartData = {
    labels: ['Protein', 'Carbs', 'Fat', 'Fiber', 'Sugar'],
    datasets: [
      {
        data: [85, 150, 65, 30, 45],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(244, 63, 94, 0.7)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(244, 63, 94)'
        ],
        borderWidth: 1
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

  const activityTypeData = {
    labels: ['Running', 'Cycling', 'Strength', 'Yoga', 'Walking'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(156, 163, 175, 0.7)'
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Reports</h1>
            <p className="text-gray-600">Comprehensive analysis of your health journey</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiActivity className="text-blue-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">28.5h</div>
            <div className="text-sm text-gray-600">Total Activity</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiTrendingUp className="text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">12,450</div>
            <div className="text-sm text-gray-600">Calories Burned</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiMoon className="text-purple-600" />
              </div>
              <span className="text-sm font-medium text-red-600">-5%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">7.2h</div>
            <div className="text-sm text-gray-600">Avg Sleep</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiTarget className="text-orange-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+15%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">85%</div>
            <div className="text-sm text-gray-600">Goal Completion</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
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

          {/* Nutrition Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiCoffee className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Nutrition Breakdown</h3>
              </div>
              <FiPieChart className="text-gray-400" />
            </div>
            <div className="h-80">
              <Pie data={nutritionChartData} options={chartOptions} />
            </div>
          </div>

          {/* Sleep Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
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

          {/* Activity Types */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FiTarget className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Activity Distribution</h3>
              </div>
              <FiPieChart className="text-gray-400" />
            </div>
            <div className="h-80">
              <Pie data={activityTypeData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Activity Stats */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiActivity className="mr-2 text-blue-500" />
                Activity Performance
              </h4>
              <div className="space-y-4">
                <StatItem label="Total Workouts" value="24" change="+3" />
                <StatItem label="Avg Duration" value="48 min" change="+12%" />
                <StatItem label="Max HR" value="162 bpm" change="+5%" />
                <StatItem label="Recovery Score" value="82%" change="+8%" />
              </div>
            </div>

            {/* Nutrition Stats */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiCoffee className="mr-2 text-green-500" />
                Nutrition Summary
              </h4>
              <div className="space-y-4">
                <StatItem label="Avg Daily Calories" value="2,150" change="-5%" />
                <StatItem label="Protein Intake" value="85g" change="+8%" />
                <StatItem label="Water Consumption" value="2.1L" change="+12%" />
                <StatItem label="Fiber Intake" value="30g" change="+15%" />
              </div>
            </div>

            {/* Sleep & Recovery */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiMoon className="mr-2 text-purple-500" />
                Sleep & Recovery
              </h4>
              <div className="space-y-4">
                <StatItem label="Sleep Efficiency" value="92%" change="+3%" />
                <StatItem label="Deep Sleep" value="2.1h" change="+15%" />
                <StatItem label="Wake-ups" value="1.2" change="-20%" />
                <StatItem label="Sleep Consistency" value="85%" change="+8%" />
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Progress Summary</h4>
            <div className="space-y-6">
              {[
                { label: 'Weight Management', progress: 75, target: 100, color: 'bg-blue-500' },
                { label: 'Cardiovascular Fitness', progress: 85, target: 100, color: 'bg-green-500' },
                { label: 'Strength Improvement', progress: 60, target: 100, color: 'bg-orange-500' },
                { label: 'Sleep Quality', progress: 90, target: 100, color: 'bg-purple-500' }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <h4 className="font-bold mb-3">📈 Key Insights</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Your activity consistency has improved by 15% this month</li>
              <li>• Sleep quality is directly correlating with workout performance</li>
              <li>• Water intake needs improvement - aim for 2.5L daily</li>
              <li>• Evening workouts show 20% better calorie burn rate</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
            <h4 className="font-bold mb-3">🎯 Recommendations</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Increase protein intake by 15g for better muscle recovery</li>
              <li>• Try adding 10 minutes of stretching post-workout</li>
              <li>• Aim for 30 minutes earlier bedtime this week</li>
              <li>• Consider adding HIIT workouts twice weekly</li>
            </ul>
          </div>
        </div>

        {/* Report Period Summary */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Report Period: {timeRanges.find(r => r.value === timeRange)?.label}</h4>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Compare with Previous Period →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-sm text-gray-600">Workouts</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-900">56h</div>
              <div className="text-sm text-gray-600">Total Sleep</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-900">15.2k</div>
              <div className="text-sm text-gray-600">Calories Burned</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-900">92%</div>
              <div className="text-sm text-gray-600">Goal Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, change }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-700">{label}</span>
    <div className="flex items-center space-x-2">
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

export default Reports;