'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  heroAnimation,
  heroStagger,
  cardHover,
  buttonPop,
  progressBar,
  modalOverlay,
  modalContent,
  scaleIn,
  viewportOptions
} from '@/lib/utils/animations'
import { getThemeConfig, isDarkTheme } from '@/lib/utils/theme'
import { CVData } from '@/lib/types/cv'

interface PortfolioViewProps {
  data: CVData
  themeId?: string
}

export default function PortfolioView({ data, themeId = 'teal' }: PortfolioViewProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState('about')
  const [isScrolled, setIsScrolled] = useState(false)

  const theme = getThemeConfig(themeId)
  const isDark = isDarkTheme(theme)

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
          backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
          color: isDark ? '#ffffff' : '#1a1a1a',
          ['--theme-primary' as string]: theme.primaryColor,
          ['--theme-secondary' as string]: theme.secondaryColor,
        }}
      >
        {/* Floating Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: isScrolled ? 0 : -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
          style={{
            backgroundColor: isDark ? 'rgba(10,10,10,0.9)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#e5e5e5'}`,
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {data.sidebar?.name?.charAt(0) || 'P'}
              </div>
              <span className="font-semibold">{data.sidebar?.name}</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeSection === item.id
                      ? `${theme.primaryColor}20`
                      : 'transparent',
                    color: activeSection === item.id
                      ? theme.primaryColor
                      : isDark ? '#a0a0a0' : '#666666',
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
              style={{ backgroundColor: theme.primaryColor }}
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
              background: isDark
                ? `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)`
                : `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor || theme.primaryColor} 100%)`,
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
                  border: `4px solid ${isDark ? theme.primaryColor : 'rgba(255,255,255,0.3)'}`,
                }}
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {data.sidebar?.avatar ? (
                  <img
                    src={data.sidebar.avatar}
                    alt={data.sidebar.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-5xl font-bold"
                    style={{
                      backgroundColor: isDark ? '#1a1a1a' : theme.primaryColor,
                      color: '#ffffff',
                    }}
                  >
                    {data.sidebar?.name?.charAt(0) || 'P'}
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
              {data.sidebar?.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={heroAnimation}
              className="text-xl md:text-2xl mb-8 font-light"
              style={{ color: isDark ? theme.primaryColor : 'rgba(255,255,255,0.9)' }}
            >
              {data.sidebar?.tagline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={heroAnimation}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {data.sidebar?.email && (
                <motion.a
                  href={`mailto:${data.sidebar.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg"
                  style={{
                    backgroundColor: isDark ? theme.primaryColor : '#ffffff',
                    color: isDark ? '#ffffff' : theme.primaryColor,
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

              {data.sidebar?.phone && (
                <motion.a
                  href={`tel:${data.sidebar.phone}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border-2"
                  style={{
                    borderColor: isDark ? '#333' : 'rgba(255,255,255,0.4)',
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
              {data.sidebar?.linkedin && (
                <SocialLink
                  href={`https://linkedin.com/in/${data.sidebar.linkedin}`}
                  icon="linkedin"
                  isDark={isDark}
                  theme={theme}
                />
              )}
              {data.sidebar?.github && (
                <SocialLink
                  href={`https://github.com/${data.sidebar.github}`}
                  icon="github"
                  isDark={isDark}
                  theme={theme}
                />
              )}
              {data.sidebar?.website && (
                <SocialLink
                  href={data.sidebar.website}
                  icon="globe"
                  isDark={isDark}
                  theme={theme}
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
              {data['career-profile'] && (
                <ContentSection
                  id="about"
                  title={data['career-profile'].title || 'About Me'}
                  icon="user"
                  isDark={isDark}
                  theme={theme}
                >
                  <motion.div
                    className="prose prose-lg max-w-none"
                    style={{ color: isDark ? '#a0a0a0' : '#666666' }}
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(data['career-profile'].summary || '') }}
                  />
                </ContentSection>
              )}

              {/* Experience Section */}
              {data.experiences?.info && data.experiences.info.length > 0 && (
                <ContentSection
                  id="experience"
                  title={data.experiences.title || 'Experience'}
                  icon="briefcase"
                  isDark={isDark}
                  theme={theme}
                >
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOptions}
                    className="space-y-6"
                  >
                    {data.experiences.info.map((exp, index) => (
                      <TimelineItem
                        key={index}
                        title={exp.role}
                        subtitle={exp.company}
                        time={exp.time}
                        details={exp.details}
                        tags={exp.tags}
                        isDark={isDark}
                        theme={theme}
                      />
                    ))}
                  </motion.div>
                </ContentSection>
              )}

              {/* Education Section */}
              {data.education?.info && data.education.info.length > 0 && (
                <ContentSection
                  id="education"
                  title={data.education.title || 'Education'}
                  icon="graduation-cap"
                  isDark={isDark}
                  theme={theme}
                >
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOptions}
                    className="space-y-6"
                  >
                    {data.education.info.map((edu, index) => (
                      <TimelineItem
                        key={index}
                        title={edu.degree}
                        subtitle={edu.university}
                        time={edu.time}
                        details={edu.details}
                        isDark={isDark}
                        theme={theme}
                      />
                    ))}
                  </motion.div>
                </ContentSection>
              )}

              {/* Skills Section */}
              {data.skills?.toolset && data.skills.toolset.length > 0 && (
                <ContentSection
                  id="skills"
                  title={data.skills.title || 'Skills'}
                  icon="rocket"
                  isDark={isDark}
                  theme={theme}
                >
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOptions}
                    className="space-y-5"
                  >
                    {data.skills.toolset.map((skill, index) => (
                      <SkillBar
                        key={index}
                        name={skill.name}
                        level={parseInt(skill.level) || 0}
                        tags={skill.tags}
                        isDark={isDark}
                        theme={theme}
                      />
                    ))}
                  </motion.div>
                </ContentSection>
              )}

              {/* Projects Section */}
              {data.projects?.assignments && data.projects.assignments.length > 0 && (
                <ContentSection
                  id="projects"
                  title={data.projects.title || 'Projects'}
                  icon="folder-open"
                  isDark={isDark}
                  theme={theme}
                >
                  {data.projects.intro && (
                    <p className="mb-6" style={{ color: isDark ? '#a0a0a0' : '#666666' }}>
                      {data.projects.intro}
                    </p>
                  )}
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOptions}
                    className="grid gap-4"
                  >
                    {data.projects.assignments.map((project, index) => (
                      <ProjectCard
                        key={index}
                        title={project.title}
                        time={project.time}
                        details={project.details}
                        link={project.link}
                        isDark={isDark}
                        theme={theme}
                      />
                    ))}
                  </motion.div>
                </ContentSection>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Contact Card */}
              <SidebarCard title="Contact" isDark={isDark} theme={theme}>
                <div className="space-y-3">
                  {data.sidebar?.email && (
                    <ContactItem
                      icon="email"
                      value={data.sidebar.email}
                      href={`mailto:${data.sidebar.email}`}
                      isDark={isDark}
                      theme={theme}
                    />
                  )}
                  {data.sidebar?.phone && (
                    <ContactItem
                      icon="phone"
                      value={data.sidebar.phone}
                      href={`tel:${data.sidebar.phone}`}
                      isDark={isDark}
                      theme={theme}
                    />
                  )}
                  {data.sidebar?.citizenship && (
                    <ContactItem
                      icon="location"
                      value={data.sidebar.citizenship}
                      isDark={isDark}
                      theme={theme}
                    />
                  )}
                </div>
              </SidebarCard>

              {/* Languages Card */}
              {data.sidebar?.languages?.info && (
                <SidebarCard title="Languages" isDark={isDark} theme={theme}>
                  <div className="space-y-2">
                    {data.sidebar.languages.info.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <span>{lang.idiom}</span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: theme.primaryColor }}
                        >
                          {lang.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </SidebarCard>
              )}

              {/* Interests Card */}
              {data.interests?.info && (
                <SidebarCard title="Interests" isDark={isDark} theme={theme}>
                  <div className="flex flex-wrap gap-2">
                    {data.interests.info.map((interest, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1.5 rounded-full text-sm cursor-default"
                        style={{
                          backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                          color: isDark ? '#a0a0a0' : '#666666',
                        }}
                        whileHover={{
                          backgroundColor: theme.primaryColor,
                          color: '#ffffff',
                          scale: 1.05,
                        }}
                      >
                        {interest.item}
                      </motion.span>
                    ))}
                  </div>
                </SidebarCard>
              )}

              {/* Share Card */}
              <SidebarCard title="Share Portfolio" isDark={isDark} theme={theme}>
                <div className="flex gap-2">
                  <motion.button
                    onClick={copyToClipboard}
                    className="flex-1 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                      color: isDark ? '#a0a0a0' : '#666666',
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
                    style={{ backgroundColor: theme.primaryColor }}
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
        <footer
          className="py-8 text-center"
          style={{
            backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
            borderTop: `1px solid ${isDark ? '#2a2a2a' : '#e5e5e5'}`,
          }}
        >
          {data.footer && (
            <p className="mb-2" style={{ color: isDark ? '#666666' : '#999999' }}>
              {data.footer}
            </p>
          )}
          <p className="text-sm" style={{ color: isDark ? '#444444' : '#cccccc' }}>
            Created with{' '}
            <a href="/" style={{ color: theme.primaryColor }}>
              Folyo
            </a>{' '}
            Portfolio Builder
          </p>
        </footer>

        {/* Scroll to Top */}
        <AnimatePresence>
          {isScrolled && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white z-40"
              style={{ backgroundColor: theme.primaryColor }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Share Modal */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          name={data.sidebar?.name || 'Portfolio'}
          isDark={isDark}
          theme={theme}
        />
      </div>
    </Tooltip.Provider>
  )
}

// Sub-components

function SocialLink({ href, icon, isDark, theme }: { href: string; icon: string; isDark: boolean; theme: any }) {
  const icons: Record<string, JSX.Element> = {
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
    globe: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isDark ? '#1a1a1a' : 'rgba(255,255,255,0.15)',
            color: isDark ? '#a0a0a0' : '#ffffff',
          }}
          whileHover={{
            backgroundColor: theme.primaryColor,
            color: '#ffffff',
            y: -3,
          }}
        >
          {icons[icon]}
        </motion.a>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="px-3 py-1.5 rounded-lg text-sm text-white shadow-lg"
          style={{ backgroundColor: '#1a1a1a' }}
          sideOffset={5}
        >
          {icon.charAt(0).toUpperCase() + icon.slice(1)}
          <Tooltip.Arrow style={{ fill: '#1a1a1a' }} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

function ContentSection({ id, title, icon, isDark, theme, children }: {
  id: string
  title: string
  icon: string
  isDark: boolean
  theme: any
  children: React.ReactNode
}) {
  const icons: Record<string, JSX.Element> = {
    user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    briefcase: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    'graduation-cap': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />,
    rocket: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />,
    'folder-open': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />,
  }

  return (
    <motion.section
      id={id}
      className="rounded-2xl p-6 md:p-8"
      style={{
        backgroundColor: isDark ? '#141414' : '#ffffff',
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOptions}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: `2px solid ${isDark ? '#2a2a2a' : '#e5e5e5'}` }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: isDark ? '#1a1a1a' : `linear-gradient(135deg, ${theme.primaryColor}40, ${theme.primaryColor})`,
            color: isDark ? theme.primaryColor : '#ffffff',
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icons[icon]}
          </svg>
        </div>
        <h2
          className="text-xl md:text-2xl font-semibold"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  )
}

function TimelineItem({ title, subtitle, time, details, tags, isDark, theme }: {
  title: string
  subtitle: string
  time: string
  details?: string
  tags?: string[]
  isDark: boolean
  theme: any
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="relative pl-6 pb-6 border-l-2"
      style={{ borderColor: isDark ? '#2a2a2a' : '#e5e5e5' }}
    >
      <div
        className="absolute left-[-6px] top-0 w-3 h-3 rounded-full border-2"
        style={{
          backgroundColor: theme.primaryColor,
          borderColor: isDark ? '#141414' : '#ffffff',
        }}
      />
      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span
          className="px-3 py-1 rounded-full text-sm"
          style={{
            backgroundColor: isDark ? '#1a1a1a' : `${theme.primaryColor}15`,
            color: theme.primaryColor,
          }}
        >
          {time}
        </span>
      </div>
      <p className="mb-2" style={{ color: isDark ? '#a0a0a0' : '#666666' }}>
        {subtitle}
      </p>
      {details && (
        <div
          className="text-sm prose max-w-none"
          style={{ color: isDark ? '#808080' : '#888888' }}
          dangerouslySetInnerHTML={{ __html: formatMarkdown(details) }}
        />
      )}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded text-xs"
              style={{
                backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                color: isDark ? '#808080' : '#666666',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function SkillBar({ name, level, tags, isDark, theme }: {
  name: string
  level: number
  tags?: string[]
  isDark: boolean
  theme: any
}) {
  return (
    <motion.div variants={staggerItem}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{name}</span>
        <span className="text-sm" style={{ color: isDark ? '#808080' : '#999999' }}>
          {level}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: isDark ? '#1a1a1a' : '#e5e5e5' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor || theme.primaryColor})`,
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-xs"
              style={{
                backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                color: isDark ? '#666666' : '#888888',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function ProjectCard({ title, time, details, link, isDark, theme }: {
  title: string
  time?: string
  details?: string
  link?: string
  isDark: boolean
  theme: any
}) {
  const content = (
    <motion.div
      variants={staggerItem}
      className="p-4 rounded-xl transition-all"
      style={{ backgroundColor: isDark ? '#1a1a1a' : '#f9fafb' }}
      whileHover={{
        scale: 1.01,
        backgroundColor: isDark ? '#222222' : '#f0f0f0',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{title}</h3>
        {time && (
          <span className="text-sm" style={{ color: theme.primaryColor }}>
            {time}
          </span>
        )}
      </div>
      {details && (
        <div
          className="text-sm"
          style={{ color: isDark ? '#808080' : '#666666' }}
          dangerouslySetInnerHTML={{ __html: formatMarkdown(details) }}
        />
      )}
    </motion.div>
  )

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}

function SidebarCard({ title, isDark, theme, children }: {
  title: string
  isDark: boolean
  theme: any
  children: React.ReactNode
}) {
  return (
    <motion.div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: isDark ? '#141414' : '#ffffff',
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
      }}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewportOptions}
    >
      <h3
        className="font-semibold mb-4 pb-3"
        style={{ borderBottom: `2px solid ${theme.primaryColor}` }}
      >
        {title}
      </h3>
      {children}
    </motion.div>
  )
}

function ContactItem({ icon, value, href, isDark, theme }: {
  icon: string
  value: string
  href?: string
  isDark: boolean
  theme: any
}) {
  const icons: Record<string, JSX.Element> = {
    email: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    location: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />,
  }

  const content = (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
          color: theme.primaryColor,
        }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icons[icon]}
        </svg>
      </div>
      <span className="text-sm truncate" style={{ color: isDark ? '#a0a0a0' : '#666666' }}>
        {value}
      </span>
    </div>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className="block"
        whileHover={{ x: 4 }}
      >
        {content}
      </motion.a>
    )
  }

  return content
}

function ShareModal({ isOpen, onClose, name, isDark, theme }: {
  isOpen: boolean
  onClose: () => void
  name: string
  isDark: boolean
  theme: any
}) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: '#0A66C2',
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out ${name}'s portfolio!`)}`,
      color: '#1DA1F2',
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(`Check out ${name}'s portfolio: ${url}`)}`,
      color: '#25D366',
    },
  ]

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                variants={modalOverlay}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl p-6 z-50"
                style={{ backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }}
                variants={modalContent}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Dialog.Title className="text-xl font-semibold mb-4">
                  Share Portfolio
                </Dialog.Title>

                <div className="mb-6">
                  <label className="text-sm mb-2 block" style={{ color: isDark ? '#808080' : '#666666' }}>
                    Portfolio Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={url}
                      readOnly
                      className="flex-1 px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: isDark ? '#0a0a0a' : '#f5f5f5',
                        border: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
                        color: isDark ? '#ffffff' : '#1a1a1a',
                      }}
                    />
                    <motion.button
                      onClick={copyLink}
                      className="px-4 py-2 rounded-lg text-white font-medium"
                      style={{ backgroundColor: theme.primaryColor }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {shareLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 py-4 rounded-xl text-white font-medium"
                      style={{ backgroundColor: link.color }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>

                <Dialog.Close asChild>
                  <motion.button
                    className="absolute top-4 right-4 p-2 rounded-lg"
                    style={{
                      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                      color: isDark ? '#808080' : '#666666',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

// Helper function to format markdown-like text
function formatMarkdown(text: string): string {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--theme-primary); font-style: normal;">$1</em>')
    .replace(/^- /gm, '<li>')
    .replace(/<li>/g, '</li><li>')
    .replace(/^<\/li>/, '')
    .replace(/<li>([^<]*)/g, '<li>$1</li>')
    .replace(/\n/g, '<br/>')
}
