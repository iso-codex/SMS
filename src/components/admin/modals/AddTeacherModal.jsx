import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from '../../shared/Modal';
import { supabase } from '../../../lib/supabase';

const AddTeacherModal = ({ isOpen, onClose, onSuccess, editTeacher = null }) => {
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        date_of_birth: '',
        subject_id: '',
        qualification: '',
        experience_years: '',
        joining_date: '',
        gender: '',
        teacher_code: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            fetchSubjects();
            if (editTeacher) {
                setFormData({
                    full_name: editTeacher.full_name || '',
                    email: editTeacher.email || '',
                    phone: editTeacher.phone || '',
                    address: editTeacher.address || '',
                    date_of_birth: editTeacher.date_of_birth || '',
                    subject_id: editTeacher.subject_id || editTeacher.subjects?.id || '',
                    qualification: editTeacher.qualification || '',
                    experience_years: editTeacher.experience_years || '',
                    joining_date: editTeacher.joining_date || '',
                    gender: editTeacher.gender || ''
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editTeacher]);

    const fetchSubjects = async () => {
        const { data, error } = await supabase
            .from('subjects')
            .select('id, name, code')
            .order('name');

        if (!error && data) {
            setSubjects(data);
        }
    };

    const resetForm = () => {
        setFormData({
            full_name: '',
            email: '',
            phone: '',
            address: '',
            date_of_birth: '',
            subject_id: '',
            qualification: '',
            experience_years: '',
            joining_date: '',
            gender: '',
            teacher_code: generateTeacherCode()
        });
        setErrors({});
    };

    // Generate random 6-char code
    function generateTeacherCode() {
        return Math.random().toString(36).slice(2, 8).toUpperCase();
    }

    // Effect to regenerate code when modal opens for new teacher
    useEffect(() => {
        if (isOpen && !editTeacher) {
            setFormData(prev => ({ ...prev, teacher_code: generateTeacherCode() }));
        }
    }, [isOpen, editTeacher]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) newErrors.full_name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.subject_id) newErrors.subject_id = 'Subject is required';
        if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number is invalid';
        }
        if (formData.experience_years && (isNaN(formData.experience_years) || formData.experience_years < 0)) {
            newErrors.experience_years = 'Experience must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Check if email already exists
            if (!editTeacher) {
                const { data: existingUser, error: checkError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', formData.email)
                    .maybeSingle();

                if (existingUser) {
                    setErrors(prev => ({ ...prev, email: 'This email is already registered.' }));
                    setLoading(false);
                    return;
                }
            }

            if (editTeacher) {
                // Update existing teacher
                const { error } = await supabase
                    .from('users')
                    .update({
                        full_name: formData.full_name,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        date_of_birth: formData.date_of_birth || null,
                        subject_id: formData.subject_id || null,
                        qualification: formData.qualification,
                        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
                        joining_date: formData.joining_date || null,
                        gender: formData.gender
                    })
                    .eq('id', editTeacher.id);

                if (error) throw error;

                // Close modal and reset form first
                resetForm();
                onClose();

                // Then show success message
                onSuccess('Teacher updated successfully!');
            } else {
                // Create new teacher using RPC function
                const { data: userId, error: createError } = await supabase
                    .rpc('create_user_with_role', {
                        email: formData.email,
                        password: formData.teacher_code || 'Teacher123!', // Use teacher code as password
                        full_name: formData.full_name,
                        role: 'teacher'
                    });

                if (createError) throw createError;

                // Then update with additional teacher-specific fields
                if (userId) {
                    const { error: updateError } = await supabase
                        .from('users')
                        .update({
                            phone: formData.phone,
                            address: formData.address,
                            date_of_birth: formData.date_of_birth || null,
                            subject_id: formData.subject_id || null,
                            qualification: formData.qualification,
                            experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
                            joining_date: formData.joining_date || new Date().toISOString().split('T')[0],
                            gender: formData.gender,
                            teacher_code: formData.teacher_code
                        })
                        .eq('id', userId);

                    if (updateError) throw updateError;
                }

                // Close modal and reset form first
                resetForm();
                onClose();

                // Then show success message
                onSuccess('Teacher added successfully!');
            }
        } catch (error) {
            console.error('Error saving teacher:', error);
            if (error.message?.includes('duplicate key') || error.message?.includes('users_email_partial_key')) {
                setErrors({ email: 'This email is already associated with an account.' });
            } else {
                setErrors({ submit: error.message || 'Failed to save teacher. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        {errors.submit}
                    </div>
                )}

                {/* Personal Information */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border ${errors.full_name ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                                placeholder="Enter full name"
                            />
                            {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!!editTeacher}
                                className={`w-full px-4 py-2.5 border ${errors.email ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ${editTeacher ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                                placeholder="teacher@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {!editTeacher && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Access Code (Auto-generated)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="teacher_code"
                                        value={formData.teacher_code}
                                        readOnly
                                        className="w-full px-4 py-2.5 border border-purple-200 bg-purple-50 text-purple-700 font-bold rounded-xl focus:outline-none tracking-widest text-center"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">This code is the teacher's initial password.</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="subject_id"
                                value={formData.subject_id}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border ${errors.subject_id ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                            >
                                <option value="">Select subject</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name} ({subject.code})
                                    </option>
                                ))}
                            </select>
                            {errors.subject_id && <p className="text-red-500 text-sm mt-1">{errors.subject_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border ${errors.phone ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                                placeholder="+1 234 567 8900"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Enter full address"
                        />
                    </div>
                </div>

                {/* Professional Information */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Qualification
                            </label>
                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="e.g., M.Sc. in Mathematics"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Years of Experience
                            </label>
                            <input
                                type="number"
                                name="experience_years"
                                value={formData.experience_years}
                                onChange={handleChange}
                                min="0"
                                className={`w-full px-4 py-2.5 border ${errors.experience_years ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                                placeholder="e.g., 5"
                            />
                            {errors.experience_years && <p className="text-red-500 text-sm mt-1">{errors.experience_years}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Joining Date
                            </label>
                            <input
                                type="date"
                                name="joining_date"
                                value={formData.joining_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            />
                        </div>
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
                        {loading ? 'Saving...' : (editTeacher ? 'Update Teacher' : 'Add Teacher')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddTeacherModal;
