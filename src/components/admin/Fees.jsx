import React, { useState } from 'react';
import { LayoutDashboard, Settings, FileText, CreditCard, Percent, PieChart, Database } from 'lucide-react'; // Added Database icon
import FeeStructure from './fees/FeeStructure';
import Invoices from './fees/Invoices';
import Payments from './fees/Payments';
import Discounts from './fees/Discounts';
import FeeDashboard from './fees/FeeDashboard';
import Toast, { useToast } from '../shared/Toast';
import { supabase } from '../../lib/supabase'; // Import supabase

const Fees = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { toast, showToast, hideToast } = useToast();
    const [seeding, setSeeding] = useState(false);

    const handleSeedData = async () => {
        if (!confirm('Are you sure you want to seed sample data? This helps demonstrate functionality.')) return;
        setSeeding(true);
        try {
            // 1. Insert Fee Types
            const types = [
                { name: 'Tuition Fee', description: 'Standard termly tuition fee', is_active: true },
                { name: 'ICT Fee', description: 'Computer lab access', is_active: true },
                { name: 'PTA Levy', description: 'Parents Association', is_active: true },
                { name: 'Exam Fee', description: 'End of term exams', is_active: true }
            ];

            for (const t of types) {
                const { error } = await supabase.from('fee_types').insert(t).select();
                if (error && error.code !== '23505') console.error('Type error', error); // Ignore duplicates
            }

            // 2. Get Classes and Fee Types
            const { data: classes } = await supabase.from('classes').select('id');
            const { data: feeTypes } = await supabase.from('fee_types').select('id, name');

            if (classes && feeTypes) {
                for (const cls of classes) {
                    for (const ft of feeTypes) {
                        // Check if exists
                        const { data: existing } = await supabase.from('fee_structures')
                            .select('id')
                            .eq('class_id', cls.id)
                            .eq('fee_type_id', ft.id)
                            .eq('term', 'Term 1')
                            .eq('academic_year', '2026');

                        if (!existing?.length) {
                            await supabase.from('fee_structures').insert({
                                class_id: cls.id,
                                fee_type_id: ft.id,
                                amount: ft.name === 'Tuition Fee' ? 1500 : 200,
                                academic_year: '2026',
                                term: 'Term 1',
                                due_date: '2026-03-31'
                            });
                        }
                    }
                }
            }
            showToast('Sample data seeded successfully!', 'success');
        } catch (error) {
            console.error(error);
            showToast('Seeding failed', 'error');
        } finally {
            setSeeding(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <FeeDashboard />;
            case 'structure': return <FeeStructure />;
            case 'invoices': return <Invoices />;
            case 'payments': return <Payments />;
            case 'discounts': return <Discounts />;
            default: return <FeeDashboard />;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage school fees, invoices, payments, and financial reports.</p>
                </div>
                {/* Temporary Seed Button */}
                <button
                    onClick={handleSeedData}
                    disabled={seeding}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm font-bold"
                >
                    <Database size={16} />
                    {seeding ? 'Seeding...' : 'Seed Sample Data'}
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === 'dashboard'
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                >
                    <PieChart size={18} />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('structure')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === 'structure'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                >
                    <Settings size={18} />
                    Fee Structure
                </button>
                <button
                    onClick={() => setActiveTab('invoices')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === 'invoices'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                >
                    <FileText size={18} />
                    Invoices
                </button>
                <button
                    onClick={() => setActiveTab('payments')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === 'payments'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                >
                    <CreditCard size={18} />
                    Payments
                </button>
                <button
                    onClick={() => setActiveTab('discounts')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === 'discounts'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                >
                    <Percent size={18} />
                    Discounts
                </button>
            </div>

            {/* Main Content Area */}
            {renderContent()}

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    );
};

export default Fees;
