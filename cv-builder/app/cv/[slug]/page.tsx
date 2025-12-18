import { CVPreview } from '../../../components/cv/CVPreview'

// Demo CV data matching the template preview for consistency
const demoCV = {
    theme_skin: 'teal',
    sidebar: {
        name: 'Alex Johnson',
        tagline: 'Senior Product Designer',
        email: 'alex@example.com',
        phone: '+1 (555) 123-4567',
        citizenship: 'San Francisco, CA',
        website: 'alexjohnson.design',
        linkedin: 'alexjohnson',
        github: 'alexjohnson',
        languages: {
            title: 'Languages',
            info: [
                { idiom: 'English', level: 'Native' },
                { idiom: 'Spanish', level: 'Professional' }
            ]
        }
    },
    interests: {
        title: 'Interests',
        info: [
            { item: 'UI/UX Design' },
            { item: 'Design Systems' },
            { item: 'User Research' },
            { item: 'Typography' }
        ]
    },
    'career-profile': {
        title: 'Career Profile',
        summary: 'Creative product designer with 8+ years of experience crafting intuitive digital experiences for Fortune 500 companies. Passionate about user-centered design and building products that make a difference. Led design teams at TechCorp and StartupXYZ, consistently delivering solutions that increased user engagement and business metrics.'
    },
    experiences: {
        title: 'Experience',
        info: [
            {
                role: 'Senior Product Designer',
                time: '2021 - Present',
                company: 'TechCorp Inc.',
                details: 'Lead design for flagship products serving 2M+ users. Increased conversion by 34% through data-driven design iterations. Established design system adopted across 5 product teams.',
                tags: ['Figma', 'User Research', 'Design Systems', 'A/B Testing']
            },
            {
                role: 'Product Designer',
                time: '2018 - 2021',
                company: 'StartupXYZ',
                details: 'Designed mobile app from 0 to 500K downloads. Collaborated with engineering to build component library. Conducted 50+ user interviews to inform product decisions.',
                tags: ['Mobile Design', 'Prototyping', 'Usability Testing']
            },
            {
                role: 'UI Designer',
                time: '2016 - 2018',
                company: 'DesignStudio',
                details: 'Created visual designs for web and mobile applications. Worked with clients across fintech, healthcare, and e-commerce sectors.',
                tags: ['Visual Design', 'Branding', 'Illustration']
            }
        ]
    },
    education: {
        title: 'Education',
        info: [
            {
                degree: 'M.S. Human-Computer Interaction',
                university: 'Stanford University',
                time: '2014 - 2016',
                details: 'Focus on user research methods and interaction design. Thesis on accessible design patterns.'
            },
            {
                degree: 'B.A. Graphic Design',
                university: 'Rhode Island School of Design',
                time: '2010 - 2014',
                details: 'Dean\'s List. Minor in Computer Science.'
            }
        ]
    },
    skills: {
        title: 'Skills & Proficiency',
        toolset: [
            { name: 'UI/UX Design', level: '95%' },
            { name: 'Figma', level: '90%' },
            { name: 'Prototyping', level: '85%' },
            { name: 'User Research', level: '80%' },
            { name: 'Design Systems', level: '85%' },
            { name: 'HTML/CSS', level: '75%' }
        ]
    },
    projects: {
        title: 'Projects',
        intro: 'Notable projects that showcase my design approach and impact.',
        assignments: [
            {
                title: 'Enterprise Dashboard Redesign',
                tagline: 'Reduced task completion time by 40%',
                link: '#'
            },
            {
                title: 'Mobile Banking App',
                tagline: 'Featured in App Store Best of 2022',
                link: '#'
            }
        ]
    },
    certifications: {
        title: 'Certifications',
        list: [
            {
                name: 'Google UX Design Professional Certificate',
                start: '2023',
                organization: 'Google'
            },
            {
                name: 'Certified Usability Analyst',
                start: '2022',
                organization: 'Human Factors International'
            }
        ]
    }
}

// Mock fetching function - in real app this would call API/Database
async function getCV(slug: string) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 100))

    // Return demo data for 'demo' slug, otherwise return minimal data
    if (slug === 'demo') {
        return demoCV
    }

    // For other slugs, return a placeholder
    return {
        theme_skin: 'teal',
        sidebar: {
            name: 'Portfolio Not Found',
            tagline: 'This portfolio does not exist',
            email: '',
            languages: { info: [] }
        },
        'career-profile': {
            summary: 'The requested portfolio could not be found. Please check the URL and try again.'
        },
        experiences: { info: [] },
        education: { info: [] },
        skills: { toolset: [] },
        projects: { assignments: [] }
    }
}

export default async function PublicCVPage({ params }: { params: { slug: string } }) {
    const cvData = await getCV(params.slug)

    return (
        <div className="min-h-screen bg-[#1a1a1a]">
            {/* Metadata for SEO would go in head/layout */}
            <CVPreview data={cvData} theme={cvData.theme_skin} />
        </div>
    )
}
