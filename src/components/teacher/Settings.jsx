import React, { useState } from 'react';
import { Lock, Save, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const TeacherSettings = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (passwords.newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.newPassword
            });

            if (error) throw error;
            setSuccess(true);
            setPasswords({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-500 font-medium mt-2">Manage your account preferences and security.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Security</h2>
                        <p className="text-slate-500 text-sm">Update your password to keep your account safe.</p>
                    </div>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 font-medium border border-green-100">
                        <CheckCircle size={20} />
                        Password updated successfully!
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                        <input
                            type="password"
                            required
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium"
                            placeholder="Repeat new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                <Save size={20} />
                                Update Password
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeacherSettings;
