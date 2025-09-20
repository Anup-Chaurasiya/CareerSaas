import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Download, Brain, FileText, Calendar, Target } from 'lucide-react';
import ResumeReview from '../components/ResumeReview';
import LoadingSpinner from '../components/LoadingSpinner';
import JobSpecificAnalysis from '../components/JobSpecificAnalysis';
import CoverLetterGenerator from '../components/CoverLetterGenerator';

const ResumeDetail = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJobAnalysis, setShowJobAnalysis] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { error, success } = useToast();

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await api.get(`/resumes/${id}`);
      setResume(response.data);
    } catch (err) {
      error('Failed to fetch resume');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/resumes/download/${id}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resume.originalName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      error('Failed to download resume');
    }
  };

  const handleReviewComplete = (reviewData) => {
    // Update local resume state with review
    setResume(prev => ({
      ...prev,
      review: reviewData
    }));
  };

  if (loading) {
    return <LoadingSpinner text="Loading resume..." />;
  }

  if (!resume) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Resume not found</p>
            <Link to="/dashboard">
              <Button className="mt-4">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/resumes">
          <Button variant="outline" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resumes
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Resume Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resume Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{resume.originalName}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleDownload} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {!resume.review && (
                  <Button className="flex-1">
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                )}
              </div>

              {resume.review && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">
                      AI Analysis Complete
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Analysis Section */}
          {!resume.review && (
            <Card>
              <CardHeader>
                <CardTitle>Job-Specific Analysis</CardTitle>
                <CardDescription>
                  Analyze this resume against a specific job description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setShowJobAnalysis(!showJobAnalysis)}
                  variant="outline"
                  className="w-full"
                >
                  <Target className="h-4 w-4 mr-2" />
                  {showJobAnalysis ? 'Hide Job Analysis' : 'Analyze for Specific Job'}
                </Button>

                {showJobAnalysis && (
                  <div className="mt-4">
                    <JobSpecificAnalysis
                      resumeId={id}
                      onAnalysisComplete={handleReviewComplete}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content - AI Review and Tools */}
        <div className="lg:col-span-2 space-y-6">
          <ResumeReview
            resumeId={id}
            onReviewComplete={handleReviewComplete}
          />

          {/* Tools Section */}
          <Card>
            <CardHeader>
              <CardTitle>Resume Tools</CardTitle>
              <CardDescription>
                Enhance your job application with these tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  {!resume.review && (
                    <Button onClick={() => setShowJobAnalysis(!showJobAnalysis)} variant="outline">
                      <Target className="h-4 w-4 mr-2" />
                      {showJobAnalysis ? 'Hide Job Analysis' : 'Analyze for Job'}
                    </Button>
                  )}

                  <Button onClick={() => setShowCoverLetter(!showCoverLetter)} variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    {showCoverLetter ? 'Hide Cover Letter' : 'Generate Cover Letter'}
                  </Button>
                  <Button onClick={() => setShowInterviewPrep(!showInterviewPrep)} variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    {showInterviewPrep ? 'Hide Interview Prep' : 'Interview Practice'}
                  </Button>
                </div>

                {showJobAnalysis && (
                  <JobSpecificAnalysis
                    resumeId={id}
                    onAnalysisComplete={handleReviewComplete}
                  />
                )}

                {showCoverLetter && (
                  <CoverLetterGenerator
                    resumeId={id}
                    onGenerate={(coverLetter) => {
                      success('Cover letter saved to your collection!');
                      setShowCoverLetter(false);
                    }}
                  />
                )}
                {showInterviewPrep && (
                  <InterviewPrep
                    resumeId={id}
                    onSessionCreate={(session) => {
                      success('Interview practice session created!');
                      // TODO: Navigate to interview practice page
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetail;