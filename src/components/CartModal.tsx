import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  CreditCard, 
  Smartphone, 
  Plus,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  UserCheck,
  User,
  Phone,
  MapPin,
  Lock,
  RefreshCw,
  AlertCircle,
  QrCode,
  Mail
} from 'lucide-react';
import { useCartState, useEnrollmentState, enrollmentStore } from '../lib/enrollmentStore';
import { Button, Badge } from './ui';
import { useRouter } from '../lib/router';
import { CartItem } from '../lib/types';
import { initiatePayUPayment } from '../lib/payu';

const POPULAR_CITIES = [
  'Delhi NCR',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad'
];

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 'cart' | 'register' | 'checkout';
}

export function CartModal({ isOpen, onClose, initialStep = 'cart' }: CartModalProps) {
  const { cart, itemCount, totalAmount, removeFromCart, clearCart, checkoutOrder } = useCartState();
  const { profile, isRegistered } = useEnrollmentState();
  const { navigate } = useRouter();

  const [step, setStep] = useState<'cart' | 'register' | 'checkout' | 'success'>(initialStep);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [userEmail, setUserEmail] = useState(profile?.email && profile.email !== 'learner@skillgo.in' ? profile.email : '');
  const [isPayuRedirecting, setIsPayuRedirecting] = useState(false);
  const [payuError, setPayuError] = useState<string | null>(null);

  // Mandatory Registration Form States (used when user skipped onboarding or needs registration)
  const [regName, setRegName] = useState(profile?.name && profile.name !== 'Learner' ? profile.name : '');
  const [regPhone, setRegPhone] = useState(profile?.phone ? profile.phone.replace('+91', '').trim() : '');
  const [regCity, setRegCity] = useState(profile?.city || 'Delhi NCR');
  const [regCustomCity, setRegCustomCity] = useState('');
  const [regOtp, setRegOtp] = useState<string[]>(['4', '2', '8', '9', '0', '1']);
  const [regOtpVerified, setRegOtpVerified] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync step & profile when reopened
  useEffect(() => {
    if (isOpen) {
      if (initialStep === 'checkout' && !enrollmentStore.isRegistered()) {
        setStep('register');
      } else {
        setStep(initialStep);
      }
      setIsProcessing(false);
      setRegErrors({});
      if (profile?.name && profile.name !== 'Learner') {
        setRegName(profile.name);
      }
      if (profile?.phone) {
        setRegPhone(profile.phone.replace('+91', '').trim());
      }
      if (profile?.email && profile.email !== 'learner@skillgo.in') {
        setUserEmail(profile.email);
      }
    }
  }, [isOpen, initialStep, profile]);

  // Timer countdown for registration OTP
  useEffect(() => {
    let interval: any = null;
    if (step === 'register' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    // Check if learner has completed registration
    const registered = enrollmentStore.isRegistered();
    if (!registered) {
      // Mandate registration before payment
      setStep('register');
    } else {
      setStep('checkout');
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const next = [...regOtp];
      next[index] = '';
      setRegOtp(next);
      return;
    }

    if (clean.length > 1) {
      const digits = clean.slice(0, 6).split('');
      const next = [...regOtp];
      digits.forEach((d, i) => {
        if (i < 6) next[i] = d;
      });
      setRegOtp(next);
      otpInputRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    const next = [...regOtp];
    next[index] = clean.charAt(0);
    setRegOtp(next);

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !regOtp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setResendTimer(30);
    setCanResend(false);
    setRegOtp(['', '', '', '', '', '']);
    setOtpNotice('New verification code sent via SMS');
    setTimeout(() => setOtpNotice(null), 3000);
    otpInputRefs.current[0]?.focus();
  };

  const handleAutoFillTestOtp = () => {
    setRegOtp(['4', '2', '8', '9', '0', '1']);
    setRegOtpVerified(true);
    setOtpNotice('Test verification OTP (428901) applied');
    setTimeout(() => setOtpNotice(null), 3000);
  };

  const handleCompleteRegistrationAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!regName.trim()) {
      newErrors.name = 'Please enter your full candidate name';
    }

    const cleanPhone = regPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    const effectiveCity = regCustomCity.trim() || regCity;
    if (!effectiveCity.trim()) {
      newErrors.city = 'Please select or enter your city';
    }

    const enteredOtp = regOtp.join('');
    if (!regOtpVerified && enteredOtp.length < 6) {
      newErrors.otp = 'Please enter the 6-digit OTP sent to your phone';
    }

    if (Object.keys(newErrors).length > 0) {
      setRegErrors(newErrors);
      return;
    }

    // Save registration in store with full storage wipe, unique profile generation, and fresh cart session
    const currentCartSnapshot = [...cart];
    const newProfile = enrollmentStore.completeOnboarding({
      name: regName.trim(),
      phone: cleanPhone,
      city: effectiveCity.trim(),
      email: userEmail.trim() || undefined
    }, currentCartSnapshot);

    if (!userEmail.trim() && newProfile.email) {
      setUserEmail(newProfile.email);
    }

    // Move to payment checkout step
    setRegErrors({});
    setStep('checkout');
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderResult = checkoutOrder(paymentMethod);
      setCompletedOrder(orderResult);
      setIsProcessing(false);
      setStep('success');
    }, 750);
  };

  const handlePayUNow = async () => {
    try {
      setIsPayuRedirecting(true);
      setPayuError(null);

      // 1. Extract fresh candidate profile & credentials dynamically
      const latestProfile = enrollmentStore.getProfile();
      const candidateName = (latestProfile.name && latestProfile.name !== 'Learner')
        ? latestProfile.name
        : (regName.trim() || 'Learner');

      const candidatePhone = (latestProfile.phone && latestProfile.phone.replace(/\D/g, '').length >= 10)
        ? latestProfile.phone.replace(/\D/g, '')
        : (regPhone.replace(/\D/g, '') || '9876543210');

      const emailPrefix = candidateName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'learner';
      const candidateEmail = userEmail.trim() || (latestProfile.email && latestProfile.email !== 'learner@skillgo.in' ? latestProfile.email : `${emailPrefix}${Math.floor(100 + Math.random() * 900)}@gmail.com`);

      // 2. Generate completely unique dynamic Transaction ID on every single click
      const dynamicTxnid = 'TXN-' + Date.now() + '-' + Math.floor(100000 + Math.random() * 900000);

      // 3. Build dynamic productinfo from current cart items with order suffix to avoid duplicates
      const cartTitles = cart.map(i => i.title).filter(Boolean);
      const baseProductTitle = cartTitles.length > 0 
        ? cartTitles.join(', ').slice(0, 60) 
        : 'SkillGo Certification Course';
      const dynamicProductInfo = `${baseProductTitle} Order ${dynamicTxnid.slice(-6)}`;

      // 4. Clean dynamic numeric total amount
      const dynamicAmount = totalAmount > 0 ? totalAmount : 199.00;

      await initiatePayUPayment({
        txnid: dynamicTxnid,
        amount: dynamicAmount,
        productinfo: dynamicProductInfo,
        firstname: candidateName,
        email: candidateEmail,
        phone: candidatePhone
      });
    } catch (err: any) {
      console.error('PayU payment error:', err);
      setPayuError(err?.message || 'Unable to connect to PayU Gateway.');
      setIsPayuRedirecting(false);
    }
  };

  const handleFinishAndNavigate = (targetScreen?: string, params?: any) => {
    onClose();
    if (targetScreen) {
      navigate(targetScreen as any, params);
    }
  };

  const handleAddMoreSkills = () => {
    onClose();
    navigate('choose-skill');
  };

  const handleAddMoreLibrary = () => {
    onClose();
    navigate('library');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" id="cart-modal-backdrop">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
        id="cart-modal-container"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              {step === 'register' ? <UserCheck className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {step === 'cart' && 'Your Cart'}
                {step === 'register' && 'Learner Registration'}
                {step === 'checkout' && 'Secure Checkout & Payment'}
                {step === 'success' && 'Order Confirmed'}
              </h3>
              {step === 'cart' && (
                <p className="text-[11px] text-slate-500 font-medium">
                  {itemCount === 0 ? 'Empty cart' : `${itemCount} item${itemCount > 1 ? 's' : ''} • Ready to Enroll`}
                </p>
              )}
              {step === 'register' && (
                <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  Mandatory before payment for certification
                </p>
              )}
              {step === 'checkout' && (
                <p className="text-[11px] text-slate-500 font-medium">
                  Total Payable: ₹{totalAmount} • Instant Activation
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer text-sm font-semibold"
            id="cart-close-button"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: CART VIEW */}
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">Your cart is empty</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore our job-ready skill courses and bite-sized library SOPs to add items to your cart.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => { onClose(); navigate('choose-skill'); }}
                    >
                      Browse Skills
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { onClose(); navigate('library'); }}
                    >
                      Browse Library
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cart.map((item: CartItem) => (
                      <div 
                        key={item.id}
                        className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all hover:border-slate-300"
                      >
                        {/* Thumbnail */}
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-slate-200/60"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                            {item.productType === 'skill' ? 'SKILL' : 'LIB'}
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              item.productType === 'skill'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {item.productType === 'skill' ? 'Skill Track' : 'Library Module'}
                            </span>
                            {item.selectedPlan && (
                              <span className="text-[11px] font-bold text-slate-600 uppercase">
                                {item.selectedPlan === 'pro' ? 'Pro Plan' : 'Lite Plan'}
                              </span>
                            )}
                            {item.duration && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                • {item.duration}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {item.title}
                          </h4>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm sm:text-base font-black text-slate-900">
                              ₹{item.price}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Subtotal ({itemCount} item{itemCount > 1 ? 's' : ''})</span>
                      <span className="font-semibold text-slate-900">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Instant Access Fee</span>
                      <span className="font-semibold text-emerald-600">FREE</span>
                    </div>
                    <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                      <span className="text-sm font-bold">Total Payable</span>
                      <span className="text-xl sm:text-2xl font-black text-[#0B192C]">₹{totalAmount}</span>
                    </div>
                  </div>

                  {/* Primary Decision Actions: Pay Now vs Add More */}
                  <div className="space-y-3 pt-2">
                    {/* Pay Button */}
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-full justify-center text-sm font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl cursor-pointer flex items-center gap-2"
                      onClick={handleProceedToCheckout}
                      id="cart-proceed-pay-button"
                    >
                      <span>Proceed to Checkout (₹{totalAmount})</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>

                    {/* Add More Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={handleAddMoreSkills}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-600" />
                        <span>+ Add More Skills</span>
                      </button>

                      <button
                        onClick={handleAddMoreLibrary}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        <span>+ Add Library SOPs</span>
                      </button>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full py-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer text-center"
                    >
                      Close & Keep Browsing
                    </button>
                  </div>

                </div>
              )}
            </>
          )}

          {/* STEP 1.5: MANDATORY REGISTRATION (If user skipped onboarding on landing page) */}
          {step === 'register' && (
            <form onSubmit={handleCompleteRegistrationAndProceed} className="space-y-4.5 animate-in fade-in duration-200">
              
              {/* Notice Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900">Registration Mandatory Before Payment</div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    You skipped registration on the home page. Please enter your verified candidate details so we can issue your official certificate credentials and invoice.
                  </p>
                </div>
              </div>

              {/* Order Amount Preview */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                <span className="text-slate-600 font-medium">Cart Total ({cart.length} item{cart.length > 1 ? 's' : ''}):</span>
                <span className="font-black text-slate-900 text-sm">₹{totalAmount}</span>
              </div>

              {/* Form Field 1: Candidate Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Full Candidate Name <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => { setRegName(e.target.value); if (regErrors.name) setRegErrors({ ...regErrors, name: '' }); }}
                  placeholder="Enter full name (e.g. Vikram Sharma)"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                    regErrors.name ? 'border-rose-300 ring-rose-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
                  }`}
                  id="checkout-reg-name"
                  autoFocus
                />
                {regErrors.name && (
                  <p className="text-[11px] text-rose-600 font-medium">{regErrors.name}</p>
                )}
                <p className="text-[10px] text-slate-400">This legal name will appear on your verified SkillGo certificate.</p>
              </div>

              {/* Form Field 2: Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>10-Digit Mobile Number <span className="text-rose-500">*</span></span>
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 text-xs font-bold text-slate-600 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={regPhone}
                    onChange={e => {
                      const clean = e.target.value.replace(/\D/g, '');
                      setRegPhone(clean);
                      if (regErrors.phone) setRegErrors({ ...regErrors, phone: '' });
                    }}
                    placeholder="98765 43210"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-r-xl focus:outline-none focus:ring-2 ${
                      regErrors.phone ? 'border-rose-300 ring-rose-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
                    }`}
                    id="checkout-reg-phone"
                  />
                </div>
                {regErrors.phone && (
                  <p className="text-[11px] text-rose-600 font-medium">{regErrors.phone}</p>
                )}
              </div>

              {/* Form Field 3: 6-Digit OTP */}
              <div className="space-y-2 bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Enter 6-Digit SMS OTP <span className="text-rose-500">*</span></span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoFillTestOtp}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                  >
                    Quick Auto-Fill (428901)
                  </button>
                </div>

                <div className="flex items-center justify-between gap-1.5">
                  {regOtp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { otpInputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      className="w-10 h-10 sm:w-11 sm:h-11 text-center font-bold text-base bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-500">
                    {canResend ? (
                      <button 
                        type="button" 
                        onClick={handleResendOtp}
                        className="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Resend OTP
                      </button>
                    ) : (
                      <span>Resend code in {resendTimer}s</span>
                    )}
                  </span>
                  {otpNotice && (
                    <span className="text-emerald-700 font-bold animate-in fade-in">{otpNotice}</span>
                  )}
                </div>
                {regErrors.otp && (
                  <p className="text-[11px] text-rose-600 font-medium">{regErrors.otp}</p>
                )}
              </div>

              {/* Form Field 4: Select City */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>City of Residence <span className="text-rose-500">*</span></span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CITIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setRegCity(c); setRegCustomCity(''); }}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                        regCity === c && !regCustomCity
                          ? 'bg-blue-50 border-blue-500 text-blue-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {regErrors.city && (
                  <p className="text-[11px] text-rose-600 font-medium">{regErrors.city}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center text-sm font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl cursor-pointer flex items-center gap-2"
                  id="checkout-register-continue-btn"
                >
                  <span>Complete Registration & Pay ₹{totalAmount}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
                >
                  ← Back to Cart
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: CHECKOUT & PAYMENT */}
          {step === 'checkout' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Registered Learner & Invoice Email */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        Learner: {(profile.name && profile.name !== 'Learner') ? profile.name : (regName || 'Learner')}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {profile.phone || (regPhone ? `+91 ${regPhone}` : '')} • {profile.city || regCity || 'Delhi NCR'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep('register')}
                    className="text-[11px] font-bold text-blue-600 hover:underline shrink-0 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* Email input for PayU receipt */}
                <div className="pt-2 border-t border-emerald-100 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <input
                    type="email"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    placeholder="learner.email@example.com (for PayU receipt)"
                    className="w-full text-xs bg-white/90 border border-emerald-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
                    id="checkout-payu-email-input"
                  />
                </div>
              </div>

              {/* Order Items Recap */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 pb-2 border-b border-slate-200">
                  <span>Order Items ({cart.length})</span>
                  <button onClick={() => setStep('cart')} className="text-blue-600 hover:underline cursor-pointer text-xs">
                    Edit Cart
                  </button>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
                  {cart.map(item => (
                    <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <span className="font-bold text-slate-900">{item.title}</span>
                        <span className="text-slate-500 text-[10px] block">
                          {item.productType === 'skill' ? `Skill (${item.selectedPlan?.toUpperCase()})` : 'Library SOP Module'}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">₹{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900">
                  <span className="text-xs">Final Amount:</span>
                  <span className="text-lg font-black text-blue-700">₹{totalAmount}</span>
                </div>
              </div>

              {/* PayU Gateway Highlight Box */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">PayU Payment Gateway</h4>
                      <p className="text-[10px] text-blue-700 font-semibold">Test Sandbox • UPI QR, Cards & NetBanking</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">
                    Live SHA512
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Clicking <strong>Pay Now</strong> calls our backend (<code className="text-[10px] bg-white px-1 py-0.5 rounded border border-blue-200 font-mono">/api/payment-hash</code>) to securely generate your PayU signature hash and redirects directly to the PayU checkout page.
                </p>

                {payuError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2.5 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-medium">{payuError}</span>
                  </div>
                )}

                {/* Primary PayU Action Button */}
                <button
                  type="button"
                  onClick={handlePayUNow}
                  disabled={isPayuRedirecting}
                  className="w-full bg-[#0B192C] hover:bg-blue-900 active:bg-[#071220] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  id="payu-direct-checkout-btn"
                >
                  {isPayuRedirecting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Hash & Redirecting to PayU...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span>Pay Now with PayU (₹{totalAmount}) →</span>
                    </>
                  )}
                </button>
              </div>

              {/* Alternative / Offline Test Simulator Option */}
              <div className="pt-1">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-slate-400">or Instant Preview Simulator</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-xs font-semibold text-slate-700 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100"
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  id="checkout-instant-simulator-btn"
                >
                  {isProcessing ? 'Authorizing instant simulation...' : `Instant Simulator Pass (₹${totalAmount})`}
                </Button>
              </div>

              {/* Back button */}
              <button
                onClick={() => setStep('cart')}
                className="w-full py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
              >
                ← Back to Cart
              </button>
            </div>
          )}

          {/* STEP 3: PAYMENT SUCCESS CONFIRMATION */}
          {step === 'success' && completedOrder && (
            <div className="space-y-6 text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <Badge variant="emerald">Payment Successful</Badge>
                <h3 className="text-xl font-black text-slate-900">
                  All Selected Products Unlocked!
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Order ID: {completedOrder.orderId} • Total: ₹{completedOrder.totalAmount}
                </p>
              </div>

              {/* Unlocked Products Breakdown */}
              <div className="bg-[#F8FAFC] border border-emerald-200/80 rounded-2xl p-4 text-left space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Unlocked in this order:
                </div>

                {/* Enrolled Roles */}
                {completedOrder.enrolledRoles && completedOrder.enrolledRoles.length > 0 && (
                  <div className="space-y-2">
                    {completedOrder.enrolledRoles.map((r: any) => (
                      <div key={r.roleId} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-xs text-slate-900 block truncate">{r.title}</span>
                            <span className="text-[10px] text-blue-600 font-semibold">{r.plan.toUpperCase()} Plan Track</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="blue" 
                          className="shrink-0 text-xs py-1"
                          onClick={() => handleFinishAndNavigate('course-modules', { roleId: r.roleId, skillId: r.skillId, plan: r.plan })}
                        >
                          Start →
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Purchased Library Modules */}
                {completedOrder.purchasedModules && completedOrder.purchasedModules.length > 0 && (
                  <div className="space-y-2">
                    {completedOrder.purchasedModules.map((m: any) => (
                      <div key={m.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <Layers className="w-4 h-4 text-orange-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-xs text-slate-900 block truncate">{m.title}</span>
                            <span className="text-[10px] text-emerald-600 font-semibold">Library Module (Unlocked)</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="shrink-0 text-xs py-1"
                          onClick={() => handleFinishAndNavigate('library')}
                        >
                          Read →
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Final CTAs */}
              <div className="space-y-2 pt-2">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full justify-center"
                  onClick={() => handleFinishAndNavigate('my-learning')}
                >
                  Go to My Learning Dashboard →
                </Button>
                <button
                  onClick={() => handleFinishAndNavigate('home')}
                  className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
