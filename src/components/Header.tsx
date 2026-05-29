import { Menu, X, Trash2, Shield, Cpu } from 'lucide-react'

interface HeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onClear: () => void
  currentModel: string
  promptMode: number
}

const PROMPT_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: 'NO PERSONA', color: 'var(--text-muted)' },
  1: { label: 'MODE-1', color: 'var(--accent-cyan)' },
  2: { label: 'MODE-2', color: 'var(--accent-red)' },
}

export default function Header({ sidebarOpen, onToggleSidebar, onClear, currentModel, promptMode }: HeaderProps) {
  const prompt = PROMPT_LABELS[promptMode] ?? PROMPT_LABELS[0]
  const shortModel = currentModel.split('/').pop()?.replace(':free', '') ?? currentModel

  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-bright)',
      padding: '0 16px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexShrink: 0,
      position: 'relative',
      zIndex: 10,
    }}>
      <button
        onClick={onToggleSidebar}
        style={{
          background: 'none',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          padding: '6px 8px',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      <img src="/wns-logo.png" alt="WNS" style={{ height: 36, width: 'auto' }} />

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: 'var(--font-title)',
          fontSize: 16,
          fontWeight: 900,
          color: 'var(--accent-cyan)',
          letterSpacing: '0.12em',
        }}>
          WORM<span style={{ color: 'var(--accent-green)' }}>GPT</span>
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
          WORLD NETWORK SECURITY
        </span>
      </div>

      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 4,
        }}>
          <Cpu size={12} color="var(--text-muted)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
            {shortModel}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: 'var(--bg-card)',
          border: `1px solid ${prompt.color}44`,
          borderRadius: 4,
        }}>
          <Shield size={12} color={prompt.color} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: prompt.color }}>
            {prompt.label}
          </span>
        </div>

        <button
          onClick={onClear}
          title="Clear chat"
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            padding: '6px 8px',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-red)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-red)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
          }}
        >
          <Trash2 size={15} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src="/zyro-logo.png" alt="Zyro" style={{ height: 22, width: 'auto', opacity: 0.85 }} />
        </div>
      </div>
    </header>
  )
}
