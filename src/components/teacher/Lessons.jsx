import React, { useEffect, useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, BookOpen, MoreVertical, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';
import { Link, useNavigate } from 'react-router-dom';

const TeacherLessons = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLessons();
    }, [user?.id]);

    const fetchLessons = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('lessons')
                .select('*, classes(name)')
                .eq('teacher_id', user.id)
                .order('start_time', { ascending: true });

            if (error) throw error;
            setLessons(data || []);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Group by Date for cleaner display
    const groupedLessons = lessons.reduce((acc, lesson) => {
        const date = new Date(lesson.start_time).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(lesson);
        return acc;
    }, {});

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lesson Plans</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage your curriculum and daily schedules.</p>
                </div>
                <Link
                    to="/teacher/lessons/create"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Plan Lesson
                </Link>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-400" /></div>
            ) : Object.keys(groupedLessons).length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CalendarIcon className="text-slate-300" size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">No Lessons Planned</h2>
                    <p className="text-slate-500 font-medium">Start planning your week by creating a new lesson.</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {Object.entries(groupedLessons).map(([date, dayLessons]) => (
                        <div key={date}>
                            <h3 className="text-lg font-bold text-slate-500 mb-4 flex items-center gap-2">
                                <CalendarIcon size={18} />
                                {formatDate(dayLessons[0].start_time)}
                            </h3>
                            <div className="space-y-4">
                                {dayLessons.map(lesson => (
                                    <div
                                        key={lesson.id}
                                        onClick={() => navigate(`/teacher/lessons/edit/${lesson.id}`)}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${lesson.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                                        {lesson.classes?.name}
                                                    </span>
                                                    <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                                    {lesson.title}
                                                </h4>
                                                <p className="text-slate-500 text-sm line-clamp-2">{lesson.description}</p>
                                            </div>
                                            <div className="p-2 bg-slate-50 rounded-full text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherLessons;
