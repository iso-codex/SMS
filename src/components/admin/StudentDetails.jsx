import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, GraduationCap, User, Search, Filter, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Modal from '../shared/Modal';

const StudentDetails = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    classes:class_id (
                        id,
                        name,
                        grade_level
                    )
                `)
                .eq('role', 'student')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setStudents(data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Details</h1>
                <p className="text-slate-500 font-medium mt-2">View detailed profiles of all students.</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name, roll number, or email..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Students Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-20 text-slate-500">
                    <Loader2 className="animate-spin mr-2" /> Loading students...
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="text-center p-20 text-slate-500 font-medium">
                    No students found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            onClick={() => setSelectedStudent(student)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold group-hover:scale-105 transition-transform">
                                    {student.full_name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                                        {student.full_name}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium">{student.email}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Roll Number:</span>
                                    <span className="font-bold text-slate-700">{student.roll_number}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Class:</span>
                                    <span className="font-bold text-slate-700">
                                        {student.classes?.name || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Student Details Modal */}
            <Modal
                isOpen={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
                title="Student Profile"
                size="lg"
            >
                {selectedStudent && (
                    <div className="space-y-8">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 -mx-6 -mt-6 mb-6 text-white text-center sm:text-left sm:flex sm:items-center sm:gap-6">
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30 mx-auto sm:mx-0 shrink-0">
                                {selectedStudent.full_name?.[0]}
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <h2 className="text-3xl font-black mb-1">{selectedStudent.full_name}</h2>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-purple-100 text-sm font-medium">
                                    <span>Roll: {selectedStudent.roll_number}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>Class: {selectedStudent.classes?.name}</span>
                                    {selectedStudent.student_code && (
                                        <>
                                            <span className="hidden sm:inline">•</span>
                                            <span className="bg-white/20 px-2 py-0.5 rounded text-white font-bold tracking-widest">
                                                Code: {selectedStudent.student_code}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Sections */}
                        <div>
                            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                <User className="text-purple-600" size={20} /> Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem icon={Mail} label="Email" value={selectedStudent.email} />
                                <DetailItem icon={Phone} label="Phone" value={selectedStudent.phone} />
                                <DetailItem icon={Calendar} label="Date of Birth" value={selectedStudent.date_of_birth} />
                                <DetailItem icon={User} label="Gender" value={selectedStudent.gender} />
                                <DetailItem icon={User} label="Blood Group" value={selectedStudent.blood_group} />
                                <DetailItem icon={MapPin} label="Address" value={selectedStudent.address} fullWidth />
                            </div>
                        </div>

                        {/* Guardian Section */}
                        {(selectedStudent.parent_name || selectedStudent.parent_phone) && (
                            <div>
                                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <User className="text-purple-600" size={20} /> Guardian Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DetailItem icon={User} label="Guardian Name" value={selectedStudent.parent_name} />
                                    <DetailItem icon={Phone} label="Guardian Phone" value={selectedStudent.parent_phone} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

// Helper Component for Details
const DetailItem = ({ icon: Icon, label, value, fullWidth = false }) => {
    if (!value) return null;
    return (
        <div className={`flex items-start gap-3 p-4 bg-slate-50 rounded-xl ${fullWidth ? 'md:col-span-2' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                <Icon size={18} />
            </div>
            <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
                <div className="text-slate-900 font-medium break-words leading-relaxed">{value}</div>
            </div>
        </div>
    );
};

export default StudentDetails;
