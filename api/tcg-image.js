module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { cardId } = req.query;
  if (!cardId) return res.status(400).json({ error: 'Missing cardId' });

  try {
    const response = await fetch(
      `https://api.pokemontcg.io/v2/cards/${cardId}`,
      { headers: { 'X-Api-Key': '15546da3-1d17-42ee-be08-d22db4a9856a' } }
    );
    
    if (!response.ok) throw new Error('Card not found');
    
    const data = await response.json();
    const imageUrl = data.data?.images?.large || data.data?.images?.small;
    
    if (!imageUrl) return res.status(404).json({ error: 'No image' });
    
    // Proxy the image
    const imgResponse = await fetch(imageUrl);
    const buffer = await imgResponse.arrayBuffer();
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(Buffer.from(buffer));
  } catch(err) {
    return res.status(404).json({ error: err.message });
  }
}
