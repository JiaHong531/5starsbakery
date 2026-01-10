import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

function ConfirmModal() {
    const { confirmModal, closeConfirmModal } = useNotification();
    const { isOpen, message, title, onConfirm, onCancel } = confirmModal;

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeConfirmModal();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeConfirmModal]);

    // Prevent body scroll when modal is open
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
                {/* Header */}
                <div className="bg-header-bg text-text-light px-6 py-4 rounded-t-xl">
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <p className="text-text-main text-base leading-relaxed">{message}</p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 rounded-lg font-semibold bg-accent-1 text-header-bg hover:opacity-90 transition-opacity duration-200"
                    >
                        OK
                    </button>
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
