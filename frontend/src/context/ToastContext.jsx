import React, { createContext, useState, useContext, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "info", duration = 3000) => {
        const id = uuidv4();
        setToasts((prevToasts) => [
            ...prevToasts,
            {
                id,
                message,
                type,
                duration,
                visible: true,
            },
        ]);

        setTimeout(() => {
            hideToast(id);
        }, duration);

        return id;
    }, []);

    const hideToast = useCallback((id) => {
        setToasts((prevToasts) =>
            prevToasts.map((toast) =>
                toast.id === id ? { ...toast, visible: false } : toast,
            ),
        );

        setTimeout(() => {
            setToasts((prevToasts) =>
                prevToasts.filter((toast) => toast.id !== id),
            );
        }, 500);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <div className="toast-container fixed z-50 top-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 pointer-events-none h-full-w-nav">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            isVisible={toast.visible}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={() => hideToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastContext;
