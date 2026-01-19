import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Users } from 'lucide-react';

const Class = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [classes] = useState([
        { id: 1, name: 'Class 01', section: 'A', students: 35, teacher: 'John Smith', room: '101' },
        { id: 2, name: 'Class 01', section: 'B', students: 32, teacher: 'Sarah Johnson', room: '102' },
        { id: 3, name: 'Class 02', section: 'A', students: 38, teacher: 'Michael Brown', room: '201' },
        { id: 4, name: 'Class 02', section: 'B', students: 30, teacher: 'Emily Davis', room: '202' },
    ]);

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Class Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage classes, sections, and student assignments.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                    <Plus size={20} />
                    <span>Add Class</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search classes..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">{cls.name}</h3>
                                <p className="text-purple-600 font-bold">Section {cls.section}</p>
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
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-bold text-slate-500">Students</span>
                                <span className="text-lg font-black text-slate-900">{cls.students}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-bold text-slate-500">Class Teacher</span>
                                <span className="text-sm font-medium text-slate-900">{cls.teacher}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-bold text-slate-500">Room</span>
                                <span className="text-sm font-medium text-slate-900">{cls.room}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Class;
