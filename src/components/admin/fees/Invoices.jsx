import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, FileText, Download, Loader2, CheckCircle, AlertCircle, Clock, Users, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../shared/Toast';
import Modal from '../../shared/Modal';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const { showToast } = useToast();

    // Generation State
    const [genMode, setGenMode] = useState('class'); // 'class' or 'student'
    const [genClass, setGenClass] = useState('');
    const [genStudent, setGenStudent] = useState(null); // Selected student object
    const [studentSearch, setStudentSearch] = useState(''); // Text input for search
    const [studentSearchResults, setStudentSearchResults] = useState([]);
    const [searchingStudents, setSearchingStudents] = useState(false);

    const [genTerm, setGenTerm] = useState('Term 1');
    const [genYear, setGenYear] = useState(new Date().getFullYear().toString());
    const [genDueDate, setGenDueDate] = useState('');
    const [generating, setGenerating] = useState(false);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        fetchInvoices();
        fetchClasses();
    }, []);

    // Search students when typing
    useEffect(() => {
        if (genMode === 'student' && studentSearch.length > 2) {
            const delaySearch = setTimeout(async () => {
                setSearchingStudents(true);
                const { data } = await supabase
                    .from('users')
                    .select('id, full_name, email, student_code, class_id')
                    .eq('role', 'student')
                    .ilike('full_name', `%${studentSearch}%`)
                    .limit(5);
                setStudentSearchResults(data || []);
                setSearchingStudents(false);
            }, 500);
            return () => clearTimeout(delaySearch);
        } else {
            setStudentSearchResults([]);
        }
    }, [studentSearch, genMode]);

    const fetchClasses = async () => {
        const { data } = await supabase.from('classes').select('id, name, grade_level').order('grade_level');
        setClasses(data || []);
    };

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select(`
                    *,
                    student:student_id(full_name, email, student_code),
                    invoice_items(count)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInvoices(data || []);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            showToast('Failed to load invoices', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateInvoices = async () => {
        if (!genTerm || !genYear || !genDueDate) {
            return showToast('Please fill all required fields', 'error');
        }

        if (genMode === 'class' && !genClass) return showToast('Please select a class', 'error');
        if (genMode === 'student' && !genStudent) return showToast('Please select a student', 'error');

        setGenerating(true);
        try {
            let targetClassId = genMode === 'class' ? genClass : genStudent.class_id;

            // 1. Get Fee Structures for the target class (even for single student, we base it on their class fees)
            const { data: structures, error: structError } = await supabase
                .from('fee_structures')
                .select('*')
                .eq('class_id', targetClassId)
                .eq('term', genTerm)
                .eq('academic_year', genYear);

            if (structError || !structures?.length) {
                // For single student, maybe allow generating empty invoice? For now, enforce structure.
                throw new Error('No fee structures found for the student\'s class and term.');
            }

            // 2. Identify Target Students
            let studentsToProcess = [];
            if (genMode === 'class') {
                const { data: students, error: studentError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('class_id', targetClassId)
                    .eq('role', 'student');

                if (studentError || !students?.length) throw new Error('No students found in this class.');
                studentsToProcess = students;
            } else {
                studentsToProcess = [genStudent];
            }

            // 3. Generate Invoices
            let generatedCount = 0;
            const totalAmount = structures.reduce((sum, s) => sum + parseFloat(s.amount), 0);

            for (const student of studentsToProcess) {
                // Check if invoice exists for this term/year? (Skipping for now to allow corrections/supplements)

                const { data: invoice, error: invError } = await supabase
                    .from('invoices')
                    .insert([{
                        student_id: student.id,
                        academic_year: genYear,
                        term: genTerm,
                        due_date: genDueDate,
                        total_amount: totalAmount,
                        status: 'unpaid',
                        invoice_number: `INV-${genYear}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`
                    }])
                    .select()
                    .single();

                if (invError) continue;

                const items = structures.map(s => ({
                    invoice_id: invoice.id,
                    fee_structure_id: s.id,
                    amount: s.amount,
                    description: 'Fee Item' // Ideally fetch name
                }));

                await supabase.from('invoice_items').insert(items);
                generatedCount++;
            }

            showToast(`Generated ${generatedCount} invoices successfully`, 'success');
            setShowGenerateModal(false);
            fetchInvoices();
            // Reset fields
            setGenStudent(null);
            setStudentSearch('');

        } catch (error) {
            console.error(error);
            showToast(error.message || 'Generation failed', 'error');
        } finally {
            setGenerating(false);
        }
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none"
                        />
                    </div>
                </div>
                <button
                    onClick={() => setShowGenerateModal(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
                >
                    <Plus size={18} /> Generate Invoices
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <th className="p-4 rounded-l-xl">Invoice #</th>
                            <th className="p-4">Student</th>
                            <th className="p-4">Term</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4 rounded-r-xl text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="7" className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-purple-600" /></td></tr>
                        ) : filteredInvoices.length === 0 ? (
                            <tr><td colSpan="7" className="p-8 text-center text-slate-400 font-medium">No invoices found.</td></tr>
                        ) : (
                            filteredInvoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-slate-50/50">
                                    <td className="p-4 font-mono text-xs font-bold text-slate-600">{inv.invoice_number}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900">{inv.student?.full_name}</div>
                                        <div className="text-xs text-slate-500">{inv.student?.student_code || inv.student?.email}</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">{inv.term} {inv.academic_year}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900">GH₵ {inv.total_amount}</div>
                                        {inv.paid_amount > 0 && <div className="text-xs text-green-600">Paid: {inv.paid_amount}</div>}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                inv.status === 'partial' ? 'bg-blue-100 text-blue-700' :
                                                    inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {inv.status === 'paid' && <CheckCircle size={12} />}
                                            {inv.status === 'overdue' && <AlertCircle size={12} />}
                                            {inv.status === 'unpaid' && <Clock size={12} />}
                                            <span className="capitalize">{inv.status}</span>
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">{inv.due_date}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-400 hover:text-purple-600 transition-colors" title="Download PDF">
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={showGenerateModal}
                onClose={() => setShowGenerateModal(false)}
                title="Generate Invoices"
                size="md"
            >
                <div className="space-y-4">
                    {/* Mode Selection */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                        <button
                            onClick={() => setGenMode('class')}
                            className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${genMode === 'class' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Users size={16} /> Entire Class
                        </button>
                        <button
                            onClick={() => setGenMode('student')}
                            className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${genMode === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <User size={16} /> Individual Student
                        </button>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-800 text-sm mb-4">
                        <p className="font-bold flex items-center gap-2"><AlertCircle size={16} /> Important</p>
                        Generating invoices uses the {genMode === 'class' ? 'selected class' : 'student\'s class'} fee structure for the specified term.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Class Selector (Only for Class Mode) */}
                        {genMode === 'class' && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Select Class</label>
                                <select
                                    value={genClass}
                                    onChange={(e) => setGenClass(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.grade_level}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Student Search (Only for Student Mode) */}
                        {genMode === 'student' && (
                            <div className="md:col-span-2 relative">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Select Student</label>
                                {genStudent ? (
                                    <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                        <div>
                                            <p className="font-bold text-slate-900">{genStudent.full_name}</p>
                                            <p className="text-xs text-slate-500">{genStudent.email}</p>
                                        </div>
                                        <button
                                            onClick={() => { setGenStudent(null); setStudentSearch(''); }}
                                            className="text-slate-400 hover:text-red-500"
                                        >
                                            <Plus size={20} className="rotate-45" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            value={studentSearch}
                                            onChange={(e) => setStudentSearch(e.target.value)}
                                            placeholder="Type to search student (min 3 chars)..."
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                                        />
                                        {/* Dropdown Results */}
                                        {(searchingStudents || studentSearchResults.length > 0) && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                                {searchingStudents && <div className="p-3 text-center text-slate-400 text-sm"><Loader2 className="animate-spin inline mr-2" size={12} /> Searching...</div>}
                                                {studentSearchResults.map(s => (
                                                    <div
                                                        key={s.id}
                                                        onClick={() => { setGenStudent(s); setStudentSearchResults([]); }}
                                                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none"
                                                    >
                                                        <div className="font-bold text-slate-800 text-sm">{s.full_name}</div>
                                                        <div className="text-xs text-slate-500">{s.email} • {s.student_code || 'No Code'}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Academic Year</label>
                            <input type="text" value={genYear} onChange={(e) => setGenYear(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Term</label>
                            <select value={genTerm} onChange={(e) => setGenTerm(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600">
                                <option>Term 1</option>
                                <option>Term 2</option>
                                <option>Term 3</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-1">Due Date</label>
                            <input type="date" value={genDueDate} onChange={(e) => setGenDueDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleGenerateInvoices}
                            disabled={generating}
                            className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
                        >
                            {generating && <Loader2 className="animate-spin" size={16} />}
                            Generate {genMode === 'class' ? 'Class' : 'Student'} Invoice
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Invoices;
