# Loader Creation Tasks - 20 CSS to React/Framer Motion Conversions

## 📋 Overview
This document contains 20 individual tasks for converting CSS-based loaders to React components with Framer Motion animations. Each task is self-contained and includes the CSS source, conversion strategy, and implementation details.

---

## 🏷️ Loader Categories & Keywords

### Category System
All loaders are tagged with multiple keywords for easy filtering:

**Animation Style Keywords:**
- `bounce` - Bouncing/jumping motion
- `slide` - Horizontal/vertical sliding
- `rotate` - Rotating/spinning elements
- `pulse` - Growing/shrinking effects
- `fill` - Filling/loading progress
- `morph` - Shape transforming
- `wave` - Wave-like motion
- `swing` - Pendulum/swinging motion

**Visual Pattern Keywords:**
- `ball` - Ball/sphere shapes
- `square` - Square/rectangle shapes
- `circle` - Circular shapes
- `triangle` - Triangle shapes
- `line` - Line-based designs
- `grid` - Grid layout patterns
- `radial` - Radial/circular arrangement
- `linear` - Linear arrangement

**Complexity Keywords:**
- `simple` - Single element
- `multi` - Multiple elements
- `complex` - Advanced animations
- `minimal` - Clean, minimalist
- `gradient` - Uses color gradients
- `geometric` - Geometric shapes

**Motion Keywords:**
- `continuous` - Smooth continuous motion
- `sequential` - Step-by-step animation
- `simultaneous` - Elements move together
- `alternating` - Back-and-forth motion
- `infinite` - Infinite loop

---

## 📦 Task Template Structure

Each task follows this format:
1. **Task ID & Name**
2. **Keywords** (for categorization)
3. **CSS Source** (original code)
4. **Animation Analysis** (what's happening)
5. **Conversion Strategy** (how to implement)
6. **Component Specifications** (props and defaults)
7. **Implementation Notes** (specific tips)

---

## Task 1: Ball Bounce Slide

**Keywords:** `bounce`, `slide`, `ball`, `simple`, `continuous`, `linear`, `horizontal`

### CSS Source
```css
.loader {
  height: 60px;
  aspect-ratio: 2;
  border-bottom: 3px solid #524656;
  position: relative;
  overflow: hidden;
}
.loader:before {
  content: "";
  position: absolute;
  inset: auto 42.5% 0;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #CF4647;
  animation: 
    l1-0 .5s cubic-bezier(0,900,1,900) infinite,
    l1-1  2s linear infinite;
}
@keyframes l1-0 {
  0%,2% {bottom: 0%}
  98%,to {bottom:.1%}
}
@keyframes l1-1 {
  0% {translate: -500%}
  to {translate:  500%}
}
```

### Animation Analysis
- Ball bounces vertically with extreme easing (0,900,1,900)
- Simultaneously slides horizontally left to right infinitely
- Ground line at bottom
- Ball is ~15% of container width

### Conversion Strategy
1. Container: SVG with bottom border line
2. Ball: `motion.circle` with two simultaneous animations
3. Use compound animation: `y` for bounce, `x` for slide
4. Bounce uses extreme cubic-bezier, slide uses linear

### Component Specifications
```typescript
interface BallBounceSlideProps {
  width?: number;        // default: 90
  height?: number;       // default: 45
  color?: string;        // default: "currentColor"
  lineColor?: string;    // default: "#524656"
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/ball-bounce-slide/
├── default.tsx
└── config.json
```

### Implementation Notes
- Container aspect ratio: 2:1 (width is 2x height)
- Ball radius: `height * 0.15`
- Bounce height: Very minimal (0% to 0.1%)
- Slide range: -500% to +500% (5x container width each way)
- Line at bottom: `height - 1.5` (3px stroke centered)
- Extreme easing creates sudden bounce effect
- Ball center starts at 42.5% of width (slightly off-center)

### Config Tags
```json
"tags": ["bounce", "slide", "ball", "simple", "continuous", "linear", "horizontal"]
```

---

## Task 2: Ball Bounce Slide Alternate

**Keywords:** `bounce`, `slide`, `ball`, `simple`, `alternating`, `linear`, `horizontal`

### CSS Source
```css
.loader {
  height: 60px;
  aspect-ratio: 2;
  border-bottom: 3px solid #524656;
  position: relative;
  overflow: hidden;
}
.loader:before {
  content: "";
  position: absolute;
  inset: auto 42.5% 0;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #CF4647;
  animation: 
    l2-0 .5s cubic-bezier(0,900,1,900) infinite,
    l2-1  2s linear infinite alternate;
}
@keyframes l2-0 {
  0%,2% {bottom: 0%}
  98%,to {bottom:.1%}
}
@keyframes l2-1 {
  0% {translate: -500%}
  to {translate:  500%}
}
```

### Animation Analysis
- Same as Task 1 BUT horizontal motion alternates direction
- Ball bounces left-to-right, then right-to-left
- Creates pendulum effect

### Conversion Strategy
1. Same structure as Task 1
2. Add `repeat: Infinity` + `repeatType: "reverse"` to x animation
3. This creates the alternate behavior

### Component Specifications
Same as Task 1

### File Structure
```
components/loaders/ball-bounce-alternate/
├── default.tsx
└── config.json
```

### Implementation Notes
- Everything same as Task 1
- Only difference: x animation uses `repeatType: "reverse"`
- This makes ball go back and forth instead of wrapping

### Config Tags
```json
"tags": ["bounce", "slide", "ball", "simple", "alternating", "linear", "horizontal"]
```

---

## Task 3: Ball Bounce Dashed Line

**Keywords:** `bounce`, `ball`, `simple`, `continuous`, `linear`, `animated-line`, `dash`

### CSS Source
```css
.loader {
  height: 60px;
  aspect-ratio: 2;
  border-bottom: 3px solid #0000;
  background: 
    linear-gradient(90deg,#524656 50%,#0000 0)
    -25% 100%/50% 3px repeat-x border-box;
  position: relative;
  animation: l3-0 .75s linear infinite;
}
.loader:before {
  content: "";
  position: absolute;
  inset: auto 42.5% 0;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #CF4647;
  animation: l3-1 .75s cubic-bezier(0,900,1,900) infinite;
}
@keyframes l3-0 {
  to {background-position: -125% 100%}
}
@keyframes l3-1 {
  0%,2% {bottom: 0%}
  98%,to {bottom:.1%}
}
```

### Animation Analysis
- Ball bounces in place (no horizontal movement)
- Dashed line underneath animates left-to-right (moving dashes)
- Creates illusion of ground moving while ball stays centered

### Conversion Strategy
1. SVG container with pattern for dashed line
2. Animate pattern with `x` offset
3. Ball: `motion.circle` with only y animation
4. Use SVG `<line>` with `strokeDasharray` and animate `strokeDashoffset`

### Component Specifications
```typescript
interface BallBounceDashedProps {
  width?: number;        // default: 90
  height?: number;       // default: 45
  color?: string;        // default: "currentColor"
  lineColor?: string;    // default: "#524656"
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/ball-bounce-dashed/
├── default.tsx
└── config.json
```

### Implementation Notes
- Ball stays centered horizontally (no x animation)
- Dashed line: use `strokeDasharray="50% 50%"`
- Animate `strokeDashoffset` from 0 to 100% of width
- Faster animation: 0.75s (same for ball and line)
- Dash pattern: 50% solid, 50% gap
- Line animates -125% creating seamless loop

### Config Tags
```json
"tags": ["bounce", "ball", "simple", "continuous", "animated-line", "dash", "centered"]
```

---

## Task 4: Ball Bounce Box Rotate

**Keywords:** `bounce`, `rotate`, `ball`, `square`, `multi`, `sequential`, `geometric`

### CSS Source
```css
.loader {
  height: 60px;
  aspect-ratio: 1;
  position: relative;
  border: 3px solid #0000;
}
.loader:before {
  content: "";
  position: absolute;
  inset: auto 35% 0;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #CF4647;
  animation: l6-0 .5s cubic-bezier(0,800,1,800) infinite;
}
.loader:after {
  content: "";
  position: absolute;
  inset: 0;
  outline: 3px solid #524656;
  animation: l6-1 .5s linear infinite;
}
@keyframes l6-0 {
  0%,2% {bottom: 0%}
  98%,to {bottom:.1%}
}
@keyframes l6-1 {
  0%,30% {rotate:  0deg}
  70%,to {rotate: 90deg}
}
```

### Animation Analysis
- Ball bounces inside a square box
- Box rotates 90° in steps (0° for 30%, then 90° for 70%)
- Ball maintains position relative to box
- Aspect ratio 1:1 (square container)

### Conversion Strategy
1. SVG container square
2. `motion.g` group for rotating box outline
3. Ball inside group (rotates with box)
4. Box: `motion.rect` with stroke, no fill
5. Rotate box, ball bounces within

### Component Specifications
```typescript
interface BallBounceBoxProps {
  width?: number;        // default: 60
  height?: number;       // default: 60
  color?: string;        // default: "currentColor"
  boxColor?: string;     // default: "#524656"
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/ball-bounce-box/
├── default.tsx
└── config.json
```

### Implementation Notes
- Square container (1:1 aspect ratio)
- Box outline: 3px stroke
- Ball radius: `width * 0.15` (30% of box width diameter)
- Ball positioned 35% from left edge
- Rotation happens in steps: [0, 0, 90, 90] with times [0, 0.3, 0.7, 1]
- Ball bounce: extreme easing (0,800,1,800)
- Both animations: 0.5s duration

### Config Tags
```json
"tags": ["bounce", "rotate", "ball", "square", "multi", "sequential", "geometric"]
```

---

## Task 5: Circular Wave Fill

**Keywords:** `wave`, `fill`, `circle`, `gradient`, `radial`, `complex`, `smooth`

### CSS Source
```css
.loader {    
  --r1: 154%;
  --r2: 68.5%;
  width: 60px;
  aspect-ratio: 1;
  border-radius: 50%; 
  background:
    radial-gradient(var(--r1) var(--r2) at top   ,#0000 79.5%,#269af2 80%),
    radial-gradient(var(--r1) var(--r2) at bottom,#269af2 79.5%,#0000 80%),
    radial-gradient(var(--r1) var(--r2) at top   ,#0000 79.5%,#269af2 80%),
    #ccc;
  background-size: 50.5% 220%;
  background-position: -100% 0%,0% 0%,100% 0%;
  background-repeat:no-repeat;
  animation: l9 2s infinite linear;
}
@keyframes l9 {
    33%  {background-position:    0% 33% ,100% 33% ,200% 33% }
    66%  {background-position: -100%  66%,0%   66% ,100% 66% }
    100% {background-position:    0% 100%,100% 100%,200% 100%}
}
```

### Animation Analysis
- Circle fills with wave-like pattern from bottom to top
- Three overlapping radial gradients create wave effect
- Gradients animate vertically creating flowing motion
- Background is light gray (#ccc), wave is blue (#269af2)

### Conversion Strategy
1. Use SVG `<circle>` with mask/clipPath
2. Create wave pattern with `<path>` element
3. Animate path's `y` position from bottom to top
4. Use sine wave shape for wave pattern
5. Alternative: Multiple overlapping circles with gradients

### Component Specifications
```typescript
interface CircularWaveFillProps {
  width?: number;         // default: 60
  height?: number;        // default: 60
  color?: string;         // default: "#269af2"
  backgroundColor?: string; // default: "#cccccc"
  isAnimating?: boolean;  // default: true
}
```

### File Structure
```
components/loaders/circular-wave-fill/
├── default.tsx
└── config.json
```

### Implementation Notes
- Circular container (1:1 aspect ratio)
- Wave fills 0% to 100% over 2 seconds
- Wave pattern: sine curve with amplitude ~10% of radius
- Three keyframes: 33%, 66%, 100% for smooth progression
- Use SVG `<clipPath>` with circle to contain wave
- Wave moves upward while undulating
- Consider using multiple `motion.path` elements for wave layers

### Config Tags
```json
"tags": ["wave", "fill", "circle", "gradient", "radial", "complex", "smooth", "water"]
```

---

## Task 6: Conic Spinner Fill

**Keywords:** `spinner`, `rotate`, `circle`, `fill`, `gradient`, `conic`, `simple`, `smooth`

### CSS Source
```css
.loader {
  width: 60px;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: l11 2s infinite;
}
@keyframes l11 {
  0%   {background: conic-gradient(#f03355 0     ,#0000 0)}
  12.5%{background: conic-gradient(#f03355 45deg ,#0000 46deg)}
  25%  {background: conic-gradient(#f03355 90deg ,#0000 91deg)}
  37.5%{background: conic-gradient(#f03355 135deg,#0000 136deg)}
  50%  {background: conic-gradient(#f03355 180deg,#0000 181deg)}
  62.5%{background: conic-gradient(#f03355 225deg,#0000 226deg)}
  75%  {background: conic-gradient(#f03355 270deg,#0000 271deg)}
  87.5%{background: conic-gradient(#f03355 315deg,#0000 316deg)}
  100% {background: conic-gradient(#f03355 360deg,#0000 360deg)}
}
```

### Animation Analysis
- Circular spinner that fills like a pie chart
- Fills clockwise from 0° to 360° in 8 steps (45° increments)
- Sequential filling creates loading progress effect
- Color fills in, rest is transparent

### Conversion Strategy
1. Use SVG `<circle>` with animated `strokeDasharray`
2. Or use `<path>` drawing arc that grows
3. Animate from 0° to 360° sweep angle
4. Use 8 keyframes for stepped effect
5. Best approach: `motion.circle` with `pathLength` animation

### Component Specifications
```typescript
interface ConicSpinnerProps {
  width?: number;        // default: 60
  height?: number;       // default: 60
  color?: string;        // default: "#f03355"
  thickness?: number;    // default: 60 (full circle)
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/conic-spinner/
├── default.tsx
└── config.json
```

### Implementation Notes
- Perfect circle (1:1 aspect ratio)
- 8 stepped keyframes at 12.5% intervals
- Each step adds 45° to the fill
- Can use `pathLength` from 0 to 1 in 8 steps
- Alternative: rotate a masked circle sector
- Duration: 2s for full 360° rotation
- Consider using filled `path` arc instead of stroke

### Config Tags
```json
"tags": ["spinner", "rotate", "circle", "fill", "conic", "simple", "smooth", "progress"]
```

---

## Task 7: Triangle Cascade Fill

**Keywords:** `triangle`, `fill`, `cascade`, `sequential`, `geometric`, `complex`, `vertical`

### CSS Source
```css
.loader {
  width: 80px;
  aspect-ratio: 1.154;
  clip-path: polygon(50% 0,100% 100%,0 100%);
  --c:no-repeat linear-gradient(#f03355 0 0);
  background: var(--c),var(--c),var(--c),var(--c),var(--c);
  background-size: 100% calc(100%/5 + 1px);
  animation: l15 2s infinite;
}
@keyframes l15 {
  0%  {background-position: 0 calc(-2*100%/4),0 calc(-2*100%/4),0 calc(-2*100%/4),0 calc(-2*100%/4),0 calc(-2*100%/4)}
  20% {background-position: 0 calc(4*100%/4) ,0 calc(-2*100%/4),0 calc(-2*100%/4),0 calc(-2*100%/4),0 calc(-2*100%/4)}
  40% {background-position: 0 calc(4*100%/4) ,0 calc(3*100%/4) ,0 calc(-2*100%/4),0 calc(-2*100%/4),0 calc(-2*100%/4)}
  60% {background-position: 0 calc(4*100%/4) ,0 calc(3*100%/4) ,0 calc(2*100%/4) ,0 calc(-2*100%/4),0 calc(-2*100%/4)}
  80% {background-position: 0 calc(4*100%/4) ,0 calc(3*100%/4) ,0 calc(2*100%/4) ,0 calc(1*100%/4) ,0 calc(-2*100%/4)}
  100%{background-position: 0 calc(4*100%/4) ,0 calc(3*100%/4) ,0 calc(2*100%/4) ,0 calc(1*100%/4) ,0 calc(0*100%/4)}
}
```

### Animation Analysis
- Triangle shape fills from bottom to top
- 5 horizontal bars cascade down sequentially
- Each bar slides into position one after another
- Creates waterfall filling effect
- Aspect ratio: 1.154 (specific triangle proportions)

### Conversion Strategy
1. SVG triangle using `<polygon>` or `<path>`
2. Five horizontal `motion.rect` bars
3. Each bar animates `y` position sequentially
4. Use `<clipPath>` to mask bars within triangle
5. Stagger delays: 0s, 0.4s, 0.8s, 1.2s, 1.6s

### Component Specifications
```typescript
interface TriangleCascadeProps {
  width?: number;        // default: 80
  height?: number;       // default: 69 (80 / 1.154)
  color?: string;        // default: "#f03355"
  bars?: number;         // default: 5
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/triangle-cascade/
├── default.tsx
└── config.json
```

### Implementation Notes
- Triangle: points at [50%, 0%], [100%, 100%], [0%, 100%]
- Aspect ratio: 1.154 (width to height)
- 5 horizontal bars, each 20% height + 1px overlap
- Bars start above triangle, cascade down
- Each bar has 0.4s delay from previous
- 5 keyframes at 20% intervals (0%, 20%, 40%, 60%, 80%, 100%)
- Use clipPath to keep bars inside triangle
- Bars fill from top to bottom sequentially

### Config Tags
```json
"tags": ["triangle", "fill", "cascade", "sequential", "geometric", "complex", "vertical", "bars"]
```

---

## Task 8: Circle Spinner Wipe

**Keywords:** `spinner`, `circle`, `wipe`, `rotate`, `simple`, `smooth`, `progress`

### CSS Source
```css
.loader {
  width: 60px;
  aspect-ratio: 1;
  border: 15px solid #ddd;
  border-radius: 50%;
  position: relative;
  transform: rotate(45deg);
}
.loader::before {
  content: "";
  position: absolute;
  inset: -15px;
  border-radius: 50%;
  border: 15px solid #514b82;
  animation: l18 2s infinite linear;
}
@keyframes l18 {
    0%   {clip-path:polygon(50% 50%,0 0,0    0,0    0   ,0    0   ,0    0   )}
    25%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0   ,100% 0   ,100% 0   )}
    50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
    75%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0    100%,0    100%)}
    100% {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0    100%,0    0   )}
}
```

### Animation Analysis
- Two concentric circles (borders)
- Outer circle: light gray (#ddd) - static
- Inner circle: dark purple (#514b82) - animated
- Inner circle wipes around clockwise using clip-path
- Reveals progressively like a pie chart
- Container rotated 45° initially

### Conversion Strategy
1. Two SVG `<circle>` elements with stroke, no fill
2. Outer circle: static
3. Inner circle: animate `strokeDashoffset` from circumference to 0
4. Or use clip-path polygon animation
5. Rotate container 45° initially

### Component Specifications
```typescript
interface CircleSpinnerWipeProps {
  width?: number;         // default: 60
  height?: number;        // default: 60
  color?: string;         // default: "#514b82"
  backgroundColor?: string; // default: "#dddddd"
  thickness?: number;     // default: 15
  isAnimating?: boolean;  // default: true
}
```

### File Structure
```
components/loaders/circle-spinner-wipe/
├── default.tsx
└── config.json
```

### Implementation Notes
- Two concentric circles
- Outer circle: full stroke (background)
- Inner circle: stroke that reveals clockwise
- Stroke width: 15px (default) - customizable
- Container rotated 45° (so wipe starts from top-right)
- Use `strokeDasharray` and `strokeDashoffset` technique
- Animation: 2s linear infinite
- 4 keyframes at 25% intervals showing progressive reveal

### Config Tags
```json
"tags": ["spinner", "circle", "wipe", "rotate", "simple", "smooth", "progress", "ring"]
```

---

## Task 9: Heart Fill Pulse

**Keywords:** `heart`, `fill`, `pulse`, `simple`, `smooth`, `vertical`, `gradient`

### CSS Source
```css
.loader {
  width: 60px;
  aspect-ratio: 1;
  background: linear-gradient(#dc1818 0 0) bottom/100% 0% no-repeat #ccc;
  -webkit-mask: 
    radial-gradient(circle at 60% 65%, #000 62%, #0000 65%) top left, 
    radial-gradient(circle at 40% 65%, #000 62%, #0000 65%) top right, 
    linear-gradient(to bottom left, #000 42%,#0000 43%) bottom left , 
    linear-gradient(to bottom right,#000 42%,#0000 43%) bottom right;
  -webkit-mask-size: 50% 50%;
  -webkit-mask-repeat: no-repeat;
  animation: l19 2s infinite linear;
}
@keyframes l19 {
    90%,100% {background-size:100% 100%}
}
```

### Animation Analysis
- Heart shape created with mask
- Fills from bottom to top with red color
- Background is gray, fill is red (#dc1818)
- Fills 0% to 100% quickly at the end (90-100%)
- Most of animation is at 0%, then rapid fill

### Conversion Strategy
1. Create heart shape SVG path
2. Use `<clipPath>` for heart shape
3. `motion.rect` that grows from bottom to top
4. Animate height from 0% to 100%
5. Use stepped timing: stays at 0% until 90%, then fills

### Component Specifications
```typescript
interface HeartFillProps {
  width?: number;         // default: 60
  height?: number;        // default: 60
  color?: string;         // default: "#dc1818"
  backgroundColor?: string; // default: "#cccccc"
  isAnimating?: boolean;  // default: true
}
```

### File Structure
```
components/loaders/heart-fill/
├── default.tsx
└── config.json
```

### Implementation Notes
- Heart shape: Two circles at top + triangle at bottom
- SVG path for heart: `M30,15 Q30,5 37,5 Q45,5 45,15 Q45,25 30,40 Q15,25 15,15 Q15,5 23,5 Q30,5 30,15 Z`
- Fill animates: stays at 0% for 90% of duration, then fills to 100%
- Keyframes: [0, 0, 100] with times [0, 0.9, 1]
- Background visible through outline
- Clippath contains the fill
- Dramatic "heartbeat" effect with delayed fill

### Config Tags
```json
"tags": ["heart", "fill", "pulse", "simple", "smooth", "vertical", "gradient", "love"]
```

---

## Task 10: Square Corners Rotate

**Keywords:** `square`, `rotate`, `corners`, `multi`, `geometric`, `smooth`, `morph`

### CSS Source
```css
.loader {
  width: 40px;
  height: 40px;
  color: #f03355;
  background:
    conic-gradient(from  -45deg at top    20px left 50% ,#0000 ,currentColor 1deg 90deg,#0000 91deg),
    conic-gradient(from   45deg at right  20px top  50% ,#0000 ,currentColor 1deg 90deg,#0000 91deg),
    conic-gradient(from  135deg at bottom 20px left 50% ,#0000 ,currentColor 1deg 90deg,#0000 91deg),
    conic-gradient(from -135deg at left   20px top  50% ,#0000 ,currentColor 1deg 90deg,#0000 91deg);
  animation: l4 1.5s infinite cubic-bezier(0.3,1,0,1);
}
@keyframes l4 {
   50%  {width:60px;height: 60px;transform: rotate(180deg)}
   100% {transform: rotate(360deg)}
}
```

### Animation Analysis
- Four corner pieces (90° arcs) positioned at square corners
- Square grows from 40px to 60px while rotating 180°
- Then shrinks back to 40px while rotating another 180°
- Creates pulsing rotation effect
- Corner pieces stay at corners during scale+rotation

### Conversion Strategy
1. Four `motion.path` elements for corner arcs
2. Group in `motion.g` container
3. Animate container: `scale` from 1 to 1.5 to 1
4. Simultaneously rotate: 0° to 180° to 360°
5. Position arcs at corners using path data

### Component Specifications
```typescript
interface SquareCornersRotateProps {
  width?: number;        // default: 40
  height?: number;       // default: 40
  color?: string;        // default: "currentColor"
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/square-corners-rotate/
├── default.tsx
└── config.json
```

### Implementation Notes
- Starting size: 40x40px
- Max size: 60x60px (1.5x scale)
- Four corner arcs: 90° each
- Arc radius: ~20px (half of container)
- Position arcs at: top-center, right-center, bottom-center, left-center
- Animation sequence: grow+rotate180° (50%), shrink+rotate180° (50%)
- Total rotation: 360° per cycle
- Easing: cubic-bezier(0.3, 1, 0, 1) - bouncy
- Use SVG arc paths: `M x y A r r 0 0 1 x2 y2`

### Config Tags
```json
"tags": ["square", "rotate", "corners", "multi", "geometric", "smooth", "morph", "pulse"]
```

---

## Task 11: Square Corners Dance

**Keywords:** `square`, `corners`, `multi`, `geometric`, `minimal`, `simple`, `dance`

### CSS Source
```css
.loader {
    width: 40px;
    height: 40px;
    --c:no-repeat linear-gradient(orange 0 0);
    background: var(--c),var(--c),var(--c),var(--c);
    background-size: 21px 21px;
    animation: l5 1.5s infinite cubic-bezier(0.3,1,0,1);
}
@keyframes l5 {
   0%   {background-position: 0    0,100% 0   ,100% 100%,0 100%}
   33%  {background-position: 0    0,100% 0   ,100% 100%,0 100%;width:60px;height: 60px}
   66%  {background-position: 100% 0,100% 100%,0    100%,0 0   ;width:60px;height: 60px}
   100% {background-position: 100% 0,100% 100%,0    100%,0 0   }
}
```

### Animation Analysis
- Four square pieces at corners
- Square expands from 40px to 60px
- Corner pieces rotate/swap positions during expansion
- Shrinks back to 40px with pieces in new positions
- Pieces appear to "dance" around corners

### Conversion Strategy
1. Four `motion.rect` squares at corners
2. Animate container scale: 1 → 1.5 → 1
3. Animate each square's position to next corner (clockwise)
4. Use coordinated keyframes for smooth transition

### Component Specifications
```typescript
interface SquareCornersDanceProps {
  width?: number;        // default: 40
  height?: number;       // default: 40
  color?: string;        // default: "currentColor"
  cornerSize?: number;   // default: 21
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/square-corners-dance/
├── default.tsx
└── config.json
```

### Implementation Notes
- Starting size: 40x40px, expands to 60x60px
- Four squares: 21x21px each (slightly overlapping)
- Initial positions: [0,0], [100%,0], [100%,100%], [0,100%]
- At 33%: expand to 60x60px (1.5x)
- At 66%: squares rotate to next corner position (still expanded)
- At 100%: shrink back to 40x40px
- Each square moves clockwise: TL→TR→BR→BL→TL
- Easing: cubic-bezier(0.3,1,0,1)
- Pieces stay at corners, container size changes

### Config Tags
```json
"tags": ["square", "corners", "multi", "geometric", "minimal", "simple", "dance", "morph"]
```

---

## Task 12: Cross Expand

**Keywords:** `cross`, `expand`, `geometric`, `multi`, `pulse`, `minimal`, `plus`

### CSS Source
```css
.loader {
  width: 40px;
  height: 40px;
  position: relative;
  --c:no-repeat linear-gradient(#25b09b 0 0);
  background:
    var(--c) center/100% 10px,
    var(--c) center/10px 100%;
}
.loader:before {
  content:'';
  position: absolute;
  inset: 0;
  background:
    var(--c) 0    0,
    var(--c) 100% 0,
    var(--c) 0    100%,
    var(--c) 100% 100%;
  background-size: 15.5px 15.5px;
  animation: l16 1.5s infinite cubic-bezier(0.3,1,0,1);
}
@keyframes l16 {
   33%  {inset:-10px;transform: rotate(0deg)}
   66%  {inset:-10px;transform: rotate(90deg)}
   100% {inset:0    ;transform: rotate(90deg)}
}
```

### Animation Analysis
- Center cross (plus sign) - static
- Four corner squares
- Corner squares expand outward (inset -10px)
- Rotate 90° while expanded
- Collapse back while maintaining rotation
- Creates pulsing cross pattern

### Conversion Strategy
1. Center cross: two `motion.rect` (horizontal and vertical bars)
2. Four corner squares: `motion.rect` at corners
3. Group corners in `motion.g`
4. Animate group: scale (expand/contract) + rotate
5. Center cross stays fixed

### Component Specifications
```typescript
interface CrossExpandProps {
  width?: number;        // default: 40
  height?: number;       // default: 40
  color?: string;        // default: "#25b09b"
  crossThickness?: number; // default: 10
  cornerSize?: number;   // default: 15.5
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/cross-expand/
├── default.tsx
└── config.json
```

### Implementation Notes
- Center cross: 10px thick bars (horizontal and vertical)
- Four corner squares: 15.5x15.5px
- Animation sequence:
  - 0-33%: corners expand outward (scale 1 to 1.5)
  - 33-66%: corners rotate 90° (while expanded)
  - 66-100%: corners contract back (scale 1.5 to 1, rotation maintained)
- Expansion: translate outward by 10px in each direction
- Corner positions: [0,0], [width-size, 0], [0, height-size], [width-size, height-size]
- Rotation transforms around center of corner squares
- Center cross never moves/rotates

### Config Tags
```json
"tags": ["cross", "expand", "geometric", "multi", "pulse", "minimal", "plus", "rotate"]
```

---

## Task 13: Dot Circle Expand

**Keywords:** `dots`, `circle`, `radial`, `expand`, `pulse`, `multi`, `smooth`

### CSS Source
```css
.loader {
  width: 40px;
  aspect-ratio: 1;
  color: #f03355;
  position: relative;
  background: radial-gradient(10px,currentColor 94%,#0000);
}
.loader:before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    radial-gradient(9px at bottom right,#0000 94%,currentColor) top    left,
    radial-gradient(9px at bottom left ,#0000 94%,currentColor) top    right,
    radial-gradient(9px at top    right,#0000 94%,currentColor) bottom left,
    radial-gradient(9px at top    left ,#0000 94%,currentColor) bottom right;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  animation: l18 1.5s infinite cubic-bezier(0.3,1,0,1);
}
@keyframes l18 {
   33%  {inset:-10px;transform: rotate(0deg)}
   66%  {inset:-10px;transform: rotate(90deg)}
   100% {inset:0    ;transform: rotate(90deg)}
}
```

### Animation Analysis
- Center dot - static (10px radius)
- Four corner dots (9px radius each)
- Corner dots expand outward
- Rotate 90° while expanded
- Contract back while keeping rotation
- Similar to Cross Expand but with circular dots

### Conversion Strategy
1. Center dot: `motion.circle` - static
2. Four corner dots: `motion.circle` positioned at corners
3. Group corner dots in `motion.g`
4. Animate: expand (translate outward) + rotate + contract
5. Same animation pattern as Cross Expand

### Component Specifications
```typescript
interface DotCircleExpandProps {
  width?: number;        // default: 40
  height?: number;       // default: 40
  color?: string;        // default: "currentColor"
  centerDotSize?: number; // default: 10
  cornerDotSize?: number; // default: 9
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/dot-circle-expand/
├── default.tsx
└── config.json
```

### Implementation Notes
- Center dot: 10px radius (20px diameter)
- Corner dots: 9px radius (18px diameter)
- Square container: 40x40px
- Corner dot positions (centers): [10, 10], [30, 10], [30, 30], [10, 30]
- Animation identical to Task 12:
  - 0-33%: expand outward by 10px
  - 33-66%: rotate 90° while expanded
  - 66-100%: contract while maintaining rotation
- Use `transform-origin: center` for proper rotation
- Easing: cubic-bezier(0.3,1,0,1)

### Config Tags
```json
"tags": ["dots", "circle", "radial", "expand", "pulse", "multi", "smooth", "rotate"]
```

---

## Task 14: Spinner Orbit Dots

**Keywords:** `spinner`, `dots`, `orbit`, `circle`, `radial`, `smooth`, `minimal`

### CSS Source
*Note: This is a derivative/variation - creating orbital dot spinner*

### Animation Analysis
- Multiple dots arranged in a circle
- Dots orbit around center point
- Smooth continuous rotation
- Classic orbital loader pattern

### Conversion Strategy
1. Arrange 8-12 dots in circular pattern
2. Calculate positions using trigonometry
3. Rotate entire group continuously
4. Optional: fade dots based on position (tail effect)

### Component Specifications
```typescript
interface SpinnerOrbitDotsProps {
  width?: number;        // default: 60
  height?: number;       // default: 60
  color?: string;        // default: "currentColor"
  dotCount?: number;     // default: 8
  dotSize?: number;      // default: 8
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/spinner-orbit-dots/
├── default.tsx
└── config.json
```

### Implementation Notes
- Circular arrangement of dots
- Radius: 40% of container width
- Dot positions: angle = (360 / dotCount) * index
- x = centerX + radius * cos(angle)
- y = centerY + radius * sin(angle)
- Rotate entire group 360° continuously
- Duration: 1.2s for smooth rotation
- Optional opacity gradient: dots fade in rotation direction
- Use `motion.g` wrapper for rotation

### Config Tags
```json
"tags": ["spinner", "dots", "orbit", "circle", "radial", "smooth", "minimal", "rotate"]
```

---

## Task 15: Pulse Ring

**Keywords:** `pulse`, `ring`, `circle`, `simple`, `smooth`, `minimal`, `radial`

### CSS Source
*Creating a simple pulsing ring loader*

### Animation Analysis
- Single ring that pulses (scale + opacity)
- Grows from small to large
- Fades out while growing
- Multiple rings can overlap for ripple effect

### Conversion Strategy
1. Single `motion.circle` with stroke, no fill
2. Animate `scale`: 0.5 → 1.5
3. Animate `opacity`: 1 → 0
4. Start over when complete
5. Optional: stagger multiple rings

### Component Specifications
```typescript
interface PulseRingProps {
  width?: number;        // default: 60
  height?: number;       // default: 60
  color?: string;        // default: "currentColor"
  ringCount?: number;    // default: 3
  thickness?: number;    // default: 3
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/pulse-ring/
├── default.tsx
└── config.json
```

### Implementation Notes
- Base ring radius: 30% of width
- Stroke width: 3px (default)
- Animation: 1.5s duration
- Scale: 0.5 → 1.5 (3x growth)
- Opacity: 1 → 0 (fade out)
- For multiple rings: stagger by duration/ringCount
- Each ring starts when previous is 1/3 through
- Center all rings at viewBox center
- Use `strokeWidth` for thickness control

### Config Tags
```json
"tags": ["pulse", "ring", "circle", "simple", "smooth", "minimal", "radial", "ripple"]
```

---

## Task 16: Bars Scale Wave

**Keywords:** `bars`, `scale`, `wave`, `vertical`, `multi`, `smooth`, `simple`

### CSS Source
*Creating vertical bars that scale in wave pattern*

### Animation Analysis
- 5 vertical bars in a row
- Each bar scales height independently
- Staggered timing creates wave effect
- Bars grow and shrink continuously

### Conversion Strategy
1. Five `motion.rect` vertical bars
2. Each animates `scaleY`: 0.3 → 1 → 0.3
3. Stagger delays: 0s, 0.1s, 0.2s, 0.3s, 0.4s
4. All centered at baseline (bottom)
5. Use `transformOrigin: bottom` for scaling from base

### Component Specifications
```typescript
interface BarsScaleWaveProps {
  width?: number;        // default: 60
  height?: number;       // default: 60
  color?: string;        // default: "currentColor"
  barCount?: number;     // default: 5
  barWidth?: number;     // default: 8
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/bars-scale-wave/
├── default.tsx
└── config.json
```

### Implementation Notes
- 5 bars evenly spaced
- Bar width: 8px (default)
- Spacing: (width - totalBarWidth) / (barCount + 1)
- Height animation: 30% → 100% → 30%
- Duration: 1s total
- Stagger: 0.1s between bars (1s / 10 steps)
- Scale from bottom (transform-origin: center bottom)
- Smooth easing: easeInOut
- Each bar is full height container

### Config Tags
```json
"tags": ["bars", "scale", "wave", "vertical", "multi", "smooth", "simple", "equalizer"]
```

---

## Task 17: Dots Bounce

**Keywords:** `dots`, `bounce`, `horizontal`, `simple`, `smooth`, `minimal`, `three`

### CSS Source
*Creating three bouncing dots in a row*

### Animation Analysis
- Three dots in horizontal line
- Each bounces up and down
- Staggered timing creates wave
- Classic "typing" or "loading" indicator

### Conversion Strategy
1. Three `motion.circle` dots
2. Each animates `y` position: 0 → -height*0.3 → 0
3. Stagger delays: 0s, 0.15s, 0.3s
4. Smooth bounce easing
5. Continuous loop

### Component Specifications
```typescript
interface DotsBounceProps {
  width?: number;        // default: 60
  height?: number;       // default: 30
  color?: string;        // default: "currentColor"
  dotSize?: number;      // default: 8
  dotCount?: number;     // default: 3
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/dots-bounce/
├── default.tsx
└── config.json
```

### Implementation Notes
- Three dots: radius 8px each
- Spacing: evenly distributed across width
- Bounce height: 30% of container height
- Duration: 0.8s per bounce
- Stagger: 0.15s between dots
- Easing: easeInOut or custom bounce easing
- Dots stay in horizontal line, only y changes
- All dots centered vertically when at rest

### Config Tags
```json
"tags": ["dots", "bounce", "horizontal", "simple", "smooth", "minimal", "three", "typing"]
```

---

## Task 18: Square Flip

**Keywords:** `square`, `flip`, `3d`, `rotate`, `simple`, `smooth`, `minimal`

### CSS Source
*Creating a square that flips on Y-axis*

### Animation Analysis
- Single square
- Flips 180° on Y-axis (vertical flip)
- Creates 3D card-flip effect
- Continuous rotation

### Conversion Strategy
1. Single `motion.rect` square
2. Animate `rotateY`: 0° → 180° → 360°
3. Use perspective for 3D effect (SVG limitation: simulate with scaleX)
4. Alternative: animate `scaleX`: 1 → 0 → 1 (squash effect)

### Component Specifications
```typescript
interface SquareFlipProps {
  width?: number;        // default: 40
  height?: number;       // default: 40
  color?: string;        // default: "currentColor"
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/square-flip/
├── default.tsx
└── config.json
```

### Implementation Notes
- Square: 40x40px centered
- SVG doesn't support true 3D, use scaleX workaround
- Animate scaleX: 1 → 0 → 1 (creates flip illusion)
- Duration: 1.2s
- Easing: easeInOut
- At scaleX=0 (middle), appears as vertical line
- Optional: change color at halfway point for "back side"
- Transform origin: center

### Config Tags
```json
"tags": ["square", "flip", "3d", "rotate", "simple", "smooth", "minimal", "morph"]
```

---

## Task 19: Hexagon Rotate

**Keywords:** `hexagon`, `rotate`, `geometric`, `spinner`, `simple`, `smooth`, `polygon`

### CSS Source
*Creating rotating hexagon loader*

### Animation Analysis
- Hexagon shape
- Rotates continuously 360°
- Clean geometric spinner
- Modern minimalist look

### Conversion Strategy
1. Create hexagon using `<polygon>` or `<path>`
2. Wrap in `motion.g` group
3. Rotate group continuously
4. Optional: add stroke animation or scale pulse

### Component Specifications
```typescript
interface HexagonRotateProps {
  width?: number;        // default: 50
  height?: number;       // default: 50
  color?: string;        // default: "currentColor"
  thickness?: number;    // default: 3
  filled?: boolean;      // default: false
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/hexagon-rotate/
├── default.tsx
└── config.json
```

### Implementation Notes
- Regular hexagon: 6 sides, equal angles (60° each)
- Calculate points using trigonometry
- Center: [width/2, height/2]
- Radius: width * 0.4
- Points: 6 vertices at 60° intervals
- Rotate continuously: 0° → 360°
- Duration: 2s
- Linear easing for smooth rotation
- Can be filled or stroke-only (outline)
- Transform origin: center

### Config Tags
```json
"tags": ["hexagon", "rotate", "geometric", "spinner", "simple", "smooth", "polygon", "minimal"]
```

---

## Task 20: Infinity Loop

**Keywords:** `infinity`, `loop`, `smooth`, `continuous`, `path`, `minimal`, `symbol`

### CSS Source
*Creating infinity symbol (∞) with moving dot*

### Animation Analysis
- Infinity symbol shape (∞)
- Dot travels along the path
- Continuous figure-8 motion
- Elegant mathematical symbol

### Conversion Strategy
1. Create infinity path using SVG `<path>`
2. Dot: `motion.circle` that follows path
3. Animate dot along path using `offsetDistance`
4. Or animate x,y coordinates to trace figure-8
5. Smooth continuous motion

### Component Specifications
```typescript
interface InfinityLoopProps {
  width?: number;        // default: 80
  height?: number;       // default: 40
  color?: string;        // default: "currentColor"
  pathColor?: string;    // default: "#cccccc"
  dotSize?: number;      // default: 6
  showPath?: boolean;    // default: true
  isAnimating?: boolean; // default: true
}
```

### File Structure
```
components/loaders/infinity-loop/
├── default.tsx
└── config.json
```

### Implementation Notes
- Infinity symbol: two circles joined (figure-8 on side)
- Path: `M20,20 Q40,10 60,20 Q80,30 100,20 Q80,10 60,20 Q40,30 20,20 Z`
- Aspect ratio: 2:1 (width is 2x height)
- Dot travels along path: 0% → 100% (one complete loop)
- Duration: 2.5s for smooth elegant motion
- Optional: show path outline in light color
- Dot follows mathematical figure-8 curve
- Use Bézier curves for smooth shape
- Easing: linear for constant speed

### Config Tags
```json
"tags": ["infinity", "loop", "smooth", "continuous", "path", "minimal", "symbol", "elegant"]
```

---

## 🎯 Implementation Priority

### Phase 1 - Simple Loaders (Start Here)
Tasks that are easiest to implement:
1. Task 1: Ball Bounce Slide
2. Task 2: Ball Bounce Slide Alternate
3. Task 3: Ball Bounce Dashed Line
4. Task 14: Spinner Orbit Dots
5. Task 15: Pulse Ring
6. Task 17: Dots Bounce

### Phase 2 - Medium Complexity
7. Task 4: Ball Bounce Box Rotate
8. Task 6: Conic Spinner Fill
9. Task 8: Circle Spinner Wipe
10. Task 16: Bars Scale Wave
11. Task 18: Square Flip
12. Task 19: Hexagon Rotate

### Phase 3 - Advanced Loaders
13. Task 5: Circular Wave Fill
14. Task 7: Triangle Cascade Fill
15. Task 9: Heart Fill Pulse
16. Task 10: Square Corners Rotate
17. Task 11: Square Corners Dance
18. Task 12: Cross Expand
19. Task 13: Dot Circle Expand
20. Task 20: Infinity Loop

---

## 📝 Task Checklist Template

For each loader, verify:

```markdown
## [Loader Name] - Implementation Checklist

- [ ] Read CSS source code thoroughly
- [ ] Understand animation mechanics
- [ ] Create component file: `default.tsx`
- [ ] Create config file: `config.json`
- [ ] Implement all required props
- [ ] Add proper TypeScript types
- [ ] Calculate dimensions relatively
- [ ] Use `isAnimating` prop correctly
- [ ] Add proper keywords/tags
- [ ] Test at multiple sizes (24px, 45px, 100px)
- [ ] Test with different colors
- [ ] Test animation start/stop
- [ ] Verify smooth animation (60fps)
- [ ] Run build:registry script
- [ ] Verify JSON file generated
- [ ] Test CLI installation
- [ ] Verify in actual usage
```

---

## 🔄 Conversion Workflow

### For Each Loader:

1. **Analyze CSS** (10 min)
   - Read keyframes
   - Identify elements
   - Note timing/easing
   - Sketch animation mentally

2. **Plan SVG Structure** (10 min)
   - Choose SVG elements
   - Calculate positions
   - Plan animation properties
   - Identify challenges

3. **Implement Component** (30-60 min)
   - Create file structure
   - Write TypeScript interface
   - Build SVG markup
   - Add Framer Motion animations
   - Implement isAnimating control

4. **Create Config** (10 min)
   - Copy template
   - Add descriptive name
   - Write clear description
   - Add relevant tags (use keyword system)
   - Document all props

5. **Test & Refine** (20 min)
   - Visual testing (sizes, colors)
   - Animation smoothness
   - Props functionality
   - Responsive behavior

6. **Build & Verify** (10 min)
   - Run `npm run build:registry`
   - Check generated JSON
   - Test CLI installation
   - Final verification

**Total per loader: ~90-120 minutes**

---

## 🎨 Keyword Reference Quick Guide

Use these keyword combinations for accurate categorization:

**Animation Movement:**
- `bounce` + `vertical` = up/down bouncing
- `slide` + `horizontal` = left/right sliding
- `rotate` + `continuous` = smooth spinning
- `pulse` + `radial` = expanding from center
- `wave` + `sequential` = ripple effect

**Visual Elements:**
- `ball` + `simple` = single sphere
- `dots` + `multi` = multiple circles
- `bars` + `vertical` = column-like
- `ring` + `stroke` = circular outline
- `geometric` + `complex` = intricate shapes

**Complexity Indicators:**
- `simple` + `minimal` = beginner-friendly
- `multi` + `complex` = advanced implementation
- `gradient` + `smooth` = color transitions

**Motion Characteristics:**
- `continuous` + `infinite` = never stops
- `sequential` + `cascade` = one after another
- `simultaneous` + `synchronized` = all at once
- `alternating` + `reverse` = back and forth

---

## 🚀 Ready to Build!

You now have 20 complete tasks with:
- ✅ Detailed CSS source code
- ✅ Animation analysis
- ✅ Conversion strategies  
- ✅ Component specifications
- ✅ Implementation notes
- ✅ Comprehensive keyword system
- ✅ Priority ordering
- ✅ Quality checklists

**Start with Phase 1 loaders and work your way through!**

Good luck building these beautiful animated loaders! 🎯