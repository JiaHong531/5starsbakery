import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function useNotification() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
    // Toast notifications state
    const [toasts, setToasts] = useState([]);

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        message: '',
        title: 'Confirm',
        onConfirm: null,
        onCancel: null,
    });

    // Show toast notification
    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after duration
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);

        return id;
    }, []);

    // Remove toast manually
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Show confirmation modal - returns a Promise
    const showConfirm = useCallback((message, title = 'Confirm') => {
        return new Promise((resolve) => {
            setConfirmModal({
                isOpen: true,
                message,
                title,
                onConfirm: () => {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                },
            });
        });
    }, []);

    // Close confirmation modal
    const closeConfirmModal = useCallback(() => {
        if (confirmModal.onCancel) {
            confirmModal.onCancel();
        }
    }, [confirmModal]);

    const value = {
        toasts,
        showToast,
        removeToast,
        confirmModal,
        showConfirm,
        closeConfirmModal,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}
