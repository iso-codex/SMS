import React, { useState } from 'react';
import { Search, Plus, BookOpen, Edit2, Trash2, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import AddBookModal from './modals/AddBookModal';
import ViewBookModal from './modals/ViewBookModal';

const Library = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const [books, setBooks] = useState([
        { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', copies: 15, available: 12, category: 'Computer Science', documentName: 'intro_algos.pdf' },
        { id: 2, title: 'Physics for Scientists', author: 'Raymond A. Serway', isbn: '978-1133954057', copies: 20, available: 18, category: 'Science', documentName: null },
        { id: 3, title: 'World History', author: 'William J. Duiker', isbn: '978-1305091221', copies: 10, available: 7, category: 'History', documentName: 'world_history.pdf' },
        { id: 4, title: 'English Literature', author: 'M.H. Abrams', isbn: '978-0393975659', copies: 12, available: 10, category: 'Literature', documentName: null },
    ]);

    const handleAddBook = (newBook) => {
        setBooks([newBook, ...books]);
    };

    const handleViewBook = (book) => {
        setSelectedBook(book);
        setIsViewModalOpen(true);
    };

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
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
                >
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

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                    <div key={book.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <BookOpen size={24} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-slate-50 hover:bg-purple-50 text-slate-400 hover:text-purple-600 rounded-lg transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{book.title}</h3>
                            <p className="text-slate-500 font-medium text-sm">{book.author}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 font-medium">ISBN</span>
                                <span className="text-slate-700 font-semibold">{book.isbn}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 font-medium">Category</span>
                                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                                    {book.category}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 font-medium">Status</span>
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${book.available > 0
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-red-50 text-red-700'
                                    }`}>
                                    {book.available > 0 ? (
                                        <>
                                            <CheckCircle size={12} />
                                            Available ({book.available})
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle size={12} />
                                            Out of Stock
                                        </>
                                    )}
                                </span>
                            </div>
                            {book.documentName && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Document</span>
                                    <span className="flex items-center gap-1 text-blue-600 font-medium text-xs">
                                        <FileText size={12} />
                                        PDF Available
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div className="text-xs font-medium text-slate-400">
                                Total Copies: <span className="text-slate-600 font-bold">{book.copies}</span>
                            </div>
                            <button
                                onClick={() => handleViewBook(book)}
                                className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AddBookModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleAddBook}
            />

            <ViewBookModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                book={selectedBook}
            />
        </div>
    );
};

export default Library;
