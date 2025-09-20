// Create routes/help.js
const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const Article = require('../models/Article');
const ContactRequest = require('../models/ContactRequest');

// GET /api/help/faqs - Get all FAQs
router.get('/faqs', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } }
      ];
    }
    
    const faqs = await FAQ.find(query).sort({ order: 1 });
    res.json(faqs);
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// GET /api/help/faq-categories - Get FAQ categories
router.get('/faq-categories', async (req, res) => {
  try {
    const categories = await FAQ.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get FAQ categories error:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ categories' });
  }
});

// GET /api/help/articles - Get all articles
router.get('/articles', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { published: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const articles = await Article.find(query)
      .select('title description category readTime views createdAt')
      .sort({ createdAt: -1 });
    
    res.json(articles);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// GET /api/help/article-categories - Get article categories
router.get('/article-categories', async (req, res) => {
  try {
    const categories = await Article.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get article categories error:', error);
    res.status(500).json({ error: 'Failed to fetch article categories' });
  }
});

// GET /api/help/articles/:id - Get specific article
router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// POST /api/help/contact - Submit contact request
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message, type } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const contactRequest = new ContactRequest({
      name,
      email,
      subject,
      message,
      type: type || 'general'
    });
    
    await contactRequest.save();
    
    // Here you would typically send an email notification to your support team
    console.log('New contact request:', { name, email, subject });
    
    res.json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Contact request error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET /api/help/search - Search across help content
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const [faqs, articles] = await Promise.all([
      FAQ.find({
        $or: [
          { question: { $regex: q, $options: 'i' } },
          { answer: { $regex: q, $options: 'i' } }
        ]
      }).limit(5),
      
      Article.find({
        published: true,
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      })
      .select('title description category readTime')
      .limit(5)
    ]);
    
    res.json({ faqs, articles });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

module.exports = router;