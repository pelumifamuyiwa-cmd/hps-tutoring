import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { TutorRequest, TutorProfile, UserProfile } from '../../types';
import Sidebar from '../../components/dashboard/Sidebar';
import { sendNotification } from '../../services/notificationService';
import { 
  CheckCircle, 
  MapPin, 
  BookOpen, 
  Star, 
  Zap, 
  ChevronRight,
  User,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const MatchTutor: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<TutorRequest | null>(null);
  const [tutors, setTutors] = useState<(TutorProfile & { user: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!requestId) return;
      
      try {
        const reqDoc = await getDoc(doc(db, 'requests', requestId));
        if (!reqDoc.exists()) {
          toast.error('Request not found');
          navigate('/admin');
          return;
        }
        const reqData = { id: reqDoc.id, ...reqDoc.data() } as TutorRequest;
        setRequest(reqData);

        // Fetch all approved tutors
        const q = query(collection(db, 'tutors'), where('status', '==', 'approved'));
        const tutorSnapshot = await getDocs(q);
        
        const tutorList = await Promise.all(tutorSnapshot.docs.map(async (tDoc) => {
          const tData = tDoc.data() as TutorProfile;
          const uDoc = await getDoc(doc(db, 'users', tData.uid));
          const uData = uDoc.data() as UserProfile;
          return { ...tData, user: uData };
        }));

        // Smart Matching Logic
        const rankedTutors = tutorList.map(tutor => {
          let score = 0;
          
          // Subject match (required)
          const matchingSubjects = tutor.subjects.filter(s => reqData.subjects.includes(s));
          if (matchingSubjects.length > 0) score += 50 + (matchingSubjects.length * 10);
          else return null; // Must teach at least one subject

          // Location match
          if (tutor.location.toLowerCase().includes(reqData.location.toLowerCase())) score += 30;

          // Gender preference
          if (reqData.genderPreference === 'any' || reqData.genderPreference === tutor.gender) score += 20;

          return { ...tutor, score };
        })
        .filter(t => t !== null)
        .sort((a, b) => (b?.score || 0) - (a?.score || 0)) as (TutorProfile & { user: UserProfile; score: number })[];

        setTutors(rankedTutors);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch data');
      }
    };

    fetchData();
  }, [requestId, navigate]);

  const handleAssign = async (tutorId: string) => {
    if (!request) return;
    
    try {
      await updateDoc(doc(db, 'requests', request.id), {
        status: 'assigned',
        matchedTutorId: tutorId
      });
      
      // Notify Parent
      const parentDoc = await getDoc(doc(db, 'users', request.parentId));
      const parentData = parentDoc.data() as UserProfile;
      await sendNotification({
        userId: request.parentId,
        title: 'Tutor Assigned!',
        message: `We've found a perfect match for ${request.studentName}. Your tutor is ready to start.`,
        type: 'success',
        link: '/parent',
        email: parentData.email
      });

      // Notify Tutor
      const tutorDoc = await getDoc(doc(db, 'users', tutorId));
      const tutorData = tutorDoc.data() as UserProfile;
      await sendNotification({
        userId: tutorId,
        title: 'New Student Assigned!',
        message: `You've been matched with ${request.studentName} for ${request.subjects.join(', ')}.`,
        type: 'success',
        link: '/tutor',
        email: tutorData.email
      });
      
      // Create initial payment (registration fee)
      await addDoc(collection(db, 'payments'), {
        parentId: request.parentId,
        amount: 5000, // Fixed registration fee
        date: new Date().toISOString(),
        status: 'pending',
        type: 'registration',
        requestId: request.id
      });

      toast.success('Tutor assigned successfully!');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign tutor');
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Smart Matcher</h1>
              <p className="text-gray-500">Finding the best academic partner for {request?.studentName}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest mr-2">Status:</span>
              <span className="text-blue-600 font-bold capitalize">{request?.status}</span>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Request Details */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Request Summary</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {request?.subjects.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location</p>
                    <p className="text-sm text-gray-700 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {request?.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Preferences</p>
                    <p className="text-sm text-gray-700">Gender: <span className="capitalize font-bold">{request?.genderPreference}</span></p>
                    <p className="text-sm text-gray-700">Budget: <span className="font-bold">₦{request?.budget.toLocaleString()}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tutor Suggestions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Top Recommendations</h2>
              </div>

              {tutors.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
                  <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No suitable tutors found for this request.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tutors.map((tutor) => (
                    <div key={tutor.uid} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={tutor.user.photoURL || `https://ui-avatars.com/api/?name=${tutor.user.displayName}`} 
                            alt={tutor.user.displayName} 
                            className="h-16 w-16 rounded-2xl ring-4 ring-gray-50"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{tutor.user.displayName}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span className="font-bold text-gray-700 mr-2">4.9</span>
                              <span>• {tutor.experience} experience</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 px-4 py-2 rounded-xl text-center">
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Match Score</p>
                          <p className="text-xl font-extrabold text-blue-600">{(tutor as any).score}%</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Teaching Subjects</p>
                          <div className="flex flex-wrap gap-1">
                            {tutor.subjects.map((s, i) => (
                              <span key={i} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${request?.subjects.includes(s) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location & Pricing</p>
                          <p className="text-xs text-gray-700 flex items-center mb-1">
                            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                            {tutor.location}
                          </p>
                          <p className="text-xs text-gray-700 font-bold">₦{tutor.pricing.toLocaleString()} / session</p>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button className="flex-1 py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all">
                          View Full Profile
                        </button>
                        <button 
                          onClick={() => handleAssign(tutor.uid)}
                          className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center"
                        >
                          Assign Tutor
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MatchTutor;
