import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Award, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Printer, 
  Share2, 
  Lock, 
  Copy, 
  Check, 
  ExternalLink,
  QrCode,
  Sparkles,
  Search
} from 'lucide-react';
import { Button, Badge, SkillGoLogo } from '../components/ui';
import { useEnrollmentState, enrollmentStore } from '../lib/enrollmentStore';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { CertificateRecord, Enrollment, CertificateStatus } from '../lib/types';

export function CertificateScreen() {
  const { currentRoute, navigate } = useRouter();
  const { activeEnrollment, certificates, profile } = useEnrollmentState();
  const certificateRef = useRef<HTMLDivElement>(null);

  const certificateIdParam = currentRoute.params?.certificateId;
  const roleIdParam = currentRoute.params?.roleId || activeEnrollment?.roleId;

  // Resolve specific certificate or active enrollment certificate
  const matchedCert = certificateIdParam
    ? certificates.find(c => c.id.toUpperCase() === certificateIdParam.toUpperCase())
    : (activeEnrollment && certificates.find(c => c.enrollmentId === activeEnrollment.id)) || certificates[0];

  const targetEnrollment: Enrollment | undefined = activeEnrollment || enrollmentStore.getEnrollments()[0];

  // Eligibility check
  const eligibility: { eligible: boolean; status: CertificateStatus; reason?: string } = targetEnrollment 
    ? enrollmentStore.checkCertificateEligibility(targetEnrollment) 
    : { eligible: !!matchedCert, status: (matchedCert ? 'issued' : 'locked') as CertificateStatus, reason: undefined };
  const isEligibleOrIssued = eligibility.eligible || !!matchedCert;

  const role = JOB_ROLES.find(r => r.id === (matchedCert?.roleId || targetEnrollment?.roleId || roleIdParam || JOB_ROLES[0].id)) || JOB_ROLES[0];
  const skill = SKILL_CATEGORIES.find(s => s.id === (matchedCert?.skillId || targetEnrollment?.skillId || role.skillId)) || SKILL_CATEGORIES[0];

  // Generate or retrieve permanent certificate
  const cert: CertificateRecord = matchedCert || (targetEnrollment && isEligibleOrIssued
    ? enrollmentStore.generateCertificate(targetEnrollment)
    : {
        id: 'SG-CERT-884912',
        enrollmentId: targetEnrollment?.id || 'enr-demo',
        learnerId: 'USR-8849',
        candidateName: profile.name || 'Vikram Sharma',
        skillId: skill.id,
        skillCategory: skill.name,
        roleId: role.id,
        roleTitle: role.title,
        plan: targetEnrollment?.plan || 'pro',
        issueDate: targetEnrollment?.completionDate || new Date().toISOString().split('T')[0],
        grade: 'A+ (Distinction)',
        scoreAvg: 92,
        assessmentScore: 92,
        practicalCompleted: true,
        verificationCode: 'VERIFY-SG-4A82X9',
        verificationStatus: 'valid',
        isValid: true
      });

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // If learner is strictly locked
  if (!isEligibleOrIssued) {
    return (
      <div className="w-full bg-[#FDFDFE] min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#0B192C]">Certificate Locked</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {eligibility.reason || 'You must complete all required modules and pass the final assessment before your certificate can be issued.'}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('course-modules', { roleId: role.id })}
            >
              Resume Course Modules
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('home')}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#verify=${cert.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyId = () => {
    navigator.clipboard?.writeText(cert.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      window.print();
      setDownloadSuccess(false);
    }, 400);
  };

  return (
    <div className="w-full bg-[#FDFDFE] min-h-screen pb-20">
      
      {/* 1. TOP CONTEXT HEADER */}
      <header className="bg-white border-b border-slate-100 sticky top-16 sm:top-18 z-30 shadow-2xs print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <button 
            onClick={() => navigate('my-learning')} 
            className="inline-flex items-center gap-1.5 hover:text-slate-900 font-semibold transition-colors cursor-pointer text-slate-600 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>My Learning</span>
          </button>

          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              icon={copiedId ? Check : Copy} 
              onClick={handleCopyId}
              id="copy-cert-id-btn"
            >
              {copiedId ? 'ID Copied' : 'Copy ID'}
            </Button>

            <Button 
              size="sm" 
              variant="outline" 
              icon={copiedLink ? Check : Share2} 
              onClick={handleCopyLink}
              id="share-cert-link-btn"
            >
              {copiedLink ? 'Link Copied' : 'Share Credential'}
            </Button>

            <Button 
              size="sm" 
              variant="outline" 
              icon={Printer} 
              onClick={handlePrint}
              id="print-cert-btn"
            >
              Print
            </Button>

            <Button 
              size="sm" 
              variant="primary" 
              icon={downloadSuccess ? Check : Download} 
              onClick={handleDownload}
              id="download-cert-btn"
            >
              {downloadSuccess ? 'Preparing...' : 'Download PDF'}
            </Button>
          </div>

        </div>
      </header>

      {/* 2. MAIN ACHIEVEMENT & PREVIEW AREA */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* TOP ACHIEVEMENT BANNER */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-3xl border border-emerald-200/90 shadow-2xs print:hidden space-y-3">
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CERTIFICATION COMPLETE</span>
            </span>
            <span className="text-xs font-semibold text-emerald-800 hidden sm:inline">
              Verified Credential Issued
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B192C] tracking-tight">
              Congratulations, {cert.candidateName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              You have successfully completed the <strong>{cert.roleTitle}</strong> certification program under the <strong>{cert.skillCategory}</strong> domain.
            </p>
          </div>

        </div>

        {/* 3. PREMIUM CERTIFICATE PREVIEW DOCUMENT */}
        <div 
          ref={certificateRef}
          className="bg-white rounded-3xl p-8 sm:p-14 border-2 border-slate-900 shadow-xl relative overflow-hidden text-center max-w-4xl mx-auto print:border-none print:shadow-none print:p-8"
        >
          
          {/* Outer Geometric Border */}
          <div className="absolute inset-3 sm:inset-4 border border-slate-200 rounded-2xl pointer-events-none" />
          <div className="absolute inset-5 sm:inset-6 border border-slate-100 rounded-xl pointer-events-none" />

          {/* Corner Geometric Accents */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-slate-900 pointer-events-none hidden sm:block" />
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-slate-900 pointer-events-none hidden sm:block" />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-slate-900 pointer-events-none hidden sm:block" />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-slate-900 pointer-events-none hidden sm:block" />

          <div className="relative z-10 space-y-6 sm:space-y-8">
            
            {/* Header: Logo & Badge */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <SkillGoLogo size="lg" />

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>OFFICIAL VERIFIED CREDENTIAL</span>
              </div>
            </div>

            {/* Document Title */}
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-extrabold">
                Certificate of Professional Certification
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Issued by SkillGo Learning Systems & Industry Assessment Board
              </p>
            </div>

            {/* Certifies That Section */}
            <div className="py-2 space-y-2">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                This certifies that
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B192C] tracking-tight py-1 font-serif">
                {cert.candidateName}
              </h2>

              <div className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-1">
                has satisfied all standardized operating procedures, curriculum requirements, practical simulations, and final competency evaluations for the job role of
              </div>
            </div>

            {/* Role Title & Skill Domain */}
            <div className="py-3 px-6 bg-slate-50/70 rounded-2xl border border-slate-100 max-w-xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-black text-[#FF6B00] tracking-tight">
                {cert.roleTitle}
              </h3>
              <p className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider">
                Domain: {cert.skillCategory} • {cert.plan.toUpperCase()} Track
              </p>
            </div>

            {/* Core Credential Verification Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto py-4 border-y border-slate-100 text-xs">
              <div className="text-left sm:text-center">
                <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Issued On</div>
                <div className="font-extrabold text-slate-900 mt-0.5">{cert.issueDate}</div>
              </div>

              <div className="text-left sm:text-center">
                <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Grade Awarded</div>
                <div className="font-extrabold text-slate-900 mt-0.5">{cert.grade}</div>
              </div>

              <div className="text-left sm:text-center">
                <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Score Achieved</div>
                <div className="font-extrabold text-slate-900 mt-0.5">{cert.scoreAvg}%</div>
              </div>

              <div className="text-left sm:text-center">
                <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Status</div>
                <div className="font-extrabold text-emerald-600 mt-0.5 flex items-center justify-start sm:justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid & Active</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer: Verification Code & QR Box */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-left border-t border-slate-100">
              
              <div className="text-xs text-slate-400 font-mono space-y-1">
                <div>Certificate ID: <strong className="text-slate-900 font-bold">{cert.id}</strong></div>
                <div>Verification Code: <strong className="text-slate-900 font-bold">{cert.verificationCode}</strong></div>
                <div className="text-[10px] text-slate-400">Ledger Entry: 0x{cert.id.replace(/[^0-9]/g, '')}F8A • Public Record</div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs">
                <div className="w-12 h-12 bg-[#0B192C] text-white rounded-xl flex flex-col items-center justify-center font-bold">
                  <QrCode className="w-6 h-6 text-slate-100" />
                  <span className="text-[8px] tracking-tighter uppercase font-mono">SCAN</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <div className="font-bold text-slate-900">Scan to Verify Credential</div>
                  <div className="text-[#FF6B00] font-bold font-mono">skillgo.com/verify</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Recruiter Direct Portal</div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 4. ACTIONS & NEXT STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto print:hidden">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <Share2 className="w-4 h-4 text-blue-600" />
              <span>Share with Recruiters</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Attach this verified credential to your resume, LinkedIn profile, or job applications. Recruiters can verify it instantly online.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied' : 'Copy Verification Link'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <Search className="w-4 h-4 text-emerald-600" />
              <span>Public Verification Status</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anyone with Certificate ID <strong>{cert.id}</strong> can verify your authenticity without exposing sensitive personal info.
            </p>
            <div className="pt-1">
              <button
                onClick={() => navigate('my-learning')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
              >
                Return to My Learning Hub
              </button>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
