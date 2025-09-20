// Create src/components/help/SearchSection.js
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchSection = ({ onSearch, initialQuery = '', showResults = false, faqs = [], articles = [] }) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState({ faqs: [], articles: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (showResults && query) {
      performSearch();
    }
  }, [query, showResults]);

  const performSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      // For now, we'll filter locally. In a real app, you'd make an API call
      const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(query.toLowerCase()) ||
        faq.answer.toLowerCase().includes(query.toLowerCase())
      );

      const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults({
        faqs: filteredFaqs.slice(0, 5),
        articles: filteredArticles.slice(0, 5)
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  if (showResults) {
    return (
      <div>
        <form onSubmit={handleSubmit} className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles and FAQs..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : query ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Results for "{query}"</h2>
            
            {searchResults.faqs.length === 0 && searchResults.articles.length === 0 ? (
              <p className="text-gray-600">No results found. Try different keywords.</p>
            ) : (
              <>
                {searchResults.faqs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">FAQs</h3>
                    <div className="space-y-3">
                      {searchResults.faqs.map((faq) => (
                        <div key={faq._id} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-blue-600">{faq.question}</h4>
                          <p className="text-sm text-gray-600 mt-1">{faq.answer.substring(0, 150)}...</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.articles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Articles</h3>
                    <div className="space-y-3">
                      {searchResults.articles.map((article) => (
                        <div key={article._id} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-blue-600">{article.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <span>{article.category}</span>
                            <span className="mx-2">•</span>
                            <span>{article.readTime} min read</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help articles and FAQs..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchSection;