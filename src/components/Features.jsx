import React from 'react';
import { motion } from 'framer-motion';
import { Video, MessageCircle, UserCheck, BarChart3, Clock, Layout, Brain, FileCheck, Target } from 'lucide-react';

const features = [
    {
        title: "Live & Recorded Classes",
        description: "Interactive live sessions with expert tutors plus on-demand video lessons you can watch anytime.",
        icon: Video,
        color: "blue"
    },
    {
        title: "Past Questions Bank",
        description: "Access thousands of past questions from Cambridge IGCSE, A-Levels, SATs, and WASSCE with solutions.",
        icon: FileCheck,
        color: "purple"
    },
    {
        title: "1-on-1 Tutoring",
        description: "Get personalized attention with private tutoring sessions tailored to your learning pace.",
        icon: UserCheck,
        color: "emerald"
    },
    {
        title: "Progress Tracking",
        description: "Monitor your learning journey with detailed analytics, quiz scores, and performance insights.",
        icon: BarChart3,
        color: "amber"
    },
    {
        title: "Learn at Your Pace",
        description: "Flexible scheduling that fits your life. Study early morning or late night - we're always available.",
        icon: Clock,
        color: "rose"
    },
    {
        title: "Parental Dashboard",
        description: "Parents can track their children's progress, assignments, and communicate with tutors.",
        icon: Layout,
        color: "indigo"
    },
    {
        title: "AI-Powered Learning",
        description: "Smart recommendations and adaptive learning paths based on your strengths and areas for improvement.",
        icon: Brain,
        color: "teal"
    },
    {
        title: "Practice Tests",
        description: "Take unlimited practice tests with instant grading and comprehensive performance reports.",
        icon: Target,
        color: "orange"
    }
];

const Features = () => {
    return (
        <section id="features" className="section-padding">
            <div className="container">
                <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4"
                        >
                            Our ecosystem
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl lg:text-5xl font-extrabold"
                        >
                            Powerful Features for <br /> An <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Enhanced Learning</span> Experience
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-slate-600 max-w-sm font-medium"
                    >
                        We've built everything you need to succeed in one unified platform.
                    </motion.p>
                </div>

                <div className="grid-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500"
                        >
                            <div className="mb-8 relative">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                    <feature.icon size={32} />
                                </div>
                                {/* Decorative background number */}
                                <span className="absolute -top-4 -right-2 text-6xl font-black text-slate-50 -z-10 select-none group-hover:text-blue-50 transition-colors">
                                    0{index + 1}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default Features;
