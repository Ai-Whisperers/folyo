'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import {
  PaperAirplaneIcon,
  SparklesIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  type: 'question' | 'user_response' | 'ai_enhancement' | 'follow_up' | 'system'
  content: string
  metadata?: any
  timestamp: string
}

interface Enhancement {
  original: string
  enhanced: string
  alternatives?: Array<{
    version: number
    style: string
    content: string
  }>
}

interface Conversation {
  sessionId: string
  status: string
  currentSection: string
  overallProgress: number
  currentQuestion?: {
    questionId: string
    question: string
    type: string
    required: boolean
    status: string
  }
  messages: Message[]
}

interface AIConversationFlowProps {
  onComplete?: (cvData: any) => void
  initialJobDescription?: string
  targetRole?: string
}

export function AIConversationFlow({
  onComplete,
  initialJobDescription,
  targetRole
}: AIConversationFlowProps) {
  const { data: session } = useSession()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [currentInput, setCurrentInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEnhancement, setShowEnhancement] = useState<Enhancement | null>(null)
  const [pendingAnswer, setPendingAnswer] = useState('')
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  useEffect(() => {
    if ((session?.user as any)?.id) {
      startConversation()
    }
  }, [session])

  const startConversation = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/ai/conversation/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': (session?.user as any)?.id || ''
        },
        body: JSON.stringify({
          targetRole,
          jobDescription: initialJobDescription,
          experienceLevel: 'mid'
        })
      })

      const data = await response.json()

      if (data.success) {
        setConversation(data.conversation)
      } else {
        setError('Failed to start AI conversation')
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
      setError('Failed to start conversation')
    } finally {
      setIsLoading(false)
    }
  }

  const sendAnswer = async (answer: string, skipEnhancement = false) => {
    if (!conversation || !answer.trim()) return

    try {
      setIsLoading(true)
      setIsTyping(true)
      setPendingAnswer(answer)

      const response = await fetch(`/api/ai/conversation/${conversation.sessionId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': (session?.user as any)?.id || ''
        },
        body: JSON.stringify({
          answer: answer.trim(),
          skipEnhancement,
          requestAlternatives: true
        })
      })

      const data = await response.json()

      if (data.success) {
        setConversation(data.conversation)

        if (data.enhancement && !skipEnhancement) {
          setShowEnhancement(data.enhancement)
        }

        if (data.followUpQuestions && data.followUpQuestions.length > 0) {
          setFollowUpQuestions(data.followUpQuestions)
        }

        setCurrentInput('')
        setPendingAnswer('')
      } else {
        setError('Failed to send answer')
      }
    } catch (error) {
      console.error('Error sending answer:', error)
      setError('Failed to send answer')
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const acceptEnhancement = async () => {
    if (!conversation || !showEnhancement) return

    try {
      await moveToNextQuestion()
      setShowEnhancement(null)
      setFollowUpQuestions([])
    } catch (error) {
      console.error('Error accepting enhancement:', error)
    }
  }

  const rejectEnhancement = async () => {
    if (!conversation || !showEnhancement) return

    try {
      // Use original answer and move to next question
      await moveToNextQuestion()
      setShowEnhancement(null)
      setFollowUpQuestions([])
    } catch (error) {
      console.error('Error rejecting enhancement:', error)
    }
  }

  const moveToNextQuestion = async () => {
    if (!conversation) return

    try {
      const response = await fetch(`/api/ai/conversation/${conversation.sessionId}/next`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': (session?.user as any)?.id || ''
        }
      })

      const data = await response.json()

      if (data.success) {
        setConversation(data.conversation)

        if (data.isCompleted) {
          await completeConversation()
        }
      }
    } catch (error) {
      console.error('Error moving to next question:', error)
    }
  }

  const completeConversation = async () => {
    if (!conversation) return

    try {
      const response = await fetch(`/api/ai/conversation/${conversation.sessionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': (session?.user as any)?.id || ''
        }
      })

      const data = await response.json()

      if (data.success && onComplete) {
        onComplete(data.cv)
      }
    } catch (error) {
      console.error('Error completing conversation:', error)
    }
  }

  const answerFollowUp = (followUpQuestion: string) => {
    setCurrentInput(followUpQuestion)
    setFollowUpQuestions([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendAnswer(currentInput)
  }

  if (isLoading && !conversation) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Starting your AI CV conversation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Conversation Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => {
            setError(null)
            startConversation()
          }}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <CpuChipIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI CV Assistant</h2>
              <p className="text-primary-100 text-sm">
                {conversation?.currentSection && `${conversation.currentSection.charAt(0).toUpperCase() + conversation.currentSection.slice(1)} Section`}
              </p>
            </div>
          </div>

          {conversation && (
            <div className="text-right">
              <div className="text-white font-medium">{conversation.overallProgress}%</div>
              <div className="w-24 bg-white/20 rounded-full h-2 mt-1">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${conversation.overallProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {conversation?.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user_response' ? 'justify-end' : 'justify-start'
              }`}
          >
            <div className={`max-w-3xl ${message.type === 'user_response' ? 'ml-12' : 'mr-12'
              }`}>
              {message.type !== 'user_response' && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-primary-100 p-1.5 rounded-full">
                    <CpuChipIcon className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-600">AI Assistant</span>
                </div>
              )}

              <div className={`rounded-lg px-4 py-3 ${message.type === 'user_response'
                  ? 'bg-primary-600 text-white ml-auto'
                  : message.type === 'ai_enhancement'
                    ? 'bg-green-50 border border-green-200'
                    : message.type === 'follow_up'
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-gray-200'
                }`}>
                {message.type === 'ai_enhancement' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <SparklesIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">AI Enhanced</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{message.content}</div>

                {message.metadata?.originalInput && (
                  <details className="mt-3">
                    <summary className="text-sm text-gray-600 cursor-pointer">
                      View original response
                    </summary>
                    <div className="mt-2 p-3 bg-gray-100 rounded text-sm text-gray-700">
                      {message.metadata.originalInput}
                    </div>
                  </details>
                )}
              </div>

              {message.type !== 'user_response' && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Current Question */}
        {conversation?.currentQuestion && (
          <div className="flex justify-start">
            <div className="max-w-3xl mr-12">
              <div className="flex items-center space-x-2 mb-2">
                <div className="bg-primary-100 p-1.5 rounded-full">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm text-gray-600">AI Assistant</span>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <div className="whitespace-pre-wrap">{conversation.currentQuestion.question}</div>
                {conversation.currentQuestion.required && (
                  <div className="mt-2 text-xs text-red-600">* Required</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-600">AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhancement Modal */}
      {showEnhancement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <SparklesIcon className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">AI Enhanced Your Response</h3>
                  <p className="text-gray-600">Review the AI-enhanced version of your response</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Your Original Response:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                    {showEnhancement.original}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">AI Enhanced Version:</h4>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    {showEnhancement.enhanced}
                  </div>
                </div>

                {showEnhancement.alternatives && showEnhancement.alternatives.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Alternative Versions:</h4>
                    <div className="space-y-3">
                      {showEnhancement.alternatives.map((alt, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-800">
                              Version {alt.version} ({alt.style})
                            </span>
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                // Copy to clipboard
                                navigator.clipboard.writeText(alt.content)
                              }}
                            >
                              <DocumentDuplicateIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-gray-700">{alt.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={rejectEnhancement}
                  className="btn-secondary flex items-center"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Use Original
                </button>
                <button
                  onClick={acceptEnhancement}
                  className="btn-primary flex items-center"
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Use Enhanced
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Questions */}
      {followUpQuestions.length > 0 && !showEnhancement && (
        <div className="flex-shrink-0 bg-blue-50 border-t border-blue-200 px-6 py-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Quick follow-up questions:</h4>
          <div className="space-y-2">
            {followUpQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => answerFollowUp(question)}
                className="block w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 text-sm text-gray-700"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      {conversation?.currentQuestion && !showEnhancement && (
        <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your response here..."
              rows={3}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <div className="flex flex-col space-y-2">
              <button
                type="submit"
                disabled={isLoading || !currentInput.trim()}
                className="bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => sendAnswer(currentInput, true)}
                disabled={isLoading || !currentInput.trim()}
                className="bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send without AI enhancement"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      )}
    </div>
  )
}