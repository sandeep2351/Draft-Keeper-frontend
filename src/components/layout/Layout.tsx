
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex">
        {isAuthenticated && <Sidebar />}
        <div className={cn(
          "flex-1 overflow-y-auto",
          isAuthenticated ? "p-4" : "max-w-3xl mx-auto w-full px-4 py-8"
        )}>
          {children}
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Draft Keeper &copy; {new Date().getFullYear()}</p>
          <p className="text-xs mt-1">A simple tool to create and save drafts to Google Drive</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
