import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import useAuthStore from '../../lib/authStore';

const Account = () => {
    const user = useAuthStore((state) => state.user);
    const [formData, setFormData] = useState({
        fullName: user?.full_name || '',
        email: user?.email || '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle account update
        alert('Account settings updated!');
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 font-medium mt-2">Manage your account information and preferences.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                            {user?.full_name?.[0] || user?.email?.[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black mb-1">{user?.full_name || 'User'}</h2>
                            <p className="text-purple-100 font-medium">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all font-medium"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all font-medium"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="tel"
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all font-medium"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+123 456 7890"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-lg font-black text-slate-900 mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="password"
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all font-medium"
                                        value={formData.currentPassword}
                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="password"
                                            className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all font-medium"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="password"
                                            className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all font-medium"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
                        >
                            <Save size={20} />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Account;
