import React, { useState } from 'react';
import { RouterProvider, useRouter } from './lib/router';
import { SkillGoLogo, Button, Badge, Modal } from './components/ui';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingDetailsScreen } from './screens/OnboardingDetails';
import { OnboardingOtpScreen } from './screens/OnboardingOtp';
import { HomeScreen } from './screens/Home';
import { ChooseSkillScreen } from './screens/ChooseSkill';
import { RoleDetailScreen } from './screens/RoleDetail';
import { ChoosePlanScreen } from './screens/ChoosePlan';
import { CourseModulesScreen } from './screens/CourseModules';
import { ModuleVideoScreen } from './screens/ModuleVideo';
import { ModuleQuizScreen } from './screens/ModuleQuiz';
import { CourseCompleteScreen } from './screens/CourseComplete';
import { PracticalTrainingScreen } from './screens/PracticalTraining';
import { FinalAssessmentScreen } from './screens/FinalAssessment';
import { MyLearningScreen } from './screens/MyLearning';
import { LibraryScreen } from './screens/Library';
import { CertificateScreen } from './screens/Certificate';
import { useEnrollmentState, useCartState, enrollmentStore, cartStore } from './lib/enrollmentStore';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  BookOpen, 
  Layers, 
  Award, 
  Sparkles,
  Compass,
  Briefcase,
  GraduationCap,
  Zap,
  Home,
  TrendingUp
} from 'lucide-react';
import { CartModal } from './components/CartModal';

function AppLayout() {
  const { currentRoute, navigate } = useRouter();
  const { profile } = useEnrollmentState();
  const { itemCount } = useCartState();
  const [showSplash, setShowSplash] = useState(true);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifySearched, setVerifySearched] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<{ type: 'success' | 'failed'; message: string; txnid?: string } | null>(null);

  // Check URL hash for direct verification links like #verify=SG-CERT-884912 and PayU return parameters
  React.useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#verify=')) {
        const queryId = decodeURIComponent(hash.replace('#verify=', ''));
        if (queryId) {
          setVerifyInput(queryId);
          const result = enrollmentStore.verifyCertificate(queryId);
          setVerifyResult(result);
          setVerifySearched(true);
          setVerifyModalOpen(true);
        }
      }
    };

    const handleQueryParamsCheck = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      const txnid = urlParams.get('txnid');

      if (paymentStatus === 'success') {
        // Unlock items in cart
        const cart = cartStore.getCart();
        let orderResult = null;
        if (cart.length > 0) {
          orderResult = cartStore.checkoutOrder('upi');
        }
        setPaymentNotice({
          type: 'success',
          message: 'PayU Payment Successful! Your course access is activated.',
          txnid: txnid || undefined
        });
        // Clean URL search params without reload
        window.history.replaceState({}, document.title, window.location.pathname);

        // Navigate to the main My Learning screen
        navigate('my-learning');
      } else if (paymentStatus === 'failed') {
        setPaymentNotice({
          type: 'failed',
          message: 'PayU Payment was cancelled or could not be completed.',
          txnid: txnid || undefined
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleHashCheck();
    handleQueryParamsCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;
    const result = enrollmentStore.verifyCertificate(verifyInput);
    setVerifyResult(result);
    setVerifySearched(true);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // If currently on Onboarding flow, render standalone onboarding experience
  if (currentRoute.screen === 'onboarding-details') {
    return (
      <>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <OnboardingDetailsScreen />
      </>
    );
  }

  if (currentRoute.screen === 'onboarding-otp') {
    return (
      <>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <OnboardingOtpScreen />
      </>
    );
  }

  const navLinks = [
    { label: 'Home', screen: 'home' as const },
    { label: 'Courses', screen: 'choose-skill' as const },
    { label: 'Skills', screen: 'choose-skill' as const },
    { label: 'Library', screen: 'library' as const },
    { label: 'My Learning', screen: 'my-learning' as const },
  ];

  // Determine active bottom tab for mobile
  const getActiveTab = () => {
    const s = currentRoute.screen;
    if (s === 'home') return 'home';
    if (s === 'choose-skill' || s === 'skill-detail' || s === 'role-detail' || s === 'choose-plan') return 'careers';
    if (s === 'my-learning' || s === 'course-modules' || s === 'module-video' || s === 'module-quiz' || s === 'course-complete' || s === 'final-assessment') return 'learning';
    if (s === 'practical-training') return 'practice';
    if (s === 'certificate') return 'learning';
    if (s === 'library') return 'home';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <div className={`min-h-screen flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white ${currentRoute.screen === 'home' || currentRoute.screen === 'library' ? 'bg-[#FFF8F9]' : 'bg-[#FDFDFE]'}`}>
      
      {/* 0. PREMIUM ANIMATED SPLASH SCREEN (Initial Load Only) */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* 1. BOLT REFERENCE HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
            
            {/* Left: Clean SkillGo Logo */}
            <div className="flex items-center gap-2 sm:gap-8">
              <SkillGoLogo onClick={() => navigate('home')} />
            </div>

            {/* Center: Navigation with Blue Underline Active Indicator (Desktop) */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-8 h-full">
              {navLinks.map((link, idx) => {
                const isActive = (link.screen === 'home' && currentRoute.screen === 'home') ||
                                 (link.label === 'Courses' && currentRoute.screen === 'choose-skill') ||
                                 (link.label === 'Skills' && currentRoute.screen === 'skill-detail') ||
                                 (link.screen === 'library' && currentRoute.screen === 'library') ||
                                 (link.screen === 'my-learning' && currentRoute.screen === 'my-learning');
                return (
                  <button
                    key={`${link.label}-${idx}`}
                    onClick={() => navigate(link.screen)}
                    className={`relative h-16 sm:h-18 inline-flex items-center text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'text-blue-600 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-t-full'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Right: Search, Notification Badge, Cart, Verify, User Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Search Button (Visible on mobile & desktop) */}
              <button 
                onClick={() => navigate('choose-skill')}
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
                title="Search courses"
                id="header-search-btn"
              >
                <Search className="w-5 h-5 text-slate-700" />
              </button>

              {/* Notification Bell with Red Badge count (Visible on mobile & desktop) */}
              <div className="relative">
                <button 
                  onClick={() => navigate('my-learning')}
                  className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
                  title="Notifications"
                  id="header-bell-btn"
                >
                  <Bell className="w-5 h-5 text-slate-700" />
                </button>
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center pointer-events-none">
                  3
                </span>
              </div>

              {/* Cart Button with Dynamic Badge Count (Visible on all mobile & desktop viewports) */}
              <button
                onClick={() => setCartModalOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-all cursor-pointer select-none shrink-0"
                id="header-cart-btn"
                title="View Cart"
              >
                <ShoppingBag className="w-4 h-4 text-slate-800 shrink-0" />
                <span className="hidden min-[380px]:inline text-xs sm:text-sm font-bold">Cart</span>
                {itemCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black leading-none animate-in zoom-in shrink-0">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Verify Certificate Quick Trigger */}
              <button
                onClick={() => setVerifyModalOpen(true)}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verify</span>
              </button>

              {/* User Avatar Chip: 'SG' in light blue circle */}
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-blue-200 transition-all cursor-pointer"
                id="header-user-menu"
                title="Profile Settings"
              >
                <div className="w-8 h-8 rounded-full bg-[#E0EDFB] text-[#1E73E8] flex items-center justify-center font-bold text-xs">
                  {(profile.name || 'Vikram Sharma').slice(0, 2).toUpperCase()}
                </div>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER (Slide-Over for screens < 768px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <SkillGoLogo onClick={() => { setMobileMenuOpen(false); navigate('home'); }} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card Snippet */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {(profile.name || 'Vikram Sharma').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm truncate">{profile.name || 'Vikram Sharma'}</div>
                <div className="text-xs text-slate-500">{profile.phone || '+91 98765 43210'}</div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-3 flex-1 overflow-y-auto space-y-1">
              {navLinks.map((link, idx) => {
                const isActive = (link.screen === 'home' && currentRoute.screen === 'home') ||
                                 (link.label === 'Courses' && currentRoute.screen === 'choose-skill') ||
                                 (link.label === 'Skills' && currentRoute.screen === 'skill-detail') ||
                                 (link.screen === 'library' && currentRoute.screen === 'library') ||
                                 (link.screen === 'my-learning' && currentRoute.screen === 'my-learning');

                return (
                  <button
                    key={`mobile-nav-${link.label}-${idx}`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(link.screen);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                );
              })}

              <div className="pt-2 pb-1 border-t border-slate-100 my-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setVerifyModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verify Certificate</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCartModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-slate-600" />
                    <span>Cart</span>
                  </div>
                  {itemCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                      {itemCount} items
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400">SkillGo • Practical Skill Platform</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Notice Notification Banner */}
      {paymentNotice && (
        <div className={`py-3 px-4 text-center text-xs font-semibold flex items-center justify-center gap-3 transition-all ${
          paymentNotice.type === 'success' 
            ? 'bg-emerald-600 text-white shadow-sm' 
            : 'bg-rose-600 text-white shadow-sm'
        }`}>
          <span>{paymentNotice.message}</span>
          {paymentNotice.txnid && (
            <span className="font-mono text-[11px] opacity-85">Txn: {paymentNotice.txnid}</span>
          )}
          <button 
            onClick={() => setPaymentNotice(null)}
            className="ml-2 text-white/80 hover:text-white underline cursor-pointer text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. DYNAMIC SCREEN CONTENT (With bottom padding for fixed mobile nav) */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0">
        {currentRoute.screen === 'home' && <HomeScreen />}
        {currentRoute.screen === 'choose-skill' && <ChooseSkillScreen />}
        {currentRoute.screen === 'skill-detail' && <ChooseSkillScreen />}
        {currentRoute.screen === 'role-detail' && <RoleDetailScreen />}
        {currentRoute.screen === 'choose-plan' && <ChoosePlanScreen />}
        {currentRoute.screen === 'course-modules' && <CourseModulesScreen />}
        {currentRoute.screen === 'module-video' && <ModuleVideoScreen />}
        {currentRoute.screen === 'module-quiz' && <ModuleQuizScreen />}
        {currentRoute.screen === 'course-complete' && <CourseCompleteScreen />}
        {currentRoute.screen === 'practical-training' && <PracticalTrainingScreen />}
        {currentRoute.screen === 'final-assessment' && <FinalAssessmentScreen />}
        {currentRoute.screen === 'my-learning' && <MyLearningScreen />}
        {currentRoute.screen === 'library' && <LibraryScreen />}
        {currentRoute.screen === 'certificate' && <CertificateScreen />}
      </main>

      {/* 3. APPLE GLASS FLOATING BOTTOM NAVIGATION BAR FOR MOBILE (Screens < 768px) */}
      <nav 
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-8 left-4 right-4 max-w-lg mx-auto z-40 bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_16px_36px_rgba(0,0,0,0.14)] px-3 py-2.5 rounded-2xl flex items-center justify-around"
      >
        {/* Tab 1: Home */}
        <button
          onClick={() => navigate('home')}
          id="mobile-bottom-tab-home"
          className={`flex flex-col items-center justify-center flex-1 py-0.5 px-1 transition-all duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer rounded-lg ${
            activeTab === 'home' ? 'text-blue-600 font-bold -translate-y-0.5' : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5] text-blue-600 fill-blue-50' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </button>

        {/* Tab 2: Careers */}
        <button
          onClick={() => navigate('choose-skill')}
          id="mobile-bottom-tab-careers"
          className={`flex flex-col items-center justify-center flex-1 py-0.5 px-1 transition-all duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer rounded-lg ${
            activeTab === 'careers' ? 'text-blue-600 font-bold -translate-y-0.5' : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${activeTab === 'careers' ? 'stroke-[2.5] text-blue-600' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Careers</span>
        </button>

        {/* Tab 3: Learning */}
        <button
          onClick={() => navigate('my-learning')}
          id="mobile-bottom-tab-learning"
          className={`flex flex-col items-center justify-center flex-1 py-0.5 px-1 transition-all duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer rounded-lg ${
            activeTab === 'learning' ? 'text-blue-600 font-bold -translate-y-0.5' : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'learning' ? 'stroke-[2.5] text-blue-600' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Learning</span>
        </button>

        {/* Tab 4: Practice */}
        <button
          onClick={() => navigate('practical-training', { roleId: 'warehouse-associate', from: 'bottom-nav' })}
          id="mobile-bottom-tab-practice"
          className={`flex flex-col items-center justify-center flex-1 py-0.5 px-1 transition-all duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer rounded-lg ${
            activeTab === 'practice' ? 'text-blue-600 font-bold -translate-y-0.5' : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <TrendingUp className={`w-5 h-5 ${activeTab === 'practice' ? 'stroke-[2.5] text-blue-600' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Practice</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => setProfileModalOpen(true)}
          id="mobile-bottom-tab-profile"
          className="flex flex-col items-center justify-center flex-1 py-0.5 px-1 text-slate-500 hover:text-slate-800 font-medium transition-all duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer rounded-lg"
        >
          <User className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-1 tracking-tight">Profile</span>
        </button>
      </nav>

      {/* 4. CLEAN FOOTER */}
      <footer className="bg-white border-t border-slate-100 text-slate-600 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <SkillGoLogo size="sm" onClick={() => navigate('home')} />
              <p className="text-xs text-slate-500 max-w-sm">
                Empowering career growth through practical, industry-aligned skill tracks and verifiable credentials.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs font-semibold text-slate-600">
              <button onClick={() => navigate('home')} className="hover:text-blue-600 cursor-pointer">Home</button>
              <button onClick={() => navigate('choose-skill')} className="hover:text-blue-600 cursor-pointer">Courses</button>
              <button onClick={() => navigate('library')} className="hover:text-blue-600 cursor-pointer">Library</button>
              <button onClick={() => setVerifyModalOpen(true)} className="hover:text-blue-600 cursor-pointer">Verify Certificate</button>
              <button onClick={() => navigate('my-learning')} className="hover:text-blue-600 cursor-pointer">My Learning</button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>© {new Date().getFullYear()} SkillGo. All rights reserved.</div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Certified Job-Ready Engine</span>
            </div>
          </div>
        </div>
      </footer>

      {/* VERIFY CERTIFICATE MODAL */}
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => {
          setVerifyModalOpen(false);
          setVerifySearched(false);
          setVerifyResult(null);
          setVerifyInput('');
        }}
        title="Verify SkillGo Certificate"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Enter a unique Certificate ID (e.g. <code>SG-CERT-884912</code>) to verify authenticity.
          </p>

          <form onSubmit={handleVerify} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="SG-CERT-884912"
                value={verifyInput}
                onChange={e => setVerifyInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Verify
            </Button>
          </form>

          {verifySearched && (
            <div className="mt-4 transition-all">
              {verifyResult ? (
                <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-950 rounded-2xl p-4 text-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-black">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>✓ VERIFIED</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Status: Valid
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Learner</span>
                      <strong className="text-slate-900">{verifyResult.candidateName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Certificate ID</span>
                      <strong className="font-mono text-slate-900">{verifyResult.id}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Role</span>
                      <span className="font-semibold text-slate-900">{verifyResult.roleTitle}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Skill Domain</span>
                      <span className="font-semibold text-slate-900">{verifyResult.skillCategory}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Issued On</span>
                      <span className="font-semibold text-slate-900">{verifyResult.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Track</span>
                      <span className="font-semibold text-slate-900">{verifyResult.plan.toUpperCase()} Track</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/60 flex justify-end">
                    <button
                      onClick={() => {
                        setVerifyModalOpen(false);
                        navigate('certificate', { certificateId: verifyResult.id });
                      }}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                    >
                      View Full Certificate Document →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl p-4 text-xs space-y-1">
                  <div className="font-bold text-rose-800 flex items-center gap-1.5">
                    <span>Certificate Not Found</span>
                  </div>
                  <p className="text-rose-700 text-[11px] leading-relaxed">
                    The credential could not be verified. Please check the Certificate ID or authorization code.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* PROFILE MODAL */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Learner Profile"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-black text-base flex items-center justify-center">
              {(profile.name || 'Vikram Sharma').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{profile.name}</h4>
              <p className="text-xs text-slate-500">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Phone:</span>
              <span className="font-semibold text-slate-900">{profile.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">City / Hub:</span>
              <span className="font-semibold text-slate-900">{profile.city}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Education:</span>
              <span className="font-semibold text-slate-900">{profile.education}</span>
            </div>
          </div>

          <div className="pt-3 space-y-2">
            <Button size="sm" variant="primary" className="w-full" onClick={() => { setProfileModalOpen(false); navigate('my-learning'); }}>
              View My Learning Dashboard
            </Button>
            <button
              onClick={() => {
                setProfileModalOpen(false);
                enrollmentStore.resetOnboarding();
                setShowSplash(true);
                navigate('onboarding-details');
              }}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-dashed border-slate-200"
            >
              Test Fresh Learner Onboarding Flow
            </button>
          </div>
        </div>
      </Modal>

      {/* UNIFIED CART & CHECKOUT MODAL */}
      <CartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppLayout />
    </RouterProvider>
  );
}

