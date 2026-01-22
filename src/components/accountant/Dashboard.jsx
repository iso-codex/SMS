import React from 'react';
import { Banknote, Users, AlertCircle, TrendingUp } from 'lucide-react';

const AccountantDashboard = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Accountant Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Collections', value: '$124,500', icon: Banknote, color: 'text-green-600', bg: 'bg-green-100' },
                    { label: 'Pending Fees', value: '$45,200', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
                    { label: 'Total Students', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'Monthly Growth', value: '+12%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
                <p>Welcome to the Finance Portal. Select an option from the sidebar to manage fees and payments.</p>
            </div>
        </div>
    );
};

export default AccountantDashboard;
