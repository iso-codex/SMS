import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Users, BookOpen, Calendar, FileText, ChevronLeft, MoreHorizontal,
    Search, Filter, Mail, Award, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';

const TeacherClassDetails = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('students');
    const [stats, setStats] = useState({ attendance: 85, assignments: 12, avgGrade: 'B+' }); // Mock stats for now

    useEffect(() => {
        fetchClassDetails();
    }, [classId]);

    const fetchClassDetails = async () => {
        try {
            // Fetch class info
            const { data: cls, error: classError } = await supabase
                .from('classes')
                .select('*')
                .eq('id', classId)
                .single();

            if (classError) throw classError;
            setClassData(cls);

            // Fetch students in this class
            // Assuming users table has class_id.
            const { data: studentList, error: studentError } = await supabase
                .from('users')
                .select('*')
                .eq('class_id', classId)
                .eq('role', 'student')
                .order('full_name');

            if (studentError) throw studentError;
            setStudents(studentList || []);

        } catch (error) {
            console.error("Error fetching class details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="p-8 flex justify-center text-slate-400">Loading class details...</div>
    );

    if (!classData) return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold">Class not found</h2>
            <button onClick={() => navigate('/teacher/classes')} className="text-indigo-600 font-bold mt-4">Back to Classes</button>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen animate-fade-in">
            {/* Header */}
            <button
                onClick={() => navigate('/teacher/classes')}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors mb-6"
            >
                <ChevronLeft size={20} />
                Back to Classes
            </button>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay -mr-16 -mt-32 blur-3xl" />
                </div>
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center p-2 text-indigo-600 z-10">
                                <BookOpen size={48} />
                            </div>
                            <div className="pb-1">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{classData.name}</h1>
                                <p className="text-slate-500 font-bold">{classData.subject} • Grade {classData.grade_level}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <Link to="/teacher/attendance" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                                Take Attendance
                            </Link>
                            <button className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                                Manage Class
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-slate-100">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Students</p>
                            <p className="text-2xl font-black text-slate-800">{students.length}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Attendance</p>
                            <p className="text-2xl font-black text-emerald-600">{stats.attendance}%</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Assignments</p>
                            <p className="text-2xl font-black text-slate-800">{stats.assignments}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Grade</p>
                            <p className="text-2xl font-black text-indigo-600">{stats.avgGrade}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
                {['students', 'assignments', 'grades', 'attendance'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 font-bold text-sm capitalize transition-colors relative whitespace-nowrap ${activeTab === tab
                                ? 'text-indigo-600'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'students' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                                <Filter size={18} />
                            </button>
                            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800">
                                Email Class
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                                    {student.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{student.full_name}</p>
                                                    <p className="text-xs text-slate-500">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-600">STU-{student.id.slice(0, 4).toUpperCase()}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full max-w-[80px] h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 w-[85%]"></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">85%</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">Good</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-slate-400 hover:text-indigo-600 p-2">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                                            No students enrolled in this class yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab !== 'students' && (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-400 font-medium">This tab is under development.</p>
                </div>
            )}
        </div>
    );
};

export default TeacherClassDetails;
