import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { MessageCircle, Globe, BookOpen, Zap } from 'lucide-react'
import { useAnalytics } from '../hooks/useAnalytics'

const Analytics = () => {
  const { analytics, fetchAnalytics } = useAnalytics()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const languageColors = {
    English: '#14b8a6',
    Hindi: '#f59e0b',
    Bengali: '#ef4444',
    Tamil: '#8b5cf6',
    Telugu: '#06b6d4',
    Marwari: '#9ca3af'
  }

  const stats = [
    {
      title: 'Total Conversations',
      value: '1,247',
      icon: MessageCircle,
      color: 'text-primary-400'
    },
    {
      title: 'Active Languages',
      value: '6',
      icon: Globe,
      color: 'text-blue-400'
    },
    {
      title: 'FAQ Entries',
      value: '156',
      icon: BookOpen,
      color: 'text-green-400'
    },
    {
      title: 'Resolution Rate',
      value: '98.5%',
      icon: Zap,
      color: 'text-yellow-400'
    }
  ]

  const languageData = [
    { name: 'English', value: 40, color: '#14b8a6' },
    { name: 'Hindi', value: 20, color: '#f59e0b' },
    { name: 'Bengali', value: 15, color: '#ef4444' },
    { name: 'Tamil', value: 10, color: '#8b5cf6' },
    { name: 'Telugu', value: 5, color: '#06b6d4' },
    { name: 'Marwari', value: 10, color: '#9ca3af' }
  ]

  const categoryData = [
    { name: 'Admissions', value: 35 },
    { name: 'Academic', value: 28 },
    { name: 'Technical', value: 20 },
    { name: 'Campus', value: 12 },
    { name: 'Financial', value: 5 }
  ]

  const recentActivity = [
    {
      id: 1,
      time: '2 minutes ago',
      message: 'New conversation in Hindi about admissions'
    },
    {
      id: 2,
      time: '15 minutes ago',
      message: 'FAQ updated: Library hours'
    },
    {
      id: 3,
      time: '1 hour ago',
      message: 'Bulk FAQ import completed'
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">📊 Analytics</h1>
        <p className="text-gray-400">Monitor chatbot performance and user interactions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Language Usage Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Language Usage Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {languageData.map((lang, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: lang.color }}
                ></div>
                <span className="text-sm text-gray-300">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular FAQ Categories */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Popular FAQ Categories</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-dark-700 rounded-lg">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.message}</p>
                <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics