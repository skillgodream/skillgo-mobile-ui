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

  // 3 Recreated Banners from user screenshots (70% compact reduced size)
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
      bgGradient: 'bg-gradient-to-r from-[#07172E] via-[#0C2548] to-[#123E75]',
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
      bgGradient: 'bg-gradient-to-r from-[#F0F7FF] via-[#E4F0FD] to-[#D5E8FD]',
      textColor: 'text-[#0B192C]',
      accentColor: 'text-blue-600',
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
      bgGradient: 'bg-gradient-to-r from-[#F8FAFC] via-[#EDF4FA] to-[#DFEAF5]',
      textColor: 'text-[#0B192C]',
      accentColor: 'text-blue-600',
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

  // 4 Core Journey Steps for How SkillGo Works matching mobile-first layout
  const howSkillGoWorksSteps = [
    {
      num: '01',
      title: 'Choose a career',
      desc: 'Pick a domain and role that matches your interest.',
      icon: Compass,
      target: 'choose-skill'
    },
    {
      num: '02',
      title: 'Learn the essentials',
      desc: 'Complete bite-sized lessons and practical guides.',
      icon: BookOpen,
      target: 'choose-skill'
    },
    {
      num: '03',
      title: 'Practice real tasks',
      desc: 'Apply your learning with hands-on practice.',
      icon: ShoppingBag,
      target: 'my-learning'
    },
    {
      num: '04',
      title: 'Get ready for work',
      desc: 'Earn certificates and prepare for real opportunities.',
      icon: Award,
      target: 'my-learning'
    }
  ];

  return (
    <div className="w-full bg-[#FDFDFE] pb-16">
      
      {/* 1. HERO SECTION — 70% COMPACT REDUCED SIZE WITH 3 RECREATED BANNERS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4" id="home-hero-section">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs">
          
          {/* Horizontal Sliding Track (Left-to-Right Translation) */}
          <div 
            className="flex transition-transform duration-700 ease-in-out w-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* SLIDE 1: Start Your Career Journey (Special Launch Offer ₹199) */}
            <div className="w-full shrink-0 flex items-center justify-between min-h-[135px] sm:min-h-[155px] lg:h-[180px] bg-gradient-to-r from-[#06152B] via-[#0B2244] to-[#16498A] text-white p-3 sm:p-4 lg:p-6 relative overflow-hidden">
              {/* Background decorative blue glow */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-blue-500/20 via-transparent to-transparent pointer-events-none" />
              
              {/* Left Content Column */}
              <div className="flex-1 min-w-0 pr-3 z-10 flex flex-col justify-between h-full py-0.5">
                <div>
                  {/* Top Badge: Special Launch Offer ₹199 */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1 sm:mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/25 text-blue-200 border border-blue-400/40 text-[9px] sm:text-[11px] font-bold">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>Special Launch Offer</span>
                      <span className="text-amber-300 font-extrabold ml-0.5">₹199</span>
                      <s className="text-slate-400 text-[8px] sm:text-[9px]">₹599</s>
                    </span>
                    <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-300 text-[9px] font-semibold">
                      Limited Time
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-sm sm:text-lg lg:text-xl font-black tracking-tight leading-tight">
                    <span>Start Your </span>
                    <span className="text-[#FF7A00] underline decoration-blue-400 decoration-2 underline-offset-2">Career</span>
                    <span> Journey</span>
                  </h2>

                  {/* Subtitle */}
                  <p className="text-slate-300 text-[10px] sm:text-xs leading-snug line-clamp-1 mt-0.5 max-w-lg">
                    Learn in-demand skills • Get practical training • Build your future
                  </p>
                </div>

                {/* Micro tags & Display-only Badge Row */}
                <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 select-none">
                  <div
                    className="bg-[#FF7A00] text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg font-bold text-[10px] sm:text-xs inline-flex items-center gap-1 shadow-xs shrink-0 cursor-default"
                    id="hero-slide-1-badge"
                  >
                    <span>Start Today</span>
                    <Sparkles className="w-3 h-3 text-amber-200" />
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-[10px] text-blue-200">
                    <span className="flex items-center gap-0.5"><BookOpen className="w-2.5 h-2.5 text-blue-400" /> Learn</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Zap className="w-2.5 h-2.5 text-amber-400" /> Practice</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Award className="w-2.5 h-2.5 text-emerald-400" /> Get Certified</span>
                  </div>
                </div>
              </div>

              {/* Right Side Visual Graphic */}
              <div className="w-[105px] sm:w-[150px] lg:w-[200px] h-full shrink-0 relative flex items-center justify-end">
                <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden border-2 border-blue-400/40 relative shadow-md bg-blue-900/40">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                    alt="Start Career Journey"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Floating pill badge */}
                <div className="absolute -bottom-0.5 right-1 sm:right-2 bg-blue-600 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs border border-blue-400/50">
                  ₹199 All Access
                </div>
              </div>
            </div>

            {/* SLIDE 2: Skill Modules (Starting at ₹29 Per Module) */}
            <div className="w-full shrink-0 flex items-center justify-between min-h-[135px] sm:min-h-[155px] lg:h-[180px] bg-gradient-to-r from-[#F0F7FF] via-[#E2F0FE] to-[#D0E5FD] text-[#0B192C] p-3 sm:p-4 lg:p-6 relative overflow-hidden">
              {/* Left Content Column */}
              <div className="flex-1 min-w-0 pr-3 z-10 flex flex-col justify-between h-full py-0.5">
                <div>
                  {/* Top Badge: Starting at ₹29 */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1 sm:mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] sm:text-[11px] font-bold shadow-2xs">
                      <Tag className="w-2.5 h-2.5" />
                      <span>STARTING AT ONLY ₹29</span>
                    </span>
                    <span className="text-[9px] sm:text-xs font-semibold text-blue-900">
                      Per Module • Affordable for all
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-sm sm:text-lg lg:text-xl font-black tracking-tight leading-tight">
                    <span>Skill Modules — </span>
                    <span className="text-blue-600">Small lessons.</span>
                    <span className="text-slate-800"> Big impact.</span>
                  </h2>

                  {/* Subtitle */}
                  <p className="text-slate-600 text-[10px] sm:text-xs leading-snug line-clamp-1 mt-0.5 max-w-lg">
                    Quick, practical modules to help you learn in-demand skills anytime, anywhere.
                  </p>
                </div>

                {/* Micro tags & Display-only Badge Row */}
                <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 select-none">
                  <div
                    className="bg-[#0B192C] text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg font-bold text-[10px] sm:text-xs inline-flex items-center gap-1 shadow-xs shrink-0 cursor-default"
                    id="hero-slide-2-badge"
                  >
                    <span>Bite-sized Learning</span>
                    <Sparkles className="w-3 h-3 text-blue-300" />
                  </div>

                  <div className="hidden md:flex items-center gap-1.5 text-[10px] text-slate-700 font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-white/80 border border-blue-200/60">Forklift ₹29</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/80 border border-blue-200/60">Inventory ₹29</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/80 border border-blue-200/60">Customer ₹29</span>
                  </div>
                </div>
              </div>

              {/* Right Side Visual Graphic */}
              <div className="w-[105px] sm:w-[150px] lg:w-[200px] h-full shrink-0 relative flex items-center justify-end">
                <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden border-2 border-blue-300 relative shadow-md bg-blue-100">
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
                    alt="Skill Modules"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Floating ₹29 Badge */}
                <div className="absolute -bottom-0.5 right-1 sm:right-2 bg-[#FF6B00] text-white text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                  ₹29 / Module
                </div>
              </div>
            </div>

            {/* SLIDE 3: Practice at Your Home (Simulation Lab) */}
            <div className="w-full shrink-0 flex items-center justify-between min-h-[135px] sm:min-h-[155px] lg:h-[180px] bg-gradient-to-r from-[#F8FAFC] via-[#EDF4FA] to-[#DFEAF5] text-[#0B192C] p-3 sm:p-4 lg:p-6 relative overflow-hidden">
              {/* Left Content Column */}
              <div className="flex-1 min-w-0 pr-3 z-10 flex flex-col justify-between h-full py-0.5">
                <div>
                  {/* Top Badge: Simulation Lab */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1 sm:mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] sm:text-[11px] font-bold">
                      <Monitor className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Simulation Lab 🏠</span>
                    </span>
                    <span className="text-[9px] sm:text-xs font-semibold text-slate-600">
                      Safe Environment • Practice from home
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-sm sm:text-lg lg:text-xl font-black tracking-tight leading-tight">
                    <span>Practice at </span>
                    <span className="text-blue-600">Your Home</span>
                  </h2>

                  {/* Subtitle */}
                  <p className="text-slate-600 text-[10px] sm:text-xs leading-snug line-clamp-1 mt-0.5 max-w-lg">
                    Real-life simulations to build confidence before you work in the real world.
                  </p>
                </div>

                {/* Micro tags & Display-only Badge Row */}
                <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 select-none">
                  <div
                    className="bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg font-bold text-[10px] sm:text-xs inline-flex items-center gap-1 shadow-xs shrink-0 cursor-default"
                    id="hero-slide-3-badge"
                  >
                    <span>Simulation Lab</span>
                    <Monitor className="w-3 h-3 text-blue-200" />
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-600 font-medium">
                    <span className="flex items-center gap-0.5 text-blue-700 font-bold">Interactive 3D</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-emerald-700 font-bold">Zero Risk</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-slate-700">Instant Feedback</span>
                  </div>
                </div>
              </div>

              {/* Right Side Visual Graphic */}
              <div className="w-[105px] sm:w-[150px] lg:w-[200px] h-full shrink-0 relative flex items-center justify-end">
                <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-2xl overflow-hidden border-2 border-blue-200 relative shadow-md bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
                    alt="Simulation Lab"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-900/20" />
                </div>
                {/* Floating status pill */}
                <div className="absolute -bottom-0.5 right-1 sm:right-2 bg-emerald-600 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                  Live Lab
                </div>
              </div>
            </div>

          </div>

          {/* Carousel Pagination Indicators */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 cursor-pointer ${
                  currentSlide === idx 
                    ? 'w-4 h-1 bg-[#FF7A00] rounded-full' 
                    : 'w-1.5 h-1 bg-slate-400/60 hover:bg-slate-500 rounded-full'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 2. MAKE YOUR CAREER (Matching Screenshot: Clean Vertical Cards with Icon in Top Right) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7 sm:mt-10" id="make-your-career-section">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B192C] tracking-tight">
              Make Your Career
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Select an industry domain to browse role tracks
            </p>
          </div>
          <button
            onClick={() => navigate('choose-skill')}
            className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer transition-colors"
            id="view-all-skills-btn"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Vertical Skill Cards matching mobile viewport */}
        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-4 overflow-x-auto md:overflow-visible gap-3 sm:gap-4 no-scrollbar snap-x pb-2 pt-1 px-0.5">
          {[
            {
              id: 'logistics-supply-chain',
              name: 'Warehouse & Logistics',
              description: 'Inventory handling, sorting & more',
              icon: Package,
              image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
              imageAlt: 'Warehouse & Logistics'
            },
            {
              id: 'retail-operations',
              name: 'Retail Operations',
              description: 'Store management, visual merchandising',
              icon: ShoppingCart,
              image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80',
              imageAlt: 'Retail Operations'
            },
            {
              id: 'quick-commerce',
              name: 'Quick Commerce',
              description: 'Dark store workflows, picking & delivery',
              icon: Zap,
              image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
              imageAlt: 'Quick Commerce'
            },
            {
              id: 'hospitality',
              name: 'Hospitality & F&B',
              description: 'Dining standards, guest service & more',
              icon: Utensils,
              image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
              imageAlt: 'Hospitality & F&B'
            }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                id={`skill-card-${item.id}`}
                onClick={() => navigate('choose-skill', { selectedSkillId: item.id })}
                className="w-[145px] sm:w-[180px] md:w-auto shrink-0 md:shrink snap-start bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col group"
              >
                {/* Top Image with Floating Icon */}
                <div className="w-full h-28 sm:h-36 md:h-44 relative overflow-hidden bg-slate-100 shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Floating Icon Pill */}
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-xs text-slate-800">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom Details Panel */}
                <div className="p-3 flex flex-col justify-start flex-1 bg-white">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 leading-tight mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 3. HOW SKILLGO WORKS (Matching Screenshot: Stepper Timeline with Connecting Line & Step Badges) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-9 sm:mt-12" id="how-skillgo-works-section">
        
        {/* Section Heading */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B192C] tracking-tight">
            How SkillGo Works
          </h2>
        </div>

        {/* Vertical Stepper with connected line matching screenshot */}
        <div className="space-y-4 max-w-2xl">
          {howSkillGoWorksSteps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === howSkillGoWorksSteps.length - 1;

            return (
              <div 
                key={step.num}
                onClick={() => navigate(step.target as any)}
                className="flex items-start gap-3 sm:gap-4 group cursor-pointer"
              >
                {/* Stepper Node Column */}
                <div className="flex flex-col items-center shrink-0">
                  {/* Step Number Circle */}
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {step.num}
                  </div>
                  {/* Connecting Line */}
                  {!isLast && (
                    <div className="w-0.5 h-10 sm:h-8 bg-blue-200/80 my-1 relative">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-300 absolute top-1/2 -left-[2px]" />
                    </div>
                  )}
                </div>

                {/* Step Content Box with Icon and Details */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0 bg-transparent group-hover:bg-slate-50/60 p-1.5 -mt-1 rounded-xl transition-colors">
                  {/* Rounded Icon Box */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Texts */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-snug mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* 4. CONTINUE LEARNING (CONDITIONAL) */}
      {activeEnrollment && activeRole && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-9 sm:mt-12" id="continue-learning-section">
          
          <div className="mb-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B192C] tracking-tight">
              Continue Learning
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  Active Enrollment
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {activeEnrollment.plan.toUpperCase()} Plan
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {activeRole.title}
              </h3>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Course Progress</span>
                  <span className="font-bold text-slate-900">{activeProgress}%</span>
                </div>
                <ProgressBar value={activeProgress} color="blue" />
              </div>
            </div>

            <div className="shrink-0">
              <Button
                variant="primary"
                size="md"
                iconRight={ArrowRight}
                onClick={() => navigate('course-modules', { roleId: activeRole.id, enrollmentId: activeEnrollment.id })}
                id="resume-learning-btn"
              >
                Resume Learning
              </Button>
            </div>

          </div>

        </section>
      )}

      {/* 5. STANDALONE MODULES (Matching Screenshot: Clean Horizontal Cards with Blue Action Arrow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-9 sm:mt-12" id="standalone-modules-section">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B192C] tracking-tight">
              Standalone Modules
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Quick practical learning when you need it.
            </p>
          </div>
          <button
            onClick={() => navigate('library')}
            className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer transition-colors"
            id="view-all-library-btn"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Modules Row matching screenshot */}
        <div 
          ref={libraryScrollRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto md:overflow-visible no-scrollbar pb-3 pt-1 px-0.5"
        >
          {filteredLibrary.map((item: LibraryItem) => {
            const isPurchased = isLibraryPurchased(item.id);
            const inCart = isInCart(item.id);
            const itemPrice = item.price || 199;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedLibraryItem(item)}
                className="w-[280px] sm:w-[320px] md:w-auto shrink-0 md:shrink bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group"
              >
                {/* Left Side: Thumbnail & Content */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Square Photo with Rounded Corners */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden relative bg-slate-100 shrink-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'}
                      alt={item.imageAlt || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-tight">
                      {item.summary}
                    </p>
                    
                    {/* Timing and Price */}
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-600 font-medium">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.duration || item.readTime}</span>
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-900">
                        ₹{itemPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Action Trigger Arrow */}
                <div className="shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })}
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
