import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Briefcase, Target, Star, Lightbulb } from 'lucide-react';

const JobSpecificAnalysis = ({ resumeId, onAnalysisComplete }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Sales',
    'Engineering',
    'Design',
    'Other'
  ];

  const handleJobAnalysis = async (e) => {
    e.preventDefault();
    
    if (!jobTitle.trim()) {
      error('Please enter a job title');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post(`/ai/resume-review/${resumeId}`, {
        jobTitle: jobTitle.trim(),
        company: company.trim(),
        industry: industry.trim()
      });

      success('Job-specific analysis completed!');
      if (onAnalysisComplete) {
        onAnalysisComplete(response.data);
      }
    } catch (err) {
      error(err.response?.data?.error || 'Failed to analyze for this job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Job-Specific Optimization
        </CardTitle>
        <CardDescription>
          Get tailored feedback for a specific job position
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleJobAnalysis} className="space-y-4">
          <div>
            <Label htmlFor="jobTitle" className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4" />
              Target Job Title *
            </Label>
            <Input
              id="jobTitle"
              placeholder="e.g., Senior Frontend Developer, Product Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="company" className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4" />
              Company (Optional)
            </Label>
            <Input
              id="company"
              placeholder="e.g., Google, Microsoft, Startup Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="industry" className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4" />
              Industry
            </Label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Industry (Optional)</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Analyzing for Job...' : 'Optimize for This Job'}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Pro Tip:</strong> This will analyze your resume specifically for the job title you enter, 
            providing targeted suggestions and relevant keywords.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSpecificAnalysis;