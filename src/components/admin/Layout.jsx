import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, BookOpen, Calendar, Settings, LogOut,
    LucideSchool, GraduationCap, Library, UserCircle, ClipboardList,
    Clock, ClipboardCheck, FileText, Bell, Bus, Home as HomeIcon, ChevronDown, ChevronRight,
    Menu, X, Search, ChevronLeft, User
} from 'lucide-react';
import useAuthStore from '../../lib/authStore';
import { supabase } from '../../lib/supabase';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut, user } = useAuthStore();
    const [studentsExpanded, setStudentsExpanded] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
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
        { path: '/admin/fees', label: 'Fees', icon: BookOpen },
        { path: '/admin/accountants', label: 'Accountants', icon: Users },
    ];

    // Filter nav items based on search
    const filteredNavItems = navItems.filter(item => {
        if (searchQuery === '') return true;
        const query = searchQuery.toLowerCase();

        // Check main item
        if (item.label.toLowerCase().includes(query)) return true;

        // Check sub items
        if (item.subItems) {
            return item.subItems.some(sub => sub.label.toLowerCase().includes(query));
        }

        return false;
    });

    // Handle search navigation
    const handleSearchNavigation = (path) => {
        navigate(path);
        setSearchQuery('');
        setMobileMenuOpen(false);
    };

    const isPathActive = (path) => location.pathname === path;
    const isSubItemActive = (subItems) => subItems?.some(item => location.pathname === item.path);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-30 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">
                        <GraduationCap size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">SMS</span>
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
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">
                                <GraduationCap size={20} />
                            </div>
                            <span className="text-xl font-bold tracking-tight">SMS</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden md:flex p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft size={20} className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                    {sidebarCollapsed && (
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold mx-auto">
                            <GraduationCap size={20} />
                        </div>
                    )}
                </div>

                {/* User Profile Section */}
                {!sidebarCollapsed && (
                    <div className="p-4 border-b border-slate-800">
                        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                                {userProfile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {userProfile?.full_name || user?.email?.split('@')[0] || 'Admin'}
                                </p>
                                <p className="text-xs text-slate-400 capitalize">
                                    {userProfile?.role || 'Administrator'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                {!sidebarCollapsed && (
                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search menu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {filteredNavItems.map((item, index) => {
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
                                        title={sidebarCollapsed ? item.label : ''}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={20} />
                                            {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                                        </div>
                                        {!sidebarCollapsed && (studentsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                                    </button>
                                    {studentsExpanded && !sidebarCollapsed && (
                                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-800 pl-4">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    onClick={() => setMobileMenuOpen(false)}
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
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
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

export default AdminLayout;
