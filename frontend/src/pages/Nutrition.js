// src/pages/Nutrition.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiCoffee, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFilter,
  FiCalendar,
  FiTrendingUp,
  FiDroplet,
  FiPieChart
} from 'react-icons/fi';

const Nutrition = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({
    totalCalories: 0,
    avgCalories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const [filters, setFilters] = useState({
    date: '',
    mealType: 'all',
    caloriesRange: 'all'
  });

  const [formData, setFormData] = useState({
    name: '',
    mealType: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    water: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: ''
  });

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'orange' },
    { value: 'lunch', label: 'Lunch', icon: '🍽️', color: 'green' },
    { value: 'dinner', label: 'Dinner', icon: '🌙', color: 'blue' },
    { value: 'snack', label: 'Snack', icon: '🍎', color: 'purple' },
    { value: 'hydration', label: 'Hydration', icon: '💧', color: 'cyan' }
  ];

  useEffect(() => {
    fetchNutritionData();
  }, []);

  useEffect(() => {
    filterMeals();
  }, [meals, filters]);

  const fetchNutritionData = async () => {
    try {
      const [mealsRes, statsRes] = await Promise.all([
        axios.get('/api/nutrition/meals'),
        axios.get('/api/nutrition/stats')
      ]);
      setMeals(mealsRes.data);
      setStats(statsRes.data);
      setFilteredMeals(mealsRes.data);
    } catch (error) {
      toast.error('Failed to load nutrition data');
    } finally {
      setLoading(false);
    }
  };

  const filterMeals = () => {
    let filtered = [...meals];
    
    if (filters.date) {
      filtered = filtered.filter(meal => meal.date === filters.date);
    }
    
    if (filters.mealType !== 'all') {
      filtered = filtered.filter(meal => meal.mealType === filters.mealType);
    }
    
    if (filters.caloriesRange !== 'all') {
      filtered = filtered.filter(meal => {
        const calories = parseInt(meal.calories);
        if (filters.caloriesRange === 'low') return calories < 300;
        if (filters.caloriesRange === 'medium') return calories >= 300 && calories <= 600;
        return calories > 600;
      });
    }
    
    setFilteredMeals(filtered);
  };

  const calculateMacros = () => {
    const proteinCal = parseInt(formData.protein || 0) * 4;
    const carbCal = parseInt(formData.carbs || 0) * 4;
    const fatCal = parseInt(formData.fat || 0) * 9;
    const totalCal = proteinCal + carbCal + fatCal;
    
    if (!formData.calories && totalCal > 0) {
      setFormData(prev => ({ ...prev, calories: totalCal.toString() }));
    }
  };

  useEffect(() => {
    calculateMacros();
  }, [formData.protein, formData.carbs, formData.fat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await axios.put(`/api/nutrition/${editingId}`, formData);
        toast.success('Meal updated successfully');
      } else {
        await axios.post('/api/nutrition', formData);
        toast.success('Meal added successfully');
      }
      
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchNutritionData();
    } catch (error) {
      toast.error('Failed to save meal');
    }
  };

  const handleEdit = (meal) => {
    setFormData({
      name: meal.name,
      mealType: meal.mealType,
      calories: meal.calories,
      protein: meal.protein || '',
      carbs: meal.carbs || '',
      fat: meal.fat || '',
      water: meal.water || '',
      date: meal.date,
      time: meal.time || new Date().toTimeString().slice(0, 5),
      notes: meal.notes || ''
    });
    setEditingId(meal._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;
    
    try {
      await axios.delete(`/api/nutrition/${id}`);
      toast.success('Meal deleted successfully');
      fetchNutritionData();
    } catch (error) {
      toast.error('Failed to delete meal');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mealType: 'breakfast',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      water: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: ''
    });
  };

  const getMealIcon = (type) => {
    const meal = mealTypes.find(m => m.value === type);
    return meal ? meal.icon : '🍽️';
  };

  const getMealColor = (type) => {
    const meal = mealTypes.find(m => m.value === type);
    return meal ? meal.color : 'gray';
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
            <h1 className="text-3xl font-bold text-gray-900">Nutrition Tracking</h1>
            <p className="text-gray-600">Log and analyze your daily nutrition</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <FiPlus />
            <span>Add Meal</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiTrendingUp className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalCalories}</div>
                <div className="text-sm text-gray-600">Total Calories</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiPieChart className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.protein}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiPieChart className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.carbs}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiPieChart className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.fat}g</div>
                <div className="text-sm text-gray-600">Fat</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <FiDroplet className="text-cyan-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.avgCalories}</div>
                <div className="text-sm text-gray-600">Avg Calories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Macro Distribution */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Macro Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Protein', value: stats.protein, color: 'bg-blue-500', percentage: 30 },
              { label: 'Carbs', value: stats.carbs, color: 'bg-green-500', percentage: 50 },
              { label: 'Fat', value: stats.fat, color: 'bg-yellow-500', percentage: 20 }
            ].map((macro, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">{macro.label}</span>
                  <span className="font-medium">{macro.value}g ({macro.percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${macro.color}`}
                    style={{ width: `${macro.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {editingId ? 'Edit Meal' : 'Add New Meal'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Chicken Salad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Type *
                  </label>
                  <select
                    required
                    value={formData.mealType}
                    onChange={(e) => setFormData({...formData, mealType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {mealTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calories
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water (ml)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.water}
                    onChange={(e) => setFormData({...formData, water: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.protein}
                    onChange={(e) => setFormData({...formData, protein: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.carbs}
                    onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.fat}
                    onChange={(e) => setFormData({...formData, fat: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="15"
                  />
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
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
                  placeholder="Add any notes about your meal..."
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
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {editingId ? 'Update Meal' : 'Add Meal'}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
              <select
                value={filters.mealType}
                onChange={(e) => setFilters({...filters, mealType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Meal Types</option>
                {mealTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calories Range</label>
              <select
                value={filters.caloriesRange}
                onChange={(e) => setFilters({...filters, caloriesRange: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Calories</option>
                <option value="low">Low (&lt;300)</option>
                <option value="medium">Medium (300-600)</option>
                <option value="high">High (&gt;600)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Meals List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Meal History</h3>
          </div>
          
          {filteredMeals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No meals found</h3>
              <p className="text-gray-500">Add your first meal to start tracking nutrition!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMeals.map((meal) => {
                const color = getMealColor(meal.mealType);
                const colorClasses = {
                  orange: 'bg-orange-100 text-orange-800',
                  green: 'bg-green-100 text-green-800',
                  blue: 'bg-blue-100 text-blue-800',
                  purple: 'bg-purple-100 text-purple-800',
                  cyan: 'bg-cyan-100 text-cyan-800',
                  gray: 'bg-gray-100 text-gray-800'
                };

                return (
                  <div key={meal._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-start space-x-4 mb-4 md:mb-0">
                        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                          <span className="text-xl">{getMealIcon(meal.mealType)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{meal.name}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
                              {mealTypes.find(t => t.value === meal.mealType)?.label || meal.mealType}
                            </span>
                            <span className="text-sm text-gray-600">
                              {meal.calories} calories
                            </span>
                            {meal.protein && (
                              <span className="text-sm text-gray-600">
                                • Protein: {meal.protein}g
                              </span>
                            )}
                            {meal.carbs && (
                              <span className="text-sm text-gray-600">
                                • Carbs: {meal.carbs}g
                              </span>
                            )}
                            {meal.fat && (
                              <span className="text-sm text-gray-600">
                                • Fat: {meal.fat}g
                              </span>
                            )}
                            {meal.water && (
                              <span className="text-sm text-gray-600">
                                • Water: {meal.water}ml
                              </span>
                            )}
                          </div>
                          {meal.notes && (
                            <p className="text-gray-600 text-sm mt-2">{meal.notes}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(meal.date).toLocaleDateString()} • {meal.time}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(meal)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(meal._id)}
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

        {/* Daily Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-6">
            <h4 className="font-bold mb-3">💧 Hydration Goal</h4>
            <div className="flex items-center justify-between mb-4">
              <span>Today's Water Intake</span>
              <span className="font-bold">1.5L / 2L</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-3/4"></div>
            </div>
            <p className="text-sm opacity-90 mt-4">Drink 500ml more to reach your goal!</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6">
            <h4 className="font-bold mb-3">🎯 Daily Calories</h4>
            <div className="flex items-center justify-between mb-4">
              <span>Calories Consumed</span>
              <span className="font-bold">1,850 / 2,200</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-5/6"></div>
            </div>
            <p className="text-sm opacity-90 mt-4">350 calories remaining for today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;