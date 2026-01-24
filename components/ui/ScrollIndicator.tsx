import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { colors } from '../../styles/colors';

const ScrollIndicator: React.FC = () => {
  return (
    <motion.div
      className="hidden sm:flex absolute bottom-8 left-6 sm:left-1/2 sm:transform sm:-translate-x-1/2 flex-col items-center gap-2 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1 }}
    >
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ChevronDown 
          size={32} 
          style={{ color: colors.text.light }}
          strokeWidth={1.5}
        />
             </motion.div>
      
      <motion.p
        className="text-xs uppercase tracking-wider"
        style={{ color: colors.text.light, opacity: 0.7 }}
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
      </motion.p>
    </motion.div>
  );
};

export default ScrollIndicator;
