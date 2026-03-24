import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { TutorRequest, TutorProfile, Payment } from '../../types';
import Sidebar from '../../components/dashboard/Sidebar';
import { 
  Users, 
  MessageSquare, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<TutorRequest[]>([]);
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qRequests = query(collection(db, 'requests'), orderBy('createdAt', 'desc'), limit(10));
    const qTutors = query(collection(db, 'tutors'), limit(10));
    const qPayments = query(collection(db, 'payments'), orderBy('date', 'desc'), limit(10));

    const unsubRequests = onSnapshot(qRequests, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TutorRequest)));
    });

    const unsubTutors = onSnapshot(qTutors, (snapshot) => {
      setTutors(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as unknown as TutorProfile)));
    });

    const unsubPayments = onSnapshot(qPayments, (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment)));
      setLoading(false);
    });

    return () => {
      unsubRequests();
      unsubTutors();
      unsubPayments();
    };
  }, []);

  const stats = [
    { label: 'Total Requests', value: requests.length, icon: MessageSquare, color: 'blue' },
    { label: 'Active Tutors', value: tutors.length, icon: Users, color: 'green' },
    { label: 'Pending Payouts', value: '₦0', icon: Clock, color: 'yellow' },
    { label: 'Monthly Revenue', value: `₦${payments.reduce((acc, p) => acc + (p.status === 'paid' ? p.amount : 0), 0).toLocaleString()}`, icon: TrendingUp, color: 'purple' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Command Center</h1>
            <p className="text-gray-500">Monitor and manage the entire HPS ecosystem</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <button className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-all">
              <Filter className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className={`bg-${stat.color}-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Requests */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Requests</h2>
                <Link to="/admin/requests" className="text-sm font-bold text-blue-600 hover:underline">View all</Link>
              </div>
              
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Subjects</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{req.studentName}</p>
                          <p className="text-xs text-gray-500">{format(new Date(req.createdAt), 'MMM d, yyyy')}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {req.subjects.slice(0, 2).map((s, i) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold">{s}</span>
                            ))}
                            {req.subjects.length > 2 && <span className="text-[10px] text-gray-400">+{req.subjects.length - 2}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                            req.status === 'matching' ? 'bg-blue-100 text-blue-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/admin/requests/${req.id}`} className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center">
                            Match <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">No requests found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Recent Payments */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
                <Link to="/admin/payments" className="text-sm font-bold text-blue-600 hover:underline">View all</Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 capitalize">{payment.type}</p>
                        <p className="text-xs text-gray-500">{format(new Date(payment.date), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <p className="font-extrabold text-gray-900">₦{payment.amount.toLocaleString()}</p>
                  </div>
                ))}
                {payments.length === 0 && (
                  <div className="col-span-2 bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-500 italic">
                    No payments recorded yet.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Tutor Approvals Sidebar */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tutor Approvals</h2>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase">
                  {tutors.filter(t => t.status === 'pending').length} Pending
                </span>
              </div>
              
              <div className="space-y-4">
                {tutors.filter(t => t.status === 'pending').slice(0, 5).map((tutor) => (
                  <div key={tutor.uid} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {tutor.uid[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">New Applicant</p>
                        <p className="text-[10px] text-gray-500">{tutor.location}</p>
                      </div>
                    </div>
                    <Link to={`/admin/tutors/${tutor.uid}`} className="p-2 bg-white rounded-lg shadow-sm hover:bg-blue-50 transition-all">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </Link>
                  </div>
                ))}
                {tutors.filter(t => t.status === 'pending').length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">All tutors reviewed!</p>
                  </div>
                )}
              </div>
              <Link to="/admin/tutors" className="block w-full text-center py-3 mt-6 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all">
                Manage Tutors
              </Link>
            </section>

            {/* Quick Actions */}
            <section className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-lg">
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-blue-700 rounded-2xl hover:bg-blue-800 transition-all flex flex-col items-center justify-center space-y-2">
                  <Plus className="h-5 w-5" />
                  <span className="text-[10px] font-bold uppercase">New Tutor</span>
                </button>
                <button className="p-4 bg-blue-700 rounded-2xl hover:bg-blue-800 transition-all flex flex-col items-center justify-center space-y-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-[10px] font-bold uppercase">Payouts</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export default AdminDashboard;
