import React, { useState } from 'react';
import { LayoutDashboard, Settings, FileText, CreditCard, Percent, PieChart } from 'lucide-react';
import FeeStructure from './fees/FeeStructure';
import Invoices from './fees/Invoices';
import Payments from './fees/Payments';
import Discounts from './fees/Discounts';
import FeeDashboard from './fees/FeeDashboard';
import Toast, { useToast } from '../shared/Toast';

const Fees = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { toast, showToast, hideToast } = useToast();

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
