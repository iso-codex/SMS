import React, { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import Modal from '../../shared/Modal';

const AddBookModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        category: '',
        copies: '',
        document: null
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'document') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.author.trim()) newErrors.author = 'Author is required';
        if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.copies || formData.copies <= 0) newErrors.copies = 'Valid number of copies is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const newBook = {
                id: Date.now(),
                title: formData.title,
                author: formData.author,
                isbn: formData.isbn,
                category: formData.category,
                copies: parseInt(formData.copies),
                available: parseInt(formData.copies), // Initially all available
                documentName: formData.document ? formData.document.name : null
            };
            onSuccess(newBook);
            setLoading(false);
            onClose();
            setFormData({
                title: '',
                author: '',
                isbn: '',
                category: '',
                copies: '',
                document: null
            });
        }, 1000);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Book"
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Book Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border ${errors.title ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                            placeholder="e.g., Introduction to Algorithms"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Author <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border ${errors.author ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                                placeholder="e.g., Thomas H. Cormen"
                            />
                            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                ISBN <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border ${errors.isbn ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                                placeholder="e.g., 978-0262033848"
                            />
                            {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border ${errors.category ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                                placeholder="e.g., Computer Science"
                            />
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Total Copies <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="copies"
                                value={formData.copies}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border ${errors.copies ? 'border-red-300' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                                placeholder="e.g., 10"
                                min="1"
                            />
                            {errors.copies && <p className="text-red-500 text-sm mt-1">{errors.copies}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Upload Document (PDF/EPUB)
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                name="document"
                                onChange={handleChange}
                                accept=".pdf,.epub,.doc,.docx"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center text-center">
                                <Upload size={32} className="text-slate-400 mb-3" />
                                <p className="text-sm font-medium text-slate-700">
                                    {formData.document ? formData.document.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {formData.document ? `${(formData.document.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, EPUB up to 10MB'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        {loading ? 'Adding...' : 'Add Book'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddBookModal;
