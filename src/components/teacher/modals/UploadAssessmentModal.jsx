import React, { useState } from 'react';
import { X, Save, Upload, FileText, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import useAuthStore from '../../../lib/authStore';

const UploadAssessmentModal = ({ isOpen, onClose, onSuccess, classes }) => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        class_id: '',
        duration_minutes: 60,
        quiz_type: 'file_upload',
        status: 'published'
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                setError("Only PDF files are allowed.");
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.class_id) throw new Error("Please select a class.");
            if (!formData.title) throw new Error("Title is required.");
            if (!file) throw new Error("Please upload a PDF file.");

            // 1. Upload File
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('assessments')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('assessments')
                .getPublicUrl(filePath);

            // 3. Save to DB
            const { error: insertError } = await supabase
                .from('quizzes')
                .insert({
                    ...formData,
                    teacher_id: user.id,
                    file_url: publicUrl
                });

            if (insertError) throw insertError;

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Error creating assessment:", err);
            setError(err.message || "Failed to upload assessment.");
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Upload PDF Assessment</h2>
                        <p className="text-slate-500 font-medium text-sm">Upload a past paper or PDF test.</p>
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
                            <label className="block text-sm font-bold text-slate-700 mb-2">Assessment Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                placeholder="e.g. History Final Exam 2024"
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
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Duration (Minutes)</label>
                            <input
                                type="number"
                                name="duration_minutes"
                                value={formData.duration_minutes}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            />
                        </div>

                        {/* File Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">PDF Document</label>
                            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${file ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="pdf-upload"
                                />
                                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center justify-center gap-3">
                                    {file ? (
                                        <>
                                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                                <CheckCircle size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-emerald-700">{file.name}</p>
                                                <p className="text-xs text-emerald-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                                                <Upload size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-600">Click to upload PDF</p>
                                                <p className="text-xs text-slate-400 font-medium">Max file size 10MB</p>
                                            </div>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Instructions</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none"
                                placeholder="Instructions for the students..."
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
                            disabled={loading || !file}
                            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            {uploading ? 'Uploading...' : 'Create Assessment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadAssessmentModal;
