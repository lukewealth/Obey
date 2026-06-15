# dog.tx - Agent Execution Instructions

## TASK 1: Fix Dashboard Routing
1. Open `components/Dashboard.tsx` (or the file containing the Dashboard component).
2. Locate the `onSelectAction` function.
3. Implement conditional routing logic to redirect users based on their selection: 
   - If "Crypto", route to the Crypto utility.
   - If "Giftcard", route to the Giftcard utility.
4. Ensure the loading state is triggered immediately upon selection and remains active during the route transition.

## TASK 2: Implement 3D Puppy Loader
1. Open `@/Users/Apple/Downloads/Obey/RealisticDogLoader.tsx`.
2. Remove the existing 2D `dog_image.svg` import and its rendering logic.
3. Inject the `react-three-fiber` `<Canvas>` setup and the procedural `<Dog />` component provided below.
4. **Constraint:** Wrap the `<Canvas>` in a `div` that strictly matches the width/height of the original `dog_image.svg` to prevent layout shifts. Set `camera={{ position: [2, 2, 3], fov: 50 }}`.

## TASK 3: UI/UX Aesthetic Upgrades (Procedural R3F)
Based on the reference images (`happy-dog-puppy-cartoon-style`, `cheerful-puppy-with-heart-tag`, `adorable-puppy-with-big-eyes`):
1. **Color Palette:** Update `meshStandardMaterial` hex codes in `<Dog />` to brighter, more cheerful cartoon tones (e.g., warmer tans/browns).
2. **Proportions:** Increase the size of the head `sphereGeometry` slightly to create a "big eye/puppy" look.
3. **Heart Tag:** Add a new `<mesh>` attached to the lower head or neck area using a `cylinderGeometry` or `boxGeometry`, colored bright red (`#FF0000`), to represent the heart tag.
4. Set the initial state of the dog to `"walk"` or keep `"idle"` based on the loading state.

---
## INJECTION CODE: Core R3F Dog System

```tsx
import React, { useRef, useState } from "react"
import { useFrame, Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

// Insert this Dog component into RealisticDogLoader.tsx
export function Dog() {
  const group = useRef<THREE.Group>(null!)
  const head = useRef<THREE.Mesh>(null!)
  const body = useRef<THREE.Mesh>(null!)
  const tail = useRef<THREE.Mesh>(null!)
  // ... (Include the full procedural leg/body refs and useFrame animation logic from the baseline code) ...
  // Add Heart Tag Mesh here inside the group, positioned at the neck
  
  return (
    <group ref={group}>
      <mesh ref={body} position={[0, 0, 0]}><capsuleGeometry args={[0.5, 1.2, 8, 16]} /><meshStandardMaterial color="#D27D2D" /></mesh>
      <mesh ref={head} position={[0, 0.9, 0.7]}><sphereGeometry args={[0.45, 32, 32]} /><meshStandardMaterial color="#B06500" /></mesh>
      
      <mesh position={[0, 0.4, 0.9]}><cylinderGeometry args={[0.1, 0.1, 0.05]} rotation={[Math.PI/2, 0, 0]} /><meshStandardMaterial color="#FF0000" /></mesh>
      
    </group>
  )
}

// Replace the return statement of RealisticDogLoader with this:
export default function RealisticDogLoader() {
  return (
    <div style={{ width: "200px", height: "200px" }}> 
      <Canvas 2, 3], 50 [2, camera="{{" fov: position: }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} />
        <Dog/>
        <OrbitControls enablePan="{false}" enableZoom="{false}"/>
      </Canvas>
    </div>
  )
}

