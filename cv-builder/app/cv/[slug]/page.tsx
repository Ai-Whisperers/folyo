import { CVPreview } from '../../../components/CVPreview'

// Mock fetching function - in real app this would call API/Database
async function getCV(slug: string) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Return mock data for demonstration
    return {
        theme_skin: 'video-portfolio', // Default to our new theme for demo
        sidebar: {
            name: 'Alex Creative',
            tagline: 'Filmmaker & Visual Artist',
            email: 'alex@example.com',
            website: 'alexcreative.com',
            linkedin: 'alexcreative',
            languages: { info: [] }
        },
        'career-profile': {
            summary: 'Passionate visual storyteller with 5+ years of experience in directing, editing, and motion graphics. Specialized in creating immersive digital experiences that blend narrative with cutting-edge visual effects.'
        },
        portfolio: {
            layout: 'grid',
            items: [
                {
                    type: 'video',
                    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    title: 'Cinematic Reel 2024',
                    description: 'A compilation of my best work in cinematography and color grading over the past year.'
                },
                {
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
                    title: 'Urban Photography Series',
                    description: 'Exploring the geometry of modern cityscapes through high-contrast black and white photography.'
                }
            ]
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
