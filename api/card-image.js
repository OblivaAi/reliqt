module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing pokemon id' });

  try {
    // Fetch from PokeAPI
    const response = await fetch(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    );
    
    if (!response.ok) throw new Error('Image not found');
    
    const buffer = await response.arrayBuffer();
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // cache 24h
    return res.status(200).send(Buffer.from(buffer));
  } catch(err) {
    return res.status(404).json({ error: 'Image not found' });
  }
}
