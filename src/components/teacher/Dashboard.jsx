import React, { useEffect, useState } from 'react';
import {
    Users, BookOpen, Clock, Calendar, Bell, CheckCircle
} from 'lucide-react';
import useAuthStore from '../../lib/authStore';
import { supabase } from '../../lib/supabase';

const TeacherDashboard = () => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.id) {
                const { data } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(data);
            }
        };
        fetchProfile();
    }, [user]);

    const stats = [
        {
            label: 'Total Classes',
            value: '5',
            icon: BookOpen,
            color: 'bg-blue-500',
            trend: 'Active'
        },
        {
            label: 'Total Students',
            value: '142',
            icon: Users,
            color: 'bg-indigo-500',
            trend: 'This Semester'
        },
        {
            label: 'Upcoming Exams',
            value: '3',
            icon: Clock,
            color: 'bg-orange-500',
            trend: 'This Week'
        },
        {
            label: 'Notices',
            value: '2',
            icon: Bell,
            color: 'bg-red-500',
            trend: 'Unread'
        },
    ];

    const upcomingClasses = [
        { class: 'Class 10-A', subject: 'Mathematics', time: '09:00 AM', room: 'Room 101' },
        { class: 'Class 9-B', subject: 'Physics', time: '10:30 AM', room: 'Lab 2' },
        { class: 'Class 11-C', subject: 'Mathematics', time: '01:00 PM', room: 'Room 204' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Value Proposition/Welcome */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20">
                <h1 className="text-3xl font-black tracking-tight mb-2">
                    Welcome, {profile?.full_name || 'Teacher'}! 👋
                </h1>
                <p className="text-blue-100 font-medium text-lg opacity-90">
                    You have 3 classes and 1 exam scheduled for today.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg shadow-opacity-20`}>
                                    <Icon size={24} />
                                </div>
                                <span className="text-xs font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded-lg">
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-slate-500 font-medium text-sm">{stat.label}</h3>
                            <p className="text-3xl font-black text-slate-800 mt-1">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Classes */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Today's Classes</h2>
                        <div className="p-2 bg-slate-50 rounded-lg">
                            <Calendar size={20} className="text-slate-400" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {upcomingClasses.map((cls, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <span className="text-xs font-bold text-slate-400 leading-none">{cls.time.split(' ')[1]}</span>
                                    <span className="text-sm font-black text-slate-700 leading-none mt-0.5">{cls.time.split(' ')[0]}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-bold text-slate-800">{cls.subject}</h4>
                                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">{cls.class}</span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-500 mt-1">{cls.room}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notices / Quick Actions */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Latest Notices</h2>
                        <Bell size={20} className="text-slate-400" />
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                            <h4 className="font-bold text-yellow-800 text-sm mb-1">Staff Meeting</h4>
                            <p className="text-xs text-yellow-700">10:00 AM Today - Main Hall</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 text-sm mb-1">Exam Schedule Released</h4>
                            <p className="text-xs text-blue-700">Check the exams tab for details.</p>
                        </div>
                        <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors">
                            View All Notices
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
