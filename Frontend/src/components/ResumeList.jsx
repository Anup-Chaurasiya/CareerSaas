import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, Eye, Brain, Download, Calendar } from 'lucide-react';

const ResumeList = ({ resumes, title = "Your Resumes", showViewAll = true, onAnalyze }) => {
  if (!resumes || resumes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
          <p className="text-gray-600 mb-4">Upload your first resume to get started</p>
          <Link to="/upload">
            <Button>Upload Resume</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resumes.map((resume) => (
            <div key={resume._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {resume.originalName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </span>
                      {resume.review && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Analyzed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to={`/resume/${resume._id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                {!resume.review && onAnalyze && (
                  <Button size="sm" onClick={() => onAnalyze(resume._id)}>
                    <Brain className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {showViewAll && resumes.length > 0 && (
            <Link to="/resumes">
              <Button variant="ghost" className="w-full">
                View All Resumes
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeList;