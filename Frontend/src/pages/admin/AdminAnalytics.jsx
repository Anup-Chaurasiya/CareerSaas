import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { TrendingUp, Users, FileText, DollarSign, Calendar } from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics', {
        params: { range: timeRange }
      });
      setAnalytics(response.data);
    } catch (err) {
      error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, trend }) => {
    const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
    const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
    
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {title}
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {value}
                  </div>
                </dd>
                {change && (
                  <div className={`text-sm font-medium ${trendColor}`}>
                    <span className="mr-1">{trendIcon}</span>
                    {change}
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="Loading analytics..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-gray-600">Track platform growth and performance</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="mt-4 md:mt-0 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={analytics?.totals?.users?.toLocaleString() || '0'}
            icon={Users}
            change="+12% this month"
            trend="up"
          />
          <StatCard
            title="Active Users"
            value={analytics?.totals?.activeUsers?.toLocaleString() || '0'}
            icon={Users}
            change="+8% this month"
            trend="up"
          />
          <StatCard
            title="Resumes Analyzed"
            value={analytics?.totals?.resumes?.toLocaleString() || '0'}
            icon={FileText}
            change="+15% this month"
            trend="up"
          />
          <StatCard
            title="Premium Users"
            value={analytics?.totals?.premiumUsers?.toLocaleString() || '0'}
            icon={DollarSign}
            change="+5% this month"
            trend="up"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <div className="space-y-3">
              {analytics?.userGrowth?.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(month._id.year, month._id.month - 1).toLocaleString('default', { month: 'short' })} {month._id.year}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold mr-2">{month.count}</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Analysis Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Resume Analysis</h3>
            <div className="space-y-3">
              {analytics?.resumeAnalysis?.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(month._id.year, month._id.month - 1).toLocaleString('default', { month: 'short' })} {month._id.year}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold mr-2">{month.count}</span>
                    <span className="text-xs text-gray-500">Avg: {Math.round(month.avgScore)}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscription Stats */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Subscription Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics?.subscriptionStats?.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stat.count}</div>
                <div className="text-sm text-gray-600 capitalize">{stat._id} Plans</div>
                <div className="text-xs text-gray-500">{stat.active} active</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;