import { useState } from "react";

export default function PublicHome() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="bg-[#FAFAFA] text-black">
      {/* HERO */}
      <section className="h-screen flex items-center justify-center bg-black text-white px-6">
        <div className="max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Find the Perfect Home Tutor for Your Child
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Trusted, vetted tutors across Nigeria for academic excellence.
          </p>
          <div className="flex gap-4">
            <button className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold">
              Request a Tutor
            </button>
            <button className="border border-white px-6 py-3 rounded-xl">
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="py-8 text-center text-gray-600">
        <p>
          Trusted by families across Lagos, Abuja, and Port Harcourt • 500+ Tutors • 98% Satisfaction
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-semibold mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {["Request", "We Match", "Start Learning"].map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-4">0{i + 1}</div>
              <p className="text-lg">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMAGE GRID */}
      <section className="py-20 px-6">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl overflow-hidden" />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white text-center">
        <h2 className="text-4xl mb-6">Get Matched with a Tutor Today</h2>
        <button className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-semibold">
          Request a Tutor
        </button>
      </section>

      {/* WHATSAPP BUTTON */}
      <a
        href="https://wa.me/234XXXXXXXXXX"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg"
      >
        WhatsApp
      </a>

      {/* CHATBOT */}
      <div className="fixed bottom-24 right-6">
        {chatOpen && (
          <div className="w-72 bg-black text-white p-4 rounded-xl shadow-lg mb-2">
            <p className="text-sm">Hi 👋 Ask about pricing, subjects, or tutors.</p>
          </div>
        )}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-yellow-400 text-black px-4 py-3 rounded-full shadow-lg"
        >
          Chat
        </button>
      </div>
    </div>
  );
}
