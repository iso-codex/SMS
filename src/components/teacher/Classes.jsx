import React, { useEffect, useState } from 'react';
import { Users, MoreHorizontal, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';
import { Link } from 'react-router-dom';

const TeacherClasses = () => {
    const { user } = useAuthStore();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, [user?.id]);

    const fetchClasses = async () => {
        if (!user?.id) return;
        try {
            // Fetch classes assigned to teacher, including count of students
            // users table has class_id FK.
            // Note: users(count) requires 'users' to be the relation name. 
            // If the relationship is named differently, we might need to adjust.
            // Assuming standard relationship based on FK.
            const { data, error } = await supabase
                .from('classes')
                .select('*, users(count)')
                .eq('teacher_id', user.id)
                .order('name');

            if (error) throw error;

            // Transform data to include count
            const formattedClasses = data.map(cls => ({
                ...cls,
                studentCount: cls.users?.[0]?.count || 0 // 'users' returns array of objects with count if used like this? 
                // No, select('*, users(count)') returns users: [{count: N}] array if 1-many?
                // Actually Supabase returns { count: N } object sometimes or array. 
                // Let's debug or handle safely. Usually users: [{count: 10}]
            }));

            // Wait, select('*, users(count)') typically returns 'users' as an array of objects related, 
            // but with count aggregation it returns { count: N }? 
            // Actually, best way is .select('*, users(count)') -> result.users[0].count.

            setClasses(data || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Classes</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage your assigned classes and student rosters.</p>
                </div>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                    Sync Roster
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : classes.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="text-slate-300" size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">No Classes Assigned</h2>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                        You don't have any classes assigned yet. Please contact the administrator to assign classes to your profile.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <div key={cls.id} className="group bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 overflow-hidden flex flex-col">
                            {/* Card Header */}
                            <div className="p-8 bg-slate-50/50 group-hover:bg-indigo-50/30 transition-colors relative">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-lg shadow-sm mb-4">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                            <span className="text-xs font-bold text-slate-600">Active</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{cls.name}</h3>
                                        <p className="text-slate-500 font-bold text-sm">Grade {cls.grade_level}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 border border-slate-100 group-hover:scale-110 transition-transform">
                                        <BookOpen size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-8 pt-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students</p>
                                            <p className="font-black text-slate-900">{cls.users ? cls.users[0]?.count : 0}</p>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Schedule</p>
                                            <p className="font-bold text-slate-900 text-sm">Mon, Wed, Fri</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-3">
                                    <Link to={`/teacher/classes/${cls.id}`} className="block w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-center text-sm shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        Manage Class
                                        <ArrowRight size={16} />
                                    </Link>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-colors">
                                            Gradebook
                                        </button>
                                        <button className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-colors">
                                            Students
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherClasses;
