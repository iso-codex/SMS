import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Users, Mail, Phone, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AddTeacherModal from './modals/AddTeacherModal';

const Teachers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    subjects (
                        id,
                        name,
                        code
                    )
                `)
                .eq('role', 'teacher')
                .order('full_name');

            if (error) throw error;
            setTeachers(data || []);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTeacher = () => {
        setEditingTeacher(null);
        setIsModalOpen(true);
    };

    const handleEditTeacher = (teacher) => {
        setEditingTeacher(teacher);
        setIsModalOpen(true);
    };

    const handleDeleteTeacher = async (teacher) => {
        if (!confirm(`Are you sure you want to delete ${teacher.full_name}?`)) return;

        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', teacher.id);

            if (error) throw error;

            showSuccess('Teacher deleted successfully!');
            fetchTeachers();
        } catch (error) {
            console.error('Error deleting teacher:', error);
            alert('Failed to delete teacher. Please try again.');
        }
    };

    const handleModalSuccess = (message) => {
        showSuccess(message);
        fetchTeachers();
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subjects?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Success Message */}
            {successMessage && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-slide-in">
                    <AlertCircle size={20} />
                    <span className="font-semibold">{successMessage}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Teachers</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage teaching staff and their assignments.</p>
                </div>
                <button
                    onClick={handleAddTeacher}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
                >
                    <Plus size={20} />
                    <span>Add Teacher</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search teachers by name or subject..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            ) : filteredTeachers.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <Users className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Teachers Found</h3>
                    <p className="text-slate-500">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first teacher.'}
                    </p>
                </div>
            ) : (
                /* Teachers Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeachers.map((teacher) => (
                        <div key={teacher.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl border-2 border-purple-200">
                                    {teacher.full_name?.split(' ').map(n => n[0]).join('') || '??'}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditTeacher(teacher)}
                                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTeacher(teacher)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{teacher.full_name}</h3>
                            <p className="text-purple-600 font-medium mb-4">
                                {teacher.subjects?.name || 'No Subject Assigned'}
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Mail size={16} className="text-slate-400" />
                                    <span className="font-medium truncate">{teacher.email}</span>
                                </div>
                                {teacher.phone && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Phone size={16} className="text-slate-400" />
                                        <span className="font-medium">{teacher.phone}</span>
                                    </div>
                                )}
                                {teacher.experience_years && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Users size={16} className="text-slate-400" />
                                        <span className="font-medium">{teacher.experience_years} years experience</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Teacher Modal */}
            <AddTeacherModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                editTeacher={editingTeacher}
            />
        </div>
    );
};

export default Teachers;

