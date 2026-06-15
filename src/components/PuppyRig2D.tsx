"use client";

import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";

const PUPPIES = [
  "/assets/puppy/blue_eyes.jpg",
  "/assets/puppy/heart_tag.jpg"
];

export default function PuppyRig2D() {
  const [puppyIndex, setPuppyIndex] = useState(0);
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
    
    // Blink system
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000);

    // Puppy swap interval
    const swapInterval = setInterval(() => {
      setPuppyIndex((prev) => (prev + 1) % PUPPIES.length);
    }, 8000);

    // Random emotion changes
    const emotionInterval = setInterval(() => {
      const emotions: ("idle" | "happy" | "curious")[] = ["idle", "happy", "curious"];
      setEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 5000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(blinkInterval);
      clearInterval(swapInterval);
      clearInterval(emotionInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center cursor-none">
      <motion.div
        style={{
          rotateX: headRotateX,
          rotateY: headRotateY,
          x: headTranslateX,
          y: headTranslateY,
          perspective: 1000
        }}
        className="relative w-64 h-64 md:w-80 md:h-80"
      >
        {/* Shadow */}
        <motion.div
          animate={{
            scale: emotion === "happy" ? [1, 1.1, 1] : [1, 1.05, 1],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/20 rounded-[100%] blur-xl"
        />

        {/* Puppy Image Container */}
        <motion.div
          animate={{
            y: emotion === "happy" ? [0, -15, 0] : [0, -5, 0],
            scale: emotion === "happy" ? [1, 1.02, 1] : [1, 1.01, 1]
          }}
          transition={{
            duration: emotion === "happy" ? 0.6 : 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-full h-full rounded-[60px] overflow-hidden shadow-2xl border-4 border-white/50 bg-white"
        >
          {/* Active Puppy Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={puppyIndex}
              src={PUPPIES[puppyIndex]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Puppy"
            />
          </AnimatePresence>

          {/* Nose Wiggle Simulation (Center Pulse) */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0, 0.2, 0]
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 rounded-full blur-xl pointer-events-none"
          />

          {/* Blink Overlay */}
          <motion.div
            animate={{
              height: isBlinking ? "100%" : "0%"
            }}
            transition={{ duration: 0.1 }}
            className="absolute top-0 left-0 w-full bg-slate-900 z-20 origin-top"
          />
          
          {/* Subtle Fur Gradient / Lighting */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20 pointer-events-none" />
        </motion.div>

        {/* "Living" micro-movements (Ears simulation in 2D) */}
        <motion.div
          animate={{
            rotate: emotion === "curious" ? [-2, 2, -2] : [0, 0, 0],
            scale: emotion === "curious" ? 1.05 : 1
          }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Custom Particles for "Excitement" */}
          {emotion === "happy" && [...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5], y: -100, x: (i - 2) * 30 }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full blur-[1px]"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
