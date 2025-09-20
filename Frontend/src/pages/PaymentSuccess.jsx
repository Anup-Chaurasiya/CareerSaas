import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Rocket, FileText, Crown } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { success } = useToast();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      success('Payment successful! Your account has been upgraded to Pro!');
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-career-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">Welcome to CareerSaaS Pro! 🎉</CardTitle>
          <p className="text-gray-600 mt-2">
            Your payment was successful and your account has been upgraded.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">What You Get Now:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✅ Unlimited resume analyses</li>
              <li>✅ Advanced AI feedback</li>
              <li>✅ Priority support</li>
              <li>✅ ATS optimization scores</li>
              <li>✅ No usage limits</li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Link to="/upload">
              <Button className="w-full btn-career">
                <FileText className="h-4 w-4 mr-2" />
                Upload Your First Pro Resume
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="w-full">
                <Rocket className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;