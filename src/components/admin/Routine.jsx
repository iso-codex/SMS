import React, { useState, useEffect } from 'react';
import { Calendar, Users, ChevronRight, Loader2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ClassRoutineModal from './modals/ClassRoutineModal';
import AddRoutineModal from './modals/AddRoutineModal';

const Routine = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00'];

    // Placeholder schedule data - in a real app, this would be fetched based on the class ID
    const [schedule, setSchedule] = useState({
        Monday: ['Mathematics', 'English', 'Break', 'Science', 'History', 'Physical Ed', 'Art'],
        Tuesday: ['English', 'Mathematics', 'Break', 'Science', 'Geography', 'Music', 'Library'],
        Wednesday: ['Science', 'Mathematics', 'Break', 'English', 'Computer', 'History', 'Sports'],
        Thursday: ['Mathematics', 'Science', 'Break', 'English', 'Art', 'Geography', 'Music'],
        Friday: ['English', 'History', 'Break', 'Mathematics', 'Science', 'Physical Ed', 'Assembly'],
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const { data: classesData, error } = await supabase
                .from('classes')
                .select('*')
                .order('grade_level');

            if (error) throw error;
            setClasses(classesData || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClassClick = (cls) => {
        setSelectedClass(cls);
        setIsRoutineModalOpen(true);
    };

    const handleAddSuccess = (data) => {
        // In a real app, you would refresh the data here
        console.log('Routine added successfully', data);
        // Since we only have one schedule state for all classes in this demo:
        setSchedule(data.schedule);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Class Routines</h1>
                    <p className="text-slate-500 font-medium mt-2">Select a class to view its weekly schedule.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
                >
                    <Plus size={20} />
                    <span>New Routine</span>
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-purple-600" size={40} />
                </div>
            ) : classes.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <p className="text-slate-500 font-medium">No classes found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => handleClassClick(cls)}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                    <Calendar size={24} />
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-purple-50 transition-colors">
                                    <ChevronRight size={20} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{cls.name}</h3>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                    <span>Grade {cls.grade_level}</span>
                                    {cls.section && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span>Section {cls.section}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Users size={16} />
                                    <span>View Schedule</span>
                                </div>
                                <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">Open</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ClassRoutineModal
                isOpen={isRoutineModalOpen}
                onClose={() => setIsRoutineModalOpen(false)}
                selectedClass={selectedClass}
                schedule={schedule}
                days={days}
                timeSlots={timeSlots}
            />

            <AddRoutineModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleAddSuccess}
                classes={classes}
            />
        </div>
    );
};

export default Routine;
