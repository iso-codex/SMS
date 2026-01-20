import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, DollarSign, CheckCircle, AlertCircle, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Toast, { useToast } from '../shared/Toast';
import Modal from '../shared/Modal';

const Fees = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, paid, owing
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [updating, setUpdating] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    classes:class_id (
                        id,
                        name,
                        grade_level,
                        fee
                    )
                `)
                .eq('role', 'student')
                .order('full_name');

            if (error) throw error;
            setStudents(data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            showToast('Failed to load student fees', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePayment = async (e) => {
        e.preventDefault();
        if (!selectedStudent) return;

        setUpdating(true);
        try {
            const { error } = await supabase
                .from('users')
                .update({ paid_amount: parseFloat(paymentAmount) })
                .eq('id', selectedStudent.id);

            if (error) throw error;

            showToast('Payment updated successfully', 'success');
            fetchStudents();
            setSelectedStudent(null);
            setPaymentAmount('');
        } catch (error) {
            console.error('Error updating payment:', error);
            showToast('Failed to update payment', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const openPaymentModal = (student) => {
        setSelectedStudent(student);
        setPaymentAmount(student.paid_amount || 0);
    };

    const filteredStudents = students.filter(student => {
        const fee = student.classes?.fee || 0;
        const paid = student.paid_amount || 0;
        const balance = fee - paid;
        const isPaid = balance <= 0;

        const matchesSearch = student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all'
            ? true
            : filterStatus === 'paid' ? isPaid : !isPaid;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fees Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Track student fees, payments, and balances.</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <Search className="text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search student by name or email..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <Filter className="text-slate-400" size={20} />
                    <select
                        className="bg-transparent border-none focus:outline-none text-slate-700 font-medium cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid / Clear</option>
                        <option value="owing">Owing</option>
                    </select>
                </div>
            </div>

            {/* Fees Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Student</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Class</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Total Fee</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Paid</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Balance / Status</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-slate-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        Loading fees data...
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-slate-500 font-medium">
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => {
                                    const fee = student.classes?.fee || 0;
                                    const paid = student.paid_amount || 0;
                                    const balance = fee - paid;
                                    const isPaid = balance <= 0;

                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-6">
                                                <div className="font-bold text-slate-900">{student.full_name}</div>
                                                <div className="text-sm text-slate-500">{student.email}</div>
                                            </td>
                                            <td className="p-6 text-slate-600 font-medium">
                                                {student.classes ? (
                                                    <span>{student.classes.name} <span className="text-slate-400 text-sm">({student.classes.grade_level})</span></span>
                                                ) : <span className="text-slate-400">Not Assigned</span>}
                                            </td>
                                            <td className="p-6 text-slate-900 font-bold">GH₵ {fee.toLocaleString()}</td>
                                            <td className="p-6 text-slate-600 font-medium">GH₵ {paid.toLocaleString()}</td>
                                            <td className="p-6">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${isPaid
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {isPaid ? (
                                                        <>
                                                            <CheckCircle size={14} />
                                                            <span>Paid</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle size={14} />
                                                            <span>Owing GH₵ {balance.toLocaleString()}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button
                                                    onClick={() => openPaymentModal(student)}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium text-sm flex items-center gap-1 ml-auto"
                                                >
                                                    <Edit2 size={16} />
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Payment Modal */}
            <Modal
                isOpen={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
                title="Update Payment Amount"
                size="sm"
            >
                <form onSubmit={handleUpdatePayment} className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-semibold text-slate-700">
                                Total Paid Amount (GH₵)
                            </label>
                            <span className="text-xs font-semibold text-slate-500">
                                Total Fee: GH₵ {selectedStudent?.classes?.fee || 0}
                            </span>
                        </div>
                        <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-bold text-lg"
                            placeholder="0"
                            min="0"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setSelectedStudent(null)}
                            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updating}
                            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {updating ? <Loader2 className="animate-spin" size={20} /> : 'Save Payment'}
                        </button>
                    </div>
                </form>
            </Modal>

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
