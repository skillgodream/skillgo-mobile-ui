import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  /**
   * PayU Signature Hash Generator Endpoint
   * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
   */
  app.post('/api/payment-hash', (req, res) => {
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

      const key = (process.env.PAYU_MERCHANT_KEY || 'gtKFFx').trim();
      const salt = (process.env.PAYU_MERCHANT_SALT || 'eCwWELxi').trim();
      const actionUrl = (process.env.PAYU_ACTION_URL || 'https://test.payu.in/_payment').trim();

      const cleanTxnid = (txnid && String(txnid).trim().length > 0)
        ? String(txnid).trim()
        : ('TXN-' + Date.now() + '-' + Math.floor(Math.random() * 99999));
      const numAmount = parseFloat(String(amount));
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ error: 'Invalid amount supplied.' });
      }
      const cleanAmount = numAmount.toFixed(2);

      const cleanProductInfo = String(productinfo || 'SkillGo Course')
        .replace(/[^a-zA-Z0-9\s_-]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100) || 'SkillGo Course';

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

      const hashSequence = `${key}|${cleanTxnid}|${cleanAmount}|${cleanProductInfo}|${cleanFirstname}|${cleanEmail}|${cleanUdf1}|${cleanUdf2}|${cleanUdf3}|${cleanUdf4}|${cleanUdf5}||||||${salt}`;

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
    } catch (error: any) {
      console.error('Error generating PayU hash:', error);
      return res.status(500).json({ 
        error: 'Failed to generate payment hash', 
        details: error?.message 
      });
    }
  });

  /**
   * PayU Success Callback Endpoint (Local Express Dev)
   */
  app.post('/api/payment-success', (req, res) => {
    try {
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
      } = req.body || {};

      const key = (process.env.PAYU_MERCHANT_KEY || 'gtKFFx').trim();
      const salt = (process.env.PAYU_MERCHANT_SALT || 'eCwWELxi').trim();

      const reverseHashString = `${salt}|${status || ''}|${udf10}|${udf9}|${udf8}|${udf7}|${udf6}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email || ''}|${firstname || ''}|${productinfo || ''}|${amount || ''}|${txnid || ''}|${key}`;
      const calculatedHash = crypto.createHash('sha512').update(reverseHashString, 'utf8').digest('hex').toLowerCase();
      const isHashValid = calculatedHash === (hash || '').toLowerCase();

      const isSuccess = (status === 'success') || isHashValid;
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers['host'] || 'localhost:3000';
      return res.redirect(303, `${protocol}://${host}/?payment=${isSuccess ? 'success' : 'failed'}&txnid=${encodeURIComponent(txnid || '')}`);
    } catch (err) {
      return res.redirect(303, `/?payment=failed`);
    }
  });

  /**
   * PayU Failure Callback Endpoint (Local Express Dev)
   */
  app.post('/api/payment-failure', (req, res) => {
    const { txnid } = req.body || {};
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['host'] || 'localhost:3000';
    return res.redirect(303, `${protocol}://${host}/?payment=failed&txnid=${encodeURIComponent(txnid || '')}`);
  });

  /**
   * PayU Success / Failure Callback Redirect Handler
   * PayU posts form data back to surl / furl
   */
  app.post('/api/payment-callback', (req, res) => {
    const { status, txnid, amount, hash } = req.body || {};
    const isSuccess = status === 'success';
    res.redirect(303, `/?payment=${isSuccess ? 'success' : 'failed'}&txnid=${txnid || ''}&amount=${amount || ''}`);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillGo fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
