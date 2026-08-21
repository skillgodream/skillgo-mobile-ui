/**
 * Vercel Serverless Function: PayU Failure / Cancelled Callback Endpoint
 * Accepts POST requests from PayU when payment fails or is cancelled,
 * and redirects to frontend failure page.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Only POST requests from PayU are supported.' });
  }

  try {
    const body = req.body || {};
    const { txnid, status } = body;
    console.log('PayU Failure Callback received:', { txnid, status });

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'localhost:3000';
    const origin = `${protocol}://${host}`;

    const redirectUrl = `${origin}/?payment=failed&txnid=${encodeURIComponent(txnid || '')}`;
    return res.redirect(303, redirectUrl);
  } catch (error) {
    console.error('Error processing PayU failure callback:', error);
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'localhost:3000';
    return res.redirect(303, `${protocol}://${host}/?payment=failed`);
  }
}
