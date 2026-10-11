import React from 'react';
import { AboutProps } from '../../../lib/types';

export const About: React.FC<AboutProps> = ({
  personal,
  skills = [],
}) => {
  // Editorial categories from the reference design for Skills & Expertise
  const defaultSkillCategories = [
    {
      num: '01',
      name: 'DESIGN',
      items: ['UI/UX Design', 'Website Design', 'Graphic Design'],
    },
    {
      num: '02',
      name: 'DEVELOPMENT',
      items: ['React', 'JavaScript', 'HTML & CSS'],
    },
    {
      num: '03',
      name: 'TOOLS',
      items: ['Figma', 'Photoshop', 'DaVinci Resolve'],
    },
  ];

  // Resolve skill categories from props or fall back to editorial defaults (untouched as requested)
  const resolvedSkillCategories = defaultSkillCategories.map((defCat) => {
    const foundPropCat = skills.find(
      (c) => c.name.toUpperCase().includes(defCat.name)
    );
    if (foundPropCat && foundPropCat.skills && foundPropCat.skills.length > 0) {
      return {
        num: defCat.num,
        name: defCat.name,
        items: foundPropCat.skills.map((s) => s.name),
      };
    }
    return defCat;
  });

  const leadBioText =
    "A second-year Gordon College student shaping thoughtful digital experiences across interface design, front-end development, and visual communication.";

  const secondaryBioText =
    "I work from structure outward—finding the essential idea, building a clear system around it, and refining the details until the experience feels natural to use.";

  // Editorial portrait photo
  const portraitPhoto = "/Hero%20Section/Hero%20Section.png";

  return (
    <div className="w-full bg-[#0B0C0E] text-white pt-24 sm:pt-32 lg:pt-36 pb-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-12 lg:px-16 transition-colors duration-500">
      <div className="max-w-[1360px] mx-auto">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-12 sm:pb-16 lg:pb-20">
          {/* Left: Section Marker */}
          <div className="inline-flex items-center gap-3 text-xs sm:text-[13px] font-mono tracking-[0.22em] uppercase font-semibold text-[#8E95A2]">
            <span>01</span>
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#D45B34]" aria-hidden="true" />
            <span className="text-white">ABOUT</span>
          </div>

          {/* Right: Location Subtitle Marker */}
          <div className="text-xs sm:text-[13px] font-mono tracking-[0.22em] uppercase text-[#717680] font-medium">
            OLONGAPO CITY / PH
          </div>
        </div>

        {/* Main 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-20 items-start">
          {/* Left Column: Overline, Big Name & Bio Block */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between">
            {/* Monospace Overline Tag */}
            <div className="font-mono text-xs sm:text-[13px] tracking-[0.22em] font-semibold text-[#D45B34] uppercase mb-4 sm:mb-6">
              DESIGNER + FRONT-END DEVELOPER
            </div>

            {/* Massive Display Name Headline with Accent Period */}
            <h2
              id="about-heading"
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7.75rem] font-extrabold text-white tracking-[-0.04em] leading-[0.88] select-none"
            >
              <span className="block">Seann</span>
              <span className="block mt-1 sm:mt-2">
                Tamondong<span className="text-[#D45B34]">.</span>
              </span>
            </h2>

            {/* Horizontal Divider Line */}
            <div className="w-full border-t border-[#23262E] my-8 sm:my-10 lg:my-12" aria-hidden="true" />

            {/* Profile Meta & Bio Block */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
              {/* Monospace Accent Tag */}
              <div className="sm:col-span-3 pt-1">
                <div className="font-mono text-xs sm:text-[12px] tracking-[0.2em] text-[#717680] font-medium uppercase leading-tight">
                  PROFILE / 2025
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="sm:col-span-9 space-y-5 sm:space-y-6">
                {/* Lead Headline Bio */}
                <p className="text-lg sm:text-xl md:text-[1.3rem] lg:text-[1.38rem] font-medium text-white leading-[1.36] tracking-[-0.015em] max-w-xl">
                  {leadBioText}
                </p>

                {/* Secondary Philosophy Bio */}
                <p className="text-sm sm:text-base text-[#8E95A2] font-normal leading-[1.65] max-w-lg">
                  {secondaryBioText}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Framed Portrait Card */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px] bg-[#0E0F13] border border-[#202228] select-none flex flex-col transition-all duration-300 hover:border-[#2C3038] group">
              {/* Full-Bleed Rectangular Photo */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#121316]">
                <img
                  src={portraitPhoto}
                  alt={`Portrait photo of ${personal.name}`}
                  className="w-full h-full object-cover object-[52%_18%] contrast-[1.03] brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                />
                {/* Subtle Cinematic Vignette */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.8) 100%)',
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Card Footer Caption */}
              <div className="border-t border-[#202228] px-5 sm:px-6 py-4 sm:py-5 bg-[#0E0F13]">
                <div className="text-white font-semibold text-sm sm:text-base tracking-tight">
                  {personal.name}
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase">
                  <span className="text-[#6B7280]">DESIGNER + DEVELOPER</span>
                  <span className="text-[#D45B34] font-bold">PH</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Grid: Skills & Expertise (Kept untouched as instructed) */}
        <div className="mt-16 sm:mt-24 lg:mt-28 border-t border-[#202228]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-[#202228]">
            {/* Column 1: Editorial Skills Overview */}
            <div className="py-8 sm:py-10 lg:pr-8">
              <span className="font-mono text-xs sm:text-[12px] tracking-[0.22em] text-[#8E95A2] uppercase font-semibold">
                SKILLS & EXPERTISE
              </span>
              <p className="mt-5 text-[#8E95A2] text-sm sm:text-[15px] leading-relaxed max-w-[240px]">
                A hybrid practice from first idea to working interface.
              </p>
            </div>

            {/* Columns 2, 3, 4: Skill Categories */}
            {resolvedSkillCategories.map((cat) => (
              <div
                key={cat.name}
                className="py-8 sm:py-10 sm:pl-8 lg:px-8 lg:border-l lg:border-[#202228]"
              >
                {/* Category Header */}
                <div className="font-mono text-xs sm:text-[12px] tracking-[0.22em] uppercase font-semibold">
                  <span className="text-[#D45B34]">{cat.num}</span>
                  <span className="text-[#D45B34] mx-1">/</span>
                  <span className="text-white">{cat.name}</span>
                </div>

                {/* Skill Items List */}
                <ul className="mt-5 space-y-3.5">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="text-white text-base sm:text-lg font-semibold tracking-tight hover:text-[#D45B34] transition-colors duration-200 cursor-default"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;