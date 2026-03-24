import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { TutorRequest, Session, Payment } from '../../types';
import Sidebar from '../../components/dashboard/Sidebar';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  CreditCard, 
  User, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TutorRequest[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const qRequests = query(
      collection(db, 'requests'), 
      where('parentId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const qSessions = query(
      collection(db, 'sessions'), 
      where('parentId', '==', user.uid),
      orderBy('startTime', 'asc')
    );
    const qPayments = query(
      collection(db, 'payments'), 
      where('parentId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubRequests = onSnapshot(qRequests, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TutorRequest)));
    });

    const unsubSessions = onSnapshot(qSessions, (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session)));
    });

    const unsubPayments = onSnapshot(qPayments, (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment)));
      setLoading(false);
    });

    return () => {
      unsubRequests();
      unsubSessions();
      unsubPayments();
    };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'matching': return 'bg-blue-100 text-blue-700';
      case 'assigned': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="parent" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Parent Dashboard</h1>
            <p className="text-gray-500">Manage your child's learning journey</p>
          </div>
          <Link 
            to="/parent/request" 
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
          >
            <Plus className="h-5 w-5" />
            <span>New Tutor Request</span>
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Requests */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Active Requests</h2>
                <Link to="/parent/requests" className="text-sm font-bold text-blue-600 hover:underline">View all</Link>
              </div>
              
              {requests.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No active requests found.</p>
                  <Link to="/parent/request" className="text-blue-600 font-bold mt-2 inline-block">Submit your first request</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {requests.slice(0, 3).map((req) => (
                    <div key={req.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{req.studentName}</h3>
                          <p className="text-sm text-gray-500">{req.subjects.join(', ')}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Submitted {format(new Date(req.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                        {req.status === 'assigned' && (
                          <Link to={`/parent/tutor/${req.matchedTutorId}`} className="text-blue-600 font-bold flex items-center">
                            View Tutor <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Upcoming Sessions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
                <Link to="/parent/schedule" className="text-sm font-bold text-blue-600 hover:underline">Full schedule</Link>
              </div>
              
              {sessions.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                  <p className="text-gray-500 font-medium">No sessions scheduled yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center space-x-4">
                      <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{format(new Date(session.startTime), 'EEEE, MMM d')}</p>
                        <p className="text-sm text-gray-500">{format(new Date(session.startTime), 'h:mm a')} - {format(new Date(session.endTime), 'h:mm a')}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase">
                        {session.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Payment Summary */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Payments</h2>
                <CreditCard className="h-6 w-6 text-gray-400" />
              </div>
              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                <p className="text-3xl font-extrabold text-gray-900">₦{payments.reduce((acc, p) => acc + (p.status === 'paid' ? p.amount : 0), 0).toLocaleString()}</p>
              </div>
              <div className="space-y-4">
                {payments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-gray-900 capitalize">{payment.type}</p>
                      <p className="text-gray-500">{format(new Date(payment.date), 'MMM d')}</p>
                    </div>
                    <p className={`font-bold ${payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      ₦{payment.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <Link to="/parent/payments" className="block w-full text-center py-3 mt-8 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all">
                View All History
              </Link>
            </section>

            {/* Support Card */}
            <section className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Our support team is available 24/7 to help you with matching, scheduling, or payments.
              </p>
              <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all">
                Chat with Admin
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
