import React from 'react';
import { Users, MoreHorizontal, BookOpen } from 'lucide-react';

const TeacherClasses = () => {
    // Mock Data - In real app, fetch assigned classes
    const classes = [
        { id: 1, name: 'Class 10-A', subject: 'Mathematics', students: 45, room: 'Room 101' },
        { id: 2, name: 'Class 9-B', subject: 'Physics', students: 38, room: 'Lab 2' },
        { id: 3, name: 'Class 11-C', subject: 'Mathematics', students: 42, room: 'Room 204' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Classes</h1>
                <p className="text-slate-500 font-medium mt-2">Manage your assigned classes and students.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all group overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">{cls.name}</h3>
                                    <p className="text-blue-100 font-medium text-sm mt-1">{cls.subject}</p>
                                </div>
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                    <BookOpen size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Users size={18} />
                                    <span className="font-bold">{cls.students} Students</span>
                                </div>
                                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
                                    {cls.room}
                                </span>
                            </div>

                            <hr className="border-slate-100 mb-6" />

                            <div className="flex gap-2">
                                <button className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors">
                                    View Students
                                </button>
                                <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherClasses;
