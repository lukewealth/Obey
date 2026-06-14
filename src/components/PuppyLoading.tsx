import React from "react";
import { motion } from "framer-motion";

export default function PuppyLoading() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12 md:py-20">
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        {/* Puppy Body (Simplistic Cartoon Representation) */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 0.6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative z-10"
        >
          {/* Ears */}
          <motion.div 
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="absolute -top-2 -left-2 w-8 h-12 bg-amber-700 rounded-full"
          />
          <motion.div 
            animate={{ rotate: [10, -10, 10] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="absolute -top-2 -right-2 w-8 h-12 bg-amber-700 rounded-full"
          />
          
          {/* Head */}
          <div className="w-24 h-20 bg-amber-500 rounded-[40px] flex items-center justify-center relative shadow-lg">
             {/* Eyes */}
             <div className="flex gap-6">
                <motion.div 
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-gray-900 rounded-full"
                />
                <motion.div 
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-gray-900 rounded-full"
                />
             </div>
             {/* Nose */}
             <div className="absolute bottom-4 w-4 h-2.5 bg-gray-900 rounded-full" />
          </div>

          {/* Body */}
          <div className="w-20 h-24 bg-amber-500 rounded-[35px] -mt-4 mx-auto shadow-inner relative">
             {/* Tail */}
             <motion.div 
              animate={{ rotate: [-20, 20, -20] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="absolute -right-4 top-4 w-10 h-3 bg-amber-700 rounded-full origin-left"
             />
             {/* Happy Paws */}
             <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-amber-600 rounded-full shadow-md" />
             <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-600 rounded-full shadow-md" />
          </div>
        </motion.div>

        {/* Shadow */}
        <motion.div 
          animate={{ 
            scale: [1, 0.6, 1],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-900/10 rounded-full blur-md"
        />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest italic">Node Discovery...</h3>
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">Syncing institutional depth mesh</p>
      </div>
    </div>
  );
}
