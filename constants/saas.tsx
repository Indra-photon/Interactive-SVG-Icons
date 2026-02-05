// Following your existing constants pattern (products.tsx, timeline.tsx)
export const saasProduct = {
  id: "main-saas",
  name: "ToonyTalesWorld",
  emoji: "🚀", // Following your emoji pattern
  tagline: "Revolutionary platform that creates personalized animated story books for children using AI",
  description: "Detailed description of your SaaS product and its value proposition",
  
  // Key features with icons (using lucide-react like your homepage)
  features: [
    {
      icon: "Zap", // From lucide-react
      title: "Lightning Fast",
      description: "Optimized for speed and performance"
    },
    {
      icon: "Shield", 
      title: "Secure & Reliable",
      description: "Enterprise-grade security"
    },
    {
      icon: "Users",
      title: "Team Collaboration", 
      description: "Built for modern teams"
    }
  ],
  
  // Tech stack (similar to your TechStack component)
  techStack: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
  
  // Metrics for credibility
  metrics: {
    users: "50K+",
    revenue: "$100K ARR",
    uptime: "99.9%",
    rating: "4.9/5"
  },
  
  // URLs
  urls: {
    live: "https://www.toonytalesworld.com/",
    github: "https://peerlist.io/indranil/project/toonytalesworld",
    demo: "https://demo.yoursaas.com"
  },
  
  // Images
  images: {
    hero: "/images/saas-hero-l.svg",
    dashboard: "/images/saas-dashboard.png",
    features: "/images/saas-features.png"
  }
};