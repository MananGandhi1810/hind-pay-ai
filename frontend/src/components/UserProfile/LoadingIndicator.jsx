import React from "react";
import { motion } from "framer-motion";

const LoadingIndicator = ({ size = 40, color = "#3498db" }) => {
    return (
        <div className="flex items-center justify-center">
            <motion.div
                className="rounded-full"
                style={{
                    width: size,
                    height: size,
                    border: `4px solid ${color}`,
                    borderBottomColor: "transparent",
                }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    ease: "linear",
                    repeat: Infinity,
                }}
            />
            <span className="ml-3 text-sm font-medium">
                Processing payment...
            </span>
        </div>
    );
};

export default LoadingIndicator;
