import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, BookOpen, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AddSubjectModal from './modals/AddSubjectModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import Toast, { useToast } from '../shared/Toast';
import { motion } from 'framer-motion';

const Subject = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [deletingSubject, setDeletingSubject] = useState(null);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('subjects')
                .select(`
                    *,
                    classes:class_id (id, name, grade_level, section),
                    teacher:teacher_id (id, full_name, email)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubjects(data || []);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            showToast('Failed to load subjects', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingSubject) return;

        try {
            const { error } = await supabase
                .from('subjects')
                .delete()
                .eq('id', deletingSubject.id);

            if (error) throw error;

            showToast('Subject deleted successfully', 'success');
            fetchSubjects();
        } catch (error) {
            console.error('Error deleting subject:', error);
            showToast('Failed to delete subject', 'error');
        } finally {
            setDeletingSubject(null);
        }
    };

    const handleEdit = (subject) => {
        setEditingSubject(subject);
        setIsAddModalOpen(true);
    };

    const handleModalClose = () => {
        setIsAddModalOpen(false);
        setEditingSubject(null);
    };

    const handleSuccess = (message) => {
        showToast(message, 'success');
        fetchSubjects();
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.classes?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.teacher?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subject Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage subjects and curriculum.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
                >
                    <Plus size={20} />
                    <span>Add Subject</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search subjects by name, code, class, or teacher..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Subjects Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Subject Name</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Code</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Teacher</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Class</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Hours/Week</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-slate-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        Loading subjects...
                                    </td>
                                </tr>
                            ) : filteredSubjects.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-slate-500 font-medium">
                                        {searchTerm
                                            ? 'No subjects found matching your search.'
                                            : 'No subjects yet. Click "Add Subject" to get started.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredSubjects.map((subject) => (
                                    <motion.tr
                                        key={subject.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                                    <BookOpen size={20} />
                                                </div>
                                                <div className="font-bold text-slate-900">{subject.name}</div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-600 font-medium">
                                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                                {subject.code}
                                            </span>
                                        </td>
                                        <td className="p-6 text-slate-600 font-medium">
                                            {subject.teacher ? (subject.teacher.full_name || subject.teacher.email) : 'Not Assigned'}
                                        </td>
                                        <td className="p-6 text-slate-600 font-medium">
                                            {subject.classes ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700">{subject.classes.name}</span>
                                                    <span className="text-xs text-slate-500">
                                                        Grade {subject.classes.grade_level}
                                                        {subject.classes.section && ` • Sec ${subject.classes.section}`}
                                                    </span>
                                                </div>
                                            ) : 'No Class'}
                                        </td>
                                        <td className="p-6 text-slate-600 font-medium">{subject.hours_per_week || '-'}</td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(subject)}
                                                    className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Edit subject"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingSubject(subject)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete subject"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Subject Modal */}
            <AddSubjectModal
                isOpen={isAddModalOpen}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
                editSubject={editingSubject}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deletingSubject}
                onClose={() => setDeletingSubject(null)}
                onConfirm={handleDelete}
                title="Delete Subject"
                message={`Are you sure you want to delete ${deletingSubject?.name}? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />

            {/* Toast Notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    );
};

export default Subject;
