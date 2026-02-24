import React, { useEffect, useRef, useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Create Your Store',
    description: 'Answer a few questions and your store is live. Add products with photos, prices, and descriptions in seconds.',
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    color: 'from-primary to-accent',
    accent: '#1A1A2E',
  },
  {
    number: '02',
    title: 'Chat & Sell',
    description: 'Customers browse your store and start a conversation. Answer questions, share products, and build relationships.',
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    color: 'from-accent to-success',
    accent: '#0F3460',
  },
  {
    number: '03',
    title: 'Pay in Chat',
    description: 'Customers pay directly inside the chat. No redirects, no external apps. Order confirmed instantly in the conversation.',
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    color: 'from-success to-success-dark',
    accent: '#00C897',
  },
];

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.step-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          setRevealed(prev => { const n = [...prev]; n[idx] = true; return n; });
        }
      });
    }, { threshold: 0.2 });
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 px-4 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-success/3 to-accent/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-semibold mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-5">
            Three Steps.{' '}
            <span className="gradient-text">Zero Friction.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Whether you're selling or buying, everything happens in one seamless flow.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {steps.map((step, i) => (
            <div
              key={step.number}
              data-index={i}
              className={`step-card group relative p-8 lg:p-10 rounded-2xl border border-gray-100 bg-white transition-all duration-700 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-2 hover:border-gray-200 ${
                revealed[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              {/* Step number watermark */}
              <div className="absolute top-6 right-8 text-8xl font-black text-gray-50 group-hover:text-gray-100 transition-colors select-none pointer-events-none">
                {step.number}
              </div>

              {/* Gradient top bar */}
              <div className={`absolute top-0 left-8 right-8 h-1 bg-gradient-to-r ${step.color} rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>

                <h3 className="text-xl lg:text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>

              {/* Connecting arrow (between cards) */}
              {i < 2 && (
                <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 items-center justify-center text-gray-300 group-hover:text-primary transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
