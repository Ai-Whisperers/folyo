'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  heroAnimation,
  heroStagger,
  staggerContainer,
  buttonPop,
  viewportOptions
} from '@/lib/utils/animations'
import type { NormalizedPortfolioData } from '@/lib/types/cv'
import {
  SocialLink,
  ContentSection,
  TimelineItem,
  SkillBar,
  ProjectCard,
  SidebarCard,
  ContactItem,
  ShareModal,
  ScrollToTop,
  Footer,
  formatMarkdown
} from '../shared'

interface HeroSplitProps {
  data: NormalizedPortfolioData
}

export default function HeroSplit({ data }: HeroSplitProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { palette, sidebar } = data

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Tooltip.Provider delayDuration={200}>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: palette.background,
          color: palette.text,
          ['--palette-primary' as string]: palette.primary,
          ['--palette-secondary' as string]: palette.secondary,
        }}
      >
        {/* Hero Section - Split Layout */}
        <motion.header
          className="relative overflow-hidden"
          style={{
            background: palette.isDark
              ? `linear-gradient(135deg, ${palette.background} 0%, ${palette.surface} 100%)`
              : `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
          }}
        >
          <motion.div
            className="max-w-6xl mx-auto px-4 py-16 md:py-24"
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Avatar */}
              <motion.div
                variants={heroAnimation}
                className="flex justify-center md:justify-end"
              >
                <motion.div
                  className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    border: `4px solid ${palette.isDark ? palette.primary : 'rgba(255,255,255,0.3)'}`,
                  }}
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {sidebar.avatar ? (
                    <img
                      src={sidebar.avatar}
                      alt={sidebar.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-7xl font-bold"
                      style={{
                        backgroundColor: palette.isDark ? palette.surface : palette.primary,
                        color: '#ffffff',
                      }}
                    >
                      {sidebar.name?.charAt(0) || 'P'}
                    </div>
                  )}
                </motion.div>
              </motion.div>

              {/* Right: Info */}
              <motion.div
                variants={heroAnimation}
                className="text-center md:text-left"
              >
                <motion.h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                  style={{ color: '#ffffff', fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {sidebar.name}
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl mb-6 font-light"
                  style={{ color: palette.isDark ? palette.primary : 'rgba(255,255,255,0.9)' }}
                >
                  {sidebar.tagline}
                </motion.p>

                {/* Social Links */}
                <div className="flex justify-center md:justify-start gap-3 mb-6">
                  {sidebar.linkedin && (
                    <SocialLink
                      href={`https://linkedin.com/in/${sidebar.linkedin}`}
                      icon="linkedin"
                      palette={palette}
                    />
                  )}
                  {sidebar.github && (
                    <SocialLink
                      href={`https://github.com/${sidebar.github}`}
                      icon="github"
                      palette={palette}
                    />
                  )}
                  {sidebar.website && (
                    <SocialLink
                      href={sidebar.website}
                      icon="globe"
                      palette={palette}
                    />
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {sidebar.email && (
                    <motion.a
                      href={`mailto:${sidebar.email}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg"
                      style={{
                        backgroundColor: palette.isDark ? palette.primary : '#ffffff',
                        color: palette.isDark ? '#ffffff' : palette.primary,
                      }}
                      variants={buttonPop}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Me
                    </motion.a>
                  )}

                  <motion.button
                    onClick={() => setIsShareModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border-2"
                    style={{
                      borderColor: palette.isDark ? '#333' : 'rgba(255,255,255,0.4)',
                      color: '#ffffff',
                    }}
                    variants={buttonPop}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Left on this layout */}
            <aside className="space-y-6 lg:order-first">
              {/* Contact Card */}
              <SidebarCard title="Contact" palette={palette}>
                <div className="space-y-3">
                  {sidebar.email && (
                    <ContactItem
                      icon="email"
                      value={sidebar.email}
                      href={`mailto:${sidebar.email}`}
                      palette={palette}
                    />
                  )}
                  {sidebar.phone && (
                    <ContactItem
                      icon="phone"
                      value={sidebar.phone}
                      href={`tel:${sidebar.phone}`}
                      palette={palette}
                    />
                  )}
                  {(sidebar.location || sidebar.citizenship) && (
                    <ContactItem
                      icon="location"
                      value={sidebar.location || sidebar.citizenship || ''}
                      palette={palette}
                    />
                  )}
                </div>
              </SidebarCard>

              {/* Languages Card */}
              {sidebar.languages.length > 0 && (
                <SidebarCard title="Languages" palette={palette}>
                  <div className="space-y-2">
                    {sidebar.languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <span>{lang.idiom}</span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: palette.primary }}
                        >
                          {lang.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </SidebarCard>
              )}

              {/* Interests Card */}
              {data.interests.length > 0 && (
                <SidebarCard title="Interests" palette={palette}>
                  <div className="flex flex-wrap gap-2">
                    {data.interests.map((interest, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1.5 rounded-full text-sm cursor-default"
                        style={{
                          backgroundColor: palette.isDark ? palette.surface : '#f5f5f5',
                          color: palette.muted,
                        }}
                        whileHover={{
                          backgroundColor: palette.primary,
                          color: '#ffffff',
                          scale: 1.05,
                        }}
                      >
                        {interest}
                      </motion.span>
                    ))}
                  </div>
                </SidebarCard>
              )}
            </aside>

            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              {data.careerProfile?.summary && (
                <ContentSection
                  id="about"
                  title={data.careerProfile.title || 'About Me'}
                  icon="user"
                  palette={palette}
                >
                  <motion.div
                    className="prose prose-lg max-w-none"
                    style={{ color: palette.muted }}
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(data.careerProfile.summary) }}
                  />
                </ContentSection>
              )}

              {/* Experience Section */}
              {data.experiences.length > 0 && (
                <ContentSection
                  id="experience"
                  title="Experience"
                  icon="briefcase"
                  palette={palette}
                >
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOptions}
                    className="space-y-6"
                  >
                    {data.experiences.map((exp, index) => (
                      <TimelineItem
                        key={index}
                        title={exp.role}
                        subtitle={exp.company}
                        time={exp.time}
                        details={exp.details}
                        tags={exp.tags}
                        palette={palette}
                      />
                    ))}
                  </motion.div>
                </ContentSection>
              )}

              {/* Skills Section */}
              {data.skills.length > 0 && (
                <ContentSection
                  id="skills"
                  title="Skills"
                  icon="rocket"
                  palette={palette}
                >
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOptions}
                    className="space-y-5"
                  >
                    {data.skills.map((skill, index) => (
                      <SkillBar
                        key={index}
                        skill={skill}
                        palette={palette}
                      />
                    ))}
                  </motion.div>
                </ContentSection>
              )}

              {/* Education Section */}
              {data.education.length > 0 && (
                <ContentSection
                  id="education"
                  title="Education"
                  icon="graduation-cap"
                  palette={palette}
                >
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOptions}
                    className="space-y-6"
                  >
                    {data.education.map((edu, index) => (
                      <TimelineItem
                        key={index}
                        title={edu.degree}
                        subtitle={edu.university}
                        time={edu.time}
                        details={edu.details}
                        palette={palette}
                      />
                    ))}
                  </motion.div>
                </ContentSection>
              )}

              {/* Projects Section */}
              {data.projects.length > 0 && (
                <ContentSection
                  id="projects"
                  title="Projects"
                  icon="folder-open"
                  palette={palette}
                >
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOptions}
                    className="grid gap-4"
                  >
                    {data.projects.map((project, index) => (
                      <ProjectCard
                        key={index}
                        project={project}
                        palette={palette}
                      />
                    ))}
                  </motion.div>
                </ContentSection>
              )}

              {/* Certifications Section */}
              {data.certifications.length > 0 && (
                <ContentSection
                  id="certifications"
                  title="Certifications"
                  icon="certificate"
                  palette={palette}
                >
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOptions}
                    className="space-y-6"
                  >
                    {data.certifications.map((cert, index) => (
                      <TimelineItem
                        key={index}
                        title={cert.name}
                        subtitle={cert.organization}
                        time={cert.start}
                        details={cert.details}
                        palette={palette}
                      />
                    ))}
                  </motion.div>
                </ContentSection>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer footer={data.footer} palette={palette} />

        {/* Scroll to Top */}
        <ScrollToTop isVisible={isScrolled} palette={palette} />

        {/* Share Modal */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          name={sidebar.name}
          palette={palette}
        />
      </div>
    </Tooltip.Provider>
  )
}
