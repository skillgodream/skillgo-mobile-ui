import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Building, 
  Award, 
  BookOpen, 
  Layers, 
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Button, Badge, Modal } from '../components/ui';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useEnrollmentState, enrollmentStore } from '../lib/enrollmentStore';
import { useRouter } from '../lib/router';
import { JobRole, SkillCategory, Enrollment } from '../lib/types';

export function CourseCompleteScreen() {
  const { currentRoute, navigate } = useRouter();
  const { activeEnrollment } = useEnrollmentState();

  const roleId = currentRoute.params?.roleId || activeEnrollment?.roleId || JOB_ROLES[0].id;
  const role: JobRole = JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];
  const skill: SkillCategory = SKILL_CATEGORIES.find(s => s.id === role.skillId) || SKILL_CATEGORIES[0];

  const enrollment: Enrollment = (activeEnrollment && activeEnrollment.roleId === role.id)
    ? activeEnrollment
    : enrollmentStore.getEnrollments().find(e => e.roleId === role.id) || {
        id: `enr-${Date.now()}`,
        roleId: role.id,
        skillId: skill.id,
        plan: 'lite',
        enrollmentDate: new Date().toISOString().split('T')[0],
        completedModules: role.modules.map(m => m.id),
        currentModuleId: role.modules[0]?.id || 'mod-1',
        quizScores: {},
        isCompleted: true
      };

  const isPro = enrollment.plan === 'pro' || enrollment.practicalPurchased;
  const practicalUpgradePrice = role.proPrice > role.litePrice ? role.proPrice - role.litePrice : 1299;

  // Upgrade modal state for Lite learners
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);

  const handleChooseCertification = () => {
    navigate('final-assessment', { roleId: role.id, enrollmentId: enrollment.id });
  };

  const handleChoosePractical = () => {
    if (isPro) {
      // Pro already includes practical training
      navigate('practical-training', { roleId: role.id, enrollmentId: enrollment.id });
    } else {
      // Open practical upgrade modal
      setShowUpgradeModal(true);
    }
  };

  const handleConfirmUpgradePayment = () => {
    setIsProcessingUpgrade(true);
    setTimeout(() => {
      enrollmentStore.upgradeToPractical(enrollment.id);
      setIsProcessingUpgrade(false);
      setShowUpgradeModal(false);
      navigate('practical-training', { roleId: role.id, enrollmentId: enrollment.id });
    }, 600);
  };

  return (
    <div className="w-full bg-[#FDFDFE] min-h-screen pb-20">
      
      {/* 1. TOP CONTEXT BAR */}
      <header className="bg-white border-b border-slate-100 sticky top-16 sm:top-18 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <button 
              onClick={() => navigate('course-modules', { roleId: role.id })}
              className="inline-flex items-center gap-1.5 hover:text-slate-900 font-semibold transition-colors cursor-pointer text-slate-600"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Back to Course Modules</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold truncate">Course Complete</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="emerald" className="text-[11px] font-bold">
              Modules Complete
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10">
        
        {/* 2. COURSE COMPLETION BANNER (Sophisticated Achievement Card) */}
        <section className="bg-gradient-to-r from-[#EFF5FA] via-[#F4F9FD] to-[#EEF5FA] rounded-3xl p-6 sm:p-10 border border-[#D5E3EF] shadow-xs text-center relative overflow-hidden" id="course-complete-banner">
          
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-5 shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <span>LEARNING COMPLETE</span>
          </span>

          <h1 className="text-2xl sm:text-3.5xl font-black text-[#0B192C] tracking-tight mb-2">
            You've completed the learning program
          </h1>

          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            {role.title}
          </p>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
            Domain: {skill.name} • All {role.moduleCount} sequential SOP masterclasses & knowledge quizzes verified.
          </p>

          <div className="inline-flex items-center gap-6 px-5 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 shadow-2xs">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{role.moduleCount}/{role.moduleCount} Modules Passed</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5 text-blue-700">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>100% Curriculum Finished</span>
            </div>
          </div>

        </section>

        {/* 3. TWO NEXT-PATH OPTIONS */}
        <section className="space-y-6" id="next-path-options">
          
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
              Choose your next step
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Proceed directly to final assessment for certification or add hands-on practical preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* OPTION A: GET CERTIFIED (Core Path) */}
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-6 sm:p-8 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    Core Path
                  </span>
                  <Award className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Get Certified
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Take the final scenario assessment to verify your SOP mastery and earn your official SkillGo digital credential.
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-100 mb-8 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Core learning modules completed</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Final 5-scenario assessment</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Verifiable SkillGo digital certificate</span>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-center"
                  iconRight={ArrowRight}
                  onClick={handleChooseCertification}
                  id="choose-certification-path-btn"
                >
                  Continue to Assessment
                </Button>
              </div>
            </div>

            {/* OPTION B: GET PRACTICAL (Hands-on Prep) */}
            <div className="bg-white rounded-3xl border-2 border-[#0B192C] p-6 sm:p-8 shadow-md relative flex flex-col justify-between">
              
              {isPro && (
                <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider shadow-2xs">
                  Included in Pro Plan
                </div>
              )}

              {!isPro && (
                <div className="absolute -top-3 right-6 bg-[#0B192C] text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider shadow-2xs">
                  Recommended Add-on
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                    Hands-On Preparation
                  </span>
                  <Building className="w-5 h-5 text-blue-600" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Get Practical
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Practice interactive simulated dock operations, barcode RF handheld routines, and inventory workflows.
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-100 mb-8 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2.5 text-slate-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Everything in core learning</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>4 interactive practical on-floor simulations</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>RF Gun & pallet handling practice</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Assessment & Verifiable Certificate</span>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  iconRight={ArrowRight}
                  onClick={handleChoosePractical}
                  id="choose-practical-path-btn"
                >
                  {isPro ? 'Continue to Practical Training' : `Add Practical Training (₹${practicalUpgradePrice})`}
                </Button>
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* 4. PRACTICAL UPGRADE MODAL (For Lite Learners) */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Add Practical Training"
        maxWidth="max-w-md"
      >
        <div className="space-y-5 text-sm text-slate-700">
          
          <p className="text-xs text-slate-600 leading-relaxed">
            Upgrade your enrollment to include 4 interactive practical training simulations and equipment practice.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Target Role:</span>
              <span className="font-bold text-slate-900">{role.title}</span>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Practical Upgrade Fee:</span>
              <span className="font-black text-lg text-[#0B192C]">₹{practicalUpgradePrice}</span>
            </div>

            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>4 Practical Simulations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Equipment & RF Gun Scenarios</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full Certificate Access</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Instant Access to Practical Workspace</span>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isProcessingUpgrade}
              onClick={handleConfirmUpgradePayment}
              id="confirm-practical-upgrade-btn"
            >
              {isProcessingUpgrade ? 'Upgrading...' : `Pay ₹${practicalUpgradePrice} & Start Practical`}
            </Button>

            <button
              onClick={() => {
                setShowUpgradeModal(false);
                navigate('final-assessment', { roleId: role.id, enrollmentId: enrollment.id });
              }}
              className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-1.5 cursor-pointer"
            >
              Not now, continue to Assessment
            </button>
          </div>

        </div>
      </Modal>

    </div>
  );
}
