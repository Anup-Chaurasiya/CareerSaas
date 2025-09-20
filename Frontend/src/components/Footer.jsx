import { Link } from 'react-router-dom';
import { 
  FileText, 
  Github, 
  Twitter, 
  Mail, 
  Heart, 
  Linkedin,
  Facebook,
  Instagram,
  ArrowUp
} from 'lucide-react';
import { isAuthenticated } from '../utils/auth';
import { Button } from './ui/button';

const Footer = () => {
  const authenticated = isAuthenticated();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
      {/* Back to Top Button */}
      <Button
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full p-3 shadow-lg"
        size="icon"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CareerSaaS
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-md leading-relaxed">
              AI-powered resume analysis and career growth platform. We help job seekers land their dream jobs 
              with advanced AI technology and personalized feedback.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
                { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
                { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
                { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
                { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Product</h3>
            <ul className="space-y-3">
              {[
                { name: "Resume Analysis", path: "/resume-analysis" },
                { name: "Cover Letters", path: "/cover-letters" },
                { name: "Interview Prep", path: "/interview-prep" },
                { name: "Pricing", path: "/pricing" },
                { name: "Features", path: "/features" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-gray-400 hover:text-white text-sm transition-colors block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "Blog", path: "/blog" },
                { name: "Careers", path: "/careers" },
                { name: "Contact", path: "/contact" },
                { name: "Press", path: "/press" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-gray-400 hover:text-white text-sm transition-colors block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              {[
                { name: "Help Center", path: "/help" },
                { name: "Documentation", path: "/docs" },
                { name: "Community", path: "/community" },
                { name: "Status", path: "/status" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-gray-400 hover:text-white text-sm transition-colors block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {!authenticated && (
                <>
                  <li>
                    <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors block py-1">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-gray-400 hover:text-white text-sm transition-colors block py-1">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm flex items-center mb-4 md:mb-0">
            © 2024 CareerSaaS. Made with <Heart className="h-3 w-3 mx-1 text-red-400" /> for job seekers worldwide
          </p>
          
          <div className="flex space-x-6">
            {[
              { name: "Privacy", path: "/privacy" },
              { name: "Terms", path: "/terms" },
              { name: "Cookies", path: "/cookies" },
              { name: "Security", path: "/security" }
            ].map((item, index) => (
              <Link 
                key={index}
                to={item.path} 
                className="text-gray-400 hover:text-white text-xs transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup (Optional) */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h4 className="text-lg font-semibold text-white mb-2">Stay updated with career tips</h4>
          <p className="text-gray-400 text-sm mb-4">Get the latest job search insights delivered to your inbox</p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-l-none">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;