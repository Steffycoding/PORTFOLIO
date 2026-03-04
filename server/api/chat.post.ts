const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export default defineEventHandler(async (event) => {
  const body   = await readBody(event)
  const config = useRuntimeConfig()
  const apiKey = config.groqApiKey || ''

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'NUXT_GROQ_API_KEY is not set. Add it to your .env file and restart.',
    })
  }

  if (!body.messages || body.messages.length === 0) {
    throw createError({ statusCode: 400, message: 'No messages provided.' })
  }

  const payload = JSON.stringify({
    model:       'llama-3.1-8b-instant',
    max_tokens:  1024,
    temperature: 0.7,
    messages: [
      { role: 'system', content: body.system || 'You are a helpful assistant.' },
      ...body.messages.slice(-20),
    ],
  })

  const MAX_RETRIES = 2

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController()
    const timeout    = setTimeout(() => controller.abort(), 15_000)

    let response: Response
    try {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: payload,
      })
    } catch (fetchErr: any) {
      clearTimeout(timeout)
      const isTimeout = fetchErr?.name === 'AbortError'
      throw createError({
        statusCode: isTimeout ? 504 : 502,
        message: isTimeout
          ? 'Groq API timed out after 15 s. Try again.'
          : `Cannot reach Groq API: ${fetchErr?.message ?? fetchErr}`,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after')
      const waitMs     = retryAfter
        ? Math.min(parseFloat(retryAfter) * 1000, 10_000)
        : Math.min(1_000 * 2 ** attempt, 8_000)

      console.warn(`[Groq] 429 rate limited. Attempt ${attempt + 1}/${MAX_RETRIES + 1}. Waiting ${waitMs}ms...`)

      if (attempt < MAX_RETRIES) {
        await sleep(waitMs)
        continue
      }

      throw createError({
        statusCode: 429,
        message: 'Rate limited by Groq. Please wait a few seconds and try again.',
      })
    }

    let data: any
    try {
      data = await response.json()
    } catch {
      throw createError({ statusCode: 502, message: 'Groq returned a non-JSON response.' })
    }

    console.log('[Groq] status:', response.status, '| response:', JSON.stringify(data).slice(0, 300))

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: data?.error?.message ?? `Groq error ${response.status}`,
      })
    }

    const text = data.choices?.[0]?.message?.content ?? ''
    if (!text) {
      console.warn('[Groq] Empty text in response:', JSON.stringify(data))
      throw createError({ statusCode: 500, message: 'Groq returned an empty response.' })
    }

    return { content: [{ type: 'text', text }] }
  }

  throw createError({ statusCode: 500, message: 'Unexpected error in chat handler.' })
})