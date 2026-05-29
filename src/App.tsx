import { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  model?: string
}

export interface Config {
  apiKey: string
  model: string
  systemPromptMode: number
}

function App() {
  const VALID_MODELS = [
    'google/gemma-4-31b-it:free',
    'moonshotai/kimi-k2.6:free',
  ]

  const [config, setConfig] = useState<Config>(() => {
    const saved = localStorage.getItem('wns_config')
    const parsed = saved ? JSON.parse(saved) : null
    const model = parsed?.model && VALID_MODELS.includes(parsed.model)
      ? parsed.model
      : VALID_MODELS[0]
    return {
      apiKey: parsed?.apiKey ?? '',
      model,
      systemPromptMode: parsed?.systemPromptMode ?? 0,
    }
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [models, setModels] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [serverKeyConfigured, setServerKeyConfigured] = useState(false)

  useEffect(() => {
    fetch('/api/models')
      .then(r => r.json())
      .then(d => setModels(d.models))
      .catch(() => {})

    fetch('/api/server-key-status')
      .then(r => r.json())
      .then(d => setServerKeyConfigured(d.configured))
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('wns_config', JSON.stringify(config))
  }, [config])

  const isReady = serverKeyConfigured || !!config.apiKey

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          model: config.model,
          api_key: config.apiKey || null,
          system_prompt_mode: config.systemPromptMode,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'API Error')
      }

      const data = await res.json()
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        model: data.model,
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (e: unknown) {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `\`\`\`\nERROR: ${e instanceof Error ? e.message : String(e)}\n\`\`\``,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => setMessages([])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)' }}>
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onClear={clearChat}
        currentModel={config.model}
        promptMode={config.systemPromptMode}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {sidebarOpen && (
          <Sidebar
            config={config}
            models={models}
            onChange={setConfig}
            serverKeyConfigured={serverKeyConfigured}
          />
        )}
        <ChatWindow
          messages={messages}
          loading={loading}
          onSend={sendMessage}
          hasApiKey={isReady}
          serverKeyConfigured={serverKeyConfigured}
        />
      </div>
    </div>
  )
}

export default App
