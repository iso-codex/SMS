import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = ({ heroImage }) => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-white">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 text-slate-100">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-50/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Text Content */}
                    <div className="flex-[1.2] text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest mb-8"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                            Next-Gen Learning Platform
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl lg:text-[5.5rem] font-extrabold mb-8 leading-[1] tracking-tight text-slate-900"
                        >
                            Excellence in <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                                Digital Education.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
                        >
                            Empowering the next generation with advanced tools, expert tutors, and a curriculum designed for international success.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start"
                        >
                            <Link to="/login" className="btn btn-primary px-10 py-5 text-lg shadow-2xl shadow-blue-500/20">
                                Enroll Today <ArrowRight size={20} className="ml-2" />
                            </Link>
                            <button className="btn btn-outline px-10 py-5 text-lg border-2">
                                Browse Programs
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-center lg:justify-start gap-12"
                        >
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-slate-900">15.4k</span>
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Students</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-slate-900">4.9</span>
                                <span className="flex items-center gap-1 text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" /> Avg Rating
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-slate-900">200+</span>
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Experts</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 p-3 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-2xl shadow-blue-900/10 overflow-hidden ring-1 ring-white/60">
                            <img
                                src={heroImage}
                                alt="Modern Education"
                                className="w-full h-full object-cover rounded-2xl shadow-sm transform hover:scale-105 transition-transform duration-1000"
                            />
                        </div>

                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-4 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl shadow-slate-200/50 z-20 border border-slate-200/60 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Accredited by</p>
                                <p className="font-bold text-slate-900">Global Standards</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-8 -left-8 bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-xl shadow-slate-900/20 z-20 flex items-center gap-4"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-100">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-blue-400 font-bold text-xl">2.4k+</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Active now</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
