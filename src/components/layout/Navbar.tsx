import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebase';
import { LogOut, User, Menu, X, BookOpen, Bell } from 'lucide-react';
import NotificationCenter from '../dashboard/NotificationCenter';

const Navbar: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'admin': return '/admin';
      case 'parent': return '/parent';
      case 'tutor': return '/tutor';
      default: return '/';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">HPS Tutoring</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
            <Link to="/#success-stories" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Success Stories</Link>
            <Link to="/#faq" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">FAQ</Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <NotificationCenter />
                <Link 
                  to={getDashboardLink()} 
                  className="text-sm font-medium text-gray-700 bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-all flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
                <Link 
                  to="/auth?mode=register" 
                  className="text-sm font-medium text-white bg-blue-600 px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <Link to="/#features" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600">Features</Link>
          <Link to="/#success-stories" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600">Success Stories</Link>
          <Link to="/#faq" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600">FAQ</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="block px-3 py-2 text-base font-medium text-gray-900 bg-gray-50 rounded-lg">Dashboard</Link>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-base font-medium text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="block px-3 py-2 text-base font-medium text-gray-600">Login</Link>
              <Link to="/auth?mode=register" className="block px-3 py-2 text-base font-medium text-blue-600 font-semibold">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
