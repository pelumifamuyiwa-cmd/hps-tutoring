import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut, 
  PlusCircle,
  BookOpen,
  MessageSquare,
  Bell
} from 'lucide-react';
import { auth } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from './NotificationCenter';

interface SidebarProps {
  role: 'admin' | 'parent' | 'tutor';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const { profile } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
  };

  const menuItems = {
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
      { icon: Users, label: 'Tutors', path: '/admin/tutors' },
      { icon: MessageSquare, label: 'Requests', path: '/admin/requests' },
      { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    ],
    parent: [
      { icon: LayoutDashboard, label: 'Overview', path: '/parent' },
      { icon: PlusCircle, label: 'New Request', path: '/parent/request' },
      { icon: Calendar, label: 'Schedule', path: '/parent/schedule' },
      { icon: CreditCard, label: 'Payments', path: '/parent/payments' },
    ],
    tutor: [
      { icon: LayoutDashboard, label: 'Overview', path: '/tutor' },
      { icon: Users, label: 'My Clients', path: '/tutor/clients' },
      { icon: Calendar, label: 'Schedule', path: '/tutor/schedule' },
      { icon: CreditCard, label: 'Earnings', path: '/tutor/earnings' },
    ]
  };

  const items = menuItems[role];

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">HPS Platform</span>
        </Link>
        <NotificationCenter />
      </div>

      <div className="flex-1 px-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 px-4 py-3 mb-4">
          <img 
            src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || 'User'}`} 
            alt="Profile" 
            className="h-8 w-8 rounded-full ring-2 ring-gray-100"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{profile?.displayName}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{profile?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
