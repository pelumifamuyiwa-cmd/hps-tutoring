import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { TutorProfile } from '../../types';
import Sidebar from '../../components/dashboard/Sidebar';
import { 
  BookOpen, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const TutorProfileSetup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<TutorProfile>>({
    subjects: [],
    location: '',
    experience: '',
    gender: 'male',
    pricing: 0,
    bio: '',
    availability: {}
  });

  const subjectsList = ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Accounting', 'Computer Science'];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const tDoc = await getDoc(doc(db, 'tutors', user.uid));
      if (tDoc.exists()) {
        setFormData(tDoc.data() as TutorProfile);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects?.includes(subject) 
        ? prev.subjects.filter(s => s !== subject)
        : [...(prev.subjects || []), subject]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'tutors', user.uid), {
        ...formData,
        status: 'pending' // Reset to pending for review if they change critical info
      });
      toast.success('Profile updated! Admin will review your changes.');
      navigate('/tutor');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    }
  };

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="tutor" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Complete Your Profile</h1>
            <p className="text-gray-500">Provide accurate details to help us match you with the right students.</p>
          </header>

          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-10 space-y-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Subjects You Can Teach</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subjectsList.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      formData.subjects?.includes(subject)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. Ikeja, Lagos"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Hourly Rate (₦)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    value={formData.pricing || ''}
                    onChange={(e) => setFormData({...formData, pricing: Number(e.target.value)})}
                    placeholder="e.g. 5000"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Experience Level</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 appearance-none"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  {['male', 'female'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({...formData, gender: g as 'male' | 'female'})}
                      className={`py-4 rounded-2xl text-sm font-bold capitalize transition-all ${
                        formData.gender === g
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Professional Bio</label>
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Tell us about your teaching style and academic background..."
                rows={5}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Save and Submit for Review
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TutorProfileSetup;
