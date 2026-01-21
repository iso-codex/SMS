import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Users, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AddClassModal from './modals/AddClassModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import Toast, { useToast } from '../shared/Toast';

const Class = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [deletingClass, setDeletingClass] = useState(null);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            // Fetch classes with teacher information and student count
            const { data: classesData, error: classesError } = await supabase
                .from('classes')
                .select(`
                    *,
                    teacher:teacher_id (
                        id,
                        full_name,
                        email
                    )
                `)
                .order('grade_level');

            if (classesError) throw classesError;

            // Get student count for each class
            const classesWithCounts = await Promise.all(
                (classesData || []).map(async (cls) => {
                    const { count, error } = await supabase
                        .from('users')
                        .select('*', { count: 'exact', head: true })
                        .eq('class_id', cls.id)
                        .eq('role', 'student');

                    return {
                        ...cls,
                        student_count: error ? 0 : count || 0
                    };
                })
            );

            setClasses(classesWithCounts);
        } catch (error) {
            console.error('Error fetching classes:', error);
            showToast('Failed to load classes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingClass) return;

        try {
            // Check if class has students
            if (deletingClass.student_count > 0) {
                showToast(`Cannot delete class with ${deletingClass.student_count} enrolled students`, 'error');
                setDeletingClass(null);
                return;
            }

            const { error } = await supabase
                .from('classes')
                .delete()
                .eq('id', deletingClass.id);

            if (error) throw error;

            showToast('Class deleted successfully', 'success');
            fetchClasses();
        } catch (error) {
            console.error('Error deleting class:', error);
            showToast('Failed to delete class', 'error');
        } finally {
            setDeletingClass(null);
        }
    };

    const handleEdit = (cls) => {
        setEditingClass(cls);
        setIsAddModalOpen(true);
    };

    const handleModalClose = () => {
        setIsAddModalOpen(false);
        setEditingClass(null);
    };

    const handleSuccess = (message) => {
        showToast(message, 'success');
        fetchClasses();
    };

    const filteredClasses = classes.filter(cls =>
        cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.grade_level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.section?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacher?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Class Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage classes, sections, and student assignments.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
                >
                    <Plus size={20} />
                    <span>Add Class</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search classes by name, grade, section, or teacher..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Classes Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-purple-600" size={40} />
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <p className="text-slate-500 font-medium">
                        {searchTerm
                            ? 'No classes found matching your search.'
                            : 'No classes yet. Click "Add Class" to get started.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((cls) => (
                        <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">{cls.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-purple-600 font-bold">Grade {cls.grade_level}</span>
                                        {cls.section && (
                                            <>
                                                <span className="text-slate-400">•</span>
                                                <span className="text-slate-600 font-medium">Section {cls.section}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(cls)}
                                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                        title="Edit class"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeletingClass(cls)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete class"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-slate-500" />
                                        <span className="text-sm font-bold text-slate-500">Students</span>
                                    </div>
                                    <span className="text-lg font-black text-slate-900">{cls.student_count || 0}</span>
                                </div>
                                {cls.teacher && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="text-sm font-bold text-slate-500">Class Teacher</span>
                                        <span className="text-sm font-medium text-slate-900">{cls.teacher.full_name || cls.teacher.email}</span>
                                    </div>
                                )}
                                {cls.room_number && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="text-sm font-bold text-slate-500">Room</span>
                                        <span className="text-sm font-medium text-slate-900">{cls.room_number}</span>
                                    </div>
                                )}
                                {cls.capacity && (
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-bold text-slate-500">Occupancy</span>
                                            <span className="text-xs font-bold text-slate-400">
                                                {Math.round(((cls.student_count || 0) / cls.capacity) * 100)}% Full
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${((cls.student_count || 0) / cls.capacity) * 100 < 30 ? 'bg-red-500' :
                                                        ((cls.student_count || 0) / cls.capacity) * 100 < 70 ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${Math.min(((cls.student_count || 0) / cls.capacity) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-end mt-1">
                                            <span className="text-[10px] font-medium text-slate-400">{cls.capacity} Capacity</span>
                                        </div>
                                    </div>
                                )}
                                {cls.fee !== undefined && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="text-sm font-bold text-slate-500">Annual Fee</span>
                                        <span className="text-sm font-medium text-green-600">GH₵ {cls.fee}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Class Modal */}
            <AddClassModal
                isOpen={isAddModalOpen}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
                editClass={editingClass}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deletingClass}
                onClose={() => setDeletingClass(null)}
                onConfirm={handleDelete}
                title="Delete Class"
                message={
                    deletingClass?.student_count > 0
                        ? `This class has ${deletingClass.student_count} enrolled students. Please reassign them before deleting.`
                        : `Are you sure you want to delete ${deletingClass?.name}? This action cannot be undone.`
                }
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

export default Class;
