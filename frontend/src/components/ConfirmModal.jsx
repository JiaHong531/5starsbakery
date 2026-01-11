import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

function ConfirmModal() {
    const { confirmModal, closeConfirmModal } = useNotification();
    const { isOpen, message, title, onConfirm, onCancel } = confirmModal;

    
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeConfirmModal();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeConfirmModal]);

    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={closeConfirmModal}
        >
            <div
                className="bg-white rounded-xl shadow-2xl max-w-md w-[90%] mx-4 transform transition-all duration-300 animate-modal-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                    animation: 'modalIn 0.3s ease-out forwards',
                }}
            >
                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold font-serif mb-2 text-header-bg animate-slideUp">
                        {title}
                    </h3>

                    <p className="text-gray-600 mb-6 text-base leading-relaxed animate-slideUp stagger-1">
                        {message}
                    </p>

                    <div className="flex justify-center gap-4 animate-slideUp stagger-2">
                        <button
                            onClick={onCancel}
                            className="px-5 py-2.5 rounded-lg font-semibold bg-header-bg text-text-light hover:bg-red-600 hover:text-text-light transition-all duration-300"
                        >
                            {confirmModal.cancelText || 'Cancel'}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-5 py-2.5 rounded-lg font-semibold text-text-light transition-all duration-300 ${confirmModal.type === 'danger'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-accent-1 hover:bg-accent-2'
                                }`}
                        >
                            {confirmModal.confirmText || 'OK'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modalIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

export default ConfirmModal;
