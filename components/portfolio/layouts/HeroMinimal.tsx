'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  buttonPop,
  viewportOptions
} from '@/lib/utils/animations'
import type { NormalizedPortfolioData } from '@/lib/types/cv'
import {
  SocialLink,
  TimelineItem,
  SkillBar,
  ProjectCard,
  ShareModal,
  ScrollToTop,
  Footer,
  formatMarkdown
} from '../shared'

interface HeroMinimalProps {
  data: NormalizedPortfolioData
}

export default function HeroMinimal({ data }: HeroMinimalProps) {
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
        {/* Compact Header */}
        <motion.header
          className="sticky top-0 z-50 px-4 py-4"
          style={{
            backgroundColor: palette.isDark ? 'rgba(10,10,10,0.95)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${palette.isDark ? '#2a2a2a' : '#e5e5e5'}`,
          }}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Small Avatar */}
              <motion.div
                className="w-12 h-12 rounded-full overflow-hidden"
                style={{ border: `2px solid ${palette.primary}` }}
                whileHover={{ scale: 1.1 }}
              >
                {sidebar.avatar ? (
                  <img
                    src={sidebar.avatar}
                    alt={sidebar.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: palette.primary, color: '#ffffff' }}
                  >
                    {sidebar.name?.charAt(0) || 'P'}
                  </div>
                )}
              </motion.div>

              <div>
                <h1 className="font-bold text-lg">{sidebar.name}</h1>
                <p className="text-sm" style={{ color: palette.muted }}>{sidebar.tagline}</p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Social Links - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2">
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
              </div>

              {sidebar.email && (
                <motion.a
                  href={`mailto:${sidebar.email}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: palette.primary }}
                  variants={buttonPop}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Contact
                </motion.a>
              )}
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* About Section - Full Width, Prominent */}
          {data.careerProfile?.summary && (
            <motion.section
              className="mb-12 p-8 rounded-2xl"
              style={{
                backgroundColor: palette.surface,
                boxShadow: palette.isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
              }}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {data.careerProfile.title || 'About Me'}
              </h2>
              <div
                className="prose prose-lg max-w-none"
                style={{ color: palette.muted }}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(data.careerProfile.summary) }}
              />
            </motion.section>
          )}

          {/* Card Grid - Experience, Education, Skills */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Experience Card */}
            {data.experiences.length > 0 && (
              <motion.div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: palette.surface,
                  boxShadow: palette.isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
                }}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${palette.primary}20`, color: palette.primary }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Experience</h3>
                </div>
                <div className="space-y-4">
                  {data.experiences.slice(0, 3).map((exp, index) => (
                    <div key={index} className="border-l-2 pl-3" style={{ borderColor: palette.primary }}>
                      <p className="font-medium text-sm">{exp.role}</p>
                      <p className="text-xs" style={{ color: palette.muted }}>{exp.company}</p>
                      <p className="text-xs" style={{ color: palette.primary }}>{exp.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Education Card */}
            {data.education.length > 0 && (
              <motion.div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: palette.surface,
                  boxShadow: palette.isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
                }}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${palette.primary}20`, color: palette.primary }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Education</h3>
                </div>
                <div className="space-y-4">
                  {data.education.slice(0, 3).map((edu, index) => (
                    <div key={index} className="border-l-2 pl-3" style={{ borderColor: palette.primary }}>
                      <p className="font-medium text-sm">{edu.degree}</p>
                      <p className="text-xs" style={{ color: palette.muted }}>{edu.university}</p>
                      <p className="text-xs" style={{ color: palette.primary }}>{edu.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Skills Card */}
            {data.skills.length > 0 && (
              <motion.div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: palette.surface,
                  boxShadow: palette.isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
                }}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${palette.primary}20`, color: palette.primary }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Top Skills</h3>
                </div>
                <div className="space-y-3">
                  {data.skills.slice(0, 5).map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skill.name}</span>
                        <span style={{ color: palette.muted }}>{skill.level}%</span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: palette.isDark ? '#2a2a2a' : '#e5e5e5' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Projects Grid */}
          {data.projects.length > 0 && (
            <motion.section
              className="mb-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOptions}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Projects
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.projects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    project={project}
                    palette={palette}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <motion.section
              className="mb-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOptions}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Certifications
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-xl"
                    style={{
                      backgroundColor: palette.surface,
                      boxShadow: palette.isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.05)',
                    }}
                    variants={staggerItem}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm" style={{ color: palette.muted }}>{cert.organization}</p>
                    <p className="text-xs mt-1" style={{ color: palette.primary }}>{cert.start}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Languages & Interests Row */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Languages */}
            {sidebar.languages.length > 0 && (
              <motion.div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: palette.surface,
                  boxShadow: palette.isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
                }}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
              >
                <h3 className="font-semibold mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {sidebar.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full text-sm"
                      style={{
                        backgroundColor: `${palette.primary}15`,
                        color: palette.primary,
                      }}
                    >
                      {lang.idiom} - {lang.level}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Interests */}
            {data.interests.length > 0 && (
              <motion.div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: palette.surface,
                  boxShadow: palette.isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
                }}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
              >
                <h3 className="font-semibold mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {data.interests.map((interest, index) => (
                    <motion.span
                      key={index}
                      className="px-3 py-1.5 rounded-full text-sm cursor-default"
                      style={{
                        backgroundColor: palette.isDark ? '#1a1a1a' : '#f5f5f5',
                        color: palette.muted,
                      }}
                      whileHover={{
                        backgroundColor: palette.primary,
                        color: '#ffffff',
                      }}
                    >
                      {interest}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
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
