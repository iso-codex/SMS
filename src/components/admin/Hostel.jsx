import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Home, Users } from 'lucide-react';

const Hostel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [hostels] = useState([
        { id: 1, name: 'Boys Hostel A', warden: 'Mr. Anderson', capacity: 100, occupied: 85, rooms: 50, type: 'Boys' },
        { id: 2, name: 'Boys Hostel B', warden: 'Mr. Thompson', capacity: 80, occupied: 72, rooms: 40, type: 'Boys' },
        { id: 3, name: 'Girls Hostel A', warden: 'Mrs. Johnson', capacity: 90, occupied: 88, rooms: 45, type: 'Girls' },
        { id: 4, name: 'Girls Hostel B', warden: 'Mrs. Williams', capacity: 75, occupied: 65, rooms: 38, type: 'Girls' },
    ]);

    const filteredHostels = hostels.filter(hostel =>
        hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hostel.warden.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hostel Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage hostel facilities and accommodations.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                    <Plus size={20} />
                    <span>Add Hostel</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search hostels..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Hostels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHostels.map((hostel) => (
                    <div key={hostel.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Home size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">{hostel.name}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${hostel.type === 'Boys' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                                        }`}>
                                        {hostel.type}
                                    </span>
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
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-bold text-slate-500">Warden</span>
                                <span className="text-sm font-medium text-slate-900">{hostel.warden}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-bold text-slate-500">Total Rooms</span>
                                <span className="text-sm font-medium text-slate-900">{hostel.rooms}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-bold text-slate-500">Capacity</span>
                                <span className="text-sm font-medium text-slate-900">{hostel.capacity} students</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-bold text-slate-500">Occupied</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${hostel.occupied >= hostel.capacity * 0.9 ? 'text-orange-600' : 'text-emerald-600'}`}>
                                        {hostel.occupied} / {hostel.capacity}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        ({Math.round((hostel.occupied / hostel.capacity) * 100)}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hostel;
