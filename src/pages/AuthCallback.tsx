
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // With Firebase auth, we don't need this page anymore
    // Redirect back to home page
    toast.info("Authentication handled through Firebase directly");
    navigate('/');
  }, [navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <p className="text-lg">Redirecting...</p>
      </div>
    </Layout>
  );
};

export default AuthCallback;
