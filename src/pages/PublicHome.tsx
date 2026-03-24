import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  Users, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Star, 
  ChevronRight, 
  BookOpen, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';

const PublicHome: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                <Zap className="h-3 w-3" />
                <span>Now matching for Summer 2026</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8">
                Expert Tutoring <br />
                <span className="text-blue-600">Tailored to Your Child</span>
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-lg">
                HPS connects parents with the top 1% of tutors in Nigeria. Our smart matching system ensures your child gets the perfect academic partner.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/auth?mode=register&role=parent" 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Request a Tutor
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/auth?mode=register&role=tutor" 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-100 hover:bg-blue-50 transition-all"
                >
                  Join as a Tutor
                </Link>
              </div>
              <div className="mt-12 flex items-center space-x-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      alt="User" 
                      className="h-10 w-10 rounded-full border-2 border-white ring-2 ring-gray-50"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">500+</span> happy parents in Lagos & Abuja
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16 lg:mt-0 relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://picsum.photos/seed/tutoring/800/600" 
                  alt="Tutoring Session" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs hidden sm:block">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Match Found</p>
                    <p className="text-sm font-bold text-gray-900">Mr. Adebayo (Math Expert)</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Matched based on your child's learning style and availability.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">How it works</h2>
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">Everything you need to succeed</p>
            <p className="text-lg text-gray-500">We've built a platform that removes the friction from finding and managing high-quality tutoring.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Smart Matching", 
                desc: "Our algorithm analyzes subjects, location, and personality to find the top 3 tutors for your child.", 
                icon: Zap,
                color: "blue"
              },
              { 
                title: "Secure Portals", 
                desc: "Parents and tutors get dedicated dashboards to track schedules, payments, and progress.", 
                icon: ShieldCheck,
                color: "green"
              },
              { 
                title: "Payment Tracking", 
                desc: "Full transparency on every naira. See payment history and upcoming balances in real-time.", 
                icon: CreditCard,
                color: "purple"
              },
              { 
                title: "Auto Notifications", 
                desc: "Get WhatsApp and email alerts for session confirmations, assignments, and payments.", 
                icon: MessageSquare,
                color: "orange"
              },
              { 
                title: "Expert Network", 
                desc: "Every tutor is vetted for subject mastery and teaching ability before joining HPS.", 
                icon: Users,
                color: "red"
              },
              { 
                title: "Flexible Scheduling", 
                desc: "Manage sessions that fit your family's busy life with our intuitive calendar system.", 
                icon: Calendar,
                color: "indigo"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className={`bg-${feature.color}-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-8`}>
                  <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success-stories" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Success Stories</h2>
              <p className="text-4xl font-extrabold text-gray-900 tracking-tight">Real results from real families</p>
            </div>
            <Link to="/auth?mode=register" className="mt-6 md:mt-0 text-blue-600 font-bold flex items-center hover:underline">
              Join them today <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "HPS transformed my son's attitude towards Mathematics. Within 3 months, his grades moved from C to A. The matching system really works!",
                author: "Mrs. Okonjo",
                role: "Parent in Lekki",
                rating: 5
              },
              {
                quote: "As a tutor, the platform makes my life so easy. I focus on teaching while HPS handles the scheduling and payments. It's professional and reliable.",
                author: "Mr. Emeka",
                role: "Senior Physics Tutor",
                rating: 5
              }
            ].map((story, i) => (
              <div key={i} className="bg-gray-50 p-10 rounded-3xl relative">
                <div className="flex mb-6">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-xl text-gray-700 italic leading-relaxed mb-8">"{story.quote}"</p>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {story.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{story.author}</p>
                    <p className="text-sm text-gray-500">{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">FAQ</h2>
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">Common Questions</p>
          </div>

          <div className="space-y-6">
            {[
              { q: "How do you select your tutors?", a: "We have a rigorous 4-step vetting process including subject tests, teaching demonstrations, background checks, and personality assessments." },
              { q: "How long does it take to find a match?", a: "Typically, our smart matching system identifies the best candidates instantly, and we finalize the assignment within 24-48 hours." },
              { q: "Can I change my tutor if it's not a good fit?", a: "Yes, absolutely. We offer a 'Perfect Match Guarantee'. If you're not satisfied after the first session, we'll find a replacement at no extra cost." },
              { q: "How do payments work?", a: "Payments are made securely through our platform. You can pay via bank transfer or card, and all history is tracked in your portal." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.q}</h3>
                <p className="text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8">
                Ready to start your <br /> child's journey?
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                Join hundreds of families who trust HPS for their academic success. Get matched with an expert tutor today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link 
                  to="/auth?mode=register&role=parent" 
                  className="px-10 py-5 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-lg"
                >
                  Request a Tutor Now
                </Link>
                <Link 
                  to="/auth?mode=register&role=tutor" 
                  className="px-10 py-5 bg-blue-700 text-white font-bold rounded-2xl hover:bg-blue-800 transition-all border border-blue-500"
                >
                  Apply as a Tutor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;
