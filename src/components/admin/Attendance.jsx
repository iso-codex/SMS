import React, { useState } from 'react';
import { Calendar, Search, Filter, CheckCircle, XCircle } from 'lucide-react';

const Attendance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('01');
    const [students] = useState([
        { id: 1, name: 'Eleanor Pena', roll: '#01', status: 'present' },
        { id: 2, name: 'Jessia Rose', roll: '#10', status: 'present' },
        { id: 3, name: 'Jenny Wilson', roll: '#04', status: 'absent' },
        { id: 4, name: 'Guy Hawkins', roll: '#03', status: 'present' },
        { id: 5, name: 'Jacob Jones', roll: '#15', status: 'present' },
    ]);

    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendance</h1>
                <p className="text-slate-500 font-medium mt-2">Track and manage student attendance.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Students</p>
                            <p className="text-3xl font-black text-slate-900">{students.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                            <Calendar size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Present</p>
                            <p className="text-3xl font-black text-emerald-600">{presentCount}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Absent</p>
                            <p className="text-3xl font-black text-red-600">{absentCount}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                            <XCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <Calendar className="text-slate-400" size={20} />
                    <input
                        type="date"
                        className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <Filter className="text-slate-400" size={20} />
                    <select
                        className="bg-transparent border-none focus:outline-none text-slate-700 font-medium cursor-pointer"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="01">Class 01</option>
                        <option value="02">Class 02</option>
                        <option value="03">Class 03</option>
                        <option value="04">Class 04</option>
                    </select>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Roll</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Student Name</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Status</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 text-slate-600 font-medium">{student.roll}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200">
                                                {student.name[0]}
                                            </div>
                                            <div className="font-bold text-slate-900">{student.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.status === 'present'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {student.status === 'present' ? 'Present' : 'Absent'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-colors">
                                            Mark Attendance
                                        </button>
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

export default Attendance;
