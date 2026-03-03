export default defineEventHandler(async (event) => {
  const body = await readBody(event)
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

  let response: Response
  try {
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        temperature: 0.7,
        messages: [
          { role: 'system', content: body.system || 'You are a helpful assistant.' },
          ...body.messages,
        ],
      }),
    })
  } catch (fetchErr: any) {
    throw createError({
      statusCode: 502,
      message: `Cannot reach Groq API: ${fetchErr?.message ?? fetchErr}`,
    })
  }

  const data = await response.json()
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

  return {
    content: [{ type: 'text', text }],
  }
})