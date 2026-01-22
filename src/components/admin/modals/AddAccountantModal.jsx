import React, { useState, useEffect } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Modal from '../../shared/Modal';
import { supabase } from '../../../lib/supabase';

const AddAccountantModal = ({ isOpen, onClose, onSuccess, editAccountant = null }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (editAccountant) {
                setFormData({
                    full_name: editAccountant.full_name || '',
                    email: editAccountant.email || '',
                    password: '', // Password not editable directly here for security, or optional
                    phone: editAccountant.phone || '',
                    address: editAccountant.address || ''
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editAccountant]);

    const resetForm = () => {
        setFormData({
            full_name: '',
            email: '',
            password: '',
            phone: '',
            address: ''
        });
        setErrors({});
        setShowPassword(false);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) newErrors.full_name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!editAccountant && !formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number is invalid';
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
            if (editAccountant) {
                // Update existing accountant
                const updates = {
                    full_name: formData.full_name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address
                };

                const { error } = await supabase
                    .from('users')
                    .update(updates)
                    .eq('id', editAccountant.id);

                if (error) throw error;

                // If password provided during edit, update it (requires admin privilege/RPC usually, 
                // but for now we might skip strictly since Supabase Client Admin can do it, 
                // or we use the updateUser RPC if available, or just ignore password on edit for this MVP)
                // For MVP: We won't update password on edit here to keep simple.

                onSuccess('Accountant updated successfully!');
            } else {
                // Create new accountant with password
                const { data: userId, error: createError } = await supabase
                    .rpc('create_user_with_role', {
                        email: formData.email,
                        password: formData.password,
                        full_name: formData.full_name,
                        role: 'accountant'
                    });

                if (createError) throw createError;

                // Update additional fields
                const { error: updateError } = await supabase
                    .from('users')
                    .update({
                        phone: formData.phone,
                        address: formData.address
                    })
                    .eq('id', userId);

                if (updateError) throw updateError;

                onSuccess('Accountant created successfully!');
            }
            onClose();
            resetForm();
        } catch (error) {
            console.error('Error saving accountant:', error);
            setErrors({ submit: error.message || 'Failed to save accountant.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editAccountant ? 'Edit Accountant' : 'Add New Accountant'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {errors.submit}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="John Doe"
                    />
                    {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!!editAccountant}
                        className={`w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 ${editAccountant ? 'bg-slate-100' : ''}`}
                        placeholder="accountant@school.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {!editAccountant && (
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Password *</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10"
                                placeholder="******"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Enter address"
                    />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200 mt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="animate-spin" size={18} />}
                        {loading ? 'Saving...' : (editAccountant ? 'Update' : 'Add Accountant')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddAccountantModal;
