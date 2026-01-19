import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Bell, Calendar } from 'lucide-react';

const Notice = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [notices] = useState([
        { id: 1, title: 'School Reopening Announcement', date: '2024-01-15', category: 'General', priority: 'high', content: 'School will reopen on January 20th, 2024.' },
        { id: 2, title: 'Parent-Teacher Meeting', date: '2024-01-18', category: 'Event', priority: 'medium', content: 'PTM scheduled for January 25th.' },
        { id: 3, title: 'Sports Day Celebration', date: '2024-01-20', category: 'Event', priority: 'low', content: 'Annual sports day on February 5th.' },
        { id: 4, title: 'Exam Schedule Released', date: '2024-01-22', category: 'Academic', priority: 'high', content: 'Mid-term exam schedule is now available.' },
    ]);

    const filteredNotices = notices.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPriorityBadge = (priority) => {
        const styles = {
            high: 'bg-red-100 text-red-700 border-red-200',
            medium: 'bg-orange-100 text-orange-700 border-orange-200',
            low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        };
        return styles[priority] || styles.low;
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notice Board</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage announcements and notices.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                    <Plus size={20} />
                    <span>Create Notice</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search notices..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Notices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNotices.map((notice) => (
                    <div key={notice.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                                    <Bell size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-slate-900 mb-1">{notice.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                        <Calendar size={14} />
                                        <span className="font-medium">{notice.date}</span>
                                    </div>
                                </div>
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
                        <p className="text-slate-600 font-medium mb-4">{notice.content}</p>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                {notice.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityBadge(notice.priority)}`}>
                                {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)} Priority
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notice;
