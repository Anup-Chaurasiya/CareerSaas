// src/components/AdminRoute.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';  
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = getUser();  
        if (!user) {
          navigate('/login');
          return;
        }

        if (user.isAdmin) {
          setIsAdmin(true);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner text="Checking permissions..." />;
  }

  return isAdmin ? children : null;
};

export default AdminRoute;
