// src/pages/Sleep.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiMoon, 
  FiClock, 
  FiTrendingUp, 
  FiCalendar,
  FiBarChart2,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFilter,
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

const Sleep = () => {
  const [sleepLogs, setSleepLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({
    avgDuration: 0,
    avgQuality: 0,
    totalHours: 0,
    consistency: 0
  });

  const [filters, setFilters] = useState({
    date: '',
    quality: 'all',
    duration: 'all'
  });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '22:30',
    waketime: '06:30',
    duration: '',
    quality: 7,
    notes: '',
    wokeUpDuringNight: false,
    dreams: false
  });

  useEffect(() => {
    fetchSleepData();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [sleepLogs, filters]);

  const fetchSleepData = async () => {
    try {
      const [logsResponse, statsResponse] = await Promise.all([
        axios.get('/api/sleep/logs'),
        axios.get('/api/sleep/stats')
      ]);
      setSleepLogs(logsResponse.data);
      setStats(statsResponse.data);
      setFilteredLogs(logsResponse.data);
    } catch (error) {
      toast.error('Failed to load sleep data');
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...sleepLogs];
    
    if (filters.date) {
      filtered = filtered.filter(log => log.date === filters.date);
    }
    
    if (filters.quality !== 'all') {
      filtered = filtered.filter(log => {
        if (filters.quality === 'good') return log.quality >= 7;
        if (filters.quality === 'average') return log.quality >= 4 && log.quality < 7;
        return log.quality < 4;
      });
    }
    
    if (filters.duration !== 'all') {
      filtered = filtered.filter(log => {
        if (filters.duration === 'short') return log.duration < 6;
        if (filters.duration === 'optimal') return log.duration >= 6 && log.duration <= 9;
        return log.duration > 9;
      });
    }
    
    setFilteredLogs(filtered);
  };

  const calculateDuration = () => {
    if (formData.bedtime && formData.waketime) {
      const [bedHour, bedMin] = formData.bedtime.split(':').map(Number);
      const [wakeHour, wakeMin] = formData.waketime.split(':').map(Number);
      
      let bedMinutes = bedHour * 60 + bedMin;
      let wakeMinutes = wakeHour * 60 + wakeMin;
      
      if (wakeMinutes < bedMinutes) {
        wakeMinutes += 24 * 60; // Add 24 hours if wake time is next day
      }
      
      const durationMinutes = wakeMinutes - bedMinutes;
      const durationHours = (durationMinutes / 60).toFixed(1);
      
      setFormData(prev => ({ ...prev, duration: durationHours }));
    }
  };

  useEffect(() => {
    calculateDuration();
  }, [formData.bedtime, formData.waketime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await axios.put(`/api/sleep/${editingId}`, formData);
        toast.success('Sleep log updated successfully');
      } else {
        await axios.post('/api/sleep', formData);
        toast.success('Sleep log added successfully');
      }
      
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchSleepData();
    } catch (error) {
      toast.error('Failed to save sleep log');
    }
  };

  const handleEdit = (log) => {
    setFormData({
      date: log.date,
      bedtime: log.bedtime,
      waketime: log.waketime,
      duration: log.duration,
      quality: log.quality,
      notes: log.notes || '',
      wokeUpDuringNight: log.wokeUpDuringNight || false,
      dreams: log.dreams || false
    });
    setEditingId(log._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sleep log?')) return;
    
    try {
      await axios.delete(`/api/sleep/${id}`);
      toast.success('Sleep log deleted successfully');
      fetchSleepData();
    } catch (error) {
      toast.error('Failed to delete sleep log');
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      bedtime: '22:30',
      waketime: '06:30',
      duration: '',
      quality: 7,
      notes: '',
      wokeUpDuringNight: false,
      dreams: false
    });
  };

  const sleepChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sleep Hours',
        data: [7.5, 6.8, 8.2, 7.0, 6.5, 9.0, 8.5],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Quality (1-10)',
        data: [7, 6, 8, 7, 6, 9, 8],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sleep Tracking</h1>
            <p className="text-gray-600">Monitor and improve your sleep quality</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <FiPlus />
            <span>Log Sleep</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiMoon className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.avgDuration}h</div>
                <div className="text-sm text-gray-600">Avg Duration</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiStar className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.avgQuality}/10</div>
                <div className="text-sm text-gray-600">Avg Quality</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiClock className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalHours}h</div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiTrendingUp className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.consistency}%</div>
                <div className="text-sm text-gray-600">Consistency</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Weekly Sleep Pattern</h2>
            <FiBarChart2 className="text-gray-400" />
          </div>
          <div className="h-80">
            <Line
              data={sleepChartData}
              options={{
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
              }}
            />
          </div>
        </div>

        {/* Sleep Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {editingId ? 'Edit Sleep Log' : 'Log Your Sleep'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Quality (1-10) *
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      required
                      value={formData.quality}
                      onChange={(e) => setFormData({...formData, quality: e.target.value})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg font-bold text-gray-900 min-w-8">{formData.quality}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedtime *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.bedtime}
                    onChange={(e) => setFormData({...formData, bedtime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wake Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.waketime}
                    onChange={(e) => setFormData({...formData, waketime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.duration || 'Calculating...'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                  />
                  <p className="text-sm text-gray-500 mt-2">Automatically calculated from bedtime/waketime</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.wokeUpDuringNight}
                      onChange={(e) => setFormData({...formData, wokeUpDuringNight: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Woke up during the night
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.dreams}
                      onChange={(e) => setFormData({...formData, dreams: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Remembered dreams
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How did you sleep? Any observations?"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {editingId ? 'Update Log' : 'Save Log'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <FiFilter className="text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
              <select
                value={filters.quality}
                onChange={(e) => setFilters({...filters, quality: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Quality</option>
                <option value="good">Good (7-10)</option>
                <option value="average">Average (4-6)</option>
                <option value="poor">Poor (1-3)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={filters.duration}
                onChange={(e) => setFilters({...filters, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Durations</option>
                <option value="short">Short (&lt;6h)</option>
                <option value="optimal">Optimal (6-9h)</option>
                <option value="long">Long (&gt;9h)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sleep Logs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Sleep History</h3>
          </div>
          
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-4">😴</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No sleep logs yet</h3>
              <p className="text-gray-500">Start tracking your sleep for better health insights</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <div key={log._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start space-x-4 mb-4 md:mb-0">
                      <div className={`p-3 rounded-lg ${
                        log.quality >= 7 ? 'bg-green-100' :
                        log.quality >= 4 ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <FiMoon className={
                          log.quality >= 7 ? 'text-green-600' :
                          log.quality >= 4 ? 'text-yellow-600' : 'text-red-600'
                        } />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h4>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-600">
                            <FiClock className="inline mr-1" />
                            {log.bedtime} - {log.waketime}
                          </span>
                          <span className="text-sm text-gray-600">
                            Duration: {log.duration}h
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.quality >= 7 ? 'bg-green-100 text-green-800' :
                            log.quality >= 4 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Quality: {log.quality}/10
                          </span>
                        </div>
                        {log.notes && (
                          <p className="text-gray-600 text-sm mt-2">{log.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(log)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(log._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sleep Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <h4 className="font-bold mb-3">💡 Sleep Tip</h4>
            <p className="text-sm opacity-90">
              Keep your bedroom cool (around 18-20°C) for optimal sleep quality.
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
            <h4 className="font-bold mb-3">🌙 Consistency</h4>
            <p className="text-sm opacity-90">
              Going to bed and waking up at the same time every day improves sleep quality.
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
            <h4 className="font-bold mb-3">📱 Digital Detox</h4>
            <p className="text-sm opacity-90">
              Avoid screens 1 hour before bedtime to improve melatonin production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sleep;