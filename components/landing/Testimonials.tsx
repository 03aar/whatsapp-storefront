import React, { useState, useEffect, useRef } from 'react';

const testimonials = [
  {
    quote: "ChatMarket completely changed how I sell. My customers love ordering through chat - it feels personal and instant. Revenue went up 40% in the first month.",
    name: 'Priya Sharma',
    role: 'Fashion Store Owner',
    avatar: 'P',
    rating: 5,
  },
  {
    quote: "I switched from Shopify because ChatMarket's chat-first approach is exactly what my audience wants. Setup took literally 2 minutes.",
    name: 'Marcus Johnson',
    role: 'Electronics Seller',
    avatar: 'M',
    rating: 5,
  },
  {
    quote: "As a buyer, I love being able to ask questions and pay in the same conversation. No more abandoned carts - the seller is right there helping you.",
    name: 'Elena Rodriguez',
    role: 'Frequent Buyer',
    avatar: 'E',
    rating: 5,
  },
  {
    quote: "The payment flow inside chat is genius. My customers pay in under 10 seconds. No redirects, no friction, no drop-off.",
    name: 'Arjun Patel',
    role: 'Artisan Coffee Seller',
    avatar: 'A',
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleDot = (i: number) => {
    setActive(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive(prev => (prev + 1) % testimonials.length), 5000);
  };

  return (
    <section ref={ref} className="py-24 sm:py-32 px-4 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-success/5 to-transparent rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            Loved by Sellers & Buyers
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            What People Say
          </h2>
        </div>

        {/* Testimonial card */}
        <div className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm overflow-hidden">
            {/* Large quote mark */}
            <div className="absolute top-6 left-8 text-8xl font-serif text-primary/5 select-none leading-none">"</div>

            <div className="relative z-10">
              {testimonials.map((t, i) => (
                <div key={i} className={`transition-all duration-500 ${i === active ? 'opacity-100 translate-y-0 block' : 'opacity-0 translate-y-4 hidden'}`}>
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>

                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDot(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
