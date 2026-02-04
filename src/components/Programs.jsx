import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { programs } from '../data/programsData';

const Programs = () => {
    // Helper for colors
    const getColorClasses = (color) => {
        const colors = {
            emerald: "bg-emerald-50 text-emerald-600",
            violet: "bg-violet-50 text-violet-600",
            amber: "bg-amber-50 text-amber-600",
            cyan: "bg-cyan-50 text-cyan-600",
            rose: "bg-rose-50 text-rose-600",
            blue: "bg-blue-50 text-blue-600",
            slate: "bg-slate-50 text-slate-600",
            indigo: "bg-indigo-50 text-indigo-600",
        };
        return colors[color] || colors.blue;
    };

    return (
        <section id="programs" className="section-padding bg-slate-50">
            <div className="container">
                <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-6"
                        >
                            <span className="w-10 h-px bg-blue-600" /> Professional Paths
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight"
                        >
                            Academic <br />
                            <span className="text-blue-600">Specializations.</span>
                        </motion.h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {programs.map((program, index) => (
                        <motion.div
                            key={program.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: program.delay }}
                            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getColorClasses(program.color)}`}>
                                    <program.icon size={28} strokeWidth={1.5} />
                                </div>
                                <span className="text-xs font-bold text-slate-400 mt-2">
                                    {program.students} students
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3">{program.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                                {program.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {program.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-md bg-sky-50 text-sky-700 text-[11px] font-bold">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors group/link">
                                Explore Program
                                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                            </a>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="btn btn-outline rounded-full px-8 py-4 border-slate-200 text-slate-600 hover:text-slate-900 font-bold flex items-center gap-2 mx-auto bg-white">
                        View All Programs <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Programs;
