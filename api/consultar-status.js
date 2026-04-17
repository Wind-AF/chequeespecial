export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (!id) {
    return res.status(400).json({ error: 'ID da transação é obrigatório' })
  }

  const apiKey = process.env.PARADISE_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key não configurada' })
  }

  try {
    const response = await fetch(
      `https://multi.paradisepags.com/api/v1/query.php?action=get_transaction&id=${encodeURIComponent(id)}`,
      { headers: { 'X-API-Key': apiKey } }
    )

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch {
    return res.status(500).json({ error: 'Falha na comunicação com a API' })
  }
}
