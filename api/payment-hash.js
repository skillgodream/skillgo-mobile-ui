import crypto from 'crypto';

/**
 * Vercel Serverless Function: Generates PayU SHA512 Signature Hash
 * Standard Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 */
export default async function handler(req, res) {
  // CORS Configuration
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
      udf1, 
      udf2, 
      udf3, 
      udf4, 
      udf5 
    } = req.body || {};

    // Retrieve PayU Merchant credentials from environment variables
    // Default test sandbox fallback keys provided if not yet set in environment
    const key = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';
    const salt = process.env.PAYU_MERCHANT_SALT || 'eCwWELxi';
    const payuActionUrl = process.env.PAYU_ACTION_URL || 'https://test.payu.in/_payment';

    if (!txnid || !amount || !productinfo || !firstname) {
      return res.status(400).json({ 
        error: 'Missing required payment parameters: txnid, amount, productinfo, and firstname are mandatory.' 
      });
    }

    // Format amount to 2 decimal places as required by PayU
    const formattedAmount = parseFloat(amount).toFixed(2);
    const cleanEmail = (email && email.trim()) || 'learner@skillgo.in';
    const cleanPhone = (phone && phone.trim()) || '9876543210';
    const cleanFirstname = firstname.trim();
    const cleanProductInfo = productinfo.trim();

    const cleanUdf1 = udf1 || '';
    const cleanUdf2 = udf2 || '';
    const cleanUdf3 = udf3 || '';
    const cleanUdf4 = udf4 || '';
    const cleanUdf5 = udf5 || '';

    // Standard PayU SHA512 hash formula:
    // (key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
    const hashString = `${key}|${txnid}|${formattedAmount}|${cleanProductInfo}|${cleanFirstname}|${cleanEmail}|${cleanUdf1}|${cleanUdf2}|${cleanUdf3}|${cleanUdf4}|${cleanUdf5}||||||${salt}`;

    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return res.status(200).json({
      success: true,
      key,
      txnid,
      amount: formattedAmount,
      productinfo: cleanProductInfo,
      firstname: cleanFirstname,
      email: cleanEmail,
      phone: cleanPhone,
      hash,
      actionUrl: payuActionUrl,
      isTestMode: key === 'gtKFFx' || payuActionUrl.includes('test.payu.in')
    });
  } catch (error) {
    console.error('Error generating PayU hash:', error);
    return res.status(500).json({ 
      error: 'Internal server error while generating PayU hash', 
      details: error.message 
    });
  }
}
