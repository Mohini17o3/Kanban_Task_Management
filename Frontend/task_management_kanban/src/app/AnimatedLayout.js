"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedLayout({ children }) {
//   const [isFirstLoad, setIsFirstLoad] = useState(true); // Track the first load

//   useEffect(() => {
//     setIsFirstLoad(false); // Mark the first load as completed
//   }, []);

  return (
    <motion.div
      initial={ {opacity: 0}  }// No animation on first load
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
