// Vercel Serverless Function - Email Notifications
// Deploy: /api/send-email.js

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RESEND_KEY = 're_VR2X54H3_87LoKNQm7fPTL7X3gUaDjnGd';

  try {
    const { type, to, data } = req.body;

    let subject, html;

    switch(type) {
      case 'welcome':
        subject = '🎉 Welcome to Reliqt!';
        html = `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0F0E0C;color:#F2F2F0;padding:40px;border-radius:12px">
            <div style="text-align:center;margin-bottom:32px">
              <div style="width:56px;height:56px;background:linear-gradient(135deg,#D4A843,#B8902E);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:24px">⬡</div>
              <h1 style="font-size:24px;font-weight:700;margin:16px 0 4px;color:#F2F2F0">Welcome to Reliqt</h1>
              <p style="color:#9A9B9C;margin:0">Real world collectibles, onchain</p>
            </div>
            <div style="background:#161719;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:24px;margin-bottom:24px">
              <p style="margin:0 0 16px;font-size:16px">Hey ${data?.wallet ? data.wallet.slice(0,6)+'...' : 'Collector'}! 👋</p>
              <p style="color:#9A9B9C;line-height:1.6;margin:0">You've successfully connected your wallet to Reliqt. You can now buy fractional tokens of PSA graded collectibles starting from just <strong style="color:#D4A843">$1</strong>.</p>
            </div>
            <div style="display:grid;gap:12px;margin-bottom:24px">
              <div style="background:#161719;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;display:flex;gap:12px">
                <span style="font-size:20px">🏪</span>
                <div><strong style="color:#F2F2F0">Browse Marketplace</strong><p style="color:#9A9B9C;margin:4px 0 0;font-size:14px">Explore PSA 10 graded cards</p></div>
              </div>
              <div style="background:#161719;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;display:flex;gap:12px">
                <span style="font-size:20px">🎰</span>
                <div><strong style="color:#F2F2F0">Open Gacha Packs</strong><p style="color:#9A9B9C;margin:4px 0 0;font-size:14px">Chance to win legendary cards</p></div>
              </div>
              <div style="background:#161719;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;display:flex;gap:12px">
                <span style="font-size:20px">🏆</span>
                <div><strong style="color:#F2F2F0">Join Leaderboard</strong><p style="color:#9A9B9C;margin:4px 0 0;font-size:14px">Earn points and climb ranks</p></div>
              </div>
            </div>
            <a href="https://reliqt.vercel.app/app.html" style="display:block;background:#D4A843;color:#000;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Start Collecting →</a>
            <p style="text-align:center;color:#5A5B5C;font-size:12px;margin-top:24px">Reliqt · Real World Assets Onchain · <a href="https://reliqt.vercel.app" style="color:#D4A843">reliqt.vercel.app</a></p>
          </div>
        `;
        break;

      case 'purchase':
        subject = `✅ Purchase Confirmed — ${data?.cardName || 'Token'}`;
        html = `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0F0E0C;color:#F2F2F0;padding:40px;border-radius:12px">
            <div style="text-align:center;margin-bottom:32px">
              <div style="font-size:48px;margin-bottom:12px">✅</div>
              <h1 style="font-size:22px;font-weight:700;margin:0 0 8px;color:#F2F2F0">Purchase Confirmed!</h1>
              <p style="color:#9A9B9C;margin:0">Your tokens are now onchain</p>
            </div>
            <div style="background:#161719;border:1px solid rgba(34,197,94,0.2);border-radius:10px;padding:24px;margin-bottom:24px">
              <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
                <span style="color:#9A9B9C">Card</span>
                <strong style="color:#F2F2F0">${data?.cardName || 'Token'}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
                <span style="color:#9A9B9C">Tokens</span>
                <strong style="color:#F2F2F0">${data?.amount || '0'}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
                <span style="color:#9A9B9C">Total Paid</span>
                <strong style="color:#D4A843">$${data?.totalUSD || '0'}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:10px 0">
                <span style="color:#9A9B9C">Ownership</span>
                <strong style="color:#22C55E">${data?.ownership || '0'}%</strong>
              </div>
            </div>
            ${data?.txHash ? `<a href="https://basescan.org/tx/${data.txHash}" style="display:block;background:#161719;border:1px solid rgba(255,255,255,0.08);color:#D4A843;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-size:13px;margin-bottom:16px">View on BaseScan ↗</a>` : ''}
            <a href="https://reliqt.vercel.app/app.html" style="display:block;background:#D4A843;color:#000;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:700">View Portfolio →</a>
            <p style="text-align:center;color:#5A5B5C;font-size:12px;margin-top:24px">Reliqt · <a href="https://reliqt.vercel.app" style="color:#D4A843">reliqt.vercel.app</a></p>
          </div>
        `;
        break;

      case 'gacha':
        subject = `🎰 You got a ${data?.rarity || 'card'} from Reliqt!`;
        html = `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0F0E0C;color:#F2F2F0;padding:40px;border-radius:12px">
            <div style="text-align:center;margin-bottom:32px">
              <div style="font-size:64px;margin-bottom:12px">${data?.emoji || '🎴'}</div>
              <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">You got a <span style="color:#D4A843">${data?.rarity?.toUpperCase() || 'CARD'}</span>!</h1>
              <p style="color:#9A9B9C;margin:0">${data?.cardName || 'Legendary Card'}</p>
            </div>
            <div style="background:#161719;border:1px solid rgba(212,168,67,0.2);border-radius:10px;padding:24px;margin-bottom:24px;text-align:center">
              <p style="color:#9A9B9C;margin:0 0 12px;font-size:14px">Card Value</p>
              <p style="font-size:32px;font-weight:700;color:#D4A843;margin:0">$${data?.value || '0'}</p>
              <p style="color:#9A9B9C;font-size:12px;margin:8px 0 0">+${data?.tokens || '0'} tokens added to your wallet</p>
            </div>
            <a href="https://reliqt.vercel.app/app.html" style="display:block;background:#D4A843;color:#000;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:700">View Collection →</a>
          </div>
        `;
        break;

      case 'price_alert':
        subject = `📈 ${data?.cardName} price ${data?.direction === 'up' ? 'up' : 'down'} ${data?.change}%!`;
        html = `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0F0E0C;color:#F2F2F0;padding:40px;border-radius:12px">
            <div style="text-align:center;margin-bottom:32px">
              <div style="font-size:48px;margin-bottom:12px">${data?.direction === 'up' ? '📈' : '📉'}</div>
              <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Price Alert</h1>
              <p style="color:#9A9B9C;margin:0">${data?.cardName}</p>
            </div>
            <div style="background:#161719;border:1px solid ${data?.direction === 'up' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'};border-radius:10px;padding:24px;margin-bottom:24px">
              <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
                <span style="color:#9A9B9C">Current Price</span>
                <strong style="color:#D4A843">$${data?.currentPrice}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:10px 0">
                <span style="color:#9A9B9C">Change (24h)</span>
                <strong style="color:${data?.direction === 'up' ? '#22C55E' : '#EF4444'}">${data?.direction === 'up' ? '+' : ''}${data?.change}%</strong>
              </div>
            </div>
            <a href="https://reliqt.vercel.app/app.html" style="display:block;background:#D4A843;color:#000;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:700">View Card →</a>
          </div>
        `;
        break;

      case 'referral':
        subject = `🎉 Someone used your Reliqt referral code!`;
        html = `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0F0E0C;color:#F2F2F0;padding:40px;border-radius:12px">
            <div style="text-align:center;margin-bottom:32px">
              <div style="font-size:48px;margin-bottom:12px">🎉</div>
              <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Referral Bonus!</h1>
              <p style="color:#9A9B9C;margin:0">Someone joined using your code</p>
            </div>
            <div style="background:#161719;border:1px solid rgba(212,168,67,0.2);border-radius:10px;padding:24px;margin-bottom:24px;text-align:center">
              <p style="color:#9A9B9C;margin:0 0 8px">You earned</p>
              <p style="font-size:36px;font-weight:700;color:#D4A843;margin:0">+500 pts</p>
              <p style="color:#9A9B9C;font-size:13px;margin:8px 0 0">Total referrals: ${data?.totalReferrals || 1}</p>
            </div>
            <a href="https://reliqt.vercel.app/app.html" style="display:block;background:#D4A843;color:#000;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:700">View Referrals →</a>
          </div>
        `;
        break;

      default:
        return res.status(400).json({ error: 'Unknown email type' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
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

    if (!response.ok) {
      return res.status(response.status).json({ error: result.message || 'Send failed' });
    }

    return res.status(200).json({ success: true, id: result.id });

  } catch(err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: err.message });
  }
}
