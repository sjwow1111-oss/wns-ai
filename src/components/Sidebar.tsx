import { ChevronDown, Shield, Zap } from 'lucide-react'
import type { Config } from '../App'

interface SidebarProps {
  config: Config
  models: string[]
  onChange: (c: Config) => void
  serverKeyConfigured: boolean
}

const PROMPT_MODES = [
  { value: 0, label: 'None', desc: 'No system prompt', color: 'var(--text-muted)' },
  { value: 1, label: 'Mode 1', desc: 'system-prompt-1.txt', color: 'var(--accent-cyan)' },
  { value: 2, label: 'Mode 2', desc: 'system-prompt-2.txt', color: 'var(--accent-purple)' },
]

export default function Sidebar({ config, models, onChange, serverKeyConfigured }: SidebarProps) {
  const update = (patch: Partial<Config>) => onChange({ ...config, ...patch })

  return (
    <aside style={{
      width: 260,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      flexShrink: 0,
      overflowY: 'auto',
    }}>
      <SectionHeader icon={<Zap size={13} />} title="MODEL" />
      <div style={{ padding: '10px 14px 14px' }}>
        <div style={{ position: 'relative' }}>
          <select
            value={config.model}
            onChange={e => update({ model: e.target.value })}
            style={{
              width: '100%',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '8px 28px 8px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              appearance: 'none',
              cursor: 'pointer',
            }}
          >
            {models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }} />
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5, fontFamily: 'var(--font-mono)' }}>
          via OpenRouter
        </p>
      </div>

      <SectionHeader icon={<Shield size={13} />} title="PERSONA MODE" />
      <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {PROMPT_MODES.map(mode => (
          <button
            key={mode.value}
            onClick={() => update({ systemPromptMode: mode.value })}
            style={{
              background: config.systemPromptMode === mode.value ? `${mode.color}18` : 'var(--bg-primary)',
              border: `1px solid ${config.systemPromptMode === mode.value ? mode.color : 'var(--border)'}`,
              borderRadius: 4,
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textAlign: 'left',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: config.systemPromptMode === mode.value ? mode.color : 'var(--text-muted)',
              flexShrink: 0,
              boxShadow: config.systemPromptMode === mode.value ? `0 0 6px ${mode.color}` : 'none',
            }} />
            <div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: config.systemPromptMode === mode.value ? mode.color : 'var(--text-secondary)' }}>
                {mode.label}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{mode.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', padding: 14, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: serverKeyConfigured ? 'var(--accent-green)' : 'var(--accent-red)',
              boxShadow: serverKeyConfigured ? '0 0 6px var(--accent-green)' : 'none',
              animation: serverKeyConfigured ? 'pulse-glow 2s infinite' : 'none',
            }} />
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {serverKeyConfigured ? 'API KEY ACTIVE' : 'API KEY MISSING'}
            </span>
          </div>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            POWERED BY <span style={{ color: 'var(--accent-cyan)' }}>ZYRO</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{
      padding: '10px 14px 6px',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    }}>
      <span style={{ color: 'var(--accent-cyan)' }}>{icon}</span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-muted)',
        letterSpacing: '0.15em',
      }}>{title}</span>
    </div>
  )
}
