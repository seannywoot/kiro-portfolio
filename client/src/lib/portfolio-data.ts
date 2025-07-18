/**
 * Sample portfolio data demonstrating the TypeScript interfaces
 */

import { PortfolioData } from './types';

export const portfolioData: PortfolioData = {
  personal: {
    name: "Alex Johnson",
    title: "Senior Full Stack Developer",
    bio: "Passionate full-stack developer with 5+ years of experience creating modern, scalable web applications. I specialize in React, TypeScript, and Node.js, with a focus on performance optimization and user experience. I love turning complex problems into simple, beautiful solutions.",
    avatar: "/images/avatar.jpg",
    resume: "/documents/alex-johnson-resume.pdf"
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
      title: "ShopFlow - E-Commerce Platform",
      description: "Modern e-commerce solution with advanced analytics and real-time inventory management",
      longDescription: "A comprehensive full-stack e-commerce platform built for scalability and performance. Features include user authentication with JWT, advanced product filtering, real-time inventory tracking, integrated payment processing with Stripe, admin dashboard with analytics, and responsive design optimized for mobile commerce. The platform handles over 10,000 products and supports multiple payment methods.",
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Stripe", "Redis", "Docker"],
      liveUrl: "https://shopflow-demo.vercel.app",
      githubUrl: "https://github.com/alexjohnson/shopflow-platform",
      images: ["/images/shopflow-1.jpg", "/images/shopflow-2.jpg", "/images/shopflow-3.jpg"],
      featured: true
    },
    {
      id: "project-2",
      title: "TeamSync - Collaborative Workspace",
      description: "Real-time collaboration platform with advanced project management features",
      longDescription: "A sophisticated team collaboration platform that combines project management, real-time communication, and file sharing. Built with modern web technologies, it features drag-and-drop task management, real-time updates via WebSockets, video conferencing integration, advanced permission systems, and comprehensive reporting. Used by over 50 teams across various industries.",
      technologies: ["React", "TypeScript", "Socket.io", "MongoDB", "Express", "WebRTC", "AWS S3"],
      liveUrl: "https://teamsync-app.com",
      githubUrl: "https://github.com/alexjohnson/teamsync",
      images: ["/images/teamsync-1.jpg", "/images/teamsync-2.jpg"],
      featured: true
    },
    {
      id: "project-3",
      title: "WeatherWise - Smart Weather App",
      description: "AI-powered weather application with personalized recommendations",
      longDescription: "An intelligent weather application that provides hyper-local forecasts and personalized recommendations. Features include machine learning-based weather predictions, location-based alerts, activity suggestions based on weather conditions, beautiful data visualizations, and offline functionality. The app uses multiple weather APIs and custom algorithms to provide the most accurate forecasts.",
      technologies: ["React Native", "TypeScript", "Python", "FastAPI", "TensorFlow", "PostgreSQL"],
      liveUrl: "https://weatherwise-app.com",
      githubUrl: "https://github.com/alexjohnson/weatherwise",
      images: ["/images/weatherwise-1.jpg"],
      featured: false
    },
    {
      id: "project-4",
      title: "DevPortfolio - Portfolio Generator",
      description: "Automated portfolio generation tool for developers",
      longDescription: "A SaaS platform that automatically generates beautiful, responsive portfolios for developers by analyzing their GitHub repositories, contributions, and skills. Features include automated content generation, multiple customizable themes, SEO optimization, analytics dashboard, and integration with popular deployment platforms.",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "GitHub API", "Vercel"],
      liveUrl: "https://devportfolio.io",
      githubUrl: "https://github.com/alexjohnson/devportfolio",
      images: ["/images/devportfolio-1.jpg", "/images/devportfolio-2.jpg"],
      featured: false
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
    email: "alex.johnson.dev@gmail.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    socialMedia: [
      {
        platform: "GitHub",
        url: "https://github.com/alexjohnson-dev",
        icon: "🐙"
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/alexjohnson-fullstack",
        icon: "💼"
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/alexjohnson_dev",
        icon: "🐦"
      },
      {
        platform: "Portfolio",
        url: "https://alexjohnson.dev",
        icon: "🌐"
      }
    ]
  }
};