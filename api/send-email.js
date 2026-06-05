const RESEND_KEY = 're_VR2X54H3_87LoKNQm7fPTL7X3gUaDjnGd';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { type, to, data } = req.body;
    if (!to || !to.includes('@')) return res.status(400).json({ error: 'Invalid email' });

    let subject = 'Reliqt Notification';
    let html = '';

    if (type === 'welcome') {
      subject = '🎉 Welcome to Reliqt!';
      html = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0F0E0C;color:#F2F2F0;padding:40px;border-radius:12px">
        <div style="text-align:center;margin-bottom:32px">
          <h1 style="font-size:24px;color:#D4A843">Welcome to Reliqt ⬡</h1>
          <p style="color:#9A9B9C">Real world collectibles, onchain</p>
        </div>
        <p style="color:#9A9B9C;line-height:1.6">Hey ${data && data.wallet ? data.wallet.slice(0,6)+'...' : 'Collector'}! You can now buy fractional tokens of PSA graded collectibles starting from just <strong style="color:#D4A843">$1</strong>.</p>
        <a href="https://reliqt.vercel.app/app.html" style="display:block;background:#D4A843;color:#000;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:24px">Start Collecting →</a>
      </div>`;
    } else if (type === 'purchase') {
      subject = '✅ Purchase Confirmed — ' + (data && data.cardName || 'Token');
      html = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0F0E0C;color:#F2F2F0;padding:40px;border-radius:12px">
        <h1 style="color:#D4A843;text-align:center">✅ Purchase Confirmed!</h1>
        <div style="background:#161719;border-radius:10px;padding:24px;margin:20px 0">
          <p><span style="color:#9A9B9C">Card:</span> <strong>${data && data.cardName || ''}</strong></p>
          <p><span style="color:#9A9B9C">Tokens:</span> <strong>${data && data.amount || 0}</strong></p>
          <p><span style="color:#9A9B9C">Total:</span> <strong style="color:#D4A843">$${data && data.totalUSD || 0}</strong></p>
          <p><span style="color:#9A9B9C">Ownership:</span> <strong style="color:#22C55E">${data && data.ownership || 0}%</strong></p>
        </div>
        ${data && data.txHash ? '<a href="https://basescan.org/tx/'+data.txHash+'" style="display:block;color:#D4A843;text-align:center;margin-bottom:12px">View on BaseScan ↗</a>' : ''}
        <a href="https://reliqt.vercel.app/app.html" style="display:block;background:#D4A843;color:#000;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:700">View Portfolio →</a>
      </div>`;
    } else if (type === 'gacha') {
      subject = '🎰 You got a ' + (data && data.rarity || 'card') + ' from Reliqt!';
      html = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0F0E0C;color:#F2F2F0;padding:40px;border-radius:12px;text-align:center">
        <div style="font-size:64px;margin-bottom:12px">${data && data.emoji || '🎴'}</div>
        <h1 style="color:#D4A843">You got a ${data && data.rarity ? data.rarity.toUpperCase() : 'CARD'}!</h1>
        <p style="color:#9A9B9C">${data && data.cardName || ''}</p>
        <div style="background:#161719;border-radius:10px;padding:20px;margin:20px 0">
          <p style="font-size:32px;color:#D4A843;margin:0">$${data && data.value || 0}</p>
        </div>
        <a href="https://reliqt.vercel.app/app.html" style="display:block;background:#D4A843;color:#000;padding:14px;border-radius:8px;text-decoration:none;font-weight:700">View Collection →</a>
      </div>`;
    } else if (type === 'referral') {
      subject = '🎉 Referral Bonus — +500 pts!';
      html = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0F0E0C;color:#F2F2F0;padding:40px;border-radius:12px;text-align:center">
        <div style="font-size:48px">🎉</div>
        <h1 style="color:#D4A843">Referral Bonus!</h1>
        <p style="color:#9A9B9C">Someone joined using your code</p>
        <div style="background:#161719;border-radius:10px;padding:24px;margin:20px 0">
          <p style="font-size:36px;color:#D4A843;margin:0">+500 pts</p>
        </div>
        <a href="https://reliqt.vercel.app/app.html" style="display:block;background:#D4A843;color:#000;padding:14px;border-radius:8px;text-decoration:none;font-weight:700">View Referrals →</a>
      </div>`;
    } else if (type === 'price_alert') {
      subject = '📈 ' + (data && data.cardName || 'Card') + ' price alert!';
      html = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0F0E0C;color:#F2F2F0;padding:40px;border-radius:12px">
        <h1 style="color:#D4A843;text-align:center">📈 Price Alert</h1>
        <div style="background:#161719;border-radius:10px;padding:24px;margin:20px 0">
          <p><span style="color:#9A9B9C">Card:</span> <strong>${data && data.cardName || ''}</strong></p>
          <p><span style="color:#9A9B9C">Price:</span> <strong style="color:#D4A843">$${data && data.currentPrice || 0}</strong></p>
          <p><span style="color:#9A9B9C">Change:</span> <strong style="color:#22C55E">${data && data.change || 0}%</strong></p>
        </div>
        <a href="https://reliqt.vercel.app/app.html" style="display:block;background:#D4A843;color:#000;padding:14px;border-radius:8px;text-decoration:none;font-weight:700">View Card →</a>
      </div>`;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Reliqt <onboarding@resend.dev>',
        to: [to],
        subject,
        html
      })
    });

    const result = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: result.message || 'Send failed' });
    return res.status(200).json({ success: true, id: result.id });

  } catch(err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: err.message });
  }
}
