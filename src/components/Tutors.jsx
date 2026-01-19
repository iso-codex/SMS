import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Award, CheckCircle2 } from 'lucide-react';

const tutors = [
    {
        name: "Dr. Sarah Jenkins",
        subject: "IGCSE Mathematics & Physics",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800",
        rating: 4.9,
        stats: "15+ Years",
        bio: "Former Cambridge curriculum lead with 15 years of classroom experience. Specializing in making quantum physics intuitive and math engaging for Year 10-13 students."
    },
    {
        name: "Prof. Michael Chen",
        subject: "SAT & 11+ Entrance Prep",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800",
        rating: 5.0,
        stats: "98% Pass Rate",
        bio: "A standardized testing specialist who has helped over 500 students achieve top-percentile scores on the SAT and gain admission to elite UK and US institutions."
    },
    {
        name: "Aisha Roberts",
        subject: "IELTS & English Literature",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=800",
        rating: 4.8,
        stats: "Examiner",
        bio: "Senior IELTS examiner and literature scholar. Aisha focuses on precision writing and oratorical confidence to ensure students excel in international language benchmarks."
    }
];

const Tutors = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % tutors.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + tutors.length) % tutors.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="tutors" className="section-padding bg-slate-50 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-900 -mr-20 hidden lg:block skew-x-[-10deg] transform origin-bottom" />

            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                        >
                            <Award size={14} /> Faculty Excellence
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl lg:text-7xl font-extrabold mb-8 tracking-tight text-slate-900 leading-[1.05]"
                        >
                            Learn from <br />
                            <span className="text-blue-600 italic">Industry Experts.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 text-xl mb-12 max-w-lg leading-relaxed font-medium"
                        >
                            Our educators are handpicked for their academic rigor, professional achievements, and passion for student success.
                        </motion.p>

                        <div className="flex gap-4">
                            <button
                                onClick={prevSlide}
                                className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-xl shadow-slate-200/50 group"
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-xl shadow-slate-200/50 group"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-[1.2] w-full relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 1.05, x: -50 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full"
                            >
                                <div className="bg-white rounded-3xl p-3 shadow-2xl shadow-slate-200/50 overflow-hidden border border-white/50 ring-1 ring-slate-100">
                                    <div className="flex flex-col md:flex-row gap-10">
                                        <div className="w-full md:w-1/2 h-[450px]">
                                            <img
                                                src={tutors[currentIndex].image}
                                                alt={tutors[currentIndex].name}
                                                className="w-full h-full object-cover rounded-2xl shadow-sm"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center py-6 pr-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={18}
                                                            className={i < Math.floor(tutors[currentIndex].rating) ? "fill-blue-600 text-blue-600" : "text-slate-200"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xl font-bold text-slate-900">{tutors[currentIndex].rating}</span>
                                            </div>

                                            <h3 className="text-3xl font-black text-slate-900 mb-2 leading-none">{tutors[currentIndex].name}</h3>
                                            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-8">{tutors[currentIndex].subject}</p>

                                            <div className="relative mb-10">
                                                <Quote size={40} className="absolute -top-4 -left-4 text-blue-50 opacity-10 fill-current" />
                                                <p className="text-slate-500 text-lg leading-relaxed relative z-10 font-medium italic">
                                                    "{tutors[currentIndex].bio}"
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-10 border-t border-slate-50 pt-8">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Experience</p>
                                                    <p className="text-xl font-black text-slate-900 italic">{tutors[currentIndex].stats}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 size={24} className="text-emerald-500" />
                                                    <span className="text-sm font-bold text-slate-700">Verified Expert</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Pagination Dots */}
                        <div className="flex justify-start gap-3 mt-10 ml-10">
                            {tutors.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-2 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-12 bg-slate-900' : 'w-2 bg-slate-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Tutors;
