import React, { useState } from 'react';
import { Clock, Plus } from 'lucide-react';

const Routine = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00'];

    const [schedule] = useState({
        Monday: ['Mathematics', 'English', 'Break', 'Science', 'History', 'Physical Ed', 'Art'],
        Tuesday: ['English', 'Mathematics', 'Break', 'Science', 'Geography', 'Music', 'Library'],
        Wednesday: ['Science', 'Mathematics', 'Break', 'English', 'Computer', 'History', 'Sports'],
        Thursday: ['Mathematics', 'Science', 'Break', 'English', 'Art', 'Geography', 'Music'],
        Friday: ['English', 'History', 'Break', 'Mathematics', 'Science', 'Physical Ed', 'Assembly'],
    });

    const getSubjectColor = (subject) => {
        const colors = {
            'Mathematics': 'bg-blue-100 text-blue-700 border-blue-200',
            'English': 'bg-purple-100 text-purple-700 border-purple-200',
            'Science': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'History': 'bg-orange-100 text-orange-700 border-orange-200',
            'Geography': 'bg-teal-100 text-teal-700 border-teal-200',
            'Break': 'bg-slate-100 text-slate-600 border-slate-200',
            'Physical Ed': 'bg-red-100 text-red-700 border-red-200',
            'Art': 'bg-pink-100 text-pink-700 border-pink-200',
            'Music': 'bg-indigo-100 text-indigo-700 border-indigo-200',
            'Computer': 'bg-cyan-100 text-cyan-700 border-cyan-200',
            'Library': 'bg-amber-100 text-amber-700 border-amber-200',
            'Sports': 'bg-lime-100 text-lime-700 border-lime-200',
            'Assembly': 'bg-violet-100 text-violet-700 border-violet-200',
        };
        return colors[subject] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Class Routine</h1>
                    <p className="text-slate-500 font-medium mt-2">Weekly schedule and timetable management.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                    <Plus size={20} />
                    <span>Edit Schedule</span>
                </button>
            </div>

            {/* Timetable */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider text-left sticky left-0 bg-slate-50">Time</th>
                                {days.map(day => (
                                    <th key={day} className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider text-center min-w-[150px]">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map((time, index) => (
                                <tr key={time} className="border-b border-slate-50">
                                    <td className="p-4 font-medium text-slate-600 text-sm sticky left-0 bg-white">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-slate-400" />
                                            {time}
                                        </div>
                                    </td>
                                    {days.map(day => (
                                        <td key={day} className="p-4">
                                            <div className={`px-3 py-2 rounded-lg text-center text-sm font-bold border ${getSubjectColor(schedule[day][index])}`}>
                                                {schedule[day][index]}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Routine;
