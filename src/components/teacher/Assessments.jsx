import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Clock, FileText, MoreVertical, Edit, Trash2, CheckCircle, Play, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';
import { Link, useNavigate } from 'react-router-dom';

import UploadAssessmentModal from './modals/UploadAssessmentModal';

const TeacherAssessments = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchQuizzes();
        fetchClasses();
    }, [user?.id]);

    const fetchClasses = async () => {
        if (!user?.id) return;
        const { data } = await supabase.from('classes').select('id, name').eq('teacher_id', user.id);
        setClasses(data || []);
    };

    const fetchQuizzes = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('quizzes')
                .select('*, classes(name)')
                .eq('teacher_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setQuizzes(data || []);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this quiz?")) return;
        try {
            const { error } = await supabase.from('quizzes').delete().eq('id', id);
            if (error) throw error;
            setQuizzes(prev => prev.filter(q => q.id !== id));
        } catch (error) {
            console.error("Error deleting quiz:", error);
        }
    };

    const filteredQuizzes = quizzes.filter(q => filterStatus === 'all' || q.status === filterStatus);

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assessments</h1>
                    <p className="text-slate-500 font-medium mt-2">Create and manage quizzes, tests, and exams.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <Upload size={20} />
                        Upload PDF
                    </button>
                    <Link
                        to="/teacher/assessments/create"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create New Quiz
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filterStatus === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilterStatus('published')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filterStatus === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    Published
                </button>
                <button
                    onClick={() => setFilterStatus('draft')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filterStatus === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    Drafts
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)}
                </div>
            ) : filteredQuizzes.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="text-slate-300" size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">No Quizzes Found</h2>
                    <p className="text-slate-500 font-medium">Create your first quiz to get started.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredQuizzes.map(quiz => (
                        <div key={quiz.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 group">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${quiz.quiz_type === 'file_upload'
                                    ? 'bg-indigo-100 text-indigo-600'
                                    : (quiz.status === 'published' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600')
                                }`}>
                                {quiz.quiz_type === 'file_upload' ? <FileText size={24} /> : (quiz.status === 'published' ? <CheckCircle size={24} /> : <Edit size={24} />)}
                            </div>

                            <div className="flex-1 w-full text-center md:text-left">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{quiz.title}</h3>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {quiz.duration_minutes} mins
                                    </span>
                                    {quiz.classes && (
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                            {quiz.classes.name}
                                        </span>
                                    )}
                                    <span className={`uppercase ${quiz.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {quiz.status}
                                    </span>
                                    {quiz.quiz_type === 'file_upload' && (
                                        <span className="bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded border border-indigo-100">
                                            PDF Upload
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                {quiz.quiz_type === 'file_upload' ? (
                                    <a
                                        href={quiz.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 md:flex-none py-2 px-4 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
                                    >
                                        <Upload size={16} className="rotate-180" /> Download
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => navigate(`/teacher/assessments/edit/${quiz.id}`)}
                                        className="flex-1 md:flex-none py-2 px-4 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(quiz.id)}
                                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <UploadAssessmentModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={fetchQuizzes}
                classes={classes}
            />
        </div>
    );
};

export default TeacherAssessments;
