import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, LogOut, LucideSchool, ClipboardList, Settings,
    Menu, X, GraduationCap, ChevronLeft, UserCircle, Calendar, FileText, BookOpen, Mail, Book, AlertTriangle, Activity
} from 'lucide-react';
import useAuthStore from '../../lib/authStore';
import { supabase } from '../../lib/supabase';

const TeacherLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut, user } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user?.id) {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (!error && data) {
                    setUserProfile(data);
                }
            }
        };
        fetchUserProfile();
    }, [user]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        signOut();
        navigate('/');
    };

    const navItems = [
        { path: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/teacher/classes', label: 'My Classes', icon: LucideSchool },
        { path: '/teacher/assignments', label: 'Assignments', icon: FileText },
        { path: '/teacher/gradebook', label: 'Gradebook', icon: BookOpen },
        { path: '/teacher/messages', label: 'Messages', icon: Mail },
        { path: '/teacher/assessments', label: 'Assessments', icon: ClipboardList },
        { path: '/teacher/lessons', label: 'Lesson Plans', icon: Book },
        { path: '/teacher/behavior', label: 'Behavior', icon: AlertTriangle },
        { path: '/teacher/reports', label: 'Reports', icon: Activity },
        { path: '/teacher/attendance', label: 'Attendance', icon: Calendar },
        { path: '/teacher/settings', label: 'Settings', icon: Settings },
    ];

    const isPathActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-30 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
                        <GraduationCap size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">Teacher Portal</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white fixed h-full z-50 flex flex-col overflow-y-auto transition-all duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    {!sidebarCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
                                <GraduationCap size={20} />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Portal</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden md:flex p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft size={20} className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                    {sidebarCollapsed && (
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold mx-auto">
                            <GraduationCap size={20} />
                        </div>
                    )}
                </div>

                {/* User Profile Section */}
                {!sidebarCollapsed && (
                    <div className="p-4 border-b border-slate-800">
                        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                {userProfile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'T'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {userProfile?.full_name || user?.email?.split('@')[0] || 'Teacher'}
                                </p>
                                <p className="text-xs text-slate-400 capitalize">
                                    {userProfile?.role || 'Teacher'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isPathActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                                title={sidebarCollapsed ? item.label : ''}
                            >
                                <Icon size={20} />
                                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign Out Button */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleSignOut}
                        className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all ${sidebarCollapsed ? 'justify-center' : ''
                            }`}
                        title={sidebarCollapsed ? 'Sign Out' : ''}
                    >
                        <LogOut size={20} />
                        {!sidebarCollapsed && <span className="font-medium">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} min-h-screen transition-all duration-300 pt-16 md:pt-0`}>
                <Outlet />
            </main>
        </div>
    );
};

export default TeacherLayout;
