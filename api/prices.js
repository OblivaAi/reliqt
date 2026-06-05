module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system: 'You are a sports card market analyst. Return ONLY valid JSON array, no markdown, no explanation.',
        messages: [{
          role: 'user',
          content: `Give realistic current market token prices for these PSA graded cards (each split into 10,000 tokens):
1. LeBron James 2003 Topps Chrome PSA 10
2. Patrick Mahomes 2017 Panini Prizm PSA 10
3. Erling Haaland 2019 Topps Chrome PSA 10
4. Charizard 1999 Base Set PSA 9
5. Pikachu Illustrator PSA 10
6. Mewtwo Holo 1st Ed PSA 10
7. Umbreon V Max 2021 PSA 10
8. Blaine Charizard 2000 PSA 8
9. Victor Wembanyama 2023 Prizm PSA 10
10. Shai Gilgeous-Alexander 2018 Prizm PSA 10
11. Venusaur 1st Ed 1999 PSA 10
12. Goku Ultra Instinct 2022 Bandai PSA 10

Return ONLY this JSON (no markdown):
[{"id":0,"price":1.24,"card_value":12400,"trend":4.2},{"id":1,"price":0.82,"card_value":8200,"trend":1.8},...]`
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text.replace(/```json|```/g, '').trim();
    const prices = JSON.parse(text);
    
    res.setHeader('Cache-Control', 's-maxage=300'); // cache 5 min
    return res.status(200).json({ success: true, prices, timestamp: Date.now() });
  } catch(err) {
    // Fallback prices if API fails
    const fallback = [
      {id:0,price:1.24,card_value:12400,trend:4.2},
      {id:1,price:0.82,card_value:8200,trend:1.8},
      {id:2,price:2.10,card_value:21000,trend:1.3},
      {id:3,price:4.75,card_value:47500,trend:2.1},
      {id:4,price:12.00,card_value:120000,trend:0.5},
      {id:5,price:3.20,card_value:32000,trend:3.7},
      {id:6,price:0.46,card_value:4600,trend:1.2},
      {id:7,price:0.25,card_value:2500,trend:0.8},
      {id:8,price:0.36,card_value:3600,trend:6.1},
      {id:9,price:0.28,card_value:2800,trend:9.3},
      {id:10,price:1.95,card_value:19500,trend:2.4},
      {id:11,price:0.85,card_value:8500,trend:3.1}
    ];
    return res.status(200).json({ success: true, prices: fallback, timestamp: Date.now(), cached: true });
  }
}
