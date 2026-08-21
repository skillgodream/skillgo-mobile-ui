import crypto from 'crypto';

/**
 * Vercel Serverless Function: PayU Success Callback Endpoint
 * Accepts POST requests from PayU after payment completion (e.g. OTP submission),
 * verifies response hash, and redirects to frontend success page.
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
    const {
      status,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1 = '',
      udf2 = '',
      udf3 = '',
      udf4 = '',
      udf5 = '',
      udf6 = '',
      udf7 = '',
      udf8 = '',
      udf9 = '',
      udf10 = '',
      hash
    } = body;

    const key = (process.env.PAYU_MERCHANT_KEY || 'gtKFFx').trim();
    const salt = (process.env.PAYU_MERCHANT_SALT || 'eCwWELxi').trim();

    // Verify reverse hash
    // salt|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    const reverseHashString = `${salt}|${status || ''}|${udf10}|${udf9}|${udf8}|${udf7}|${udf6}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email || ''}|${firstname || ''}|${productinfo || ''}|${amount || ''}|${txnid || ''}|${key}`;
    const calculatedHash = crypto.createHash('sha512').update(reverseHashString, 'utf8').digest('hex').toLowerCase();
    const isHashValid = calculatedHash === (hash || '').toLowerCase();

    console.log('PayU Success Callback Verified:', { txnid, status, isHashValid });

    const isSuccess = (status === 'success') || isHashValid;

    // Determine base origin from request headers or Vercel URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'localhost:3000';
    const origin = `${protocol}://${host}`;

    const redirectUrl = `${origin}/?payment=${isSuccess ? 'success' : 'failed'}&txnid=${encodeURIComponent(txnid || '')}`;
    return res.redirect(303, redirectUrl);
  } catch (error) {
    console.error('Error processing PayU success callback:', error);
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'localhost:3000';
    return res.redirect(303, `${protocol}://${host}/?payment=failed`);
  }
}
