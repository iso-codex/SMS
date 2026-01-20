import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Loader2, GraduationCap, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import AddStudentModal from './modals/AddStudentModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import Toast, { useToast } from '../shared/Toast';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('all');
    const [classes, setClasses] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [deletingStudent, setDeletingStudent] = useState(null);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        fetchStudents();
        fetchClasses();
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
                        grade_level
                    )
                `)
                .eq('role', 'student')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setStudents(data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            showToast('Failed to load students', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const { data, error } = await supabase
                .from('classes')
                .select('id, name, grade_level')
                .order('grade_level');

            if (error) throw error;
            setClasses(data || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleDelete = async () => {
        if (!deletingStudent) return;

        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', deletingStudent.id);

            if (error) throw error;

            showToast('Student deleted successfully', 'success');
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
            showToast('Failed to delete student', 'error');
        } finally {
            setDeletingStudent(null);
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setIsAddModalOpen(true);
    };

    const handleModalClose = () => {
        setIsAddModalOpen(false);
        setEditingStudent(null);
    };

    const handleSuccess = (message) => {
        showToast(message, 'success');
        fetchStudents();
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesClass = filterClass === 'all' || student.class_id === filterClass;

        return matchesSearch && matchesClass;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Students List</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage all student records and information.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
                >
                    <Plus size={20} />
                    <span>Add Student</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <Search className="text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, roll number, or email..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <Filter className="text-slate-400" size={20} />
                    <select
                        className="bg-transparent border-none focus:outline-none text-slate-700 font-medium cursor-pointer"
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                    >
                        <option value="all">All Classes</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} - Grade {cls.grade_level}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Student's Name</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Roll</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Email</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Class</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Phone</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-slate-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        Loading students...
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-slate-500 font-medium">
                                        {searchTerm || filterClass !== 'all'
                                            ? 'No students found matching your criteria.'
                                            : 'No students yet. Click "Add Student" to get started.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <motion.tr
                                        key={student.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200">
                                                    {student.full_name?.[0]?.toUpperCase() || 'S'}
                                                </div>
                                                <div className="font-bold text-slate-900">{student.full_name || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-600 font-medium">{student.roll_number || 'N/A'}</td>
                                        <td className="p-6 text-slate-600 font-medium">{student.email}</td>
                                        <td className="p-6 text-slate-600 font-medium">
                                            {student.classes?.name || 'Not Assigned'}
                                        </td>
                                        <td className="p-6 text-slate-600 font-medium">{student.phone || 'N/A'}</td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Edit student"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingStudent(student)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete student"
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

            {/* Add/Edit Student Modal */}
            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
                editStudent={editingStudent}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deletingStudent}
                onClose={() => setDeletingStudent(null)}
                onConfirm={handleDelete}
                title="Delete Student"
                message={`Are you sure you want to delete ${deletingStudent?.full_name}? This action cannot be undone.`}
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

export default Students;
