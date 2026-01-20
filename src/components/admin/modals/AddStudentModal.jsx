import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from '../../shared/Modal';
import { supabase } from '../../../lib/supabase';

const AddStudentModal = ({ isOpen, onClose, onSuccess, editStudent = null }) => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        roll_number: '',
        phone: '',
        address: '',
        date_of_birth: '',
        class_id: '',
        parent_name: '',
        parent_phone: '',
        blood_group: '',
        gender: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            fetchClasses();
            if (editStudent) {
                setFormData({
                    full_name: editStudent.full_name || '',
                    email: editStudent.email || '',
                    roll_number: editStudent.roll_number || '',
                    phone: editStudent.phone || '',
                    address: editStudent.address || '',
                    date_of_birth: editStudent.date_of_birth || '',
                    class_id: editStudent.class_id || '',
                    parent_name: editStudent.parent_name || '',
                    parent_phone: editStudent.parent_phone || '',
                    blood_group: editStudent.blood_group || '',
                    gender: editStudent.gender || ''
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editStudent]);

    const fetchClasses = async () => {
        const { data, error } = await supabase
            .from('classes')
            .select('id, name, grade_level')
            .order('grade_level');

        if (!error && data) {
            setClasses(data);
        }
    };

    const resetForm = () => {
        setFormData({
            full_name: '',
            email: '',
            roll_number: '',
            phone: '',
            address: '',
            date_of_birth: '',
            class_id: '',
            parent_name: '',
            parent_phone: '',
            blood_group: '',
            gender: ''
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) newErrors.full_name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.roll_number.trim()) newErrors.roll_number = 'Roll number is required';
        if (!formData.class_id) newErrors.class_id = 'Class is required';
        if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number is invalid';
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
            if (editStudent) {
                // Update existing student
                const { error } = await supabase
                    .from('users')
                    .update({
                        full_name: formData.full_name,
                        email: formData.email,
                        roll_number: formData.roll_number,
                        phone: formData.phone,
                        address: formData.address,
                        date_of_birth: formData.date_of_birth || null,
                        class_id: formData.class_id || null,
                        parent_name: formData.parent_name,
                        parent_phone: formData.parent_phone,
                        blood_group: formData.blood_group,
                        gender: formData.gender
                    })
                    .eq('id', editStudent.id);

                if (error) throw error;
                onSuccess('Student updated successfully!');
            } else {
                // Create new student using Edge Function (securely creates Auth user + DB record)
                const { data, error } = await supabase.functions.invoke('create-user', {
                    body: {
                        email: formData.email,
                        password: 'Student123!', // Default password
                        full_name: formData.full_name,
                        roll_number: formData.roll_number,
                        phone: formData.phone,
                        address: formData.address,
                        date_of_birth: formData.date_of_birth || null,
                        class_id: formData.class_id || null,
                        parent_name: formData.parent_name,
                        parent_phone: formData.parent_phone,
                        blood_group: formData.blood_group,
                        gender: formData.gender,
                        admission_date: new Date().toISOString().split('T')[0]
                    }
                });

                if (error) {
                    // Check if error is from the function response or network
                    const errorMessage = error.message || (data && data.error) || 'Failed to create student';
                    throw new Error(errorMessage);
                }

                if (data && data.error) {
                    throw new Error(data.error);
                }

                onSuccess('Student added successfully!');
            }

            onClose();
            resetForm();
        } catch (error) {
            console.error('Error saving student:', error);
            setErrors({ submit: error.message || 'Failed to save student. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editStudent ? 'Edit Student' : 'Add New Student'}
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
                                disabled={!!editStudent}
                                className={`w-full px-4 py-2.5 border ${errors.email ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ${editStudent ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                                placeholder="student@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Roll Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="roll_number"
                                value={formData.roll_number}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border ${errors.roll_number ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                                placeholder="e.g., #001"
                            />
                            {errors.roll_number && <p className="text-red-500 text-sm mt-1">{errors.roll_number}</p>}
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
                                        {cls.name} - Grade {cls.grade_level}
                                    </option>
                                ))}
                            </select>
                            {errors.class_id && <p className="text-red-500 text-sm mt-1">{errors.class_id}</p>}
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
                                Blood Group
                            </label>
                            <select
                                name="blood_group"
                                value={formData.blood_group}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            >
                                <option value="">Select blood group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
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

                {/* Parent Information */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Parent/Guardian Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Parent/Guardian Name
                            </label>
                            <input
                                type="text"
                                name="parent_name"
                                value={formData.parent_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="Enter parent name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Parent Phone Number
                            </label>
                            <input
                                type="tel"
                                name="parent_phone"
                                value={formData.parent_phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="+1 234 567 8900"
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
                        {loading ? 'Saving...' : (editStudent ? 'Update Student' : 'Add Student')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddStudentModal;
