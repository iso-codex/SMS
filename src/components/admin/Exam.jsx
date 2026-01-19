import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ClipboardList, Calendar } from 'lucide-react';

const Exam = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [exams] = useState([
        { id: 1, name: 'Mid-Term Examination', subject: 'Mathematics', class: 'Class 01', date: '2024-02-15', time: '09:00 AM', duration: '2 hours' },
        { id: 2, name: 'Mid-Term Examination', subject: 'English', class: 'Class 01', date: '2024-02-16', time: '09:00 AM', duration: '2 hours' },
        { id: 3, name: 'Final Examination', subject: 'Science', class: 'Class 02', date: '2024-06-10', time: '10:00 AM', duration: '3 hours' },
        { id: 4, name: 'Quiz', subject: 'History', class: 'Class 02', date: '2024-01-25', time: '11:00 AM', duration: '1 hour' },
    ]);

    const filteredExams = exams.filter(exam =>
        exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Exam Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Schedule and manage examinations.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                    <Plus size={20} />
                    <span>Schedule Exam</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search exams..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Exams Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Exam Name</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Subject</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Class</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Date</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Time</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Duration</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredExams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                                <ClipboardList size={20} />
                                            </div>
                                            <div className="font-bold text-slate-900">{exam.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-600 font-medium">{exam.subject}</td>
                                    <td className="p-6 text-slate-600 font-medium">{exam.class}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                                            <Calendar size={16} className="text-slate-400" />
                                            {exam.date}
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-600 font-medium">{exam.time}</td>
                                    <td className="p-6 text-slate-600 font-medium">{exam.duration}</td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Exam;
