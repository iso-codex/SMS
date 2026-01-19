import React, { useState } from 'react';
import { Search, Plus, BookOpen, Edit2, Trash2, Calendar } from 'lucide-react';

const Library = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [books] = useState([
        { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', copies: 15, available: 12, category: 'Computer Science' },
        { id: 2, title: 'Physics for Scientists', author: 'Raymond A. Serway', isbn: '978-1133954057', copies: 20, available: 18, category: 'Science' },
        { id: 3, title: 'World History', author: 'William J. Duiker', isbn: '978-1305091221', copies: 10, available: 7, category: 'History' },
        { id: 4, title: 'English Literature', author: 'M.H. Abrams', isbn: '978-0393975659', copies: 12, available: 10, category: 'Literature' },
    ]);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Library</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage books, inventory, and borrowing records.</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                    <Plus size={20} />
                    <span>Add Book</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search books by title or author..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Book Title</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Author</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">ISBN</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Category</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Total</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Available</th>
                                <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredBooks.map((book) => (
                                <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                                <BookOpen size={20} />
                                            </div>
                                            <div className="font-bold text-slate-900">{book.title}</div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-600 font-medium">{book.author}</td>
                                    <td className="p-6 text-slate-600 font-medium">{book.isbn}</td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                            {book.category}
                                        </span>
                                    </td>
                                    <td className="p-6 text-slate-600 font-medium">{book.copies}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${book.available > 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {book.available}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Library;
