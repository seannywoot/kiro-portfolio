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
    title: "Senior Full Stack Developer",
    bio: "Passionate full-stack developer with 5+ years of experience creating modern, scalable web applications. I specialize in React, TypeScript, and Node.js, with a focus on performance optimization and user experience. I love turning complex problems into simple, beautiful solutions.",
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
        src: "/JavaScript-Logo-PNG-Symbol-for-Web-Development-Transparent.png",
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
        src: "/HTML5-Logo-PNG-Symbol-for-Web-Development-Transparent.png",
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
        src: "/CSS-Logo-PNG-Symbol-for-Web-Development-Transparent.png",
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
        src: "/vsc.png",
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
        src: "/Python-programming-code-coding-transparent-PNG-image.png",
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
        src: "/Hono Framework Icon.png",
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
  ],

  projects: [
    {
      id: "project-1",
      title: "ShopFlow - E-Commerce Platform",
      description:
        "Modern e-commerce solution with advanced analytics and real-time inventory management",
      longDescription:
        "A comprehensive full-stack e-commerce platform built for scalability and performance. Features include user authentication with JWT, advanced product filtering, real-time inventory tracking, integrated payment processing with Stripe, admin dashboard with analytics, and responsive design optimized for mobile commerce. The platform handles over 10,000 products and supports multiple payment methods.",
      technologies: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Stripe",
        "Redis",
        "Docker",
      ],
      liveUrl: "https://shopflow-demo.vercel.app",
      githubUrl: "https://github.com/alexjohnson/shopflow-platform",
      images: [
        "/images/shopflow-1.jpg",
        "/images/shopflow-2.jpg",
        "/images/shopflow-3.jpg",
      ],
      featured: true,
    },
    {
      id: "project-2",
      title: "TeamSync - Collaborative Workspace",
      description:
        "Real-time collaboration platform with advanced project management features",
      longDescription:
        "A sophisticated team collaboration platform that combines project management, real-time communication, and file sharing. Built with modern web technologies, it features drag-and-drop task management, real-time updates via WebSockets, video conferencing integration, advanced permission systems, and comprehensive reporting. Used by over 50 teams across various industries.",
      technologies: [
        "React",
        "TypeScript",
        "Socket.io",
        "MongoDB",
        "Express",
        "WebRTC",
        "AWS S3",
      ],
      liveUrl: "https://teamsync-app.com",
      githubUrl: "https://github.com/alexjohnson/teamsync",
      images: ["/images/teamsync-1.jpg", "/images/teamsync-2.jpg"],
      featured: true,
    },
    {
      id: "project-3",
      title: "WeatherWise - Smart Weather App",
      description:
        "AI-powered weather application with personalized recommendations",
      longDescription:
        "An intelligent weather application that provides hyper-local forecasts and personalized recommendations. Features include machine learning-based weather predictions, location-based alerts, activity suggestions based on weather conditions, beautiful data visualizations, and offline functionality. The app uses multiple weather APIs and custom algorithms to provide the most accurate forecasts.",
      technologies: [
        "React Native",
        "TypeScript",
        "Python",
        "FastAPI",
        "TensorFlow",
        "PostgreSQL",
      ],
      liveUrl: "https://weatherwise-app.com",
      githubUrl: "https://github.com/alexjohnson/weatherwise",
      images: ["/images/weatherwise-1.jpg"],
      featured: false,
    },
    {
      id: "project-4",
      title: "DevPortfolio - Portfolio Generator",
      description: "Automated portfolio generation tool for developers",
      longDescription:
        "A SaaS platform that automatically generates beautiful, responsive portfolios for developers by analyzing their GitHub repositories, contributions, and skills. Features include automated content generation, multiple customizable themes, SEO optimization, analytics dashboard, and integration with popular deployment platforms.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "PostgreSQL",
        "GitHub API",
        "Vercel",
      ],
      liveUrl: "https://devportfolio.io",
      githubUrl: "https://github.com/alexjohnson/devportfolio",
      images: ["/images/devportfolio-1.jpg", "/images/devportfolio-2.jpg"],
      featured: false,
    },
  ],

  skills: [
    {
      name: "Frontend Development",
      skills: [
        { name: "React", level: 5, icon: "⚛️" },
        { name: "TypeScript", level: 4, icon: "📘" },
        { name: "CSS/Tailwind", level: 5, icon: "🎨" },
        { name: "JavaScript", level: 5, icon: "💛" },
      ],
    },
    {
      name: "Backend Development",
      skills: [
        { name: "Node.js", level: 4, icon: "🟢" },
        { name: "Express", level: 4, icon: "🚀" },
        { name: "API Design", level: 4, icon: "🔗" },
        { name: "Database Design", level: 3, icon: "🗄️" },
      ],
    },
    {
      name: "Tools & DevOps",
      skills: [
        { name: "Git", level: 5, icon: "📝" },
        { name: "Docker", level: 3, icon: "🐳" },
        { name: "AWS", level: 3, icon: "☁️" },
        { name: "CI/CD", level: 3, icon: "🔄" },
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
    email: "alex.johnson.dev@gmail.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    socialMedia: [
      {
        platform: "GitHub",
        url: "https://github.com/alexjohnson-dev",
        icon: "🐙",
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/alexjohnson-fullstack",
        icon: "💼",
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/alexjohnson_dev",
        icon: "🐦",
      },
      {
        platform: "Portfolio",
        url: "https://alexjohnson.dev",
        icon: "🌐",
      },
    ],
  },
};
