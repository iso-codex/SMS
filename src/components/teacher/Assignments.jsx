import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Calendar, FileText, MoreVertical, BookOpen, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';
import CreateAssignmentModal from './modals/CreateAssignmentModal';

const TeacherAssignments = () => {
    const { user } = useAuthStore();
    const [assignments, setAssignments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('all');

    useEffect(() => {
        fetchData();
    }, [user?.id]);

    const fetchData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            // Fetch classes for filter and modal
            const { data: classData } = await supabase
                .from('classes')
                .select('id, name')
                .eq('teacher_id', user.id);
            setClasses(classData || []);

            // Fetch assignments with class name
            const { data: assignmentData, error } = await supabase
                .from('assignments')
                .select('*, classes(name)')
                .eq('teacher_id', user.id)
                .order('due_date', { ascending: true });

            if (error) throw error;
            setAssignments(assignmentData || []);
        } catch (error) {
            console.error("Error fetching assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        fetchData(); // Refresh list
    };

    // Filtering
    const filteredAssignments = assignments.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = filterClass === 'all' || a.class_id === filterClass;
        return matchesSearch && matchesClass;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'Homework': return 'bg-blue-100 text-blue-700';
            case 'Project': return 'bg-purple-100 text-purple-700';
            case 'Exam': return 'bg-rose-100 text-rose-700';
            case 'Essay': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assignments</h1>
                    <p className="text-slate-500 font-medium mt-2">Create and manage assignments for your classes.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Assignment
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                    />
                </div>
                <div className="relative w-full md:w-64">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium appearance-none"
                    >
                        <option value="all">All Classes</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />)}
                </div>
            ) : filteredAssignments.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="text-slate-300" size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">No Assignments Found</h2>
                    <p className="text-slate-500 font-medium">Try adjusting your filters or create a new assignment.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredAssignments.map(assignment => (
                        <div key={assignment.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col md:flex-row gap-6">
                            {/* Icon Box */}
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100">
                                <FileText className="text-indigo-500" size={28} />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-slate-800">{assignment.title}</h3>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold w-fit ${getTypeColor(assignment.type)}`}>
                                        {assignment.type}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{assignment.description || 'No description provided.'}</p>

                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-400">
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md">
                                        <BookOpen size={16} />
                                        <span className="text-slate-600">{assignment.classes?.name || 'Unknown Class'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md">
                                        <Clock size={16} />
                                        <span className="text-slate-600">Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md">
                                        <span className="text-slate-600">{assignment.points} Points</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col items-center justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                <button className="w-full md:w-32 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
                                    View
                                </button>
                                <button className="w-full md:w-32 py-2 border border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateAssignmentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
                classes={classes}
            />
        </div>
    );
};

export default TeacherAssignments;
