import React from 'react';
import { Users, GraduationCap, BookOpen, UserCheck } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wide mb-1">{label}</p>
            <h3 className="text-3xl font-black text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
);

const AdminDashboard = () => {
    // Mock data for now, will replace with real data fetching later
    const stats = [
        { label: 'Total Students', value: '1,240', icon: GraduationCap, color: 'bg-blue-600' },
        { label: 'Total Teachers', value: '82', icon: UserCheck, color: 'bg-indigo-600' },
        { label: 'Total Classes', value: '34', icon: Users, color: 'bg-purple-600' },
        { label: 'Total Subjects', value: '12', icon: BookOpen, color: 'bg-pink-600' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 font-medium mt-2">Welcome back to your administration panel.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Mockup */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-start gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                    <span className="font-bold text-slate-500">JD</span>
                                </div>
                                <div>
                                    <p className="text-slate-900 font-bold text-sm">New student enrollment</p>
                                    <p className="text-slate-500 text-xs mt-1">John Doe joined Class 10A</p>
                                    <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-wider">2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-colors text-left group">
                                <Users className="mb-3 text-blue-400 group-hover:text-blue-300 transition-colors" size={24} />
                                <span className="font-bold text-sm block">Add Student</span>
                            </button>
                            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-colors text-left group">
                                <UserCheck className="mb-3 text-indigo-400 group-hover:text-indigo-300 transition-colors" size={24} />
                                <span className="font-bold text-sm block">Add Teacher</span>
                            </button>
                            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-colors text-left group">
                                <BookOpen className="mb-3 text-purple-400 group-hover:text-purple-300 transition-colors" size={24} />
                                <span className="font-bold text-sm block">New Class</span>
                            </button>
                            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-colors text-left group">
                                <BookOpen className="mb-3 text-pink-400 group-hover:text-pink-300 transition-colors" size={24} />
                                <span className="font-bold text-sm block">Reports</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
