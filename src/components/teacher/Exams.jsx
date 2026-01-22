import React, { useState } from 'react';
import { Upload, FileText, Trash2, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Modal from '../shared/Modal';

const TeacherExams = () => {
    const [exams, setExams] = useState([
        { id: 1, title: 'Math Midterm', class: 'Class 10-A', subject: 'Mathematics', date: '2025-10-15', file: 'math_midterm.pdf' },
        { id: 2, title: 'Physics Quiz', class: 'Class 9-B', subject: 'Physics', date: '2025-10-20', file: 'physics_quiz.pdf' },
    ]);
    // In a real app, fetch this from Supabase

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [examTitle, setExamTitle] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [examDate, setExamDate] = useState('');
    const [file, setFile] = useState(null);

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate Upload
        setTimeout(() => {
            const newExam = {
                id: Date.now(),
                title: examTitle,
                class: selectedClass,
                subject: 'Mathematics', // Simplified for demo
                date: examDate,
                file: file ? file.name : 'document.pdf'
            };
            setExams([newExam, ...exams]);
            setLoading(false);
            setIsUploadModalOpen(false);
            resetForm();
        }, 1500);
    };

    const resetForm = () => {
        setExamTitle('');
        setSelectedClass('');
        setExamDate('');
        setFile(null);
    }

    const deleteExam = (id) => {
        if (confirm('Are you sure you want to remove this exam?')) {
            setExams(exams.filter(e => e.id !== id));
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Exams Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Upload and assign exams to your classes.</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    New Exam
                </button>
            </div>

            {/* Exams List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                    <div key={exam.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                <FileText size={24} />
                            </div>
                            <button
                                onClick={() => deleteExam(exam.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">{exam.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{exam.class}</span>
                            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md">{exam.subject}</span>
                        </div>
                        <div className="text-sm text-slate-500 font-medium mb-4">
                            Scheduled: {exam.date}
                        </div>
                        <div className="border-t border-slate-100 pt-4 flex items-center gap-2 text-sm font-bold text-slate-600">
                            <span className="truncate max-w-[200px]">{exam.file}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Modal */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Upload New Exam"
            >
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Exam Title</label>
                        <input
                            type="text"
                            required
                            value={examTitle}
                            onChange={(e) => setExamTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                            placeholder="e.g. Final Mathematics Exam"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Assign Class</label>
                            <select
                                required
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                            >
                                <option value="">Select Class</option>
                                <option value="Class 10-A">Class 10-A</option>
                                <option value="Class 9-B">Class 9-B</option>
                                <option value="Class 11-C">Class 11-C</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Exam Document (PDF)</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                            <p className="text-sm font-bold text-slate-600">
                                {file ? file.name : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">PDF, DOC up to 10MB</p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Upload & Assign"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TeacherExams;
