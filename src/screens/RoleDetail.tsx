import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Layers, 
  BookOpen, 
  ChevronRight,
  Check,
  ShoppingBag,
  Plus,
  PlayCircle,
  Award,
  Boxes,
  PackageCheck,
  ClipboardCheck,
  Truck,
  Store,
  CreditCard,
  Eye,
  Zap,
  Navigation,
  UtensilsCrossed,
  ConciergeBell,
  Calendar,
  Wrench,
  Cpu,
  Flame,
  BatteryCharging,
  Sliders,
  ShieldAlert,
  Sprout,
  Activity,
  LucideIcon
} from 'lucide-react';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { useCartState, useEnrollmentState } from '../lib/enrollmentStore';
import { PlanType, JobRole, SkillCategory, CourseModule } from '../lib/types';
import { CartModal } from '../components/CartModal';

// Modern icon mapping per role
const ROLE_ICONS: Record<string, LucideIcon> = {
  // Logistics
  'warehouse-associate': Boxes,
  'qc-inbound-inspector': ClipboardCheck,
  'inventory-staging-specialist': Layers,
  'dispatch-fleet-coordinator': Truck,

  // Retail
  'retail-store-associate': Store,
  'cashier-pos-specialist': CreditCard,
  'visual-merchandiser': Eye,
  'store-inventory-supervisor': PackageCheck,

  // Quick Commerce
  'dark-store-picker-packer': Zap,
  'hub-dispatch-rider-coordinator': Navigation,
  'inbound-fresh-quality-grader': Sprout,
  'dark-store-shift-lead': Activity,

  // Hospitality
  'fb-service-specialist': UtensilsCrossed,
  'guest-relations-associate': ConciergeBell,
  'food-safety-hygiene-officer': ShieldCheck,
  'banquet-event-coordinator': Calendar,

  // Facility Management
  'facility-maintenance-technician': Wrench,
  'bms-operations-executive': Cpu,
  'fls-fire-safety-officer': Flame,
  'utility-hvac-lead': BatteryCharging,
};

// Color accents for modern role icon badges
const ROLE_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  'logistics-supply-chain': { bg: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-200' },
  'retail-operations': { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200' },
  'quick-commerce': { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200' },
  'hospitality': { bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-200' },
  'facility-management': { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
};

export function RoleDetailScreen() {
  const { currentRoute, navigate } = useRouter();
  const { addToCart, isInCart, isSkillEnrolled } = useCartState();
  const { activeEnrollment } = useEnrollmentState();
  
  // Resolve Role and Skill dynamically from route parameters
  const roleId = currentRoute.params?.roleId || JOB_ROLES[0].id;
  const role: JobRole = JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];
  const skill: SkillCategory = SKILL_CATEGORIES.find(s => s.id === role.skillId) || SKILL_CATEGORIES[0];

  // Selected Plan state
  const [selectedPlan, setSelectedPlan] = useState<PlanType>((currentRoute.params?.selectedPlan as PlanType) || 'pro');
  const [showCartModal, setShowCartModal] = useState(false);

  const isEnrolled = isSkillEnrolled(role.id);
  const isLiteInCart = isInCart(role.id, 'lite');
  const isProInCart = isInCart(role.id, 'pro');

  // Role Modern Icon
  const RoleIcon = ROLE_ICONS[role.id] || Boxes;
  const colorTheme = ROLE_COLORS[skill.id] || { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' };

  // Ensure 4 standard modules for display
  const getModulesList = (): { id: string; moduleNumber: number; title: string; durationMinutes: number }[] => {
    if (role.modules && role.modules.length >= 4) {
      return role.modules.map((m, idx) => ({
        id: m.id,
        moduleNumber: idx + 1,
        title: m.title,
        durationMinutes: m.durationMinutes || 25,
      }));
    }

    if (role.modules && role.modules.length > 0) {
      const existing = role.modules.map((m, idx) => ({
        id: m.id,
        moduleNumber: idx + 1,
        title: m.title,
        durationMinutes: m.durationMinutes || 25,
      }));

      const defaultTitles = [
        'Foundational SOPs & Standard Workflows',
        'Operating Systems, Tools & Digital Equipment',
        'Quality Audits, Safety & Anomaly Resolution',
        'Shift Handovers, SLA Tracking & Practical Mastery'
      ];

      while (existing.length < 4) {
        const nextNum = existing.length + 1;
        existing.push({
          id: `${role.id}-mod-${nextNum}`,
          moduleNumber: nextNum,
          title: defaultTitles[nextNum - 1] || `Module ${nextNum}: Workplace Execution`,
          durationMinutes: 25,
        });
      }
      return existing;
    }

    return [
      { id: `${role.id}-mod-1`, moduleNumber: 1, title: 'Inbound Verification & Foundational SOPs', durationMinutes: 25 },
      { id: `${role.id}-mod-2`, moduleNumber: 2, title: 'Digital Systems & Tool Operation', durationMinutes: 30 },
      { id: `${role.id}-mod-3`, moduleNumber: 3, title: 'Quality Audits & Safety Compliance', durationMinutes: 25 },
      { id: `${role.id}-mod-4`, moduleNumber: 4, title: 'SLA Throughput & Shift Performance', durationMinutes: 20 },
    ];
  };

  const moduleList = getModulesList();

  // Selecting the level immediately adds it to cart and pops up the separate cart screen to pay or add more
  const handleSelectLevelAndOpenCart = (plan: PlanType) => {
    if (isEnrolled) {
      navigate('course-modules', { roleId: role.id, skillId: skill.id });
      return;
    }
    const price = plan === 'pro' ? role.proPrice : role.litePrice;
    addToCart({
      id: `cart-skill-${role.id}-${plan}`,
      productId: role.id,
      productType: 'skill',
      title: role.title,
      price,
      selectedPlan: plan,
      skillId: skill.id,
      duration: `${role.durationWeeks} Weeks`
    });
    setSelectedPlan(plan);
    setShowCartModal(true);
  };

  const handleModuleClick = (moduleNum: number) => {
    if (isEnrolled) {
      navigate('course-modules', { roleId: role.id, skillId: skill.id });
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20 font-sans">
      
      {/* 1. BREADCRUMB / TOP BAR NAVIGATION */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 sm:top-18 z-20 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('choose-skill', { selectedSkillId: skill.id })} 
            id="role-detail-top-back-btn"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Back to Roles</span>
          </button>

          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            {skill.name}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-5 sm:pt-10 space-y-6 sm:space-y-10">
        
        {/* 2. ROLE HEADER: MODERN ICON + ROLE TITLE (NO BANNER) */}
        <div className="flex flex-row items-center gap-3.5 sm:gap-5 pb-2" id="role-title-header">
          {/* Modern Icon */}
          <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl ${colorTheme.bg} ${colorTheme.ring} ring-1 flex items-center justify-center shrink-0 shadow-2xs`}>
            <RoleIcon className={`w-7 h-7 sm:w-10 sm:h-10 ${colorTheme.text}`} />
          </div>

          {/* Title & Concise Badges */}
          <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 sm:px-2.5 py-0.5 rounded-md border border-blue-200/60">
                {skill.name}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-slate-500">
                {role.durationWeeks} Weeks
              </span>
            </div>
            
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {role.title}
            </h1>
          </div>
        </div>

        {/* 3. LIST OF MODULES (HORIZONTAL CARDS - NO EXTRA TEXT ONLY REQUIRED) */}
        <section id="role-modules-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-base font-bold text-slate-900 uppercase tracking-wider">
              Course Modules ({moduleList.length})
            </h2>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
              Step-by-step curriculum
            </span>
          </div>

          <div className="space-y-2.5 sm:space-y-3" id="modules-horizontal-list">
            {moduleList.map((m) => (
              <div 
                key={m.id}
                id={`module-card-${m.moduleNumber}`}
                onClick={() => handleModuleClick(m.moduleNumber)}
                className={`bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all duration-200 p-3 sm:p-4.5 flex items-center justify-between gap-3 ${isEnrolled ? 'cursor-pointer' : ''}`}
              >
                {/* Left: Module Number & Title */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 border border-slate-200/70">
                    0{m.moduleNumber}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-base font-semibold text-slate-900 truncate">
                      {m.title}
                    </h3>
                  </div>
                </div>

                {/* Right: Duration tag */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-500 bg-slate-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-slate-200/60">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                    <span>{m.durationMinutes}m</span>
                  </div>

                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SELECT THE LEVEL (AT THE BOTTOM) */}
        <section id="select-level-section" className="pt-4 sm:pt-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Select Your Level
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Click a plan to select your level and choose to pay or add more courses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* LEVEL 1: FOUNDATION (LITE) */}
            <div 
              id="level-card-lite"
              onClick={() => handleSelectLevelAndOpenCart('lite')}
              className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md hover:border-blue-500 ${
                selectedPlan === 'lite'
                  ? 'border-blue-600 bg-blue-50/30 shadow-sm ring-1 ring-blue-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Level 1</span>
                    <h3 className="text-lg font-bold text-slate-900">Foundation Plan</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    Self-Paced
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">₹{role.litePrice}</span>
                  <span className="text-sm font-semibold text-slate-400 line-through">₹{role.liteOriginalPrice || 399}</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">50% OFF</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>All {moduleList.length} Video Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Module Quizzes & Assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>SkillGo Digital Certificate</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                {isEnrolled ? (
                  <div className="w-full py-2.5 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                    Enrolled
                  </div>
                ) : isLiteInCart ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCartModal(true);
                    }}
                    className="w-full py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>In Cart • Pay or Add More →</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLevelAndOpenCart('lite');
                    }}
                    id="choose-foundation-btn"
                    className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedPlan === 'lite'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Select Foundation (₹{role.litePrice}) →</span>
                  </button>
                )}
              </div>
            </div>

            {/* LEVEL 2: PROFESSIONAL (PRO) */}
            <div 
              id="level-card-pro"
              onClick={() => handleSelectLevelAndOpenCart('pro')}
              className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative hover:shadow-md hover:border-blue-500 ${
                selectedPlan === 'pro'
                  ? 'border-blue-600 bg-blue-50/30 shadow-sm ring-1 ring-blue-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                Recommended
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Level 2</span>
                    <h3 className="text-lg font-bold text-slate-900">Professional Plan</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                    Digital + Lab
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">₹{role.proPrice}</span>
                  <span className="text-sm font-semibold text-slate-400 line-through">₹{role.proOriginalPrice || 799}</span>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">50% OFF</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Everything in Foundation included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Practical Simulation Labs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Interactive Hardware / Barcode Sim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Priority Partner Hiring Referral</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                {isEnrolled ? (
                  <div className="w-full py-2.5 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                    Enrolled
                  </div>
                ) : isProInCart ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCartModal(true);
                    }}
                    className="w-full py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>In Cart • Pay or Add More →</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLevelAndOpenCart('pro');
                    }}
                    id="choose-pro-btn"
                    className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedPlan === 'pro'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Select Professional (₹{role.proPrice}) →</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* 5. GO BACK BUTTON AT THE BOTTOM */}
        <div className="pt-6 sm:pt-8 flex justify-center">
          <button
            onClick={() => navigate('choose-skill', { selectedSkillId: skill.id })}
            id="role-detail-bottom-back-btn"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Go Back</span>
          </button>
        </div>

      </div>

      {/* Cart Modal Screen Pop-up */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />

    </div>
  );
}
