'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { authFetch } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type ChatRole = 'user' | 'assistant'

function RobotFace({ className, animate }: { className?: string; animate?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        <linearGradient id="robotShell" x1="20" y1="14" x2="86" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f8fbff" />
          <stop offset="0.5" stopColor="#c4d6ea" />
          <stop offset="1" stopColor="#7f9aba" />
        </linearGradient>
        <radialGradient id="robotFaceGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 45) rotate(90) scale(34)">
          <stop offset="0" stopColor="#b3f7ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#00d2ff" stopOpacity="0.1" />
        </radialGradient>
        <linearGradient id="visor" x1="30" y1="28" x2="70" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0a1f35" />
          <stop offset="1" stopColor="#15466d" />
        </linearGradient>
        <radialGradient id="eyeLight" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(38 42) rotate(90) scale(8)">
          <stop offset="0" stopColor="#bafcff" />
          <stop offset="1" stopColor="#1fd6ff" />
        </radialGradient>
      </defs>

      <ellipse cx="50" cy="90" rx="24" ry="6" fill="#0f2740" opacity="0.35" />
      <line x1="50" y1="8" x2="50" y2="18" stroke="#d6e4f3" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="6" r="4" fill="#c7f3ff" className={cn(animate && 'animate-pulse')} />

      <rect x="20" y="18" width="60" height="66" rx="16" fill="url(#robotShell)" />
      <rect x="20" y="18" width="60" height="66" rx="16" fill="url(#robotFaceGlow)" />
      <rect x="20" y="18" width="60" height="66" rx="16" stroke="#ebf4ff" strokeWidth="2.5" />

      <rect x="29" y="29" width="42" height="26" rx="10" fill="url(#visor)" />
      <rect x="29" y="29" width="42" height="26" rx="10" stroke="#4ea8d8" strokeWidth="1.5" opacity="0.8" />

      <circle cx="38" cy="42" r="6" fill="url(#eyeLight)" className={cn(animate && 'animate-pulse')} />
      <circle cx="62" cy="42" r="6" fill="url(#eyeLight)" className={cn(animate && 'animate-pulse')} />
      <circle cx="40" cy="40" r="1.8" fill="#e7fdff" />
      <circle cx="64" cy="40" r="1.8" fill="#e7fdff" />

      <rect x="33" y="61" width="34" height="8" rx="4" fill="#1d4d77" opacity="0.85" />
      <circle cx="38" cy="65" r="1.2" fill="#8fe8ff" />
      <circle cx="44" cy="65" r="1.2" fill="#8fe8ff" />
      <circle cx="50" cy="65" r="1.2" fill="#8fe8ff" />
      <circle cx="56" cy="65" r="1.2" fill="#8fe8ff" />
      <circle cx="62" cy="65" r="1.2" fill="#8fe8ff" />

      <path d="M24 23c9 4 43 4 52 0" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

interface ChatMessage {
  id: string
  role: ChatRole
  text: string
}

interface ChatbotApiResponse {
  success: boolean
  data: {
    answer: string
    sources: Array<{
      id: string
      topic: string
      question: string
    }>
    usedGemini: boolean
    knowledgeBaseSize: number
  }
}

const starterPrompts = [
  'How does CourseHive roadmap generation work?',
  'How can I improve my ATS score in resume analysis?',
  'How does XP and leaderboard ranking work?',
]

export function DashboardChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hey! I am your CourseHive assistant. Ask me anything about onboarding, interests, courses, projects, resume analysis, leaderboard, or how to use the dashboard.",
    },
  ])
  const [kbCount, setKbCount] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const canSend = useMemo(() => input.trim().length >= 2 && !loading, [input, loading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const sendMessage = async (questionOverride?: string) => {
    const message = (questionOverride ?? input).trim()
    if (message.length < 2 || loading) return

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await authFetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, maxResults: 5 }),
      })

      const payload = (await response.json()) as ChatbotApiResponse
      if (!response.ok || !payload.success) {
        throw new Error('Could not get chatbot response.')
      }

      setKbCount(payload.data.knowledgeBaseSize)
      const topics = payload.data.sources
        .slice(0, 3)
        .map((source) => source.topic)
        .join(', ')

      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: `${payload.data.answer}${
          topics ? `\n\nSources: ${topics}` : ''
        }`,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          text: 'Sorry, I could not process that right now. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'fixed bottom-6 right-6 z-50 group',
          'w-20 h-20 rounded-full',
          'shadow-[0_18px_45px_rgba(8,24,45,0.45)]',
          'transition-all duration-300 ease-out',
          'hover:scale-105 active:scale-95'
        )}
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
      >
        <span className="absolute -inset-1 rounded-full bg-[conic-gradient(from_120deg,#172b44,#f97316,#172b44)] opacity-70 blur-md transition-opacity duration-300 group-hover:opacity-100" />
        <span
          className={cn(
            'absolute inset-0 rounded-full border transition-colors duration-300',
            open ? 'border-accent/70' : 'border-border/'
          )}
        />
        <span
          className={cn(
            'relative z-10 grid h-full w-full place-items-center rounded-full',
            'bg-[radial-gradient(circle_at_28%_26%,#294f73_0%,#172b44_42%,#112033_100%)]',
            'transition-transform duration-300',
            open ? 'rotate-6' : 'group-hover:-rotate-6'
          )}
          style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
        >
          <RobotFace className="h-14 w-14 drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)]" animate={loading || !open} />
        </span>
      </button>

      {/* Chatbot Window */}
      {open && (
        <div
          className={cn(
            'fixed bottom-24 right-6 z-50',
            'w-[min(94vw,26rem)] h-[min(72vh,36rem)]',
            'rounded-3xl border border-border bg-card/95 text-card-foreground backdrop-blur-xl',
            'shadow-[0_25px_70px_rgba(15,23,42,0.35)] overflow-hidden',
            'flex flex-col',
            'animate-in slide-in-from-bottom-4 fade-in duration-300'
          )}
        >
          <div className="pointer-events-none absolute -left-10 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-14 h-40 w-40 rounded-full bg-accent/15 blur-3xl" />

          {/* Header */}
          <div className="relative px-5 py-4 border-b border-border bg-linear-to-r from-primary via-primary to-[#203b59] text-primary-foreground flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-card/50 backdrop-blur-sm flex items-center justify-center border-2 border-border/ shadow-lg">
                <RobotFace className="w-10 h-10 text-white" animate={loading} />
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide">CourseHive AI</p>
                <p className="text-[10px] text-primary-foreground/70 font-medium">Knowledge Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full bg-card/50 backdrop-blur-sm border border-border/">
                <p className="text-[10px] font-semibold text-primary-foreground/90">
                  {kbCount ? `${kbCount}+` : '240+'} FAQs
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area - Fixed scrolling */}
          <div 
            ref={scrollContainerRef}
            className="relative flex-1 overflow-y-auto overflow-x-hidden p-4"
            style={{ 
              scrollBehavior: 'smooth',
              overscrollBehavior: 'contain'
            }}
          >
            <div className="space-y-3 min-h-full">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.role === 'assistant' ? 'justify-start' : 'justify-end',
                    'animate-in fade-in slide-in-from-bottom-2 duration-300'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                      'shadow-sm transition-all duration-200',
                      message.role === 'assistant'
                        ? 'bg-linear-to-br from-background to-secondary text-foreground rounded-tl-sm border border-border'
                        : 'bg-linear-to-br from-accent via-[#ef7a1f] to-[#e06300] text-accent-foreground rounded-tr-sm shadow-[0_8px_20px_rgba(249,115,22,0.28)]'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="inline-flex items-center gap-2.5 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm bg-linear-to-br from-background to-secondary text-muted-foreground border border-border shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span className="font-medium">Thinking...</span>
                  </div>
                </div>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </div>

          {/* Input Area */}
          <div className="px-4 pb-4 pt-3 bg-linear-to-t from-secondary/70 to-transparent border-t border-border shrink-0">
            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 mb-3">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className={cn(
                    'text-[11px] px-3 py-1.5 rounded-full',
                    'bg-background hover:bg-secondary text-foreground',
                    'border border-border hover:border-accent/50',
                    'transition-all duration-200 hover:scale-105',
                    'shadow-sm hover:shadow-md',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                  )}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && canSend) {
                      event.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask anything about this project..."
                  className="h-11 bg-background border-border focus-visible:ring-accent/40 focus-visible:border-accent pr-3 rounded-xl shadow-sm"
                />
              </div>
              <Button
                onClick={() => sendMessage()}
                disabled={!canSend}
                className={cn(
                  'h-11 w-11 p-0 rounded-xl',
                  'bg-linear-to-br from-accent to-[#ea6c0a]',
                  'hover:from-[#ea6c0a] hover:to-[#d65a00]',
                  'shadow-lg shadow-[rgba(249,115,22,0.3)] hover:shadow-xl',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'hover:scale-105 active:scale-95'
                )}
                aria-label="Send message"
              >
                <Send className="w-4.5 h-4.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

