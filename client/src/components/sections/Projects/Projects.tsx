import React, { useState, useMemo } from 'react';
import { Project } from '../../../lib/types';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import ScreenReaderOnly from '../../common/ScreenReaderOnly/ScreenReaderOnly';
import { Filter } from 'lucide-react';
import styles from './Projects.module.css';

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Get all unique technologies for filtering
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter projects based on selected technology
  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'all') {
      return projects;
    }
    return projects.filter(project => 
      project.technologies.includes(selectedFilter)
    );
  }, [projects, selectedFilter]);

  const featuredProjects = filteredProjects.filter(project => project.featured);
  const otherProjects = filteredProjects.filter(project => !project.featured);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleFilterChange = (technology: string) => {
    setSelectedFilter(technology);
  };

  return (
    <section className={styles.projectsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 id="projects-heading" className={styles.title}>Featured Projects</h2>
          <p className={styles.subtitle}>
            A showcase of my recent work and creative solutions
          </p>
        </div>

        {/* Technology Filter */}
        <div className={styles.filterSection} role="region" aria-labelledby="filter-heading">
          <div className={styles.filterHeader}>
            <Filter size={18} aria-hidden="true" />
            <span id="filter-heading">Filter by Technology</span>
          </div>
          <div 
            className={styles.filterTags}
            role="group"
            aria-labelledby="filter-heading"
            aria-describedby="filter-description"
          >
            <button
              className={`${styles.filterTag} ${selectedFilter === 'all' ? styles.activeFilter : ''}`}
              onClick={() => handleFilterChange('all')}
              aria-pressed={selectedFilter === 'all'}
              aria-describedby="filter-description"
            >
              All Projects
            </button>
            {allTechnologies.map((tech) => (
              <button
                key={tech}
                className={`${styles.filterTag} ${selectedFilter === tech ? styles.activeFilter : ''}`}
                onClick={() => handleFilterChange(tech)}
                aria-pressed={selectedFilter === tech}
                aria-describedby="filter-description"
              >
                {tech}
              </button>
            ))}
          </div>
          <ScreenReaderOnly id="filter-description">
            Use these buttons to filter projects by technology. Currently showing {filteredProjects.length} of {projects.length} projects.
          </ScreenReaderOnly>
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

        {/* Other Projects Grid */}
        {otherProjects.length > 0 && (
          <>
            <div className={styles.sectionDivider}>
              <h3 className={styles.sectionSubtitle}>Other Projects</h3>
            </div>
            <div className={styles.projectsGrid}>
              {otherProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  featured={false}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>
          </>
        )}

        {/* All Projects Grid (when no featured distinction) */}
        {featuredProjects.length === 0 && (
          <div className={styles.projectsGrid}>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={false}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        )}

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <div className={styles.noResults}>
            <p>No projects found using <strong>{selectedFilter}</strong></p>
            <button 
              className={styles.clearFilter}
              onClick={() => handleFilterChange('all')}
            >
              Show All Projects
            </button>
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
  );
};

export default Projects;