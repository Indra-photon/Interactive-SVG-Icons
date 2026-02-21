# Hybrid Animation Control - Implementation Plan

## Goal
Add optional `isAnimating` prop to all loader components for animation control while maintaining infinite animation as default.

## Approach
**Hybrid Pattern**: 
- Default behavior: Animation runs infinitely (no prop needed)
- Optional control: Pass `isAnimating` prop for start/stop control
- Backward compatible: Existing usage continues to work

## Technical Implementation

### 1. Component Level Changes
```tsx
interface LoaderProps {
  // ... existing props
  isAnimating?: boolean; // Optional, defaults to true
}

export function Loader({ 
  isAnimating = true, // Default true for infinite animation
  // ... other props
}: LoaderProps) {
  // Use isAnimating in transition
  transition={{
    repeat: isAnimating ? Infinity : 0,
    // ... other transition props
  }}
}
```

### 2. Config Level Changes
Add new prop to each loader's `config.json`:
```json
{
  "name": "isAnimating",
  "type": "boolean",
  "default": true,
  "description": "Controls whether the animation runs. Set to false to pause animation."
}
```

## Files to Update
All loader component files in:
- `components/loaders/*/default.tsx` (8-10 files)
- `components/loaders/*/config.json` (8-10 files)

## Testing
- Default (no prop): Should animate infinitely ✓
- `isAnimating={true}`: Should animate infinitely ✓
- `isAnimating={false}`: Should stop/pause animation ✓
- Showcase pages: No changes needed ✓

## Benefits
✅ Maintains current infinite animation behavior  
✅ Gives users optional control  
✅ No breaking changes  
✅ Clean, intuitive API