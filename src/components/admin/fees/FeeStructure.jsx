import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../shared/Toast';

const FeeStructure = () => {
    const [activeTab, setActiveTab] = useState('types'); // 'types' or 'structures'
    const [feeTypes, setFeeTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Fee Type State
    const [newFeeType, setNewFeeType] = useState({ name: '', description: '' });
    const [isAddingType, setIsAddingType] = useState(false);

    useEffect(() => {
        fetchFeeTypes();
    }, []);

    const fetchFeeTypes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('fee_types')
                .select('*')
                .order('name');
            if (error) throw error;
            setFeeTypes(data || []);
        } catch (error) {
            console.error('Error fetching fee types:', error);
            showToast('Failed to load fee types', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddFeeType = async () => {
        if (!newFeeType.name) return showToast('Name is required', 'error');
        try {
            const { error } = await supabase
                .from('fee_types')
                .insert([newFeeType]);
            if (error) throw error;
            showToast('Fee type created', 'success');
            setNewFeeType({ name: '', description: '' });
            setIsAddingType(false);
            fetchFeeTypes();
        } catch (error) {
            showToast('Failed to create fee type', 'error');
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-100">
                <button
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'types' ? 'bg-slate-50 text-purple-600 border-b-2 border-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('types')}
                >
                    Fee Types
                </button>
                <button
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'structures' ? 'bg-slate-50 text-purple-600 border-b-2 border-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('structures')}
                >
                    Class Fee Structures
                </button>
            </div>

            <div className="p-6">
                {activeTab === 'types' && (
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Fee Categories</h3>
                            <button
                                onClick={() => setIsAddingType(true)}
                                className="flex items-center gap-2 text-purple-600 font-bold hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors"
                            >
                                <Plus size={18} /> Add New Type
                            </button>
                        </div>

                        {isAddingType && (
                            <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-200 animate-in slide-in-from-top-2">
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={newFeeType.name}
                                            onChange={(e) => setNewFeeType({ ...newFeeType, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                                            placeholder="e.g. Tuition Fee"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={newFeeType.description}
                                            onChange={(e) => setNewFeeType({ ...newFeeType, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                                            placeholder="Optional description"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setIsAddingType(false)}
                                            className="px-3 py-2 text-slate-500 font-bold hover:bg-slate-200 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddFeeType}
                                            className="px-3 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700"
                                        >
                                            Save Fee Type
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {feeTypes.map((type) => (
                                <div key={type.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{type.name}</h4>
                                        {type.description && <p className="text-sm text-slate-500">{type.description}</p>}
                                    </div>
                                    {/* Actions can be added here later */}
                                </div>
                            ))}
                            {!loading && feeTypes.length === 0 && (
                                <div className="text-center py-10 text-slate-400">No fee types defined yet.</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'structures' && (
                    <FeeStructureManager feeTypes={feeTypes} showToast={showToast} />
                )}
            </div>
        </div>
    );
};

// Sub-component for structures (to keep file clean, usually would be separate)
const FeeStructureManager = ({ feeTypes, showToast }) => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('Term 1');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [structures, setStructures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newFee, setNewFee] = useState({ fee_type_id: '', amount: '' });

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStructures();
        } else {
            setStructures([]);
        }
    }, [selectedClass, selectedTerm, year]);

    const fetchClasses = async () => {
        const { data } = await supabase.from('classes').select('id, name, grade_level').order('grade_level');
        setClasses(data || []);
    };

    const fetchStructures = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('fee_structures')
            .select(`
                *,
                fee_type:fee_types(name)
            `)
            .eq('class_id', selectedClass)
            .eq('term', selectedTerm)
            .eq('academic_year', year);

        if (!error) setStructures(data || []);
        setLoading(false);
    };

    const handleAddStructure = async () => {
        if (!selectedClass || !newFee.fee_type_id || !newFee.amount) {
            return showToast('Please fill all fields', 'error');
        }

        try {
            const { error } = await supabase.from('fee_structures').insert([{
                class_id: selectedClass,
                fee_type_id: newFee.fee_type_id,
                amount: parseFloat(newFee.amount),
                academic_year: year,
                term: selectedTerm
            }]);

            if (error) throw error;
            showToast('Fee added successfully', 'success');
            setIsAdding(false);
            setNewFee({ fee_type_id: '', amount: '' });
            fetchStructures();
        } catch (error) {
            showToast('Failed to add fee', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase.from('fee_structures').delete().eq('id', id);
            if (error) throw error;
            showToast('Fee removed', 'success');
            fetchStructures();
        } catch (e) { showToast('Failed to delete', 'error'); }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Class</label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                    >
                        <option value="">Select a Class</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.grade_level})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Term</label>
                    <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                    >
                        <option>Term 1</option>
                        <option>Term 2</option>
                        <option>Term 3</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Academic Year</label>
                    <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>
            </div>

            {selectedClass ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-slate-900">Fee Breakdown</h4>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="text-purple-600 font-bold hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Plus size={18} /> Add Fee Item
                        </button>
                    </div>

                    {isAdding && (
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Fee Type</label>
                                <select
                                    value={newFee.fee_type_id}
                                    onChange={(e) => setNewFee({ ...newFee, fee_type_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                >
                                    <option value="">Select Type</option>
                                    {feeTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Amount (GH₵)</label>
                                <input
                                    type="number"
                                    value={newFee.amount}
                                    onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsAdding(false)} className="flex-1 py-2 bg-slate-100 rounded-lg font-bold text-sm text-slate-600">Cancel</button>
                                <button onClick={handleAddStructure} className="flex-1 py-2 bg-purple-600 rounded-lg font-bold text-sm text-white">Save</button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        {structures.map(structure => (
                            <div key={structure.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100">
                                <span className="font-medium text-slate-700">{structure.fee_type?.name}</span>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-slate-900">GH₵ {structure.amount}</span>
                                    <button onClick={() => handleDelete(structure.id)} className="text-red-400 hover:text-red-600">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {structures.length === 0 && !loading && (
                            <div className="text-center py-6 text-slate-400 text-sm">No fees assigned for this term.</div>
                        )}
                        {structures.length > 0 && (
                            <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-4">
                                <span className="font-bold text-slate-900">Total Term Fee</span>
                                <span className="font-black text-purple-600 text-lg">
                                    GH₵ {structures.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 mb-6">
                    Please select a class to manage fees.
                </div>
            )}
        </div>
    );
};

export default FeeStructure;
