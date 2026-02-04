import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertTriangle, Star, CheckCircle, MoreVertical, Trash2, User, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';

const TeacherBehavior = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [records, setRecords] = useState([]);

    // Form State
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [type, setType] = useState('positive'); // positive, negative
    const [category, setCategory] = useState('Participation');
    const [points, setPoints] = useState(1);
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchClasses();
        fetchRecentRecords();
    }, [user?.id]);

    useEffect(() => {
        if (selectedClassId) {
            fetchStudents(selectedClassId);
        } else {
            setStudents([]);
        }
    }, [selectedClassId]);

    const fetchClasses = async () => {
        if (!user?.id) return;
        const { data } = await supabase.from('classes').select('id, name').eq('teacher_id', user.id);
        setClasses(data || []);
    };

    const fetchStudents = async (classId) => {
        const { data } = await supabase.from('users').select('id, full_name').eq('class_id', classId).eq('role', 'student');
        setStudents(data || []);
    };

    const fetchRecentRecords = async () => {
        if (!user?.id) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('behavior_records')
            .select('*, users!behavior_records_student_id_fkey(full_name), classes(name)')
            .eq('teacher_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (!error) setRecords(data || []);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudentId || !category) return;

        setSaving(true);
        try {
            const payload = {
                teacher_id: user.id,
                student_id: selectedStudentId,
                class_id: selectedClassId,
                type,
                category,
                points: type === 'positive' ? Math.abs(points) : -Math.abs(points),
                description,
                incident_date: new Date().toISOString()
            };

            const { error } = await supabase.from('behavior_records').insert(payload);
            if (error) throw error;

            // Reset form and refresh list
            setDescription('');
            fetchRecentRecords();
        } catch (error) {
            console.error("Error saving record:", error);
            alert("Failed to save record.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this record?")) return;
        await supabase.from('behavior_records').delete().eq('id', id);
        setRecords(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Log Form */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Behavior</h1>
                        <p className="text-slate-500 font-medium mt-2">Log Merits & Incidents</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Class</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    required
                                >
                                    <option value="">Select Class...</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Student</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={selectedStudentId}
                                    onChange={(e) => setSelectedStudentId(e.target.value)}
                                    disabled={!selectedClassId}
                                    required
                                >
                                    <option value="">Select Student...</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => { setType('positive'); setPoints(1); }}
                                    className={`p-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-2 ${type === 'positive' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <Star size={24} className={type === 'positive' ? 'fill-emerald-500' : ''} />
                                    Merit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setType('negative'); setPoints(1); }}
                                    className={`p-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-2 ${type === 'negative' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <AlertTriangle size={24} className={type === 'negative' ? 'fill-amber-500' : ''} />
                                    Incident
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {type === 'positive' ? (
                                        <>
                                            <option>Participation</option>
                                            <option>Homework</option>
                                            <option>Helping Others</option>
                                            <option>Excellence</option>
                                        </>
                                    ) : (
                                        <>
                                            <option>Disruption</option>
                                            <option>Late</option>
                                            <option>No Homework</option>
                                            <option>Disrespect</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Points ({type === 'positive' ? '+' : '-'}{points})</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={points}
                                    onChange={(e) => setPoints(parseInt(e.target.value))}
                                    className="w-full accent-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Description / Note</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    rows="3"
                                    placeholder="Optional details..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={saving || !selectedStudentId}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                                Log Record
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: History */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-slate-800">Recent Activity</h2>
                        <div className="flex gap-2">
                            {/* Placeholder filters */}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-400" /></div>
                    ) : records.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                            <p className="text-slate-400 font-medium">No recent records found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {records.map(record => (
                                <div key={record.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all group">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${record.type === 'positive' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        {record.type === 'positive' ? <Star size={24} className="fill-current" /> : <AlertTriangle size={24} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-900">{record.users?.full_name}</h3>
                                            <span className="text-xs font-bold text-slate-400">
                                                {new Date(record.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-600 mb-1">
                                            {record.category}
                                            <span className={`ml-2 px-2 py-0.5 rounded text-xs ${record.type === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {record.points > 0 ? '+' : ''}{record.points} pts
                                            </span>
                                        </p>
                                        {record.description && (
                                            <p className="text-sm text-slate-500 bg-slate-50 p-2 rounded-lg mt-2">
                                                {record.description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
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

export default TeacherBehavior;
