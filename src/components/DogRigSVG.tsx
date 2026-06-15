"use client";

import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";

/**
 * DogRigSVG Component
 * Recreates the puppy from dog_image.svg with "Living" 2D rigged animations.
 */
export default function DogRigSVG() {
  const [isBlinking, setIsBlinking] = useState(false);
  const [emotion, setEmotion] = useState<"idle" | "happy" | "curious">("idle");
  
  // Mouse tracking for "Eye Tracking" simulation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 120 };
  const headRotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), springConfig);
  const headRotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), springConfig);
  const headTranslateX = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), springConfig);
  const headTranslateY = useSpring(useTransform(mouseY, [-300, 300], [-5, 5]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = clientX - window.innerWidth / 2;
      const y = clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    // Blink system (Procedural blinking)
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3500);

    // Random emotion changes (Intelligence simulation)
    const emotionInterval = setInterval(() => {
      const emotions: ("idle" | "happy" | "curious")[] = ["idle", "happy", "curious"];
      setEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 6000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(blinkInterval);
      clearInterval(emotionInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        style={{
          rotateX: headRotateX,
          rotateY: headRotateY,
          x: headTranslateX,
          y: headTranslateY,
          perspective: 1200
        }}
        className="relative w-64 h-64 md:w-96 md:h-96"
      >
        {/* Dynamic Shadow (Breathes with the puppy) */}
        <motion.div
          animate={{
            scale: emotion === "happy" ? [1, 1.15, 1] : [1, 1.05, 1],
            opacity: [0.15, 0.08, 0.15]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-6 bg-black/30 rounded-[100%] blur-2xl"
        />

        {/* Puppy Rig Container */}
        <motion.div
          animate={{
            y: emotion === "happy" ? [0, -12, 0] : [0, -4, 0],
            scale: emotion === "happy" ? [1, 1.03, 1] : [1, 1.01, 1],
            rotate: emotion === "curious" ? [-3, 3, -3] : [0, 0, 0]
          }}
          transition={{
            duration: emotion === "happy" ? 0.5 : 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-full h-full flex items-center justify-center p-4 bg-white/40 backdrop-blur-sm rounded-[80px] shadow-xl border-2 border-white/20"
        >
          {/* Main Dog Image (from SVG source) */}
          <motion.img
            src="/assets/puppy/original_dog.svg"
            className="w-full h-full object-contain drop-shadow-2xl"
            alt="Living Puppy"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Procedural Blink Overlay (Simulating Eyelids) */}
          <motion.div
            animate={{
              height: isBlinking ? "100%" : "0%"
            }}
            transition={{ duration: 0.12, ease: "circIn" }}
            className="absolute top-0 left-0 w-full bg-slate-900/90 z-20 origin-top pointer-events-none rounded-[80px]"
          />
          
          {/* Subtle Ambient Lighting Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none rounded-[80px]" />
          
          {/* Curiosity Particles */}
          {emotion === "curious" && (
             <motion.div 
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: 1, scale: 1.2 }}
               className="absolute -top-4 -right-4 bg-blue-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg"
             >
               ?
             </motion.div>
          )}
        </motion.div>

        {/* Emotion Effects (Tail Wagging simulation via skew) */}
        <motion.div
          animate={{
            skewX: emotion === "happy" ? [-10, 10, -10] : [0, 0, 0],
          }}
          transition={{ duration: 0.2, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Excitement Particles (Happy State) */}
        {emotion === "happy" && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1.2, 0.5], 
              y: -150, 
              x: (i - 2.5) * 45 
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              delay: i * 0.15,
              ease: "easeOut" 
            }}
            className="absolute top-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full blur-[2px] opacity-40 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          />
        ))}
      </motion.div>
    </div>
  );
}
