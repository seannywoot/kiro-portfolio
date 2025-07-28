import React, { useState, useEffect } from 'react';
import { Project } from '../../../lib/types';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import Masonry from '../../ui/Masonry';
import { preloadImagesWithDimensions, willImageBeCropped, ImageDimensions } from '../../../utils/imageUtils';
import styles from './Projects.module.css';

interface ProjectsProps {
  projects: Project[];
}

interface MasonryWithModalProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const MasonryWithModal: React.FC<MasonryWithModalProps> = ({ projects, onProjectClick }) => {
  const [imageDimensions, setImageDimensions] = useState<Map<string, ImageDimensions>>(new Map());
  const [itemsReady, setItemsReady] = useState(false);

  // Preload images and get their dimensions
  useEffect(() => {
    const imageUrls = projects.map(project => project.images[0] || "/images/placeholder-design.jpg");
    
    preloadImagesWithDimensions(imageUrls).then((dimensions) => {
      setImageDimensions(dimensions);
      setItemsReady(true);
    });
  }, [projects]);

  // Function to check if an image needs cropping indicator
  const checkImageCropping = (imageSrc: string, containerWidth: number, containerHeight: number): boolean => {
    const dimensions = imageDimensions.get(imageSrc);
    if (!dimensions) return true; // Default to showing indicator if we can't determine

    return willImageBeCropped(dimensions.aspectRatio, containerWidth, containerHeight, 0.15);
  };

  const masonryItems = projects.map((project, index) => {
    const assignedHeight = 300 + (index % 4) * 150;
    const imageSrc = project.images[0] || "/images/placeholder-design.jpg";
    
    // Estimate container width (this would be calculated by masonry)
    const estimatedWidth = 250; // Approximate column width
    
    return {
      id: project.id,
      img: imageSrc,
      url: "#", // We'll handle clicks through the component
      height: assignedHeight,
      title: project.title,
      showCropIndicator: itemsReady ? checkImageCropping(imageSrc, estimatedWidth, assignedHeight) : true,
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
        scaleOnHover={false}
        blurToFocus={true}
        colorShiftOnHover={false}
        enableExpansion={true}
        expansionScale={1.15}
        expansionDuration={0.4}
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