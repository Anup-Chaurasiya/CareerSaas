import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { 
  FileText, 
  TrendingUp, 
  Target, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Clock,
  Crown,
  Upload,
  Star,
  Zap
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Failed to load dashboard data</p>
            <Button onClick={fetchDashboardData} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, stats, monthlyTrends, recentActivity, quickActions } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Here's your career progress overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Crown className={`h-5 w-5 ${
            user.plan === 'pro' ? 'text-yellow-500' : 
            user.plan === 'business' ? 'text-purple-500' : 'text-gray-400'
          }`} />
          <span className="capitalize">{user.plan} Plan</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Resumes"
          value={stats.basic.totalResumes}
          subtitle="Total uploaded"
          icon={FileText}
          trend={stats.basic.totalResumes > 0 ? 'up' : 'neutral'}
        />
        
        <StatCard
          title="Analyzed"
          value={stats.basic.analyzedResumes}
          subtitle="With AI feedback"
          icon={TrendingUp}
          trend={stats.performance.completionRate > 50 ? 'up' : 'down'}
        />
        
        <StatCard
          title="Cover Letters"
          value={stats.basic.coverLetters}
          subtitle="Generated"
          icon={FileText}
          trend={stats.basic.coverLetters > 0 ? 'up' : 'neutral'}
        />
        
        <StatCard
          title="Interviews"
          value={stats.basic.interviewSessions}
          subtitle="Practice sessions"
          icon={Target}
          trend={stats.basic.interviewSessions > 0 ? 'up' : 'neutral'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Overall career preparation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ProgressItem
                  title="Resume Completion"
                  value={stats.performance.completionRate}
                  max={100}
                  description={`${stats.basic.analyzedResumes} of ${stats.basic.totalResumes} resumes analyzed`}
                />
                
                <ProgressItem
                  title="Average Score"
                  value={stats.performance.averageScore}
                  max={100}
                  description="Based on AI feedback"
                  isScore={true}
                />
                
                <ProgressItem
                  title="Monthly Usage"
                  value={stats.usage.resumesThisMonth}
                  max={stats.usage.monthlyLimit}
                  description={
                    stats.usage.monthlyLimit === Infinity 
                      ? 'Unlimited analyses available' 
                      : `${stats.usage.remainingAnalysis} analyses remaining`
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Next steps for your career growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <ActionCard key={index} {...action} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="capitalize font-medium">{user.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span>{new Date(user.joined).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days active</span>
                  <span>{stats.basic.accountAge} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end">
          <Icon className="h-8 w-8 text-blue-600 mb-2" />
          {trend === 'up' && <ArrowUp className="h-4 w-4 text-green-500" />}
          {trend === 'down' && <ArrowDown className="h-4 w-4 text-red-500" />}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProgressItem = ({ title, value, max, description, isScore = false }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium">{title}</span>
      <span className="text-sm font-bold">{isScore ? `${value}/100` : `${value}/${max}`}</span>
    </div>
    <Progress value={(value / max) * 100} className="mb-2" />
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

const ActionCard = ({ title, description, icon, link, priority }) => {
  const getIcon = () => {
    switch (icon) {
      case 'upload': return <Upload className="h-5 w-5" />;
      case 'analyze': return <Zap className="h-5 w-5" />;
      case 'letter': return <FileText className="h-5 w-5" />;
      case 'interview': return <Target className="h-5 w-5" />;
      case 'upgrade': return <Crown className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  return (
    <Link to={link}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${
              priority === 'high' ? 'bg-red-100 text-red-600' :
              priority === 'medium' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {getIcon()}
            </div>
            <div>
              <h4 className="font-semibold text-sm">{title}</h4>
              <p className="text-xs text-gray-600">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const ActivityItem = ({ type, action, title, date }) => {
  const getIcon = () => {
    switch (type) {
      case 'resume': return <FileText className="h-4 w-4" />;
      case 'cover_letter': return <FileText className="h-4 w-4" />;
      case 'interview': return <Target className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="bg-gray-100 p-2 rounded-full">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-gray-500 capitalize">{action} • {new Date(date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Dashboard;