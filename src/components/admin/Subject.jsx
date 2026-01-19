import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, BookOpen } from 'lucide-react';

const Subject = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subjects] = useState([
        { id: 1, name: 'Mathematics', code: 'MATH101', teacher: 'John Smith', class: 'Class 01', hours: 5 },
        { id: 2, name: 'English', code: 'ENG101', teacher: 'Sarah Johnson', class: 'Class 01', hours: 4 },
        { id: 3, name: 'Science', code: 'SCI101', teacher: 'Michael Brown', class: 'Class 02', hours: 6 },
        { id: 4, name: 'History', code: 'HIST101', teacher: 'Emily Davis', class: 'Class 02', hours: 3 },
    ]);

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subject Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage subjects and curriculum.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                    <Plus size={20} />
                    <span>Add Subject</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search subjects..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Subjects Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Subject Name</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Code</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Teacher</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Class</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Hours/Week</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredSubjects.map((subject) => (
                                <tr key={subject.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                                <BookOpen size={20} />
                                            </div>
                                            <div className="font-bold text-slate-900">{subject.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-600 font-medium">{subject.code}</td>
                                    <td className="p-6 text-slate-600 font-medium">{subject.teacher}</td>
                                    <td className="p-6 text-slate-600 font-medium">{subject.class}</td>
                                    <td className="p-6 text-slate-600 font-medium">{subject.hours}</td>
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

export default Subject;
