const OpenAI = require('openai')

// Make OpenAI optional - only initialize if API key is present
let openai = null
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

// CV Section Enhancement Prompts
const ENHANCEMENT_PROMPTS = {
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

  summary: `You are a professional CV writer. Transform the user's casual self-description into a compelling professional summary.

Guidelines:
- Create a powerful opening statement
- Highlight key strengths and experience
- Include relevant keywords for ATS optimization
- Keep it concise (3-4 sentences maximum)
- Focus on value proposition
- Use professional tone without being robotic

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

Enhanced professional version:`
}

// Follow-up Question Generation
const FOLLOWUP_PROMPTS = {
  general: `Based on the user's response about their {section}, generate 1-2 intelligent follow-up questions that will help gather more specific and valuable information for their CV.

User's response: "{userInput}"

Guidelines:
- Ask for specific metrics, numbers, or quantifiable results
- Probe for additional responsibilities or achievements
- Ask about tools, technologies, or methodologies used
- Inquire about team size, budget, or scope if relevant
- Keep questions conversational and encouraging

Generate follow-up questions:`,

  missing_info: `Analyze the user's response and identify what key information is missing that would make their CV stronger.

User's response about {section}: "{userInput}"

Generate 1-2 questions to gather missing critical information:`,
}

class CVEnhancementService {
  constructor() {
    this.model = process.env.OPENAI_MODEL || 'gpt-4'
    this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '2000')
  }

  /**
   * Enhance user input for a specific CV section
   */
  async enhanceContent(userInput, section, context = {}) {
    // Return original content if OpenAI is not configured
    if (!openai) {
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

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert CV writer and career coach. Provide professional, ATS-optimized content that helps users stand out to recruiters and hiring managers.'
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

      return {
        success: true,
        original: userInput,
        enhanced: completion.choices[0].message.content.trim(),
        section,
        usage: completion.usage
      }

    } catch (error) {
      console.error('OpenAI enhancement error:', error)
      return {
        success: false,
        error: error.message,
        original: userInput,
        enhanced: userInput, // Fallback to original
        section
      }
    }
  }

  /**
   * Generate intelligent follow-up questions
   */
  async generateFollowUpQuestions(userInput, section, context = {}) {
    // Return empty questions if OpenAI is not configured
    if (!openai) {
      return {
        success: true,
        questions: [],
        section,
        originalInput: userInput,
        note: 'OpenAI not configured - no follow-up questions generated'
      }
    }

    try {
      const prompt = FOLLOWUP_PROMPTS.general
        .replace('{section}', section)
        .replace('{userInput}', userInput)

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a skilled interviewer and CV coach. Generate thoughtful follow-up questions that help users provide more detailed and valuable information for their CV.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.8
      })

      const questionsText = completion.choices[0].message.content.trim()
      const questions = questionsText
        .split('\n')
        .filter(q => q.trim().length > 0 && q.includes('?'))
        .map(q => q.replace(/^\d+\.\s*/, '').trim())

      return {
        success: true,
        questions,
        section,
        originalInput: userInput
      }

    } catch (error) {
      console.error('OpenAI follow-up questions error:', error)
      return {
        success: false,
        error: error.message,
        questions: [],
        section
      }
    }
  }

  /**
   * Analyze job description and extract key requirements
   */
  async analyzeJobDescription(jobDescription) {
    // Return null analysis if OpenAI is not configured
    if (!openai) {
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

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert recruiter and ATS specialist. Extract and categorize key requirements from job descriptions to help optimize CVs.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })

      const analysisText = completion.choices[0].message.content.trim()
      let analysis

      try {
        // Try to parse as JSON
        analysis = JSON.parse(analysisText)
      } catch (parseError) {
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
        error: error.message,
        analysis: null
      }
    }
  }

  /**
   * Generate multiple alternative versions of enhanced content
   */
  async generateAlternatives(userInput, section, count = 3) {
    // Return original content as single alternative if OpenAI is not configured
    if (!openai) {
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

          const prompt = `${ENHANCEMENT_PROMPTS[section].replace('{userInput}', userInput)}

Style: Make this version ${variation}.`

          const completion = await openai.chat.completions.create({
            model: this.model,
            messages: [
              {
                role: 'system',
                content: `You are an expert CV writer. Create different stylistic approaches while maintaining professionalism and ATS optimization.`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: this.maxTokens,
            temperature: 0.7 + (index * 0.1) // Slight temperature variation
          })

          return {
            version: index + 1,
            style: variation,
            content: completion.choices[0].message.content.trim()
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
        error: error.message,
        alternatives: [],
        section
      }
    }
  }

  /**
   * Evaluate CV content and provide ATS score and recommendations
   */
  async evaluateContent(cvData, jobDescription = null) {
    // Return null evaluation if OpenAI is not configured
    if (!openai) {
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

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an ATS expert and professional CV reviewer. Provide detailed, actionable feedback to improve CV performance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })

      const evaluationText = completion.choices[0].message.content.trim()
      let evaluation

      try {
        evaluation = JSON.parse(evaluationText)
      } catch (parseError) {
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
        error: error.message,
        evaluation: null
      }
    }
  }
}

module.exports = { CVEnhancementService, ENHANCEMENT_PROMPTS }