import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mic, Play, Pause, SkipForward, Star, Target, Timer } from 'lucide-react';

const InterviewPrep = ({ resumeId, onSessionCreate }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    industry: ''
  });
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const { success, error } = useToast();

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 
    'Marketing', 'Sales', 'Engineering', 'Design', 'Other'
  ];

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    
    if (!formData.jobTitle.trim()) {
      error('Job title is required');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/interview/generate', {
        resumeId,
        ...formData
      });

      success('Interview questions generated successfully!');
      
      if (onSessionCreate) {
        onSessionCreate(response.data);
      }
    } catch (err) {
      error(err.response?.data?.error || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    setRecording(true);
    // TODO: Implement audio recording
  };

  const stopRecording = () => {
    setRecording(false);
    // TODO: Stop recording and process audio
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Interview Preparation
        </CardTitle>
        <CardDescription>
          Practice with AI-generated interview questions tailored to your resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <form onSubmit={handleGenerateQuestions} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                placeholder="e.g., Senior Frontend Developer"
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="e.g., Google Inc."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="industry">Industry</Label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select Industry (Optional)</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Generating Questions...' : 'Start Interview Practice'}
          </Button>
        </form>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="bg-purple-100 p-2 rounded-full w-10 h-10 mx-auto mb-2">
              <Mic className="h-6 w-6 text-purple-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-sm">Voice Practice</h4>
            <p className="text-xs text-purple-700">Record & evaluate your answers</p>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full w-10 h-10 mx-auto mb-2">
              <Star className="h-6 w-6 text-blue-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-sm">AI Feedback</h4>
            <p className="text-xs text-blue-700">Get detailed performance analysis</p>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full w-10 h-10 mx-auto mb-2">
              <Timer className="h-6 w-6 text-green-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-sm">Time Tracking</h4>
            <p className="text-xs text-green-700">Practice with realistic timing</p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="p-3 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Interview Tips:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Use the STAR method (Situation, Task, Action, Result)</li>
            <li>• Practice speaking clearly and confidently</li>
            <li>• Prepare 2-3 questions to ask the interviewer</li>
            <li>• Research the company beforehand</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewPrep;