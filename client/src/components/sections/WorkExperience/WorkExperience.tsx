import React from 'react';
import { WorkExperience as WorkExperienceType } from '../../../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { AspectRatio } from '../../ui/aspect-ratio';
import { PlayIcon, BriefcaseIcon, CalendarIcon, CheckIcon } from 'lucide-react';

interface WorkExperienceProps {
  workExperience: WorkExperienceType[];
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ workExperience }) => {
  const handleVideoPlay = (videoUrl: string) => {
    // Video play logic can be implemented here if needed
    console.log('Playing video:', videoUrl);
  };

  return (
    <section className="py-20 px-4 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium mb-4">
            <BriefcaseIcon className="w-4 h-4" />
            Recent Work Experience
          </div>
          <h2 
            id="work-experience-heading"
            className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6"
          >
            My Professional Journey
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Explore my career progression through interactive video showcases and detailed project highlights.
          </p>
        </div>

        {/* Work Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workExperience.map((experience, index) => (
            <Card 
              key={experience.id} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-[var(--card)] border-[var(--border)]"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-[var(--primary)] text-sm font-medium">
                    <CalendarIcon className="w-4 h-4" />
                    {experience.duration}
                  </div>
                  <div className="text-2xl font-bold text-[var(--muted-foreground)]/30">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-[var(--card-foreground)] mb-1">
                  {experience.position}
                </CardTitle>
                <CardDescription className="text-[var(--primary)] font-semibold">
                  {experience.company}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Video Thumbnail */}
                {experience.videoUrl && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div 
                        className="relative cursor-pointer group/video rounded-lg overflow-hidden"
                        onClick={() => handleVideoPlay(experience.videoUrl!)}
                      >
                        <AspectRatio ratio={16 / 9}>
                          <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 flex items-center justify-center relative">
                            {experience.videoThumbnail ? (
                              <img 
                                src={experience.videoThumbnail} 
                                alt={`${experience.company} work showcase`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-6xl opacity-20">🎥</div>
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover/video:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover/video:scale-110 transition-transform duration-300">
                                <PlayIcon className="w-8 h-8 text-[var(--primary)] ml-1" />
                              </div>
                            </div>
                          </div>
                        </AspectRatio>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-[90vw] p-0">
                      <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-xl font-bold">
                          {experience.position} at {experience.company}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="p-6 pt-4">
                        <AspectRatio ratio={16 / 9}>
                          <iframe
                            src={experience.videoUrl}
                            title={`${experience.company} work experience video`}
                            className="w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </AspectRatio>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {/* Description */}
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                  {experience.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-md font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {experience.technologies.length > 4 && (
                    <span className="px-2 py-1 bg-[var(--muted)] text-[var(--muted-foreground)] text-xs rounded-md font-medium">
                      +{experience.technologies.length - 4} more
                    </span>
                  )}
                </div>

                {/* Key Achievements */}
                {experience.achievements && experience.achievements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-[var(--card-foreground)]">
                      Key Achievements:
                    </h4>
                    <ul className="space-y-1">
                      {experience.achievements.slice(0, 2).map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]">
                          <CheckIcon className="w-3 h-3 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-[var(--muted-foreground)] mb-6">
            Want to learn more about my professional experience?
          </p>
          <a 
            href="/Tamondong_Resume.pdf" 
            download="Tamondong_Resume.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:bg-[var(--primary)]/90 transition-colors duration-200"
          >
            <span>Download Resume</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;