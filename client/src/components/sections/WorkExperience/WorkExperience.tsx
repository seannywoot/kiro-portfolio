import React from 'react';
import { WorkExperience as WorkExperienceType } from '../../../lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { AspectRatio } from '../../ui/aspect-ratio';

interface WorkExperienceProps {
  workExperience: WorkExperienceType[];
}

const defaultDeliverables = [
  { label: 'Interface design', number: '01' },
  { label: 'Front-end development', number: '02' },
  { label: 'Data integration', number: '03' },
];

export const WorkExperience: React.FC<WorkExperienceProps> = ({ workExperience }) => {
  return (
    <section className="w-full bg-[#F3EFEA] text-[#111215] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-12 lg:px-16 transition-colors duration-500">
      <div className="max-w-[1360px] mx-auto">
        {/* Top Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pb-10 sm:pb-12 lg:pb-14 items-end">
          {/* Section Marker */}
          <div className="lg:col-span-3 pb-1 sm:pb-2 lg:pb-3">
            <div className="inline-flex items-center gap-3 text-xs sm:text-[13px] font-mono tracking-[0.22em] text-[#222429] uppercase font-semibold">
              <span>02</span>
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#D45B34]" aria-hidden="true" />
              <span>EXPERIENCE</span>
            </div>
          </div>

          {/* Editorial Headline */}
          <div className="lg:col-span-9">
            <h2
              id="work-experience-heading"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem] font-extrabold text-[#0D0E11] tracking-[-0.035em] leading-[1.02] select-none"
            >
              <span className="block">Learning in public.</span>
              <span className="block mt-1 sm:mt-1.5">Building for people.</span>
            </h2>
          </div>
        </div>

        {/* Full-width Divider Line */}
        <div className="w-full border-t border-[#D5D0C6]" aria-hidden="true" />

        {/* Work Experience Entries */}
        {workExperience.map((experience) => {
          const deliverables = experience.deliverables || defaultDeliverables;
          const location = experience.location || 'Olongapo City, PH';
          const duration = experience.duration || '2025 — Present';
          const tag = experience.tag || 'SELECTED WORK / OCPL';
          const projectUrl = experience.projectUrl || 'https://github.com/Swif7ify/OCPL-Barcode';
          const thumbnail = experience.videoThumbnail || '/OCPL/Screenshot 2025-07-29 092854.png';

          return (
            <div
              key={experience.id}
              className="grid grid-cols-1 md:grid-cols-12 items-stretch"
            >
              {/* Column 1: Dates & Location */}
              <div className="md:col-span-3 py-8 sm:py-10 lg:py-12 md:pr-8 md:border-r border-[#D5D0C6] flex flex-col justify-start">
                <p className="text-sm sm:text-base font-semibold text-[#D45B34] tracking-tight">
                  {duration}
                </p>
                <p className="text-xs sm:text-sm text-[#6F737C] font-medium mt-1">
                  {location}
                </p>
              </div>

              {/* Column 2: Title, Description, Deliverables (with Divider Line on Right) */}
              <div className="md:col-span-5 py-8 sm:py-10 lg:py-12 px-0 md:px-8 lg:px-10 md:border-r border-[#D5D0C6] flex flex-col justify-between">
                <div>
                  {/* Eyebrow / Company */}
                  <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#71757E] font-medium">
                    {experience.company}
                  </p>

                  {/* Role Title */}
                  <h3 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-[#0D0E11] tracking-tight mt-2.5 mb-4 leading-tight">
                    {experience.position}
                  </h3>

                  {/* Role Description */}
                  <p className="text-sm sm:text-[15px] text-[#3A3D44] leading-relaxed mb-8 font-normal">
                    {experience.description}
                  </p>
                </div>

                {/* Deliverables / Scope Breakdown */}
                <div className="w-full">
                  {deliverables.map((item, index) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between py-3.5 sm:py-4 border-t border-[#D5D0C6] text-xs sm:text-sm transition-colors duration-200 hover:text-[#D45B34] ${
                        index === deliverables.length - 1 ? 'border-b border-[#D5D0C6]' : ''
                      }`}
                    >
                      <span className="font-medium text-[#1A1C20]">{item.label}</span>
                      <span className="font-mono text-[#8C909A] text-xs">
                        {item.number || String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Minimal Showcase Card on the Right */}
              <div className="md:col-span-4 py-8 sm:py-10 lg:py-12 md:pl-8 lg:pl-10 flex flex-col justify-center">
                {/* Minimal Card Container */}
                <div className="w-full bg-[#181B20] p-1.5 sm:p-2 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
                  {experience.videoUrl ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <div
                          role="button"
                          tabIndex={0}
                          aria-label={`Watch video showcase of ${experience.position} at ${experience.company}`}
                          className="relative w-full aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group select-none block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D45B34]"
                        >
                          <img
                            src={thumbnail}
                            alt={`${experience.company} application screenshot`}
                            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                          />

                          {/* Minimal Centered Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors duration-300">
                            <div className="w-13 h-13 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-active:scale-95">
                              <svg
                                className="w-5 h-5 sm:w-5.5 sm:h-5.5 translate-x-[1px] text-[#D45B34]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <polygon points="6 3 20 12 6 21 6 3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>

                      {/* Modal Video Player */}
                      <DialogContent className="max-w-4xl w-[92vw] p-0 bg-[#121316] border-[#2C3038] text-white overflow-hidden rounded-2xl">
                        <DialogHeader className="p-6 pb-2">
                          <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                            {experience.position} — {experience.company}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="p-4 sm:p-6 pt-2">
                          <AspectRatio ratio={16 / 9}>
                            <iframe
                              src={experience.videoUrl}
                              title={`${experience.company} work experience showcase`}
                              className="w-full h-full rounded-xl border border-white/10"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </AspectRatio>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden">
                      <img
                        src={thumbnail}
                        alt={`${experience.company} application screenshot`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  )}
                </div>

                {/* Minimal Card Bottom Meta Bar */}
                <div className="mt-3 px-1 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#6F737C] font-medium">
                    {tag}
                  </span>
                  {projectUrl && (
                    <a
                      href={projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open external link for ${tag}`}
                      className="group/link text-[#D45B34] p-0.5 inline-flex items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D45B34]"
                    >
                      <svg
                        className="w-4 h-4 text-[#D45B34] transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
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
              </div>
            </div>
          );
        })}

        {/* Full-width Divider Line */}
        <div className="w-full border-t border-[#D5D0C6]" aria-hidden="true" />

        {/* Working Principle Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 sm:py-12 md:py-14 items-start">
          {/* Label */}
          <div className="lg:col-span-3 pt-1">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#71757E] font-medium block">
              WORKING PRINCIPLE
            </span>
          </div>

          {/* Quote */}
          <div className="lg:col-span-9">
            <blockquote className="text-2xl sm:text-3xl md:text-[2.25rem] font-bold text-[#0D0E11] tracking-tight leading-[1.24] max-w-3xl">
              “Make the complex feel considered, then make the considered feel simple.”
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;