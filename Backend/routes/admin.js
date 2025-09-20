const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/User");
const Resume = require("../models/Resume");
const Subscription = require("../models/Subscription");


router.get("/dashboard", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    const totalResumes = await Resume.countDocuments();
    const premiumUsers = await Subscription.countDocuments({
      status: "active",
      plan: { $ne: "free" },
    });

    const recentSignups = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    res.json({
      totals: {
        users: totalUsers,
        activeUsers,
        newUsers,
        resumes: totalResumes,
        premiumUsers,
      },
      recentSignups,
      userGrowth,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------
   👥 USER MANAGEMENT ROUTES
------------------------------ */

// Get all users (with pagination + filters)
router.get("/users", adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const filter = req.query.filter || "all";

    const skip = (page - 1) * limit;
    let query = {};

    // 🔍 Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // ⚡ Status filter
    if (filter === "active") {
      query.isActive = true;
    } else if (filter === "inactive") {
      query.isActive = false;
    } else if (filter === "premium") {
      const premiumUserIds = await Subscription.distinct("userId", {
        status: "active",
        plan: { $ne: "free" },
      });
      query._id = { $in: premiumUserIds };
    }

    const users = await User.find(query)
      .select("name email createdAt isActive lastLogin")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single user details
router.get("/users/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const resumes = await Resume.find({ userId: req.params.id });
    const subscription = await Subscription.findOne({ userId: req.params.id });

    res.json({
      user,
      resumes: resumes.length,
      subscription,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user active/inactive status
router.patch("/users/:id/status", adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User status updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get resumes (with filters + pagination)
router.get("/resumes", adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const filter = req.query.filter || "all";

    const skip = (page - 1) * limit;
    let query = {};

    // 🔍 Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "user.name": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } },
      ];
    }

    // ⚡ Analysis filter
    if (filter === "analyzed") query.isAnalyzed = true;
    if (filter === "pending") query.isAnalyzed = false;

    const resumes = await Resume.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resume.countDocuments(query);

    res.json({
      resumes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResumes: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------
   📈 ANALYTICS ROUTES
------------------------------ */

// Platform analytics
router.get("/analytics", adminAuth, async (req, res) => {
  try {
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    const resumeAnalysis = await Resume.aggregate([
      { $match: { isAnalyzed: true } },
      {
        $group: {
          _id: {
            year: { $year: "$analyzedAt" },
            month: { $month: "$analyzedAt" },
          },
          count: { $sum: 1 },
          avgScore: { $avg: "$score" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    const subscriptionStats = await Subscription.aggregate([
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({ userGrowth, resumeAnalysis, subscriptionStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add to your existing admin routes

// GET /api/admin/users - Get users with pagination and filters
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const filter = req.query.filter || 'all';
    
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (filter === 'active') {
      query.isActive = true;
    } else if (filter === 'inactive') {
      query.isActive = false;
    } else if (filter === 'premium') {
      const Subscription = require('../models/Subscription');
      const premiumUserIds = await Subscription.distinct('userId', { 
        status: 'active', 
        plan: { $ne: 'free' } 
      });
      query._id = { $in: premiumUserIds };
    }
    
    const User = require('../models/User');
    const users = await User.find(query)
      .select('name email createdAt isActive lastLogin')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/admin/users/:id/status - Update user status
router.patch('/users/:id/status', adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    const User = require('../models/User');
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User status updated', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/resumes - Get resumes with filters
router.get('/resumes', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const filter = req.query.filter || 'all';
    
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (filter === 'analyzed') {
      query.isAnalyzed = true;
    } else if (filter === 'pending') {
      query.isAnalyzed = false;
    }
    
    const Resume = require('../models/Resume');
    const resumes = await Resume.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Resume.countDocuments(query);
    
    res.json({
      resumes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResumes: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/analytics - Get platform analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const User = require('../models/User');
    const Resume = require('../models/Resume');
    const Subscription = require('../models/Subscription');
    
    // Get counts for dashboard
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalResumes = await Resume.countDocuments();
    const premiumUsers = await Subscription.countDocuments({ status: 'active', plan: { $ne: 'free' } });
    
    // User growth by month
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 }
    ]);
    
    // Resume analysis by month
    const resumeAnalysis = await Resume.aggregate([
      {
        $match: { isAnalyzed: true }
      },
      {
        $group: {
          _id: {
            year: { $year: "$analyzedAt" },
            month: { $month: "$analyzedAt" }
          },
          count: { $sum: 1 },
          avgScore: { $avg: "$score" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 }
    ]);
    
    // Subscription stats
    const subscriptionStats = await Subscription.aggregate([
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
          }
        }
      }
    ]);
    
    res.json({
      totals: {
        users: totalUsers,
        activeUsers,
        resumes: totalResumes,
        premiumUsers
      },
      userGrowth,
      resumeAnalysis,
      subscriptionStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
