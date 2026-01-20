import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const types = {
        success: {
            icon: CheckCircle,
            bg: 'bg-green-50 border-green-200',
            text: 'text-green-800',
            iconColor: 'text-green-600'
        },
        error: {
            icon: XCircle,
            bg: 'bg-red-50 border-red-200',
            text: 'text-red-800',
            iconColor: 'text-red-600'
        },
        warning: {
            icon: AlertCircle,
            bg: 'bg-yellow-50 border-yellow-200',
            text: 'text-yellow-800',
            iconColor: 'text-yellow-600'
        },
        info: {
            icon: AlertCircle,
            bg: 'bg-blue-50 border-blue-200',
            text: 'text-blue-800',
            iconColor: 'text-blue-600'
        }
    };

    const config = types[type];
    const Icon = config.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -50, x: '-50%' }}
                    className="fixed top-4 left-1/2 z-[100] w-full max-w-md px-4"
                >
                    <div className={`${config.bg} ${config.text} border rounded-xl shadow-lg p-4 flex items-center gap-3`}>
                        <Icon className={config.iconColor} size={20} />
                        <p className="flex-1 font-medium">{message}</p>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Hook for using toast
export const useToast = () => {
    const [toast, setToast] = React.useState({ isVisible: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ isVisible: true, message, type });
    };

    const hideToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    return { toast, showToast, hideToast };
};

export default Toast;
