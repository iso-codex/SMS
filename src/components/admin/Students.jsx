import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Loader2, GraduationCap, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('all');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        // Placeholder - replace with actual Supabase query
        setTimeout(() => {
            setStudents([
                { id: 1, name: 'Eleanor Pena', roll: '#01', address: 'TA-107 Newyork', class: '01', dob: '02/05/2001', phone: '+123 6988567' },
                { id: 2, name: 'Jessia Rose', roll: '#10', address: 'TA-107 Newyork', class: '02', dob: '03/04/2000', phone: '+123 8988569' },
                { id: 3, name: 'Jenny Wilson', roll: '#04', address: 'Australia, Sydney', class: '01', dob: '12/05/2001', phone: '+123 7988566' },
                { id: 4, name: 'Guy Hawkins', roll: '#03', address: 'Australia, Sydney', class: '02', dob: '03/05/2001', phone: '+123 5988565' },
            ]);
            setLoading(false);
        }, 500);
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.roll.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = filterClass === 'all' || student.class === filterClass;
        return matchesSearch && matchesClass;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Students List</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage all student records and information.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                    <Plus size={20} />
                    <span>Add Students</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <Search className="text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or roll..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <Filter className="text-slate-400" size={20} />
                    <select
                        className="bg-transparent border-none focus:outline-none text-slate-700 font-medium cursor-pointer"
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                    >
                        <option value="all">All Classes</option>
                        <option value="01">Class 01</option>
                        <option value="02">Class 02</option>
                        <option value="03">Class 03</option>
                        <option value="04">Class 04</option>
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Student's Name</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Roll</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Address</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Class</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Date of Birth</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Phone</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-10 text-center text-slate-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        Loading students...
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-10 text-center text-slate-500 font-medium">
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200">
                                                    {student.name[0]}
                                                </div>
                                                <div className="font-bold text-slate-900">{student.name}</div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-600 font-medium">{student.roll}</td>
                                        <td className="p-6 text-slate-600 font-medium">{student.address}</td>
                                        <td className="p-6 text-slate-600 font-medium">{student.class}</td>
                                        <td className="p-6 text-slate-600 font-medium">{student.dob}</td>
                                        <td className="p-6 text-slate-600 font-medium">{student.phone}</td>
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Students;
