import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from '../../shared/Modal';
import { supabase } from '../../../lib/supabase';

const AddSubjectModal = ({ isOpen, onClose, onSuccess, editSubject = null }) => {
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        class_id: '',
        teacher_id: '',
        hours_per_week: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            fetchData();
            if (editSubject) {
                setFormData({
                    name: editSubject.name || '',
                    code: editSubject.code || '',
                    class_id: editSubject.class_id || '',
                    teacher_id: editSubject.teacher_id || '',
                    hours_per_week: editSubject.hours_per_week || ''
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editSubject]);

    const fetchData = async () => {
        // Fetch teachers
        const { data: teachersData } = await supabase
            .from('users')
            .select('id, full_name, email')
            .eq('role', 'teacher')
            .order('full_name');

        if (teachersData) setTeachers(teachersData);

        // Fetch classes
        const { data: classesData } = await supabase
            .from('classes')
            .select('id, name, grade_level, section')
            .order('grade_level');

        if (classesData) setClasses(classesData);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            code: '',
            class_id: '',
            teacher_id: '',
            hours_per_week: ''
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Subject name is required';
        if (!formData.code.trim()) newErrors.code = 'Subject code is required';
        if (!formData.class_id) newErrors.class_id = 'Class is required';

        if (formData.hours_per_week && (isNaN(formData.hours_per_week) || formData.hours_per_week < 0)) {
            newErrors.hours_per_week = 'Hours must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const subjectData = {
                name: formData.name,
                code: formData.code,
                class_id: formData.class_id,
                teacher_id: formData.teacher_id || null,
                hours_per_week: formData.hours_per_week ? parseInt(formData.hours_per_week) : 0
            };

            if (editSubject) {
                const { error } = await supabase
                    .from('subjects')
                    .update(subjectData)
                    .eq('id', editSubject.id);

                if (error) throw error;
                onSuccess('Subject updated successfully!');
            } else {
                const { error } = await supabase
                    .from('subjects')
                    .insert([subjectData]);

                if (error) throw error;
                onSuccess('Subject added successfully!');
            }

            onClose();
            resetForm();
        } catch (error) {
            console.error('Error saving subject:', error);
            setErrors({ submit: error.message || 'Failed to save subject. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editSubject ? 'Edit Subject' : 'Add New Subject'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        {errors.submit}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Subject Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border ${errors.name ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                            placeholder="e.g., Advanced Mathematics"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Subject Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border ${errors.code ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                            placeholder="e.g., MATH-101"
                        />
                        {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Class <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="class_id"
                            value={formData.class_id}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border ${errors.class_id ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                        >
                            <option value="">Select class</option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name} (Grade {cls.grade_level}) {cls.section ? `- Sec ${cls.section}` : ''}
                                </option>
                            ))}
                        </select>
                        {errors.class_id && <p className="text-red-500 text-sm mt-1">{errors.class_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Teacher
                        </label>
                        <select
                            name="teacher_id"
                            value={formData.teacher_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        >
                            <option value="">Select teacher (optional)</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.full_name || teacher.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Hours Per Week
                        </label>
                        <input
                            type="number"
                            name="hours_per_week"
                            value={formData.hours_per_week}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border ${errors.hours_per_week ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                            placeholder="e.g., 5"
                            min="0"
                        />
                        {errors.hours_per_week && <p className="text-red-500 text-sm mt-1">{errors.hours_per_week}</p>}
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        {loading ? 'Saving...' : (editSubject ? 'Update Subject' : 'Add Subject')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddSubjectModal;
