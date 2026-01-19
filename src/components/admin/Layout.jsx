import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, BookOpen, Calendar, Settings, LogOut,
    LucideSchool, GraduationCap, Library, UserCircle, ClipboardList,
    Clock, ClipboardCheck, FileText, Bell, Bus, Home as HomeIcon, ChevronDown, ChevronRight
} from 'lucide-react';
import useAuthStore from '../../lib/authStore';
import { supabase } from '../../lib/supabase';

const AdminLayout = () => {
    const location = useLocation();
    const signOut = useAuthStore((state) => state.signOut);
    const [studentsExpanded, setStudentsExpanded] = useState(true);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        signOut();
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Home', icon: LayoutDashboard },
        {
            label: 'Students',
            icon: GraduationCap,
            expandable: true,
            subItems: [
                { path: '/admin/students', label: 'All Students' },
                { path: '/admin/student-details', label: 'Student Details' },
            ]
        },
        { path: '/admin/teachers', label: 'Teachers', icon: Users },
        { path: '/admin/library', label: 'Library', icon: Library },
        { path: '/admin/account', label: 'Account', icon: UserCircle },
        { path: '/admin/class', label: 'Class', icon: LucideSchool },
        { path: '/admin/subject', label: 'Subject', icon: BookOpen },
        { path: '/admin/routine', label: 'Routine', icon: Clock },
        { path: '/admin/attendance', label: 'Attendance', icon: ClipboardCheck },
        { path: '/admin/exam', label: 'Exam', icon: ClipboardList },
        { path: '/admin/notice', label: 'Notice', icon: Bell },
        { path: '/admin/transport', label: 'Transport', icon: Bus },
        { path: '/admin/hostel', label: 'Hostel', icon: HomeIcon },
    ];

    const isPathActive = (path) => location.pathname === path;
    const isSubItemActive = (subItems) => subItems?.some(item => location.pathname === item.path);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full z-20 hidden md:flex flex-col overflow-y-auto">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">
                            <GraduationCap size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">SMS</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = item.path ? isPathActive(item.path) : isSubItemActive(item.subItems);

                        if (item.expandable) {
                            return (
                                <div key={index}>
                                    <button
                                        onClick={() => setStudentsExpanded(!studentsExpanded)}
                                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${isActive
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={20} />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        {studentsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </button>
                                    {studentsExpanded && (
                                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-800 pl-4">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    className={`block px-4 py-2 rounded-lg text-sm transition-all ${isPathActive(subItem.path)
                                                            ? 'bg-purple-600/20 text-purple-300 font-medium'
                                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                        }`}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
