// Create src/components/help/ArticlesSection.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';

const ArticlesSection = ({ articles, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredArticles = articles.filter(article =>
    selectedCategory === 'all' || article.category === selectedCategory
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Category Filter */}
        <div className="md:w-1/4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                selectedCategory === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        <div className="md:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Documentation Articles
              {selectedCategory !== 'all' && `: ${selectedCategory}`}
            </h2>
            <span className="text-sm text-gray-600">
              {filteredArticles.length} articles
            </span>
          </div>

          <div className="grid gap-6">
            {filteredArticles.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No articles found in this category.
              </p>
            ) : (
              filteredArticles.map((article) => (
                <article key={article._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    <Link to={`/help/article/${article._id}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {article.category}
                      </span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {article.readTime} min read
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {article.views} views
                      </div>
                    </div>
                    <span>
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesSection;