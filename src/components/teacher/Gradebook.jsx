import React, { useEffect, useState, useCallback } from 'react';
import { Search, Filter, Save, Download, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';

const TeacherGradebook = () => {
    const { user } = useAuthStore();
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');

    // Grid Data
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [grades, setGrades] = useState({}); // Map: "studentId_assignmentId" -> score

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [stats, setStats] = useState({ classAverage: 0 });

    // 1. Fetch Classes on mount
    useEffect(() => {
        const fetchClasses = async () => {
            if (!user?.id) return;
            const { data } = await supabase
                .from('classes')
                .select('id, name')
                .eq('teacher_id', user.id)
                .order('name');
            setClasses(data || []);
            if (data?.length > 0) setSelectedClassId(data[0].id);
        };
        fetchClasses();
    }, [user?.id]);

    // 2. Fetch Gradebook Data when Class Changes
    useEffect(() => {
        if (!selectedClassId) return;
        fetchGradebookData();
    }, [selectedClassId]);

    const fetchGradebookData = async () => {
        setLoading(true);
        try {
            // A. Fetch Students
            const { data: studentsData } = await supabase
                .from('users')
                .select('id, full_name, email')
                .eq('class_id', selectedClassId)
                .eq('role', 'student')
                .order('full_name');
            setStudents(studentsData || []);

            // B. Fetch Assignments
            const { data: assignmentsData } = await supabase
                .from('assignments')
                .select('id, title, type, points, due_date')
                .eq('class_id', selectedClassId)
                .order('due_date');

            const sortedAssignments = assignmentsData || [];
            setAssignments(sortedAssignments);

            // C. Fetch Submissions (Existing Grades)
            if (sortedAssignments.length > 0 && studentsData?.length > 0) {
                const { data: submissionsData } = await supabase
                    .from('submissions')
                    .select('student_id, assignment_id, grade')
                    .in('assignment_id', sortedAssignments.map(a => a.id));

                // Transform to Map
                const gradeMap = {};
                submissionsData?.forEach(sub => {
                    gradeMap[`${sub.student_id}_${sub.assignment_id}`] = sub.grade;
                });
                setGrades(gradeMap);
            } else {
                setGrades({});
            }

        } catch (error) {
            console.error("Error fetching gradebook:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Grade Change
    const handleGradeChange = (studentId, assignmentId, value) => {
        const key = `${studentId}_${assignmentId}`;
        const newGrades = { ...grades, [key]: value };
        setGrades(newGrades);

        // Debounce Save? Or save on blur. 
        // For standard UI, save on Blur or Enter is better to avoid excessive DB calls.
    };

    // Save Grade to DB
    const saveGrade = async (studentId, assignmentId, value) => {
        const score = parseInt(value);
        if (isNaN(score) && value !== '') return; // Allow clear

        setSaving(true);
        try {
            // Check if submission exists? Actually Upsert handles logic if we have unique constraint.
            // Requirement said "UNIQUE(assignment_id, student_id)".

            const payload = {
                assignment_id: assignmentId,
                student_id: studentId,
                grade: value === '' ? null : score,
                status: 'graded'
            };

            // Using upsert based on conflict (assignment_id, student_id)
            const { error } = await supabase
                .from('submissions')
                .upsert(payload, { onConflict: 'assignment_id, student_id' });

            if (error) throw error;

            console.log("Saved grade:", payload);
        } catch (error) {
            console.error("Error saving grade:", error);
            // Revert UI? For now just log.
        } finally {
            setSaving(false);
        }
    };

    // Calculations
    const getStudentAverage = (studentId) => {
        let total = 0;
        let count = 0;
        assignments.forEach(a => {
            const grade = grades[`${studentId}_${a.id}`];
            if (grade !== undefined && grade !== null && grade !== '') {
                // Normalize to percentage? Assuming points are weighted? 
                // Simple average for now: (Grade / Points) * 100
                const points = a.points || 100;
                total += (parseInt(grade) / points) * 100;
                count++;
            }
        });
        return count === 0 ? '-' : Math.round(total / count) + '%';
    };

    const getAssignmentAverage = (assignmentId) => {
        let total = 0;
        let count = 0;
        students.forEach(s => {
            const grade = grades[`${s.id}_${assignmentId}`];
            if (grade !== undefined && grade !== null && grade !== '') {
                total += parseInt(grade);
                count++;
            }
        });
        return count === 0 ? '-' : Math.round(total / count);
    };

    return (
        <div className="p-8 max-w-[95vw] mx-auto min-h-screen animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gradebook</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage grades and track student performance.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                        <Download size={18} />
                        Export CSV
                    </button>
                    <div className="relative min-w-[200px]">
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none shadow-sm"
                        >
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-400">Loading gradebook data...</div>
            ) : assignments.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
                    <p className="text-slate-500 font-medium">No assignments found for this class. Create assignments to start grading.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="sticky left-0 bg-slate-50 z-20 p-4 min-w-[200px] border-r border-slate-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.1)]">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</div>
                                </th>
                                {assignments.map(a => (
                                    <th key={a.id} className="p-4 min-w-[120px] text-center border-r border-slate-100 last:border-0 relative group">
                                        <div className="text-xs font-bold text-slate-700 truncate max-w-[150px] mx-auto" title={a.title}>{a.title}</div>
                                        <div className="text-[10px] font-bold text-slate-400 mt-1">{a.points} pts</div>
                                        <div className="absolute inset-x-0 -bottom-8 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs p-2 rounded z-30 transition-opacity">
                                            {a.title} ({a.type})
                                        </div>
                                    </th>
                                ))}
                                <th className="p-4 min-w-[100px] text-center bg-indigo-50/50 text-indigo-900 border-l border-indigo-100">
                                    <div className="text-xs font-bold uppercase tracking-wider">Average</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 p-4 border-r border-slate-200 font-bold text-slate-800 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                                        {student.full_name}
                                    </td>
                                    {assignments.map(a => {
                                        const grade = grades[`${student.id}_${a.id}`] ?? '';
                                        return (
                                            <td key={a.id} className="p-2 border-r border-slate-100 text-center">
                                                <input
                                                    type="number"
                                                    value={grade}
                                                    onChange={(e) => handleGradeChange(student.id, a.id, e.target.value)}
                                                    onBlur={(e) => saveGrade(student.id, a.id, e.target.value)}
                                                    className={`w-16 text-center py-1.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-bold text-sm ${grade === '' ? 'bg-slate-50 border-slate-200 text-slate-400' :
                                                            grade < (a.points * 0.6) ? 'bg-rose-50 border-rose-200 text-rose-600' :
                                                                'bg-white border-slate-200 text-slate-700'
                                                        }`}
                                                    placeholder="-"
                                                />
                                            </td>
                                        );
                                    })}
                                    <td className="p-4 text-center font-black text-indigo-600 bg-indigo-50/30 border-l border-indigo-100">
                                        {getStudentAverage(student.id)}
                                    </td>
                                </tr>
                            ))}

                            {/* Footer: Class Averages */}
                            <tr className="bg-slate-50 border-t border-slate-200 font-bold">
                                <td className="sticky left-0 bg-slate-50 z-10 p-4 border-r border-slate-200 text-slate-500 text-xs uppercase tracking-wider shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                                    Class Average
                                </td>
                                {assignments.map(a => (
                                    <td key={a.id} className="p-4 text-center text-slate-600 border-r border-slate-200">
                                        {getAssignmentAverage(a.id)}
                                    </td>
                                ))}
                                <td className="bg-indigo-50/50 border-l border-indigo-100"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {saving && (
                <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-fade-in-up z-50">
                    <Loader2 size={18} className="animate-spin text-emerald-400" />
                    <span className="font-bold text-sm">Saving grades...</span>
                </div>
            )}
        </div>
    );
};

export default TeacherGradebook;
