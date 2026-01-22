import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, LogOut, Menu, X, Bell,
    Banknote, Users, Settings, UserCircle
} from 'lucide-react';
import useAuthStore from '../../lib/authStore';
import { supabase } from '../../lib/supabase';

const AccountantLayout = () => {
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
        navigate('/login');
    };

    const navItems = [
        { path: '/accountant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/accountant/fees', label: 'Fee Management', icon: Banknote },
        { path: '/accountant/students', label: 'Student Payments', icon: Users },
        { path: '/accountant/settings', label: 'Settings', icon: Settings },
    ];

    const isPathActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <span className="font-bold text-slate-800">Accountant</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${sidebarCollapsed ? 'w-20' : 'w-64'}
            `}>
                <div className={`flex items-center gap-3 px-6 h-20 border-b border-slate-100 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20 shrink-0">
                        {sidebarCollapsed ? 'A' : 'SMS'}
                    </div>
                    {!sidebarCollapsed && (
                        <div>
                            <h1 className="font-bold text-slate-900 leading-none">Accountant</h1>
                            <span className="text-xs text-slate-500 font-medium">Finance Portal</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                setMobileMenuOpen(false);
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isPathActive(item.path)
                                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                ${sidebarCollapsed ? 'justify-center' : ''}
                            `}
                        >
                            <item.icon size={22} className={isPathActive(item.path) ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-100">
                    {!sidebarCollapsed && userProfile && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                                {userProfile.full_name?.[0] || <UserCircle size={24} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{userProfile.full_name}</p>
                                <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleSignOut}
                        className={`
                            w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium
                            ${sidebarCollapsed ? 'justify-center' : ''}
                        `}
                    >
                        <LogOut size={20} />
                        {!sidebarCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-screen pt-16 md:pt-0 overflow-auto">
                <Outlet />
            </main>

            {/* Overlay for mobile */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default AccountantLayout;
