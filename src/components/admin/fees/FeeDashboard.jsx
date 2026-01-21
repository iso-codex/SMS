import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; // Assuming recharts is available or I'll use simple CSS bars

const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
        <div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wide mb-1">{label}</p>
            <h3 className="text-2xl font-black text-slate-800">{value}</h3>
            {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
);

const FeeDashboard = () => {
    const [stats, setStats] = useState({
        totalBilled: 0,
        totalCollected: 0,
        outstanding: 0,
        collectionRate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Fetch all invoices for current academic context (simplified to all for now)
            const { data: invoices } = await supabase.from('invoices').select('total_amount, paid_amount');

            if (invoices) {
                const billed = invoices.reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0);
                const collected = invoices.reduce((sum, inv) => sum + (Number(inv.paid_amount) || 0), 0);
                const outstanding = billed - collected;
                const rate = billed > 0 ? (collected / billed) * 100 : 0;

                setStats({
                    totalBilled: billed,
                    totalCollected: collected,
                    outstanding: outstanding,
                    collectionRate: rate
                });
            }
        } catch (error) {
            console.error('Error fetching fee stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Billed"
                    value={`GH₵ ${stats.totalBilled.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-blue-600"
                />
                <StatCard
                    label="Collected"
                    value={`GH₵ ${stats.totalCollected.toLocaleString()}`}
                    icon={CheckCircle}
                    color="bg-green-600"
                />
                <StatCard
                    label="Outstanding"
                    value={`GH₵ ${stats.outstanding.toLocaleString()}`}
                    icon={AlertCircle}
                    color="bg-red-600"
                    subtext="Pending payments"
                />
                <StatCard
                    label="Collection Rate"
                    value={`${stats.collectionRate.toFixed(1)}%`}
                    icon={TrendingUp}
                    color="bg-purple-600"
                />
            </div>

            {/* Simple Chart / Progress */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Collection Overview</h3>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-green-500 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.collectionRate}%` }}
                    />
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Can add Recent Transactions or Defaulters list here */}
        </div>
    );
};

export default FeeDashboard;
