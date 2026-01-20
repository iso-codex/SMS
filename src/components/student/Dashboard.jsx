import React from 'react';
import useAuthStore from '../../lib/authStore';

const StudentDashboard = () => {
    const { user, profile, signOut } = useAuthStore();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <button
                    onClick={signOut}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-bold"
                >
                    Sign Out
                </button>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold mb-4">Welcome, {profile?.full_name || user?.email}!</h2>
                <p className="text-slate-500">
                    This is your dashboard. Your class details and schedule will appear here.
                </p>
                <div className="mt-4 p-4 bg-purple-50 rounded-xl text-purple-700 font-medium">
                    You have successfully set your password and logged in.
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
