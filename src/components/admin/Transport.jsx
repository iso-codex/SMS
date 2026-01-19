import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Bus, MapPin } from 'lucide-react';

const Transport = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [routes] = useState([
        { id: 1, routeName: 'Route A', busNumber: 'BUS-001', driver: 'James Wilson', capacity: 40, students: 35, area: 'Downtown' },
        { id: 2, routeName: 'Route B', busNumber: 'BUS-002', driver: 'Maria Garcia', capacity: 40, students: 38, area: 'Suburbs' },
        { id: 3, routeName: 'Route C', busNumber: 'BUS-003', driver: 'Robert Brown', capacity: 35, students: 30, area: 'East Side' },
        { id: 4, routeName: 'Route D', busNumber: 'BUS-004', driver: 'Linda Davis', capacity: 35, students: 32, area: 'West Side' },
    ]);

    const filteredRoutes = routes.filter(route =>
        route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Transport Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage bus routes and transportation.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                    <Plus size={20} />
                    <span>Add Route</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search routes or buses..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Routes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRoutes.map((route) => (
                    <div key={route.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Bus size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">{route.routeName}</h3>
                                    <p className="text-purple-600 font-bold">{route.busNumber}</p>
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
                            <div className="flex items-center gap-2 text-slate-600">
                                <MapPin size={16} className="text-slate-400" />
                                <span className="font-medium">{route.area}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-bold text-slate-500">Driver</span>
                                <span className="text-sm font-medium text-slate-900">{route.driver}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-bold text-slate-500">Capacity</span>
                                <span className="text-sm font-medium text-slate-900">{route.capacity} seats</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-bold text-slate-500">Students</span>
                                <span className={`text-sm font-bold ${route.students >= route.capacity * 0.9 ? 'text-orange-600' : 'text-emerald-600'}`}>
                                    {route.students} / {route.capacity}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Transport;
