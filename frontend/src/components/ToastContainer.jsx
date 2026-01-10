import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

function ToastContainer() {
    const { toasts, removeToast } = useNotification();

    const getToastStyles = (type) => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-600',
                    icon: <FaCheckCircle className="text-xl" />,
                    progressBg: 'bg-green-400',
                };
            case 'error':
                return {
                    bg: 'bg-red-600',
                    icon: <FaExclamationCircle className="text-xl" />,
                    progressBg: 'bg-red-400',
                };
            case 'info':
            default:
                return {
                    bg: 'bg-blue-600',
                    icon: <FaInfoCircle className="text-xl" />,
                    progressBg: 'bg-blue-400',
                };
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-[9998] flex flex-col gap-3 max-w-sm">
            {toasts.map((toast) => {
                const styles = getToastStyles(toast.type);
                return (
                    <div
                        key={toast.id}
                        className={`${styles.bg} text-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300`}
                        style={{
                            animation: 'toastSlideIn 0.3s ease-out forwards',
                            minWidth: '280px',
                        }}
                    >
                        <div className="flex items-center gap-3 px-4 py-3">
                            <span className="flex-shrink-0">{styles.icon}</span>
                            <p className="flex-1 text-sm font-medium">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className="h-1 bg-white/30">
                            <div
                                className={`h-full ${styles.progressBg}`}
                                style={{
                                    animation: `toastProgress ${toast.duration}ms linear forwards`,
                                }}
                            />
                        </div>
                    </div>
                );
            })}

            <style>{`
                @keyframes toastSlideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes toastProgress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `}</style>
        </div>
    );
}

export default ToastContainer;
