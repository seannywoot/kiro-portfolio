/**
 * Sample portfolio data demonstrating the TypeScript interfaces
 */

import { PortfolioData } from './types';

export const portfolioData: PortfolioData = {
  personal: {
    name: "Your Name",
    title: "Full Stack Developer",
    bio: "Passionate developer creating modern web experiences with cutting-edge technologies.",
    avatar: "/images/avatar.jpg",
    resume: "/documents/resume.pdf"
  },
  
  technologies: [
    { name: "React", icon: "⚛️", category: "frontend" },
    { name: "TypeScript", icon: "📘", category: "frontend" },
    { name: "Tailwind CSS", icon: "🎨", category: "frontend" },
    { name: "Next.js", icon: "▲", category: "frontend" },
    { name: "Vue.js", icon: "💚", category: "frontend" },
    { name: "Vite", icon: "⚡", category: "tools" },
    { name: "Node.js", icon: "🟢", category: "backend" },
    { name: "Express", icon: "🚀", category: "backend" },
    { name: "FastAPI", icon: "🔥", category: "backend" },
    { name: "Python", icon: "🐍", category: "backend" },
    { name: "PostgreSQL", icon: "🐘", category: "database" },
    { name: "MongoDB", icon: "🍃", category: "database" },
    { name: "Redis", icon: "🔴", category: "database" },
    { name: "Docker", icon: "🐳", category: "tools" },
    { name: "Kubernetes", icon: "☸️", category: "tools" },
    { name: "AWS", icon: "☁️", category: "cloud" },
    { name: "Vercel", icon: "🔺", category: "cloud" },
    { name: "Git", icon: "📝", category: "tools" },
    { name: "Figma", icon: "🎯", category: "tools" },
    { name: "Jest", icon: "🃏", category: "tools" },
    { name: "Cypress", icon: "🌲", category: "tools" },
    { name: "GraphQL", icon: "💜", category: "backend" },
    { name: "Prisma", icon: "🔷", category: "database" },
    { name: "Supabase", icon: "🟢", category: "database" }
  ],
  
  projects: [
    {
      id: "project-1",
      title: "E-Commerce Platform",
      description: "Modern e-commerce solution with React and Node.js",
      longDescription: "A full-stack e-commerce platform featuring user authentication, product management, shopping cart functionality, and payment integration.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/username/project",
      images: ["/images/project1-1.jpg", "/images/project1-2.jpg"],
      featured: true
    },
    {
      id: "project-2",
      title: "Task Management App",
      description: "Collaborative task management with real-time updates",
      longDescription: "A collaborative task management application with real-time synchronization, team collaboration features, and intuitive drag-and-drop interface.",
      technologies: ["React", "Socket.io", "MongoDB", "Express"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/username/project",
      images: ["/images/project2-1.jpg"],
      featured: true
    }
  ],
  
  skills: [
    {
      name: "Frontend Development",
      skills: [
        { name: "React", level: 5, icon: "⚛️" },
        { name: "TypeScript", level: 4, icon: "📘" },
        { name: "CSS/Tailwind", level: 5, icon: "🎨" },
        { name: "JavaScript", level: 5, icon: "💛" }
      ]
    },
    {
      name: "Backend Development",
      skills: [
        { name: "Node.js", level: 4, icon: "🟢" },
        { name: "Express", level: 4, icon: "🚀" },
        { name: "API Design", level: 4, icon: "🔗" },
        { name: "Database Design", level: 3, icon: "🗄️" }
      ]
    },
    {
      name: "Tools & DevOps",
      skills: [
        { name: "Git", level: 5, icon: "📝" },
        { name: "Docker", level: 3, icon: "🐳" },
        { name: "AWS", level: 3, icon: "☁️" },
        { name: "CI/CD", level: 3, icon: "🔄" }
      ]
    }
  ],
  
  contact: {
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567",
    location: "Your City, Country",
    socialMedia: [
      {
        platform: "GitHub",
        url: "https://github.com/username",
        icon: "🐙"
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/username",
        icon: "💼"
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/username",
        icon: "🐦"
      }
    ]
  }
};