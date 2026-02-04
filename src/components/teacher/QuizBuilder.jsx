import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft, Check, Copy, GripVertical, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';

const QuizBuilder = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [classes, setClasses] = useState([]);

    // Quiz State
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        class_id: '',
        duration_minutes: 30,
        status: 'draft'
    });

    const [questions, setQuestions] = useState([
        { id: 'temp-1', text: '', type: 'multiple_choice', points: 1, options: [{ id: 'opt-1', text: '', is_correct: false }, { id: 'opt-2', text: '', is_correct: false }] }
    ]);

    useEffect(() => {
        fetchClasses();
        if (quizId) fetchQuizDetails();
    }, [quizId]);

    const fetchClasses = async () => {
        if (!user?.id) return;
        const { data } = await supabase.from('classes').select('id, name').eq('teacher_id', user.id);
        setClasses(data || []);
    };

    const fetchQuizDetails = async () => {
        setLoading(true);
        // Implementation for editing existing quiz would go here.
        // For now, focusing on Create flow or assumes simplified fetch.
        // If quizId is provided, we would fetch quiz, questions, and options.
        setLoading(false);
    };

    // Question Handlers
    const addQuestion = () => {
        const newQ = {
            id: `temp-${Date.now()}`,
            text: '',
            type: 'multiple_choice',
            points: 1,
            options: [{ id: `opt-${Date.now()}-1`, text: '', is_correct: false }]
        };
        setQuestions([...questions, newQ]);
    };

    const removeQuestion = (index) => {
        const newQ = [...questions];
        newQ.splice(index, 1);
        setQuestions(newQ);
    };

    const updateQuestion = (index, field, value) => {
        const newQ = [...questions];
        newQ[index][field] = value;
        setQuestions(newQ);
    };

    // Option Handlers
    const addOption = (qIndex) => {
        const newQ = [...questions];
        newQ[qIndex].options.push({ id: `opt-${Date.now()}`, text: '', is_correct: false });
        setQuestions(newQ);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQ = [...questions];
        newQ[qIndex].options.splice(oIndex, 1);
        setQuestions(newQ);
    };

    const updateOption = (qIndex, oIndex, field, value) => {
        const newQ = [...questions];
        if (field === 'is_correct') {
            // For single choice, uncheck others. For now assuming single correct answer for MC.
            newQ[qIndex].options.forEach((opt, idx) => opt.is_correct = (idx === oIndex));
        } else {
            newQ[qIndex].options[oIndex][field] = value;
        }
        setQuestions(newQ);
    };

    // Save
    const handleSave = async (status = 'draft') => {
        if (!quiz.title || !quiz.class_id) {
            alert("Please fill in the Quiz Title and assign a Class.");
            return;
        }

        setSaving(true);
        try {
            // 1. Create/Update Quiz
            const quizPayload = {
                ...quiz,
                teacher_id: user.id,
                status: status
            };

            const { data: quizData, error: quizError } = await supabase
                .from('quizzes')
                .insert(quizPayload)
                .select()
                .single();

            if (quizError) throw quizError;
            const newQuizId = quizData.id;

            // 2. Insert Questions & Options
            // (Simplified: Deleting old questions if update, but here just insert for creation)
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                const { data: qData, error: qError } = await supabase
                    .from('quiz_questions')
                    .insert({
                        quiz_id: newQuizId,
                        question_text: q.text,
                        question_type: q.type,
                        points: q.points,
                        order_index: i
                    })
                    .select()
                    .single();

                if (qError) throw qError;

                if (q.options && q.options.length > 0) {
                    const optionsPayload = q.options.map(o => ({
                        question_id: qData.id,
                        option_text: o.text,
                        is_correct: o.is_correct
                    }));

                    const { error: optError } = await supabase.from('quiz_options').insert(optionsPayload);
                    if (optError) throw optError;
                }
            }

            navigate('/teacher/assessments');

        } catch (error) {
            console.error("Error saving quiz:", error);
            alert("Failed to save quiz. Check console for details.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen animate-fade-in pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-sm z-20 py-4 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/teacher/assessments')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quiz Builder</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSave('draft')}
                        disabled={saving}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave('published')}
                        disabled={saving}
                        className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Publish Quiz
                    </button>
                </div>
            </div>

            {/* Quiz Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Quiz Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Algebra Mid-Term"
                            value={quiz.title}
                            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Assign to Class</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                            value={quiz.class_id}
                            onChange={(e) => setQuiz({ ...quiz, class_id: e.target.value })}
                        >
                            <option value="">Select a Class...</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Brief instructions for students..."
                            value={quiz.description}
                            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Duration (Minutes)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={quiz.duration_minutes}
                            onChange={(e) => setQuiz({ ...quiz, duration_minutes: parseInt(e.target.value) })}
                        />
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
                {questions.map((q, qIndex) => (
                    <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-l-2xl"></div>

                        {/* Question Header */}
                        <div className="flex items-start gap-4 mb-6">
                            <div className="mt-3 cursor-move text-slate-300 hover:text-slate-500">
                                <GripVertical size={20} />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                                        placeholder={`Question ${qIndex + 1}`}
                                        value={q.text}
                                        onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                    />
                                    <select
                                        className="w-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={q.type}
                                        onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                                    >
                                        <option value="multiple_choice">Multiple Choice</option>
                                        <option value="true_false">True / False</option>
                                        <option value="short_answer">Short Answer</option>
                                    </select>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Pts"
                                            value={q.points}
                                            onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>

                                {/* Options */}
                                {q.type !== 'short_answer' && (
                                    <div className="space-y-3 pl-4 border-l-2 border-slate-100 ml-4">
                                        {q.options.map((opt, oIndex) => (
                                            <div key={opt.id} className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateOption(qIndex, oIndex, 'is_correct', !opt.is_correct)}
                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${opt.is_correct
                                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                                            : 'border-slate-300 text-transparent hover:border-slate-400'
                                                        }`}
                                                >
                                                    <Check size={14} />
                                                </button>
                                                <input
                                                    type="text"
                                                    className={`flex-1 px-3 py-2 bg-white border-b-2 font-medium focus:border-indigo-500 outline-none transition-colors ${opt.is_correct ? 'text-emerald-700 border-emerald-200' : 'text-slate-600 border-slate-100'}`}
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    value={opt.text}
                                                    onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                                />
                                                <button onClick={() => removeOption(qIndex, oIndex)} className="text-slate-300 hover:text-rose-500 p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addOption(qIndex)}
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2"
                                        >
                                            <Plus size={14} /> Add Option
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => removeQuestion(qIndex)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Question Button */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={addQuestion}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus size={24} />
                    Add Question
                </button>
            </div>
        </div>
    );
};

export default QuizBuilder;
