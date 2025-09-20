import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Check, Star, Zap, Crown, Loader2 } from 'lucide-react';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const plans = [
    {
      name: "Free",
      price: { monthly: "$0", yearly: "$0" },
      description: "Perfect for getting started",
      features: ["1 resume analysis per month", "Basic feedback", "Standard keywords", "Email support"],
      buttonText: "Get Started",
      action: () => navigate('/register')
    },
    {
      name: "Pro",
      price: { monthly: "$9.99", yearly: "$99" },
      description: "For serious job seekers",
      features: ["Unlimited analyses", "Advanced AI feedback", "ATS optimization", "Job-specific tips", "Priority support"],
      buttonText: "Subscribe Now",
      action: async () => {
        setLoading(true);
        try {
          const priceId = billingPeriod === 'monthly' 
            ? process.env.REACT_APP_STRIPE_PRO_MONTHLY 
            : process.env.REACT_APP_STRIPE_PRO_YEARLY;
          
          const response = await api.post('/subscriptions/create-checkout-session', {
            priceId,
            plan: 'pro'
          });
          
          window.location.href = response.data.sessionId;
        } catch (err) {
          error('Failed to start subscription');
        } finally {
          setLoading(false);
        }
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-career-50 via-white to-career-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8">
            <Button variant={billingPeriod === 'monthly' ? 'default' : 'ghost'} onClick={() => setBillingPeriod('monthly')}>
              Monthly
            </Button>
            <Button variant={billingPeriod === 'yearly' ? 'default' : 'ghost'} onClick={() => setBillingPeriod('yearly')}>
              Yearly (Save 20%)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={plan.name === "Pro" ? "border-2 border-career-500" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price[billingPeriod]}
                  <span className="text-sm text-gray-600">/{billingPeriod === 'yearly' ? 'year' : 'month'}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={plan.action} 
                  disabled={loading}
                  className={plan.name === "Pro" ? "btn-career w-full" : "w-full"}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;