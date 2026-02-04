import React, { useState, useEffect } from 'react';
import { Loader2, Plus } from 'lucide-react';
import Modal from '../../shared/Modal';
import { supabase } from '../../../lib/supabase';

const AddRoutineModal = ({ isOpen, onClose, onSuccess, classes = [] }) => {
    const [loading, setLoading] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [error, setError] = useState('');

    // Default structure matching the view modal
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00'];

    const [schedule, setSchedule] = useState({
        Monday: Array(7).fill(''),
        Tuesday: Array(7).fill(''),
        Wednesday: Array(7).fill(''),
        Thursday: Array(7).fill(''),
        Friday: Array(7).fill(''),
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedClassId('');
            setSchedule({
                Monday: Array(7).fill(''),
                Tuesday: Array(7).fill(''),
                Wednesday: Array(7).fill(''),
                Thursday: Array(7).fill(''),
                Friday: Array(7).fill(''),
            });
            setError('');
        }
    }, [isOpen]);

    const handleCellChange = (day, index, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day].map((item, i) => i === index ? value : item)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedClassId) {
            setError('Please select a class.');
            return;
        }

        setLoading(true);

        try {
            // In a real application, you would save this to a 'routines' table
            // For now, we will simulate a save or just log it since we are mocking the routine data in the main view
            // const { error } = await supabase.from('routines').insert({ ... });

            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 800));

            console.log('Saving routine for class:', selectedClassId, schedule);

            onSuccess({ classId: selectedClassId, schedule });
            onClose();
        } catch (err) {
            console.error('Error saving routine:', err);
            setError('Failed to save routine. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Class Routine"
            size="xl" // Making it extra large for the grid
            fullWidth={true}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Select Class <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                        <option value="">Choose a class...</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} (Grade {cls.grade_level})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 text-left font-bold text-slate-500 text-sm w-32 sticky left-0 bg-slate-50 z-10">Time Data</th>
                                    {days.map(day => (
                                        <th key={day} className="p-4 text-center font-bold text-slate-500 text-sm min-w-[140px]">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {timeSlots.map((time, index) => (
                                    <tr key={time} className="hover:bg-slate-50/30">
                                        <td className="p-3 text-xs font-semibold text-slate-500 sticky left-0 bg-white z-10 border-r border-slate-100">
                                            {time}
                                        </td>
                                        {days.map(day => (
                                            <td key={`${day}-${index}`} className="p-2">
                                                <input
                                                    type="text"
                                                    value={schedule[day][index]}
                                                    onChange={(e) => handleCellChange(day, index, e.target.value)}
                                                    placeholder="Subject..."
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all text-center"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        {loading ? 'Saving...' : 'Save Routine'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddRoutineModal;
