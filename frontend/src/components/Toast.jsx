import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({
    message,
    type = "info",
    isVisible,
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    // Base styles for each toast type
    const toastStyles = {
        info: "bg-blue-500 border-blue-600",
        success: "bg-green-500 border-green-600",
        error: "bg-red-500 border-red-600",
        warning: "bg-yellow-500 border-yellow-600",
    };

    // Glow colors for each toast type
    const glowColors = {
        info: "rgba(59, 130, 246, 0.6)", // blue glow
        success: "rgba(34, 197, 94, 0.6)", // green glow
        error: "rgba(239, 68, 68, 0.6)", // red glow
        warning: "rgba(234, 179, 8, 0.6)", // yellow glow
    };

    // Icons for each toast type
    const iconMap = {
        info: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        success: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        error: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        warning: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    };

    const glowVariants = {
        initial: {
            opacity: 0.5,
            scale: 1.0,
        },
        animate: {
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
            },
        },
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="toast-wrapper relative">
                    <motion.div
                        className="absolute inset-0 rounded-lg blur-md"
                        initial="initial"
                        animate="animate"
                        variants={glowVariants}
                        style={{
                            backgroundColor: glowColors[type],
                            zIndex: -1,
                        }}
                    />

                    <motion.div
                        className={`relative px-4 py-3 rounded-lg text-white shadow-xl ${toastStyles[type]} border backdrop-blur-sm bg-opacity-90 flex items-center gap-2`}
                        initial={{ y: -100, opacity: 0, scale: 0.8 }}
                        animate={{
                            y: [0, -8, 0],
                            opacity: 1,
                            scale: 1,
                            transition: {
                                y: {
                                    repeat: Infinity,
                                    duration: 2.5,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                },
                                opacity: {
                                    duration: 0.3,
                                },
                                scale: {
                                    duration: 0.3,
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 20,
                                },
                            },
                        }}
                        exit={{
                            y: -100,
                            opacity: 0,
                            scale: 0.8,
                            transition: {
                                duration: 0.3,
                            },
                        }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        dragSnapToOrigin={true}
                        onDragEnd={(_, info) => {
                            if (Math.abs(info.offset.y) > 80) {
                                onClose();
                            }
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            boxShadow: `0 0 15px 2px ${glowColors[type]}, 0 0 5px 0px ${glowColors[type]}`,
                        }}
                    >
                        <div className="text-white">{iconMap[type]}</div>

                        <div className="flex-1">{message}</div>

                        <motion.button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 flex items-center justify-center w-6 h-6 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
