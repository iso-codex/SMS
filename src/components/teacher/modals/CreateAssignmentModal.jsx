import React, { useState } from 'react';
import { X, Save, Calendar, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import useAuthStore from '../../../lib/authStore';

const CreateAssignmentModal = ({ isOpen, onClose, onSuccess, classes }) => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        class_id: '',
        type: 'Homework',
        due_date: '',
        points: 100,
        status: 'published'
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.class_id) throw new Error("Please select a class.");
            if (!formData.title) throw new Error("Title is required.");
            if (!formData.due_date) throw new Error("Due date is required.");

            const { error: insertError } = await supabase
                .from('assignments')
                .insert({
                    ...formData,
                    teacher_id: user.id
                });

            if (insertError) throw insertError;

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Error creating assignment:", err);
            setError(err.message || "Failed to create assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Create Assignment</h2>
                        <p className="text-slate-500 font-medium text-sm">Add a new task for your students</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 text-sm font-bold border border-rose-100">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Assignment Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                placeholder="e.g. Algebra Chapter 5 Exercises"
                                required
                            />
                        </div>

                        {/* Class */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Assign to Class</label>
                            <div className="relative">
                                <select
                                    name="class_id"
                                    value={formData.class_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium appearance-none"
                                    required
                                >
                                    <option value="">Select Class...</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <FileText size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Assignment Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            >
                                <option value="Homework">Homework</option>
                                <option value="Project">Project</option>
                                <option value="Essay">Essay</option>
                                <option value="Exam">Exam</option>
                                <option value="Participation">Participation</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Due Date & Time</label>
                            <input
                                type="datetime-local"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-600"
                                required
                            />
                        </div>

                        {/* Points */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Total Points</label>
                            <input
                                type="number"
                                name="points"
                                value={formData.points}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Instructions / Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none"
                                placeholder="Detailed instructions for the students..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-slate-100 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            {loading ? 'Creating...' : 'Create Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAssignmentModal;
