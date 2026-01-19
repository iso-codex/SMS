import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, User, X, Loader2, Shield, GraduationCap, UserCheck, Users, Edit3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'student'
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching users:', error);
        else setUsers(data || []);
        setLoading(false);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            const { data, error } = await supabase.rpc('create_user_with_role', {
                email: newUser.email,
                password: newUser.password,
                full_name: newUser.full_name,
                role: newUser.role
            });

            if (error) throw error;

            // Success
            setIsModalOpen(false);
            setNewUser({ email: '', password: '', full_name: '', role: 'student' });
            fetchUsers();
        } catch (err) {
            alert('Error creating user: ' + err.message);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

        try {
            const { error } = await supabase.rpc('delete_user', { target_user_id: userId });
            if (error) throw error;
            fetchUsers();
        } catch (err) {
            alert('Error deleting user: ' + err.message);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const { error } = await supabase.rpc('update_user_role', {
                target_user_id: userId,
                new_role: newRole
            });

            if (error) throw error;

            // Update local state immediately for better UX
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (err) {
            alert('Error updating role: ' + err.message);
            // Refresh to get the correct state
            fetchUsers();
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-blue-100 text-blue-700 border-blue-200',
            teacher: 'bg-purple-100 text-purple-700 border-purple-200',
            student: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            parent: 'bg-orange-100 text-orange-700 border-orange-200'
        };
        const icons = {
            admin: Shield,
            teacher: UserCheck,
            student: GraduationCap,
            parent: Users
        };
        const Icon = icons[role] || User;

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[role] || 'bg-slate-100 text-slate-700'}`}>
                <Icon size={12} />
                <span className="capitalize">{role}</span>
            </span>
        );
    };

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage user accounts and permissions.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98]"
                >
                    <Plus size={20} />
                    <span>Add User</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">User</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Role</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Joined</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-slate-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-slate-500 font-medium">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                                    {user.full_name?.[0] || user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{user.full_name || 'Unnamed'}</div>
                                                    <div className="text-sm text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 group">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-md ${user.role === 'admin' ? 'bg-blue-100 text-blue-700 border-blue-200 focus:ring-blue-600 hover:bg-blue-200' :
                                                        user.role === 'teacher' ? 'bg-purple-100 text-purple-700 border-purple-200 focus:ring-purple-600 hover:bg-purple-200' :
                                                            user.role === 'student' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 focus:ring-emerald-600 hover:bg-emerald-200' :
                                                                user.role === 'parent' ? 'bg-orange-100 text-orange-700 border-orange-200 focus:ring-orange-600 hover:bg-orange-200' :
                                                                    'bg-slate-100 text-slate-700 border-slate-200 focus:ring-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    <option value="student">Student</option>
                                                    <option value="teacher">Teacher</option>
                                                    <option value="parent">Parent</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <Edit3 size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-500 text-sm font-medium">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 m-auto max-w-md h-fit bg-white rounded-3xl shadow-2xl z-50 p-8 border border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-slate-900">Add New User</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                                    <input
                                        type="text" required
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                        placeholder="e.g. John Doe"
                                        value={newUser.full_name}
                                        onChange={e => setNewUser({ ...newUser, full_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                                    <input
                                        type="email" required
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                        placeholder="e.g. john@school.com"
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Role</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="parent">Parent</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                                    <input
                                        type="password" required
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                        placeholder="Set initial password"
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>

                                <button
                                    disabled={creating}
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold mt-4 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {creating && <Loader2 className="animate-spin" />}
                                    {creating ? 'Creating...' : 'Create User'}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
