import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Create Your Store',
    description: 'Answer a few questions and your store is live. Add products with photos, prices, and descriptions in seconds.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
  },
  {
    number: '02',
    title: 'Chat & Sell',
    description: 'Customers browse your store and start a conversation. Answer questions, share products, and build relationships.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    ),
  },
  {
    number: '03',
    title: 'Pay in Chat',
    description: 'Customers pay directly inside the chat. No redirects, no external apps. Order confirmed instantly.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    ),
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 md:py-28 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-semibold mb-4">
            How It Works
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Three Steps. Zero Friction.
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Whether you're selling or buying, everything happens in one seamless flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {steps.map((step) => (
            <div key={step.number} className="group relative p-8 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300 bg-white">
              {/* Step number */}
              <div className="text-7xl font-black text-gray-50 absolute top-4 right-6 group-hover:text-primary/5 transition-colors">
                {step.number}
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/5 group-hover:bg-primary text-primary group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
