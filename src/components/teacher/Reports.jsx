import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, Activity, TrendingUp, Users, Calendar, AlertTriangle, Star, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';

const TeacherReports = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');

    // Stats
    const [stats, setStats] = useState({
        avgGrade: 0,
        attendanceRate: 0,
        behaviorRatio: 0, // Positive / Total
        totalAssignments: 0,
        totalQuizzes: 0
    });

    useEffect(() => {
        fetchClasses();
    }, [user?.id]);

    useEffect(() => {
        if (selectedClassId) {
            fetchClassStats(selectedClassId);
        }
    }, [selectedClassId]);

    const fetchClasses = async () => {
        if (!user?.id) return;
        const { data } = await supabase.from('classes').select('id, name').eq('teacher_id', user.id);
        setClasses(data || []);
        if (data && data.length > 0) setSelectedClassId(data[0].id);
    };

    const fetchClassStats = async (classId) => {
        setLoading(true);
        try {
            // 1. Assignment Grades
            const { data: assignments } = await supabase
                .from('submissions')
                .select('grade, assignment_id')
                .eq('status', 'graded');

            // Filter submissions for this class's assignments would be ideal, 
            // but for MVP we might need to rely on the fact that we're showing aggregate.
            // A better query would join assignments -> class_id.

            const { data: assignmentGrades, error: gradeError } = await supabase
                .from('submissions')
                .select('grade, assignments!inner(class_id)')
                .eq('assignments.class_id', classId)
                .eq('status', 'graded');

            // 2. Attendance
            const { data: attendance } = await supabase
                .from('attendance')
                .select('status')
                .eq('class_id', classId);

            // 3. Behavior
            const { data: behavior } = await supabase
                .from('behavior_records')
                .select('type')
                .eq('class_id', classId);

            // Calculations

            // Grades
            let totalGrade = 0;
            let countGrade = 0;
            if (assignmentGrades) {
                assignmentGrades.forEach(sub => {
                    if (sub.grade) {
                        totalGrade += parseFloat(sub.grade);
                        countGrade++;
                    }
                });
            }
            const avgGrade = countGrade > 0 ? (totalGrade / countGrade).toFixed(1) : 0;

            // Attendance
            let presentCount = 0;
            if (attendance) {
                attendance.forEach(att => {
                    if (att.status === 'present') presentCount++;
                });
            }
            const attendanceRate = attendance && attendance.length > 0
                ? Math.round((presentCount / attendance.length) * 100)
                : 0;

            // Behavior
            let positive = 0;
            let negative = 0;
            if (behavior) {
                behavior.forEach(b => {
                    if (b.type === 'positive') positive++;
                    else if (b.type === 'negative') negative++;
                });
            }
            const totalBehavior = positive + negative;
            const behaviorRatio = totalBehavior > 0 ? Math.round((positive / totalBehavior) * 100) : 0;

            setStats({
                avgGrade,
                attendanceRate,
                behaviorRatio,
                totalAssignments: countGrade,
                totalBehavior
            });

        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reports & Analytics</h1>
                    <p className="text-slate-500 font-medium mt-2">Insights into class performance and engagement.</p>
                </div>
                <div className="w-full md:w-64">
                    <select
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-400" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Grade Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={64} className="text-indigo-600" />
                        </div>
                        <h3 className="text-slate-500 font-bold mb-1 flex items-center gap-2">
                            <Activity size={18} /> Avg. Performance
                        </h3>
                        <div className="text-5xl font-black text-indigo-600 mb-2">
                            {stats.avgGrade}%
                        </div>
                        <p className="text-sm font-medium text-slate-400">
                            Based on {stats.totalAssignments} graded assignments
                        </p>
                        <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${stats.avgGrade}%` }}></div>
                        </div>
                    </div>

                    {/* Attendance Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Calendar size={64} className="text-emerald-600" />
                        </div>
                        <h3 className="text-slate-500 font-bold mb-1 flex items-center gap-2">
                            <Users size={18} /> Attendance Rate
                        </h3>
                        <div className="text-5xl font-black text-emerald-500 mb-2">
                            {stats.attendanceRate}%
                        </div>
                        <p className="text-sm font-medium text-slate-400">
                            Present rate for this class
                        </p>
                        <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.attendanceRate}%` }}></div>
                        </div>
                    </div>

                    {/* Behavior Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Star size={64} className="text-amber-500" />
                        </div>
                        <h3 className="text-slate-500 font-bold mb-1 flex items-center gap-2">
                            <Star size={18} /> Positive Behavior
                        </h3>
                        <div className="text-5xl font-black text-amber-500 mb-2">
                            {stats.behaviorRatio}%
                        </div>
                        <p className="text-sm font-medium text-slate-400">
                            {stats.totalBehavior} total records
                        </p>
                        <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden flex">
                            <div className="bg-amber-400 h-full" style={{ width: `${stats.behaviorRatio}%` }}></div>
                            <div className="bg-rose-400 h-full" style={{ width: `${100 - stats.behaviorRatio}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                            <span>Positive</span>
                            <span>Negative</span>
                        </div>
                    </div>

                    {/* Additional sections for lists or charts could go here */}
                    <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <CheckCircle size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Class Insights</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-slate-700 mb-2">Top Performing Areas</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> High Attendance on Tuesdays</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Positive Participation in Math</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-slate-700 mb-2">Areas for Improvement</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Homework Submission Rate Low</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherReports;
