interface worklist {
  title: string;
  content: {text: string; highlight: boolean};  
  description: string;
  tags: string[];
  link?: string;
}


export const worklists: worklist[] = [
  {
    title: 'Built Toonytalesworld',
    content: {text: "Built Toonytalesworld", highlight: false},
    description:
      'Building responsive and dynamic web applications using modern technologies like React, Node.js, and MongoDB.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript'],
    link: 'https://toonytalesworld.com',
  },
  {
    title: 'Working on Quest',
    content: {text: 'Working on Quest', highlight: false},
    description:
      'Creating user-friendly interfaces and engaging user experiences with a focus on usability and aesthetics.',
    tags: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'Wireframing'],
    link: 'https://www.fraterny.com/quest/quest-mode',
  },
  {
    title: 'Working on Frat',
    content: {text: 'Working on Frat', highlight: false},
    description:
      'Integrating AI technologies into web applications to enhance functionality and user experience.',
    tags: ['Python', 'TensorFlow', 'PyTorch', 'Natural Language Processing', 'Computer Vision'],
    link: 'https://www.fraterny.com/',
  }
];
