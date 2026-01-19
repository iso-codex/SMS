import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-10">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <a href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                S
                            </div>
                            <span className="font-heading text-2xl font-extrabold tracking-tight">SMS</span>
                        </a>
                        <p className="text-slate-500 mb-8 leading-relaxed max-w-sm">
                            The premium school management ecosystem designed for the modern age. Excellence in education via technology.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg transition-all"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="flex flex-col gap-4">
                            {['Home', 'Programs', 'Tutors', 'Resources', 'About'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-slate-500 hover:text-blue-600 flex items-center gap-2 group">
                                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Programs</h4>
                        <ul className="flex flex-col gap-4">
                            {['Cambridge IGCSE', 'A-Levels', 'SAT Prep', 'IELTS Mastery', '11+ Entrance'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-slate-500 hover:text-blue-600">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="flex flex-col gap-6">
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-sm font-semibold">support@sms-edu.com</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Phone</p>
                                    <p className="text-sm font-semibold">+1 (555) 123-4567</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-slate-400 text-sm">
                        © 2026 School Management System (SMS). All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-slate-400 text-sm hover:text-blue-600">Privacy Policy</a>
                        <a href="#" className="text-slate-400 text-sm hover:text-blue-600">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
