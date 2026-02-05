import {
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandYoutube,
  IconBookFilled,
  IconUser,
  IconBrandGithub
} from "@tabler/icons-react";

export const socials = [
  { 
     name: 'Github', 
     icon: IconBrandGithub, 
     url: 'https://github.com/Indra-photon',
     color: 'text-white-600 hover:text-white-700',
     bgColor: 'hover:bg-white-50',
     label: 'GitHub'
   },
   { 
     name: 'LinkedIn', 
     icon: IconBrandLinkedin, 
     url: 'https://www.linkedin.com/in/indranil-maiti-7542941b7/',
     color: 'text-blue-600 hover:text-blue-700',
     bgColor: 'hover:bg-blue-50',
      label: 'LinkedIn'
   },
   { 
     name: 'Twitter', 
     icon: IconBrandTwitter, 
     url: 'https://x.com/Nil_phy_dreamer',
     color: 'text-sky-500 hover:text-sky-600',
     bgColor: 'hover:bg-sky-50',
      label: 'X (Twitter)'
   },
  //  { 
  //    name: 'Peerlist', 
  //    icon: IconUser, 
  //    url: 'https://peerlist.io/indranil/resume',
  //    color: 'text-green-600 hover:text-green-700',
  //    bgColor: 'hover:bg-green-50',
  //     label: 'Peerlist'
  //  },
   { 
     name: 'Blog', 
     icon: IconBookFilled, 
     url: '/blog',
     color: 'text-sky-600 hover:text-sky-700',
     bgColor: 'hover:bg-sky-50',
     label: 'Blog'
   },
   { 
     name: 'YouTube', 
     icon: IconBrandYoutube, 
     url: 'https://www.youtube.com/@indranilmaiti842',
     color: 'text-red-600 hover:text-red-700',
     bgColor: 'hover:bg-red-50',
     label: 'YouTube'
   },
]
