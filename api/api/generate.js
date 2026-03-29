export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Chiave API non configurata' });
  try {
    const { system, userMsg } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 1000, system, messages: [{ role: 'user', content: userMsg }] })
    });
    if (!response.ok) { const err = await response.json().catch(() => ({})); return res.status(response.status).json({ error: err?.error?.message || 'Errore' }); }
    const data = await response.json();
    return res.status(200).json({ text: data.content?.[0]?.text || '' });
  } catch(e) { return res.status(500).json({ error: e.message }); }
}
