import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  FileText, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Crown, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { isAuthenticated, getUser, removeToken, removeUser } from '../utils/auth';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const user = getUser();
        setCurrentUser(user);
    }, [location]);

    const handleLogout = () => {
        removeToken();
        removeUser();
        setCurrentUser(null);
        setIsMenuOpen(false);
        navigate('/');
    };

    const getPlanBadge = (plan) => {
        const plans = {
            free: { label: 'Free', color: 'bg-gray-100 text-gray-800', icon: User },
            pro: { label: 'Pro', color: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white', icon: Crown },
            business: { label: 'Business', color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white', icon: Crown }
        };

        const planInfo = plans[plan] || plans.free;
        const IconComponent = planInfo.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${planInfo.color}`}>
                <IconComponent className="h-3 w-3 mr-1" />
                {planInfo.label}
            </span>
        );
    };

    const authenticated = isAuthenticated();
    const user = authenticated ? currentUser : null;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg group-hover:scale-105 transition-transform">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            CareerSaaS
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <Link to="/">
                            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                                Home
                            </Button>
                        </Link>
                        
                        {/* Features Dropdown */}
                        <div className="relative group">
                            <Button 
                                variant="ghost" 
                                className="text-gray-700 hover:text-blue-600 flex items-center gap-1"
                                onMouseEnter={() => setIsFeaturesOpen(true)}
                                onMouseLeave={() => setIsFeaturesOpen(false)}
                            >
                                Features
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                            {isFeaturesOpen && (
                                <div 
                                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-2"
                                    onMouseEnter={() => setIsFeaturesOpen(true)}
                                    onMouseLeave={() => setIsFeaturesOpen(false)}
                                >
                                    <Link to="/resume-analysis" className="flex items-center p-3 rounded-md hover:bg-gray-50 text-gray-700">
                                        <Sparkles className="h-4 w-4 mr-3 text-blue-500" />
                                        <div>
                                            <div className="font-medium">Resume Analysis</div>
                                            <div className="text-sm text-gray-500">AI-powered feedback</div>
                                        </div>
                                    </Link>
                                    <Link to="/cover-letters" className="flex items-center p-3 rounded-md hover:bg-gray-50 text-gray-700">
                                        <FileText className="h-4 w-4 mr-3 text-green-500" />
                                        <div>
                                            <div className="font-medium">Cover Letters</div>
                                            <div className="text-sm text-gray-500">AI-generated letters</div>
                                        </div>
                                    </Link>
                                    <Link to="/interview-prep" className="flex items-center p-3 rounded-md hover:bg-gray-50 text-gray-700">
                                        <User className="h-4 w-4 mr-3 text-purple-500" />
                                        <div>
                                            <div className="font-medium">Interview Prep</div>
                                            <div className="text-sm text-gray-500">Practice questions</div>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link to="/pricing">
                            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                                Pricing
                            </Button>
                        </Link>

                        {authenticated ? (
                            <>
                                <Link to="/dashboard">
                                    <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link to="/upload">
                                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Analyze Resume
                                    </Button>
                                </Link>
                                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                                    {user?.subscription?.plan && getPlanBadge(user.subscription.plan)}
                                    <div className="flex items-center space-x-3">
                                        <Link to="/profile">
                                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                {user?.name}
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm" onClick={handleLogout}>
                                            <LogOut className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login">
                                    <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
                        <div className="flex flex-col space-y-2 px-4">
                            <Link to="/">
                                <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                                    Home
                                </Button>
                            </Link>
                            <Link to="/pricing">
                                <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                                    Pricing
                                </Button>
                            </Link>
                            <Link to="/resume-analysis">
                                <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                                    Resume Analysis
                                </Button>
                            </Link>
                            <Link to="/cover-letters">
                                <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                                    Cover Letters
                                </Button>
                            </Link>

                            {authenticated ? (
                                <>
                                    <Link to="/dashboard">
                                        <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link to="/upload">
                                        <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 text-white" onClick={() => setIsMenuOpen(false)}>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Analyze Resume
                                        </Button>
                                    </Link>
                                    <div className="px-4 py-3 border-t border-gray-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-gray-700 font-medium">Welcome, {user?.name}</span>
                                            {user?.subscription?.plan && getPlanBadge(user.subscription.plan)}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link to="/profile">
                                                <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                                                    <User className="h-4 w-4 mr-2" />
                                                    Profile
                                                </Button>
                                            </Link>
                                            <Button variant="outline" className="w-full" onClick={handleLogout}>
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 text-white" onClick={() => setIsMenuOpen(false)}>
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;