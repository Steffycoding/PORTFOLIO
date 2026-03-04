<template>
  <div>
    <!-- FAB -->
    <button
      class="sneaky-fab"
      @click="togglePanel"
      :class="{ active: open, admin: isAdmin && adminVerified }"
      aria-label="Open SneakyAI"
    >
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
            <!-- Visitor clear button -->
            <button v-if="messages.length > 0 && !isAdmin" class="action-btn" @click="clearChat" title="Clear chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </button>
            <!-- Admin clear button (chat only) -->
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

        <!-- Name capture (visitor) -->
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
            <input
              v-model="passphraseInput"
              class="nc-input"
              type="password"
              placeholder="Your phrase…"
              @keydown.enter="verifyPassphrase"
              autofocus
            />
            <button class="nc-btn" @click="verifyPassphrase" :disabled="!passphraseInput.trim()">→</button>
          </div>
          <p v-if="passphraseError" class="pg-error">{{ passphraseErrorMsg }}</p>
        </div>

        <!-- Admin panel (verified) -->
        <div v-else-if="isAdmin && adminVerified" class="admin-panel">
          <div class="admin-tabs">
            <button v-for="tab in adminTabs" :key="tab.key" class="admin-tab" :class="{ active: activeAdminTab === tab.key }" @click="activeAdminTab = tab.key">
              {{ tab.label }}
            </button>
          </div>

          <!-- Admin chat -->
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

          <!-- Info editor -->
          <div v-else-if="activeAdminTab === 'knowledge'" class="knowledge-editor">
            <p class="ke-hint">Facts, projects, availability — anything you want visitors to know.</p>
            <textarea v-model="knowledgeText" class="ke-textarea" placeholder="e.g. I'm open to full-time roles. My latest project is SneakyAI…" />
            <div class="ke-actions">
              <button class="ke-save" @click="saveKnowledge">💾 Save</button>
              <p v-if="keSaved" class="ke-saved-msg">✅ Saved</p>
            </div>
          </div>

          <!-- Experience editor -->
          <div v-else-if="activeAdminTab === 'experience'" class="knowledge-editor">
            <p class="ke-hint">Work history, education, skills — shown when visitors ask about your background.</p>
            <textarea v-model="experienceText" class="ke-textarea" placeholder="e.g. 2023–now: Dev at XYZ. Skills: Vue, TypeScript, Figma…" />
            <div class="ke-actions">
              <button class="ke-save" @click="saveExperience">💾 Save</button>
              <p v-if="expSaved" class="ke-saved-msg">✅ Saved</p>
            </div>
          </div>

          <!-- Visitors log -->
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

// ── Passphrase — must respond: "Welcome to the Loop" ──────────────────────
const SECRET_PHRASE      = 'welcome to the loop'
const passphraseInput    = ref('')
const passphraseError    = ref(false)
const passphraseErrorMsg = ref("That's not right. Try again.")
const failedAttempts     = ref(0)

const verifyPassphrase = () => {
  const attempt = passphraseInput.value.trim().toLowerCase()
  if (attempt === SECRET_PHRASE) {
    adminVerified.value   = true
    passphraseError.value = false
    passphraseInput.value = ''
    failedAttempts.value  = 0
    const stored = getAdminChat()
    messages.value = stored.length ? stored : [{
      role: 'assistant',
      content: `Access granted. Hey Steffy! 👋\n\nChat here to update your info, or use the **Info** and **XP** tabs to edit directly.\n\nExamples:\n• "Remember that I'm now at XYZ"\n• "Update my availability to open for freelance"\n• "Forget what I said about Y"`
    }]
    activeAdminTab.value = 'chat'
  } else {
    failedAttempts.value++
    passphraseError.value = true
    passphraseInput.value = ''
    passphraseErrorMsg.value = failedAttempts.value >= 3
      ? `Incorrect phrase. ${failedAttempts.value} failed attempt${failedAttempts.value > 1 ? 's' : ''}.`
      : `That's not right. Try again.`
    setTimeout(() => { passphraseError.value = false }, 2800)
  }
}

// ── Hidden PIN sequence to open admin gate ─────────────────────────────────
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

const clearVisitors = () => {
  try { localStorage.removeItem(KEYS.visitorLog) } catch {}
  visitorLog.value = []
}

// Clears visitor messages + stored history
const clearChat = () => {
  messages.value = []
  const vd = getVisitorData()
  if (vd) setVisitorData({ ...vd, history: [] })
}

// Clears only admin chat — knowledge/experience untouched
const clearAdminChat = () => {
  messages.value = [{ role: 'assistant', content: 'Chat cleared. What would you like to update?' }]
  setAdminChat(messages.value)
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

const stripActionJSON = (text: string): string =>
  text.replace(/\{[\s\S]*?"action"[\s\S]*?\}/g, '').trim()

// ── Visitor system prompt ──────────────────────────────────────────────────
const buildVisitorPrompt = (name: string) => {
  const knowledge  = getKnowledge()
  const experience = getExperience()
  const age        = getStephAge()
  return `You are SneakyAI — the AI assistant on Stephanie Poole's portfolio.

VISITOR: ${name || 'a visitor'}

ROLE & TONE:
- You are Stephanie's professional multilingual secretary. Warm, concise, and direct.
- Never say "Great question!", "Certainly!", "Of course!", or similar filler.
- Keep answers short and natural unless detail is truly needed.
- You can discuss Stephanie's work, skills, projects, and availability.
- Do NOT mention REST APIs, backend infrastructure, or technical site details.
- You are READ-ONLY. You cannot store, update, or change any information.

LANGUAGE:
- Always respond in English by default.
- ONLY switch languages if the visitor writes to you in a language other than English first.
- If a visitor writes in French, Afrikaans, Zulu etc., reply in that language.
- If the visitor switches back to English, you switch back too.
- Never assume a non-English language. When in doubt, use English.

ABOUT STEPHANIE:
Stephanie Poole (Steffy) — ${age} years old, born June 18 2002. South African web developer and UX/UI designer. Passionate about clean code, thoughtful design, and human-centred UX.
Stack: Vue 3, TypeScript, Nuxt, Vuetify, Figma, HTML/CSS/SCSS.
Portfolio: Home, About, CV, Playground, Figma, Contact.

${experience ? `EXPERIENCE:\n${experience}\n` : ''}${knowledge ? `ADDITIONAL INFO:\n${knowledge}\n` : ''}

CONTACT — if a visitor asks how to contact or reach Stephanie, respond with exactly this (you may translate surrounding prose but keep links/numbers verbatim):
Here's how to reach Stephanie:

- **WhatsApp** — [+27 74 628 2617](https://wa.me/27746282617)
- **Email** — [stephaniepoole2002@gmail.com](https://mail.google.com/mail/?view=cm&to=stephaniepoole2002@gmail.com)
- **LinkedIn** — [stephanie-poole](https://www.linkedin.com/in/stephanie-poole-708455250/)
- **GitHub** — [Steffycoding](https://github.com/Steffycoding)

NAVIGATION — if the visitor wants to go to a page, respond ONLY with raw JSON, nothing else:
{"action":"navigate","target":"/about"}
Valid targets: /, /about, /cv, /playground, /figma, /contact

RULES:
- Never open links on behalf of the visitor. Always present links for them to click.
- Never give out personal contact details unless the visitor explicitly asks how to contact Stephanie.
- If unsure of a fact about Stephanie, say so honestly. Never fabricate.
- If a JSON action is your response, that must be your ENTIRE response — no other text.`.trim()
}

// ── Admin system prompt ────────────────────────────────────────────────────
const buildAdminPrompt = () => {
  const knowledge  = getKnowledge()
  const experience = getExperience()
  const age        = getStephAge()
  return `You are SneakyAI in ADMIN mode. You are speaking directly with Stephanie Poole (Steffy), the verified portfolio owner.

CURRENT INFO:
${knowledge || '(empty)'}

CURRENT EXPERIENCE:
${experience || '(empty)'}

CORE FACTS (permanent — never overwrite):
- Born June 18 2002, currently ${age}
- South African web developer & UX/UI designer

LANGUAGE:
- Always respond in the same language Steffy uses. Afrikaans → Afrikaans. English → English. Follow her exactly.

BEHAVIOUR:
- Be direct and concise. Confirm all save/remove actions in one short sentence.
- When Steffy tells you to remember or add something, store it immediately using the correct JSON command.
- When she wants to remove or forget something, use the correct JSON remove command.
- For regular conversation or questions, respond naturally — no JSON.
- Always confirm in plain language what you saved or removed.

COMMANDS — use ONLY for storing or removing info. When used, this must be your ENTIRE response (no extra text):
{"action":"update_knowledge","content":"exact text to add"}
{"action":"remove_knowledge","content":"exact text to remove"}
{"action":"update_experience","content":"exact text to add"}
{"action":"remove_experience","content":"exact text to remove"}

Trigger STORE on: "remember…", "I'm now…", "update…", "add…", "my new project is…", "learn that…", "note that…", "save that…"
Trigger REMOVE on: "forget…", "remove…", "delete…", "don't say…", "take out…", "erase…"

IMPORTANT: Regular conversation = natural reply, NO JSON ever.`.trim()
}

// ── Render markdown → HTML ─────────────────────────────────────────────────
const renderContent = (text: string) =>
  text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>')
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
  const link      = document.createElement('a')
  link.href       = '/assets/StephaniePoole_CV.pdf'
  link.download   = 'Stephanie_Poole_CV.pdf'
  link.click()
  messages.value.push({ role: 'assistant', content: 'Downloading CV.' })
}

// ── Parse action JSON ──────────────────────────────────────────────────────
const extractJSON = (raw: string): any | null => {
  const match = raw.match(/\{[\s\S]*?"action"[\s\S]*?\}/)
  if (!match) return null
  try { return JSON.parse(match[0]) } catch { return null }
}

// ── Handle actions ─────────────────────────────────────────────────────────
const handleAction = (raw: string): boolean => {
  const json = extractJSON(raw)
  if (!json) return false

  if (json.action === 'navigate' && json.target) {
    const pg = json.target === '/' ? 'Home' : json.target.slice(1).charAt(0).toUpperCase() + json.target.slice(2)
    messages.value.push({ role: 'assistant', content: `Navigating to ${pg}.` })
    navigateTo(json.target)
    return true
  }

  if (json.action === 'download_cv') {
    downloadCV()
    return true
  }

  // Admin-only write actions — hard blocked unless passphrase verified
  if (!adminVerified.value) return false

  if (json.action === 'update_knowledge' && json.content) {
    const existing = getKnowledge()
    const updated  = existing ? existing + '\n\n' + json.content : json.content
    setKnowledge(updated)
    knowledgeText.value = updated
    messages.value.push({ role: 'assistant', content: '✅ Saved to Info.' })
    setAdminChat(messages.value)
    return true
  }
  if (json.action === 'remove_knowledge' && json.content) {
    const updated = getKnowledge()
      .split('\n\n')
      .filter(p => !p.toLowerCase().includes(json.content.toLowerCase()))
      .join('\n\n').trim()
    setKnowledge(updated)
    knowledgeText.value = updated
    messages.value.push({ role: 'assistant', content: '🗑 Removed from Info.' })
    setAdminChat(messages.value)
    return true
  }
  if (json.action === 'update_experience' && json.content) {
    const existing = getExperience()
    const updated  = existing ? existing + '\n\n' + json.content : json.content
    setExperience(updated)
    experienceText.value = updated
    messages.value.push({ role: 'assistant', content: '✅ Saved to Experience.' })
    setAdminChat(messages.value)
    return true
  }
  if (json.action === 'remove_experience' && json.content) {
    const updated = getExperience()
      .split('\n\n')
      .filter(p => !p.toLowerCase().includes(json.content.toLowerCase()))
      .join('\n\n').trim()
    setExperience(updated)
    experienceText.value = updated
    messages.value.push({ role: 'assistant', content: '🗑 Removed from Experience.' })
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

  // Intercept contact questions — always show links, never auto-open
  if (!isAdmin.value) {
    const isContactQ = /contact|reach|email|whatsapp|linkedin|github|get in touch|message her/i.test(text)
    if (isContactQ) {
      messages.value.push({ role: 'user', content: text })
      draft.value = ''
      await scrollToBottom()
      messages.value.push({ role: 'assistant', content: contactCardMessage() })
      persistVisitorHistory(text)
      await scrollToBottom()
      return
    }
  }

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

const sendQuick = (text: string) => { draft.value = text; send() }

const saveKnowledge  = () => { setKnowledge(knowledgeText.value);   keSaved.value = true; setTimeout(() => { keSaved.value  = false }, 2500) }
const saveExperience = () => { setExperience(experienceText.value); expSaved.value = true; setTimeout(() => { expSaved.value = false }, 2500) }

// ── Save name — restore history if returning visitor, fresh start if new ───
const saveName = async () => {
  const name = nameInput.value.trim()
  if (!name) return
  visitorName.value     = name
  nameCaptureDone.value = true
  nameInput.value       = ''

  const vd = getVisitorData()
  if (vd?.name === name && vd.history?.length) {
    // Returning visitor — restore full history
    messages.value = vd.history
    messages.value.push({ role: 'assistant', content: `Welcome back, ${name}! What can I help with?` })
    userMsgCount.value = vd.history.filter((m: any) => m.role === 'user').length
  } else {
    // New visitor — completely fresh
    setVisitorData({ name, history: [] })
    messages.value = [{ role: 'assistant', content: `Nice to meet you, ${name}. What would you like to know?` }]
  }
  await scrollToBottom()
}

// ── Load visitor session on mount ──────────────────────────────────────────
const loadVisitorSession = () => {
  const vd = getVisitorData()
  if (vd?.name) {
    visitorName.value     = vd.name
    nameCaptureDone.value = true
    if (vd.history?.length) {
      // Remembered — restore exactly where they left off
      messages.value     = vd.history
      userMsgCount.value = vd.history.filter((m: any) => m.role === 'user').length
    } else {
      // History was cleared — fresh greeting
      messages.value = [{ role: 'assistant', content: `Welcome back, ${vd.name}. What can I help with?` }]
    }
  } else {
    messages.value = []
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
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
/* ── FAB ──────────────────────────────────── */
.sneaky-fab {
  position: fixed; top: 1.1rem; left: 4.4rem; z-index: 700;
  display: flex; align-items: center; gap: 5px;
  padding: 0 0.6rem 0 0.28rem; height: 34px; border-radius: 2rem;
  border: 1px solid rgba(231,143,10,0.22);
  background: rgba(7,11,22,0.88);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  color: #fff; cursor: pointer; transition: all 0.2s ease; overflow: visible;
  box-shadow: 0 3px 12px rgba(0,0,0,0.3);
}
.sneaky-fab:hover  { background: rgba(231,143,10,0.1); border-color: rgba(231,143,10,0.45); transform: translateY(-1px); }
.sneaky-fab.active { border-color: rgba(19,174,251,0.4); background: rgba(19,174,251,0.08); }
.sneaky-fab.admin  { border-color: rgba(231,143,10,0.6); background: rgba(231,143,10,0.12); }
.fab-icon   { display:flex; align-items:center; justify-content:center; width:22px; height:22px; flex-shrink:0; }
.fab-avatar { width:22px; height:22px; border-radius:50%; object-fit:cover; border:1.5px solid rgba(231,143,10,0.45); }
.fab-label  { font-family:'Georgia',serif; font-size:.56rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:rgba(200,190,180,0.55); }
.ping { position:absolute; top:3px; right:3px; width:5px; height:5px; border-radius:50%; background:linear-gradient(-180deg,#E78F0A,#13AEFB); animation:ping 2.4s ease-out infinite; }
@keyframes ping { 0%{transform:scale(1);opacity:1} 70%{transform:scale(2.2);opacity:0} 100%{opacity:0} }

/* ── Panel ────────────────────────────────── */
.sneaky-panel {
  position: fixed; top: 3.8rem; left: .85rem; z-index: 690;
  width: min(320px, calc(100vw - 1.2rem));
  height: min(490px, calc(100vh - 5rem));
  border-radius: 1.1rem; overflow: hidden;
  display: flex; flex-direction: column;
  background: rgba(8,12,24,0.97);
  backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255,255,255,0.07);
  box-shadow: 0 20px 50px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04);
}
.sneaky-panel::before {
  content:''; position:absolute; top:0; left:8%; right:8%; height:1px;
  background: linear-gradient(90deg,transparent,#E78F0A 25%,#13AEFB 75%,transparent);
  opacity:.65; pointer-events:none; z-index:1;
}
.sneaky-panel.admin::before { background:linear-gradient(90deg,transparent,#E78F0A 50%,transparent); }
.panel-drop-enter-active,.panel-drop-leave-active { transition: opacity .2s ease, transform .2s cubic-bezier(.34,1.5,.64,1); }
.panel-drop-enter-from,.panel-drop-leave-to { opacity:0; transform:translateY(-10px) scale(.97); }

/* ── Header ───────────────────────────────── */
.s-header {
  display: flex; align-items: center; gap: .5rem;
  padding: .55rem .75rem;
  border-bottom: 1px solid rgba(255,255,255,0.055);
  background: rgba(255,255,255,0.02); flex-shrink: 0;
}
.header-avatar { width:28px; height:28px; border-radius:50%; object-fit:cover; border:1.5px solid rgba(231,143,10,0.32); flex-shrink:0; }
.s-title-block { flex:1; min-width:0; }
.s-title { margin:0; font-family:'Georgia',serif; font-size:.7rem; font-weight:700; color:#fff; letter-spacing:.02em; line-height:1.2; }
.s-sub   { margin:.03rem 0 0; font-size:.58rem; color:rgba(255,255,255,0.25); font-family:'Georgia',serif; }
.header-actions { display:flex; gap:.22rem; align-items:center; }
.action-btn {
  width:24px; height:24px; border-radius:50%;
  border:1px solid rgba(255,255,255,0.07); background:transparent;
  color:rgba(255,255,255,0.28); cursor:pointer;
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
.nc-text, .pg-label { margin:0; font-family:'Georgia',serif; font-size:.7rem; color:rgba(255,255,255,0.6); line-height:1.45; }
.pg-label   { font-weight:700; color:rgba(255,255,255,0.82); letter-spacing:.04em; font-size:.75rem; }
.pg-hint    { margin:0; font-family:'Georgia',serif; font-size:.6rem; color:rgba(255,255,255,0.28); }
.pg-error   { margin:0; font-family:'Georgia',serif; font-size:.62rem; color:rgba(255,90,80,0.85); }
.nc-row     { display:flex; gap:.3rem; width:100%; }
.nc-input {
  flex:1; background:rgba(255,255,255,0.06);
  border:1px solid rgba(231,143,10,0.25); border-radius:.6rem;
  padding:.4rem .65rem; font-family:'Georgia',serif; font-size:.67rem;
  color:#fff; outline:none; transition:border-color .2s, box-shadow .2s;
}
.nc-input:focus { border-color:rgba(231,143,10,0.52); box-shadow:0 0 0 2px rgba(231,143,10,0.07); }
.nc-input::placeholder { color:rgba(255,255,255,0.16); }
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
  border:1px solid rgba(255,255,255,0.06);
  background:rgba(255,255,255,0.025);
  color:rgba(255,255,255,0.28);
  font-family:'Georgia',serif; font-size:.52rem; cursor:pointer; transition:all .14s; white-space:nowrap;
}
.admin-tab.active             { background:rgba(231,143,10,0.11); border-color:rgba(231,143,10,0.32); color:rgba(255,255,255,0.88); }
.admin-tab:hover:not(.active) { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.5); }

.knowledge-editor { display:flex; flex-direction:column; flex:1; min-height:0; gap:.4rem; }
.ke-hint { margin:0; font-family:'Georgia',serif; font-size:.58rem; color:rgba(255,255,255,0.28); line-height:1.4; flex-shrink:0; }
.ke-textarea {
  flex:1; background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.07); border-radius:.6rem;
  padding:.55rem .7rem; font-family:'Georgia',serif; font-size:.65rem;
  color:rgba(255,255,255,0.82); outline:none; resize:none; line-height:1.55;
  transition:border-color .2s; min-height:0;
}
.ke-textarea:focus         { border-color:rgba(231,143,10,0.32); }
.ke-textarea::placeholder  { color:rgba(255,255,255,0.12); }
.ke-actions   { display:flex; align-items:center; gap:.4rem; flex-shrink:0; }
.ke-save {
  padding:.32rem .75rem; border-radius:.45rem; border:none;
  background:linear-gradient(135deg,#E78F0A,#13AEFB); color:#fff;
  font-family:'Georgia',serif; font-size:.62rem; font-weight:700;
  cursor:pointer; transition:transform .13s;
}
.ke-save:hover  { transform:scale(1.02); }
.ke-save.danger { background:linear-gradient(135deg,#c0392b,#e74c3c); }
.ke-saved-msg   { margin:0; font-family:'Georgia',serif; font-size:.6rem; color:rgba(80,220,100,0.9); }

.visitors-panel { display:flex; flex-direction:column; gap:.28rem; overflow-y:auto; flex:1; min-height:0; }
.no-visitors    { font-family:'Georgia',serif; font-size:.64rem; color:rgba(255,255,255,0.22); text-align:center; padding:.8rem 0; }
.visitor-entry  { display:flex; flex-direction:column; gap:.08rem; padding:.38rem .5rem; border-radius:.45rem; background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.055); }
.v-name    { font-family:'Georgia',serif; font-size:.63rem; font-weight:700; color:#E78F0A; }
.v-time    { font-family:'Georgia',serif; font-size:.54rem; color:rgba(255,255,255,0.22); }
.v-preview { font-family:'Georgia',serif; font-size:.6rem; color:rgba(255,255,255,0.42); font-style:italic; }

/* ── Messages ─────────────────────────────── */
.messages {
  flex:1; overflow-y:auto; padding:.6rem .75rem;
  display:flex; flex-direction:column; gap:.42rem;
  scroll-behavior:smooth; min-height:0;
}
.messages::-webkit-scrollbar { width:2px; }
.messages::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.06); border-radius:2px; }
.message { display:flex; align-items:flex-end; gap:.3rem; animation:msgIn .17s ease; }
@keyframes msgIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
.message.user      { justify-content:flex-end; }
.message.assistant { justify-content:flex-start; }
.assistant-avatar { width:18px; height:18px; flex-shrink:0; margin-bottom:2px; }
.msg-avatar { width:18px; height:18px; border-radius:50%; object-fit:cover; border:1px solid rgba(231,143,10,0.28); }
.bubble {
  max-width:83%; padding:.38rem .62rem;
  border-radius:.8rem; font-family:'Georgia',serif;
  font-size:.66rem; line-height:1.52; word-break:break-word;
}
.message.user .bubble {
  background: rgba(19,100,180,0.2); border: 1px solid rgba(19,140,220,0.16);
  color: rgba(210,230,255,0.95); border-bottom-right-radius: .15rem;
}
.message.assistant .bubble {
  background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.09);
  color: rgba(220,225,240,0.92); border-bottom-left-radius: .15rem;
}
.bubble.typing { display:flex; align-items:center; gap:4px; padding:.5rem .65rem; min-width:40px; }
.bubble.typing span { display:block; width:4px; height:4px; border-radius:50%; background:rgba(19,174,251,0.5); animation:dot 1.3s ease-in-out infinite; }
.bubble.typing span:nth-child(2) { animation-delay:.18s; }
.bubble.typing span:nth-child(3) { animation-delay:.36s; }
@keyframes dot { 0%,80%,100%{transform:scale(.5);opacity:.25} 40%{transform:scale(1);opacity:1} }
.bubble :deep(strong) { color:rgba(255,255,255,0.95); font-weight:600; }
.bubble :deep(code) { background:rgba(255,255,255,0.09); border-radius:3px; padding:.08em .28em; font-family:'Courier New',monospace; font-size:.84em; }
.bubble :deep(.chat-link) { color:#13AEFB; text-decoration:underline; text-underline-offset:2px; word-break:break-all; }
.bubble :deep(.chat-link:hover) { color:#E78F0A; }

/* ── Quick prompts ────────────────────────── */
.quick-prompts { padding:.25rem .75rem .32rem; flex-shrink:0; border-top:1px solid rgba(255,255,255,0.038); }
.qp-grid { display:grid; grid-template-columns:1fr 1fr; gap:.22rem; }
.quick-btn {
  display:flex; align-items:center; gap:.25rem; padding:.24rem .44rem;
  border-radius:.4rem; border:1px solid rgba(255,255,255,0.06);
  background:rgba(255,255,255,0.025); color:rgba(255,255,255,0.4);
  font-family:'Georgia',serif; font-size:.55rem; cursor:pointer; transition:all .13s; text-align:left;
}
.quick-btn:hover { background:rgba(19,174,251,0.08); border-color:rgba(19,174,251,0.22); color:rgba(255,255,255,0.82); transform:translateY(-1px); }
.qp-icon { font-size:.72rem; flex-shrink:0; }
.qp-text { line-height:1.25; }

/* ── Input row ────────────────────────────── */
.input-row {
  display:flex; align-items:center; gap:.35rem;
  padding:.45rem .75rem; border-top:1px solid rgba(255,255,255,0.055);
  background:rgba(255,255,255,0.012); flex-shrink:0;
}
.chat-input {
  flex:1; background:rgba(255,255,255,0.055);
  border:1px solid rgba(255,255,255,0.08); border-radius:.65rem;
  padding:.38rem .62rem; font-family:'Georgia',serif; font-size:.66rem;
  color:rgba(255,255,255,0.92); outline:none; min-width:0;
  transition:border-color .2s, box-shadow .2s;
}
.chat-input::placeholder { color:rgba(255,255,255,0.18); }
.chat-input:focus { border-color:rgba(19,174,251,0.32); box-shadow:0 0 0 2px rgba(19,174,251,0.05); }
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

/* ── Light mode ───────────────────────────── */
body.light-mode .sneaky-fab         { background:rgba(175,182,195,0.9); border-color:rgba(140,130,110,0.32); }
body.light-mode .sneaky-fab:hover   { background:rgba(155,165,180,0.95); border-color:rgba(231,143,10,0.38); }
body.light-mode .sneaky-fab.active  { background:rgba(160,185,210,0.9); border-color:rgba(19,174,251,0.32); }
body.light-mode .sneaky-fab.admin   { background:rgba(195,175,140,0.9); border-color:rgba(231,143,10,0.42); }
body.light-mode .fab-label          { color:rgba(20,30,50,0.65); }
body.light-mode .sneaky-panel       { background:rgba(251,247,241,0.98); border-color:rgba(200,160,100,0.14); box-shadow:0 16px 44px rgba(0,0,0,0.1); }
body.light-mode .sneaky-panel::before { background:linear-gradient(90deg,transparent,#E78F0A 30%,#f0a830 70%,transparent); opacity:.38; }
body.light-mode .s-header           { background:rgba(255,250,240,0.8); border-bottom-color:rgba(200,160,100,0.11); }
body.light-mode .s-title            { color:#2d1a00; }
body.light-mode .s-sub              { color:rgba(80,50,10,0.38); }
body.light-mode .action-btn         { border-color:rgba(180,130,60,0.18); color:rgba(80,50,10,0.38); }
body.light-mode .action-btn:hover   { background:rgba(231,143,10,0.07); color:#2d1a00; }
body.light-mode .action-btn:hover svg { stroke:rgba(180,60,40,0.75); }
body.light-mode .pg-label           { color:rgba(40,25,5,0.75); }
body.light-mode .pg-hint            { color:rgba(80,50,10,0.38); }
body.light-mode .nc-text            { color:rgba(60,35,5,0.68); }
body.light-mode .nc-input           { background:rgba(255,252,245,0.95); border-color:rgba(200,150,70,0.28); color:#2d1800; }
body.light-mode .nc-input::placeholder { color:rgba(120,80,20,0.28); }
body.light-mode .pg-error           { color:rgba(180,40,30,0.85); }
body.light-mode .message.user .bubble      { background:rgba(231,143,10,0.09); border:1px solid rgba(231,143,10,0.18); color:#2d1800; }
body.light-mode .message.assistant .bubble { background:rgba(245,232,208,0.75); border:1px solid rgba(205,165,95,0.2); color:#271400; }
body.light-mode .bubble :deep(strong)      { color:#1a0c00; }
body.light-mode .bubble :deep(code)        { background:rgba(180,110,20,0.1); color:#3d1f00; }
body.light-mode .bubble.typing             { background:rgba(245,232,208,0.75); border-color:rgba(205,165,95,0.2); }
body.light-mode .bubble.typing span        { background:rgba(180,110,30,0.42); }
body.light-mode .bubble :deep(.chat-link)  { color:#c94a00; }
body.light-mode .quick-prompts  { border-top-color:rgba(200,160,100,0.11); background:rgba(255,247,232,0.5); }
body.light-mode .quick-btn      { background:rgba(231,143,10,0.055); border-color:rgba(200,150,60,0.16); color:rgba(80,45,5,0.58); }
body.light-mode .quick-btn:hover{ background:rgba(231,143,10,0.12); border-color:rgba(200,140,40,0.32); color:#2d1500; }
body.light-mode .input-row  { background:rgba(255,247,232,0.8); border-top-color:rgba(200,160,100,0.11); }
body.light-mode .chat-input { background:rgba(255,251,243,0.95); border:1px solid rgba(200,150,70,0.22); color:#2d1800; }
body.light-mode .chat-input::placeholder { color:rgba(120,80,20,0.28); }
body.light-mode .chat-input:focus { border-color:rgba(231,143,10,0.46); box-shadow:0 0 0 2px rgba(231,143,10,0.08); }
body.light-mode .admin-tab         { background:rgba(0,0,0,0.025); border-color:rgba(180,130,60,0.14); color:rgba(80,50,10,0.38); }
body.light-mode .admin-tab.active  { background:rgba(231,143,10,0.09); border-color:rgba(231,143,10,0.28); color:#2d1500; }
body.light-mode .ke-hint           { color:rgba(80,50,10,0.36); }
body.light-mode .ke-textarea       { background:rgba(255,251,243,0.95); border-color:rgba(200,150,70,0.18); color:#2d1800; }
body.light-mode .ke-textarea::placeholder { color:rgba(120,80,20,0.22); }
body.light-mode .visitor-entry     { background:rgba(245,232,208,0.55); border-color:rgba(200,160,100,0.14); }
body.light-mode .v-time            { color:rgba(100,65,15,0.38); }
body.light-mode .v-preview         { color:rgba(80,50,10,0.48); }
body.light-mode .no-visitors       { color:rgba(120,80,20,0.28); }

/* ── Mobile ───────────────────────────────── */
@media (max-width: 768px) {
  .sneaky-fab { top:.7rem; left:50%; transform:translateX(-50%); right:auto; height:32px; padding:0 .65rem 0 .3rem; }
  .sneaky-fab:hover { transform:translateX(-50%) translateY(-1px); }
  .sneaky-panel { top:3rem; left:.35rem; right:.35rem; width:auto; height:min(480px,calc(100dvh - 4rem)); border-radius:.9rem; }
  .bubble     { font-size:.64rem; }
  .quick-btn  { font-size:.53rem; padding:.22rem .38rem; }
  .chat-input { font-size:.66rem; }
}
</style>