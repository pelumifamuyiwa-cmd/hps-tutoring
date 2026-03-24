import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { TutorProfile, Session, TutorRequest } from '../../types';
import Sidebar from '../../components/dashboard/Sidebar';
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  Users, 
  DollarSign, 
  Settings,
  AlertCircle,
  MapPin,
  BookOpen
} from 'lucide-react';
import { format } from 'date-fns';

const TutorDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [requests, setRequests] = useState<TutorRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubTutor = onSnapshot(doc(db, 'tutors', user.uid), (doc) => {
      if (doc.exists()) {
        setTutorProfile(doc.data() as TutorProfile);
      }
    });

    const qSessions = query(
      collection(db, 'sessions'), 
      where('tutorId', '==', user.uid),
      orderBy('startTime', 'asc')
    );

    const qRequests = query(
      collection(db, 'requests'), 
      where('matchedTutorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubSessions = onSnapshot(qSessions, (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session)));
    });

    const unsubRequests = onSnapshot(qRequests, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TutorRequest)));
      setLoading(false);
    });

    return () => {
      unsubTutor();
      unsubSessions();
      unsubRequests();
    };
  }, [user]);

  const handleCompleteSession = async (sessionId: string) => {
    await updateDoc(doc(db, 'sessions', sessionId), { status: 'completed' });
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
      <Sidebar role="tutor" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tutor Dashboard</h1>
            <p className="text-gray-500">Manage your teaching schedule and earnings</p>
          </div>
          <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`h-3 w-3 rounded-full ${tutorProfile?.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-bold text-gray-700 capitalize">Status: {tutorProfile?.status}</span>
          </div>
        </header>

        {tutorProfile?.status === 'pending' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-2xl mb-10 flex items-start space-x-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-yellow-800">Profile Under Review</h3>
              <p className="text-yellow-700">Our admin team is currently reviewing your profile. You'll be notified via email once you're approved to start matching with clients.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Grid */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Clients</span>
                </div>
                <p className="text-4xl font-extrabold text-gray-900">{requests.length}</p>
                <p className="text-sm text-gray-500 mt-2">Currently assigned</p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Earnings</span>
                </div>
                <p className="text-4xl font-extrabold text-gray-900">₦0</p>
                <p className="text-sm text-gray-500 mt-2">Paid this month</p>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
                <Link to="/tutor/schedule" className="text-sm font-bold text-blue-600 hover:underline">View all</Link>
              </div>
              
              {sessions.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                  <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No sessions scheduled.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-50 p-3 rounded-2xl text-gray-400">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{format(new Date(session.startTime), 'EEEE, MMM d')}</p>
                          <p className="text-sm text-gray-500">{format(new Date(session.startTime), 'h:mm a')} - {format(new Date(session.endTime), 'h:mm a')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {session.status}
                        </span>
                        {session.status === 'scheduled' && (
                          <button 
                            onClick={() => handleCompleteSession(session.id)}
                            className="text-sm font-bold text-blue-600 hover:text-blue-700"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Profile Summary Sidebar */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
                <Link to="/tutor/profile" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Settings className="h-5 w-5" />
                </Link>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {tutorProfile?.subjects.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{s}</span>
                    ))}
                    {(!tutorProfile?.subjects || tutorProfile.subjects.length === 0) && (
                      <p className="text-sm text-gray-400 italic">No subjects added</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location</p>
                  <div className="flex items-center text-sm text-gray-700">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{tutorProfile?.location || 'Not set'}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Experience</p>
                  <div className="flex items-center text-sm text-gray-700">
                    <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{tutorProfile?.experience || 'Not set'}</span>
                  </div>
                </div>

                <Link to="/tutor/profile" className="block w-full text-center py-3 mt-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md">
                  Update Profile
                </Link>
              </div>
            </section>

            <section className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-xl">
              <h3 className="text-xl font-bold mb-4">Tutor Guidelines</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Always confirm sessions 24h in advance.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Submit session notes after each class.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Payments are processed every Friday.</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TutorDashboard;
