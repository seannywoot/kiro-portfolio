import React, { useState } from 'react';
import { Project } from '../../../lib/types';
import ProjectModal from './ProjectModal';
import Masonry from '../../ui/Masonry';
import { TooltipProvider } from '../../ui/tooltip';

interface ProjectsProps {
  projects: Project[];
}

interface MasonryWithModalProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const MasonryWithModal: React.FC<MasonryWithModalProps> = ({ projects, onProjectClick }) => {
  const masonryItems = projects.map((project, index) => {
    const baseHeight = 300;
    const variation = (index % 4) * 120;
    const mobileBaseHeight = 280;
    const mobileVariation = (index % 3) * 100;
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
    
    return {
      id: project.id,
      img: project.images[0] || "/images/placeholder-design.jpg",
      url: "#",
      height: isMobile ? mobileBaseHeight + mobileVariation : baseHeight + variation,
      title: project.title,
    };
  });

  const handleItemClick = (itemId: string) => {
    const project = projects.find(p => p.id === itemId);
    if (project) {
      onProjectClick(project);
    }
  };

  return (
    <div onClick={(e) => {
      const target = e.target as HTMLElement;
      const masonryItem = target.closest('[data-key]');
      if (masonryItem) {
        e.preventDefault();
        const itemId = masonryItem.getAttribute('data-key');
        if (itemId) {
          handleItemClick(itemId);
        }
      }
    }}>
      <Masonry
        items={masonryItems}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover={true}
        hoverScale={1.05}
        blurToFocus={true}
        colorShiftOnHover={false}
      />
    </div>
  );
};

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  const activeProject = featuredProjects[activeIndex] || featuredProjects[0];

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <TooltipProvider>
      <section className="w-full bg-[#0C0D0F] text-white py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-12 lg:px-16 transition-colors duration-500">
        <div className="max-w-[1360px] mx-auto">
          {/* Top Header Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pb-10 sm:pb-12 lg:pb-14 items-end">
            {/* Section Marker */}
            <div className="lg:col-span-3 pb-1 sm:pb-2 lg:pb-3">
              <div className="inline-flex items-center gap-3 text-xs sm:text-[13px] font-mono tracking-[0.22em] text-[#8E95A2] uppercase font-semibold">
                <span>03</span>
                <span className="w-8 sm:w-10 h-[1.5px] bg-[#D45B34]" aria-hidden="true" />
                <span>SELECTED PROJECTS</span>
              </div>
            </div>

            {/* Display Headline */}
            <div className="lg:col-span-9">
              <h2
                id="projects-heading"
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-white tracking-[-0.04em] leading-[0.96] select-none"
              >
                Work, selected.
              </h2>
            </div>
          </div>

          {/* Full-width Divider Line */}
          <div className="w-full border-t border-[#23262E]" aria-hidden="true" />

          {/* Main 2-Column Grid */}
          {featuredProjects.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Column: Project Selector Rows */}
              <div className="lg:col-span-7 flex flex-col justify-start lg:border-r border-[#23262E]">
                {featuredProjects.map((project, index) => {
                  const isActive = activeIndex === index;
                  const projectNumber = String(index + 1).padStart(2, '0');
                  const categoryYear = `${project.category || 'PROJECT'} / ${project.year || '2025'}`;

                  return (
                    <div
                      key={project.id}
                      onClick={() => setActiveIndex(index)}
                      onMouseEnter={() => setActiveIndex(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveIndex(index);
                        }
                      }}
                      className={`w-full py-7 sm:py-8 lg:py-9 px-6 sm:px-8 border-b border-[#23262E] transition-all duration-300 cursor-pointer flex items-center justify-between group select-none text-left ${
                        isActive
                          ? 'bg-[#F4F1EA] text-[#0D0E11]'
                          : 'bg-transparent text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-6 sm:gap-8">
                        {/* Index Number */}
                        <span
                          className={`font-mono text-xs sm:text-sm font-semibold transition-colors ${
                            isActive ? 'text-[#D45B34]' : 'text-white/60 group-hover:text-white'
                          }`}
                        >
                          {projectNumber}
                        </span>

                        {/* Title & Category/Year */}
                        <div>
                          <h3
                            className={`text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight transition-colors ${
                              isActive ? 'text-[#0D0E11]' : 'text-white'
                            }`}
                          >
                            {project.title}
                          </h3>
                          <p
                            className={`text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] mt-1.5 transition-colors ${
                              isActive ? 'text-[#6B7280]' : 'text-[#8E95A2]'
                            }`}
                          >
                            {categoryYear}
                          </p>
                        </div>
                      </div>

                      {/* Right Arrow */}
                      <div
                        className={`transition-all duration-200 ${
                          isActive
                            ? 'text-[#D45B34] translate-x-1'
                            : 'text-[#4B5563] group-hover:text-white group-hover:translate-x-1'
                        }`}
                      >
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Project Showcase Details & Preview */}
              {activeProject && (
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    {/* Top Preview Card */}
                    <div className="w-full">
                      {/* Featured Tag Badge */}
                      <span className="text-xs font-mono font-semibold text-[#D45B34] uppercase tracking-[0.22em] block mb-3">
                        FEATURED / {String(activeIndex + 1).padStart(2, '0')}
                      </span>

                      {/* Project Screenshot */}
                      <div
                        onClick={() => handleProjectClick(activeProject)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Open details for ${activeProject.title}`}
                        className="relative w-full aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group bg-[#16181D] border border-white/10 shadow-lg"
                      >
                        <img
                          src={activeProject.images[0]}
                          alt={activeProject.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3.5 py-1.5 rounded-full bg-black/80 text-white text-xs font-mono tracking-wider backdrop-blur-sm border border-white/10">
                            VIEW DETAILS
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category Eyebrow & External Link */}
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D45B34] font-semibold">
                        {activeProject.category || 'PROJECT'}
                      </span>
                      {(activeProject.githubUrl || activeProject.liveUrl) && (
                        <a
                          href={activeProject.liveUrl && activeProject.liveUrl !== '#' ? activeProject.liveUrl : activeProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open external link for ${activeProject.title}`}
                          className="text-[#8E95A2] hover:text-[#D45B34] transition-colors p-1"
                        >
                          <svg
                            className="w-4 h-4 transition-transform duration-200 hover:translate-x-0.5 hover:-translate-y-0.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1.5 mb-3 leading-tight">
                      {activeProject.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-[15px] text-[#9CA3AF] leading-relaxed mb-6 font-normal">
                      {activeProject.description}
                    </p>
                  </div>

                  {/* Bottom Divider & Tech Stack */}
                  <div className="border-t border-[#23262E] pt-5">
                    <div className="flex flex-wrap items-center gap-6">
                      {activeProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#D1D5DB]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full-width Divider Line */}
          <div className="w-full border-t border-[#23262E]" aria-hidden="true" />

          {/* Bottom Statement & CTA Row */}
          <div className="py-10 sm:py-12 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-white max-w-xl tracking-tight leading-snug">
              Digital products shaped around clarity, utility, and a strong visual point of view.
            </p>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-mono uppercase tracking-[0.22em] text-white hover:text-[#D45B34] font-semibold border-b-2 border-[#D45B34] pb-1 transition-all group shrink-0"
            >
              <span>START A CONVERSATION</span>
              <svg
                className="w-4 h-4 text-[#D45B34] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>

          {/* Graphic Design & Creative Work Archive */}
          {otherProjects.length > 0 && (
            <div className="mt-16 sm:mt-20 pt-14 sm:pt-16 border-t border-[#23262E]">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10 gap-3">
                <div>
                  <div className="inline-flex items-center gap-3 text-xs sm:text-[13px] font-mono tracking-[0.22em] text-[#8E95A2] uppercase font-semibold mb-2">
                    <span>03.1</span>
                    <span className="w-8 h-[1.5px] bg-[#D45B34]" aria-hidden="true" />
                    <span>CREATIVE ARCHIVE</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Graphic Design & Creative Work
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#8E95A2] uppercase tracking-[0.2em]">
                  {otherProjects.length} Pieces
                </span>
              </div>

              <div className="w-full">
                <MasonryWithModal
                  projects={otherProjects}
                  onProjectClick={handleProjectClick}
                />
              </div>
            </div>
          )}
        </div>

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </section>
    </TooltipProvider>
  );
};

export default Projects;