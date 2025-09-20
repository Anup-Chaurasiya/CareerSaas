// Create src/pages/ArticleDetail.js
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Clock, Eye } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await api.get(`/help/articles/${id}`);
      setArticle(response.data);
    } catch (err) {
      error('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <LoadingSpinner text="Loading article..." />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <Link to="/help" className="text-blue-600 hover:text-blue-800">
            Return to Help Center
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/help"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>

        {/* Article Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {article.category}
            </span>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {article.readTime} min read
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {article.views} views
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{article.description}</p>
          
          <div className="flex items-center text-sm text-gray-500">
            <span>Published on {new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: formatArticleContent(article.content) }}
          />
        </div>

        {/* Article Footer */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Was this article helpful?</h3>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200">
              Yes
            </button>
            <button className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200">
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format article content (simple markdown to HTML conversion)
const formatArticleContent = (content) => {
  return content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
};

export default ArticleDetail;