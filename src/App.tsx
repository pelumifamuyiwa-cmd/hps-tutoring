import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PublicHome from './pages/PublicHome';
import Auth from './pages/Auth';
import ParentDashboard from './pages/parent/ParentDashboard';
import TutorDashboard from './pages/tutor/TutorDashboard';
import TutorProfileSetup from './pages/tutor/TutorProfileSetup';
import AdminDashboard from './pages/admin/AdminDashboard';
import NewRequest from './pages/parent/NewRequest';
import MatchTutor from './pages/admin/MatchTutor';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Public Routes with Navbar/Footer */}
            <Route path="/" element={
              <>
                <Navbar />
                <PublicHome />
                <Footer />
              </>
            } />
            
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes */}
            <Route path="/parent" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/parent/request" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <NewRequest />
              </ProtectedRoute>
            } />
            
            <Route path="/tutor" element={
              <ProtectedRoute allowedRoles={['tutor']}>
                <TutorDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/tutor/profile" element={
              <ProtectedRoute allowedRoles={['tutor']}>
                <TutorProfileSetup />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/requests/:requestId" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MatchTutor />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
