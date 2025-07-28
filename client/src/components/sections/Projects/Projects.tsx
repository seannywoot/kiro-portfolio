import React, { useState } from 'react';
import { Project } from '../../../lib/types';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import Masonry from '../../ui/Masonry';
import styles from './Projects.module.css';

interface ProjectsProps {
  projects: Project[];
}

interface MasonryWithModalProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const MasonryWithModal: React.FC<MasonryWithModalProps> = ({ projects, onProjectClick }) => {
  const masonryItems = projects.map((project, index) => ({
    id: project.id,
    img: project.images[0] || "/images/placeholder-design.jpg",
    url: "#", // We'll handle clicks through the component
    height: 300 + (index % 4) * 150, // More varied heights for better masonry effect
  }));

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
        hoverScale={0.95}
        blurToFocus={true}
        colorShiftOnHover={false}
      />
    </div>
  );
};

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section className={styles.projectsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 id="projects-heading" className={styles.title}>Featured Projects</h2>
          <p className={styles.subtitle}>
            A showcase of my recent development work and creative solutions
          </p>
        </div>

        {/* Featured Projects Grid */}
        {featuredProjects.length > 0 && (
          <div className={styles.featuredGrid}>
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={true}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        )}

        {/* Other Projects Grid - Graphic Design & Creative Work */}
        {otherProjects.length > 0 && (
          <>
            <div className={styles.sectionDivider}>
              <h3 className={styles.sectionSubtitle}>Graphic Design & Creative Work</h3>
            </div>
            <div className={styles.masonryContainer}>
              <MasonryWithModal
                projects={otherProjects}
                onProjectClick={handleProjectClick}
              />
            </div>
          </>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Projects;