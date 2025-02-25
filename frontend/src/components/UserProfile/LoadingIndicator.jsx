import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LoadingIndicator = ({ text }) => {
  const [loading, setLoading] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowCheckmark(true);
    }, 1000); // Change to checkmark after 1 second

    return () => clearTimeout(timer);
  }, []);

    return (
        <div className="flex items-center space-x-2">
            {loading ? (
                <motion.div
                    className="w-4 h-4 rounded-full bg-gray-300"
                    animate={{
                        scale: [1, 1.2, 1],
                        transition: {
                            duration: 0.6,
                            repeat: Infinity,
                            repeatType: "reverse",
                        },
                    }}
                />
            ) : (
                showCheckmark && (
                    <motion.div
                        className="w-4 h-4 text-green-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        &#10003; {/* Checkmark symbol */}
                    </motion.div>
                )
            )}
            <span>{text}</span>
        </div>
    );
};

export default LoadingIndicator;
