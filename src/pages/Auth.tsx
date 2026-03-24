import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { BookOpen, LogIn, UserPlus, ShieldCheck, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const Auth: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(searchParams.get('mode') === 'register');
  const [selectedRole, setSelectedRole] = useState<UserRole>((searchParams.get('role') as UserRole) || 'parent');
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Google Auth

  useEffect(() => {
    if (user && profile && !loading) {
      const dashboard = profile.role === 'admin' ? '/admin' : profile.role === 'parent' ? '/parent' : '/tutor';
      navigate(dashboard);
    }
  }, [user, profile, loading, navigate]);

  const handleGoogleSignIn = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new profile
        const newProfile = {
          uid: user.uid,
          email: user.email,
          role: selectedRole,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', user.uid), newProfile);
        
        // Create role-specific document
        if (selectedRole === 'tutor') {
          await setDoc(doc(db, 'tutors', user.uid), {
            uid: user.uid,
            status: 'pending',
            subjects: [],
            location: '',
            availability: {},
            experience: '',
            gender: 'male',
            pricing: 0,
            bio: ''
          });
        } else if (selectedRole === 'parent') {
          await setDoc(doc(db, 'parents', user.uid), {
            uid: user.uid,
            phone: '',
            address: ''
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-2 rounded-xl">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          {isRegistering ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isRegistering ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-3xl sm:px-10 border border-gray-100">
          {isRegistering && step === 1 ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">I am a...</h3>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setSelectedRole('parent')}
                  className={`flex items-center p-4 border-2 rounded-2xl transition-all ${
                    selectedRole === 'parent' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <div className={`p-3 rounded-xl mr-4 ${selectedRole === 'parent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Parent</p>
                    <p className="text-xs text-gray-500">I'm looking for a tutor for my child</p>
                  </div>
                  {selectedRole === 'parent' && <CheckCircle className="ml-auto h-5 w-5 text-blue-600" />}
                </button>

                <button
                  onClick={() => setSelectedRole('tutor')}
                  className={`flex items-center p-4 border-2 rounded-2xl transition-all ${
                    selectedRole === 'tutor' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <div className={`p-3 rounded-xl mr-4 ${selectedRole === 'tutor' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Tutor</p>
                    <p className="text-xs text-gray-500">I want to join the HPS tutor network</p>
                  </div>
                  {selectedRole === 'tutor' && <CheckCircle className="ml-auto h-5 w-5 text-blue-600" />}
                </button>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Continue
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {isRegistering && (
                <button 
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors mb-4 block"
                >
                  &larr; Back to role selection
                </button>
              )}
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center px-4 py-4 border border-gray-200 rounded-2xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none transition-all"
                >
                  <img 
                    className="h-5 w-5 mr-3" 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google logo" 
                  />
                  {isRegistering ? 'Sign up with Google' : 'Sign in with Google'}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Secure Authentication</span>
                </div>
              </div>

              <p className="text-xs text-center text-gray-400 leading-relaxed">
                By continuing, you agree to HPS Tutoring's Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
