import crypto from 'crypto';

/**
 * Vercel Serverless Function: Generates PayU SHA512 Signature Hash
 * 
 * PayU Hash Formula:
 * sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 * 
 * Note on pipe structure:
 * - 6 mandatory core parameters (key, txnid, amount, productinfo, firstname, email)
 * - 5 user defined fields (udf1, udf2, udf3, udf4, udf5)
 * - 6 empty placeholder trailing pipes (representing udf6 to udf10 + boundary to salt)
 * - Followed by merchant salt
 */
export default async function handler(req, res) {
  // CORS Configuration for local development and cross-origin requests
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
    return res.status(405).json({ 
      error: 'Method Not Allowed. Only POST requests are supported.' 
    });
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

    // 1. Retrieve & sanitize Merchant Key and Salt from environment variables
    const rawKey = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';
    const rawSalt = process.env.PAYU_MERCHANT_SALT || 'eCwWELxi';
    const rawActionUrl = process.env.PAYU_ACTION_URL || 'https://test.payu.in/_payment';

    const key = String(rawKey).trim();
    const salt = String(rawSalt).trim();
    const payuActionUrl = String(rawActionUrl).trim();

    // 2. Validate mandatory parameters
    if (!txnid || amount === undefined || amount === null || !productinfo || !firstname) {
      return res.status(400).json({ 
        error: 'Missing required parameters: txnid, amount, productinfo, and firstname are mandatory.' 
      });
    }

    // 3. Clean and sanitize all parameter values to guarantee identical representation in hash & form
    const cleanTxnid = String(txnid).trim();
    
    // Amount must strictly be a 2-decimal number string (e.g., "199.00", "29.00")
    const numAmount = parseFloat(String(amount));
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount supplied.' });
    }
    const cleanAmount = numAmount.toFixed(2);

    // Product info: strip control characters and special symbols to prevent form encoding mismatches
    const cleanProductInfo = String(productinfo)
      .replace(/[\r\n\t]/g, ' ')
      .replace(/[^a-zA-Z0-9\s_-]/g, '')
      .trim()
      .slice(0, 100) || 'SkillGo Course';

    // Firstname: alphabetic/clean characters only
    const cleanFirstname = String(firstname)
      .replace(/[\r\n\t]/g, ' ')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .trim() || 'Learner';

    // Email: lowercase trimmed
    const cleanEmail = (email && String(email).trim().toLowerCase()) || 'learner@skillgo.in';
    const cleanPhone = (phone && String(phone).trim().replace(/[^0-9]/g, '')) || '9876543210';

    // UDF fields (User Defined Fields 1 to 5) - default to empty strings if not provided
    const cleanUdf1 = udf1 ? String(udf1).trim() : '';
    const cleanUdf2 = udf2 ? String(udf2).trim() : '';
    const cleanUdf3 = udf3 ? String(udf3).trim() : '';
    const cleanUdf4 = udf4 ? String(udf4).trim() : '';
    const cleanUdf5 = udf5 ? String(udf5).trim() : '';

    // 4. Construct PayU SHA512 string using the exact standard template literal:
    // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
    const hashSequence = `${key}|${cleanTxnid}|${cleanAmount}|${cleanProductInfo}|${cleanFirstname}|${cleanEmail}|${cleanUdf1}|${cleanUdf2}|${cleanUdf3}|${cleanUdf4}|${cleanUdf5}||||||${salt}`;

    // 5. Generate lower-case hex SHA-512 digest
    const hash = crypto
      .createHash('sha512')
      .update(hashSequence, 'utf8')
      .digest('hex')
      .toLowerCase();

    // 6. Return the exact sanitized fields so the frontend HTML form matches bit-for-bit
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
      actionUrl: payuActionUrl,
      isTestMode: key === 'gtKFFx' || payuActionUrl.includes('test.payu.in')
    });
  } catch (error) {
    console.error('Error generating PayU SHA512 hash:', error);
    return res.status(500).json({ 
      error: 'Internal server error while generating PayU hash', 
      details: error.message 
    });
  }
}
