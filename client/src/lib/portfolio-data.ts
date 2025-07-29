/**
 * Enhanced portfolio data with image-based technology icons
 *
 * This file contains the portfolio data structure with enhanced technology support:
 * - Image-based icons with fallback mechanisms
 * - Priority-based ordering for marquee display
 * - Utility functions for icon rendering and data manipulation
 *
 * Technology icons can be:
 * - String emojis (e.g., "⚛️")
 * - React components
 * - ImageIcon objects with src, alt, and fallback properties
 *
 * Available image files in public directory:
 * - /react.png
 * - /CSS-Logo-PNG-Symbol-for-Web-Development-Transparent.png
 * - /JavaScript-Logo-PNG-Symbol-for-Web-Development-Transparent.png
 * - /HTML5-Logo-PNG-Symbol-for-Web-Development-Transparent.png
 * - /Python-programming-code-coding-transparent-PNG-image.png
 * - /vite.svg
 * - /figma.png
 * - /photoshop.png
 */

import React from "react";
import { PortfolioData, ImageIcon, Technology } from "./types";

/**
 * Utility function to check if a technology icon is an image icon
 */
export const isImageIcon = (icon: Technology["icon"]): icon is ImageIcon => {
  return (
    typeof icon === "object" &&
    icon !== null &&
    "type" in icon &&
    icon.type === "image"
  );
};

/**
 * Utility function to get fallback icon for a technology
 */
export const getFallbackIcon = (technology: Technology): string => {
  if (isImageIcon(technology.icon) && technology.icon.fallback) {
    return technology.icon.fallback;
  }

  // Default fallback based on category
  const categoryFallbacks: Record<string, string> = {
    frontend: "🌐",
    backend: "⚙️",
    database: "🗄️",
    tools: "🔧",
    cloud: "☁️",
  };

  return categoryFallbacks[technology.category] || "💻";
};

/**
 * Utility function to get technologies sorted by priority
 */
export const getTechnologiesByPriority = (
  technologies: Technology[]
): Technology[] => {
  return [...technologies].sort(
    (a, b) => (a.priority || 999) - (b.priority || 999)
  );
};

/**
 * Utility function to render technology icon with fallback support
 * This function handles string icons, React components, and ImageIcon objects
 */
export const renderTechnologyIcon = (
  technology: Technology,
  onImageError?: (tech: Technology) => void
): React.ReactNode => {
  const { icon } = technology;

  // Handle string icons (emojis)
  if (typeof icon === "string") {
    return icon;
  }

  // Handle ImageIcon objects
  if (isImageIcon(icon)) {
    return React.createElement("img", {
      src: icon.src,
      alt: icon.alt,
      onError: () => onImageError?.(technology),
      style: { width: "24px", height: "24px", objectFit: "contain" },
    });
  }

  // Handle React components
  if (typeof icon === "function") {
    return React.createElement(icon);
  }

  // Fallback
  return getFallbackIcon(technology);
};

export const portfolioData: PortfolioData = {
  personal: {
    name: "Seann Tamondong",
    title: "Front-End Developer • UI/UX Design • Graphic Design",
    bio: "2nd year student at Gordon College with a passion for creating beautiful, user-centered digital experiences. I specialize in UI/UX design, front-end development, and graphic design, focusing on crafting intuitive interfaces that blend functionality with visual appeal. I love transforming creative ideas into engaging digital solutions.",
    avatar: "/2X2.jpg",
    resume: "/documents/alex-johnson-resume.pdf",
  },

  technologies: [
    // Column 1 - Frontend Technologies (5 icons)
    {
      name: "React",
      icon: {
        type: "image",
        src: "/react.png",
        alt: "React logo",
        fallback: "⚛️",
      } as ImageIcon,
      category: "frontend",
      priority: 1,
    },
    {
      name: "Vue.js",
      icon: {
        type: "image",
        src: "/vue.png",
        alt: "Vue.js logo",
        fallback: "💚",
      } as ImageIcon,
      category: "frontend",
      priority: 2,
    },
    {
      name: "JavaScript",
      icon: {
        type: "image",
        src: "/JAVASCRIPT.png",
        alt: "JavaScript logo",
        fallback: "💛",
      } as ImageIcon,
      category: "frontend",
      priority: 3,
    },
    {
      name: "TypeScript",
      icon: {
        type: "image",
        src: "/typescript.png",
        alt: "TypeScript logo",
        fallback: "📘",
      } as ImageIcon,
      category: "frontend",
      priority: 4,
    },
    {
      name: "HTML5",
      icon: {
        type: "image",
        src: "/HTML.png",
        alt: "HTML5 logo",
        fallback: "🌐",
      } as ImageIcon,
      category: "frontend",
      priority: 5,
    },

    // Column 2 - Styling & Design (5 icons)
    {
      name: "CSS3",
      icon: {
        type: "image",
        src: "/CSS.png",
        alt: "CSS3 logo",
        fallback: "🎨",
      } as ImageIcon,
      category: "frontend",
      priority: 6,
    },
    {
      name: "Figma",
      icon: {
        type: "image",
        src: "/figma.png",
        alt: "Figma logo",
        fallback: "🎯",
      } as ImageIcon,
      category: "tools",
      priority: 7,
    },
    {
      name: "Photoshop",
      icon: {
        type: "image",
        src: "/photoshop.png",
        alt: "Adobe Photoshop logo",
        fallback: "🖼️",
      } as ImageIcon,
      category: "tools",
      priority: 8,
    },
    {
      name: "DaVinci Resolve",
      icon: {
        type: "image",
        src: "/davinci.png",
        alt: "DaVinci Resolve logo",
        fallback: "🎬",
      } as ImageIcon,
      category: "tools",
      priority: 9,
    },
    {
      name: "VS Code",
      icon: {
        type: "image",
        src: "/VS CODE.png",
        alt: "Visual Studio Code logo",
        fallback: "💻",
      } as ImageIcon,
      category: "tools",
      priority: 10,
    },

    // Column 3 - Backend & Runtime (5 icons)
    {
      name: "Python",
      icon: {
        type: "image",
        src: "/PYTHON.png",
        alt: "Python logo",
        fallback: "🐍",
      } as ImageIcon,
      category: "backend",
      priority: 11,
    },
    {
      name: "Java",
      icon: {
        type: "image",
        src: "/java.png",
        alt: "Java logo",
        fallback: "☕",
      } as ImageIcon,
      category: "backend",
      priority: 12,
    },
    {
      name: "Bun",
      icon: {
        type: "image",
        src: "/Bun.png",
        alt: "Bun runtime logo",
        fallback: "🥟",
      } as ImageIcon,
      category: "backend",
      priority: 13,
    },
    {
      name: "Hono",
      icon: {
        type: "image",
        src: "/HONO.png",
        alt: "Hono framework logo",
        fallback: "🔥",
      } as ImageIcon,
      category: "backend",
      priority: 14,
    },
    {
      name: "Vite",
      icon: {
        type: "image",
        src: "/vite.svg",
        alt: "Vite logo",
        fallback: "⚡",
      } as ImageIcon,
      category: "tools",
      priority: 15,
    },
    {
      name: "GitHub",
      icon: {
        type: "image",
        src: "/github-sign.png",
        alt: "GitHub logo",
        fallback: "🐙",
      } as ImageIcon,
      category: "tools",
      priority: 16,
    },
  ],

  projects: [
    // Featured Projects - Development Work
    {
      id: "featured-project-1",
      title: "OCPL Attendance System",
      description:
        "A high-performance barcode-based attendance tracking system.",
      longDescription:
        "A comprehensive barcode-based attendance tracking system designed for efficient employee time management. Built as a desktop application using Electron for cross-platform compatibility, the system leverages JavaScript for seamless user interactions and Supabase for robust backend data management. The application provides real-time attendance tracking, automated report generation, and intuitive user interface for both administrators and employees. Features include barcode scanning integration, attendance analytics, employee management, and secure data synchronization across multiple devices.",
      technologies: [
        "Electron",
        "JavaScript",
        "Supabase",
      ],
      liveUrl: "#",
      githubUrl: "https://github.com/Swif7ify/OCPL-Barcode",
      images: [
        "/OCPL/Screenshot 2025-07-29 092854.png",
        "/OCPL/Screenshot 2025-07-29 092906.png",
        "/OCPL/Screenshot 2025-07-29 092917.png",
        "/OCPL/Screenshot 2025-07-29 092922.png",
        "/OCPL/Screenshot 2025-07-29 092927.png",
        "/OCPL/Screenshot 2025-07-29 092933.png",
        "/OCPL/Screenshot 2025-07-29 092952.png",
        "/OCPL/Screenshot 2025-07-29 093005.png"
      ],
      featured: true,
    },
    {
      id: "featured-project-2",
      title: "Flow",
      description:
        "A Web-Based Virtual Queue Management System",
      longDescription:
        "The Virtual Queue Management System is a digital platform designed to streamline queuing in government offices, clinics, restaurants, and other public spaces. Users can obtain virtual tickets, track their queue position in real-time, and schedule appointments. The system displays service availability at different branches and allows users to manage their profiles, storing personal information and appointment history. Reminders and notifications keep users informed about their queue status and upcoming appointments. An express lane booking feature is available for urgent cases. The system also provides crowd density indicators, a feedback and rating system, and supports multiple queues for different services, ensuring an organized and efficient queuing experience.",
      technologies: [
        "HTML5",
        "PHP",
        "SQL",
        "CSS3",
        "Vue.js",
      ],
      liveUrl: "https://flow-i3g6.vercel.app/landing#/landing",
      githubUrl: "https://github.com/seannywoot/flow-application-cc",
      images: [
        "/Flow/Screenshot 2025-07-29 091613.png",
        "/Flow/Screenshot 2025-07-29 091837.png",
        "/Flow/Screenshot 2025-07-29 092220.png"
      ],
      featured: true,
    },
    {
      id: "featured-project-3",
      title: "GC-MedMars",
      description:
        "A comprehensive web-based medical records management system designed for Gordon College.",
      longDescription:
        "GC-MedMaRS (Gordon College Medical Records System) is a PHP-based web application that allows healthcare administrators to manage student medical records, appointments, and departmental data efficiently. The system provides a centralized platform for tracking student health information across five college departments.",
      technologies: [
        "PHP",
        "JavaScript",
        "HTML5",
        "CSS3",
        "SQL",
      ],
      liveUrl: "#",
      githubUrl: "https://github.com/seannywoot/MedMars",
      images: [
        "/GC-Medmars/GC-Medmars.png"
      ],
      featured: true,
    },

    // Other Projects - Graphic Design & Creative Work
    {
      id: "design-project-1",
      title: "Brand Identity Design",
      description: "Modern brand identity and logo design for tech startup",
      longDescription:
        "Complete brand identity package including logo design, color palette, typography, and brand guidelines. Created a modern, minimalist identity that reflects the company's innovative approach to technology solutions.",
      technologies: [
        "Photoshop",
        "Figma",
      ],
      liveUrl: "https://example.com/brand-project",
      githubUrl: "#",
      images: ["/Graphics/1.jpg"],
      featured: false,
    },
    {
      id: "design-project-2",
      title: "Digital Art Collection",
      description: "Abstract digital artwork exploring color and form",
      longDescription:
        "A series of abstract digital artworks exploring the relationship between color, form, and emotion. Created using advanced digital painting techniques and experimental color grading approaches.",
      technologies: [
        "Photoshop",
        "DaVinci Resolve",
      ],
      liveUrl: "https://example.com/digital-art",
      githubUrl: "#",
      images: ["/Graphics/2.jpg"],
      featured: false,
    },
    {
      id: "design-project-3",
      title: "UI/UX Case Study",
      description: "Mobile app interface design with user experience focus",
      longDescription:
        "Comprehensive UI/UX design for a mobile productivity app. Includes user research, wireframing, prototyping, and final interface design with focus on accessibility and user experience.",
      technologies: [
        "Figma",
        "Photoshop",
      ],
      liveUrl: "https://example.com/ux-case-study",
      githubUrl: "#",
      images: ["/Graphics/3.jpg"],
      featured: false,
    },
    {
      id: "design-project-4",
      title: "Motion Graphics",
      description: "Animated graphics and video content creation",
      longDescription:
        "Dynamic motion graphics and animated content for social media and web platforms. Combines graphic design principles with animation techniques to create engaging visual content.",
      technologies: [
        "DaVinci Resolve",
        "Photoshop",
      ],
      liveUrl: "https://example.com/motion-graphics",
      githubUrl: "#",
      images: ["/Graphics/4.jpg"],
      featured: false,
    },
    {
      id: "design-project-5",
      title: "Print Design Portfolio",
      description: "Traditional print media design and layout work",
      longDescription:
        "Collection of print design work including posters, brochures, and marketing materials. Demonstrates understanding of typography, layout principles, and print production processes.",
      technologies: [
        "Photoshop",
        "Figma",
      ],
      liveUrl: "https://example.com/print-portfolio",
      githubUrl: "#",
      images: ["/Graphics/5.jpg"],
      featured: false,
    },
    {
      id: "design-project-6",
      title: "Web Design Concepts",
      description: "Modern web interface designs and prototypes",
      longDescription:
        "Innovative web design concepts focusing on modern aesthetics, user experience, and responsive design principles. Includes landing pages, dashboards, and e-commerce interfaces.",
      technologies: [
        "Figma",
        "Photoshop",
      ],
      liveUrl: "https://example.com/web-concepts",
      githubUrl: "#",
      images: ["/Graphics/6.jpg"],
      featured: false,
    },
    {
      id: "design-project-7",
      title: "Creative Photography",
      description: "Artistic photography and photo manipulation work",
      longDescription:
        "Creative photography projects showcasing composition, lighting, and post-processing skills. Includes portrait work, landscape photography, and experimental photo manipulation techniques.",
      technologies: [
        "Photoshop",
        "DaVinci Resolve",
      ],
      liveUrl: "https://example.com/photography",
      githubUrl: "#",
      images: ["/Graphics/7.jpg"],
      featured: false,
    },
    {
      id: "design-project-8",
      title: "Illustration Portfolio",
      description: "Digital illustrations and character design work",
      longDescription:
        "Collection of digital illustrations including character design, concept art, and editorial illustrations. Demonstrates proficiency in digital painting techniques and visual storytelling.",
      technologies: [
        "Photoshop",
        "Figma",
      ],
      liveUrl: "https://example.com/illustrations",
      githubUrl: "#",
      images: ["/Graphics/8.jpg"],
      featured: false,
    },
    {
      id: "design-project-9",
      title: "Social Media Graphics",
      description: "Engaging social media content and marketing materials",
      longDescription:
        "Dynamic social media graphics and marketing materials designed for various platforms. Focuses on brand consistency, engagement optimization, and visual impact across different social media formats.",
      technologies: [
        "Photoshop",
        "Figma",
      ],
      liveUrl: "https://example.com/social-media",
      githubUrl: "#",
      images: ["/Graphics/9.jpg"],
      featured: false,
    },
  ],

  skills: [
    {
      name: "Frontend Development",
      skills: [
        {
          name: "React",
          level: 4,
          icon: {
            type: "image",
            src: "/react.png",
            alt: "React logo",
            fallback: "⚛️",
          } as ImageIcon,
        },
        {
          name: "Vue.js",
          level: 3,
          icon: {
            type: "image",
            src: "/vue.png",
            alt: "Vue.js logo",
            fallback: "💚",
          } as ImageIcon,
        },
        {
          name: "JavaScript",
          level: 4,
          icon: {
            type: "image",
            src: "/JAVASCRIPT.png",
            alt: "JavaScript logo",
            fallback: "💛",
          } as ImageIcon,
        },
        {
          name: "TypeScript",
          level: 3,
          icon: {
            type: "image",
            src: "/typescript.png",
            alt: "TypeScript logo",
            fallback: "📘",
          } as ImageIcon,
        },
        {
          name: "HTML5",
          level: 5,
          icon: {
            type: "image",
            src: "/HTML.png",
            alt: "HTML5 logo",
            fallback: "🌐",
          } as ImageIcon,
        },
        {
          name: "CSS3",
          level: 4,
          icon: {
            type: "image",
            src: "/CSS.png",
            alt: "CSS3 logo",
            fallback: "🎨",
          } as ImageIcon,
        },
      ],
    },
    {
      name: "Design & Creative Tools",
      skills: [
        {
          name: "Figma",
          level: 4,
          icon: {
            type: "image",
            src: "/figma.png",
            alt: "Figma logo",
            fallback: "🎯",
          } as ImageIcon,
        },
        {
          name: "Photoshop",
          level: 4,
          icon: {
            type: "image",
            src: "/photoshop.png",
            alt: "Adobe Photoshop logo",
            fallback: "🖼️",
          } as ImageIcon,
        },
        {
          name: "DaVinci Resolve",
          level: 3,
          icon: {
            type: "image",
            src: "/davinci.png",
            alt: "DaVinci Resolve logo",
            fallback: "🎬",
          } as ImageIcon,
        },
      ],
    },
    {
      name: "Development Tools & Languages",
      skills: [
        {
          name: "VS Code",
          level: 5,
          icon: {
            type: "image",
            src: "/VS CODE.png",
            alt: "Visual Studio Code logo",
            fallback: "💻",
          } as ImageIcon,
        },
        {
          name: "Python",
          level: 3,
          icon: {
            type: "image",
            src: "/PYTHON.png",
            alt: "Python logo",
            fallback: "🐍",
          } as ImageIcon,
        },
        {
          name: "Java",
          level: 3,
          icon: {
            type: "image",
            src: "/java.png",
            alt: "Java logo",
            fallback: "☕",
          } as ImageIcon,
        },
        {
          name: "Vite",
          level: 3,
          icon: {
            type: "image",
            src: "/vite.svg",
            alt: "Vite logo",
            fallback: "⚡",
          } as ImageIcon,
        },
        {
          name: "Bun",
          level: 2,
          icon: {
            type: "image",
            src: "/Bun.png",
            alt: "Bun runtime logo",
            fallback: "🥟",
          } as ImageIcon,
        },
        {
          name: "Hono",
          level: 2,
          icon: {
            type: "image",
            src: "/HONO.png",
            alt: "Hono framework logo",
            fallback: "🔥",
          } as ImageIcon,
        },
        {
          name: "GitHub",
          level: 4,
          icon: {
            type: "image",
            src: "/github-sign.png",
            alt: "GitHub logo",
            fallback: "🐙",
          } as ImageIcon,
        },
      ],
    },
  ],

  workExperience: [
    {
      id: "work-1",
      company: "TechCorp Solutions",
      position: "Senior Full Stack Developer",
      duration: "2022 - Present",
      description:
        "Led development of enterprise-scale web applications serving 100K+ users. Architected microservices infrastructure and mentored junior developers.",
      technologies: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "AWS",
        "Docker",
      ],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      videoThumbnail: "/images/work-techcorp-thumb.jpg",
      achievements: [
        "Reduced application load time by 40% through performance optimization",
        "Led team of 5 developers on critical product launch",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
      ],
    },
    {
      id: "work-2",
      company: "StartupXYZ",
      position: "Frontend Developer",
      duration: "2020 - 2022",
      description:
        "Built responsive web applications from scratch using modern React ecosystem. Collaborated closely with design team to implement pixel-perfect UIs.",
      technologies: ["React", "JavaScript", "CSS", "Figma", "Git"],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      videoThumbnail: "/images/work-startup-thumb.jpg",
      achievements: [
        "Developed 3 major product features used by 10K+ users",
        "Improved mobile responsiveness across all platforms",
        "Mentored 2 junior developers",
      ],
    },
    {
      id: "work-3",
      company: "Digital Agency Pro",
      position: "Web Developer",
      duration: "2019 - 2020",
      description:
        "Created custom websites and web applications for various clients. Focused on performance, SEO optimization, and user experience.",
      technologies: ["HTML5", "CSS", "JavaScript", "WordPress", "PHP"],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      videoThumbnail: "/images/work-agency-thumb.jpg",
      achievements: [
        "Delivered 15+ client projects on time and within budget",
        "Achieved 95+ PageSpeed scores on all projects",
        "Increased client website traffic by average of 150%",
      ],
    },
  ],

  contact: {
    email: "seannpatrick25@gmail.com",
    phone: "0931 843 7976",
    location: "Olongapo City, Zambales",
    socialMedia: [
      {
        platform: "GitHub",
        url: "https://github.com/seannywoot",
        icon: {
          type: "image",
          src: "/github-sign.png",
          alt: "GitHub logo",
          fallback: "🐙",
        } as ImageIcon,
      },
      {
        platform: "Facebook",
        url: "https://www.facebook.com/seann.patrick.tamondong/",
        icon: {
          type: "image",
          src: "/facebook.png",
          alt: "Facebook logo",
          fallback: "💼",
        } as ImageIcon,
      },
      {
        platform: "Pinterest",
        url: "https://ph.pinterest.com/animedits_exe/",
        icon: {
          type: "image",
          src: "/pinterest.png",
          alt: "Pinterest logo",
          fallback: "🐦",
        } as ImageIcon,
      },
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/seann-patrick-tamondong-512562377/",
        icon: {
          type: "image",
          src: "/linkedin.png",
          alt: "LinkedIn logo",
          fallback: "🌐",
        } as ImageIcon,
      },
    ],
  },
};
