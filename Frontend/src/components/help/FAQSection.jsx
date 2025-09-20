// Create src/components/help/FAQSection.js
import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQSection = ({ faqs, categories, onSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
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

        {/* FAQ List */}
        <div className="md:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Frequently Asked Questions
              {selectedCategory !== 'all' && `: ${selectedCategory}`}
            </h2>
            <span className="text-sm text-gray-600">
              {filteredFaqs.length} questions
            </span>
          </div>

          {/* Search within category */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this category..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </form>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No questions found{searchQuery ? ` for "${searchQuery}"` : ''}.
                {searchQuery && (
                  <button
                    onClick={() => onSearch(searchQuery)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    Search all content
                  </button>
                )}
              </p>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq._id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleItem(faq._id)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {openItems[faq._id] ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {openItems[faq._id] && (
                    <div className="px-4 pb-3">
                      <p className="text-gray-600 mt-2">{faq.answer}</p>
                      <div className="flex items-center mt-4 text-sm text-gray-500">
                        <span>Was this helpful?</span>
                        <button className="ml-3 text-green-600 hover:text-green-800">
                          Yes ({faq.helpful?.yes || 0})
                        </button>
                        <button className="ml-3 text-red-600 hover:text-red-800">
                          No ({faq.helpful?.no || 0})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;