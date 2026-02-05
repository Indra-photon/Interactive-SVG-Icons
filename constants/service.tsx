


interface Service {
  id: number;
  title: string;
  description: string | React.ReactNode;
  imgSrc: string;
  svg: React.ReactNode;
}


export const servicesData: Service[] = [
  // {
  //   id: 1,
  //   title: "UX/UI Design",
  //   description: <>Creating visually stunning and user-friendly website designs using <span className="text-neutral-300 text-md sm:text-md md:text-xl">Figma</span> that captivate your audience and drive engagement.</>,
  //   imgSrc: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
  //   svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-figma"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6 3m0 3a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v0a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3z" /><path d="M9 9a3 3 0 0 0 0 6h3m-3 0a3 3 0 1 0 3 3v-15" /></svg>
  // },
  {
    id: 2,
    title: "Web Development",
    description: "Building responsive and high-performance scalable websites using the latest technologies and best practices for optimal user experience.",
    imgSrc: 'https://images.pexels.com/photos/3888151/pexels-photo-3888151.jpeg',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-device-desktop-code"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12.5 16h-8.5a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v8" /><path d="M7 20h4" /><path d="M9 16v4" /><path d="M20 21l2 -2l-2 -2" /><path d="M17 17l-2 2l2 2" /></svg>
  },
  {
    id: 3,
    title: "SEO Optimization and Analytics",
    description: <>Fully set up SEO operations and data-driven insights using <span className="text-neutral-100 text-md sm:text-md md:text-xl">Google Analytics</span>, <span className="text-neutral-100 text-md sm:text-md md:text-xl">Google Search Console</span>, and <span className="text-neutral-100 text-md sm:text-md md:text-xl">Google Tag Manager</span>.</>,
    imgSrc: 'https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
  },
  {
    id: 4,
    title: "AI Integration",
    description: <>Integrating AI technologies using <span className="text-neutral-300 text-md sm:text-md md:text-xl">ChatGPT, Gemini, Claude</span> etc. to enhance user experiences and streamline business processes.</>,
    imgSrc: 'https://images.pexels.com/photos/7661185/pexels-photo-7661185.jpeg',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-figma"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6 3m0 3a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v0a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3z" /><path d="M9 9a3 3 0 0 0 0 6h3m-3 0a3 3 0 1 0 3 3v-15" /></svg>
  },
  {
    id: 5,
    title: "Custom Solutions",
    description: "Developing robust custom web applications tailored to your business needs and user requirements.",
    imgSrc: 'https://images.pexels.com/photos/9822732/pexels-photo-9822732.jpeg',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-figma"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6 3m0 3a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v0a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3z" /><path d="M9 9a3 3 0 0 0 0 6h3m-3 0a3 3 0 1 0 3 3v-15" /></svg>
  },
  {
    id: 6,
    title: "Custom Solutions",
    description: "Developing robust custom web applications tailored to your business needs and user requirements.",
    imgSrc: 'https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-figma"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6 3m0 3a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v0a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3z" /><path d="M9 9a3 3 0 0 0 0 6h3m-3 0a3 3 0 1 0 3 3v-15" /></svg>
  }
]