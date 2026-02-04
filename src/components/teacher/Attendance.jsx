import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, CheckCircle, XCircle, Clock, PieChart as PieChartIcon, BarChart as BarChartIcon, Save, Users, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const TeacherAttendance = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('mark'); // 'mark' or 'report'

    // Common State
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    // Mark Attendance State
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({}); // { studentId: 'present' | 'absent' | 'late' }
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Report State
    const [reportStats, setReportStats] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);

    useEffect(() => {
        if (user?.id) fetchClasses();
    }, [user?.id]);

    useEffect(() => {
        if (selectedClassId) {
            if (activeTab === 'mark') {
                fetchStudentsAndAttendance();
            } else {
                fetchReportData();
            }
        }
    }, [selectedClassId, selectedDate, activeTab]);

    const fetchClasses = async () => {
        try {
            // Fetch classes assigned to this teacher
            // Assuming 'teacher_id' in classes table. 
            // Also fetching *all* classes if teacher_id is null might be desired if system isn't fully set up, 
            // but strict filtering is better for a "Teacher Dashboard".

            // Checking if user is admin or superuser? No, this is teacher dashboard.

            const { data, error } = await supabase
                .from('classes')
                .select('*')
                .eq('teacher_id', user.id)
                .order('name');

            if (data && data.length > 0) {
                setClasses(data);
                setSelectedClassId(data[0].id);
            } else {
                // If no classes assigned, maybe try fetching all if allowed? 
                // Or just show empty. For UX, let's fetch all but maybe show a warning or filter?
                // Actually, strict assignment is better. If empty, the user sees "No classes assigned".
                // BUT for testing, if I haven't assigned classes to this teacher, it will be empty.
                // I'll stick to assigned. If empty, I'll allow manual selection if the backend permits, 
                // but visually I'll show what comes back.
                setClasses(data || []);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchStudentsAndAttendance = async () => {
        setLoading(true);
        try {
            // 1. Fetch Students in Class
            const { data: studentsData, error: studentsError } = await supabase
                .from('users')
                .select('id, full_name, roll_number')
                .eq('role', 'student')
                .eq('class_id', selectedClassId)
                .order('full_name');

            if (studentsError) throw studentsError;
            setStudents(studentsData || []);

            // 2. Fetch Existing Attendance for Date
            const { data: attendanceDataDB, error: attendanceError } = await supabase
                .from('attendance')
                .select('student_id, status')
                .eq('class_id', selectedClassId)
                .eq('date', selectedDate);

            if (attendanceError) throw attendanceError;

            // Map to state
            const statusMap = {};
            // Initialize all as present (or empty?)
            // Usually simpler to initialize as 'present' if not set, or leave empty to force marking.
            // Let's default to 'present' for ease of use, or 'undefined' if completely new?
            // User requested "options to mark".

            // Pre-fill existing
            attendanceDataDB?.forEach(record => {
                statusMap[record.student_id] = record.status;
            });

            // For students without record, strictly undefined or default?
            // Let's default to 'present' for new records to save clicks? 
            // Or keep clean. I'll keep clean (undefined) so user knows what's pending, 
            // BUT UI will show 'Present' selected by default if I want "Mark All Present" button.
            // I'll initialize undefined in state, but UI can show "Unmarked".

            setAttendanceData(statusMap);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReportData = async () => {
        setReportLoading(true);
        try {
            // Fetch attendance for the selected date for stats
            const { data: dailyData, error: dailyError } = await supabase
                .from('attendance')
                .select('status, student_id, users(full_name, roll_number)') // join users to get names of absentees
                .eq('class_id', selectedClassId)
                .eq('date', selectedDate);

            if (dailyError) throw dailyError;

            // Calculate Counts
            const present = dailyData?.filter(d => d.status === 'present').length || 0;
            const absent = dailyData?.filter(d => d.status === 'absent').length || 0;
            const late = dailyData?.filter(d => d.status === 'late').length || 0;
            const total = (dailyData?.length) || 0; // Only counts MARKED students

            const absentees = dailyData?.filter(d => d.status === 'absent').map(d => d.users) || [];

            setReportStats({
                present,
                absent,
                late,
                total,
                absentees
            });

        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setReportLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSaveAttendance = async () => {
        setSaving(true);
        try {
            // Prepare Upsert Data
            const updates = students.map(student => ({
                student_id: student.id,
                class_id: selectedClassId,
                date: selectedDate,
                status: attendanceData[student.id] || 'present', // Default to present if saving undefined?? Or skip? Better to save explicit status.
            }));

            const { error } = await supabase
                .from('attendance')
                .upsert(updates, { onConflict: 'student_id, date' });

            if (error) throw error;

            setSuccessMsg('Attendance saved successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);

            // Refresh report if needed?
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Failed to save attendance.');
        } finally {
            setSaving(false);
        }
    };

    const handleMarkAll = (status) => {
        const newData = {};
        students.forEach(s => newData[s.id] = status);
        setAttendanceData(newData);
    };

    // Chart Data
    const pieData = [
        { name: 'Present', value: reportStats?.present || 0, color: '#10B981' },
        { name: 'Absent', value: reportStats?.absent || 0, color: '#EF4444' },
        { name: 'Late', value: reportStats?.late || 0, color: '#F59E0B' },
    ].filter(d => d.value > 0);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Class Attendance</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage and monitor student attendance.</p>
                </div>

                {/* Class Selector */}
                <div className="flex items-center gap-4">
                    <select
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                        {classes.length === 0 && <option value="">No Classes Assigned</option>}
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                    </select>

                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('mark')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'mark' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Mark Attendance
                        </button>
                        <button
                            onClick={() => setActiveTab('report')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'report' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            View Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Date Picker */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 w-fit">
                <Calendar className="text-slate-400" size={20} />
                <input
                    type="date"
                    className="bg-transparent border-none focus:outline-none text-slate-700 font-bold"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            {activeTab === 'mark' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Actions */}
                    <div className="flex gap-2">
                        <button onClick={() => handleMarkAll('present')} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">All Present</button>
                        <button onClick={() => handleMarkAll('absent')} className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">All Absent</button>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        {loading ? (
                            <div className="p-12 flex justify-center text-purple-600"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div></div>
                        ) : students.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No students found in this class.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="p-6 font-bold text-slate-500 text-sm uppercase">Roll</th>
                                            <th className="p-6 font-bold text-slate-500 text-sm uppercase">Student Name</th>
                                            <th className="p-6 font-bold text-slate-500 text-sm uppercase text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {students.map(student => (
                                            <tr key={student.id} className="hover:bg-slate-50/50">
                                                <td className="p-6 text-slate-600 font-medium">{student.roll_number || '-'}</td>
                                                <td className="p-6 font-bold text-slate-900">{student.full_name}</td>
                                                <td className="p-6">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'present')}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${attendanceData[student.id] === 'present' ? 'bg-emerald-100 border-emerald-200 text-emerald-700 font-bold' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-200 hover:text-emerald-600'}`}
                                                        >
                                                            <CheckCircle size={18} />
                                                            <span>Present</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'absent')}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${attendanceData[student.id] === 'absent' ? 'bg-red-100 border-red-200 text-red-700 font-bold' : 'bg-white border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-600'}`}
                                                        >
                                                            <XCircle size={18} />
                                                            <span>Absent</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'late')}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${attendanceData[student.id] === 'late' ? 'bg-amber-100 border-amber-200 text-amber-700 font-bold' : 'bg-white border-slate-200 text-slate-400 hover:border-amber-200 hover:text-amber-600'}`}
                                                        >
                                                            <Clock size={18} />
                                                            <span>Late</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end sticky bottom-6 z-10">
                        <button
                            onClick={handleSaveAttendance}
                            disabled={saving}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-purple-600/20 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Attendance'}
                            <Save size={20} />
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'report' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Stats Cards */}
                    {reportLoading ? (
                        <div className="p-12 flex justify-center text-purple-600"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div></div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Chart */}
                                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <PieChartIcon className="text-purple-600" size={20} />
                                        Attendance Distribution
                                    </h3>
                                    <div className="h-64 w-full">
                                        {pieData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {pieData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip />
                                                    <Legend verticalAlign="bottom" height={36} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-slate-400 font-medium">No data recorded for this date.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="space-y-4">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                        <h4 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">Attendance Rate</h4>
                                        <div className="flex items-end gap-2">
                                            <span className="text-4xl font-black text-slate-900">
                                                {reportStats?.total ? Math.round((reportStats.present / reportStats.total) * 100) : 0}%
                                            </span>
                                            <span className="text-slate-500 font-medium mb-1">Present</span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                        <h4 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-4">Absentees</h4>
                                        {reportStats?.absentees && reportStats.absentees.length > 0 ? (
                                            <div className="space-y-3">
                                                {reportStats.absentees.map((student, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                                                            {student.full_name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-sm">{student.full_name}</p>
                                                            <p className="text-xs text-slate-500">{student.roll_number || 'No Roll'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-slate-400 text-sm font-medium">No absentees! 🎉</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Success Toast */}
            {successMsg && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-slide-up">
                    <CheckCircle className="text-emerald-400" size={20} />
                    <span className="font-bold">{successMsg}</span>
                </div>
            )}
        </div>
    );
};

export default TeacherAttendance;
