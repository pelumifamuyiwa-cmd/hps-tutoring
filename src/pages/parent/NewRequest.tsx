import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/dashboard/Sidebar';
import { sendNotification } from '../../services/notificationService';
import { 
  BookOpen, 
  MapPin, 
  User, 
  DollarSign, 
  Calendar, 
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const NewRequest: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: '',
    subjects: [] as string[],
    location: '',
    genderPreference: 'any',
    budget: 0,
    availability: {} as Record<string, string[]>,
    notes: ''
  });

  const subjectsList = ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Accounting', 'Computer Science'];

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject) 
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      const docRef = await addDoc(collection(db, 'requests'), {
        ...formData,
        parentId: user.uid,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // Notify Admins
      const adminQuery = query(collection(db, 'users'), where('role', '==', 'admin'));
      const adminSnapshot = await getDocs(adminQuery);
      adminSnapshot.forEach(async (adminDoc) => {
        await sendNotification({
          userId: adminDoc.id,
          title: 'New Tutor Request!',
          message: `A new request for ${formData.studentName} has been submitted.`,
          type: 'info',
          link: `/admin/requests/${docRef.id}`,
          email: adminDoc.data().email
        });
      });

      toast.success('Request submitted successfully!');
      navigate('/parent');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit request.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="parent" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">New Tutor Request</h1>
            <p className="text-gray-500">Tell us what your child needs and we'll find the perfect match.</p>
          </header>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > i ? <CheckCircle className="h-4 w-4" /> : i}
                    </div>
                    {i < 3 && <div className={`w-8 h-0.5 mx-2 ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step {step} of 3</span>
            </div>

            <div className="p-10">
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Student's Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={formData.studentName}
                        onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                        placeholder="Enter student name"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Select Subjects</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {subjectsList.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => handleSubjectToggle(subject)}
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            formData.subjects.includes(subject)
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.studentName || formData.subjects.length === 0}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    Next Step
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Location (Lagos/Abuja Area)</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="e.g. Lekki Phase 1, Lagos"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Tutor Gender Preference</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['any', 'male', 'female'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setFormData({...formData, genderPreference: g})}
                          className={`py-3 rounded-xl text-sm font-bold capitalize transition-all ${
                            formData.genderPreference === g
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!formData.location}
                      className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Monthly Budget (₦)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                        type="number" 
                        value={formData.budget || ''}
                        onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                        placeholder="e.g. 50000"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Additional Notes</label>
                    <textarea 
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Any specific requirements or learning goals?"
                      rows={4}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-[2] py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-lg"
                    >
                      Submit Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewRequest;
