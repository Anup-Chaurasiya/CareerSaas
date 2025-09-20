// Create src/pages/HelpCenter.js
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import FAQSection from '../components/help/FAQSection';
import ArticlesSection from '../components/help/ArticlesSection';
import ContactSection from '../components/help/ContactSection';
import SearchSection from '../components/help/SearchSection';

const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState('faqs');
  const [faqs, setFaqs] = useState([]);
  const [faqCategories, setFaqCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [articleCategories, setArticleCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { error } = useToast();

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (searchQuery) {
      setActiveTab('search');
    }
    fetchData();
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      const [faqsRes, faqCatsRes, articlesRes, articleCatsRes] = await Promise.all([
        api.get('/help/faqs'),
        api.get('/help/faq-categories'),
        api.get('/help/articles'),
        api.get('/help/article-categories')
      ]);

      setFaqs(faqsRes.data);
      setFaqCategories(faqCatsRes.data);
      setArticles(articlesRes.data);
      setArticleCategories(articleCatsRes.data);
    } catch (err) {
      error('Failed to load help content');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchParams({ q: query });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <LoadingSpinner text="Loading help center..." />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'faqs', name: 'FAQs', icon: '❓' },
    { id: 'articles', name: 'Documentation', icon: '📚' },
    { id: 'contact', name: 'Contact Support', icon: '✉️' },
    ...(searchQuery ? [{ id: 'search', name: 'Search Results', icon: '🔍' }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600 mb-6">
            Find answers to common questions or get in touch with our support team
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchSection onSearch={handleSearch} initialQuery={searchQuery} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'faqs' && (
            <FAQSection 
              faqs={faqs} 
              categories={faqCategories} 
              onSearch={handleSearch}
            />
          )}
          
          {activeTab === 'articles' && (
            <ArticlesSection 
              articles={articles} 
              categories={articleCategories}
            />
          )}
          
          {activeTab === 'contact' && (
            <ContactSection />
          )}
          
          {activeTab === 'search' && (
            <SearchSection 
              onSearch={handleSearch} 
              initialQuery={searchQuery}
              showResults={true}
              faqs={faqs}
              articles={articles}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;