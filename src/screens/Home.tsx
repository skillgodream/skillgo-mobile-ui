import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  ShoppingCart, 
  Package, 
  Zap, 
  Utensils, 
  Building2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Sparkles,
  Compass,
  UserCheck,
  Layers,
  BookOpen,
  Award,
  Plus,
  Check,
  ShoppingBag,
  TrendingUp,
  Monitor,
  Smartphone,
  Tag
} from 'lucide-react';
import { Button, Badge, ProgressBar, Modal } from '../components/ui';
import { SKILL_CATEGORIES, LIBRARY_ITEMS } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { useEnrollmentState, useCartState, enrollmentStore } from '../lib/enrollmentStore';
import { SkillCategory, LibraryItem } from '../lib/types';

export function HomeScreen() {
  const { navigate } = useRouter();
  const { activeEnrollment } = useEnrollmentState();
  const { addToCart, isInCart, isLibraryPurchased } = useCartState();

  // Carousel slide state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Library modal reader state
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<LibraryItem | null>(null);
  const [libraryCategory, setLibraryCategory] = useState<string>('All');
  const libraryScrollRef = useRef<HTMLDivElement>(null);

  const scrollLibrary = (direction: 'left' | 'right') => {
    if (libraryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      libraryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 3 Recreated Banners (Dark Prominent Theme)
  const heroSlides = [
    {
      id: 'career-journey',
      type: 'career',
      badge: 'Special Launch Offer • ₹199',
      originalPrice: '₹599',
      currentPrice: '₹199',
      offerTag: 'Limited Time Offer',
      titleFirst: 'Start Your',
      titleAccent: 'Career',
      titleRest: 'Journey',
      subtext: 'Learn in-demand skills. Get practical training. Build your future.',
      pills: ['Learn', 'Practice', 'Get Certified', 'Get Job Ready'],
      ctaText: 'Get Started Now',
      target: 'choose-skill',
      targetParams: {},
      bgGradient: 'bg-gradient-to-r from-[#030914] via-[#081730] to-[#113165]',
      textColor: 'text-white',
      accentColor: 'text-[#FF7A00]',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Start Career Journey Logistics Professional'
    },
    {
      id: 'skill-modules',
      type: 'modules',
      badge: 'STARTING AT ONLY ₹29 • Per Module',
      currentPrice: '₹29',
      offerTag: 'Affordable learning for all',
      titleFirst: 'Skill Modules',
      titleAccent: 'Small lessons.',
      titleRest: 'Big impact.',
      subtext: 'Quick, practical modules to help you learn in-demand skills anytime, anywhere.',
      pills: ['Learn Fast', 'Practical Skills', 'Build Confidence'],
      ctaText: 'Explore Modules ₹29',
      target: 'library',
      targetParams: {},
      bgGradient: 'bg-gradient-to-r from-[#030914] via-[#081730] to-[#113165]',
      textColor: 'text-white',
      accentColor: 'text-blue-400',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Skill Modules Small Lessons Big Impact'
    },
    {
      id: 'simulation-lab',
      type: 'simulation',
      badge: 'Simulation Lab 🏠 • Safe Environment',
      offerTag: 'Your time • Your growth',
      titleFirst: 'Practice at',
      titleAccent: 'Your Home',
      titleRest: '',
      subtext: 'Real-life simulations to build confidence before you work in the real world.',
      pills: ['Hands-on Practice', 'Safe Environment', 'Job Ready Skills'],
      ctaText: 'Try Simulation Lab',
      target: 'practical-training',
      targetParams: { roleId: 'warehouse-associate', from: 'hero' },
      bgGradient: 'bg-gradient-to-r from-[#030914] via-[#081730] to-[#113165]',
      textColor: 'text-white',
      accentColor: 'text-blue-400',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Practice at Home Simulation Lab'
    }
  ];

  // 3.5-second automatic sliding from left to right
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const activeSlide = heroSlides[currentSlide];

  // Domain visual mapping
  const getSkillVisual = (skillId: string) => {
    switch (skillId) {
      case 'retail-operations':
        return {
          icon: ShoppingCart,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          borderColor: 'border-blue-100',
          name: 'Retail Operations',
          description: 'Store management, visual merchandising & sales',
          image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80',
          imageAlt: 'Retail Store Operations'
        };
      case 'logistics-supply-chain':
        return {
          icon: Package,
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-600',
          borderColor: 'border-emerald-100',
          name: 'Warehouse & Logistics',
          description: 'Inventory handling, sorting & fulfillment ops',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
          imageAlt: 'Warehouse Operations'
        };
      case 'quick-commerce':
        return {
          icon: Zap,
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-600',
          borderColor: 'border-amber-100',
          name: 'Quick Commerce',
          description: 'Dark store workflows, picking & live dispatch',
          image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
          imageAlt: 'Quick Commerce Dark Store'
        };
      case 'hospitality':
        return {
          icon: Utensils,
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600',
          borderColor: 'border-purple-100',
          name: 'Hospitality & F&B',
          description: 'Dining standards, guest service & operations',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
          imageAlt: 'Hospitality & Dining'
        };
      case 'facility-management':
      default:
        return {
          icon: Building2,
          bgColor: 'bg-sky-50',
          textColor: 'text-sky-600',
          borderColor: 'border-sky-100',
          name: 'Facility Management',
          description: 'Infrastructure maintenance & safety standards',
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
          imageAlt: 'Facility Management'
        };
    }
  };

  // Filter library items
  const filteredLibrary = libraryCategory === 'All'
    ? LIBRARY_ITEMS
    : LIBRARY_ITEMS.filter(item => item.category === libraryCategory);

  // Active enrollment context
  const activeRole = activeEnrollment ? enrollmentStore.getRoleById(activeEnrollment.roleId) : null;
  const activeProgress = activeEnrollment ? enrollmentStore.getEnrollmentProgress(activeEnrollment.id) : 0;

  // Active sequence card index for How SkillGo Works (0 to 4, where 4 is the final SKILLGO logo card)
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Cycle through steps 0, 1, 2, 3, 4 sequentially in a loop every 2.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex(prev => (prev + 1) % 5);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#FFF8F9] pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6" id="home-hero-section">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-teal-900/40 shadow-xl bg-[#041215]">
          
          {/* Horizontal Sliding Track (Left-to-Right Translation) */}
          <div 
            className="flex transition-transform duration-700 ease-in-out w-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* SLIDE 1: Start Your Career Journey (Special Launch Offer ₹199) */}
            <div className="w-full shrink-0 flex items-center justify-between min-h-[150px] sm:min-h-[170px] lg:h-[195px] bg-gradient-to-r from-[#0C3132] via-[#092225] to-[#041215] text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              {/* Background decorative glow */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-teal-500/20 via-transparent to-transparent pointer-events-none" />
              
              {/* Left Content Column */}
              <div className="flex-1 min-w-0 pr-4 z-10 flex flex-col justify-center gap-1.5 sm:gap-2">
                {/* Top Badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 text-teal-200 border border-teal-700/50 text-[10px] sm:text-xs font-bold shadow-xs">
                    <span className="text-amber-400">🔥</span>
                    <span>Special Launch Offer</span>
                    <span className="text-amber-300 font-extrabold ml-1">₹199</span>
                    <s className="text-slate-400 text-[10px]">₹599</s>
                  </span>
                </div>

                {/* Headline */}
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
                  <span>Start Your </span>
                  <span className="text-[#FFB800]">Career</span>
                  <span> Journey</span>
                </h2>

                {/* Subtitle */}
                <p className="text-teal-100/90 text-xs sm:text-sm leading-normal line-clamp-1 max-w-lg">
                  Learn in-demand skills • Get practical experience • Advance your future
                </p>

                {/* CTA Button */}
                <div className="mt-1">
                  <button
                    onClick={() => navigate('choose-skill')}
                    className="bg-[#FFB800] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>₹199 All Access</span>
                    <div className="w-5 h-5 rounded-full bg-slate-950 text-[#FFB800] flex items-center justify-center">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Side Visual Graphic with curved mask & badge */}
              <div className="w-[120px] sm:w-[170px] lg:w-[220px] shrink-0 relative flex items-center justify-end">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-2 border-teal-500/40 relative shadow-xl bg-teal-950/60 rotate-2">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                    alt="Start Career Journey"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Floating Limited Time Offer Badge */}
                <div className="absolute -bottom-2 -left-4 sm:left-auto sm:-left-6 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 text-[10px] sm:text-xs font-black px-3 py-2 rounded-full shadow-lg border-2 border-white text-center leading-tight">
                  Limited Time<br/>Offer!
                </div>
              </div>
            </div>

            {/* SLIDE 2: Skill Modules (Starting at ₹29 Per Module) */}
            <div className="w-full shrink-0 flex items-center justify-between min-h-[150px] sm:min-h-[170px] lg:h-[195px] bg-gradient-to-r from-[#0C3132] via-[#092225] to-[#041215] text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-teal-500/20 via-transparent to-transparent pointer-events-none" />
              
              {/* Left Content Column */}
              <div className="flex-1 min-w-0 pr-4 z-10 flex flex-col justify-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 text-teal-200 border border-teal-700/50 text-[10px] sm:text-xs font-bold shadow-xs">
                    <Tag className="w-3 h-3 text-amber-300" />
                    <span>STARTING AT ONLY ₹29 / MODULE</span>
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
                  <span>Skill Modules — </span>
                  <span className="text-[#FFB800]">Small lessons.</span>
                </h2>

                <p className="text-teal-100/90 text-xs sm:text-sm leading-normal line-clamp-1 max-w-lg">
                  Quick, practical modules to help you learn in-demand skills anytime, anywhere.
                </p>

                <div className="mt-1">
                  <button
                    onClick={() => navigate('library')}
                    className="bg-[#FFB800] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>Browse Modules (₹29)</span>
                    <div className="w-5 h-5 rounded-full bg-slate-950 text-[#FFB800] flex items-center justify-center">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Side Visual Graphic */}
              <div className="w-[120px] sm:w-[170px] lg:w-[220px] shrink-0 relative flex items-center justify-end">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-2 border-teal-500/40 relative shadow-xl bg-teal-950 rotate-2">
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
                    alt="Skill Modules"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-2 -left-4 sm:left-auto sm:-left-6 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 text-[10px] sm:text-xs font-black px-3 py-2 rounded-full shadow-lg border-2 border-white text-center leading-tight">
                  ₹29 Only!
                </div>
              </div>
            </div>

            {/* SLIDE 3: Practice at Your Home (Simulation Lab) */}
            <div className="w-full shrink-0 flex items-center justify-between min-h-[150px] sm:min-h-[170px] lg:h-[195px] bg-gradient-to-r from-[#0C3132] via-[#092225] to-[#041215] text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-teal-500/20 via-transparent to-transparent pointer-events-none" />
              
              {/* Left Content Column */}
              <div className="flex-1 min-w-0 pr-4 z-10 flex flex-col justify-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 text-[10px] sm:text-xs font-bold shadow-xs">
                    <Monitor className="w-3 h-3 text-emerald-400" />
                    <span>Simulation Lab 🏠 • Safe Environment</span>
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
                  <span>Practice at </span>
                  <span className="text-[#FFB800]">Your Home</span>
                </h2>

                <p className="text-teal-100/90 text-xs sm:text-sm leading-normal line-clamp-1 max-w-lg">
                  Real-life simulations to build confidence before you work in the real world.
                </p>

                <div className="mt-1">
                  <button
                    onClick={() => navigate('choose-skill')}
                    className="bg-[#FFB800] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>Try Simulation</span>
                    <div className="w-5 h-5 rounded-full bg-slate-950 text-[#FFB800] flex items-center justify-center">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Side Visual Graphic */}
              <div className="w-[120px] sm:w-[170px] lg:w-[220px] shrink-0 relative flex items-center justify-end">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-2 border-emerald-500/40 relative shadow-xl bg-slate-950 rotate-2">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
                    alt="Simulation Lab"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-2 -left-4 sm:left-auto sm:-left-6 bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-[10px] sm:text-xs font-black px-3 py-2 rounded-full shadow-lg border-2 border-white text-center leading-tight">
                  Live Lab
                </div>
              </div>
            </div>

          </div>

          {/* Carousel Pagination Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 cursor-pointer ${
                  currentSlide === idx 
                    ? 'w-5 h-1.5 bg-[#FFB800] rounded-full' 
                    : 'w-2 h-1.5 bg-teal-700/80 hover:bg-teal-500 rounded-full'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          </div>
        </div>
      </section>

      {/* 2. MAKE YOUR CAREER (Exact match to screenshot horizontal card layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8" id="make-your-career-section">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B192C] tracking-tight">
              Make Your Career
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Explore industry domains and find the right path for you.
            </p>
          </div>
          <button
            onClick={() => navigate('choose-skill')}
            className="text-teal-700 hover:text-teal-800 font-semibold text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer transition-colors"
            id="view-all-skills-btn"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Rectangular Cards Grid matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: 'logistics-supply-chain',
              name: 'Warehouse & Logistics',
              desc: 'Manage operations. Move the world forward.',
              icon: Package,
              bg: 'bg-[#F0F4F8] border border-[#E2E8F0]',
              badgeBg: 'bg-[#0D9488] text-teal-100 shadow-xs',
              arrowBg: 'bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white',
              textColor: 'text-[#0F172A]',
              image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
              imageAlt: 'Warehouse'
            },
            {
              id: 'retail-operations',
              name: 'Retail Operations',
              desc: 'Deliver great experiences. Drive every sale.',
              icon: ShoppingCart,
              bg: 'bg-[#E6F4F1] border border-[#CCE5E0]',
              badgeBg: 'bg-[#F97316] text-orange-100 shadow-xs',
              arrowBg: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
              textColor: 'text-[#042F2E]',
              image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80',
              imageAlt: 'Retail'
            },
            {
              id: 'quick-commerce',
              name: 'Quick Commerce',
              desc: 'Speed. Precision. Customer delight.',
              icon: Zap,
              bg: 'bg-[#EEF2FF] border border-[#E0E7FF]',
              badgeBg: 'bg-[#7C3AED] text-purple-100 shadow-xs',
              arrowBg: 'bg-purple-50 text-purple-700 group-hover:bg-purple-700 group-hover:text-white',
              textColor: 'text-[#1E1B4B]',
              image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
              imageAlt: 'Commerce'
            },
            {
              id: 'hospitality',
              name: 'Hospitality & F&B',
              desc: 'Serve with passion. Lead with care.',
              icon: Utensils,
              bg: 'bg-[#ECFEFF] border border-[#CFFAFE]',
              badgeBg: 'bg-[#0284C7] text-sky-100 shadow-xs',
              arrowBg: 'bg-sky-50 text-sky-700 group-hover:bg-sky-700 group-hover:text-white',
              textColor: 'text-[#083344]',
              image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
              imageAlt: 'Hospitality'
            }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                id={`skill-card-${item.id}`}
                onClick={() => navigate('choose-skill', { selectedSkillId: item.id })}
                className={`${item.bg} rounded-3xl p-3 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden`}
              >
                {/* Background image watermark */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Left Side: Icon & Content */}
                <div className="flex items-center gap-3.5 z-10 min-w-0 flex-1">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${item.badgeBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0 shadow-sm`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className={`text-[15px] sm:text-base font-bold tracking-tight ${item.textColor} group-hover:text-teal-700 transition-colors truncate`}>
                      {item.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Right Side: Circular Action Arrow */}
                <div className="shrink-0 z-10">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${item.arrowBg} flex items-center justify-center transition-colors shadow-2xs`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 3. HOW SKILLGO WORKS (Calm green gradient banner with sequentially looping step cards and final SKILLGO logo card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-9 sm:mt-12" id="how-skillgo-works-section">
        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-emerald-100/50 border border-emerald-200/60 rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

          {/* Section Heading */}
          <div className="mb-4 relative z-10 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B192C] tracking-tight">
                How SkillGo Works
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                Your fast track to professional mastery.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-100/80 border border-emerald-300/50 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 whitespace-nowrap shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Step {activeStepIndex + 1} of 5</span>
            </div>
          </div>

          {/* Container for Cards Displaying Sequentially in a Loop */}
          <div className="relative z-10 min-h-[140px] sm:min-h-[160px] flex items-center justify-center">
            
            {/* Steps 0 to 3 */}
            {[
              {
                num: '01',
                title: 'Choose a career',
                desc: 'Pick a domain and role that matches your interest and career goals.',
                icon: Compass,
                target: 'choose-skill'
              },
              {
                num: '02',
                title: 'Learn the essentials',
                desc: 'Complete bite-sized lessons, video modules, and practical SOP guides.',
                icon: BookOpen,
                target: 'choose-skill'
              },
              {
                num: '03',
                title: 'Practice real tasks',
                desc: 'Apply your learning with hands-on practice simulations and real scenarios.',
                icon: ShoppingBag,
                target: 'my-learning'
              },
              {
                num: '04',
                title: 'Get ready for work',
                desc: 'Earn verified certificates and prepare for real workplace opportunities.',
                icon: Award,
                target: 'my-learning'
              }
            ].map((step, idx) => {
              const Icon = step.icon;
              const isVisible = activeStepIndex === idx;

              return (
                <div
                  key={step.num}
                  onClick={() => navigate(step.target as any)}
                  className={`absolute inset-0 bg-white rounded-2xl border-2 border-emerald-200/80 p-5 sm:p-6 shadow-md cursor-pointer flex flex-col justify-center transition-all duration-700 transform ${
                    isVisible 
                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto z-20' 
                      : 'opacity-0 scale-95 translate-y-4 pointer-events-none z-0'
                  }`}
                >
                  {/* Icon, Heading, and Step Tab in One Horizontal Line */}
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-xs shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                        {step.title}
                      </h3>
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full shadow-2xs whitespace-nowrap shrink-0">
                      Step {step.num}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                    {step.desc}
                  </p>
                </div>
              );
            })}

            {/* Additional Step 5: SKILLGO Logo Card (Center Aligned, No Extra Text) */}
            <div
              onClick={() => navigate('choose-skill')}
              className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0C3132] to-slate-950 text-white rounded-2xl border-2 border-emerald-500/50 p-5 sm:p-6 shadow-xl cursor-pointer flex items-center justify-center text-center transition-all duration-700 transform ${
                activeStepIndex === 4 
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto z-20' 
                  : 'opacity-0 scale-95 translate-y-4 pointer-events-none z-0'
              }`}
            >
              <div className="font-extrabold tracking-[0.3em] text-3xl sm:text-5xl text-white font-sans drop-shadow-md">
                SKILLGO
              </div>
            </div>

          </div>

          {/* Carousel Dot Indicators */}
          <div className="flex items-center justify-center gap-2 mt-4 relative z-10">
            {[0, 1, 2, 3, 4].map((dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveStepIndex(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeStepIndex === dotIdx 
                    ? 'w-6 h-2 bg-emerald-700' 
                    : 'w-2 h-2 bg-emerald-300/80 hover:bg-emerald-400'
                }`}
                aria-label={`Jump to step ${dotIdx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 3.5. MY ECONOMY CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8" id="my-economy-section">
        <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-blue-100/50 border border-blue-200/60 rounded-2xl p-3.5 sm:p-4 shadow-2xs relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl pointer-events-none" />
          
          {/* Top Right Explore Button */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
            <button
              onClick={() => navigate('library')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] sm:text-xs px-2.5 py-1 rounded-lg transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10 pr-16 sm:pr-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#0B192C] tracking-tight">
                    My Economy
                  </h2>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Earn from the expertise and skills you've built.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <div className="bg-white/90 border border-blue-200/80 rounded-xl px-3 py-1.5 text-center shadow-2xs w-[138px] sm:w-[150px] shrink-0">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider truncate">Completed</p>
                <p className="text-sm sm:text-base font-extrabold text-blue-700 mt-0.5">4 Modules</p>
              </div>
              <div className="bg-white/90 border border-blue-200/80 rounded-xl px-3 py-1.5 text-center shadow-2xs w-[138px] sm:w-[150px] shrink-0">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider truncate">Potential Earning</p>
                <p className="text-sm sm:text-base font-extrabold text-emerald-700 mt-0.5">₹45,000/mo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED MODULES (Vertical Rectangular Shape with Clean Right-Top View All) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-9 sm:mt-12" id="standalone-modules-section">
        <div className="bg-gradient-to-br from-pink-50/90 via-rose-50/40 to-pink-100/50 border border-pink-200/60 rounded-3xl p-5 sm:p-8 shadow-sm relative overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header with clean right-top View All */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5 sm:mb-6 relative z-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B192C] tracking-tight">
                Featured Modules
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                Quick practical learning when you need it.
              </p>
            </div>
            <button
              onClick={() => navigate('library')}
              className="text-pink-700 hover:text-pink-800 font-semibold text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer transition-colors bg-white/90 hover:bg-white px-3.5 py-1.5 rounded-full shadow-2xs border border-pink-200 shrink-0 self-end sm:self-auto"
              id="view-all-library-btn"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Swipeable Row with 30% smaller cards and pop up hover effect */}
          <div 
            ref={libraryScrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto md:overflow-visible no-scrollbar pb-3 pt-1 px-0.5 relative z-10"
          >
          {filteredLibrary.map((item: LibraryItem) => {
            const isPurchased = isLibraryPurchased(item.id);
            const inCart = isInCart(item.id);
            const itemPrice = item.price || 199;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedLibraryItem(item)}
                className="w-[220px] sm:w-[240px] shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-pink-300 hover:-translate-y-2.5 hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden"
              >
                {/* Top: Rectangular Thumbnail Image */}
                <div className="w-full h-28 relative bg-slate-100 overflow-hidden">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'}
                    alt={item.imageAlt || item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    ₹{itemPrice}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-pink-700 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Bottom Footer: Timing & Action Arrow */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.duration || item.readTime}</span>
                    </span>

                    <div className="w-7 h-7 rounded-xl bg-pink-50 text-pink-700 group-hover:bg-pink-700 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
        </div>

      </section>

      {/* STANDALONE LIBRARY READER / PREVIEW MODAL */}
      <Modal
        isOpen={!!selectedLibraryItem}
        onClose={() => setSelectedLibraryItem(null)}
        title={selectedLibraryItem?.title}
        maxWidth="max-w-2xl"
      >
        {selectedLibraryItem && (() => {
          const isPurchased = isLibraryPurchased(selectedLibraryItem.id);
          const inCart = isInCart(selectedLibraryItem.id);
          const itemPrice = selectedLibraryItem.price || 29;

          return (
            <div className="space-y-6 text-sm text-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                    {selectedLibraryItem.category}
                  </span>
                  <span>•</span>
                  <span>{selectedLibraryItem.duration || selectedLibraryItem.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">₹{itemPrice}</span>
                  {isPurchased ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      ✓ UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                      INDEPENDENT MODULE
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Overview</h4>
                <p className="text-slate-700 leading-relaxed">{selectedLibraryItem.summary}</p>
              </div>

              {isPurchased ? (
                <>
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Step-by-Step Procedure</h4>
                    <div className="space-y-2">
                      {selectedLibraryItem.content.map((point, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-800">
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedLibraryItem.keyTips && (
                    <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs">
                      <strong>Pro Operational Tip:</strong> {selectedLibraryItem.keyTips.join(' ')}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-center">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">Unlock Full Standard Operating Procedure</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Get complete actionable checklists, step-by-step workplace SOPs, and pro tips for just ₹{itemPrice}.
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-center gap-3">
                    {inCart ? (
                      <Button size="md" variant="secondary" disabled>
                        ✓ In Cart
                      </Button>
                    ) : (
                      <Button
                        size="md"
                        variant="primary"
                        iconRight={Plus}
                        onClick={() => {
                          addToCart({
                            id: `cart-lib-${selectedLibraryItem.id}`,
                            productId: selectedLibraryItem.id,
                            productType: 'library',
                            title: selectedLibraryItem.title,
                            price: itemPrice,
                            image: selectedLibraryItem.image,
                            category: selectedLibraryItem.category,
                            duration: selectedLibraryItem.duration || selectedLibraryItem.readTime
                          });
                        }}
                      >
                        + Add to Cart (₹{itemPrice})
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button size="sm" variant="secondary" onClick={() => setSelectedLibraryItem(null)}>
                  Close
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>

    </div>
  );
}
