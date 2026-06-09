import { TourismHero01 } from "../default";

export default function TourismHero01Preview() {
  return (
    <TourismHero01
      imageSrc="/blocks/TourismHero01.png"
      heading={"Where the Path\nLeads Up"}
      subheading="Discover alpine trails, mountain refuges, and guided expeditions across the Dolomites."
      primaryCtaLabel="Plan Your Trek"
      secondaryCtaLabel="Book Now"
      stats={[
        { value: "240+", label: "Trails Mapped" },
        { value: "48", label: "Mountain Huts" },
        { value: "12K+", label: "Trekkers Joined Us" },
      ]}
      navbarProps={{
        logoText: "Summit",
        navLinks: ["Explore", "Trails", "Guides", "About"],
        ctaLabel: "Book Now",
      }}
    />
  );
}
