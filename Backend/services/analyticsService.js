class AnalyticsService {
  constructor() {
    this.monthlyLimits = {
      free: 1,
      pro: Infinity,
      business: Infinity
    };
  }

  calculateUserStats(user, resumes, coverLetters, interviewSessions) {
    const analyzedResumes = resumes.filter(r => r.review);
    const totalScore = analyzedResumes.reduce((sum, r) => sum + (r.review?.averageScore || 0), 0);
    const averageScore = analyzedResumes.length > 0 ? totalScore / analyzedResumes.length : 0;

    return {
      basic: {
        totalResumes: resumes.length,
        analyzedResumes: analyzedResumes.length,
        coverLetters: coverLetters.length,
        interviewSessions: interviewSessions.length,
        accountAge: Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))
      },
      performance: {
        averageScore: Math.round(averageScore),
        successRate: Math.round((analyzedResumes.length / Math.max(resumes.length, 1)) * 100),
        completionRate: this.calculateCompletionRate(resumes, coverLetters, interviewSessions)
      },
      usage: {
        resumesThisMonth: user.subscription?.resumesThisMonth || 0,
        monthlyLimit: this.monthlyLimits[user.subscription?.plan || 'free'],
        remainingAnalysis: this.calculateRemainingAnalysis(user),
        lastActive: user.lastLogin || user.createdAt
      },
      goals: {
        nextMilestone: this.getNextMilestone(resumes.length),
        progress: this.calculateGoalProgress(user, resumes)
      }
    };
  }

  calculateCompletionRate(resumes, coverLetters, interviewSessions) {
    const totalActions = resumes.length + coverLetters.length + interviewSessions.length;
    const completedActions = resumes.filter(r => r.review).length + coverLetters.length + interviewSessions.length;
    return Math.round((completedActions / Math.max(totalActions, 1)) * 100);
  }

  calculateRemainingAnalysis(user) {
    const plan = user.subscription?.plan || 'free';
    const used = user.subscription?.resumesThisMonth || 0;
    const limit = this.monthlyLimits[plan];
    
    return limit === Infinity ? 'Unlimited' : Math.max(0, limit - used);
  }

  getNextMilestone(resumeCount) {
    const milestones = [5, 10, 25, 50, 100];
    return milestones.find(m => m > resumeCount) || 100;
  }

  calculateGoalProgress(user, resumes) {
    const analyzed = resumes.filter(r => r.review).length;
    const total = resumes.length;
    return total > 0 ? Math.round((analyzed / total) * 100) : 0;
  }

  getMonthlyTrends(resumes) {
    // Implement monthly analysis trends
    const last6Months = this.getLast6Months();
    return last6Months.map(month => ({
      month,
      analyses: resumes.filter(r => 
        new Date(r.createdAt).getMonth() === month.month &&
        new Date(r.createdAt).getFullYear() === month.year
      ).length
    }));
  }

  getLast6Months() {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        month: date.getMonth(),
        year: date.getFullYear(),
        name: date.toLocaleString('default', { month: 'short' })
      });
    }
    
    return months;
  }
}

module.exports = new AnalyticsService();