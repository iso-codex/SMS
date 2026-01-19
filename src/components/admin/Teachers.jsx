import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Users, Mail, Phone } from 'lucide-react';

const Teachers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [teachers] = useState([
        { id: 1, name: 'John Smith', subject: 'Mathematics', email: 'john.smith@school.com', phone: '+123 4567890', experience: '10 years' },
        { id: 2, name: 'Sarah Johnson', subject: 'English', email: 'sarah.j@school.com', phone: '+123 4567891', experience: '8 years' },
        { id: 3, name: 'Michael Brown', subject: 'Science', email: 'michael.b@school.com', phone: '+123 4567892', experience: '12 years' },
        { id: 4, name: 'Emily Davis', subject: 'History', email: 'emily.d@school.com', phone: '+123 4567893', experience: '6 years' },
    ]);

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Teachers</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage teaching staff and their assignments.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                    <Plus size={20} />
                    <span>Add Teacher</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search teachers by name or subject..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                    <div key={teacher.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl border-2 border-purple-200">
                                {teacher.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{teacher.name}</h3>
                        <p className="text-purple-600 font-medium mb-4">{teacher.subject}</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Mail size={16} className="text-slate-400" />
                                <span className="font-medium">{teacher.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Phone size={16} className="text-slate-400" />
                                <span className="font-medium">{teacher.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Users size={16} className="text-slate-400" />
                                <span className="font-medium">{teacher.experience}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Teachers;
