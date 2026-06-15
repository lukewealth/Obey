"use client";

import React, { useRef } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface DogProps {
  state?: "walk" | "idle";
}

export function Dog({ state = "walk" }: DogProps) {
  const group = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Mesh>(null!);
  const body = useRef<THREE.Mesh>(null!);
  const tail = useRef<THREE.Mesh>(null!);
  
  const flLeg = useRef<THREE.Mesh>(null!);
  const frLeg = useRef<THREE.Mesh>(null!);
  const blLeg = useRef<THREE.Mesh>(null!);
  const brLeg = useRef<THREE.Mesh>(null!);

  useFrame((clockState) => {
    const t = clockState.clock.getElapsedTime();
    
    // Tail wagging
    if (tail.current) {
      tail.current.rotation.z = Math.sin(t * 12) * 0.4;
    }

    // Walking animation
    if (state === "walk") {
      const walkSpeed = 8;
      const walkAmp = 0.3;
      
      if (flLeg.current) flLeg.current.rotation.x = Math.sin(t * walkSpeed) * walkAmp;
      if (frLeg.current) frLeg.current.rotation.x = Math.sin(t * walkSpeed + Math.PI) * walkAmp;
      if (blLeg.current) blLeg.current.rotation.x = Math.sin(t * walkSpeed + Math.PI) * walkAmp;
      if (brLeg.current) brLeg.current.rotation.x = Math.sin(t * walkSpeed) * walkAmp;
      
      // Body bobbing
      if (group.current) group.current.position.y = Math.abs(Math.sin(t * walkSpeed * 2)) * 0.05;
    } else {
      // Idle breathing
      if (group.current) group.current.position.y = Math.sin(t * 2) * 0.02;
    }
    
    // Head tilt
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.5) * 0.1;
      head.current.rotation.z = Math.sin(t * 1.5) * 0.05;
    }
  });

  const cartoonTan = "#D27D2D";
  const cartoonBrown = "#B06500";
  const heartRed = "#FF0000";

  return (
    <group ref={group}>
      {/* Body */}
      <mesh ref={body} position={[0, 0, 0]}>
        <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
        <meshStandardMaterial color={cartoonTan} />
      </mesh>
      
      {/* Head - slightly larger for puppy look */}
      <mesh ref={head} position={[0, 0.65, 0.45]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={cartoonBrown} />
        
        {/* Heart Tag */}
        <mesh position={[0, -0.3, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
          <meshStandardMaterial color={heartRed} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        
        {/* Snout */}
        <mesh position={[0, -0.05, 0.35]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color={cartoonTan} />
        </mesh>
      </mesh>
      
      {/* Tail */}
      <mesh ref={tail} position={[0, 0.2, -0.45]} rotation={[0.5, 0, 0]}>
        <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
        <meshStandardMaterial color={cartoonBrown} />
      </mesh>
      
      {/* Legs */}
      <mesh ref={flLeg} position={[-0.2, -0.3, 0.25]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color={cartoonTan} />
      </mesh>
      <mesh ref={frLeg} position={[0.2, -0.3, 0.25]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color={cartoonTan} />
      </mesh>
      <mesh ref={blLeg} position={[-0.2, -0.3, -0.25]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color={cartoonTan} />
      </mesh>
      <mesh ref={brLeg} position={[0.2, -0.3, -0.25]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color={cartoonTan} />
      </mesh>
    </group>
  );
}

interface RealisticDogLoaderProps {
  title?: string;
  subtitle?: string;
}

export default function RealisticDogLoader({ 
  title = "Loading Experience",
  subtitle = "Preparing intelligent services"
}: RealisticDogLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div style={{ width: "200px", height: "200px" }} className="relative"> 
        <Canvas camera={{ position: [2, 2, 3], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 5, 2]} intensity={1.2} />
          <Dog state="walk" />
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>
      <div className="text-center mt-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-slate-500 mt-2">{subtitle}</p>
      </div>
    </div>
  );
}
