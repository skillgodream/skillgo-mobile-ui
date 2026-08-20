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
      setError('Please enter your full name.');
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
    setStep(3);
  };

  const handleSkip = () => {
    enrollmentStore.skipOnboarding();
    navigate('home');
  };

  const filteredCities = POPULAR_CITIES.filter(c => 
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  // Apple-style background mesh gradient themes per step
  const getStepMeshTheme = () => {
    switch (step) {
      case 1:
        return {
          bgGradient: 'bg-gradient-to-br from-rose-600 via-pink-600 to-amber-500',
          meshBlobs: (
            <>
              <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-rose-400/50 blur-[120px] pointer-events-none animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-amber-400/40 blur-[140px] pointer-events-none" />
              <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] rounded-full bg-pink-500/40 blur-[100px] pointer-events-none" />
            </>
          ),
          buttonClass: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-95 shadow-lg shadow-rose-600/30 text-white',
          badgeText: 'Step 1 of 4 • Name'
        };
      case 2:
        return {
          bgGradient: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-500',
          meshBlobs: (
            <>
              <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-400/50 blur-[120px] pointer-events-none animate-pulse" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-amber-300/40 blur-[140px] pointer-events-none" />
              <div className="absolute top-[40%] left-[20%] w-[500px] h-[500px] rounded-full bg-teal-400/40 blur-[100px] pointer-events-none" />
            </>
          ),
          buttonClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-lg shadow-emerald-600/30 text-white',
          badgeText: 'Step 2 of 4 • City'
        };
      case 3:
      case 4:
      default:
        return {
          bgGradient: 'bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-800',
          meshBlobs: (
            <>
              <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-purple-500/50 blur-[130px] pointer-events-none animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-blue-500/40 blur-[150px] pointer-events-none" />
              <div className="absolute top-[30%] left-[30%] w-[500px] h-[500px] rounded-full bg-indigo-500/40 blur-[110px] pointer-events-none" />
            </>
          ),
          buttonClass: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-indigo-600/30 text-white',
          badgeText: step === 3 ? 'Step 3 of 4 • Mobile Number' : 'Step 4 of 4 • OTP'
        };
    }
  };

  const theme = getStepMeshTheme();

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col justify-between ${theme.bgGradient} transition-colors duration-700 selection:bg-white selection:text-indigo-900`} id="onboarding-apple-screen">
      
      {theme.meshBlobs}

      {/* Top Glass Header */}
      <header className="relative z-20 w-full py-4 px-6 sm:px-10 flex items-center justify-between backdrop-blur-md bg-white/10 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="bg-white/90 p-2 rounded-xl shadow-sm">
            <SkillGoLogo />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => {
                if (step === 2) setStep(1);
                else if (step === 3) setStep(2);
                else if (step === 4) setStep(3);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/15 hover:bg-white/25 border border-white/20 px-3.5 py-2 rounded-full transition-all backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 rounded-full transition-all backdrop-blur-md cursor-pointer shadow-sm"
            id="top-skip-button"
          >
            Skip →
          </button>
        </div>
      </header>

      {/* Main Content Area - Ultra Compact Card */}
      <main className="relative z-20 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[380px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[24px] border border-white/40 p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] transition-all">
          
          {/* Step Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {theme.badgeText}
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step 
                      ? 'w-5 bg-slate-900' 
                      : s < step 
                      ? 'w-1.5 bg-emerald-500' 
                      : 'w-1.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 1: NAME */}
          {/* ───────────────────────────────────────────────────────────── */}
          {step === 1 && (
            <form onSubmit={handleNextFromStep1} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Name
              </h1>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError(null);
                    }}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 font-medium transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs font-bold text-rose-500 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${theme.buttonClass}`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 2: CITY */}
          {/* ───────────────────────────────────────────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleNextFromStep2} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                City
              </h1>

              <div className="space-y-1 relative">
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="w-full flex items-center justify-between pl-11 pr-4 py-3 text-left text-sm rounded-xl border border-slate-200 bg-slate-50/80 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all cursor-pointer"
                >
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className={city ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                    {city || 'Select city'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* City Dropdown Menu */}
                {isCityDropdownOpen && (
                  <div className="absolute z-30 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-2 border-b border-slate-100 bg-slate-50">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          placeholder="Search city..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-medium"
                          autoFocus
                        />
                      </div>
                    </div>
                    
                    <div className="max-h-40 overflow-y-auto p-1">
                      {citySearch && !filteredCities.includes(citySearch) && (
                        <button
                          type="button"
                          onClick={() => handleCitySelect(citySearch)}
                          className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-emerald-50 text-emerald-900 font-bold flex items-center gap-2"
                        >
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Use "{citySearch}"</span>
                        </button>
                      )}
                      
                      {filteredCities.map((cityName) => (
                        <button
                          key={cityName}
                          type="button"
                          onClick={() => handleCitySelect(cityName)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors font-medium ${
                            city === cityName 
                              ? 'bg-emerald-50 text-emerald-900 font-bold' 
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{cityName}</span>
                          {city === cityName && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-xs font-bold text-rose-500 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${theme.buttonClass}`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 3: PHONE NUMBER */}
          {/* ───────────────────────────────────────────────────────────── */}
          {step === 3 && (
            <form onSubmit={handleNextFromStep3} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Mobile Number
              </h1>

              <div className="space-y-1">
                <div className="relative flex rounded-xl border border-slate-200 bg-slate-50/80 focus-within:bg-white focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/20 transition-all overflow-hidden">
                  <div className="flex items-center gap-1 px-3 bg-slate-100 border-r border-slate-200 text-slate-800 font-bold text-xs select-none">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <div className="relative flex-1 flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-600">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      ref={phoneInputRef}
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
                      className="w-full pl-9 pr-3 py-3 text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none font-bold tracking-wide"
                      maxLength={10}
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs font-bold text-rose-500 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${theme.buttonClass}`}
              >
                <span>Send OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 4: OTP VERIFICATION */}
          {/* ───────────────────────────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  OTP
                </h1>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  +91 {phone}
                </span>
              </div>

              {resendSuccess && (
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>OTP sent</span>
                </div>
              )}

              {/* 6 OTP Inputs */}
              <div className="flex items-center justify-between gap-1.5">
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
                    className={`w-9 h-11 text-center text-base font-black rounded-xl border transition-all ${
                      isOtpVerified
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                        : digit 
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-600/20' 
                        : 'border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
                    }`}
                  />
                ))}
              </div>

              {(otpError || error) && (
                <p className="text-xs font-bold text-rose-500 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {otpError || error}
                </p>
              )}

              {isVerifyingOtp && (
                <div className="text-center text-xs font-bold text-indigo-600 animate-pulse">
                  Verifying...
                </div>
              )}

              {isOtpVerified && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-extrabold flex items-center justify-center gap-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified! Launching...</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-0.5">
                <div>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Resend
                    </button>
                  ) : (
                    <span className="text-slate-400 font-medium">
                      Resend in <strong className="text-slate-700">{resendTimer}s</strong>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Change phone
                </button>
              </div>

              <button
                type="button"
                onClick={() => triggerVerifyOtp(otp.join(''))}
                disabled={otp.join('').length < 6 || isVerifyingOtp || isOtpVerified}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  otp.join('').length === 6 && !isOtpVerified
                    ? theme.buttonClass
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{isVerifyingOtp ? 'Verifying...' : isOtpVerified ? 'Verified' : 'Verify & Continue'}</span>
                {!isVerifyingOtp && !isOtpVerified && <Check className="w-4 h-4" />}
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-3 text-center text-[11px] text-white/70 backdrop-blur-md bg-white/5 border-t border-white/10">
        SkillGo • Secure Supabase Auth
      </footer>

    </div>
  );
}
