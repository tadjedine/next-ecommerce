"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function HoverLift({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(43,127,255,0.12)" }}
      transition={{ type: "spring", stiffness: 300 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
