import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Search, FileText, Star, Edit, Trash2, Download, Plus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const CoverLetters = () => {
  const [coverLetters, setCoverLetters] = useState([]);
  const [filteredLetters, setFilteredLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { success, error } = useToast();

  useEffect(() => {
    fetchCoverLetters();
  }, []);

  useEffect(() => {
    filterCoverLetters();
  }, [coverLetters, searchTerm]);

  const fetchCoverLetters = async () => {
    try {
      const response = await api.get('/cover-letters');
      setCoverLetters(response.data);
    } catch (err) {
      error('Failed to load cover letters');
    } finally {
      setLoading(false);
    }
  };

  const filterCoverLetters = () => {
    let filtered = coverLetters;

    if (searchTerm) {
      filtered = filtered.filter(letter =>
        letter.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLetters(filtered);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this cover letter?')) return;

    try {
      await api.delete(`/cover-letters/${id}`);
      setCoverLetters(letters => letters.filter(l => l._id !== id));
      success('Cover letter deleted successfully');
    } catch (err) {
      error('Failed to delete cover letter');
    }
  };

  const handleToggleFavorite = async (id, currentStatus) => {
    try {
      const response = await api.put(`/cover-letters/${id}`, {
        isFavorite: !currentStatus
      });
      
      setCoverLetters(letters => 
        letters.map(l => l._id === id ? response.data : l)
      );
      success(!currentStatus ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      error('Failed to update favorite status');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your cover letters..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold">Cover Letters</h1>
        </div>
        <Link to="/resumes">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Cover Letter
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cover Letters List */}
      <div className="grid gap-4">
        {filteredLetters.map((letter) => (
          <Card key={letter._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{letter.jobTitle}</h3>
                  <p className="text-gray-600">{letter.company}</p>
                  {letter.industry && (
                    <span className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full mt-2">
                      {letter.industry}
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Created: {new Date(letter.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(letter._id, letter.isFavorite)}
                  >
                    <Star className={`h-4 w-4 ${letter.isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(letter._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Content
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLetters.length === 0 && coverLetters.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matching cover letters</h3>
            <p className="text-gray-600">Try a different search term</p>
          </CardContent>
        </Card>
      )}

      {coverLetters.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cover letters yet</h3>
            <p className="text-gray-600 mb-4">Create your first cover letter to get started</p>
            <Link to="/resumes">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Cover Letter
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoverLetters;