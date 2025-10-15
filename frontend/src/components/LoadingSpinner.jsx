import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
