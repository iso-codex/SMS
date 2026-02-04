import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { programs } from '../data/programsData';

const DetailedPrograms = () => {
    // Helper for colors
    const getColorClasses = (color) => {
        const colors = {
            emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
            violet: "bg-violet-50 text-violet-600 border-violet-100",
            amber: "bg-amber-50 text-amber-600 border-amber-100",
            cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
            rose: "bg-rose-50 text-rose-600 border-rose-100",
            blue: "bg-blue-50 text-blue-600 border-blue-100",
        };
        return colors[color] || colors.blue;
    };

    return (
        <section className="min-h-screen py-20 bg-slate-50">
            <div className="container">
                <div className="max-w-3xl mb-16">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-block py-1 px-3 rounded-lg bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-4"
                    >
                        Our Curriculum
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6"
                    >
                        Detailed <span className="text-blue-600">Academic Paths</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 font-medium max-w-2xl"
                    >
                        Explore our comprehensive educational programs designed to guide students toward academic excellence and future success.
                    </motion.p>
                </div>

                <div className="flex flex-col gap-12">
                    {programs.map((program, index) => (
                        <motion.div
                            key={program.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-500"
                        >
                            <div className="flex flex-col lg:flex-row gap-10 items-start">
                                {/* Icon Section */}
                                <div className={`w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl ${getColorClasses(program.color)}`}>
                                    <program.icon size={40} strokeWidth={1.5} />
                                </div>

                                {/* Content Section */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <h2 className="text-3xl font-bold text-slate-900">{program.title}</h2>
                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-50 text-slate-600 text-sm font-bold border border-slate-200">
                                            {program.students} Students Enrolled
                                        </span>
                                    </div>

                                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                        {program.extendedDescription}
                                    </p>

                                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                        {program.tags.map((tag) => (
                                            <div key={tag} className="flex items-center gap-3 text-slate-700 font-medium">
                                                <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0" />
                                                {tag}
                                            </div>
                                        ))}
                                    </div>

                                    <button className="btn btn-outline border-slate-200 hover:bg-slate-50 text-slate-900 px-8 py-3 rounded-xl font-bold flex items-center gap-2 group">
                                        View Syllabus <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DetailedPrograms;
