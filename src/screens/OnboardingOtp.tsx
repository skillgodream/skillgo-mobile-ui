import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../lib/router';
import { enrollmentStore } from '../lib/enrollmentStore';
import { Button, SkillGoLogo } from '../components/ui';
import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2, Lock } from 'lucide-react';
import { sendSupabaseOtp, verifySupabaseOtp } from '../lib/supabase';

export function OnboardingOtpScreen() {
  const { currentRoute, navigate } = useRouter();
  const params = currentRoute.params || {};

  const name = params.name || 'Learner';
  const rawPhone = params.phone || '9876543210';
  const city = params.city || 'Delhi NCR';

  // Format phone as +91 XXXXX XXXXX
  const formattedPhone = rawPhone.length === 10
    ? `+91 ${rawPhone.slice(0, 5)} ${rawPhone.slice(5)}`
    : `+91 ${rawPhone}`;

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 30s Countdown timer for Resend OTP
  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-focus first input on mount with blank state
  useEffect(() => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numbers
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    // Handle paste of full OTP
    if (cleanValue.length > 1) {
      const digits = cleanValue.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanValue.charAt(0);
    setOtp(newOtp);
    setError(null);

    // Auto move to next input box
    if (index < 5 && cleanValue) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setResendSuccess(true);
    setError(null);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    // Trigger live Supabase OTP request
    await sendSupabaseOtp({
      phone: rawPhone,
      name,
      city
    });

    setTimeout(() => setResendSuccess(false), 4000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');

    if (enteredOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Live Supabase verification
      await verifySupabaseOtp({
        phone: rawPhone,
        token: enteredOtp
      });

      setIsVerifying(false);
      setIsSuccess(true);

      // Save onboarding profile state
      enrollmentStore.completeOnboarding({
        name,
        phone: rawPhone,
        city
      });

      // Navigate to Home screen after a brief success animation
      setTimeout(() => {
        navigate('home');
      }, 700);
    } catch (err: any) {
      setIsVerifying(false);
      setError(err?.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col justify-between selection:bg-blue-600 selection:text-white" id="onboarding-otp-screen">
      
      {/* Top Header */}
      <header className="w-full py-5 px-6 sm:px-10 flex items-center justify-end border-b border-slate-100 bg-white">
        <button
          onClick={() => navigate('onboarding-details')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change details</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-lg mb-8 sm:mb-10 flex justify-center">
          <SkillGoLogo size="3xl" />
        </div>
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-9 shadow-sm">
          
          {/* Header Title & Subtitle */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Lock className="w-3.5 h-3.5" />
              Step 2 of 2: Security Verification
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verify your mobile number
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2 leading-relaxed">
              We’ve sent a 6-digit OTP to <strong className="text-slate-800 font-bold">{formattedPhone}</strong>
            </p>
            
            {/* Quick Action: Change Number */}
            <div className="mt-2">
              <button
                type="button"
                onClick={() => navigate('onboarding-details')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer inline-flex items-center gap-1"
                id="change-mobile-number-button"
              >
                Change mobile number
              </button>
            </div>
          </div>

          {resendSuccess && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>A new 6-digit OTP has been sent to {formattedPhone}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-7">
            
            {/* 6 OTP INPUT BOXES */}
            <div>
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-11 sm:w-14 h-13 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-xl border bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none transition-all ${
                      digit 
                        ? 'border-blue-600 bg-blue-50/20 text-blue-900 ring-2 ring-blue-600/10' 
                        : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="mt-2 text-xs font-semibold text-red-500 text-center">
                  {error}
                </p>
              )}

              {/* Security Helper Note */}
              <div className="mt-3.5 flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Enter the 6-digit authentication code</span>
                <span className="text-slate-400">Encrypted SMS OTP</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div>
              <Button
                type="submit"
                variant="blue"
                size="lg"
                className="w-full py-4 text-base font-bold shadow-md shadow-blue-500/20"
                disabled={isVerifying || isSuccess}
                id="otp-verify-button"
              >
                {isSuccess ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    Verified! Loading SkillGo...
                  </span>
                ) : isVerifying ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying OTP...
                  </span>
                ) : (
                  'Verify & Continue →'
                )}
              </Button>
            </div>

            {/* Resend OTP Section */}
            <div className="pt-2 text-center text-sm border-t border-slate-100">
              <span className="text-slate-500">Didn't receive the OTP? </span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  id="resend-otp-button"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="font-semibold text-slate-400">
                  Resend in <span className="text-slate-600 font-bold">{timer}s</span>
                </span>
              )}
            </div>

          </form>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        SkillGo • Secure 256-Bit Encrypted OTP Verification
      </footer>

    </div>
  );
}
