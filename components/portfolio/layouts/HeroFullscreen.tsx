'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  heroAnimation,
  heroStagger,
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

interface HeroFullscreenProps {
  data: NormalizedPortfolioData
}

export default function HeroFullscreen({ data }: HeroFullscreenProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { palette, sidebar } = data

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.9])
  const heroY = useTransform(scrollY, [0, 500], [0, 100])

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
        {/* Fullscreen Hero */}
        <motion.header
          className="relative h-screen flex items-center justify-center overflow-hidden"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background: palette.isDark
                ? `radial-gradient(ellipse at center, ${palette.surface} 0%, ${palette.background} 100%)`
                : `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
            }}
          />

          {/* Animated circles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-10"
                style={{
                  width: `${300 + i * 200}px`,
                  height: `${300 + i * 200}px`,
                  border: `1px solid ${palette.isDark ? palette.primary : '#ffffff'}`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <motion.div
            className="relative z-10 text-center px-4"
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            {/* Avatar */}
            <motion.div
              variants={heroAnimation}
              className="mb-8"
            >
              <motion.div
                className="w-40 h-40 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden"
                style={{
                  border: `4px solid ${palette.isDark ? palette.primary : 'rgba(255,255,255,0.4)'}`,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
                whileHover={{ scale: 1.05 }}
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
                    className="w-full h-full flex items-center justify-center text-6xl font-bold"
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

            {/* Name */}
            <motion.h1
              variants={heroAnimation}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
              style={{
                color: '#ffffff',
                fontFamily: "'Playfair Display', Georgia, serif",
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              {sidebar.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={heroAnimation}
              className="text-xl md:text-2xl lg:text-3xl mb-10 font-light max-w-3xl mx-auto"
              style={{ color: palette.isDark ? palette.muted : 'rgba(255,255,255,0.9)' }}
            >
              {sidebar.tagline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={heroAnimation}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {sidebar.email && (
                <motion.a
                  href={`mailto:${sidebar.email}`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium shadow-xl text-lg"
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
                  Get In Touch
                </motion.a>
              )}

              <motion.button
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium border-2 text-lg"
                style={{
                  borderColor: palette.isDark ? palette.primary : 'rgba(255,255,255,0.5)',
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
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={heroAnimation}
              className="flex justify-center gap-4"
            >
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
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-white/60">Scroll</span>
              <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </motion.header>

        {/* Content Sections - Full Width, Vertical */}
        <main>
          {/* About Section */}
          {data.careerProfile?.summary && (
            <motion.section
              className="py-20 px-4"
              style={{ backgroundColor: palette.surface }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="max-w-4xl mx-auto text-center">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-8"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {data.careerProfile.title || 'About Me'}
                </motion.h2>
                <motion.div
                  className="prose prose-lg max-w-none text-left md:text-center"
                  style={{ color: palette.muted }}
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(data.careerProfile.summary) }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                />
              </div>
            </motion.section>
          )}

          {/* Experience Timeline */}
          {data.experiences.length > 0 && (
            <motion.section
              className="py-20 px-4"
              style={{ backgroundColor: palette.background }}
            >
              <div className="max-w-4xl mx-auto">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-12 text-center"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Experience
                </motion.h2>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOptions}
                  className="space-y-8"
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
              </div>
            </motion.section>
          )}

          {/* Skills Grid */}
          {data.skills.length > 0 && (
            <motion.section
              className="py-20 px-4"
              style={{ backgroundColor: palette.surface }}
            >
              <div className="max-w-5xl mx-auto">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-12 text-center"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Skills & Expertise
                </motion.h2>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOptions}
                  className="grid md:grid-cols-2 gap-8"
                >
                  {data.skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      className="p-6 rounded-xl"
                      style={{
                        backgroundColor: palette.background,
                        boxShadow: palette.isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.08)',
                      }}
                    >
                      <SkillBar skill={skill} palette={palette} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <motion.section
              className="py-20 px-4"
              style={{ backgroundColor: palette.background }}
            >
              <div className="max-w-4xl mx-auto">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-12 text-center"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Education
                </motion.h2>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOptions}
                  className="space-y-8"
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
              </div>
            </motion.section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <motion.section
              className="py-20 px-4"
              style={{ backgroundColor: palette.surface }}
            >
              <div className="max-w-5xl mx-auto">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-12 text-center"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Projects
                </motion.h2>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOptions}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {data.projects.map((project, index) => (
                    <ProjectCard
                      key={index}
                      project={project}
                      palette={palette}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* Contact Info Bar */}
          <motion.section
            className="py-16 px-4"
            style={{
              background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
            }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Let's Connect
              </h2>
              <div className="flex flex-wrap justify-center gap-6 text-white/90">
                {sidebar.email && (
                  <a href={`mailto:${sidebar.email}`} className="flex items-center gap-2 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {sidebar.email}
                  </a>
                )}
                {sidebar.phone && (
                  <a href={`tel:${sidebar.phone}`} className="flex items-center gap-2 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {sidebar.phone}
                  </a>
                )}
                {(sidebar.location || sidebar.citizenship) && (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {sidebar.location || sidebar.citizenship}
                  </span>
                )}
              </div>
            </div>
          </motion.section>
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
