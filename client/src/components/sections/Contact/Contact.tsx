import React, { useState } from "react";
import { hc } from "hono/client";
import type { AppType } from "server";
import {
  ContactInfo,
  ContactFormData,
  FormValidationError,
} from "../../../lib/types";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import styles from "./Contact.module.css";

// Initialize Hono RPC client
const client = hc<AppType>("/");

interface ContactProps {
  contact: ContactInfo;
}

interface FormState extends ContactFormData {
  _gotcha?: string;
}

const Contact: React.FC<ContactProps> = ({ contact }) => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    _gotcha: "",
  });

  const [errors, setErrors] = useState<FormValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showMailtoFallback, setShowMailtoFallback] = useState(false);

  // Form validation with polite, human-readable visitor error messages
  const validateForm = (): FormValidationError[] => {
    const newErrors: FormValidationError[] = [];

    if (!formData.name.trim()) {
      newErrors.push({
        field: "name",
        message: "Please enter your name (at least 2 characters)",
      });
    } else if (formData.name.trim().length < 2) {
      newErrors.push({
        field: "name",
        message: "Please enter your name (at least 2 characters)",
      });
    }

    if (!formData.email.trim()) {
      newErrors.push({
        field: "email",
        message: "Please enter a valid email address so I can get back to you",
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push({
        field: "email",
        message: "Please enter a valid email address so I can get back to you",
      });
    }

    if (!formData.subject.trim()) {
      newErrors.push({
        field: "subject",
        message: "Please enter a subject (at least 5 characters)",
      });
    } else if (formData.subject.trim().length < 5) {
      newErrors.push({
        field: "subject",
        message: "Please enter a subject (at least 5 characters)",
      });
    }

    if (!formData.message.trim()) {
      newErrors.push({
        field: "message",
        message: "Please share a bit more detail (at least 10 characters)",
      });
    } else if (formData.message.trim().length < 10) {
      newErrors.push({
        field: "message",
        message: "Please share a bit more detail (at least 10 characters)",
      });
    }

    return newErrors;
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors.some((error) => error.field === name)) {
      setErrors((prev) => prev.filter((error) => error.field !== name));
    }
  };

  // Handle form submission via typed Hono RPC client
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    setSubmitStatus("idle");
    setShowMailtoFallback(false);

    try {
      const response = await client.api.contact.$post({
        json: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _gotcha: formData._gotcha,
        },
      });

      let result: any = null;
      try {
        result = await response.json();
      } catch (jsonErr) {
        console.warn("[Contact Form] Non-JSON response received:", response.status, jsonErr);
      }

      console.log("[Contact Form] Response received:", {
        status: response.status,
        ok: response.ok,
        result,
      });

      if (response.ok && result?.success) {
        setSubmitStatus("success");
        setFeedbackMessage(
          result.message || "Thank you! Your message has been sent successfully."
        );
        setShowMailtoFallback(false);
        setFormData({ name: "", email: "", subject: "", message: "", _gotcha: "" });
      } else {
        setSubmitStatus("error");
        setFeedbackMessage(
          result?.message ||
            "I'm having trouble receiving messages right now. Please feel free to email me directly!"
        );
        setShowMailtoFallback(true);

        if (
          result &&
          "showDirectEmailFallback" in result &&
          result.showDirectEmailFallback
        ) {
          setShowMailtoFallback(true);
        }

        if (result && "fieldErrors" in result && result.fieldErrors) {
          const serverErrors: FormValidationError[] = [];
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (Array.isArray(messages) && messages[0]) {
              serverErrors.push({ field, message: messages[0] });
            }
          }
          if (serverErrors.length > 0) {
            setErrors(serverErrors);
          }
        }
      }
    } catch (error) {
      console.error("Contact submission error:", error);
      setSubmitStatus("error");
      setFeedbackMessage(
        "I'm having trouble connecting to the service right now. Please feel free to email me directly!"
      );
      setShowMailtoFallback(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get error for specific field
  const getFieldError = (fieldName: string) => {
    return errors.find((error) => error.field === fieldName)?.message;
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
            {typeof social.icon === "string" 
              ? social.icon 
              : social.icon && typeof social.icon === "object" && "src" in social.icon
              ? <img 
                  src={social.icon.src} 
                  alt={social.icon.alt || social.platform}
                  style={{ width: "20px", height: "20px", objectFit: "contain" }}
                />
              : <social.icon />
            }
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
          <h2 id="contact-heading" className={styles.title}>
            Get In Touch
          </h2>
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
                  <a
                    href={`mailto:${contact.email}`}
                    className={styles.contactValue}
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              {contact.phone && (
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} size={20} />
                  <div className={styles.contactText}>
                    <span className={styles.contactLabel}>Phone</span>
                    <a
                      href={`tel:${contact.phone}`}
                      className={styles.contactValue}
                    >
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
                    <span className={styles.contactValue}>
                      {contact.location}
                    </span>
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

            {submitStatus === "success" && (
              <div
                className={styles.successMessage}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle size={20} />
                  <span>
                    {feedbackMessage ||
                      "Thank you! Your message has been sent successfully."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitStatus("idle");
                    setFeedbackMessage("");
                  }}
                  style={{
                    fontSize: "12px",
                    color: "#93c5fd",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Send another message
                </button>
              </div>
            )}

            {submitStatus === "error" && (
              <div
                className={styles.errorMessage}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertCircle size={20} />
                  <span>
                    {feedbackMessage ||
                      "Sorry, there was an error sending your message. Please try again."}
                  </span>
                </div>
                {showMailtoFallback && (
                  <a
                    href={`mailto:${contact.email || "seannpatrick25@gmail.com"}?subject=${encodeURIComponent(
                      formData.subject || "Portfolio Inquiry"
                    )}&body=${encodeURIComponent(formData.message || "")}`}
                    style={{
                      marginTop: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      color: "#93c5fd",
                      textDecoration: "underline",
                      fontWeight: 500,
                    }}
                  >
                    <Mail size={15} /> Click here to email me directly ({contact.email || "seannpatrick25@gmail.com"})
                  </a>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Honeypot field: invisible to real users, catches automated bots */}
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  opacity: 0,
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              >
                <label htmlFor="_gotcha">Do not fill this field</label>
                <input
                  type="text"
                  id="_gotcha"
                  name="_gotcha"
                  value={formData._gotcha || ""}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

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
                    className={`${styles.formInput} ${
                      getFieldError("name") ? styles.inputError : ""
                    }`}
                    placeholder="Your full name"
                  />
                  {getFieldError("name") && (
                    <span className={styles.fieldError}>
                      {getFieldError("name")}
                    </span>
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
                    className={`${styles.formInput} ${
                      getFieldError("email") ? styles.inputError : ""
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {getFieldError("email") && (
                    <span className={styles.fieldError}>
                      {getFieldError("email")}
                    </span>
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
                  className={`${styles.formInput} ${
                    getFieldError("subject") ? styles.inputError : ""
                  }`}
                  placeholder="What's this about?"
                />
                {getFieldError("subject") && (
                  <span className={styles.fieldError}>
                    {getFieldError("subject")}
                  </span>
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
                  className={`${styles.formTextarea} ${
                    getFieldError("message") ? styles.inputError : ""
                  }`}
                  placeholder="Tell me about your project or just say hello..."
                />
                {getFieldError("message") && (
                  <span className={styles.fieldError}>
                    {getFieldError("message")}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.submitButton} ${
                  isSubmitting ? styles.submitting : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.buttonSkeleton} />
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
