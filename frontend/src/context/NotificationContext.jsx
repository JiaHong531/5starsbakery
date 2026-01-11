import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function useNotification() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
    
    const [toasts, setToasts] = useState([]);

    
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        message: '',
        title: 'Confirm',
        onConfirm: null,
        onCancel: null,
    });

    
    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);

        return id;
    }, []);

    
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    
    const showConfirm = useCallback((message, title = 'Confirm', confirmText = 'OK', cancelText = 'Cancel', type = 'default') => {
        return new Promise((resolve) => {
            setConfirmModal({
                isOpen: true,
                message,
                title,
                confirmText,
                cancelText,
                type,
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
