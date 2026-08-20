export interface PayUPaymentParams {
  txnid?: string;
  amount: number;
  productinfo: string;
  firstname: string;
  email?: string;
  phone?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  surl?: string;
  furl?: string;
}

export interface PayUHashResponse {
  success: boolean;
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  hash: string;
  actionUrl: string;
  isTestMode: boolean;
  error?: string;
}

/**
 * Initiates the PayU checkout flow:
 * 1. Generates unique transaction ID
 * 2. Fetches SHA512 signature hash from backend API (/api/payment-hash)
 * 3. Dynamically generates an HTML POST form and auto-submits directly to PayU Checkout
 */
export async function initiatePayUPayment(params: PayUPaymentParams): Promise<void> {
  const txnid = params.txnid || `SG_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  
  const surl = params.surl || `${origin}${currentPath}?payment=success&txnid=${txnid}`;
  const furl = params.furl || `${origin}${currentPath}?payment=failed&txnid=${txnid}`;

  const payload = {
    txnid,
    amount: params.amount,
    productinfo: params.productinfo || 'SkillGo Certification Track',
    firstname: params.firstname || 'Learner',
    email: params.email || 'learner@skillgo.in',
    phone: params.phone || '9876543210',
    udf1: params.udf1 || '',
    udf2: params.udf2 || '',
    udf3: params.udf3 || '',
    udf4: params.udf4 || '',
    udf5: params.udf5 || '',
    surl,
    furl
  };

  // 1. Call Backend to get secure SHA512 hash
  const response = await fetch('/api/payment-hash', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server returned status ${response.status} when generating PayU hash`);
  }

  const hashData: PayUHashResponse = await response.json();

  if (!hashData.hash || !hashData.key) {
    throw new Error(hashData.error || 'Invalid payment response received from server.');
  }

  // 2. Build and auto-submit form targeting PayU actionUrl (https://test.payu.in/_payment)
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = hashData.actionUrl || 'https://test.payu.in/_payment';
  form.id = 'payu-checkout-auto-form';
  form.style.display = 'none';

  const formFields: Record<string, string> = {
    key: hashData.key,
    txnid: hashData.txnid,
    amount: hashData.amount,
    productinfo: hashData.productinfo,
    firstname: hashData.firstname,
    email: hashData.email,
    phone: hashData.phone,
    surl: surl,
    furl: furl,
    hash: hashData.hash,
    service_provider: 'payu_paisa'
  };

  if (hashData.udf1) formFields.udf1 = hashData.udf1;
  if (hashData.udf2) formFields.udf2 = hashData.udf2;
  if (hashData.udf3) formFields.udf3 = hashData.udf3;
  if (hashData.udf4) formFields.udf4 = hashData.udf4;
  if (hashData.udf5) formFields.udf5 = hashData.udf5;

  Object.entries(formFields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  
  // 3. Submit directly to PayU Test Checkout page
  form.submit();
}
