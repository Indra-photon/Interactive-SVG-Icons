# Loader Creation Plan

## 📋 Overview
This document provides step-by-step instructions for creating new animated loaders for the ItsHover Icon Library. Each loader must follow the established patterns to ensure consistency, quality, and seamless integration with the shadcn CLI installation system.

---

## 🎯 Loader Requirements

### Core Principles
1. **SVG-based** - All loaders use SVG for infinite scalability
2. **Framer Motion** - Animations powered by Framer Motion library
3. **Controllable** - Must support `isAnimating` prop for pause/play
4. **Customizable** - Props for `width`, `height`, `color`
5. **Accessible** - Uses `currentColor` for theme compatibility
6. **Performance** - Optimized animations with proper easing

### Quality Standards
- ✅ Smooth, professional animations
- ✅ No janky or stuttering motion
- ✅ Appropriate timing (not too fast/slow)
- ✅ Clean, readable code
- ✅ Proper TypeScript types
- ✅ Consistent naming conventions

---

## 📁 File Structure

Each loader requires exactly **2 files**:

```
components/loaders/
└── [loader-slug]/
    ├── default.tsx       # React component with animation
    └── config.json       # Metadata for registry
```

**Naming Convention:**
- Use **kebab-case** for folder names: `spinner-dots`, `bars-wave`, `pulse-ring`
- Component name in **PascalCase**: `SpinnerDots`, `BarsWave`, `PulseRing`
- Must be descriptive and indicate animation type

---

## 🔧 Step-by-Step Creation Process

### Step 1: Choose Loader Name & Concept

**Format:** `[type]-[style]`

Examples:
- `spinner-dots` - Spinning dots in a circle
- `bars-wave` - Bars creating wave motion
- `pulse-ring` - Pulsing ring animation
- `bounce-circles` - Bouncing circle elements

**Categories:**
- **Spinners:** Rotating/spinning elements
- **Bars:** Vertical/horizontal bar animations
- **Dots:** Multiple dot-based patterns
- **Pulses:** Growing/shrinking effects
- **Creative:** Unique custom animations

---

### Step 2: Create Component File

**Location:** `components/loaders/[loader-slug]/default.tsx`

**Template Structure:**

```tsx
'use client';

import { motion } from 'framer-motion';

interface [ComponentName]Props {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  // Add loader-specific props here if needed
}

export function [ComponentName]({ 
  width = 45,
  height = 45, 
  color = "currentColor",
  isAnimating = true,
  // loader-specific props with defaults
}: [ComponentName]Props) {
  
  // Define easing functions if needed
  const easing = [0.455, 0.03, 0.515, 0.955] as const;
  
  // Calculate responsive dimensions
  const elementSize = width * 0.2; // Example: 20% of container
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      {/* Animation elements go here */}
      <motion.circle
        cx={width / 2}
        cy={height / 2}
        r={elementSize}
        fill={color}
        animate={{
          // Define animation properties
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: isAnimating ? Infinity : 0,
          ease: easing,
          times: [0, 0.5, 1]
        }}
      />
    </svg>
  );
}
```

**Key Points:**

1. **Export Function Name:** Must match component name in PascalCase
2. **Props Interface:** Always include `width`, `height`, `color`, `isAnimating`
3. **Defaults:** width=45, height=45, color="currentColor", isAnimating=true
4. **ViewBox:** Must match width/height for proper scaling
5. **Accessibility:** Include aria-label and role attributes
6. **Animation Control:** Use `repeat: isAnimating ? Infinity : 0`

---

### Step 3: Create Config File

**Location:** `components/loaders/[loader-slug]/config.json`

**Template:**

```json
{
  "name": "Loader Display Name",
  "category": "loaders",
  "tags": ["descriptive", "tags", "animation-type", "style"],
  "description": "Brief one-line description of the loader animation",
  "createdAt": "2026-02-20",
  "variations": [
    {
      "name": "default",
      "displayName": "Loader Display Name",
      "tier": "free",
      "description": "Detailed description of how the animation works and what it looks like",
      "animationType": "loop",
      "dependencies": ["framer-motion"],
      "props": [
        {
          "name": "width",
          "type": "number",
          "default": 45,
          "description": "Width of the loader container in pixels"
        },
        {
          "name": "height",
          "type": "number",
          "default": 45,
          "description": "Height of the loader container in pixels"
        },
        {
          "name": "color",
          "type": "string",
          "default": "currentColor",
          "description": "Color of the loader elements"
        },
        {
          "name": "isAnimating",
          "type": "boolean",
          "default": true,
          "description": "Controls whether the animation runs. Set to false to pause animation."
        }
      ]
    }
  ]
}
```

**Config Guidelines:**

1. **name:** User-facing display name (Title Case)
2. **category:** Always "loaders"
3. **tags:** 4-6 descriptive tags (lowercase, hyphenated)
4. **description:** One clear sentence describing the animation
5. **tier:** "free" for all loaders (premium system not implemented yet)
6. **props:** Document ALL props with clear descriptions

**Good Tag Examples:**
- Animation type: `spinner`, `bars`, `dots`, `pulse`, `bounce`
- Direction: `horizontal`, `vertical`, `circular`, `radial`
- Style: `minimal`, `modern`, `wave`, `cascade`, `sequential`
- Visual: `smooth`, `sharp`, `gradient`, `striped`

---

### Step 4: Animation Best Practices

#### Timing & Duration
```tsx
// Good timing ranges:
duration: 0.8 - 2.0 seconds  // Most loaders
duration: 1.5 seconds        // Sweet spot for most animations
duration: 0.6 seconds        // Fast, energetic loaders
duration: 2.5 seconds        // Slow, smooth loaders
```

#### Easing Functions
```tsx
// Pre-defined easings (use as const)
const linear = [0, 0, 1, 1] as const;
const easeInOut = [0.42, 0, 0.58, 1] as const;
const easeInOutQuad = [0.455, 0.03, 0.515, 0.955] as const;
const easeInOutCubic = [0.645, 0.045, 0.355, 1] as const;
const easeInOutBack = [0.68, -0.55, 0.265, 1.55] as const;

// Or use string values
ease: "easeInOut"
ease: "linear"
ease: "anticipate"
```

#### Animation Keyframes
```tsx
// Use times array for precise control
animate={{
  y: [0, -10, 0, 10, 0]  // 5 keyframes
}}
transition={{
  times: [0, 0.25, 0.5, 0.75, 1],  // Evenly spaced
  duration: 2
}}

// Or let Framer Motion distribute evenly
animate={{
  scale: [1, 1.5, 1]  // Auto-distributed
}}
```

#### Staggered Animations
```tsx
// For multiple elements with delay
const elements = [0, 1, 2, 3, 4];

{elements.map((i) => (
  <motion.rect
    key={i}
    animate={{ y: [0, -20, 0] }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      delay: i * 0.1,  // Stagger by 0.1s
      ease: "easeInOut"
    }}
  />
))}
```

---

### Step 5: Dimension Calculations

Always calculate dimensions **relative to container size**:

```tsx
export function MyLoader({ width = 45, height = 45 }: Props) {
  // ✅ GOOD: Relative sizing
  const dotSize = width * 0.15;        // 15% of width
  const spacing = width * 0.25;         // 25% of width
  const centerX = width / 2;            // Center point
  const centerY = height / 2;           // Center point
  const radius = Math.min(width, height) * 0.3;  // 30% of smallest dimension
  
  // ❌ BAD: Hard-coded values
  const dotSize = 6;   // Won't scale!
  const spacing = 10;  // Won't scale!
}
```

**Common Calculations:**
```tsx
// Center positioning
cx={width / 2}
cy={height / 2}

// Circular arrangement
const angle = (360 / totalDots) * index;
const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

// Grid positioning
const cols = 3;
const cellWidth = width / cols;
const cellHeight = height / rows;
const x = (col * cellWidth) + (cellWidth / 2);
const y = (row * cellHeight) + (cellHeight / 2);
```

---

### Step 6: SVG Elements Reference

#### Common Elements

**Circle:**
```tsx
<motion.circle
  cx={x}      // X position
  cy={y}      // Y position  
  r={radius}  // Radius
  fill={color}
  stroke={color}
  strokeWidth={2}
/>
```

**Rectangle:**
```tsx
<motion.rect
  x={x}          // Left edge
  y={y}          // Top edge
  width={w}      // Width
  height={h}     // Height
  fill={color}
  rx={2}         // Rounded corners
/>
```

**Path:**
```tsx
<motion.path
  d="M 10,10 L 90,90"  // Path commands
  stroke={color}
  strokeWidth={2}
  fill="none"
  strokeLinecap="round"
/>
```

**Line:**
```tsx
<motion.line
  x1={startX}
  y1={startY}
  x2={endX}
  y2={endY}
  stroke={color}
  strokeWidth={2}
/>
```

**Ellipse:**
```tsx
<motion.ellipse
  cx={x}
  cy={y}
  rx={radiusX}
  ry={radiusY}
  fill={color}
/>
```

---

### Step 7: Testing Your Loader

#### Visual Testing Checklist

- [ ] Renders at default size (45x45)
- [ ] Renders at small size (24x24)
- [ ] Renders at large size (100x100)
- [ ] Animation is smooth at 60fps
- [ ] Color inherits correctly with `currentColor`
- [ ] Custom colors work correctly
- [ ] No elements overflow viewBox
- [ ] Centered properly in container

#### Functional Testing Checklist

- [ ] `isAnimating={true}` runs infinitely
- [ ] `isAnimating={false}` stops animation
- [ ] No console errors or warnings
- [ ] Works in light and dark mode
- [ ] TypeScript types are correct
- [ ] Props work as documented

#### Test Component:
```tsx
// Create a test file to verify
export default function LoaderTest() {
  const [isAnimating, setIsAnimating] = useState(true);
  
  return (
    <div className="p-8 space-y-8">
      <button onClick={() => setIsAnimating(!isAnimating)}>
        Toggle: {isAnimating ? 'Playing' : 'Paused'}
      </button>
      
      {/* Default */}
      <YourLoader isAnimating={isAnimating} />
      
      {/* Small */}
      <YourLoader width={24} height={24} isAnimating={isAnimating} />
      
      {/* Large */}
      <YourLoader width={100} height={100} isAnimating={isAnimating} />
      
      {/* Custom color */}
      <YourLoader color="#3B82F6" isAnimating={isAnimating} />
      
      {/* In dark bg */}
      <div className="bg-black p-4">
        <YourLoader color="white" isAnimating={isAnimating} />
      </div>
    </div>
  );
}
```

---

### Step 8: Build Registry

After creating both files, run:

```bash
npm run build:registry
```

This will:
1. ✅ Read your `config.json`
2. ✅ Read your `default.tsx` component code
3. ✅ Generate `/public/r/[loader-slug]-default.json`
4. ✅ Update `/public/r/loaders.json` master list

**Verify the output:**
- Check `/public/r/[loader-slug]-default.json` was created
- Check `/public/r/loaders.json` includes your loader

---

### Step 9: Test Installation

Test the CLI installation:

```bash
npx shadcn@latest add https://itshover.com/r/[loader-slug]-default.json
```

**Expected behavior:**
1. ✅ Downloads component to `components/loaders/[loader-slug]/default.tsx`
2. ✅ Installs `framer-motion` dependency
3. ✅ No errors or warnings

**Then test usage:**
```tsx
import { YourLoader } from '@/components/loaders/[loader-slug]/default';

export default function Page() {
  return <YourLoader />;
}
```

---

## 🎨 Design Inspiration & Ideas

### Loader Types to Create

#### 1. Spinners (Rotating)
- Classic spinner ring
- Dual ring spinner
- Arc spinner
- Orbit dots
- Rotating squares
- Spinning triangles

#### 2. Dots & Circles
- Bouncing dots (3 in a row)
- Pulsing dots (circular arrangement)
- Growing circles
- Ripple effect
- Dot grid pulse
- Traveling dots

#### 3. Bars
- Wave bars (vertical)
- Cascade bars (horizontal)
- Fill bars (sequential)
- Flip bars (3D effect)
- Scale bars (growing)
- Slide bars (horizontal)

#### 4. Pulse Effects
- Single pulse ring
- Multiple pulse rings
- Pulse square
- Heartbeat
- Breathing circle
- Expanding grid

#### 5. Creative & Unique
- DNA helix
- Infinity symbol
- Hourglass flip
- Typing dots
- Progress arc
- Spiral loader
- Hexagon morph
- Triangle rotate

---

## 📝 Common Patterns & Code Snippets

### Pattern 1: Circular Arrangement
```tsx
// Place N elements in a circle
const totalElements = 8;
const radius = width * 0.35;
const centerX = width / 2;
const centerY = height / 2;

{Array.from({ length: totalElements }).map((_, i) => {
  const angle = (360 / totalElements) * i;
  const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
  const y = centerY + radius * Math.sin((angle * Math.PI) / 180);
  
  return (
    <motion.circle
      key={i}
      cx={x}
      cy={y}
      r={3}
      fill={color}
    />
  );
})}
```

### Pattern 2: Sequential Delay
```tsx
// Stagger animation across elements
{elements.map((_, i) => (
  <motion.element
    key={i}
    animate={{ /* animation */ }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      delay: i * 0.15,  // 0.15s between each
    }}
  />
))}
```

### Pattern 3: Scale Pulse
```tsx
<motion.circle
  animate={{
    scale: [1, 1.3, 1],
    opacity: [1, 0.6, 1]
  }}
  transition={{
    duration: 1.5,
    repeat: isAnimating ? Infinity : 0,
    ease: "easeInOut"
  }}
/>
```

### Pattern 4: Rotate Spinner
```tsx
<motion.g
  animate={{
    rotate: [0, 360]
  }}
  transition={{
    duration: 2,
    repeat: isAnimating ? Infinity : 0,
    ease: "linear"
  }}
  style={{ originX: '50%', originY: '50%' }}
>
  {/* Elements to rotate */}
</motion.g>
```

### Pattern 5: Path Drawing
```tsx
<motion.path
  d="M 0,50 Q 25,0 50,50 T 100,50"
  stroke={color}
  strokeWidth={3}
  fill="none"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{
    duration: 2,
    repeat: isAnimating ? Infinity : 0,
    ease: "easeInOut"
  }}
/>
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T:
1. Hard-code pixel values
2. Forget `isAnimating` prop
3. Use `while` loops or intervals
4. Forget TypeScript types
5. Use raster images
6. Forget accessibility attributes
7. Make animations too fast (<0.5s)
8. Make animations too slow (>3s)
9. Use too many elements (>20)
10. Forget to test at different sizes

### ✅ DO:
1. Calculate dimensions relatively
2. Include `isAnimating` control
3. Use Framer Motion transitions
4. Define proper interfaces
5. Use SVG elements only
6. Add aria-label and role
7. Use 0.8-2.5s duration range
8. Keep animations smooth
9. Optimize element count
10. Test thoroughly

---

## 📊 Quick Reference Card

```
LOADER CREATION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━
1. Choose name (kebab-case)
2. Create folder: components/loaders/[name]/
3. Create default.tsx:
   - Export function in PascalCase
   - Props: width, height, color, isAnimating
   - SVG with proper viewBox
   - motion.* elements
   - repeat: isAnimating ? Infinity : 0
4. Create config.json:
   - name, category: "loaders"
   - tags (4-6), description
   - props documentation
5. Run: npm run build:registry
6. Test visual & functional
7. Test CLI installation
8. Verify usage in app
━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🚀 Ready to Create!

With this plan, you can now create consistent, high-quality loaders that integrate seamlessly with the ItsHover Icon Library system. Follow each step carefully, and refer back to existing loaders as examples.

**Next Steps:**
1. Review this plan thoroughly
2. Study existing loader examples
3. Plan your loader animation
4. Create the component and config files
5. Build, test, and deploy

Good luck! 🎯