import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  Award, 
  BookOpen, 
  Layers, 
  TrendingUp, 
  GraduationCap, 
  Hourglass,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Boxes,
  Barcode,
  Lock,
  Wrench,
  Smartphone
} from 'lucide-react';
import { Button, Badge, ProgressBar } from '../components/ui';
import { useEnrollmentState, enrollmentStore } from '../lib/enrollmentStore';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { Enrollment, JobRole, CourseModule } from '../lib/types';

export function MyLearningScreen() {
  const { navigate } = useRouter();
  const { certificates, profile } = useEnrollmentState();

  const allEnrollments: Enrollment[] = enrollmentStore.getEnrollments();
  const inProgressEnrollments = allEnrollments.filter(e => !e.isCompleted && !e.assessmentPassed);
  const completedEnrollments = allEnrollments.filter(e => e.isCompleted || e.assessmentPassed);

  // Check if learner has any Professional Plan (which includes Practical Simulation Lab)
  const proEnrollments = allEnrollments.filter(e => e.plan === 'pro');
  const hasProPlan = proEnrollments.length > 0;
  const primaryProEnrollment = proEnrollments[0] || (allEnrollments.length > 0 ? allEnrollments[0] : null);
  const proRole = primaryProEnrollment ? (JOB_ROLES.find(r => r.id === primaryProEnrollment.roleId) || JOB_ROLES[0]) : JOB_ROLES[0];
  const proCompletedPracticals = primaryProEnrollment?.completedPracticalActivities || [];

  // Time-aware wishing greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Metrics Calculations
  const totalSkillsCount = allEnrollments.length || 1;
  
  // Total completed modules across all enrolled skills
  const totalModulesLearned = allEnrollments.reduce((acc, curr) => {
    return acc + (curr.completedModules?.length || 0);
  }, 0);

  // Total modules available across enrolled skills
  const totalEnrolledModulesCount = allEnrollments.reduce((acc, curr) => {
    const role = JOB_ROLES.find(r => r.id === curr.roleId);
    return acc + (role?.modules?.length || 4);
  }, 0) || 4;

  // Total pending modules
  const pendingModulesCount = Math.max(0, totalEnrolledModulesCount - totalModulesLearned);

  // Overall progress percentage
  const overallProgressPercent = totalEnrolledModulesCount > 0 
    ? Math.min(100, Math.round((totalModulesLearned / totalEnrolledModulesCount) * 100))
    : 0;

  // Active ongoing enrollments (or fallback to primary)
  const activeOngoingCourses = inProgressEnrollments.length > 0 
    ? inProgressEnrollments 
    : (allEnrollments.length > 0 ? [allEnrollments[0]] : []);

  // Empty state if absolutely no courses exist
  if (allEnrollments.length === 0 && certificates.length === 0) {
    return (
      <div className="w-full bg-[#F8FAFC] min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xs text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#0B192C] tracking-tight">
              Your learning journey starts here
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              Enroll in high-demand vocational tracks and build career-ready job skills.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              iconRight={ArrowRight}
              className="w-full"
              onClick={() => navigate('choose-skill')}
            >
              Explore Skills
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Learner display picture (LinkedIn style avatar)
  const learnerAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pb-20 font-sans text-slate-900">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-7">

        {/* 1. DASHBOARD HEADER: LEFT DISPLAY PIC (LINKEDIN STYLE) + WISHING + LEARNER NAME */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4" id="learner-profile-header">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            {/* Display Picture: Like LinkedIn, circular/rounded, not too big */}
            <div className="relative shrink-0">
              <img
                src={learnerAvatarUrl}
                alt={profile.name || 'Learner'}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-blue-500/20 shadow-xs border-2 border-white"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* Wishing (Good morning / afternoon) + Name */}
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-500">
                {getGreeting()},
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                {profile.name || 'Daizy Shah'}
              </h1>
            </div>
          </div>

          {/* Quick learning streak indicator */}
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200/60 text-xs font-bold">
            <span>🔥</span>
            <span className="hidden sm:inline">6 Day Streak</span>
            <span className="sm:hidden">6d</span>
          </div>
        </div>

        {/* 2. OVERVIEW CARDS: 4 VERTICAL CARDS IN DIFFERENT LIGHT COLORS WITH ICONS */}
        <section id="overview-metrics-section" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Overview
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            
            {/* CARD 1: TOTAL SKILL ENROLLED (Light Peach / Warm Orange) */}
            <div 
              id="metric-card-skills"
              className="bg-[#FFF6F0] border border-orange-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-4.5 flex flex-col justify-between transition-all hover:shadow-xs group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/90 text-orange-600 shadow-2xs flex items-center justify-center mb-2 sm:mb-3">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-orange-950/70 uppercase tracking-wider block">
                  Total Skill Enrolled
                </span>
                <div className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                  {totalSkillsCount} <span className="text-[11px] sm:text-xs font-semibold text-slate-500">{totalSkillsCount === 1 ? 'Skill' : 'Skills'}</span>
                </div>
              </div>
            </div>

            {/* CARD 2: TOTAL MODULE LEARNED (Light Lavender / Soft Purple) */}
            <div 
              id="metric-card-modules-learned"
              className="bg-[#F6F2FF] border border-purple-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-4.5 flex flex-col justify-between transition-all hover:shadow-xs group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/90 text-purple-600 shadow-2xs flex items-center justify-center mb-2 sm:mb-3">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-purple-950/70 uppercase tracking-wider block">
                  Total Module Learned
                </span>
                <div className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                  {totalModulesLearned} <span className="text-[11px] sm:text-xs font-semibold text-slate-500">{totalModulesLearned === 1 ? 'Module' : 'Modules'}</span>
                </div>
              </div>
            </div>

            {/* CARD 3: PROGRESS IN PERCENTAGE (Light Sky Blue) */}
            <div 
              id="metric-card-progress"
              className="bg-[#F0F7FF] border border-sky-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-4.5 flex flex-col justify-between transition-all hover:shadow-xs group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/90 text-sky-600 shadow-2xs flex items-center justify-center mb-2 sm:mb-3">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-sky-950/70 uppercase tracking-wider block">
                  Progress
                </span>
                <div className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                  {overallProgressPercent}%
                </div>
              </div>
            </div>

            {/* CARD 4: PENDING (Light Rose / Soft Pink) */}
            <div 
              id="metric-card-pending"
              className="bg-[#FFF1F2] border border-rose-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-4.5 flex flex-col justify-between transition-all hover:shadow-xs group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/90 text-rose-600 shadow-2xs flex items-center justify-center mb-2 sm:mb-3">
                <Hourglass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-950/70 uppercase tracking-wider block">
                  Pending
                </span>
                <div className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                  {pendingModulesCount} <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Modules</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. SMART DIRECT ACCESS: SIMULATION LAB (FOR ENROLLED PRO PLAN LEARNERS) */}
        <section id="simulation-lab-smart-access-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Simulation Lab
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-300">
                {hasProPlan ? 'Pro Access Active' : 'Simulation Lab'}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Click to Open
            </span>
          </div>

          <div 
            id="simulation-lab-card"
            onClick={() => {
              if (hasProPlan || primaryProEnrollment) {
                navigate('practical-training', { roleId: proRole.id, from: 'my-learning' });
              } else {
                navigate('choose-plan', { roleId: proRole.id });
              }
            }}
            className="bg-gradient-to-br from-[#0B192C] via-[#1E293B] to-[#0F172A] rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden border border-slate-700/60 cursor-pointer hover:border-emerald-400/60 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              
              {/* Left Details */}
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Practical Simulation Lab</span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                    Simulation Lab
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    Interactive hands-on practical simulations and scenario-based training sandbox.
                  </p>
                </div>
              </div>

              {/* Right CTA / Action Button */}
              <div className="shrink-0 flex flex-col items-start sm:items-end justify-center gap-2.5">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-semibold text-emerald-400 block">
                    {proCompletedPracticals.length > 0 ? `${proCompletedPracticals.length} of 4 Activities Completed` : 'Ready to Start'}
                  </span>
                  <span className="text-xs text-slate-400">
                    Full Hands-on Sandbox
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasProPlan || primaryProEnrollment) {
                      navigate('practical-training', { roleId: proRole.id, from: 'my-learning' });
                    } else {
                      navigate('choose-plan', { roleId: proRole.id });
                    }
                  }}
                  id="launch-sim-lab-direct-btn"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                >
                  <span>Launch Simulation Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* 4. ONGOING COURSES: MODULE SNAP CARD WITH PROGRESS PERCENTAGE */}
        <section id="ongoing-courses-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Ongoing Courses
            </h2>
            <span className="text-xs font-medium text-slate-400">
              {activeOngoingCourses.length} In Progress
            </span>
          </div>

          <div className="space-y-3" id="ongoing-courses-list">
            {activeOngoingCourses.map((enr) => {
              const role: JobRole = JOB_ROLES.find(r => r.id === enr.roleId) || JOB_ROLES[0];
              const skill = SKILL_CATEGORIES.find(s => s.id === enr.skillId) || SKILL_CATEGORIES[0];
              
              const totalCourseModules = role.modules?.length || 4;
              const completedCourseCount = enr.completedModules?.length || 0;
              const courseProgressPercent = Math.round((completedCourseCount / totalCourseModules) * 100);
              
              // Next module to continue
              const currentMod = role.modules.find(m => !enr.completedModules?.includes(m.id)) || role.modules[0];

              // Course visual snap thumbnail
              const snapImage = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80";

              return (
                <div
                  key={enr.id}
                  id={`ongoing-snap-card-${enr.id}`}
                  onClick={() => {
                    if (currentMod) {
                      navigate('module-video', { roleId: role.id, moduleId: currentMod.id, enrollmentId: enr.id });
                    } else {
                      navigate('course-modules', { roleId: role.id });
                    }
                  }}
                  className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-xs p-3 sm:p-5 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    
                    {/* Top/Left Section on mobile: Thumbnail + Info side by side */}
                    <div className="flex items-center sm:items-start gap-3 flex-1 min-w-0">
                      {/* Snap Thumbnail with Play overlay */}
                      <div className="relative w-20 h-20 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60">
                        <img
                          src={snapImage}
                          alt={role.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-sm">
                            <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-600 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Middle Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {skill.name}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">
                            {enr.plan.toUpperCase()}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {role.title}
                        </h3>

                        <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                          {currentMod ? `M0${currentMod.moduleNumber}: ${currentMod.title}` : 'All theory completed'}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="w-full sm:w-auto flex flex-col justify-between gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Progress Bar & Percentage */}
                      <div className="space-y-1 sm:min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-blue-600 font-bold">{courseProgressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                            style={{ width: `${courseProgressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons: Resume Video & Direct Sim Lab for Pro */}
                      <div className="flex items-center gap-2">
                        {enr.plan === 'pro' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('practical-training', { roleId: role.id, from: 'my-learning' });
                            }}
                            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg sm:rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                            title="Direct Access to Practical Simulation Lab"
                          >
                            <Zap className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Sim Lab</span>
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentMod) {
                              navigate('module-video', { roleId: role.id, moduleId: currentMod.id, enrollmentId: enr.id });
                            } else {
                              navigate('course-modules', { roleId: role.id });
                            }
                          }}
                          className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg sm:rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>Resume</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. AT THE BOTTOM: COMPLETION (SKILL / MODULE) - MINIMAL TEXT */}
        <section id="completion-section" className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Completion (Skill / Module)
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Click to open
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            
            {/* Completed Skills */}
            {completedEnrollments.length > 0 && (
              completedEnrollments.map((enr) => {
                const role = JOB_ROLES.find(r => r.id === enr.roleId) || JOB_ROLES[0];
                const firstMod = role.modules?.[0];
                return (
                  <div 
                    key={enr.id} 
                    onClick={() => navigate('module-video', { roleId: role.id, moduleId: firstMod?.id || 'mod-1' })}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block truncate">{role.title}</span>
                        <span className="text-[10px] text-slate-400">Skill Track • Full Access</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        100%
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })
            )}

            {/* Completed Modules Listing - Free Open Access */}
            <div 
              onClick={() => navigate('module-video', { roleId: 'warehouse-associate', moduleId: 'mod-1' })}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="truncate">
                  <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors block truncate">Warehouse Operations Basics</span>
                  <span className="text-[10px] text-slate-400">Module 01</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold text-emerald-600">100%</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            <div 
              onClick={() => navigate('module-video', { roleId: 'warehouse-associate', moduleId: 'mod-2' })}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="truncate">
                  <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors block truncate">Inventory Management Essentials</span>
                  <span className="text-[10px] text-slate-400">Module 02</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold text-emerald-600">100%</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            <div 
              onClick={() => navigate('module-video', { roleId: 'warehouse-associate', moduleId: 'mod-3' })}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="truncate">
                  <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors block truncate">Safety & Compliance on the Floor</span>
                  <span className="text-[10px] text-slate-400">Module 03</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold text-emerald-600">100%</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

          </div>
        </section>

      </div>

    </div>
  );
}
