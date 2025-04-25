import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { FaChartPie, FaWallet } from 'react-icons/fa';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function BudgetSummary({ trip }) {
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    if (trip) {
      extractBudgetData();
    }
  }, [trip]);

  const extractBudgetData = () => {
    setLoading(true);
    try {
      // Initialize budget categories
      const budgetCategories = {
        'Hotels': 0,
        'Food': 0,
        'Tickets': 0,
        'Transport': 0
      };
      
      let total = 0;

      // Extract hotel costs
      if (trip.tripData?.hotels && Array.isArray(trip.tripData.hotels)) {
        trip.tripData.hotels.forEach(hotel => {
          if (hotel.price) {
            // Extract numeric value from price (e.g., "$150" -> 150)
            const priceMatch = hotel.price.match(/\$?\s*(\d+)/);
            if (priceMatch && priceMatch[1]) {
              const price = parseInt(priceMatch[1], 10);
              if (!isNaN(price)) {
                budgetCategories['Hotels'] += price;
                total += price;
              }
            }
          }
        });
      }

      // Extract ticket costs from places to visit
      if (trip.tripData?.itinerary && Array.isArray(trip.tripData.itinerary)) {
        trip.tripData.itinerary.forEach(day => {
          if (day.plan && Array.isArray(day.plan)) {
            day.plan.forEach(place => {
              // Process ticket prices
              if (place.ticketPricing) {
                const priceMatch = place.ticketPricing.match(/\$?\s*(\d+)/);
                if (priceMatch && priceMatch[1]) {
                  const price = parseInt(priceMatch[1], 10);
                  if (!isNaN(price)) {
                    budgetCategories['Tickets'] += price;
                    total += price;
                  }
                }
              }
              
              // If there's transport cost information
              if (place.transportCost) {
                const transportMatch = place.transportCost.match(/\$?\s*(\d+)/);
                if (transportMatch && transportMatch[1]) {
                  const price = parseInt(transportMatch[1], 10);
                  if (!isNaN(price)) {
                    budgetCategories['Transport'] += price;
                    total += price;
                  }
                }
              }
            });
          }
        });
      }

      // Estimate food costs based on trip duration and budget level
      const days = trip.userSelection?.noOfDays || 1;
      const budgetLevel = trip.userSelection?.budget || 'Moderate';
      
      let foodCostPerDay = 30; // Default for Budget
      if (budgetLevel === 'Moderate') foodCostPerDay = 60;
      if (budgetLevel === 'Luxury') foodCostPerDay = 120;
      
      const foodCost = days * foodCostPerDay;
      budgetCategories['Food'] = foodCost;
      total += foodCost;

      // If transport is still 0, estimate it based on days and budget
      if (budgetCategories['Transport'] === 0) {
        let transportCostPerDay = 15; // Default for Budget
        if (budgetLevel === 'Moderate') transportCostPerDay = 30;
        if (budgetLevel === 'Luxury') transportCostPerDay = 60;
        
        const transportCost = days * transportCostPerDay;
        budgetCategories['Transport'] = transportCost;
        total += transportCost;
      }

      // Convert to array format for charts
      const chartData = Object.entries(budgetCategories).map(([name, value]) => ({
        name,
        value: Math.round(value)
      }));

      setBudgetData(chartData);
      setTotalBudget(total);
    } catch (error) {
      console.error('Error extracting budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `$${value}`;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-amber-100 p-2 rounded-xl">
          <FaWallet className="text-amber-600 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Budget Summary Breakdown</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : budgetData.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FaChartPie className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="mb-1">No budget data available yet</p>
          <p className="text-sm">Budget information will appear here when available</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Budget:</h3>
            <div className="text-2xl font-bold text-amber-600">${totalBudget}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-xl p-4"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Percentage Breakdown</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            {/* Bar Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-50 rounded-xl p-4"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Category Amounts</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={budgetData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Bar dataKey="value" fill="#8884d8">
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>* Food costs are estimated based on your trip duration and budget level.</p>
            <p>* Transport costs may include local transportation and transfers.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetSummary; 