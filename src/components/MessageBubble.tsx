import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { User, Bot, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '../App'

interface Props {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const copyAll = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const timeStr = message.timestamp instanceof Date
    ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '10px 0',
      flexDirection: isUser ? 'row-reverse' : 'row',
      animation: 'slide-in 0.2s ease',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 4,
        background: isUser ? 'rgba(0,212,255,0.12)' : 'rgba(123,47,255,0.12)',
        border: `1px solid ${isUser ? 'var(--accent-cyan)' : 'var(--accent-purple)'}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {isUser
          ? <User size={15} color="var(--accent-cyan)" />
          : <Bot size={15} color="var(--accent-purple)" />
        }
      </div>

      <div style={{
        maxWidth: '78%',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexDirection: isUser ? 'row-reverse' : 'row',
        }}>
          <span style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: isUser ? 'var(--accent-cyan)' : 'var(--accent-purple)',
            letterSpacing: '0.05em',
          }}>
            {isUser ? 'USER' : 'WORMGPT'}
          </span>
          {message.model && (
            <span style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              background: 'var(--bg-card)',
              padding: '1px 6px',
              borderRadius: 3,
              border: '1px solid var(--border)',
            }}>
              {message.model.split('/').pop()?.replace(':free', '')}
            </span>
          )}
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {timeStr}
          </span>
        </div>

        <div style={{
          background: isUser ? 'rgba(0,212,255,0.06)' : 'var(--bg-card)',
          border: `1px solid ${isUser ? 'rgba(0,212,255,0.2)' : 'var(--border)'}`,
          borderRadius: isUser ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
          padding: '10px 14px',
          position: 'relative',
          group: 'message',
        } as React.CSSProperties}>
          <button
            onClick={copyAll}
            title="Copy"
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              opacity: 0.5,
              padding: '2px 4px',
              borderRadius: 3,
              display: 'flex',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
          >
            {copied ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
          </button>

          {isUser ? (
            <pre style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.6,
              paddingRight: 20,
            }}>
              {message.content}
            </pre>
          ) : (
            <div className="prose" style={{ fontSize: 13, lineHeight: 1.7, paddingRight: 20 }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const inline = !match
                    return inline ? (
                      <code className={className} {...props}>{children}</code>
                    ) : (
                      <SyntaxHighlighter
                        style={oneLight as Record<string, React.CSSProperties>}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: '8px 0',
                          borderRadius: 4,
                          fontSize: 12,
                          border: '1px solid var(--border)',
                          background: '#f8f9fb',
                        }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    )
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
