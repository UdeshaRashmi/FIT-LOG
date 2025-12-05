// src/pages/Activities.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiActivity, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFilter,
  FiCalendar,
  FiTrendingUp,
  FiClock,
  FiTarget
} from 'react-icons/fi';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({
    totalDuration: 0,
    totalCalories: 0,
    avgIntensity: 0,
    activitiesThisWeek: 0
  });

  const [filters, setFilters] = useState({
    type: 'all',
    date: '',
    intensity: 'all'
  });

  const [formData, setFormData] = useState({
    name: '',
    type: 'running',
    duration: '',
    calories: '',
    distance: '',
    intensity: 'moderate',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const activityTypes = [
    { value: 'running', label: 'Running', icon: '🏃', color: 'blue' },
    { value: 'cycling', label: 'Cycling', icon: '🚴', color: 'green' },
    { value: 'swimming', label: 'Swimming', icon: '🏊', color: 'cyan' },
    { value: 'weightlifting', label: 'Weightlifting', icon: '🏋️', color: 'orange' },
    { value: 'yoga', label: 'Yoga', icon: '🧘', color: 'purple' },
    { value: 'walking', label: 'Walking', icon: '🚶', color: 'gray' },
    { value: 'hiking', label: 'Hiking', icon: '🥾', color: 'brown' },
    { value: 'other', label: 'Other', icon: '🏃', color: 'gray' }
  ];

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, filters]);

  const fetchActivities = async () => {
    try {
      const [activitiesRes, statsRes] = await Promise.all([
        axios.get('/api/activities'),
        axios.get('/api/activities/stats')
      ]);
      setActivities(activitiesRes.data);
      setStats(statsRes.data);
      setFilteredActivities(activitiesRes.data);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = [...activities];
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }
    
    if (filters.date) {
      filtered = filtered.filter(activity => activity.date === filters.date);
    }
    
    if (filters.intensity !== 'all') {
      filtered = filtered.filter(activity => activity.intensity === filters.intensity);
    }
    
    setFilteredActivities(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await axios.put(`/api/activities/${editingId}`, formData);
        toast.success('Activity updated successfully');
      } else {
        await axios.post('/api/activities', formData);
        toast.success('Activity added successfully');
      }
      
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchActivities();
    } catch (error) {
      toast.error('Failed to save activity');
    }
  };

  const handleEdit = (activity) => {
    setFormData({
      name: activity.name,
      type: activity.type,
      duration: activity.duration,
      calories: activity.calories,
      distance: activity.distance || '',
      intensity: activity.intensity,
      date: activity.date,
      notes: activity.notes || ''
    });
    setEditingId(activity._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      await axios.delete(`/api/activities/${id}`);
      toast.success('Activity deleted successfully');
      fetchActivities();
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'running',
      duration: '',
      calories: '',
      distance: '',
      intensity: 'moderate',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const getActivityIcon = (type) => {
    const activity = activityTypes.find(a => a.value === type);
    return activity ? activity.icon : '🏃';
  };

  const getActivityColor = (type) => {
    const activity = activityTypes.find(a => a.value === type);
    return activity ? activity.color : 'gray';
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
            <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
            <p className="text-gray-600">Track and manage your fitness activities</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <FiPlus />
            <span>Add Activity</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiClock className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalDuration}h</div>
                <div className="text-sm text-gray-600">Total Duration</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiActivity className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalCalories}</div>
                <div className="text-sm text-gray-600">Total Calories</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiTrendingUp className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.avgIntensity}</div>
                <div className="text-sm text-gray-600">Avg Intensity</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiTarget className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.activitiesThisWeek}</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {editingId ? 'Edit Activity' : 'Add New Activity'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Morning Run"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {activityTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calories Burned
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.distance}
                    onChange={(e) => setFormData({...formData, distance: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intensity *
                  </label>
                  <select
                    required
                    value={formData.intensity}
                    onChange={(e) => setFormData({...formData, intensity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
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
                  placeholder="Add any notes about your activity..."
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {editingId ? 'Update Activity' : 'Add Activity'}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Types</option>
                {activityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({...filters, date: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intensity</label>
              <select
                value={filters.intensity}
                onChange={(e) => setFilters({...filters, intensity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Intensities</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Activity History</h3>
          </div>
          
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-4">🏃</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No activities found</h3>
              <p className="text-gray-500">Add your first activity to start tracking!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredActivities.map((activity) => {
                const color = getActivityColor(activity.type);
                const colorClasses = {
                  blue: 'bg-blue-100 text-blue-800',
                  green: 'bg-green-100 text-green-800',
                  cyan: 'bg-cyan-100 text-cyan-800',
                  orange: 'bg-orange-100 text-orange-800',
                  purple: 'bg-purple-100 text-purple-800',
                  gray: 'bg-gray-100 text-gray-800',
                  brown: 'bg-amber-100 text-amber-800'
                };

                const intensityColors = {
                  low: 'bg-green-100 text-green-800',
                  moderate: 'bg-yellow-100 text-yellow-800',
                  high: 'bg-red-100 text-red-800'
                };

                return (
                  <div key={activity._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-start space-x-4 mb-4 md:mb-0">
                        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                          <span className="text-xl">{getActivityIcon(activity.type)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
                              {activityTypes.find(t => t.value === activity.type)?.label || activity.type}
                            </span>
                            <span className="text-sm text-gray-600">
                              <FiClock className="inline mr-1" />
                              {activity.duration} min
                            </span>
                            {activity.calories && (
                              <span className="text-sm text-gray-600">
                                • {activity.calories} calories
                              </span>
                            )}
                            {activity.distance && (
                              <span className="text-sm text-gray-600">
                                • {activity.distance} km
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${intensityColors[activity.intensity]}`}>
                              {activity.intensity}
                            </span>
                          </div>
                          {activity.notes && (
                            <p className="text-gray-600 text-sm mt-2">{activity.notes}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(activity.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(activity)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(activity._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Activity Type Distribution */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Distribution</h3>
          <div className="space-y-4">
            {activityTypes.map((type) => {
              const count = activities.filter(a => a.type === type.value).length;
              const percentage = activities.length > 0 ? (count / activities.length) * 100 : 0;
              
              return (
                <div key={type.value}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{type.icon}</span>
                      <span className="text-gray-700">{type.label}</span>
                    </div>
                    <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        type.color === 'blue' ? 'bg-blue-500' :
                        type.color === 'green' ? 'bg-green-500' :
                        type.color === 'cyan' ? 'bg-cyan-500' :
                        type.color === 'orange' ? 'bg-orange-500' :
                        type.color === 'purple' ? 'bg-purple-500' :
                        type.color === 'brown' ? 'bg-amber-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;