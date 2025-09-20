import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { 
  Users, 
  FileText, 
  Crown, 
  TrendingUp, 
  Activity,
  ArrowUp,
  ArrowDown,
  UserPlus
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (err) {
      error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="Loading admin dashboard..." />
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Failed to load dashboard data</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totals.users}
            icon={Users}
            change={`+${stats.totals.newUsers} this week`}
            trend="up"
          />
          
          <StatCard
            title="Active Users"
            value={stats.totals.activeUsers}
            icon={Activity}
            change={`${Math.round((stats.totals.activeUsers / stats.totals.users) * 100)}% of total`}
            trend="neutral"
          />
          
          <StatCard
            title="Resumes Analyzed"
            value={stats.totals.resumes}
            icon={FileText}
            change="All time"
            trend="up"
          />
          
          <StatCard
            title="Premium Users"
            value={stats.totals.premiumUsers}
            icon={Crown}
            change={`${Math.round((stats.totals.premiumUsers / stats.totals.users) * 100)}% conversion`}
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Signups */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Signups</h2>
              <UserPlus className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-3">
              {stats.recentSignups.map((user, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">User Growth</h2>
              <TrendingUp className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-3">
              {stats.userGrowth.map((month, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium">
                    {new Date(month._id.year, month._id.month - 1).toLocaleString('default', { month: 'short' })} {month._id.year}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold mr-2">{month.count}</span>
                    {index > 0 && month.count > stats.userGrowth[index - 1].count ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : index > 0 ? (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;