import React, { useEffect, useState } from 'react';
import {
    BookOpen, CheckCircle, Clock, TrendingUp, Calendar, AlertCircle
} from 'lucide-react';
import useAuthStore from '../../lib/authStore';
import { supabase } from '../../lib/supabase';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const StudentDashboard = () => {
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
            label: 'Homework Pending',
            value: '4',
            icon: BookOpen,
            color: 'bg-orange-500',
            trend: '+2 from last week'
        },
        {
            label: 'Class Attendance',
            value: '92%',
            icon: CheckCircle,
            color: 'bg-emerald-500',
            trend: 'Above average'
        },
        {
            label: 'Reports Due',
            value: '1',
            icon: Clock,
            color: 'bg-blue-500',
            trend: 'Due tomorrow'
        },
        {
            label: 'Avg Performance',
            value: 'A-',
            icon: TrendingUp,
            color: 'bg-purple-500',
            trend: 'Top 10% of class'
        },
    ];

    const performanceData = [
        { month: 'Jan', score: 85 },
        { month: 'Feb', score: 88 },
        { month: 'Mar', score: 92 },
        { month: 'Apr', score: 89 },
        { month: 'May', score: 94 },
    ];

    const upcomingClasses = [
        { subject: 'Mathematics', time: '09:00 AM', room: 'Room 101' },
        { subject: 'Physics', time: '10:30 AM', room: 'Lab 2' },
        { subject: 'English', time: '12:00 PM', room: 'Room 204' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Value Proposition/Welcome */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20">
                <h1 className="text-3xl font-black tracking-tight mb-2">
                    Welcome back, {profile?.full_name || 'Student'}! 👋
                </h1>
                <p className="text-indigo-100 font-medium text-lg opacity-90">
                    You have 4 pending homeworks and 1 upcoming exam this week.
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
                {/* Performance Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Academic Performance</h2>
                        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm font-medium text-slate-600 outline-none">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar
                                    dataKey="score"
                                    fill="#6366f1"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Today's Schedule</h2>
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
                                <div>
                                    <h4 className="font-bold text-slate-800">{cls.subject}</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-1">{cls.room}</p>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors">
                            View Full Routine
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
