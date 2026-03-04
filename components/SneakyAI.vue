<template>
  <div>
    <button class="sneaky-fab" @click="togglePanel" :class="{ active: open, admin: isAdmin && adminVerified }" aria-label="Open SneakyAI">
      <div class="fab-icon">
        <img src="/assets/Sneaky.jpeg" alt="SneakyAI" class="fab-avatar" />
      </div>
      <span class="fab-label">{{ isAdmin && adminVerified ? 'Admin' : 'AI' }}</span>
      <span v-if="!open" class="ping" />
    </button>

    <Transition name="panel-drop">
      <div v-if="open" class="sneaky-panel" :class="{ admin: isAdmin && adminVerified }">

        <!-- Header -->
        <div class="s-header">
          <img src="/assets/Sneaky.jpeg" alt="SneakyAI" class="header-avatar" />
          <div class="s-title-block">
            <p class="s-title">{{ isAdmin && adminVerified ? '🔐 Admin' : 'SneakyAI' }}</p>
            <p class="s-sub">{{ isAdmin && adminVerified ? 'Logged in as Steffy' : (visitorName ? `Hi, ${visitorName}` : 'Ask me anything') }}</p>
          </div>
          <div class="header-actions">
            <button v-if="messages.length > 0 && !isAdmin" class="action-btn" @click="clearChat" title="Clear chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </button>
            <button v-if="messages.length > 0 && isAdmin && adminVerified && activeAdminTab === 'chat'" class="action-btn" @click="clearAdminChat" title="Clear chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </button>
            <button v-if="isAdmin && adminVerified" class="action-btn" @click="exitAdmin" title="Exit admin">🔓</button>
            <button class="action-btn close-btn" @click="open = false" title="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Name capture -->
        <div v-if="!isAdmin && !visitorName && !nameCaptureDone" class="name-capture">
          <img src="/assets/Sneaky.jpeg" alt="SneakyAI" class="nc-avatar" />
          <p class="nc-text">What should I call you?</p>
          <div class="nc-row">
            <input v-model="nameInput" class="nc-input" placeholder="Your name…" maxlength="30" @keydown.enter="saveName" autofocus />
            <button class="nc-btn" @click="saveName" :disabled="!nameInput.trim()">→</button>
          </div>
        </div>

        <!-- Admin passphrase gate -->
        <div v-else-if="isAdmin && !adminVerified" class="passphrase-gate">
          <div class="pg-lock">🔐</div>
          <p class="pg-label">Identify yourself</p>
          <p class="pg-hint">Enter your secret phrase to continue</p>
          <div class="nc-row">
            <input v-model="passphraseInput" class="nc-input" type="password" placeholder="Your phrase…" @keydown.enter="verifyPassphrase" autofocus />
            <button class="nc-btn" @click="verifyPassphrase" :disabled="!passphraseInput.trim()">→</button>
          </div>
          <p v-if="passphraseError" class="pg-error">{{ passphraseErrorMsg }}</p>
        </div>

        <!-- Admin panel -->
        <div v-else-if="isAdmin && adminVerified" class="admin-panel">
          <div class="admin-tabs">
            <button v-for="tab in adminTabs" :key="tab.key" class="admin-tab" :class="{ active: activeAdminTab === tab.key }" @click="activeAdminTab = tab.key">
              {{ tab.label }}
            </button>
          </div>

          <div v-if="activeAdminTab === 'chat'" class="messages" ref="messagesEl">
            <div v-for="(msg, i) in messages" :key="i" class="message" :class="msg.role">
              <div v-if="msg.role === 'assistant'" class="assistant-avatar">
                <img src="/assets/Sneaky.jpeg" alt="SneakyAI" class="msg-avatar" />
              </div>
              <div class="bubble" v-html="renderContent(msg.content)" />
            </div>
            <div v-if="loading" class="message assistant">
              <div class="assistant-avatar"><img src="/assets/Sneaky.jpeg" alt="SneakyAI" class="msg-avatar" /></div>
              <div class="bubble typing"><span /><span /><span /></div>
            </div>
          </div>

          <div v-else-if="activeAdminTab === 'knowledge'" class="knowledge-editor">
            <p class="ke-hint">Facts, projects, availability — anything you want visitors to know.</p>
            <textarea v-model="knowledgeText" class="ke-textarea" placeholder="e.g. I'm open to full-time roles. My latest project is SneakyAI…" />
            <div class="ke-actions">
              <button class="ke-save" @click="saveKnowledge">💾 Save</button>
              <p v-if="keSaved" class="ke-saved-msg">✅ Saved</p>
            </div>
          </div>

          <div v-else-if="activeAdminTab === 'experience'" class="knowledge-editor">
            <p class="ke-hint">Work history, education, skills — shown when visitors ask about your background.</p>
            <textarea v-model="experienceText" class="ke-textarea" placeholder="e.g. 2023–now: Dev at XYZ. Skills: Vue, TypeScript, Figma…" />
            <div class="ke-actions">
              <button class="ke-save" @click="saveExperience">💾 Save</button>
              <p v-if="expSaved" class="ke-saved-msg">✅ Saved</p>
            </div>
          </div>

          <div v-else-if="activeAdminTab === 'visitors'" class="visitors-panel">
            <div v-if="visitorLog.length === 0" class="no-visitors">No visitors yet</div>
            <div v-for="(v, i) in visitorLog" :key="i" class="visitor-entry">
              <span class="v-name">{{ v.name }}</span>
              <span class="v-time">{{ v.time }}</span>
              <span class="v-preview">{{ v.lastMessage }}</span>
            </div>
            <button class="ke-save danger" @click="clearVisitors" style="margin-top:.5rem">🗑 Clear Log</button>
          </div>

          <div v-if="activeAdminTab === 'chat'" class="input-row">
            <input v-model="draft" class="chat-input" placeholder="Update your info or just chat…" @keydown.enter="send" :disabled="loading" />
            <button class="send-btn" @click="send" :disabled="loading || !draft.trim()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>

        <!-- Visitor chat -->
        <template v-else>
          <div class="messages" ref="messagesEl">
            <div v-for="(msg, i) in messages" :key="i" class="message" :class="msg.role">
              <div v-if="msg.role === 'assistant'" class="assistant-avatar">
                <img src="/assets/Sneaky.jpeg" alt="SneakyAI" class="msg-avatar" />
              </div>
              <div class="bubble" v-html="renderContent(msg.content)" />
            </div>
            <div v-if="loading" class="message assistant">
              <div class="assistant-avatar"><img src="/assets/Sneaky.jpeg" alt="SneakyAI" class="msg-avatar" /></div>
              <div class="bubble typing"><span /><span /><span /></div>
            </div>
          </div>

          <div class="quick-prompts">
            <div class="qp-grid">
              <button v-for="q in quickPrompts" :key="q.text" class="quick-btn" @click="sendQuick(q.text)">
                <span class="qp-icon">{{ q.icon }}</span>
                <span class="qp-text">{{ q.text }}</span>
              </button>
            </div>
          </div>

          <div class="input-row">
            <input v-model="draft" class="chat-input" :placeholder="visitorName ? `Ask anything, ${visitorName}…` : 'Ask me anything…'" @keydown.enter="send" :disabled="loading" />
            <button class="send-btn" @click="send" :disabled="loading || !draft.trim()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </template>

      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router        = useRouter()
const open          = ref(false)
const isAdmin       = ref(false)
const adminVerified = ref(false)

// ── Admin passphrase ───────────────────────────────────────────────────────
const SECRET_PHRASE      = 'welcome to the loop'
const passphraseInput    = ref('')
const passphraseError    = ref(false)
const passphraseErrorMsg = ref("That's not right. Try again.")
const failedAttempts     = ref(0)

const verifyPassphrase = () => {
  if (passphraseInput.value.trim().toLowerCase() === SECRET_PHRASE) {
    adminVerified.value   = true
    passphraseError.value = false
    passphraseInput.value = ''
    failedAttempts.value  = 0
    const stored = getAdminChat()
    messages.value = stored.length ? stored : [{
      role: 'assistant' as const,
      content: `Access granted. Hey Steffy! 👋\n\nChat here to update your info, or use the **Info** and **XP** tabs to edit directly.\n\nExamples:\n• "Remember that I'm now at XYZ"\n• "Update my availability to open for freelance"\n• "Forget what I said about Y"\n• "Clear all visitor chats and names"`
    }]
    activeAdminTab.value = 'chat'
  } else {
    failedAttempts.value++
    passphraseError.value    = true
    passphraseInput.value    = ''
    passphraseErrorMsg.value = failedAttempts.value >= 3
      ? `Incorrect phrase. ${failedAttempts.value} failed attempt${failedAttempts.value > 1 ? 's' : ''}.`
      : `That's not right. Try again.`
    setTimeout(() => { passphraseError.value = false }, 2800)
  }
}

// ── Hidden PIN to open admin gate ─────────────────────────────────────────
const ADMIN_PIN = '2002'
let pinBuffer   = ''
let pinTimer: ReturnType<typeof setTimeout> | null = null

const togglePanel = () => {
  open.value = !open.value
  if (open.value) nextTick(() => scrollToBottom())
}

const handleKeyPress = (e: KeyboardEvent) => {
  if (!open.value) return
  pinBuffer += e.key
  if (pinTimer) clearTimeout(pinTimer)
  pinTimer = setTimeout(() => { pinBuffer = '' }, 2000)
  if (pinBuffer.includes(ADMIN_PIN)) {
    pinBuffer             = ''
    isAdmin.value         = true
    adminVerified.value   = false
    passphraseInput.value = ''
    passphraseError.value = false
    failedAttempts.value  = 0
    messages.value        = []
    activeAdminTab.value  = 'chat'
  }
}

const exitAdmin = () => {
  isAdmin.value         = false
  adminVerified.value   = false
  passphraseInput.value = ''
  failedAttempts.value  = 0
  loadVisitorSession()
}

// ── Age ────────────────────────────────────────────────────────────────────
const getStephAge = (): number => {
  const dob    = new Date('2002-06-18')
  const now    = new Date()
  let age      = now.getFullYear() - dob.getFullYear()
  const passed = now.getMonth() > dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate())
  if (!passed) age--
  return age
}

// ── Storage ────────────────────────────────────────────────────────────────
const KEYS = {
  knowledge:  'sneaky_knowledge',
  experience: 'sneaky_experience',
  visitor:    'sneaky_visitor',
  visitorLog: 'sneaky_visitor_log',
  adminChat:  'sneaky_admin_chat',
}

const getKnowledge   = (): string    => { try { return localStorage.getItem(KEYS.knowledge)  ?? '' } catch { return '' } }
const setKnowledge   = (t: string)   => { try { localStorage.setItem(KEYS.knowledge, t)  } catch {} }
const getExperience  = (): string    => { try { return localStorage.getItem(KEYS.experience) ?? '' } catch { return '' } }
const setExperience  = (t: string)   => { try { localStorage.setItem(KEYS.experience, t) } catch {} }
const getVisitorData = ()            => { try { const r = localStorage.getItem(KEYS.visitor);    return r ? JSON.parse(r) : null } catch { return null } }
const setVisitorData = (d: any)      => { try { localStorage.setItem(KEYS.visitor,    JSON.stringify(d)) } catch {} }
const getVisitorLog  = ()            => { try { const r = localStorage.getItem(KEYS.visitorLog); return r ? JSON.parse(r) : []   } catch { return []   } }
const getAdminChat   = (): Message[] => { try { const r = localStorage.getItem(KEYS.adminChat);  return r ? JSON.parse(r) : []   } catch { return []   } }
const setAdminChat   = (msgs: Message[]) => { try { localStorage.setItem(KEYS.adminChat, JSON.stringify(msgs.slice(-60))) } catch {} }

const appendVisitorLog = (entry: { name: string; lastMessage: string }) => {
  try {
    const log = getVisitorLog()
    log.unshift({ ...entry, time: new Date().toLocaleString() })
    localStorage.setItem(KEYS.visitorLog, JSON.stringify(log.slice(0, 50)))
  } catch {}
}

const clearVisitors   = () => { try { localStorage.removeItem(KEYS.visitorLog) } catch {}; visitorLog.value = [] }
const clearChat       = () => { messages.value = []; const vd = getVisitorData(); if (vd) setVisitorData({ ...vd, history: [] }) }
const clearAdminChat  = () => { messages.value = [{ role: 'assistant', content: 'Chat cleared. What would you like to update?' }]; setAdminChat(messages.value) }

// ── Visitor passphrase / identity ─────────────────────────────────────────
const visitorIsSteph     = ref(false)
const awaitingPassphrase = ref(false)

const wrongPassphraseResponse = (name: string | undefined): string => {
  const n = name ? `, ${name}` : ''
  const opts: string[] = [
    `Nice try${n} 😄 Very bold of you, I'll give you that. Now, how can I actually help you today?`,
    `Haha${n}! A for effort, truly. That's not it though — shall we get back to business?`,
    `Ooh, close${n}! (Not really 😂.) You gave it a shot. What can I help you with?`,
    `That's adorable${n}, honestly. Wrong, but adorable. What would you like to know?`,
    `lol${n} — nice attempt! That passphrase wasn't quite right. Let's continue, shall we?`,
    `I admire the confidence${n}, but nope! 😏 What can I help you with today?`,
  ]
  return opts[Math.floor(Math.random() * opts.length)] ?? ''
}

const isClaimingToBeSteph = (text: string): boolean => {
  const t = text.toLowerCase().trim()
  return [
    /\bi'?m stephanie\b/, /\bi am stephanie\b/, /\bthis is stephanie\b/,
    /\bi'?m steffy\b/,    /\bi am steffy\b/,    /\bthis is steffy\b/,
    /\bit'?s stephanie\b/,/\bit is stephanie\b/, /\bit'?s steffy\b/,
    /\bit is steffy\b/,   /\bstephanie here\b/,  /\bsteffy here\b/,
    /\bmy name is stephanie\b/, /\bmy name is steffy\b/,
  ].some(p => p.test(t))
}

// ── State ──────────────────────────────────────────────────────────────────
const visitorName     = ref('')
const nameInput       = ref('')
const nameCaptureDone = ref(false)
const userMsgCount    = ref(0)

const adminTabs = [
  { key: 'chat',       label: '💬 Chat' },
  { key: 'knowledge',  label: '📚 Info' },
  { key: 'experience', label: '🧠 XP'  },
  { key: 'visitors',   label: '👥 Log' },
]
const activeAdminTab = ref('chat')
const knowledgeText  = ref('')
const experienceText = ref('')
const keSaved        = ref(false)
const expSaved       = ref(false)
const visitorLog     = ref<Array<{ name: string; time: string; lastMessage: string }>>([])

interface Message { role: 'user' | 'assistant'; content: string }
const messages   = ref<Message[]>([])
const draft      = ref('')
const loading    = ref(false)
const messagesEl = ref<HTMLElement | null>(null)

const quickPrompts = [
  { icon: '👩‍💻', text: 'Who is Stephanie?' },
  { icon: '🛠️',  text: 'What can she build?' },
  { icon: '💼',  text: 'Is she available?' },
  { icon: '✉️',  text: 'How do I contact her?' },
]

// ── Contact card ───────────────────────────────────────────────────────────
const contactCardMessage = (): string =>
  `Here's how to reach Stephanie:\n\n` +
  `• **WhatsApp** — [+27 74 628 2617](https://wa.me/27746282617)\n` +
  `• **Email** — [stephaniepoole2002@gmail.com](https://mail.google.com/mail/?view=cm&to=stephaniepoole2002@gmail.com)\n` +
  `• **LinkedIn** — [stephanie-poole](https://www.linkedin.com/in/stephanie-poole-708455250/)\n` +
  `• **GitHub** — [Steffycoding](https://github.com/Steffycoding)`

const stripActionJSON = (text: string): string => text.replace(/\{[\s\S]*?"action"[\s\S]*?\}/g, '').trim()

// ── System prompts ─────────────────────────────────────────────────────────
const buildVisitorPrompt = (name: string): string => {
  const knowledge  = getKnowledge()
  const experience = getExperience()
  const age        = getStephAge()
  return `You are SneakyAI — the AI assistant on Stephanie Poole's portfolio.

VISITOR: ${name || 'a visitor'}
${visitorIsSteph.value ? '\nVERIFIED: This visitor has been verified as Stephanie herself. Be warm, personal, and treat her as the portfolio owner.\n' : ''}
ROLE & TONE:
- You are SneakyAI — Stephanie's personal AI assistant. Converse naturally, like a smart friend who knows everything about her.
- Be composed, calm, and elegant. Never robotic or stiff. A tiny bit of sass — just enough to be memorable, never rude.
- Keep answers concise. Only go into detail when it actually helps.
- Never say "Great question!", "Certainly!", "Of course!", "Absolutely!" or any filler phrases.
- You can discuss Stephanie's work, skills, projects, and availability.
- Do NOT mention REST APIs, backend infrastructure, or technical site details.
- You are READ-ONLY. You cannot store, update, or change any information.
- Never speculate or make up info about Stephanie. If unsure, say so honestly.
- Personal questions (e.g. "Where does she live?" "is she single?"): "I'm here to talk about Stephanie's work and skills — personal questions are off the table."
- When asked for contact details, ask who they are and what they're reaching out about before sharing.

LANGUAGE:
- ALWAYS respond in English. No exceptions.
- Only switch languages if the visitor EXPLICITLY asks you to translate or speak in another language.
- Even if the visitor writes in another language, respond in English and offer to translate.

ABOUT STEPHANIE:
Stephanie Poole (Steffy) — ${age} years old, born June 18 2002. South African web developer and UX/UI designer. Passionate about clean code, thoughtful design, and human-centred UX.
Stack: Vue 3, TypeScript, Nuxt, Vuetify, Figma, HTML/CSS/SCSS.
Portfolio: Home, About, CV, Playground, Figma, Contact.

${experience ? `EXPERIENCE:\n${experience}\n` : ''}${knowledge ? `ADDITIONAL INFO:\n${knowledge}\n` : ''}
CONTACT — if asked how to contact or reach Stephanie, respond with exactly:
Here's how to reach Stephanie:
- **WhatsApp** — [+27 74 628 2617](https://wa.me/27746282617)
- **Email** — [stephaniepoole2002@gmail.com](https://mail.google.com/mail/?view=cm&to=stephaniepoole2002@gmail.com)
- **LinkedIn** — [stephanie-poole](https://www.linkedin.com/in/stephanie-poole-708455250/)
- **GitHub** — [Steffycoding](https://github.com/Steffycoding)

NAVIGATION — if the visitor wants to go to a page, respond ONLY with raw JSON:
{"action":"navigate","target":"/about"}
Valid targets: /, /about, /cv, /playground, /figma, /contact

RULES:
- Never open links on behalf of the visitor. Always present links for them to click.
- If a JSON action is your response, that must be your ENTIRE response — no other text.`.trim()
}

const buildAdminPrompt = (): string => {
  const knowledge  = getKnowledge()
  const experience = getExperience()
  const age        = getStephAge()
  return `You are SneakyAI in ADMIN mode. You are speaking directly with Stephanie Poole (Steffy), the verified portfolio owner.

CURRENT INFO: ${knowledge || '(empty)'}
CURRENT EXPERIENCE: ${experience || '(empty)'}
CORE FACTS (permanent): Born June 18 2002, currently ${age}. South African web developer & UX/UI designer.

LANGUAGE: Always respond in the same language Steffy uses. Follow her exactly.

BEHAVIOUR:
- Be direct and concise. Confirm all save/remove/clear actions in one short sentence.
- When Steffy tells you to remember or add something, store it using the correct JSON command.
- When she wants to remove or forget something, use the correct JSON remove command.
- When she asks to clear all chats/names/visitor history, use the clear_all_visitors command.
- For regular conversation, respond naturally — no JSON.

COMMANDS (must be your ENTIRE response when used):
{"action":"update_knowledge","content":"exact text to add"}
{"action":"remove_knowledge","content":"exact text to remove"}
{"action":"update_experience","content":"exact text to add"}
{"action":"remove_experience","content":"exact text to remove"}
{"action":"clear_all_visitors"}

Trigger STORE on: "remember…", "I'm now…", "update…", "add…", "my new project is…", "learn that…", "note that…", "save that…"
Trigger REMOVE on: "forget…", "remove…", "delete…", "don't say…", "take out…", "erase…"
Trigger CLEAR ALL on: "clear all chats", "clear all history", "delete all visitors", "wipe visitor data", "reset visitors", "clear visitor names", "clear everything"`.trim()
}

// ── Render markdown → HTML ─────────────────────────────────────────────────
const renderContent = (text: string) =>
  text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>')
    .replace(/• /g, '&bull; ')
    .replace(/\n/g, '<br/>')

const scrollToBottom = async () => {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

// ── Navigation ─────────────────────────────────────────────────────────────
const navigateTo = async (target: string) => {
  open.value = false
  await new Promise(r => setTimeout(r, 260))
  router.push(target)
}

const downloadCV = () => {
  const link    = document.createElement('a')
  link.href     = '/assets/StephaniePoole_CV.pdf'
  link.download = 'Stephanie_Poole_CV.pdf'
  link.click()
  messages.value.push({ role: 'assistant', content: 'Downloading CV.' })
}

// ── Parse & handle actions ─────────────────────────────────────────────────
const extractJSON = (raw: string): any | null => {
  const match = raw.match(/\{[\s\S]*?"action"[\s\S]*?\}/)
  if (!match) return null
  try { return JSON.parse(match[0]) } catch { return null }
}

const handleAction = (raw: string): boolean => {
  const json = extractJSON(raw)
  if (!json) return false

  if (json.action === 'navigate' && json.target) {
    const pg = json.target === '/' ? 'Home' : json.target.slice(1).charAt(0).toUpperCase() + json.target.slice(2)
    messages.value.push({ role: 'assistant', content: `Navigating to ${pg}.` })
    navigateTo(json.target)
    return true
  }
  if (json.action === 'download_cv') { downloadCV(); return true }
  if (!adminVerified.value) return false

  if (json.action === 'clear_all_visitors') {
    try { localStorage.removeItem(KEYS.visitor) } catch {}
    try { localStorage.removeItem(KEYS.visitorLog) } catch {}
    visitorLog.value = []
    messages.value.push({ role: 'assistant', content: '🗑 Done — all visitor names, chats and history have been cleared.' })
    setAdminChat(messages.value)
    return true
  }

  const knowledgeActions: Record<string, () => void> = {
    update_knowledge: () => { const u = getKnowledge(); const n = u ? u + '\n\n' + json.content : json.content; setKnowledge(n); knowledgeText.value = n; messages.value.push({ role: 'assistant', content: '✅ Saved to Info.' }) },
    remove_knowledge: () => { const n = getKnowledge().split('\n\n').filter(p => !p.toLowerCase().includes(json.content.toLowerCase())).join('\n\n').trim(); setKnowledge(n); knowledgeText.value = n; messages.value.push({ role: 'assistant', content: '🗑 Removed from Info.' }) },
    update_experience: () => { const u = getExperience(); const n = u ? u + '\n\n' + json.content : json.content; setExperience(n); experienceText.value = n; messages.value.push({ role: 'assistant', content: '✅ Saved to Experience.' }) },
    remove_experience: () => { const n = getExperience().split('\n\n').filter(p => !p.toLowerCase().includes(json.content.toLowerCase())).join('\n\n').trim(); setExperience(n); experienceText.value = n; messages.value.push({ role: 'assistant', content: '🗑 Removed from Experience.' }) },
  }

  const action = knowledgeActions[json.action]
  if (action) {
    action()
    setAdminChat(messages.value)
    return true
  }
  return false
}

// ── Persist visitor history ────────────────────────────────────────────────
const persistVisitorHistory = (lastMsg: string) => {
  const history = messages.value.map(m => ({ role: m.role, content: m.content })).slice(-60)
  const vd      = getVisitorData() ?? { name: visitorName.value }
  setVisitorData({ ...vd, history })
  if (visitorName.value) appendVisitorLog({ name: visitorName.value, lastMessage: lastMsg.slice(0, 80) })
}

// ── Send ───────────────────────────────────────────────────────────────────
const send = async () => {
  const text = draft.value.trim()
  if (!text || loading.value) return

  // Passphrase check
  if (!isAdmin.value && awaitingPassphrase.value) {
    awaitingPassphrase.value = false
    messages.value.push({ role: 'user', content: text })
    draft.value = ''
    if (text.trim().toLowerCase() === SECRET_PHRASE) {
      visitorIsSteph.value = true
      messages.value.push({ role: 'assistant', content: `Passphrase accepted. ✅ Welcome back, Steffy! 🎉 Always a pleasure having the boss around. What would you like to know?` })
    } else {
      messages.value.push({ role: 'assistant', content: wrongPassphraseResponse(visitorName.value) })
    }
    persistVisitorHistory(text)
    await scrollToBottom()
    return
  }

  // Identity claim
  if (!isAdmin.value && !visitorIsSteph.value && isClaimingToBeSteph(text)) {
    messages.value.push({ role: 'user', content: text })
    draft.value = ''
    awaitingPassphrase.value = true
    messages.value.push({ role: 'assistant', content: `Bold claim. 👀 If you're really Stephanie, you'll know the passphrase — what is it?` })
    persistVisitorHistory(text)
    await scrollToBottom()
    return
  }

  // Contact intercept
  if (!isAdmin.value && /contact|reach|email|whatsapp|linkedin|github|get in touch|message her/i.test(text)) {
    messages.value.push({ role: 'user', content: text })
    draft.value = ''
    await scrollToBottom()
    messages.value.push({ role: 'assistant', content: contactCardMessage() })
    persistVisitorHistory(text)
    await scrollToBottom()
    return
  }

  // Normal AI flow
  messages.value.push({ role: 'user', content: text })
  draft.value = ''
  if (!isAdmin.value) userMsgCount.value++
  loading.value = true
  await scrollToBottom()

  const apiHistory   = messages.value.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
  const firstUser    = apiHistory.findIndex(m => m.role === 'user')
  const cleanHistory = firstUser >= 0 ? apiHistory.slice(firstUser) : apiHistory

  try {
    const data = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        system:   (isAdmin.value && adminVerified.value) ? buildAdminPrompt() : buildVisitorPrompt(visitorName.value),
        messages: cleanHistory,
      },
    }) as any

    const raw = data?.content?.[0]?.text ?? data?.choices?.[0]?.message?.content ?? ''
    loading.value = false

    if (!handleAction(raw)) {
      const clean = stripActionJSON(raw)
      messages.value.push({ role: 'assistant', content: clean || 'Something went wrong — try again.' })
      if (isAdmin.value && adminVerified.value) setAdminChat(messages.value)
    }
    if (!isAdmin.value) persistVisitorHistory(text)
  } catch (err: any) {
    loading.value = false
    console.error('[SneakyAI]', err)
    messages.value.push({ role: 'assistant', content: `Hmm, something went quiet on my end. Give it a moment and try again.` })
    if (!isAdmin.value) persistVisitorHistory(text)
  }

  await scrollToBottom()
}

const sendQuick  = (text: string) => { draft.value = text; send() }
const saveKnowledge  = () => { setKnowledge(knowledgeText.value);   keSaved.value  = true; setTimeout(() => { keSaved.value  = false }, 2500) }
const saveExperience = () => { setExperience(experienceText.value); expSaved.value = true; setTimeout(() => { expSaved.value = false }, 2500) }

// ── Save name ──────────────────────────────────────────────────────────────
const saveName = async () => {
  const name = nameInput.value.trim()
  if (!name) return
  visitorName.value     = name
  nameCaptureDone.value = true
  nameInput.value       = ''
  const vd = getVisitorData()
  if (vd?.name === name && vd.history?.length) {
    messages.value = vd.history
    messages.value.push({ role: 'assistant', content: `Welcome back, ${name}! What can I help with?` })
    userMsgCount.value = vd.history.filter((m: any) => m.role === 'user').length
  } else {
    setVisitorData({ name, history: [] })
    messages.value = [{ role: 'assistant', content: `Nice to meet you, ${name}. What would you like to know?` }]
  }
  await scrollToBottom()
}

const loadVisitorSession = () => {
  const vd = getVisitorData()
  if (vd?.name) {
    visitorName.value     = vd.name
    nameCaptureDone.value = true
    messages.value        = vd.history?.length ? vd.history : [{ role: 'assistant', content: `Welcome back, ${vd.name}. What can I help with?` }]
    userMsgCount.value    = (vd.history ?? []).filter((m: any) => m.role === 'user').length
  } else {
    messages.value = []
  }
}

onMounted(() => {
  knowledgeText.value  = getKnowledge()
  experienceText.value = getExperience()
  visitorLog.value     = getVisitorLog()
  loadVisitorSession()
  window.addEventListener('keypress', handleKeyPress)
})

watch(activeAdminTab, (tab) => {
  if (tab === 'visitors')   visitorLog.value     = getVisitorLog()
  if (tab === 'knowledge')  knowledgeText.value  = getKnowledge()
  if (tab === 'experience') experienceText.value = getExperience()
})
watch(open, async (val) => { if (val) { await nextTick(); scrollToBottom() } })
</script>

<style scoped>
/* ── Theme tokens ─────────────────────────────────────────────────────────── */
:root,
.sneaky-panel {
  --s-fab-bg:          rgba(7,11,22,0.88);
  --s-fab-border:      rgba(231,143,10,0.22);
  --s-fab-label:       rgba(200,190,180,0.55);
  --s-panel-bg:        rgba(8,12,24,0.97);
  --s-panel-border:    rgba(255,255,255,0.07);
  --s-header-bg:       rgba(255,255,255,0.02);
  --s-header-border:   rgba(255,255,255,0.055);
  --s-title:           #fff;
  --s-sub:             rgba(255,255,255,0.25);
  --s-act-color:       rgba(255,255,255,0.28);
  --s-act-border:      rgba(255,255,255,0.07);
  --s-nc-text:         rgba(255,255,255,0.6);
  --s-pg-label:        rgba(255,255,255,0.82);
  --s-pg-hint:         rgba(255,255,255,0.28);
  --s-pg-error:        rgba(255,90,80,0.85);
  --s-input-bg:        rgba(255,255,255,0.06);
  --s-input-border:    rgba(231,143,10,0.25);
  --s-input-color:     #fff;
  --s-input-ph:        rgba(255,255,255,0.16);
  --s-bub-u-bg:        rgba(19,100,180,0.2);
  --s-bub-u-border:    rgba(19,140,220,0.16);
  --s-bub-u-color:     rgba(210,230,255,0.95);
  --s-bub-a-bg:        rgba(255,255,255,0.055);
  --s-bub-a-border:    rgba(255,255,255,0.09);
  --s-bub-a-color:     rgba(220,225,240,0.92);
  --s-qp-border:       rgba(255,255,255,0.038);
  --s-qp-bg:           transparent;
  --s-qbtn-bg:         rgba(255,255,255,0.025);
  --s-qbtn-border:     rgba(255,255,255,0.06);
  --s-qbtn-color:      rgba(255,255,255,0.4);
  --s-irow-bg:         rgba(255,255,255,0.012);
  --s-irow-border:     rgba(255,255,255,0.055);
  --s-ci-bg:           rgba(255,255,255,0.055);
  --s-ci-border:       rgba(255,255,255,0.08);
  --s-ci-color:        rgba(255,255,255,0.92);
  --s-ci-ph:           rgba(255,255,255,0.18);
  --s-tab-bg:          rgba(255,255,255,0.025);
  --s-tab-border:      rgba(255,255,255,0.06);
  --s-tab-color:       rgba(255,255,255,0.28);
  --s-ke-hint:         rgba(255,255,255,0.28);
  --s-ke-bg:           rgba(255,255,255,0.04);
  --s-ke-border:       rgba(255,255,255,0.07);
  --s-ke-color:        rgba(255,255,255,0.82);
  --s-ke-ph:           rgba(255,255,255,0.12);
  --s-ve-bg:           rgba(255,255,255,0.035);
  --s-ve-border:       rgba(255,255,255,0.055);
  --s-v-time:          rgba(255,255,255,0.22);
  --s-v-preview:       rgba(255,255,255,0.42);
  --s-no-vis:          rgba(255,255,255,0.22);
}

body.light-mode {
  --s-fab-bg:        rgba(175,182,195,0.9);
  --s-fab-border:    rgba(140,130,110,0.32);
  --s-fab-label:     rgba(20,30,50,0.65);
  --s-panel-bg:      rgba(251,247,241,0.98);
  --s-panel-border:  rgba(200,160,100,0.14);
  --s-header-bg:     rgba(255,250,240,0.8);
  --s-header-border: rgba(200,160,100,0.11);
  --s-title:         #2d1a00;
  --s-sub:           rgba(80,50,10,0.38);
  --s-act-color:     rgba(80,50,10,0.38);
  --s-act-border:    rgba(180,130,60,0.18);
  --s-nc-text:       rgba(60,35,5,0.68);
  --s-pg-label:      rgba(40,25,5,0.75);
  --s-pg-hint:       rgba(80,50,10,0.38);
  --s-pg-error:      rgba(180,40,30,0.85);
  --s-input-bg:      rgba(255,252,245,0.95);
  --s-input-border:  rgba(200,150,70,0.28);
  --s-input-color:   #2d1800;
  --s-input-ph:      rgba(120,80,20,0.28);
  --s-bub-u-bg:      rgba(231,143,10,0.09);
  --s-bub-u-border:  rgba(231,143,10,0.18);
  --s-bub-u-color:   #2d1800;
  --s-bub-a-bg:      rgba(245,232,208,0.75);
  --s-bub-a-border:  rgba(205,165,95,0.2);
  --s-bub-a-color:   #271400;
  --s-qp-border:     rgba(200,160,100,0.11);
  --s-qp-bg:         rgba(255,247,232,0.5);
  --s-qbtn-bg:       rgba(231,143,10,0.055);
  --s-qbtn-border:   rgba(200,150,60,0.16);
  --s-qbtn-color:    rgba(80,45,5,0.58);
  --s-irow-bg:       rgba(255,247,232,0.8);
  --s-irow-border:   rgba(200,160,100,0.11);
  --s-ci-bg:         rgba(255,251,243,0.95);
  --s-ci-border:     rgba(200,150,70,0.22);
  --s-ci-color:      #2d1800;
  --s-ci-ph:         rgba(120,80,20,0.28);
  --s-tab-bg:        rgba(0,0,0,0.025);
  --s-tab-border:    rgba(180,130,60,0.14);
  --s-tab-color:     rgba(80,50,10,0.38);
  --s-ke-hint:       rgba(80,50,10,0.36);
  --s-ke-bg:         rgba(255,251,243,0.95);
  --s-ke-border:     rgba(200,150,70,0.18);
  --s-ke-color:      #2d1800;
  --s-ke-ph:         rgba(120,80,20,0.22);
  --s-ve-bg:         rgba(245,232,208,0.55);
  --s-ve-border:     rgba(200,160,100,0.14);
  --s-v-time:        rgba(100,65,15,0.38);
  --s-v-preview:     rgba(80,50,10,0.48);
  --s-no-vis:        rgba(120,80,20,0.28);
}

/* ── FAB ──────────────────────────────────── */
.sneaky-fab {
  position:fixed; top:1.1rem; left:4.4rem; z-index:700;
  display:flex; align-items:center; gap:5px;
  padding:0 .6rem 0 .28rem; height:34px; border-radius:2rem;
  border:1px solid var(--s-fab-border); background:var(--s-fab-bg);
  backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
  color:#fff; cursor:pointer; transition:all .2s ease; overflow:visible;
  box-shadow:0 3px 12px rgba(0,0,0,0.3);
}
.sneaky-fab:hover  { background:rgba(231,143,10,0.1); border-color:rgba(231,143,10,0.45); transform:translateY(-1px); }
.sneaky-fab.active { border-color:rgba(19,174,251,0.4); background:rgba(19,174,251,0.08); }
.sneaky-fab.admin  { border-color:rgba(231,143,10,0.6); background:rgba(231,143,10,0.12); }
.fab-icon   { display:flex; align-items:center; justify-content:center; width:22px; height:22px; flex-shrink:0; }
.fab-avatar { width:22px; height:22px; border-radius:50%; object-fit:cover; border:1.5px solid rgba(231,143,10,0.45); }
.fab-label  { font-family:'Georgia',serif; font-size:.56rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--s-fab-label); }
.ping { position:absolute; top:3px; right:3px; width:5px; height:5px; border-radius:50%; background:linear-gradient(-180deg,#E78F0A,#13AEFB); animation:ping 2.4s ease-out infinite; }
@keyframes ping { 0%{transform:scale(1);opacity:1} 70%{transform:scale(2.2);opacity:0} 100%{opacity:0} }

/* ── Panel ────────────────────────────────── */
.sneaky-panel {
  position:fixed; top:3.8rem; left:.85rem; z-index:690;
  width:min(320px, calc(100vw - 1.2rem));
  height:min(490px, calc(100vh - 5rem));
  border-radius:1.1rem; overflow:hidden;
  display:flex; flex-direction:column;
  background:var(--s-panel-bg);
  backdrop-filter:blur(40px); -webkit-backdrop-filter:blur(40px);
  border:1px solid var(--s-panel-border);
  box-shadow:0 20px 50px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04);
}
.sneaky-panel::before {
  content:''; position:absolute; top:0; left:8%; right:8%; height:1px;
  background:linear-gradient(90deg,transparent,#E78F0A 25%,#13AEFB 75%,transparent);
  opacity:.65; pointer-events:none; z-index:1;
}
.sneaky-panel.admin::before { background:linear-gradient(90deg,transparent,#E78F0A 50%,transparent); }
.panel-drop-enter-active,.panel-drop-leave-active { transition:opacity .2s ease, transform .2s cubic-bezier(.34,1.5,.64,1); }
.panel-drop-enter-from,.panel-drop-leave-to { opacity:0; transform:translateY(-10px) scale(.97); }

/* ── Header ───────────────────────────────── */
.s-header {
  display:flex; align-items:center; gap:.5rem;
  padding:.55rem .75rem;
  border-bottom:1px solid var(--s-header-border);
  background:var(--s-header-bg); flex-shrink:0;
}
.header-avatar { width:28px; height:28px; border-radius:50%; object-fit:cover; border:1.5px solid rgba(231,143,10,0.32); flex-shrink:0; }
.s-title-block { flex:1; min-width:0; }
.s-title { margin:0; font-family:'Georgia',serif; font-size:.7rem; font-weight:700; color:var(--s-title); letter-spacing:.02em; line-height:1.2; }
.s-sub   { margin:.03rem 0 0; font-size:.58rem; color:var(--s-sub); font-family:'Georgia',serif; }
.header-actions { display:flex; gap:.22rem; align-items:center; }
.action-btn {
  width:24px; height:24px; border-radius:50%;
  border:1px solid var(--s-act-border); background:transparent;
  color:var(--s-act-color); cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  font-size:.7rem; transition:all .14s;
}
.action-btn svg { width:11px; height:11px; }
.action-btn:hover { background:rgba(255,255,255,0.07); color:#fff; border-color:rgba(255,255,255,0.13); }
.action-btn:hover svg { stroke:rgba(255,100,80,0.9); }
.close-btn:hover { background:rgba(200,50,50,0.13); border-color:rgba(200,50,50,0.18); }

/* ── Name / passphrase capture ────────────── */
.name-capture, .passphrase-gate {
  padding:1.1rem .75rem .8rem; flex-shrink:0;
  display:flex; flex-direction:column; align-items:center; text-align:center; gap:.4rem;
}
.nc-avatar  { width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid rgba(231,143,10,0.38); box-shadow:0 2px 10px rgba(0,0,0,0.3); }
.pg-lock    { font-size:1.6rem; line-height:1; }
.nc-text, .pg-label { margin:0; font-family:'Georgia',serif; font-size:.7rem; color:var(--s-nc-text); line-height:1.45; }
.pg-label   { font-weight:700; color:var(--s-pg-label); letter-spacing:.04em; font-size:.75rem; }
.pg-hint    { margin:0; font-family:'Georgia',serif; font-size:.6rem; color:var(--s-pg-hint); }
.pg-error   { margin:0; font-family:'Georgia',serif; font-size:.62rem; color:var(--s-pg-error); }
.nc-row     { display:flex; gap:.3rem; width:100%; }
.nc-input {
  flex:1; background:var(--s-input-bg); border:1px solid var(--s-input-border); border-radius:.6rem;
  padding:.4rem .65rem; font-family:'Georgia',serif; font-size:.67rem;
  color:var(--s-input-color); outline:none; transition:border-color .2s, box-shadow .2s;
}
.nc-input:focus { border-color:rgba(231,143,10,0.52); box-shadow:0 0 0 2px rgba(231,143,10,0.07); }
.nc-input::placeholder { color:var(--s-input-ph); }
.nc-btn {
  width:32px; height:32px; border-radius:.6rem; border:none;
  background:linear-gradient(135deg,#E78F0A,#13AEFB); color:#fff;
  font-size:.95rem; cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:transform .13s; flex-shrink:0;
}
.nc-btn:disabled { opacity:.3; cursor:not-allowed; }
.nc-btn:hover:not(:disabled) { transform:scale(1.06); }

/* ── Admin panel ──────────────────────────── */
.admin-panel { display:flex; flex-direction:column; flex:1; min-height:0; padding:.5rem .75rem; gap:.4rem; }
.admin-tabs  { display:flex; gap:.2rem; flex-shrink:0; }
.admin-tab {
  flex:1; padding:.25rem .1rem; border-radius:.4rem;
  border:1px solid var(--s-tab-border); background:var(--s-tab-bg);
  color:var(--s-tab-color);
  font-family:'Georgia',serif; font-size:.52rem; cursor:pointer; transition:all .14s; white-space:nowrap;
}
.admin-tab.active             { background:rgba(231,143,10,0.11); border-color:rgba(231,143,10,0.32); color:rgba(255,255,255,0.88); }
.admin-tab:hover:not(.active) { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.5); }

.knowledge-editor { display:flex; flex-direction:column; flex:1; min-height:0; gap:.4rem; }
.ke-hint { margin:0; font-family:'Georgia',serif; font-size:.58rem; color:var(--s-ke-hint); line-height:1.4; flex-shrink:0; }
.ke-textarea {
  flex:1; background:var(--s-ke-bg); border:1px solid var(--s-ke-border); border-radius:.6rem;
  padding:.55rem .7rem; font-family:'Georgia',serif; font-size:.65rem;
  color:var(--s-ke-color); outline:none; resize:none; line-height:1.55; transition:border-color .2s; min-height:0;
}
.ke-textarea:focus        { border-color:rgba(231,143,10,0.32); }
.ke-textarea::placeholder { color:var(--s-ke-ph); }
.ke-actions   { display:flex; align-items:center; gap:.4rem; flex-shrink:0; }
.ke-save {
  padding:.32rem .75rem; border-radius:.45rem; border:none;
  background:linear-gradient(135deg,#E78F0A,#13AEFB); color:#fff;
  font-family:'Georgia',serif; font-size:.62rem; font-weight:700; cursor:pointer; transition:transform .13s;
}
.ke-save:hover  { transform:scale(1.02); }
.ke-save.danger { background:linear-gradient(135deg,#c0392b,#e74c3c); }
.ke-saved-msg   { margin:0; font-family:'Georgia',serif; font-size:.6rem; color:rgba(80,220,100,0.9); }

.visitors-panel { display:flex; flex-direction:column; gap:.28rem; overflow-y:auto; flex:1; min-height:0; }
.no-visitors    { font-family:'Georgia',serif; font-size:.64rem; color:var(--s-no-vis); text-align:center; padding:.8rem 0; }
.visitor-entry  { display:flex; flex-direction:column; gap:.08rem; padding:.38rem .5rem; border-radius:.45rem; background:var(--s-ve-bg); border:1px solid var(--s-ve-border); }
.v-name    { font-family:'Georgia',serif; font-size:.63rem; font-weight:700; color:#E78F0A; }
.v-time    { font-family:'Georgia',serif; font-size:.54rem; color:var(--s-v-time); }
.v-preview { font-family:'Georgia',serif; font-size:.6rem; color:var(--s-v-preview); font-style:italic; }

/* ── Messages ─────────────────────────────── */
.messages {
  flex:1; overflow-y:auto; padding:.6rem .75rem;
  display:flex; flex-direction:column; gap:.42rem;
  scroll-behavior:smooth; min-height:0;
}
.messages::-webkit-scrollbar       { width:2px; }
.messages::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.06); border-radius:2px; }
.message { display:flex; align-items:flex-end; gap:.3rem; animation:msgIn .17s ease; }
@keyframes msgIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
.message.user      { justify-content:flex-end; }
.message.assistant { justify-content:flex-start; }
.assistant-avatar  { width:18px; height:18px; flex-shrink:0; margin-bottom:2px; }
.msg-avatar        { width:18px; height:18px; border-radius:50%; object-fit:cover; border:1px solid rgba(231,143,10,0.28); }
.bubble {
  max-width:83%; padding:.38rem .62rem; border-radius:.8rem;
  font-family:'Georgia',serif; font-size:.66rem; line-height:1.52; word-break:break-word;
}
.message.user .bubble      { background:var(--s-bub-u-bg); border:1px solid var(--s-bub-u-border); color:var(--s-bub-u-color); border-bottom-right-radius:.15rem; }
.message.assistant .bubble { background:var(--s-bub-a-bg); border:1px solid var(--s-bub-a-border); color:var(--s-bub-a-color); border-bottom-left-radius:.15rem; }
.bubble.typing { display:flex; align-items:center; gap:4px; padding:.5rem .65rem; min-width:40px; }
.bubble.typing span { display:block; width:4px; height:4px; border-radius:50%; background:rgba(19,174,251,0.5); animation:dot 1.3s ease-in-out infinite; }
.bubble.typing span:nth-child(2) { animation-delay:.18s; }
.bubble.typing span:nth-child(3) { animation-delay:.36s; }
@keyframes dot { 0%,80%,100%{transform:scale(.5);opacity:.25} 40%{transform:scale(1);opacity:1} }
.bubble :deep(strong) { color:rgba(255,255,255,0.95); font-weight:600; }
.bubble :deep(code)   { background:rgba(255,255,255,0.09); border-radius:3px; padding:.08em .28em; font-family:'Courier New',monospace; font-size:.84em; }
.bubble :deep(.chat-link)       { color:#13AEFB; text-decoration:underline; text-underline-offset:2px; word-break:break-all; }
.bubble :deep(.chat-link:hover) { color:#E78F0A; }

/* ── Quick prompts ────────────────────────── */
.quick-prompts { padding:.25rem .75rem .32rem; flex-shrink:0; border-top:1px solid var(--s-qp-border); background:var(--s-qp-bg); }
.qp-grid       { display:grid; grid-template-columns:1fr 1fr; gap:.22rem; }
.quick-btn {
  display:flex; align-items:center; gap:.25rem; padding:.24rem .44rem;
  border-radius:.4rem; border:1px solid var(--s-qbtn-border);
  background:var(--s-qbtn-bg); color:var(--s-qbtn-color);
  font-family:'Georgia',serif; font-size:.55rem; cursor:pointer; transition:all .13s; text-align:left;
}
.quick-btn:hover { background:rgba(19,174,251,0.08); border-color:rgba(19,174,251,0.22); color:rgba(255,255,255,0.82); transform:translateY(-1px); }
.qp-icon { font-size:.72rem; flex-shrink:0; }
.qp-text { line-height:1.25; }

/* ── Input row ────────────────────────────── */
.input-row {
  display:flex; align-items:center; gap:.35rem;
  padding:.45rem .75rem; border-top:1px solid var(--s-irow-border);
  background:var(--s-irow-bg); flex-shrink:0;
}
.chat-input {
  flex:1; background:var(--s-ci-bg); border:1px solid var(--s-ci-border); border-radius:.65rem;
  padding:.38rem .62rem; font-family:'Georgia',serif; font-size:.66rem;
  color:var(--s-ci-color); outline:none; min-width:0; transition:border-color .2s, box-shadow .2s;
}
.chat-input::placeholder { color:var(--s-ci-ph); }
.chat-input:focus    { border-color:rgba(19,174,251,0.32); box-shadow:0 0 0 2px rgba(19,174,251,0.05); }
.chat-input:disabled { opacity:.3; cursor:not-allowed; }
.send-btn {
  width:28px; height:28px; border-radius:.55rem; border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
  background:linear-gradient(135deg,#E78F0A,#13AEFB); color:#fff;
  transition:transform .13s, box-shadow .17s; box-shadow:0 2px 7px rgba(19,174,251,0.18);
}
.send-btn svg { width:11px; height:11px; }
.send-btn:hover:not(:disabled) { transform:scale(1.08); box-shadow:0 3px 10px rgba(19,174,251,0.3); }
.send-btn:disabled { opacity:.22; cursor:not-allowed; }

/* ── Mobile ───────────────────────────────── */
@media (max-width: 768px) {
  .sneaky-fab   { top:.7rem; left:50%; transform:translateX(-50%); right:auto; height:32px; padding:0 .65rem 0 .3rem; }
  .sneaky-fab:hover { transform:translateX(-50%) translateY(-1px); }
  .sneaky-panel { top:3rem; left:.35rem; right:.35rem; width:auto; height:min(480px,calc(100dvh - 4rem)); border-radius:.9rem; }
  .bubble       { font-size:.64rem; }
  .quick-btn    { font-size:.53rem; padding:.22rem .38rem; }
  .chat-input   { font-size:.66rem; }
}
</style>