import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Calendar, Clock, Book, Link as LinkIcon, Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';

const LessonPlanner = () => {
    const { lessonId } = useParams(); // If editing
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [classes, setClasses] = useState([]);

    const [lesson, setLesson] = useState({
        title: '',
        class_id: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '10:00',
        description: '',
        content: '',
        status: 'scheduled',
        resources: [] // Array of { name, url }
    });

    useEffect(() => {
        fetchClasses();
        if (lessonId) fetchLessonDetails();
    }, [user?.id, lessonId]);

    const fetchClasses = async () => {
        if (!user?.id) return;
        const { data } = await supabase.from('classes').select('id, name').eq('teacher_id', user.id);
        setClasses(data || []);
    };

    const fetchLessonDetails = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('id', lessonId)
                .single();

            if (error) throw error;

            // Parse timestamps back to date/time inputs
            const start = new Date(data.start_time);
            const end = new Date(data.end_time);

            setLesson({
                ...data,
                date: start.toISOString().split('T')[0],
                start_time: start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                end_time: end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                resources: data.resources || []
            });
        } catch (error) {
            console.error("Error fetching lesson:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!lesson.title || !lesson.class_id) {
            alert("Title and Class are required.");
            return;
        }

        setSaving(true);
        try {
            // Combine Date + Time
            const startDateTime = new Date(`${lesson.date}T${lesson.start_time}`);
            const endDateTime = new Date(`${lesson.date}T${lesson.end_time}`);

            const payload = {
                teacher_id: user.id,
                class_id: lesson.class_id,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
                status: lesson.status,
                resources: lesson.resources
            };

            if (lessonId) {
                const { error } = await supabase.from('lessons').update(payload).eq('id', lessonId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('lessons').insert(payload);
                if (error) throw error;
            }

            navigate('/teacher/lessons');
        } catch (error) {
            console.error("Error saving lesson:", error);
            alert("Failed to save lesson.");
        } finally {
            setSaving(false);
        }
    };

    const addResource = () => {
        const url = prompt("Enter Resource URL (e.g., Google Drive link, YouTube):");
        if (url) {
            setLesson(prev => ({
                ...prev,
                resources: [...prev.resources, { name: 'New Resource', url, type: 'link' }]
            }));
        }
    };

    const removeResource = (index) => {
        setLesson(prev => ({
            ...prev,
            resources: prev.resources.filter((_, i) => i !== index)
        }));
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen animate-fade-in pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-sm z-20 py-4 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/teacher/lessons')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        {lessonId ? 'Edit Lesson' : 'Plan New Lesson'}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Available
                </button>
            </div>

            <div className="space-y-6">
                {/* Basic Info Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Book size={20} className="text-indigo-500" /> Lesson Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Topic / Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                                placeholder="e.g. Introduction to Thermodynamics"
                                value={lesson.title}
                                onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Class</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                value={lesson.class_id}
                                onChange={(e) => setLesson({ ...lesson, class_id: e.target.value })}
                            >
                                <option value="">Select Class...</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        {/* Time Blocking */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={lesson.date}
                                    onChange={(e) => setLesson({ ...lesson, date: e.target.value })}
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Start</label>
                                <input
                                    type="time"
                                    className="w-full px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-center"
                                    value={lesson.start_time}
                                    onChange={(e) => setLesson({ ...lesson, start_time: e.target.value })}
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-sm font-bold text-slate-700 mb-2">End</label>
                                <input
                                    type="time"
                                    className="w-full px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-center"
                                    value={lesson.end_time}
                                    onChange={(e) => setLesson({ ...lesson, end_time: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Lesson Objectives & Plan</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Objectives (Summary)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="What will students learn?"
                                value={lesson.description}
                                onChange={(e) => setLesson({ ...lesson, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Content</label>
                            <textarea
                                rows="10"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                                placeholder="Write your full lesson plan here..."
                                value={lesson.content}
                                onChange={(e) => setLesson({ ...lesson, content: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Resources */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <LinkIcon size={20} className="text-indigo-500" /> Resources
                        </h3>
                        <button
                            onClick={addResource}
                            className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            + Add Link
                        </button>
                    </div>

                    {lesson.resources.length === 0 ? (
                        <p className="text-slate-400 text-sm italic">No resources attached yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {lesson.resources.map((res, index) => (
                                <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-500 font-bold shrink-0">
                                        Link
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <input
                                            type="text"
                                            className="bg-transparent font-bold text-sm text-slate-700 w-full mb-0.5 outline-none"
                                            value={res.name}
                                            onChange={(e) => {
                                                const newRes = [...lesson.resources];
                                                newRes[index].name = e.target.value;
                                                setLesson({ ...lesson, resources: newRes });
                                            }}
                                        />
                                        <p className="text-xs text-slate-400 truncate">{res.url}</p>
                                    </div>
                                    <button onClick={() => removeResource(index)} className="p-2 text-slate-400 hover:text-rose-500">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LessonPlanner;
