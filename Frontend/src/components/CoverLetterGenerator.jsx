import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileText, Wand2, Copy, Download, Star, RefreshCw } from 'lucide-react';

const CoverLetterGenerator = ({ resumeId, onGenerate }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    industry: '',
    tone: 'professional',
    length: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const { success, error } = useToast();

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'formal', label: 'Formal' },
    { value: 'creative', label: 'Creative' }
  ];

  const lengths = [
    { value: 'short', label: 'Short (150 words)' },
    { value: 'medium', label: 'Medium (250 words)' },
    { value: 'long', label: 'Long (400 words)' }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 
    'Marketing', 'Sales', 'Engineering', 'Design', 'Other'
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!formData.jobTitle.trim() || !formData.company.trim()) {
      error('Job title and company are required');
      return;
    }

    setLoading(true);
    setGeneratedContent('');
    
    try {
      const response = await api.post('/cover-letters/generate', {
        resumeId,
        ...formData
      });

      setGeneratedContent(response.data.content);
      setIsFavorite(response.data.isFavorite);
      success('Cover letter generated successfully!');
      
      if (onGenerate) {
        onGenerate(response.data);
      }
    } catch (err) {
      error(err.response?.data?.error || 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    success('Copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${formData.company}-${formData.jobTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveFavorite = async () => {
    try {
      // This would update the cover letter's favorite status
      // You'll need to implement this in your API
      setIsFavorite(!isFavorite);
      success(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
    } catch (err) {
      error('Failed to update favorite status');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Cover Letter Generator
        </CardTitle>
        <CardDescription>
          Create a tailored cover letter for your job application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        {!generatedContent && (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                  placeholder="e.g., Senior Developer"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="e.g., Google Inc."
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Industry (Optional)</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tone">Tone</Label>
                <select
                  id="tone"
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {tones.map((tone) => (
                    <option key={tone.value} value={tone.value}>{tone.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="length">Length</Label>
                <select
                  id="length"
                  value={formData.length}
                  onChange={(e) => setFormData({...formData, length: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {lengths.map((length) => (
                    <option key={length.value} value={length.value}>{length.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </form>
        )}

        {/* Generated Content */}
        {generatedContent && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold mb-2">Generated Cover Letter</h3>
              <div className="whitespace-pre-wrap text-sm">
                {generatedContent}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCopy} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleSaveFavorite} variant="outline" size="sm">
                <Star className={`h-4 w-4 mr-2 ${isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </Button>
              <Button 
                onClick={() => setGeneratedContent('')} 
                variant="outline" 
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New
              </Button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Customize the generated content with specific company details</li>
            <li>• Use the professional tone for corporate roles</li>
            <li>• Try enthusiastic tone for startups and creative roles</li>
            <li>• Always proofread and personalize before sending</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoverLetterGenerator;