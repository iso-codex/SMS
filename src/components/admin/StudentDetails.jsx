import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, GraduationCap, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDetails = () => {
    const navigate = useNavigate();

    // Placeholder data
    const student = {
        name: 'Eleanor Pena',
        roll: '#01',
        class: '01',
        dob: '02/05/2001',
        email: 'eleanor.pena@school.com',
        phone: '+123 6988567',
        address: 'TA-107 Newyork',
        guardianName: 'John Pena',
        guardianPhone: '+123 6988568',
        admissionDate: '01/09/2020',
        bloodGroup: 'O+',
        gender: 'Female'
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <button
                onClick={() => navigate('/admin/students')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back to Students</span>
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                            {student.name[0]}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black mb-2">{student.name}</h1>
                            <div className="flex items-center gap-4 text-purple-100">
                                <span className="font-medium">Roll: {student.roll}</span>
                                <span>•</span>
                                <span className="font-medium">Class: {student.class}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="p-8">
                    <h2 className="text-xl font-black text-slate-900 mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <Mail size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Email</div>
                                <div className="text-slate-900 font-medium">{student.email}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <Phone size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</div>
                                <div className="text-slate-900 font-medium">{student.phone}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Address</div>
                                <div className="text-slate-900 font-medium">{student.address}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</div>
                                <div className="text-slate-900 font-medium">{student.dob}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <User size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</div>
                                <div className="text-slate-900 font-medium">{student.gender}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <GraduationCap size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Admission Date</div>
                                <div className="text-slate-900 font-medium">{student.admissionDate}</div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 mb-6 mt-8">Guardian Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <User size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Guardian Name</div>
                                <div className="text-slate-900 font-medium">{student.guardianName}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <Phone size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Guardian Phone</div>
                                <div className="text-slate-900 font-medium">{student.guardianPhone}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;
