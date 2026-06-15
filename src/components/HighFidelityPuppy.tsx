"use client";

import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

/**
 * HighFidelityPuppy Component
 * A procedural 2D rigged puppy with high-fidelity animations (tail wiggling, breathing, blinking).
 */
export default function HighFidelityPuppy() {
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Mouse tracking for subtle eye follow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 150 };
  const eyeX = useSpring(useTransform(mouseX, [-400, 400], [-3, 3]), springConfig);
  const eyeY = useSpring(useTransform(mouseY, [-400, 400], [-2, 2]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    // Blink system
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 120);
      }
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, []);

  const tan = "#D27D2D";
  const brown = "#B06500";
  const red = "#FF0000";

  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
      {/* Shadow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/20 rounded-[100%] blur-md"
      />

      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Tail - High Fidelity Wiggle */}
        <motion.path
          d="M 140 130 Q 160 110 170 130"
          stroke={brown}
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          animate={{
            rotate: [-15, 25, -15],
            skewX: [-5, 5, -5]
          }}
          transition={{
            duration: 0.25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ originX: "140px", originY: "130px" }}
        />

        {/* Body */}
        <motion.ellipse
          cx="100"
          cy="130"
          rx="45"
          ry="35"
          fill={tan}
          animate={{
            ry: [35, 37, 35],
            y: [0, -1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Head */}
        <motion.g
          animate={{
            y: [0, -2, 0],
            rotate: [-1, 1, -1]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "100px", originY: "130px" }}
        >
          {/* Ears */}
          <motion.path
            d="M 65 75 Q 45 60 55 100"
            fill={brown}
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ originX: "65px", originY: "75px" }}
          />
          <motion.path
            d="M 135 75 Q 155 60 145 100"
            fill={brown}
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ originX: "135px", originY: "75px" }}
          />

          {/* Head Shape */}
          <circle cx="100" cy="90" r="42" fill={tan} />
          
          {/* Muzzle */}
          <ellipse cx="100" cy="105" rx="22" ry="18" fill="white" fillOpacity="0.4" />
          <circle cx="100" cy="98" r="6" fill="#333" /> {/* Nose */}

          {/* Eyes */}
          <g>
            {/* Left Eye */}
            <circle cx="85" cy="85" r="8" fill="white" />
            {!isBlinking && (
              <motion.circle 
                cx="85" cy="85" r="4" 
                fill="black"
                style={{ x: eyeX, y: eyeY }}
              />
            )}
            {/* Right Eye */}
            <circle cx="115" cy="85" r="8" fill="white" />
            {!isBlinking && (
              <motion.circle 
                cx="115" cy="85" r="4" 
                fill="black"
                style={{ x: eyeX, y: eyeY }}
              />
            )}
          </g>

          {/* Heart Tag */}
          <motion.path
            d="M 100 125 L 95 130 Q 100 138 105 130 Z"
            fill={red}
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "100px", originY: "125px" }}
          />
        </motion.g>

        {/* Legs */}
        <ellipse cx="75" cy="165" rx="8" ry="12" fill={brown} />
        <ellipse cx="125" cy="165" rx="8" ry="12" fill={brown} />
      </motion.svg>
    </div>
  );
}
