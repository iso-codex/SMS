import React from 'react';
import { Home, Phone, User, MapPin } from 'lucide-react';

const StudentHostel = () => {
    // Mock data
    const hostelInfo = {
        name: 'Sapphire Boys Hostel',
        block: 'Block A',
        room: '304',
        bed: 'B2',
        warden: {
            name: 'Mr. Robert Wilson',
            phone: '+1 234 567 8900',
            email: 'warden.sapphire@school.edu'
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Hostel Information</h1>
            <p className="text-slate-500 font-medium mb-8">Details about your accommodation and warden contact.</p>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-2xl">
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Home size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm tracking-wider uppercase mb-2">
                            <MapPin size={16} />
                            Residence Details
                        </div>
                        <h2 className="text-3xl font-bold">{hostelInfo.name}</h2>
                        <div className="flex gap-4 mt-6">
                            <div className="bg-slate-800/50 p-3 rounded-xl backdrop-blur-sm border border-slate-700/50">
                                <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Block</span>
                                <span className="text-xl font-bold">{hostelInfo.block}</span>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl backdrop-blur-sm border border-slate-700/50">
                                <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Room</span>
                                <span className="text-xl font-bold">{hostelInfo.room}</span>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl backdrop-blur-sm border border-slate-700/50">
                                <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Bed</span>
                                <span className="text-xl font-bold">{hostelInfo.bed}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <User className="text-indigo-600" />
                        Warden Contact
                    </h3>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                            {hostelInfo.warden.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-lg">{hostelInfo.warden.name}</h4>
                            <div className="flex flex-col gap-1 mt-1 text-slate-600 font-medium text-sm">
                                <span className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-pointer">
                                    <Phone size={14} />
                                    {hostelInfo.warden.phone}
                                </span>
                                <span className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-pointer">
                                    <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px] border border-current rounded-full">@</span>
                                    {hostelInfo.warden.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentHostel;
