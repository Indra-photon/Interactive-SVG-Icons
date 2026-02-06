# build-registry.ts : 
This script reads all icon configs and generates the registry JSON files that the shadcn CLI will fetch. It's the bridge between our components and the installation system.

# Config.jspn : 
Config.json holds metadata for the registry builder, while default.tsx is our first animated icon component. This pattern will be repeated for all 20 icons.

# /components/icons/
This folder will hold all our icon components organized by icon name. Each icon gets its own subfolder with variations.

# The glob package helps us find all icon config files automatically. @types/node provides TypeScript types for Node.js built-in modules like fs and path.

# "build:registry": "tsx scripts/build-registry.ts": 
This script lets us run npm run build:registry to generate all registry JSON files. tsx allows us to run TypeScript files directly without compiling first.

# /public/r/icons.json : 
This is where all registry JSON files live. The /public folder makes them accessible via URLs that the shadcn CLI can fetch.

# /app/api/r/[filename]/route.ts
This API route serves the registry JSON files to the shadcn CLI. It reads from /public/r/ and returns the JSON. Later we'll add authentication here for premium icons.

# app/api/icons/route.ts
This API powers the gallery page - it reads icons.json and supports filtering by category/search. The gallery will fetch from this instead of directly reading the file.

# app/icons/page.tsx
This is the main gallery page users will see. It fetches from our API and displays all icons in a grid. Each card links to the detail page where users will see variations and install commands.

# /app/icons/[slug]/page.tsx
This page now shows ALL variations in a grid. User clicks one variation card to go deeper into the single variation detail page where they'll see it in action + get install command.

# /app/icons/[slug]/[variations]/page.tsx
This is the final destination - users see the icon animated live, get the exact install command, and see usage examples. This is where the magic happens and users get what they came for!

# /components/icon-gallery/VariationCardWithButton.tsx
Shows both the icon AND the button example in the card. Users see real-world usage immediately on the variations list page.

# /components/icon-gallery/ButtonCodeDisplay.tsx
Client component that loads ANY button example dynamically and displays the actual code passed from server.

