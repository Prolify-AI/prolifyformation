"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, CircleCheck as CheckCircle, Clock, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "Prolify made launching my US business seamless. From formation to bank account, everything was handled professionally. I never had to set foot in the US.",
    name: "Elena Martinez",
    title: "Founder",
    company: "MedTech Solutions",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    quote: "The transparency was incredible. I always knew what step we were on and what came next. My LLC was formed in under 2 weeks—faster than I expected.",
    name: "James Wilson",
    title: "CEO",
    company: "Digital Commerce Co",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    quote: "As a first-time founder, I was nervous about US formation. Prolify walked me through every document and deadline. Zero surprises, zero stress.",
    name: "Priya Sharma",
    title: "Founder",
    company: "CloudSync AI",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    quote: "Banking was the hardest part when I tried to do this myself. With Prolify's partner network, I had my account approved in 4 days. Game changer.",
    name: "Ahmed Al-Rashid",
    title: "Founder & CTO",
    company: "Quantum Labs",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % testimonials.length);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="relative mt-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
          Trusted by 5,000+ international founders
        </h2>
        <p className="text-lg text-black/70 tracking-tight font-medium">
          Real stories from founders who launched their US businesses with Prolify
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-600 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transitionDuration: '600ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-full flex-shrink-0 px-4"
            >
              <div className="max-w-3xl mx-auto">
                <div className="bg-[#FFFDF0] border-4 border-black rounded-lg p-8 md:p-12 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <Quote className="absolute top-6 left-6 h-10 w-10 text-[#FFC107]" />

                  <blockquote className="text-xl md:text-2xl font-bold text-black leading-relaxed mb-8 relative z-10">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                    <div>
                      <div className="font-bold text-black">{testimonial.name}</div>
                      <div className="text-sm text-black/70 font-semibold">
                        {testimonial.title}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 border-2 border-black ${
              index === currentIndex
                ? 'w-8 bg-[#FFC107]'
                : 'w-3 bg-white hover:bg-[#FFC107]/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 md:px-8">
        <button
          onClick={() => goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length)}
          className="pointer-events-auto h-10 w-10 rounded-full bg-[#FFC107] border-2 border-black flex items-center justify-center hover:bg-[#FFB300] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          aria-label="Previous testimonial"
        >
          <ArrowRight className="h-4 w-4 rotate-180 text-black" />
        </button>
        <button
          onClick={() => goToSlide((currentIndex + 1) % testimonials.length)}
          className="pointer-events-auto h-10 w-10 rounded-full bg-[#FFC107] border-2 border-black flex items-center justify-center hover:bg-[#FFB300] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          aria-label="Next testimonial"
        >
          <ArrowRight className="h-4 w-4 text-black" />
        </button>
      </div>
    </div>
  );
};

const processSteps = [
  {
    step: "Step 1",
    title: "Quick Application",
    description: "You spend 5 minutes telling us about your business. We check name availability and guide you through entity selection (LLC vs C-Corp).",
    timeline: "15 minutes"
  },
  {
    step: "Step 2",
    title: "Expert Formation",
    description: "Our team files your business with your chosen state, prepares your operating agreement, and activates your registered agent service.",
    timeline: "Average completion: 1-3 days "
  },
  {
    step: "Step 3",
    title: "Federal Documentation",
    description: "We obtain your EIN from the IRS and prepare every document you'll need for banking and operations.",
    timeline: "US residents: 1-2 hours. International: 1-2 days"
  },
  {
    step: "Step 4",
    title: "Banking Access",
    description: "You apply for a US business bank account through our partner network—entirely remotely. Account approval typically takes 3-5 business days.",
    timeline: "3-5 business days"
  },
  {
    step: "Step 5",
    title: "Launch & Grow",
    description: "Your business is formed, your bank account is open, and you're ready to operate. We continue supporting you with bookkeeping, taxes, and compliance.",
    timeline: "Ongoing support"
  }
];

const Features = () => {
    return (
      <section id="features" className="py-12 md:py-32 px-4 relative overflow-hidden bg-[#FFFDF5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black">
                The Prolify Process
              </h2>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xl md:text-3xl font-bold text-black">
                <span className="px-6 py-3 bg-[#FFC107] border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Transparent
                </span>
                <span className="px-6 py-3 bg-[#FFC107] border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Simple
                </span>
                <span className="px-6 py-3 bg-[#FFC107] border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Straightforward
                </span>
              </div>
            </div>

          <div className="relative space-y-6 mb-20 max-w-4xl mx-auto">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-[#FFC107] border-4 border-black flex items-center justify-center text-black font-bold text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      {index + 1}
                    </div>
                  </div>

                  <div className={`relative flex-grow border-4 border-black rounded-lg p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-[#FFF9E0]'}`}>
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-full flex-col items-center z-20">
                        <div className="w-2 h-2 rounded-full bg-[#FFC107] border-2 border-black" />
                        <div className="w-[4px] h-5 bg-gradient-to-b from-[#FFC107] to-[#FFD54F] border-l-2 border-r-2 border-black" />
                        <div className="w-2 h-2 rounded-full bg-[#FFC107] border-2 border-black" />
                      </div>
                    )}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                      <div>
                        <div className="text-xs font-bold text-black uppercase tracking-wider mb-1">
                          {step.step}
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">
                          {step.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-black bg-[#FFC107] px-3 py-1.5 rounded-lg whitespace-nowrap border-2 border-black">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs font-bold">{step.timeline}</span>
                      </div>
                    </div>
                    <p className="text-base text-black/70 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#FFF9E0] border-4 border-black rounded-lg p-8 md:p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="max-w-3xl mx-auto space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-black">
                Timeline Summary
              </h3>
              <p className="text-lg text-black/70 font-medium">
                Total time from application to operating business: <span className="font-bold text-black bg-[#FFC107] px-3 py-1 rounded-lg border-2 border-black">1 week</span>
                <br />
                <span className="text-sm">(varies by location and state processing times)</span>
              </p>

              <div className="pt-4">
                <p className="text-base text-black/70 mb-6 font-medium">
                  <span className="font-bold text-black">No hidden steps.</span> No surprise delays. No confusion about what happens next.
                  Just a clear path from "I want to start a US business" to "I'm doing business in the US."
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-lg transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  Get Started Today
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-black text-black hover:text-white font-bold rounded-lg border-2 border-black transition-all"
                >
                  Talk to Our Team
                </a>
              </div>

              <p className="text-sm text-black/60 pt-2 font-semibold">
                Join hundreds of international founders
              </p>
            </div>
          </div>

          <TestimonialCarousel />
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>
    );
};
    
export default Features;