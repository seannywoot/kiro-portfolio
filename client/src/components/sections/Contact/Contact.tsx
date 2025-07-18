import React, { useState } from 'react';
import { ContactInfo, ContactFormData, FormValidationError } from '../../../lib/types';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './Contact.module.css';

interface ContactProps {
  contact: ContactInfo;
}

const Contact: React.FC<ContactProps> = ({ contact }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Form validation
  const validateForm = (): FormValidationError[] => {
    const newErrors: FormValidationError[] = [];

    if (!formData.name.trim()) {
      newErrors.push({ field: 'name', message: 'Name is required' });
    }

    if (!formData.email.trim()) {
      newErrors.push({ field: 'email', message: 'Email is required' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (!formData.subject.trim()) {
      newErrors.push({ field: 'subject', message: 'Subject is required' });
    }

    if (!formData.message.trim()) {
      newErrors.push({ field: 'message', message: 'Message is required' });
    } else if (formData.message.trim().length < 10) {
      newErrors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
    }

    return newErrors;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors.some(error => error.field === name)) {
      setErrors(prev => prev.filter(error => error.field !== name));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll just show success
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get error for specific field
  const getFieldError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  // Render social media links
  const renderSocialLinks = () => (
    <div className={styles.socialLinks}>
      {contact.socialMedia.map((social) => (
        <a
          key={social.platform}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label={`Visit my ${social.platform} profile`}
        >
          <span className={styles.socialIcon}>
            {typeof social.icon === 'string' ? social.icon : <social.icon />}
          </span>
          <span className={styles.socialPlatform}>{social.platform}</span>
        </a>
      ))}
    </div>
  );

  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 id="contact-heading" className={styles.title}>Get In Touch</h2>
          <p className={styles.subtitle}>
            Let's discuss your next project or just say hello
          </p>
        </div>

        <div className={styles.contactContent}>
          {/* Contact Information */}
          <div className={styles.contactInfo}>
            <h3 className={styles.infoTitle}>Contact Information</h3>
            
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <Mail className={styles.contactIcon} size={20} />
                <div className={styles.contactText}>
                  <span className={styles.contactLabel}>Email</span>
                  <a href={`mailto:${contact.email}`} className={styles.contactValue}>
                    {contact.email}
                  </a>
                </div>
              </div>

              {contact.phone && (
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} size={20} />
                  <div className={styles.contactText}>
                    <span className={styles.contactLabel}>Phone</span>
                    <a href={`tel:${contact.phone}`} className={styles.contactValue}>
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {contact.location && (
                <div className={styles.contactItem}>
                  <MapPin className={styles.contactIcon} size={20} />
                  <div className={styles.contactText}>
                    <span className={styles.contactLabel}>Location</span>
                    <span className={styles.contactValue}>{contact.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className={styles.socialSection}>
              <h4 className={styles.socialTitle}>Follow Me</h4>
              {renderSocialLinks()}
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.contactForm}>
            <h3 className={styles.formTitle}>Send a Message</h3>
            
            {submitStatus === 'success' && (
              <div className={styles.successMessage}>
                <CheckCircle size={20} />
                <span>Thank you! Your message has been sent successfully.</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className={styles.errorMessage}>
                <AlertCircle size={20} />
                <span>Sorry, there was an error sending your message. Please try again.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${getFieldError('name') ? styles.inputError : ''}`}
                    placeholder="Your full name"
                  />
                  {getFieldError('name') && (
                    <span className={styles.fieldError}>{getFieldError('name')}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${getFieldError('email') ? styles.inputError : ''}`}
                    placeholder="your.email@example.com"
                  />
                  {getFieldError('email') && (
                    <span className={styles.fieldError}>{getFieldError('email')}</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.formLabel}>
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`${styles.formInput} ${getFieldError('subject') ? styles.inputError : ''}`}
                  placeholder="What's this about?"
                />
                {getFieldError('subject') && (
                  <span className={styles.fieldError}>{getFieldError('subject')}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.formLabel}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`${styles.formTextarea} ${getFieldError('message') ? styles.inputError : ''}`}
                  placeholder="Tell me about your project or just say hello..."
                />
                {getFieldError('message') && (
                  <span className={styles.fieldError}>{getFieldError('message')}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;