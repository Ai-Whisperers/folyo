import OpenAI from 'openai'

// Lazy initialization of OpenAI client - ensures env vars are available at runtime
let openai: OpenAI | null = null

function getOpenAIClient(): OpenAI | null {
  if (openai) return openai

  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    return openai
  }

  return null
}

// CV Section Enhancement Prompts
const ENHANCEMENT_PROMPTS: Record<string, string> = {
  experience: `You are a professional CV writer. Transform the user's casual description of their work experience into professional, ATS-friendly CV content.

Guidelines:
- Use strong action verbs (Led, Managed, Implemented, Achieved, etc.)
- Quantify achievements where possible
- Focus on impact and results, not just responsibilities
- Use professional language while maintaining authenticity
- Keep it concise but comprehensive
- Format as bullet points if appropriate

Original user input: "{userInput}"

Enhanced professional version:`,

  skills: `You are a professional CV writer. Transform the user's casual description of their skills into a professional skills section.

Guidelines:
- Categorize skills appropriately (Technical, Leadership, Communication, etc.)
- Use industry-standard terminology
- Prioritize relevant skills for the role
- Present in a clean, organized format
- Avoid redundancy

Original user input: "{userInput}"

Enhanced professional version:`,

  summary: `You are a professional CV writer. Transform the user's casual self-description into a compelling professional summary/biography for a CV.

STRICT RULES:
1. PRESERVE the person's authentic voice and personality - do NOT make it sound generic or corporate
2. Keep the same general structure and key points they mentioned
3. DO NOT invent or add fake statistics, percentages, or metrics that weren't in the original
4. DO NOT add cliché phrases like "results-driven", "passionate professional", "dynamic leader"
5. Keep it first-person if the original is first-person
6. Maximum 3-4 sentences - be concise
7. Highlight what makes this person unique, not generic traits

WHAT TO IMPROVE:
- Fix grammar and spelling errors
- Improve sentence flow and readability
- Make the language more polished while keeping it authentic
- Ensure it clearly communicates their value proposition
- Remove filler words and redundancies

Original user input: "{userInput}"

Enhanced professional version:`,

  biography: `You are a professional CV writer. Transform the user's personal introduction/bio into a polished professional biography.

STRICT RULES:
1. PRESERVE the person's authentic voice, tone, and personality
2. DO NOT add fake statistics, numbers, or achievements not mentioned in the original
3. DO NOT use generic corporate buzzwords or clichés
4. Keep the same narrative style (first-person stays first-person)
5. Maintain any unique personality traits or unconventional approaches they mentioned
6. Do NOT sanitize or remove character - if they're bold or unconventional, keep that energy
7. Maximum 4-5 sentences

WHAT TO IMPROVE:
- Polish grammar and sentence structure
- Improve word choice for clarity and impact
- Ensure professional credibility while maintaining authenticity
- Remove unnecessary filler words
- Make the opening hook stronger

Original user input: "{userInput}"

Enhanced professional version:`,

  education: `You are a professional CV writer. Transform the user's casual description of their education into a professional education section.

Guidelines:
- Format degree names correctly
- Include relevant details (GPA if strong, honors, relevant coursework)
- Present in reverse chronological order
- Include any certifications or additional training
- Use consistent formatting

Original user input: "{userInput}"

Enhanced professional version:`,

  achievements: `You are a professional CV writer. Transform the user's casual description of their achievements into compelling accomplishment statements.

Guidelines:
- Use the STAR method where appropriate (Situation, Task, Action, Result)
- Quantify impact with numbers, percentages, or metrics
- Use strong action verbs
- Focus on business impact and value created
- Make each achievement specific and measurable

Original user input: "{userInput}"

Enhanced professional version:`,

  general: `You are a professional CV writer. Transform the user's casual description into professional, ATS-friendly CV content.

Guidelines:
- Use strong action verbs
- Quantify achievements where possible
- Focus on impact and results
- Use professional language while maintaining authenticity
- Keep it concise but comprehensive

Original user input: "{userInput}"

Enhanced professional version:`,

  // Aliases for common section names
  intro: `You are a professional CV writer. Transform the user's personal introduction/bio into a polished professional biography.

STRICT RULES:
1. PRESERVE the person's authentic voice, tone, and personality
2. DO NOT add fake statistics, numbers, or achievements not mentioned in the original
3. DO NOT use generic corporate buzzwords or clichés
4. Keep the same narrative style (first-person stays first-person)
5. Maintain any unique personality traits or unconventional approaches they mentioned
6. Do NOT sanitize or remove character - if they're bold or unconventional, keep that energy
7. Maximum 4-5 sentences

WHAT TO IMPROVE:
- Polish grammar and sentence structure
- Improve word choice for clarity and impact
- Ensure professional credibility while maintaining authenticity
- Remove unnecessary filler words
- Make the opening hook stronger

Original user input: "{userInput}"

Enhanced professional version:`,

  about: `You are a professional CV writer. Transform the user's "about me" section into a polished professional biography.

STRICT RULES:
1. PRESERVE the person's authentic voice, tone, and personality
2. DO NOT add fake statistics, numbers, or achievements not mentioned in the original
3. DO NOT use generic corporate buzzwords or clichés
4. Keep the same narrative style (first-person stays first-person)
5. Maintain any unique personality traits or unconventional approaches they mentioned
6. Do NOT sanitize or remove character - if they're bold or unconventional, keep that energy
7. Maximum 4-5 sentences

WHAT TO IMPROVE:
- Polish grammar and sentence structure
- Improve word choice for clarity and impact
- Ensure professional credibility while maintaining authenticity
- Remove unnecessary filler words
- Make the opening hook stronger

Original user input: "{userInput}"

Enhanced professional version:`
}

export interface EnhancementResult {
  success: boolean
  original: string
  enhanced: string
  section: string
  note?: string
  error?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface JobAnalysisResult {
  success: boolean
  analysis: Record<string, unknown> | null
  originalJD?: string
  note?: string
  error?: string
}

export interface AlternativesResult {
  success: boolean
  original: string
  alternatives: Array<{
    version: number
    style: string
    content: string
  }>
  section: string
  note?: string
  error?: string
}

export interface EvaluationResult {
  success: boolean
  evaluation: Record<string, unknown> | null
  hasJobDescription?: boolean
  note?: string
  error?: string
}

export class CVEnhancementService {
  private model: string
  private maxTokens: number

  constructor() {
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
    this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '2000')
  }

  /**
   * Enhance user input for a specific CV section
   */
  async enhanceContent(userInput: string, section: string, _context: Record<string, unknown> = {}): Promise<EnhancementResult> {
    const client = getOpenAIClient()

    // Return original content if OpenAI is not configured
    if (!client) {
      console.log('OpenAI not configured - OPENAI_API_KEY not set')
      return {
        success: true,
        original: userInput,
        enhanced: userInput,
        section,
        note: 'OpenAI not configured - returning original content'
      }
    }

    try {
      const prompt = ENHANCEMENT_PROMPTS[section] || ENHANCEMENT_PROMPTS.general
      const enhancedPrompt = prompt.replace('{userInput}', userInput)

      console.log('Calling OpenAI with model:', this.model)

      const completion = await client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert CV writer and career coach. Provide professional, ATS-optimized content that helps users stand out to recruiters and hiring managers. Only output the enhanced version, nothing else.'
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })

      const enhanced = completion.choices[0].message.content?.trim() || userInput

      console.log('OpenAI response received, tokens:', completion.usage?.total_tokens)

      return {
        success: true,
        original: userInput,
        enhanced,
        section,
        usage: completion.usage as EnhancementResult['usage']
      }

    } catch (error) {
      console.error('OpenAI enhancement error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        original: userInput,
        enhanced: userInput,
        section
      }
    }
  }

  /**
   * Analyze job description and extract key requirements
   */
  async analyzeJobDescription(jobDescription: string): Promise<JobAnalysisResult> {
    const client = getOpenAIClient()

    // Return null analysis if OpenAI is not configured
    if (!client) {
      return {
        success: true,
        analysis: null,
        originalJD: jobDescription,
        note: 'OpenAI not configured - job description analysis unavailable'
      }
    }

    try {
      const prompt = `Analyze this job description and extract key information that should be emphasized in a CV:

Job Description:
"${jobDescription}"

Please provide:
1. Required skills and technologies
2. Key responsibilities that should be highlighted
3. Important keywords for ATS optimization
4. Experience level and qualifications needed
5. Soft skills and competencies valued

Format as JSON with clear categories.`

      const completion = await client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert recruiter and ATS specialist. Extract and categorize key requirements from job descriptions to help optimize CVs. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })

      const analysisText = completion.choices[0].message.content?.trim() || '{}'
      let analysis: Record<string, unknown>

      try {
        // Try to parse as JSON
        analysis = JSON.parse(analysisText)
      } catch {
        // Fallback to text analysis
        analysis = {
          rawAnalysis: analysisText,
          requiresParsing: true
        }
      }

      return {
        success: true,
        analysis,
        originalJD: jobDescription
      }

    } catch (error) {
      console.error('Job description analysis error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        analysis: null
      }
    }
  }

  /**
   * Generate multiple alternative versions of enhanced content
   */
  async generateAlternatives(userInput: string, section: string, count: number = 3): Promise<AlternativesResult> {
    const client = getOpenAIClient()

    // Return original content as single alternative if OpenAI is not configured
    if (!client) {
      return {
        success: true,
        original: userInput,
        alternatives: [{
          version: 1,
          style: 'original',
          content: userInput
        }],
        section,
        note: 'OpenAI not configured - returning original content only'
      }
    }

    try {
      const alternatives = await Promise.all(
        Array.from({ length: count }, async (_, index) => {
          const variation = index === 0 ? 'professional and formal' :
                          index === 1 ? 'dynamic and results-focused' :
                          'creative but professional'

          const basePrompt = ENHANCEMENT_PROMPTS[section] || ENHANCEMENT_PROMPTS.general
          const prompt = `${basePrompt.replace('{userInput}', userInput)}

Style: Make this version ${variation}.`

          const completion = await client.chat.completions.create({
            model: this.model,
            messages: [
              {
                role: 'system',
                content: 'You are an expert CV writer. Create different stylistic approaches while maintaining professionalism and ATS optimization.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: this.maxTokens,
            temperature: 0.7 + (index * 0.1)
          })

          return {
            version: index + 1,
            style: variation,
            content: completion.choices[0].message.content?.trim() || userInput
          }
        })
      )

      return {
        success: true,
        original: userInput,
        alternatives,
        section
      }

    } catch (error) {
      console.error('Alternatives generation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        original: userInput,
        alternatives: [],
        section
      }
    }
  }

  /**
   * Evaluate CV content and provide ATS score and recommendations
   */
  async evaluateContent(cvData: Record<string, unknown>, jobDescription: string | null = null): Promise<EvaluationResult> {
    const client = getOpenAIClient()

    // Return null evaluation if OpenAI is not configured
    if (!client) {
      return {
        success: true,
        evaluation: null,
        hasJobDescription: !!jobDescription,
        note: 'OpenAI not configured - CV evaluation unavailable'
      }
    }

    try {
      const prompt = `Evaluate this CV content for ATS optimization and professional quality:

CV Content:
${JSON.stringify(cvData, null, 2)}

${jobDescription ? `Target Job Description:\n${jobDescription}\n\n` : ''}

Provide:
1. ATS Optimization Score (0-100)
2. Specific improvement recommendations
3. Missing keywords or skills
4. Content strength analysis
5. Formatting suggestions

Format as JSON with clear categories and actionable recommendations.`

      const completion = await client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an ATS expert and professional CV reviewer. Provide detailed, actionable feedback to improve CV performance. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })

      const evaluationText = completion.choices[0].message.content?.trim() || '{}'
      let evaluation: Record<string, unknown>

      try {
        evaluation = JSON.parse(evaluationText)
      } catch {
        evaluation = {
          rawEvaluation: evaluationText,
          requiresParsing: true
        }
      }

      return {
        success: true,
        evaluation,
        hasJobDescription: !!jobDescription
      }

    } catch (error) {
      console.error('CV evaluation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        evaluation: null
      }
    }
  }
}

export const aiService = new CVEnhancementService()
