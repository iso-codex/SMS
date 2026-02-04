import React, { useEffect, useState } from 'react';
import {
    Users, BookOpen, Clock, Calendar, Bell, CheckCircle, Plus, Mail, FileText, BarChart2
} from 'lucide-react';
import useAuthStore from '../../lib/authStore';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        classes: 0,
        students: 0,
        assignments: 0,
        unread: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id) return;

            try {
                // 1. Fetch Profile
                const { data: profileData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(profileData);

                // 2. Fetch Classes Count
                const { data: classesData, count: classesCount } = await supabase
                    .from('classes')
                    .select('id', { count: 'exact' })
                    .eq('teacher_id', user.id);

                // 3. Fetch Students Count (Total students in my assigned classes)
                let studentsCount = 0;
                if (classesData && classesData.length > 0) {
                    const classIds = classesData.map(c => c.id);
                    const { count } = await supabase
                        .from('users')
                        .select('id', { count: 'exact', head: true })
                        .in('class_id', classIds)
                        .eq('role', 'student');
                    studentsCount = count || 0;
                }

                setStats({
                    classes: classesCount || 0,
                    students: studentsCount,
                    assignments: 0, // Mock for now
                    unread: 0 // Mock for now
                });

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.id]);

    // Format Date
    const today = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', dateOptions);
    const hour = today.getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    // Mock Schedule Data (To be replaced with real routine fetch later)
    const schedule = [
        { time: '09:00 - 10:00', subject: 'Mathematics', class: 'Class 10-A', room: 'Room 101' },
        { time: '10:30 - 11:30', subject: 'Physics', class: 'Class 9-B', room: 'Lab 2' },
        { time: '13:00 - 14:00', subject: 'Mathematics', class: 'Class 11-C', room: 'Room 204' },
    ];

    const tasks = [
        { title: 'Grade Math Assignments', due: 'Tomorrow', priority: 'High' },
        { title: 'Submit Lesson Plan', due: 'Fri, 12th', priority: 'Medium' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] p-8 md:p-10 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 mix-blend-overlay" />
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                        <div>
                            <p className="text-indigo-100 font-bold mb-2 uppercase tracking-wide text-xs">{formattedDate}</p>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                {greeting}, {profile?.full_name?.split(' ')[0] || 'Teacher'}! 👋
                            </h1>
                            <p className="text-indigo-100 mt-2 font-medium max-w-xl text-lg">
                                You have <span className="text-white font-bold underline decoration-indigo-400 decoration-2 underline-offset-2">{schedule.length} classes</span> today. Let's make it a productive day!
                            </p>
                        </div>
                        {/* Term Indicator */}
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                            <span className="text-xs font-bold text-indigo-100 block">Current Term</span>
                            <span className="text-lg font-black text-white">Term 1 - 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Total Students', value: stats.students, icon: Users, bg: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
                    { label: 'My Classes', value: stats.classes, icon: BookOpen, bg: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
                    { label: 'Pending Grading', value: stats.assignments, icon: FileText, bg: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
                    { label: 'Unread Messages', value: stats.unread, icon: Mail, bg: 'bg-rose-50 text-rose-600', border: 'border-rose-100' }
                ].map((stat, i) => (
                    <div key={i} className={`p-6 bg-white rounded-3xl border ${stat.border} shadow-sm hover:shadow-md transition-shadow group`}>
                        <div className="flex items-center gap-4 mb-3">
                            <div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={22} />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                        <p className="text-sm font-bold text-slate-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column: Schedule & Tasks */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Today's Schedule */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Calendar className="text-indigo-500" size={24} />
                                Today's Schedule
                            </h2>
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View Full</button>
                        </div>
                        <div className="p-6 space-y-4">
                            {schedule.map((cls, idx) => (
                                <div key={idx} className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 transition-colors">
                                    <div className="w-full md:w-32 bg-white rounded-xl p-3 border border-slate-200 shadow-sm text-center shrink-0">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cls.time.split(' - ')[0]}</div>
                                        <div className="h-0.5 w-8 bg-slate-100 mx-auto my-1"></div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cls.time.split(' - ')[1]}</div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-slate-900">{cls.subject}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">{cls.class}</span>
                                            <span className="text-xs font-bold text-slate-400">•</span>
                                            <span className="text-xs font-bold text-slate-500">{cls.room}</span>
                                        </div>
                                    </div>
                                    <button className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        Start Class
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Tasks */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
                        <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                            <CheckCircle className="text-emerald-500" size={24} />
                            Priority Tasks
                        </h2>
                        <div className="space-y-4">
                            {tasks.map((task, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                                    <div className={`w-3 h-3 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800">{task.title}</p>
                                        <p className="text-xs font-semibold text-slate-400">Due: {task.due}</p>
                                    </div>
                                    <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                                        <CheckCircle size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column: Quick Actions & Activity */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/20">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Clock size={20} className="text-indigo-400" />
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/teacher/attendance" className="p-4 bg-white/10 hover:bg-white/20 rounded-xl text-center transition-colors backdrop-blur-sm border border-white/5">
                                <Users size={24} className="mx-auto mb-2 text-indigo-300" />
                                <span className="text-xs font-bold block">Attendance</span>
                            </Link>
                            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl text-center transition-colors backdrop-blur-sm border border-white/5">
                                <Plus size={24} className="mx-auto mb-2 text-emerald-300" />
                                <span className="text-xs font-bold block">Assignment</span>
                            </button>
                            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl text-center transition-colors backdrop-blur-sm border border-white/5">
                                <BarChart2 size={24} className="mx-auto mb-2 text-amber-300" />
                                <span className="text-xs font-bold block">Grades</span>
                            </button>
                            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl text-center transition-colors backdrop-blur-sm border border-white/5">
                                <Mail size={24} className="mx-auto mb-2 text-rose-300" />
                                <span className="text-xs font-bold block">Message</span>
                            </button>
                        </div>
                    </div>

                    {/* Notice Board */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                            <Bell size={20} className="text-amber-500" />
                            Notice Board
                        </h3>
                        <div className="space-y-4 relative">
                            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                            {[
                                { title: 'Staff Meeting', time: '10:00 AM', desc: 'Main Hall', color: 'bg-amber-400' },
                                { title: 'Exam Schedule', time: '2:00 PM', desc: 'Released for Term 1', color: 'bg-blue-400' }
                            ].map((item, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className={`absolute left-2 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${item.color}`} />
                                    <p className="text-xs font-bold text-slate-400 mb-0.5">{item.time}</p>
                                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
