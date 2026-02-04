import React from 'react';
import { BookOpen, Calendar, Hash, Layers, Users, CheckCircle, AlertCircle, FileText, Download, X } from 'lucide-react';
import Modal from '../../shared/Modal';

const ViewBookModal = ({ isOpen, onClose, book }) => {
    if (!book) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Book Details"
            size="lg"
        >
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 aspect-[2/3] bg-purple-100 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                        <BookOpen size={64} className="text-purple-300 transform group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent" />
                    </div>

                    <div className="flex-1 space-y-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-3">
                                {book.category}
                            </span>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">{book.title}</h2>
                            <p className="text-xl text-slate-500 font-medium">{book.author}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <Hash size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">ISBN</span>
                                </div>
                                <p className="font-mono text-slate-700 font-semibold">{book.isbn}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <Layers size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Copies</span>
                                </div>
                                <p className="text-slate-700 font-semibold">{book.copies} Total</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm font-medium">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${book.available > 0
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {book.available > 0 ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                <span>{book.available} Available for borrowing</span>
                            </div>
                        </div>

                        {book.documentName && (
                            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10 active:scale-[0.98]">
                                <Download size={20} />
                                <span>Download Digital Copy</span>
                                <span className="text-slate-400 text-xs font-normal ml-auto">PDF • 2.4 MB</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Additional Info / Tabs placeholder */}
                <div className="border-t border-slate-100 pt-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Description</h3>
                    <p className="text-slate-600 leading-relaxed">
                        This is a standard reference book for {book.category.toLowerCase()} students.
                        It covers essential topics and provides comprehensive examples.
                        (Note: This is a placeholder description since the data model doesn't strictly have a description field yet,
                        but this modal is ready to display it.)
                    </p>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewBookModal;
