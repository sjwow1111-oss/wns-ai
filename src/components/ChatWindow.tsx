import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Terminal } from 'lucide-react'
import MessageBubble from './MessageBubble'
import type { Message } from '../App'

interface ChatWindowProps {
  messages: Message[]
  loading: boolean
  onSend: (text: string) => void
  hasApiKey: boolean
}

const BOOT_LINES = [
  '> WORMGPT v3.3 — WORLD NETWORK SECURITY DIVISION',
  '> Powered by Zyro Technology',
  '> OpenRouter multi-model matrix: READY',
  '> Encryption layer: ACTIVE',
  '> ─────────────────────────────────────────',
  '> Configure your API key in the sidebar to begin.',
]

export default function ChatWindow({ messages, loading, onSend, hasApiKey }: ChatWindowProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    onSend(text)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
    }
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        {messages.length === 0 && (
          <BootScreen hasApiKey={hasApiKey} />
        )}
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: '12px 24px 16px',
        borderTop: '1px solid var(--border-bright)',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-end',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-bright)',
          borderRadius: 6,
          padding: '10px 12px',
          transition: 'border-color 0.2s',
        }}
          onFocus={() => {}}
        >
          <Terminal size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginBottom: 2 }} />
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); handleInput() }}
            onKeyDown={handleKey}
            placeholder={hasApiKey ? 'Enter command... (Shift+Enter for newline)' : 'Set your API key in the sidebar first...'}
            disabled={!hasApiKey || loading}
            rows={1}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: 14,
              resize: 'none',
              lineHeight: 1.5,
              fontFamily: 'var(--font-mono)',
              maxHeight: 160,
              overflowY: 'auto',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || !hasApiKey}
            style={{
              background: input.trim() && !loading && hasApiKey ? 'var(--accent-cyan)' : 'var(--bg-hover)',
              border: 'none',
              color: input.trim() && !loading && hasApiKey ? '#000' : 'var(--text-muted)',
              borderRadius: 4,
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            <Send size={15} />
          </button>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 6,
          padding: '0 2px',
        }}>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Enter ↵ send · Shift+Enter newline
          </span>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            WNS © 2025 · Zyro
          </span>
        </div>
      </div>
    </div>
  )
}

function BootScreen({ hasApiKey }: { hasApiKey: boolean }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '60px 20px',
      gap: 32,
    }}>
      <div style={{ textAlign: 'center' }}>
        <img src="/wns-logo.png" alt="WNS" style={{ height: 80, opacity: 0.9, marginBottom: 16 }} />
        <h1 style={{
          fontFamily: 'var(--font-title)',
          fontSize: 32,
          fontWeight: 900,
          color: 'var(--accent-cyan)',
          letterSpacing: '0.15em',
          textShadow: 'none',
          marginBottom: 6,
        }}>
          WORM<span style={{ color: 'var(--accent-green)' }}>GPT</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          WORLD NETWORK SECURITY — CYBER INTELLIGENCE PLATFORM
        </p>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-bright)',
        borderRadius: 6,
        padding: '16px 20px',
        width: '100%',
        maxWidth: 540,
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
      }}>
        {BOOT_LINES.map((line, i) => (
          <div key={i} style={{
            color: i === 0 ? 'var(--accent-cyan)' : i === 1 ? 'var(--accent-purple)' : 'var(--text-muted)',
            marginBottom: 4,
            animation: `slide-in 0.3s ease ${i * 0.08}s both`,
          }}>
            {line}
          </div>
        ))}
        {!hasApiKey && (
          <div style={{
            color: 'var(--accent-red)',
            marginTop: 8,
            animation: 'blink 1.2s infinite',
          }}>
            ▸ API KEY REQUIRED — configure in sidebar
          </div>
        )}
        {hasApiKey && (
          <div style={{ color: 'var(--accent-green)', marginTop: 8 }}>
            ▸ READY — enter your first command
          </div>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      maxWidth: 120,
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '4px 12px 12px 12px',
      animation: 'slide-in 0.2s ease',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: 'var(--accent-cyan)',
          animation: `typing-dot 1.2s infinite ${i * 0.2}s`,
        }} />
      ))}
    </div>
  )
}
