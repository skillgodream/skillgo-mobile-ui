import crypto from 'crypto';

/**
 * Vercel Serverless Function: PayU SHA512 Hash Generation
 * Strict PayU Hash Template:
 * key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Only POST requests are supported.' });
  }

  try {
    const {
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      udf1 = '',
      udf2 = '',
      udf3 = '',
      udf4 = '',
      udf5 = '',
      surl,
      furl
    } = req.body || {};

    // Retrieve environment secrets with fallback to PayU test sandbox credentials
    const key = (process.env.PAYU_MERCHANT_KEY || 'gtKFFx').trim();
    const salt = (process.env.PAYU_MERCHANT_SALT || 'eCwWELxi').trim();
    const actionUrl = (process.env.PAYU_ACTION_URL || 'https://test.payu.in/_payment').trim();

    // 1. Transaction ID: dynamic fallback if missing
    const cleanTxnid = (txnid && String(txnid).trim().length > 0)
      ? String(txnid).trim()
      : ('TXN-' + Date.now() + '-' + Math.floor(Math.random() * 99999));

    // 2. Force amount to two decimal places (.toFixed(2))
    const numAmount = parseFloat(String(amount));
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount supplied.' });
    }
    const cleanAmount = numAmount.toFixed(2);

    // 3. Sanitize productinfo to simple text without special characters or line breaks
    const cleanProductInfo = String(productinfo || 'SkillGo Course')
      .replace(/[^a-zA-Z0-9\s_-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100) || 'SkillGo Course';

    // 4. Sanitize user profile parameters
    const cleanFirstname = String(firstname || 'Learner')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim() || 'Learner';

    const cleanEmail = (email && String(email).trim().toLowerCase()) || 'learner@skillgo.in';
    const cleanPhone = (phone && String(phone).trim().replace(/\D/g, '')) || '9876543210';

    const cleanUdf1 = String(udf1 || '').trim();
    const cleanUdf2 = String(udf2 || '').trim();
    const cleanUdf3 = String(udf3 || '').trim();
    const cleanUdf4 = String(udf4 || '').trim();
    const cleanUdf5 = String(udf5 || '').trim();

    // 5. Strict PayU SHA512 hash template
    // key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    const hashSequence = `${key}|${cleanTxnid}|${cleanAmount}|${cleanProductInfo}|${cleanFirstname}|${cleanEmail}|${cleanUdf1}|${cleanUdf2}|${cleanUdf3}|${cleanUdf4}|${cleanUdf5}||||||${salt}`;

    // 6. Calculate lower-case SHA512 hex digest
    const hash = crypto
      .createHash('sha512')
      .update(hashSequence, 'utf8')
      .digest('hex')
      .toLowerCase();

    return res.status(200).json({
      success: true,
      key,
      txnid: cleanTxnid,
      amount: cleanAmount,
      productinfo: cleanProductInfo,
      firstname: cleanFirstname,
      email: cleanEmail,
      phone: cleanPhone,
      udf1: cleanUdf1,
      udf2: cleanUdf2,
      udf3: cleanUdf3,
      udf4: cleanUdf4,
      udf5: cleanUdf5,
      hash,
      actionUrl,
      surl: surl || '',
      furl: furl || ''
    });
  } catch (error) {
    console.error('Error generating PayU SHA512 hash:', error);
    return res.status(500).json({
      error: 'Failed to generate PayU payment hash',
      details: error?.message || 'Server error'
    });
  }
}

