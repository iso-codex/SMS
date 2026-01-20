import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from '../../shared/Modal';
import { supabase } from '../../../lib/supabase';

const AddClassModal = ({ isOpen, onClose, onSuccess, editClass = null }) => {
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        grade_level: '',
        section: '',
        room_number: '',
        capacity: '',
        fee: '',
        teacher_id: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            fetchTeachers();
            if (editClass) {
                setFormData({
                    name: editClass.name || '',
                    grade_level: editClass.grade_level || '',
                    section: editClass.section || '',
                    room_number: editClass.room_number || '',
                    capacity: editClass.capacity || '',
                    fee: editClass.fee || '',
                    teacher_id: editClass.teacher_id || ''
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editClass]);

    const fetchTeachers = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('id, full_name, email')
            .eq('role', 'teacher')
            .order('full_name');

        if (!error && data) {
            setTeachers(data);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            grade_level: '',
            section: '',
            room_number: '',
            capacity: '',
            fee: '',
            teacher_id: ''
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Class name is required';
        if (!formData.grade_level.trim()) newErrors.grade_level = 'Grade level is required';
        if (formData.capacity && (isNaN(formData.capacity) || formData.capacity < 1)) {
            newErrors.capacity = 'Capacity must be a positive number';
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
            const classData = {
                name: formData.name,
                grade_level: formData.grade_level,
                section: formData.section || null,
                room_number: formData.room_number || null,
                capacity: formData.capacity ? parseInt(formData.capacity) : null,
                fee: formData.fee ? parseFloat(formData.fee) : 0,
                teacher_id: formData.teacher_id || null
            };

            if (editClass) {
                // Update existing class
                const { error } = await supabase
                    .from('classes')
                    .update(classData)
                    .eq('id', editClass.id);

                if (error) throw error;
                onSuccess('Class updated successfully!');
            } else {
                // Create new class
                const { error } = await supabase
                    .from('classes')
                    .insert([classData]);

                if (error) throw error;
                onSuccess('Class added successfully!');
            }

            onClose();
            resetForm();
        } catch (error) {
            console.error('Error saving class:', error);
            setErrors({ submit: error.message || 'Failed to save class. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editClass ? 'Edit Class' : 'Add New Class'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        {errors.submit}
                    </div>
                )}

                {/* Class Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Class Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border ${errors.name ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                            placeholder="e.g., Mathematics 101"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Grade Level <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="grade_level"
                            value={formData.grade_level}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border ${errors.grade_level ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                            placeholder="e.g., 10, 11, 12"
                        />
                        {errors.grade_level && <p className="text-red-500 text-sm mt-1">{errors.grade_level}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Section
                        </label>
                        <input
                            type="text"
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="e.g., A, B, C"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Room Number
                        </label>
                        <input
                            type="text"
                            name="room_number"
                            value={formData.room_number}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="e.g., 101, 202"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Capacity
                        </label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border ${errors.capacity ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                            placeholder="e.g., 30"
                            min="1"
                        />
                        {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Annual Fee (GH₵)
                        </label>
                        <input
                            type="number"
                            name="fee"
                            value={formData.fee}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border ${errors.fee ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                            placeholder="e.g., 5000"
                            min="0"
                        />
                        {errors.fee && <p className="text-red-500 text-sm mt-1">{errors.fee}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Class Teacher
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
                </div>

                {/* Actions */}
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
                        {loading ? 'Saving...' : (editClass ? 'Update Class' : 'Add Class')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddClassModal;
