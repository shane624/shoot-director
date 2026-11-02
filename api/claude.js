// Vercel serverless function: lets Shoot Director talk to Claude when it runs on your own site.
// Set ANTHROPIC_API_KEY (required) and SHOOT_PASSCODE (recommended) in Vercel > Project > Settings > Environment Variables.
const MODELS = { quick: 'claude-haiku-5-5', default: 'claude-sonnet-5-5', complex: 'claude-sonnet-5-5' };

export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;
  const pass = process.env.SHOOT_PASSCODE || '';
  if (req.method === 'GET') return res.status(200).json({ ok: !!key, passcode: !!pass });
  if (req.method !== 'POST') return res.status(405).json({ error: { message: 'POST only' } });
  if (!key) return res.status(500).json({ error: { message: 'ANTHROPIC_API_KEY is not set' } });
  if (pass && req.headers['x-passcode'] !== pass) return res.status(401).json({ error: { message: 'Wrong passcode' } });
  const { prompt, images = [], tier = 'default' } = req.body || {};
  if (!prompt) return res.status(400).json({ error: { message: 'No prompt' } });
  const content = [
    ...images.slice(0, 10).map(data => ({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data } })),
    { type: 'text', text: String(prompt).slice(0, 200000) }
  ];
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODELS[tier] || MODELS.default, max_tokens: 16000, messages: [{ role: 'user', content }] })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return res.status(502).json({ error: j.error || { message: 'Claude request failed' } });
  const text = (j.content || []).map(c => c.text || '').join('');
  if (!text) return res.status(502).json({ error: { message: `Claude returned no text (stop reason: ${j.stop_reason || 'unknown'})` } });
  res.status(200).json({ text, stop_reason: j.stop_reason });
}
