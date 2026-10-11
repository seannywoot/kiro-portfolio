import React from "react";
import { ArrowUpRight } from "lucide-react";
import { PersonalInfo, ContactInfo } from "../../../lib/types";
import ScreenReaderOnly from "../../common/ScreenReaderOnly/ScreenReaderOnly";
import styles from "./Footer.module.css";

export interface FooterProps {
  personal?: PersonalInfo;
  contact?: ContactInfo;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ personal, contact, className = "" }) => {
  const name = personal?.name || "Seann Tamondong";
  const role = "DESIGNER + FRONT-END DEVELOPER";
  const location = "OLONGAPO CITY, PH";
  const year = 2025;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartConversation = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      // Optionally focus the first input inside the contact form
      const nameInput = document.getElementById("name") as HTMLInputElement | null;
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 600);
      }
    } else if (contact?.email) {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <footer
      role="contentinfo"
      className={`${styles.footer} ${className}`.trim()}
    >
      <div className={styles.container}>
        {/* Top Callout Section */}
        <div className={styles.ctaSection}>
          <div className={styles.headlineCol}>
            <h2 className={styles.headline}>
              Have something<br />worth making<span className={styles.accentQuestion}>?</span>
            </h2>
          </div>

          <div className={styles.actionCol}>
            <p className={styles.actionDescription}>
              I&apos;m open to thoughtful collaborations, internships, and digital
              projects with a clear purpose.
            </p>
            <a
              href="#contact"
              onClick={handleStartConversation}
              className={styles.conversationLink}
              aria-label="Start a conversation"
            >
              <span>Start a conversation</span>
              <ArrowUpRight className={styles.arrowIcon} size={18} strokeWidth={2.4} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Hairline Divider */}
        <hr className={styles.divider} />

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomInner}>
            {/* Left Column - Name and Role */}
            <div className={styles.leftCol}>
              <span className={styles.name}>{name}</span>
              <span className={styles.role}>{role}</span>
            </div>

            {/* Center Column - Navigation Links */}
            <nav
              className={styles.centerCol}
              aria-label="Footer navigation"
            >
              <button
                type="button"
                onClick={() => scrollToSection("about")}
                className={styles.navLink}
                aria-label="Navigate to About section"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("projects")}
                className={styles.navLink}
                aria-label="Navigate to Projects section"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={scrollToTop}
                className={styles.navLink}
                aria-label="Scroll to top of page"
              >
                Back to top
              </button>
            </nav>

            {/* Right Column - Location and Copyright */}
            <div className={styles.rightCol}>
              <span className={styles.location}>{location}</span>
              <span className={styles.copyright}>
                © {year} {name}
              </span>
            </div>
          </div>
        </div>

        <ScreenReaderOnly>End of page content</ScreenReaderOnly>
      </div>
    </footer>
  );
};

export default Footer;
export { Footer };
