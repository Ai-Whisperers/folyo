'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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

interface HeroCenteredProps {
  data: NormalizedPortfolioData
}

export default function HeroCentered({ data }: HeroCenteredProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState('about')
  const [isScrolled, setIsScrolled] = useState(false)

  const { palette, sidebar } = data

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navItems = [
    { id: 'about', label: 'About', icon: 'user' },
    { id: 'experience', label: 'Experience', icon: 'briefcase' },
    { id: 'education', label: 'Education', icon: 'graduation-cap' },
    { id: 'skills', label: 'Skills', icon: 'rocket' },
    { id: 'projects', label: 'Projects', icon: 'folder-open' },
  ]

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
        {/* Floating Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: isScrolled ? 0 : -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
          style={{
            backgroundColor: palette.isDark ? 'rgba(10,10,10,0.9)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${palette.isDark ? '#2a2a2a' : '#e5e5e5'}`,
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: palette.primary }}
              >
                {sidebar.name?.charAt(0) || 'P'}
              </div>
              <span className="font-semibold">{sidebar.name}</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeSection === item.id
                      ? `${palette.primary}20`
                      : 'transparent',
                    color: activeSection === item.id
                      ? palette.primary
                      : palette.muted,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: palette.primary }}
              variants={buttonPop}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              Share
            </motion.button>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.header
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              background: palette.isDark
                ? `linear-gradient(135deg, ${palette.background} 0%, ${palette.surface} 100%)`
                : `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
            }}
          />

          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
              animate={{ x: [0, 30], y: [0, 30] }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            />
          </div>

          <motion.div
            className="relative z-10 max-w-4xl mx-auto px-4 py-24 md:py-32 text-center"
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            {/* Avatar */}
            <motion.div
              variants={heroAnimation}
              className="mb-6"
            >
              <motion.div
                className="w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full overflow-hidden shadow-2xl"
                style={{
                  border: `4px solid ${palette.isDark ? palette.primary : 'rgba(255,255,255,0.3)'}`,
                }}
                whileHover={{ scale: 1.05, rotate: 3 }}
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
                    className="w-full h-full flex items-center justify-center text-5xl font-bold"
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ color: '#ffffff', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {sidebar.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={heroAnimation}
              className="text-xl md:text-2xl mb-8 font-light"
              style={{ color: palette.isDark ? palette.primary : 'rgba(255,255,255,0.9)' }}
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

              {sidebar.phone && (
                <motion.a
                  href={`tel:${sidebar.phone}`}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </motion.a>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={heroAnimation}
              className="flex justify-center gap-3"
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
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-6 h-6 text-white opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
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

              {/* Volunteer Section */}
              {data.volunteer.length > 0 && (
                <ContentSection
                  id="volunteer"
                  title="Volunteer Work"
                  icon="heart"
                  palette={palette}
                >
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOptions}
                    className="space-y-6"
                  >
                    {data.volunteer.map((vol, index) => (
                      <TimelineItem
                        key={index}
                        title={vol.role}
                        subtitle={vol.company}
                        time={vol.time}
                        details={vol.details}
                        tags={vol.tags}
                        palette={palette}
                      />
                    ))}
                  </motion.div>
                </ContentSection>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
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

              {/* Share Card */}
              <SidebarCard title="Share Portfolio" palette={palette}>
                <div className="flex gap-2">
                  <motion.button
                    onClick={copyToClipboard}
                    className="flex-1 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: palette.isDark ? palette.surface : '#f5f5f5',
                      color: palette.muted,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {copied ? 'Copied!' : 'Copy Link'}
                  </motion.button>
                  <motion.button
                    onClick={() => setIsShareModalOpen(true)}
                    className="py-2 px-4 rounded-lg text-white"
                    style={{ backgroundColor: palette.primary }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </motion.button>
                </div>
              </SidebarCard>
            </aside>
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
