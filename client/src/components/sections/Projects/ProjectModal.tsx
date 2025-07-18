import React, { useEffect, useRef } from 'react';
import { Project } from '../../../lib/types';
import { X, ExternalLink, Github, Tag } from 'lucide-react';
import { focusManagement, keyboard } from '../../../lib/accessibility';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Enhanced accessibility and focus management
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Trap focus within modal
      const cleanup = modalRef.current ? focusManagement.trapFocus(modalRef.current) : undefined;
      
      // Handle escape key
      const escapeCleanup = keyboard.onEscape(onClose);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        cleanup?.();
        escapeCleanup();
        document.body.style.overflow = 'unset';
        
        // Restore focus to previously focused element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !project) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div 
        ref={modalRef}
        className={styles.modalContent} 
        role="dialog" 
        aria-labelledby="modal-title" 
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            {project.title}
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <div className={styles.imageGallery}>
              {project.images.map((image, index) => (
                <div key={index} className={styles.imageContainer}>
                  <img
                    src={image}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className={styles.projectImage}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Project Details */}
          <div className={styles.projectDetails}>
            <div className={styles.description}>
              <h3 className={styles.sectionTitle}>About This Project</h3>
              <p className={styles.shortDescription}>{project.description}</p>
              {project.longDescription && (
                <p className={styles.longDescription}>{project.longDescription}</p>
              )}
            </div>

            {/* Technologies Used */}
            <div className={styles.technologiesSection}>
              <h3 className={styles.sectionTitle}>
                <Tag size={18} />
                Technologies Used
              </h3>
              <div className={styles.techTags}>
                {project.technologies.map((tech) => (
                  <span key={tech} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Links */}
            <div className={styles.linksSection}>
              <h3 className={styles.sectionTitle}>Project Links</h3>
              <div className={styles.projectLinks}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.projectLink}
                  >
                    <ExternalLink size={18} />
                    <span>Live Demo</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.projectLink}
                  >
                    <Github size={18} />
                    <span>View Source</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;