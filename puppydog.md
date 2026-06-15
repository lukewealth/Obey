To make the puppy feel alive in a **Next.js + Three.js** application, you should move beyond a simple sprite-sheet animation and build a **2.5D rigged character system** with skeletal animation, procedural secondary motion, breathing, blinking, ear physics, tail dynamics, and subtle emotional behaviors.

## Architecture

```text
Next.js
 ├── React Three Fiber
 │    ├── PuppyRig
 │    ├── Skeleton
 │    ├── IK Controller
 │    ├── Physics Controller
 │    ├── Animation State Machine
 │    └── Emotion Controller
 │
 ├── GSAP
 ├── Zustand
 ├── Framer Motion
 └── Three.js
```

Recommended stack:

```bash
npm install three
npm install @react-three/fiber
npm install @react-three/drei
npm install gsap
npm install zustand
npm install maath
```

---

# Character Rig

Instead of one image:

```text
DogRoot
│
├── Body
│
├── Neck
│   └── Head
│        ├── LeftEar
│        ├── RightEar
│        ├── LeftEye
│        ├── RightEye
│        ├── Eyelashes
│        ├── Nose
│        └── Mouth
│
├── Tail
│    ├── TailBone1
│    ├── TailBone2
│    └── TailBone3
│
├── FrontLegL
├── FrontLegR
├── RearLegL
└── RearLegR
```

Each body part becomes a separate SVG layer converted into mesh planes.

---

# Realistic Motion Layers

The dog should never be perfectly still.

Every frame:

```js
body.y =
  Math.sin(time * 2) * 0.01

body.scale.y =
  1 + Math.sin(time * 2) * 0.015
```

Produces breathing.

---

# Breathing System

Chest expands.

```js
chest.scale.x =
  1 + Math.sin(time * 1.8) * 0.02

chest.scale.y =
  1 + Math.sin(time * 1.8) * 0.03
```

Adds life even when idle.

---

# Head Micro Motion

Humans subconsciously expect tiny adjustments.

```js
head.rotation.z =
  Math.sin(time * 1.5) * 0.04
```

Plus:

```js
head.position.y =
  Math.sin(time * 1.5) * 0.005
```

---

# Eye Tracking

Dog follows cursor.

```js
const targetX = mouse.x * 0.03
const targetY = mouse.y * 0.03

leftPupil.position.x = targetX
leftPupil.position.y = targetY

rightPupil.position.x = targetX
rightPupil.position.y = targetY
```

This dramatically increases perceived intelligence.

---

# Blink System

Randomized.

```js
every 2.5-6 seconds
```

Animation:

```js
eye.scale.y
1 → 0.05 → 1
```

Duration:

```text
100ms close
80ms open
```

Never use fixed intervals.

---

# Ear Physics

Most cartoon dogs feel fake because ears move rigidly.

Use spring simulation.

```js
earRotation +=
 (headVelocity * 0.2 - earRotation)
 * delta * 12
```

Result:

```text
Head moves
 ↓
Ears lag
 ↓
Catch up
```

Feels organic.

---

# Tail Animation

Tail consists of three bones.

```text
TailRoot
 └─ TailMid
      └─ TailTip
```

Wave propagation:

```js
tailRoot.rotation.z =
 Math.sin(time * 12) * 0.4

tailMid.rotation.z =
 Math.sin(time * 12 + 0.4) * 0.3

tailTip.rotation.z =
 Math.sin(time * 12 + 0.8) * 0.2
```

Produces realistic whip motion.

---

# Emotional Tail States

## Happy

```js
frequency = 12
amplitude = 0.45
```

---

## Curious

```js
frequency = 4
amplitude = 0.15
```

---

## Excited

```js
frequency = 20
amplitude = 0.6
```

---

# Loading Animation

Instead of spinning.

Create a walk cycle.

```text
Walk →
Pause →
Look Around →
Tail Wag →
Blink →
Walk
```

Loop:

```text
4 seconds
```

---

# Walk Cycle

Use procedural gait.

Front legs:

```js
frontLeft.rotation.x =
 Math.sin(t * speed)

frontRight.rotation.x =
 Math.sin(t * speed + Math.PI)
```

Rear legs:

```js
rearLeft.rotation.x =
 Math.sin(t * speed + Math.PI)

rearRight.rotation.x =
 Math.sin(t * speed)
```

---

# Body Bounce

Walking dogs bounce vertically.

```js
body.position.y =
 Math.abs(Math.sin(t * speed))
 * 0.03
```

---

# Shoulder Compression

Front shoulder:

```js
shoulder.scale.y =
 1 - Math.abs(Math.sin(t))
 * 0.03
```

Makes weight feel real.

---

# Paw Contact

Feet should not slide.

Use IK.

```text
Foot Target
 ↓
Inverse Kinematics
 ↓
Leg Rotation
```

Libraries:

```bash
three-ik
```

or custom CCD solver.

---

# Nose Wiggle

Every few seconds:

```js
nose.scale.x =
 1 + Math.sin(time * 20) * 0.03
```

Tiny but effective.

---

# Mouth Motion

Idle smile:

```js
mouth.rotation.z =
 Math.sin(time * 2) * 0.02
```

---

# Curiosity Behavior

Random event:

```text
every 8-15 sec
```

Sequence:

```text
head tilt
 ↓
blink
 ↓
ear raise
 ↓
tail wag
```

Most users perceive this as personality.

---

# Hover Interaction

When user hovers:

```text
Look at cursor
Tail wag faster
Smile bigger
```

```js
emotion = "happy"
```

---

# Click Interaction

Dog reacts.

```text
Jump
Blink
Happy bark pose
```

Animation:

```js
body.position.y += 0.2
```

then spring back.

---

# Advanced Fur Shading

Use custom shader.

Fragment shader:

```glsl
float fresnel =
pow(
 1.0 - dot(normal, viewDir),
 3.0
);

color +=
 vec3(1.0,0.9,0.8)
 * fresnel * 0.15;
```

Adds soft cartoon rim light.

---

# Realistic Lighting

```jsx
<ambientLight intensity={1.2} />

<directionalLight
 position={[4,4,5]}
 intensity={2}
/>

<directionalLight
 position={[-3,2,-2]}
 intensity={0.5}
/>
```

---

# Animation State Machine

```ts
type PuppyState =
 | "idle"
 | "walk"
 | "lookAround"
 | "wag"
 | "blink"
 | "excited"
 | "sleepy"
```

Transitions:

```text
idle
 ↓
walk
 ↓
lookAround
 ↓
wag
 ↓
idle
```

---

# Target Quality

The final result should feel closer to:

* Animated Disney pet sidekick
* Duolingo mascot polish
* Figma loading mascot quality
* Modern mobile game companion character

rather than a flat GIF.

The biggest improvement comes from combining **procedural breathing + eye tracking + ear lag physics + multi-bone tail dynamics + randomized curiosity behaviors**. Those five systems create the illusion of a living puppy even though the artwork remains a simple cartoon illustration.
