import React, { useState, useEffect } from 'react';
import { Search, Plus, CreditCard, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../shared/Toast';
import Modal from '../../shared/Modal';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { showToast } = useToast();

    // Payment Form
    const [searchInvoice, setSearchInvoice] = useState('');
    const [foundInvoice, setFoundInvoice] = useState(null);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('cash');
    const [refNum, setRefNum] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('payments')
            .select(`
                *,
                invoice:invoice_id(
                    invoice_number,
                    student:student_id(full_name)
                )
            `)
            .order('payment_date', { ascending: false });

        if (!error) setPayments(data || []);
        setLoading(false);
    };

    const handleSearchInvoice = async () => {
        if (!searchInvoice) return;

        setSubmitting(true);
        // Find invoice by number or exact student name (simplified to number for now or student name search)
        // For simplicity, let's assume search by Invoice Number
        const { data, error } = await supabase
            .from('invoices')
            .select(`*, student:student_id(full_name, email)`)
            .ilike('invoice_number', `%${searchInvoice}%`)
            .limit(1)
            .maybeSingle();

        setSubmitting(false);

        if (error || !data) {
            showToast('Invoice not found', 'error');
            setFoundInvoice(null);
            return;
        }
        setFoundInvoice(data);
    };

    const handleRecordPayment = async () => {
        if (!foundInvoice || !amount) return showToast('Please complete all fields', 'error');

        const payAmount = parseFloat(amount);
        const newPaidTotal = (foundInvoice.paid_amount || 0) + payAmount;

        if (newPaidTotal > foundInvoice.total_amount) {
            return showToast('Amount exceeds remaining balance', 'error');
        }

        setSubmitting(true);
        try {
            // 1. Record Payment
            const { error: payError } = await supabase.from('payments').insert([{
                invoice_id: foundInvoice.id,
                amount: payAmount,
                method,
                reference_number: refNum,
                recorded_by: (await supabase.auth.getUser()).data.user?.id
            }]);

            if (payError) throw payError;

            // 2. Update Invoice
            const newStatus = newPaidTotal >= foundInvoice.total_amount ? 'paid' : 'partial';
            const { error: invError } = await supabase
                .from('invoices')
                .update({
                    paid_amount: newPaidTotal,
                    status: newStatus
                })
                .eq('id', foundInvoice.id);

            if (invError) throw invError;

            // 3. Update User paid_amount (Legacy support if needed, or for quick dashboard stats)
            // Ideally we move away from this, but to keep 'Fees.jsx' overview working if we kept it:
            // await supabase.rpc('increment_user_paid', { uid: foundInvoice.student_id, amt: payAmount }); 
            // Skipping legacy update for now as we are moving to new system.

            showToast('Payment recorded successfully', 'success');
            setShowModal(false);
            setFoundInvoice(null);
            setAmount('');
            setSearchInvoice('');
            fetchPayments();

        } catch (error) {
            showToast('Failed to record payment', 'error');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 text-lg">Recent Payments</h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
                >
                    <Plus size={18} /> Record Payment
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <th className="p-4 rounded-l-xl">Ref # / Date</th>
                            <th className="p-4">Student / Invoice</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Method</th>
                            <th className="p-4 rounded-r-xl">Recorded By</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-purple-600" /></td></tr>
                        ) : payments.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-400">No payment records found.</td></tr>
                        ) : (
                            payments.map(pay => (
                                <tr key={pay.id} className="hover:bg-slate-50/50">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-700">{pay.reference_number || '-'}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <Calendar size={10} /> {new Date(pay.payment_date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900">{pay.invoice?.student?.full_name}</div>
                                        <div className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded inline-block mt-1">
                                            {pay.invoice?.invoice_number}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-slate-900">GH₵ {pay.amount}</td>
                                    <td className="p-4 capitalize text-sm text-slate-600">{pay.method?.replace('_', ' ')}</td>
                                    <td className="p-4 text-xs text-slate-500">Admin</td> {/* Joined user name would go here */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Record Payment"
                size="md"
            >
                {!foundInvoice ? (
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">Find Invoice</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchInvoice}
                                onChange={(e) => setSearchInvoice(e.target.value)}
                                placeholder="Enter Invoice Number"
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none"
                            />
                            <button
                                onClick={handleSearchInvoice}
                                disabled={submitting}
                                className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-500">Student</span>
                                <span className="font-bold text-slate-900">{foundInvoice.student?.full_name}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-500">Invoice Total</span>
                                <span className="font-bold text-slate-900">GH₵ {foundInvoice.total_amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Balance Due</span>
                                <span className="font-bold text-red-600">GH₵ {foundInvoice.total_amount - (foundInvoice.paid_amount || 0)}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Amount (GH₵)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-purple-600"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Method</label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="mobile_money">Mobile Money</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="online">Online</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Reference No.</label>
                                <input
                                    type="text"
                                    value={refNum}
                                    onChange={(e) => setRefNum(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setFoundInvoice(null)}
                                className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleRecordPayment}
                                disabled={submitting}
                                className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {submitting && <Loader2 className="animate-spin" size={16} />}
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Payments;
