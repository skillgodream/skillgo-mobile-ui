import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../lib/router';
import { enrollmentStore } from '../lib/enrollmentStore';
import { SkillGoLogo } from '../components/ui';
import { User, Phone, MapPin, Search, ChevronDown, Check, Sparkles, CheckCircle2, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { sendSupabaseOtp, verifySupabaseOtp } from '../lib/supabase';

const POPULAR_CITIES = [
  'Delhi NCR',
  'Bengaluru',
  'Mumbai',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Indore',
  'Chandigarh',
  'Kochi',
  'Coimbatore',
  'Bhopal',
  'Patna',
  'Nagpur',
  'Surat',
  'Vadodara',
  'Visakhapatnam'
];

export function OnboardingDetailsScreen() {
  const { navigate } = useRouter();
  
  // Step-by-step wizard state: 1 = Name, 2 = City, 3 = Phone, 4 = OTP
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  
  // OTP state
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);

  // City dropdown state
  const [citySearch, setCitySearch] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval: any = null;
    if (step === 4 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Focus management on step change
  useEffect(() => {
    setError(null);
    if (step === 1) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    } else if (step === 3) {
      setTimeout(() => phoneInputRef.current?.focus(), 100);
    } else if (step === 4) {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    }
  }, [step]);

  const validatePhone = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name to proceed.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please select or enter your city.');
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleNextFromStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (!validatePhone(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError(null);

    // Send live Supabase OTP
    await sendSupabaseOtp({
      phone: cleanPhone,
      name: name.trim(),
      city: city.trim()
    });

    setStep(4);
    setResendTimer(30);
    setCanResend(false);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    if (cleanValue.length > 1) {
      const digits = cleanValue.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      if (digits.length === 6) {
        triggerVerifyOtp(newOtp.join(''));
      } else {
        const nextIdx = Math.min(digits.length, 5);
        otpInputRefs.current[nextIdx]?.focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanValue.charAt(0);
    setOtp(newOtp);
    setOtpError(null);

    if (index < 5 && cleanValue) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && cleanValue && newOtp.every(d => d !== '')) {
      triggerVerifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const triggerVerifyOtp = async (code: string) => {
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      await verifySupabaseOtp({
        phone,
        token: code
      });

      setIsVerifyingOtp(false);
      setIsOtpVerified(true);

      // Complete onboarding and navigate home
      enrollmentStore.completeOnboarding({
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim()
      });

      setTimeout(() => {
        navigate('home');
      }, 600);
    } catch (err: any) {
      setIsVerifyingOtp(false);
      setOtpError(err?.message || 'Verification failed. Please check OTP.');
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setResendTimer(30);
    setCanResend(false);
    setResendSuccess(true);
    setOtpError(null);
    setOtp(['', '', '', '', '', '']);
    otpInputRefs.current[0]?.focus();

    await sendSupabaseOtp({
      phone,
      name: name.trim(),
      city: city.trim()
    });

    setTimeout(() => setResendSuccess(false), 3000);
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setIsCityDropdownOpen(false);
    setCitySearch('');
    setError(null);
    setStep(3); // Automatically progress to Phone after city selection
  };

  const handleSkip = () => {
    enrollmentStore.skipOnboarding();
    navigate('home');
  };

  const filteredCities = POPULAR_CITIES.filter(c => 
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  // Dynamic Theme Styling based on active step
  const getStepTheme = () => {
    switch (step) {
      case 1:
        return {
          gradient: 'from-rose-500 via-pink-500 to-red-600',
          bgBlob: 'bg-gradient-to-tr from-rose-400/20 via-pink-300/20 to-orange-200/30',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          buttonClass: 'bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 hover:opacity-95 shadow-lg shadow-rose-500/25 text-white',
          stepLabel: 'Step 1 of 4 • Your Name'
        };
      case 2:
        return {
          gradient: 'from-amber-500 via-orange-500 to-emerald-600',
          bgBlob: 'bg-gradient-to-tr from-amber-300/20 via-orange-300/20 to-emerald-200/30',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          buttonClass: 'bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 hover:opacity-95 shadow-lg shadow-orange-500/25 text-white',
          stepLabel: 'Step 2 of 4 • Your City'
        };
      case 3:
      case 4:
      default:
        return {
          gradient: 'from-violet-600 via-purple-600 to-indigo-700',
          bgBlob: 'bg-gradient-to-tr from-violet-400/20 via-purple-300/20 to-indigo-300/30',
          badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
          buttonClass: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 hover:opacity-95 shadow-lg shadow-purple-600/25 text-white',
          stepLabel: step === 3 ? 'Step 3 of 4 • Mobile Number' : 'Step 4 of 4 • OTP Verification'
        };
    }
  };

  const theme = getStepTheme();

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden flex flex-col justify-between selection:bg-purple-600 selection:text-white" id="onboarding-wizard-screen">
      
      {/* Dynamic Organic Fluid Background Waves & Blobs */}
      <div className="absolute top-0 right-0 -w-96 -h-96 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-70 translate-x-1/3 -translate-y-1/3 bg-gradient-to-br from-purple-300/40 via-pink-300/30 to-amber-200/30" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-60 -translate-x-1/3 translate-y-1/3 bg-gradient-to-tr from-rose-200/40 via-indigo-200/30 to-emerald-200/30" />

      {/* Organic SVG Wave Header/Footer Accent */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-40 overflow-hidden leading-none z-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-24 text-purple-200/40 fill-current">
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,50 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* Top Minimal Header */}
      <header className="relative z-10 w-full py-5 px-6 sm:px-10 flex items-center justify-end border-b border-amber-100/60 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => {
                if (step === 2) setStep(1);
                else if (step === 3) setStep(2);
                else if (step === 4) setStep(3);
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer shadow-sm"
            id="top-skip-button"
          >
            Skip to Home →
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-lg mb-8 sm:mb-10 flex justify-center">
          <SkillGoLogo size="3xl" />
        </div>
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-2xl shadow-indigo-950/5">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${theme.badgeBg}`}>
              <Sparkles className="w-3.5 h-3.5" />
              {theme.stepLabel}
            </div>

            {/* Step Dots */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === step 
                      ? 'w-8 bg-gradient-to-r ' + theme.gradient 
                      : s < step 
                      ? 'w-2 bg-emerald-500' 
                      : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 1: NAME */}
          {/* ───────────────────────────────────────────────────────────── */}
          {step === 1 && (
            <form onSubmit={handleNextFromStep1} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  What's your full name?
                </h1>
                <p className="text-slate-500 text-sm sm:text-base mt-2 leading-relaxed">
                  Let's personalize your SkillGo career acceleration experience with your name.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="name-input" className="block text-sm font-bold text-slate-800">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    ref={nameInputRef}
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-12 pr-4 py-3.5 text-base rounded-2xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all font-medium"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  {error}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${theme.buttonClass}`}
                >
                  <span>Continue to City</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 2: CITY */}
          {/* ───────────────────────────────────────────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleNextFromStep2} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Which city are you in?
                </h1>
                <p className="text-slate-500 text-sm sm:text-base mt-2 leading-relaxed">
                  We match you with regional job placement partners and live employer drives near {city || 'you'}.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800">
                  Select or Search City <span className="text-rose-500">*</span>
                </label>
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="w-full flex items-center justify-between pl-12 pr-4 py-3.5 text-left text-base rounded-2xl border border-slate-200 bg-slate-50/60 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all font-medium cursor-pointer"
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className={city ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      {city || 'Choose your city'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* City Dropdown Menu */}
                  {isCityDropdownOpen && (
                    <div className="absolute z-30 mt-2 w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 border-b border-slate-100 bg-slate-50">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                            placeholder="Type city name..."
                            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
                            autoFocus
                          />
                        </div>
                      </div>
                      
                      <div className="max-h-56 overflow-y-auto p-1.5">
                        {citySearch && !filteredCities.includes(citySearch) && (
                          <button
                            type="button"
                            onClick={() => handleCitySelect(citySearch)}
                            className="w-full text-left px-4 py-2.5 text-sm rounded-xl hover:bg-amber-50 text-amber-800 font-bold flex items-center gap-2"
                          >
                            <MapPin className="w-4 h-4 text-amber-600" />
                            <span>Use "{citySearch}"</span>
                          </button>
                        )}
                        
                        {filteredCities.map((cityName) => (
                          <button
                            key={cityName}
                            type="button"
                            onClick={() => handleCitySelect(cityName)}
                            className={`w-full text-left px-4 py-2.5 text-sm rounded-xl flex items-center justify-between transition-colors font-medium ${
                              city === cityName 
                                ? 'bg-amber-50 text-amber-900 font-extrabold' 
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{cityName}</span>
                            {city === cityName && <Check className="w-4 h-4 text-amber-600" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Popular City Quick Chips */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-semibold mr-1">Popular:</span>
                  {['Delhi NCR', 'Bengaluru', 'Mumbai', 'Pune', 'Hyderabad'].map((quickCity) => (
                    <button
                      key={quickCity}
                      type="button"
                      onClick={() => handleCitySelect(quickCity)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                        city === quickCity 
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {quickCity}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  {error}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${theme.buttonClass}`}
                >
                  <span>Continue to Mobile Number</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 3: PHONE NUMBER */}
          {/* ───────────────────────────────────────────────────────────── */}
          {step === 3 && (
            <form onSubmit={handleNextFromStep3} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Enter your mobile number
                </h1>
                <p className="text-slate-500 text-sm sm:text-base mt-2 leading-relaxed">
                  We'll send a secure 6-digit OTP verification code via SMS to verify your account.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone-input" className="block text-sm font-bold text-slate-800">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                
                <div className="relative flex rounded-2xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-purple-600/15 transition-all overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 bg-slate-100 border-r border-slate-200 text-slate-800 font-bold text-sm select-none">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <div className="relative flex-1 flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <input
                      ref={phoneInputRef}
                      id="phone-input"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={phone}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone(raw);
                        setError(null);
                      }}
                      placeholder="98765 43210"
                      className="w-full pl-11 pr-4 py-3.5 text-base bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none font-bold tracking-wide"
                      maxLength={10}
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  {error}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${theme.buttonClass}`}
                >
                  <span>Send Verification OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 4: OTP VERIFICATION */}
          {/* ───────────────────────────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg mb-2">
                  <Lock className="w-3.5 h-3.5" />
                  SMS Sent to +91 {phone}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Enter 6-digit OTP
                </h1>
                <p className="text-slate-500 text-sm sm:text-base mt-1.5 leading-relaxed">
                  Enter the verification code sent to your mobile number.
                </p>
              </div>

              {resendSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>New OTP sent successfully via SMS</span>
                </div>
              )}

              {/* 6 OTP Input Boxes - STAYS COMPLETELY BLANK */}
              <div className="flex items-center justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    disabled={isOtpVerified || isVerifyingOtp}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`w-12 h-14 text-center text-xl font-black rounded-2xl border transition-all ${
                      isOtpVerified
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                        : digit 
                        ? 'border-purple-600 bg-purple-50/50 text-purple-900 ring-4 ring-purple-600/15' 
                        : 'border-slate-200 bg-slate-50/60 focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/15'
                    }`}
                  />
                ))}
              </div>

              {(otpError || error) && (
                <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  {otpError || error}
                </p>
              )}

              {isVerifyingOtp && (
                <div className="text-center py-2 text-sm font-bold text-purple-600 animate-pulse">
                  Verifying OTP securely with Supabase...
                </div>
              )}

              {isOtpVerified && (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-sm font-extrabold flex items-center justify-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Verification Successful! Launching SkillGo...</span>
                </div>
              )}

              {/* Resend & Auto-fill controls */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="font-bold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer"
                    >
                      Resend SMS OTP
                    </button>
                  ) : (
                    <span className="text-slate-400 font-medium">
                      Resend code in <strong className="text-slate-700">{resendTimer}s</strong>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Change mobile number
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => triggerVerifyOtp(otp.join(''))}
                  disabled={otp.join('').length < 6 || isVerifyingOtp || isOtpVerified}
                  className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    otp.join('').length === 6 && !isOtpVerified
                      ? theme.buttonClass
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{isVerifyingOtp ? 'Verifying...' : isOtpVerified ? 'Verified Successfully' : 'Verify & Launch SkillGo'}</span>
                  {!isVerifyingOtp && !isOtpVerified && <Check className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-400 border-t border-amber-100/60 bg-white/50 backdrop-blur-sm">
        SkillGo • Job-Ready Vocational Career Acceleration • Bank-Grade Secure Supabase Auth
      </footer>

    </div>
  );
}
