import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, CheckCircle, AlertCircle, Lightbulb, Hash, Star } from 'lucide-react';

const ResumeReview = ({ resumeId, onReviewComplete }) => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const { success } = useToast();

  const analyzeResume = async () => {
    try {
      setAnalyzing(true);
      setError('');
      const response = await api.post(`/ai/resume-review/${resumeId}`);
      setReview(response.data);
      success('Resume analysis completed successfully!');
      if (onReviewComplete) {
        onReviewComplete(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!review ? (
        <Card>
          <CardHeader>
            <CardTitle>AI Resume Review</CardTitle>
            <CardDescription>
              Get detailed feedback on your resume from our AI career coach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={analyzeResume} disabled={analyzing}>
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{review.summary}</p>
            </CardContent>
          </Card>

          {/* Strengths Section */}
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 mt-4">
              {review.strengths.map((strength, index) => (
                <div key={index} className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800">{strength.title}</h4>
                  <p className="text-sm text-green-700 mt-1">{strength.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weaknesses Section */}
          <Card>
            <CardHeader className="bg-amber-50">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 mt-4">
              {review.weaknesses.map((weakness, index) => (
                <div key={index} className="p-4 border rounded-lg bg-amber-50">
                  <h4 className="font-semibold text-amber-800">{weakness.title}</h4>
                  <p className="text-sm text-amber-700 mt-1">{weakness.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suggestions Section */}
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                Actionable Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 mt-4">
              {review.suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800">{suggestion.title}</h4>
                  <p className="text-sm text-blue-700 mt-1">{suggestion.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Keywords Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Important Keywords
              </CardTitle>
              <CardDescription>
                These keywords will help your resume pass Applicant Tracking Systems (ATS)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {review.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResumeReview;