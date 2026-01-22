import React from 'react';
import { Calendar, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const StudentExam = () => {
    const upcomingExams = [
        { subject: 'Mathematics Final', date: '2024-05-15', time: '09:00 AM', duration: '2 Hours', type: 'Offline' },
        { subject: 'Physics Mid-term', date: '2024-05-18', time: '10:00 AM', duration: '1.5 Hours', type: 'Offline' },
        { subject: 'Computer Science', date: '2024-05-20', time: '11:00 AM', duration: '1 Hour', type: 'Online' },
    ];

    const onlineTests = [
        { id: 1, title: 'English Grammar Quiz', availableUntil: '2024-05-10', duration: '45 mins', status: 'Available' },
        { id: 2, title: 'Science General Knowledge', availableUntil: '2024-05-12', duration: '30 mins', status: 'Enrolled' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Exams & Tests</h1>
                <p className="text-slate-500 font-medium mt-2">Manage your upcoming exams and online tests.</p>
            </div>

            {/* Upcoming Exams */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Upcoming Exams</h2>
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {upcomingExams.length} Scheduled
                    </span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingExams.map((exam, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                                    <Calendar className="text-indigo-600" size={24} />
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${exam.type === 'Online' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {exam.type}
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">{exam.subject}</h3>
                            <div className="space-y-2 mt-4 text-sm text-slate-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    {exam.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    {exam.time} ({exam.duration})
                                </div>
                            </div>
                            <button className="w-full mt-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-600 font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all">
                                Download Syllabus
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Online Tests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Online Tests</h2>
                    <div className="space-y-4">
                        {onlineTests.map((test) => (
                            <div key={test.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                                <div>
                                    <h4 className="font-bold text-slate-800">{test.title}</h4>
                                    <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {test.duration}
                                        </span>
                                        <span className="flex items-center gap-1 text-orange-500">
                                            <AlertCircle size={12} /> Ends {test.availableUntil}
                                        </span>
                                    </div>
                                </div>
                                {test.status === 'Enrolled' ? (
                                    <button className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-500/20">
                                        Start
                                    </button>
                                ) : (
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                                        Enroll
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white">
                    <h2 className="text-2xl font-black mb-4">Exam Materials</h2>
                    <p className="text-indigo-100 font-medium mb-8">
                        Access past papers, model answers, and study guides for your upcoming examinations.
                    </p>
                    <button className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                        <Download size={20} />
                        Visit Download Center
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentExam;
