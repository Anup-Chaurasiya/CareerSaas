import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Plus, Filter, Search } from 'lucide-react';
import ResumeList from '../components/ResumeList';
import LoadingSpinner from '../components/LoadingSpinner';

const ResumeSection = () => {
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const { error } = useToast();

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    filterResumes();
  }, [resumes, searchTerm, filter]);

  const fetchResumes = async () => {
    try {
      const response = await api.get('/resumes');
      setResumes(response.data);
    } catch (err) {
      error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const filterResumes = () => {
    let filtered = resumes;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(resume =>
        resume.originalName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter === 'analyzed') {
      filtered = filtered.filter(resume => resume.review);
    } else if (filter === 'pending') {
      filtered = filtered.filter(resume => !resume.review);
    }

    setFilteredResumes(filtered);
  };

  const handleAnalyze = async (resumeId) => {
    try {
      // This would trigger the analysis
      console.log('Analyzing resume:', resumeId);
      // You might want to navigate to the detail page or show a modal
    } catch (err) {
      error('Failed to start analysis');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your resumes..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/dashboard">
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">All Resumes</h1>
        </div>
        <Link to="/upload">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Resumes</option>
              <option value="analyzed">Analyzed</option>
              <option value="pending">Pending Analysis</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Resume List */}
      <ResumeList
        resumes={filteredResumes}
        title={`Your Resumes (${filteredResumes.length})`}
        showViewAll={false}
        onAnalyze={handleAnalyze}
      />

      {filteredResumes.length === 0 && resumes.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matching resumes</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeSection;