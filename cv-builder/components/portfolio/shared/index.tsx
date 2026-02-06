'use client'

import { motion, AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useState } from 'react'
import {
  staggerContainer,
  staggerItem,
  buttonPop,
  modalOverlay,
  modalContent,
  viewportOptions
} from '@/lib/utils/animations'
import type {
  ColorPalette,
  PortfolioSidebar,
  PortfolioExperience,
  PortfolioEducation,
  PortfolioSkill,
  PortfolioProject,
  PortfolioCertification,
  PortfolioVolunteer
} from '@/lib/types/cv'

// ============================================
// Utility Functions
// ============================================

export function formatMarkdown(text: string): string {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--palette-primary); font-style: normal;">$1</em>')
    .replace(/^- /gm, '<li>')
    .replace(/<li>/g, '</li><li>')
    .replace(/^<\/li>/, '')
    .replace(/<li>([^<]*)/g, '<li>$1</li>')
    .replace(/\n/g, '<br/>')
}

// ============================================
// Social Link Component
// ============================================

interface SocialLinkProps {
  href: string
  icon: 'linkedin' | 'github' | 'globe'
  palette: ColorPalette
}

export function SocialLink({ href, icon, palette }: SocialLinkProps) {
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
            backgroundColor: palette.isDark ? palette.surface : 'rgba(255,255,255,0.15)',
            color: palette.isDark ? palette.muted : '#ffffff',
          }}
          whileHover={{
            backgroundColor: palette.primary,
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

// ============================================
// Content Section Component
// ============================================

interface ContentSectionProps {
  id: string
  title: string
  icon: string
  palette: ColorPalette
  children: React.ReactNode
}

export function ContentSection({ id, title, icon, palette, children }: ContentSectionProps) {
  const icons: Record<string, JSX.Element> = {
    user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    briefcase: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    'graduation-cap': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />,
    rocket: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />,
    'folder-open': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />,
    certificate: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
    heart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  }

  return (
    <motion.section
      id={id}
      className="rounded-2xl p-6 md:p-8"
      style={{
        backgroundColor: palette.surface,
        boxShadow: palette.isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOptions}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: `2px solid ${palette.isDark ? '#2a2a2a' : '#e5e5e5'}` }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: palette.isDark ? palette.surface : `linear-gradient(135deg, ${palette.primary}40, ${palette.primary})`,
            color: palette.isDark ? palette.primary : '#ffffff',
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

// ============================================
// Timeline Item Component
// ============================================

interface TimelineItemProps {
  title: string
  subtitle: string
  time: string
  details?: string
  tags?: string[]
  palette: ColorPalette
}

export function TimelineItem({ title, subtitle, time, details, tags, palette }: TimelineItemProps) {
  return (
    <motion.div
      variants={staggerItem}
      className="relative pl-6 pb-6 border-l-2"
      style={{ borderColor: palette.isDark ? '#2a2a2a' : '#e5e5e5' }}
    >
      <div
        className="absolute left-[-6px] top-0 w-3 h-3 rounded-full border-2"
        style={{
          backgroundColor: palette.primary,
          borderColor: palette.surface,
        }}
      />
      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span
          className="px-3 py-1 rounded-full text-sm"
          style={{
            backgroundColor: palette.isDark ? palette.surface : `${palette.primary}15`,
            color: palette.primary,
          }}
        >
          {time}
        </span>
      </div>
      <p className="mb-2" style={{ color: palette.muted }}>
        {subtitle}
      </p>
      {details && (
        <div
          className="text-sm prose max-w-none"
          style={{ color: palette.isDark ? '#808080' : '#888888' }}
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
                backgroundColor: palette.isDark ? palette.surface : '#f5f5f5',
                color: palette.isDark ? '#808080' : '#666666',
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

// ============================================
// Skill Bar Component
// ============================================

interface SkillBarProps {
  skill: PortfolioSkill
  palette: ColorPalette
}

export function SkillBar({ skill, palette }: SkillBarProps) {
  return (
    <motion.div variants={staggerItem}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{skill.name}</span>
        <span className="text-sm" style={{ color: palette.isDark ? '#808080' : '#999999' }}>
          {skill.level}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: palette.isDark ? palette.surface : '#e5e5e5' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      {skill.tags && skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {skill.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-xs"
              style={{
                backgroundColor: palette.isDark ? palette.surface : '#f5f5f5',
                color: palette.isDark ? '#666666' : '#888888',
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

// ============================================
// Project Card Component
// ============================================

interface ProjectCardProps {
  project: PortfolioProject
  palette: ColorPalette
}

export function ProjectCard({ project, palette }: ProjectCardProps) {
  const content = (
    <motion.div
      variants={staggerItem}
      className="p-4 rounded-xl transition-all"
      style={{ backgroundColor: palette.isDark ? palette.surface : '#f9fafb' }}
      whileHover={{
        scale: 1.01,
        backgroundColor: palette.isDark ? '#222222' : '#f0f0f0',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{project.title}</h3>
        {project.time && (
          <span className="text-sm" style={{ color: palette.primary }}>
            {project.time}
          </span>
        )}
      </div>
      {project.details && (
        <div
          className="text-sm"
          style={{ color: palette.isDark ? '#808080' : '#666666' }}
          dangerouslySetInnerHTML={{ __html: formatMarkdown(project.details) }}
        />
      )}
    </motion.div>
  )

  if (project.link) {
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}

// ============================================
// Sidebar Card Component
// ============================================

interface SidebarCardProps {
  title: string
  palette: ColorPalette
  children: React.ReactNode
}

export function SidebarCard({ title, palette, children }: SidebarCardProps) {
  return (
    <motion.div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: palette.surface,
        boxShadow: palette.isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
      }}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewportOptions}
    >
      <h3
        className="font-semibold mb-4 pb-3"
        style={{ borderBottom: `2px solid ${palette.primary}` }}
      >
        {title}
      </h3>
      {children}
    </motion.div>
  )
}

// ============================================
// Contact Item Component
// ============================================

interface ContactItemProps {
  icon: 'email' | 'phone' | 'location'
  value: string
  href?: string
  palette: ColorPalette
}

export function ContactItem({ icon, value, href, palette }: ContactItemProps) {
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
          backgroundColor: palette.isDark ? palette.surface : '#f5f5f5',
          color: palette.primary,
        }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icons[icon]}
        </svg>
      </div>
      <span className="text-sm truncate" style={{ color: palette.muted }}>
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

// ============================================
// Share Modal Component
// ============================================

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  name: string
  palette: ColorPalette
}

export function ShareModal({ isOpen, onClose, name, palette }: ShareModalProps) {
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
                style={{ backgroundColor: palette.surface }}
                variants={modalContent}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Dialog.Title className="text-xl font-semibold mb-4">
                  Share Portfolio
                </Dialog.Title>

                <div className="mb-6">
                  <label className="text-sm mb-2 block" style={{ color: palette.muted }}>
                    Portfolio Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={url}
                      readOnly
                      className="flex-1 px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: palette.background,
                        border: `1px solid ${palette.isDark ? '#333' : '#e5e5e5'}`,
                        color: palette.text,
                      }}
                    />
                    <motion.button
                      onClick={copyLink}
                      className="px-4 py-2 rounded-lg text-white font-medium"
                      style={{ backgroundColor: palette.primary }}
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
                      backgroundColor: palette.isDark ? '#2a2a2a' : '#f5f5f5',
                      color: palette.muted,
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

// ============================================
// Scroll To Top Button
// ============================================

interface ScrollToTopProps {
  isVisible: boolean
  palette: ColorPalette
}

export function ScrollToTop({ isVisible, palette }: ScrollToTopProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white z-40"
          style={{ backgroundColor: palette.primary }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// ============================================
// Footer Component
// ============================================

interface FooterProps {
  footer?: string
  palette: ColorPalette
}

export function Footer({ footer, palette }: FooterProps) {
  return (
    <footer
      className="py-8 text-center"
      style={{
        backgroundColor: palette.background,
        borderTop: `1px solid ${palette.isDark ? '#2a2a2a' : '#e5e5e5'}`,
      }}
    >
      {footer && (
        <p className="mb-2" style={{ color: palette.muted }}>
          {footer}
        </p>
      )}
      <p className="text-sm" style={{ color: palette.isDark ? '#444444' : '#cccccc' }}>
        Created with{' '}
        <a href="/" style={{ color: palette.primary }}>
          Folyo
        </a>{' '}
        Portfolio Builder
      </p>
    </footer>
  )
}
