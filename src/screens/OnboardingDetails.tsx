import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../lib/router';
import { enrollmentStore } from '../lib/enrollmentStore';
import { Button, SkillGoLogo } from '../components/ui';
import { User, Phone, MapPin, Search, ChevronDown, Check, Sparkles, ShieldCheck, CheckCircle2, RefreshCw, Lock } from 'lucide-react';

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
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  
  // Inline OTP state under Phone Number
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // City dropdown state
  const [citySearch, setCitySearch] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  
  const [errors, setErrors] = useState<{ name?: string; phone?: string; city?: string; otp?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean; city?: boolean }>({});

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval: any = null;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const validatePhone = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    setIsOtpVerified(false);
    
    // Auto-open OTP section when valid 10-digit number is typed
    if (raw.length === 10 && /^[6-9]/.test(raw)) {
      setOtpSent(true);
      setResendTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setOtpError(null);
      setErrors(prev => ({ ...prev, phone: undefined }));
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } else {
      setOtpSent(false);
    }

    if (touched.phone) {
      if (!raw) {
        setErrors(prev => ({ ...prev, phone: 'Mobile number is required' }));
      } else if (!validatePhone(raw)) {
        setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit mobile number' }));
      } else {
        setErrors(prev => ({ ...prev, phone: undefined }));
      }
    }
  };

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }));
    if (!name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Please enter your name' }));
    } else {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handlePhoneBlur = () => {
    setTouched(prev => ({ ...prev, phone: true }));
    if (!phone) {
      setErrors(prev => ({ ...prev, phone: 'Mobile number is required' }));
    } else if (!validatePhone(phone)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit mobile number' }));
    } else {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    // Handle paste
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

    // Auto move forward
    if (index < 5 && cleanValue) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits entered
    if (index === 5 && cleanValue && newOtp.every(d => d !== '')) {
      triggerVerifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const triggerVerifyOtp = (code: string) => {
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError(null);

    setTimeout(() => {
      setIsVerifyingOtp(false);
      setIsOtpVerified(true);
      setErrors(prev => ({ ...prev, otp: undefined }));
    }, 450);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setResendTimer(30);
    setCanResend(false);
    setResendSuccess(true);
    setOtpError(null);
    setOtp(['', '', '', '', '', '']);
    setIsOtpVerified(false);
    otpInputRefs.current[0]?.focus();
    setTimeout(() => setResendSuccess(false), 3000);
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setIsCityDropdownOpen(false);
    setCitySearch('');
    setTouched(prev => ({ ...prev, city: true }));
    setErrors(prev => ({ ...prev, city: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; phone?: string; city?: string; otp?: string } = {};
    if (!name.trim()) newErrors.name = 'Please enter your name';
    if (!phone || !validatePhone(phone)) newErrors.phone = 'Please enter a valid 10-digit mobile number';
    if (!city.trim()) newErrors.city = 'Please select your city';
    if (phone && validatePhone(phone) && !isOtpVerified) {
      newErrors.otp = 'Please verify your mobile number with the 6-digit OTP';
    }

    setTouched({ name: true, phone: true, city: true });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Complete onboarding & store profile
    enrollmentStore.completeOnboarding({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim()
    });

    navigate('home');
  };

  const handleSkip = () => {
    // Allows immediate exploration of SkillGo Home as a guest
    // Registration will be mandated during checkout before payment
    enrollmentStore.skipOnboarding();
    navigate('home');
  };

  const filteredCities = POPULAR_CITIES.filter(c => 
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col justify-between selection:bg-blue-600 selection:text-white" id="onboarding-details-screen">
      
      {/* Top Minimal Header */}
      <header className="w-full py-5 px-6 sm:px-10 flex items-center justify-between border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <SkillGoLogo />
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
          id="top-skip-button"
        >
          Skip to Home →
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-9 shadow-sm">
          
          {/* Header Title & Subtitle */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              Quick Learner Setup
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What's your name?
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1.5 leading-relaxed">
              Enter your basic details to set up your SkillGo learning profile and start your job-ready journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 1. NAME FIELD */}
            <div>
              <label htmlFor="learner-name-input" className="block text-sm font-bold text-slate-800 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="learner-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (touched.name && e.target.value.trim()) {
                      setErrors(prev => ({ ...prev, name: undefined }));
                    }
                  }}
                  onBlur={handleNameBlur}
                  placeholder="Enter your name"
                  className={`w-full pl-10 pr-4 py-3 text-base rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                    errors.name 
                      ? 'border-red-400 focus:ring-2 focus:ring-red-500/20' 
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs font-semibold text-red-500 flex items-center gap-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* 2. PHONE NUMBER FIELD */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="learner-phone-input" className="block text-sm font-bold text-slate-800">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                {isOtpVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
              
              <div className="relative flex rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15 transition-all overflow-hidden">
                <div className="flex items-center gap-1 px-3 bg-slate-100/70 border-r border-slate-200 text-slate-700 font-semibold text-sm select-none">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <div className="relative flex-1 flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="learner-phone-input"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    placeholder="Enter your 10-digit mobile number"
                    className="w-full pl-9 pr-4 py-3 text-base bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    maxLength={10}
                  />
                </div>
              </div>
              
              {errors.phone && (
                <p className="mt-1 text-xs font-semibold text-red-500 flex items-center gap-1">
                  {errors.phone}
                </p>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 3. OTP SECTION (Directly Under Phone Number) */}
              {/* ───────────────────────────────────────────────────────────── */}
              {phone.length === 10 && validatePhone(phone) && (
                <div className="mt-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 animate-in fade-in slide-in-from-top-2 duration-200" id="inline-otp-section">
                  
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Lock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Enter 6-digit OTP sent to +91 {phone}</span>
                    </div>
                    {isOtpVerified && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  {resendSuccess && (
                    <div className="mb-2.5 p-2 rounded-lg bg-emerald-100/70 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>OTP resent to +91 {phone}</span>
                    </div>
                  )}

                  {/* 6 OTP Input Boxes */}
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        disabled={isOtpVerified}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-10 sm:w-12 h-11 sm:h-12 text-center text-lg sm:text-xl font-black rounded-lg border transition-all ${
                          isOtpVerified
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : digit 
                            ? 'border-blue-600 bg-blue-50/30 text-blue-900 ring-2 ring-blue-600/10' 
                            : 'border-slate-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Inline OTP verification error */}
                  {(otpError || errors.otp) && (
                    <p className="mt-2 text-xs font-semibold text-red-500">
                      {otpError || errors.otp}
                    </p>
                  )}

                  {/* Resend & Auto-fill controls */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div>
                      {isOtpVerified ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mobile number verified
                        </span>
                      ) : canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                          id="inline-resend-otp-button"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium">
                          Resend in <strong className="text-slate-600">{resendTimer}s</strong>
                        </span>
                      )}
                    </div>

                    {!isOtpVerified && (
                      <button
                        type="button"
                        onClick={() => {
                          const demo = ['1', '2', '3', '4', '5', '6'];
                          setOtp(demo);
                          setOtpError(null);
                          triggerVerifyOtp('123456');
                        }}
                        className="text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        Auto-fill OTP (123456)
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* 4. CITY SELECTION */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                City / Location <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <button
                  type="button"
                  id="learner-city-select-button"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className={`w-full flex items-center justify-between pl-10 pr-4 py-3 text-left text-base rounded-xl border bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none transition-all ${
                    errors.city 
                      ? 'border-red-400 focus:ring-2 focus:ring-red-500/20' 
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15'
                  }`}
                >
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className={city ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                    {city || 'Select your city'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* City Dropdown Menu */}
                {isCityDropdownOpen && (
                  <div className="absolute z-30 mt-1.5 w-full bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-2.5 border-b border-slate-100 bg-slate-50/70">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          placeholder="Search or type city..."
                          className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                          autoFocus
                        />
                      </div>
                    </div>
                    
                    <div className="max-h-52 overflow-y-auto p-1.5">
                      {citySearch && !filteredCities.includes(citySearch) && (
                        <button
                          type="button"
                          onClick={() => handleCitySelect(citySearch)}
                          className="w-full text-left px-3.5 py-2 text-sm rounded-lg hover:bg-blue-50 text-blue-700 font-semibold flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>Use "{citySearch}"</span>
                        </button>
                      )}
                      
                      {filteredCities.map((cityName) => (
                        <button
                          key={cityName}
                          type="button"
                          onClick={() => handleCitySelect(cityName)}
                          className={`w-full text-left px-3.5 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
                            city === cityName 
                              ? 'bg-blue-50 text-blue-700 font-bold' 
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{cityName}</span>
                          {city === cityName && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {errors.city && (
                <p className="mt-1 text-xs font-semibold text-red-500 flex items-center gap-1">
                  {errors.city}
                </p>
              )}

              {/* Quick Popular City Chips */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1">Popular:</span>
                {['Delhi NCR', 'Bengaluru', 'Mumbai', 'Pune', 'Hyderabad'].map((quickCity) => (
                  <button
                    key={quickCity}
                    type="button"
                    onClick={() => handleCitySelect(quickCity)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                      city === quickCity 
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {quickCity}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. PRIMARY ACTION BUTTON */}
            <div className="pt-3 space-y-3">
              <Button
                type="submit"
                variant="blue"
                size="lg"
                className="w-full py-3.5 text-base font-bold shadow-md shadow-blue-500/20"
                id="onboarding-continue-button"
              >
                Continue →
              </Button>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 6. SKIP OPTION (Directly Under Continue Button) */}
              {/* ───────────────────────────────────────────────────────────── */}
              <button
                type="button"
                onClick={handleSkip}
                className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5 hover:underline"
                id="onboarding-skip-bottom-button"
              >
                <span>Skip for now, explore SkillGo</span>
                <span className="text-xs text-slate-400">→</span>
              </button>
            </div>

          </form>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        SkillGo • Vocational Career Acceleration Platform • Safe & Secure OTP Verification
      </footer>

    </div>
  );
}
