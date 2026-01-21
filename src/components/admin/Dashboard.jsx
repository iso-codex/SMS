import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const StatCard = ({ label, value, icon: Icon, color, loading }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wide mb-1">{label}</p>
            {loading ? (
                <div className="h-9 w-24 bg-slate-100 animate-pulse rounded-md" />
            ) : (
                <h3 className="text-3xl font-black text-slate-800">{value}</h3>
            )}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState([
        { label: 'Total Students', value: 0, icon: GraduationCap, color: 'bg-blue-600' },
        { label: 'Total Teachers', value: 0, icon: UserCheck, color: 'bg-indigo-600' },
        { label: 'Total Classes', value: 0, icon: Users, color: 'bg-purple-600' },
        { label: 'Total Subjects', value: 0, icon: BookOpen, color: 'bg-pink-600' },
    ]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Counts
            const { count: studentCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'student');

            const { count: teacherCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'teacher');

            const { count: classCount } = await supabase
                .from('classes')
                .select('*', { count: 'exact', head: true });

            const { count: subjectCount } = await supabase
                .from('subjects')
                .select('*', { count: 'exact', head: true });


            setStats([
                { label: 'Total Students', value: studentCount || 0, icon: GraduationCap, color: 'bg-blue-600' },
                { label: 'Total Teachers', value: teacherCount || 0, icon: UserCheck, color: 'bg-indigo-600' },
                { label: 'Total Classes', value: classCount || 0, icon: Users, color: 'bg-purple-600' },
                { label: 'Total Subjects', value: subjectCount || 0, icon: BookOpen, color: 'bg-pink-600' },
            ]);

            // 2. Fetch Recent Activity (New Users)
            const { data: recentUsers, error: activityError } = await supabase
                .from('users')
                .select('id, full_name, role, created_at, email')
                .order('created_at', { ascending: false })
                .limit(5);

            if (activityError) throw activityError;

            setRecentActivity(recentUsers || []);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 font-medium mt-2">Welcome back to your administration panel.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} loading={loading} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-10 text-slate-400">Loading activity...</div>
                        ) : recentActivity.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">No recent activity</div>
                        ) : (
                            recentActivity.map((user, i) => (
                                <div key={user.id} className="flex items-start gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                        <span className="font-bold text-slate-500 text-sm">
                                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-slate-900 font-bold text-sm">
                                            {user.role === 'student' ? 'New student enrollment' :
                                                user.role === 'teacher' ? 'New teacher joined' :
                                                    user.role === 'admin' ? 'New admin added' : 'New user joined'}
                                        </p>
                                        <p className="text-slate-500 text-xs mt-1">
                                            {user.full_name || user.email} joined as {user.role}
                                        </p>
                                        <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-wider">
                                            {getTimeAgo(user.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/admin/students" className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-colors text-left group block">
                                <Users className="mb-3 text-blue-400 group-hover:text-blue-300 transition-colors" size={24} />
                                <span className="font-bold text-sm block">Add Student</span>
                            </Link>
                            <Link to="/admin/teachers" className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-colors text-left group block">
                                <UserCheck className="mb-3 text-indigo-400 group-hover:text-indigo-300 transition-colors" size={24} />
                                <span className="font-bold text-sm block">Add Teacher</span>
                            </Link>
                            <Link to="/admin/class" className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-colors text-left group block">
                                <BookOpen className="mb-3 text-purple-400 group-hover:text-purple-300 transition-colors" size={24} />
                                <span className="font-bold text-sm block">New Class</span>
                            </Link>
                            <Link to="/admin/fees" className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-colors text-left group block">
                                <BookOpen className="mb-3 text-pink-400 group-hover:text-pink-300 transition-colors" size={24} />
                                <span className="font-bold text-sm block">Reports</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
