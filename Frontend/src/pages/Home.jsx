import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Upload, 
  Brain, 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Zap, 
  Users, 
  BarChart3,
  Star,
  Award,
  Target,
  Clock,
  FileText,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Sparkles,
  Play,
  Pause,
  Mail,
  Calendar,
  Video
} from 'lucide-react';

const Home = () => {
  const [activeDemo, setActiveDemo] = useState('resume');
  const [isPlaying, setIsPlaying] = useState(false);

  const features = [
    {
      id: 'resume',
      icon: <Brain className="h-8 w-8" />,
      title: "AI Resume Analysis",
      description: "Get instant, comprehensive feedback on your resume with advanced AI technology",
      highlights: ["ATS optimization", "Keyword analysis", "Score rating", "Industry-specific tips"],
      cta: "Analyze Your Resume",
      link: "/upload",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 'coverletter',
      icon: <Mail className="h-8 w-8" />,
      title: "AI Cover Letter Generator",
      description: "Create compelling, job-specific cover letters in seconds with our AI writer",
      highlights: ["Multiple tones", "Custom lengths", "Company-specific", "Industry-tailored"],
      cta: "Generate Cover Letter",
      link: "/cover-letters",
      color: "from-green-500 to-green-600"
    },
    {
      id: 'interview',
      icon: <MessageSquare className="h-8 w-8" />,
      title: "AI Interview Preparation",
      description: "Practice with AI-generated interview questions and get instant feedback",
      highlights: ["Role-specific questions", "Real-time feedback", "Practice sessions", "Performance analytics"],
      cta: "Start Practicing",
      link: "/interview",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const stats = [
    { number: "15,000+", label: "Resumes Analyzed" },
    { number: "8,500+", label: "Cover Letters Generated" },
    { number: "3,200+", label: "Interview Sessions" },
    { number: "94%", label: "Success Rate" }
  ];

  const testimonials = [
    {
      quote: "The cover letter generator helped me land 3 interviews in one week! The AI perfectly captured my experience for each specific role.",
      author: "Jessica Chen",
      role: "Product Manager at Microsoft",
      rating: 5,
      feature: "coverletter"
    },
    {
      quote: "I was struggling with technical interviews until I found the practice feature. The AI feedback was incredibly accurate and helpful!",
      author: "David Kim",
      role: "Software Engineer at Amazon",
      rating: 5,
      feature: "interview"
    },
    {
      quote: "The resume analysis pointed out issues I never would have found. My response rate increased by 300% after implementing the suggestions.",
      author: "Maria Rodriguez",
      role: "Marketing Director",
      rating: 5,
      feature: "resume"
    }
  ];

  const demos = {
    resume: {
      title: "Resume Analysis in Action",
      description: "See how our AI analyzes your resume and provides actionable feedback",
      steps: [
        "Upload your resume (PDF or Word)",
        "AI extracts and analyzes content",
        "Receive comprehensive score and feedback",
        "Get specific improvement suggestions"
      ],
      visual: (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-sm">AI Analysis Dashboard</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Overall Score</span>
              <span className="text-2xl font-bold">87/100</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2 mb-4">
              <div className="bg-white h-2 rounded-full" style={{width: '87%'}}></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-xs mb-1">ATS Compatibility</div>
              <div className="font-bold">92%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-xs mb-1">Content Quality</div>
              <div className="font-bold">85%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-xs mb-1">Keyword Optimization</div>
              <div className="font-bold">78%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-xs mb-1">Formatting</div>
              <div className="font-bold">90%</div>
            </div>
          </div>
        </div>
      )
    },
    coverletter: {
      title: "Cover Letter Generation",
      description: "Watch how AI creates personalized cover letters for any job application",
      steps: [
        "Input job description and your details",
        "AI generates multiple tone options",
        "Customize length and emphasis points",
        "Download or copy perfectly formatted letters"
      ],
      visual: (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm">Cover Letter Generator</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 mb-4">
            <div className="text-center mb-3">
              <div className="font-semibold mb-1">Select Tone</div>
              <div className="flex justify-center space-x-2">
                {['Professional', 'Enthusiastic', 'Formal', 'Creative'].map(tone => (
                  <div key={tone} className="bg-white/30 px-2 py-1 rounded text-xs">{tone}</div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold mb-1">Letter Length</div>
              <div className="flex justify-center space-x-2">
                {['Short', 'Medium', 'Long'].map(length => (
                  <div key={length} className="bg-white/30 px-2 py-1 rounded text-xs">{length}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-xs text-center mb-2">Generated Preview</div>
            <div className="text-xs bg-white/10 p-2 rounded h-20 overflow-hidden">
              "I am excited to apply for the Senior Developer position at your company. My experience in full-stack development aligns perfectly with your requirements..."
            </div>
          </div>
        </div>
      )
    },
    interview: {
      title: "Interview Practice Studio",
      description: "Experience realistic interview practice with AI-powered feedback",
      steps: [
        "Choose your target role and industry",
        "Practice with AI-generated questions",
        "Receive real-time feedback on answers",
        "Track progress and improvement areas"
      ],
      visual: (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm">Interview Practice</div>
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Live Session</span>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 mb-4 text-center">
            <div className="font-semibold mb-2">Current Question</div>
            <div className="text-sm mb-3">"Tell me about a challenging project you led and how you handled obstacles."</div>
            <button className={`p-2 rounded-full ${isPlaying ? 'bg-red-500' : 'bg-green-500'}`} onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-xs text-center mb-2">AI Feedback</div>
            <div className="text-xs space-y-1">
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-300" />
                <span>Good structure and clarity</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-yellow-300" />
                <span>Add more specific metrics</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-blue-300" />
                <span>Excellent problem-solving example</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  const activeFeature = features.find(f => f.id === activeDemo);
  const activeDemoData = demos[activeDemo];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Career Platform Trusted by 15,000+ Professionals
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Land Your Dream Job with
              <span className="text-blue-600"> AI-Powered</span> Career Tools
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Resume analysis, cover letter generation, and interview practice - all powered by advanced AI. 
              Everything you need to stand out in today's competitive job market.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/register">
                <Button size="lg" className="px-8 py-3 text-lg font-semibold">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  View Premium Features
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Job Search Success
            </h2>
            <p className="text-lg text-gray-600">
              Three powerful tools, one platform. From resume to offer letter.
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-col lg:flex-row gap-8 mb-16">
            {/* Feature Selector */}
            <div className="lg:w-1/3">
              <div className="space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    onClick={() => setActiveDemo(feature.id)}
                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                      activeDemo === feature.id
                        ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg ${
                        activeDemo === feature.id ? 'bg-white/20' : 'bg-white'
                      }`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold ml-3">{feature.title}</h3>
                    </div>
                    <p className="text-sm mb-4">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <CheckCircle className={`h-4 w-4 mr-2 ${
                            activeDemo === feature.id ? 'text-white' : 'text-green-500'
                          }`} />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <Link to={feature.link}>
                      <Button className={`w-full mt-4 ${
                        activeDemo === feature.id ? 'bg-white text-gray-900 hover:bg-gray-100' : ''
                      }`}>
                        {feature.cta}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Display */}
            <div className="lg:w-2/3">
              <div className="bg-gray-50 rounded-2xl p-8 h-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{activeDemoData.title}</h3>
                <p className="text-gray-600 mb-6">{activeDemoData.description}</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Steps */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">How It Works:</h4>
                    <div className="space-y-3">
                      {activeDemoData.steps.map((step, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-blue-600 font-bold">{index + 1}</span>
                          </div>
                          <p className="text-gray-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Demo */}
                  <div>
                    {activeDemoData.visual}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Our Users
            </h2>
            <p className="text-lg text-gray-600">
              Real people, real results. Join thousands who accelerated their job search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                    <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {testimonial.feature === 'resume' && 'Resume Analysis'}
                      {testimonial.feature === 'coverletter' && 'Cover Letters'}
                      {testimonial.feature === 'interview' && 'Interview Prep'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career Search?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who accelerated their job search with our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg font-semibold">
                Start Free Trial
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-white text-white">
                View All Plans
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-4">No credit card required • Cancel anytime</p>
        </div>
      </section>
    </div>
  );
};

export default Home;