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
        udf1, 
        udf2, 
        udf3, 
        udf4, 
        udf5 
      } = req.body || {};

      const key = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';
      const salt = process.env.PAYU_MERCHANT_SALT || 'eCwWELxi';
      const payuActionUrl = process.env.PAYU_ACTION_URL || 'https://test.payu.in/_payment';

      if (!txnid || !amount || !productinfo || !firstname) {
        return res.status(400).json({ 
          error: 'Missing required parameters: txnid, amount, productinfo, and firstname are mandatory.' 
        });
      }

      const formattedAmount = parseFloat(amount).toFixed(2);
      const cleanEmail = (email && String(email).trim()) || 'learner@skillgo.in';
      const cleanPhone = (phone && String(phone).trim()) || '9876543210';
      const cleanFirstname = String(firstname).trim();
      const cleanProductInfo = String(productinfo).trim();

      const cleanUdf1 = udf1 || '';
      const cleanUdf2 = udf2 || '';
      const cleanUdf3 = udf3 || '';
      const cleanUdf4 = udf4 || '';
      const cleanUdf5 = udf5 || '';

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
    } catch (error: any) {
      console.error('Error generating PayU hash:', error);
      return res.status(500).json({ 
        error: 'Failed to generate payment hash', 
        details: error?.message 
      });
    }
  });

  /**
   * PayU Success / Failure Callback Redirect Handler
   * PayU posts form data back to surl / furl
   */
  app.post('/api/payment-callback', (req, res) => {
    const { status, txnid, amount, hash } = req.body || {};
    const isSuccess = status === 'success';
    res.redirect(`/?payment=${isSuccess ? 'success' : 'failed'}&txnid=${txnid || ''}&amount=${amount || ''}`);
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
