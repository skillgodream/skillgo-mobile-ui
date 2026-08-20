import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Award, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  Check
} from 'lucide-react';
import { Button, Badge, ProgressBar } from '../components/ui';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useEnrollmentState, enrollmentStore } from '../lib/enrollmentStore';
import { useRouter } from '../lib/router';
import { JobRole, SkillCategory, Enrollment } from '../lib/types';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DEFAULT_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'aq-1',
    question: 'During inbound receiving, a shipment arrives with an unbroken outer seal, but 3 cartons show crushed corners. What is the standard operating procedure (SOP)?',
    options: [
      'Refuse the entire delivery immediately at the security gate without unloading.',
      'Accept all cartons without remarks to avoid carrier detention charges.',
      'Unload, document damage on the GRN/Proof of Delivery, photograph items, and quarantine the 3 crushed cartons for inspection.',
      'Open the crushed cartons and mix remaining good units into pick bins directly.'
    ],
    correctIndex: 2,
    explanation: 'SOP dictates unloading the shipment while formally logging physical discrepancies on the delivery note, quarantining affected units, and filing a discrepancy report.'
  },
  {
    id: 'aq-2',
    question: 'When operating an RF handheld scanner in the warehouse, what should an associate do if a barcode fails to scan twice?',
    options: [
      'Manually key in the barcode digits using keypad entry and verify SKU description against the physical label.',
      'Skip the item and pick an adjacent product from another bin.',
      'Discard the barcode and create a handwritten paper ticket.',
      'Restart the warehouse central server.'
    ],
    correctIndex: 0,
    explanation: 'Manual numeric entry with mandatory secondary verification of product description prevents inventory discrepancies.'
  },
  {
    id: 'aq-3',
    question: 'In batch order picking, what is the primary benefit of Pick-to-Tote sequencing?',
    options: [
      'It eliminates the need for warehouse management software.',
      'It consolidates multiple customer orders into a single travel route across warehouse aisles, reducing walking time.',
      'It allows warehouse staff to pick without verifying SKU numbers.',
      'It reduces carton palletization requirements to zero.'
    ],
    correctIndex: 1,
    explanation: 'Batch picking aggregates identical SKU demands across orders into optimized travel paths, cutting floor travel by up to 60%.'
  },
  {
    id: 'aq-4',
    question: 'What is the correct protocol for stretch-wrapping a standard 1.2m wooden pallet for outbound transit?',
    options: [
      'Wrap only the top layer of cartons with single-ply film.',
      'Apply at least 3 base wraps interlocking the pallet base, 50% overlap upward, and 3 locking top wraps with tension.',
      'Use scotch tape along the four outer carton corners.',
      'Leave all 4 corners uncovered for ventilation.'
    ],
    correctIndex: 1,
    explanation: 'Interlocking the wooden base with multiple tight tension wraps ensures structural pallet integrity during dynamic truck transport.'
  },
  {
    id: 'aq-5',
    question: 'Before releasing an outbound carrier trailer from the dispatch dock, which safety and documentation checkpoint is mandatory?',
    options: [
      'Ensure the dock leveler is retracted, wheel chocks are secured, and the signed digital gate pass is verified against the bill of lading.',
      'Allow the driver to depart without checking bill of lading copies.',
      'Only check if the driver has a valid driver license.',
      'Verify that the warehouse lights are turned off.'
    ],
    correctIndex: 0,
    explanation: 'Pre-dispatch verification includes physical dock safety checks (dock plates, wheel chocks) and validation of signed shipping manifests.'
  }
];

export function FinalAssessmentScreen() {
  const { currentRoute, navigate } = useRouter();
  const { activeEnrollment, profile } = useEnrollmentState();

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
        isCompleted: false
      };

  const questions = DEFAULT_ASSESSMENT_QUESTIONS;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  const currentQ = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const score = Math.round((correct / totalQuestions) * 100);
    const passed = score >= 70;

    setCalculatedScore(score);
    setIsPassed(passed);
    setIsSubmitted(true);

    // Save assessment results in persistent enrollmentStore
    enrollmentStore.recordAssessmentResult(enrollment.id, score, passed);
  };

  const handleRetakeAssessment = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setCalculatedScore(0);
    setIsPassed(false);
  };

  return (
    <div className="w-full bg-[#FDFDFE] min-h-screen pb-20">
      
      {/* 1. TOP CONTEXT HEADER */}
      <header className="bg-white border-b border-slate-100 sticky top-16 sm:top-18 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('course-complete', { roleId: role.id })}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Return"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">{skill.name}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  CERTIFICATION ASSESSMENT
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-[#0B192C] leading-tight">
                {role.title} — Final Assessment
              </h1>
            </div>
          </div>

          {!isSubmitted && (
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <div className="w-24 mt-1 hidden sm:block">
                <ProgressBar value={Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)} color="blue" />
              </div>
            </div>
          )}

        </div>
      </header>

      {/* 2. MAIN ASSESSMENT CONTAINER */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {!isSubmitted ? (
          
          /* ACTIVE ASSESSMENT VIEW */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-2xs space-y-8">
            
            {/* Header & Meta */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Passing Criteria: 70% (3.5 / 5 Scenarios)</span>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {answeredCount} of {totalQuestions} Answered
              </span>
            </div>

            {/* Question Box */}
            <div className="space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                Scenario Question {currentQuestionIndex + 1}
              </div>

              <h2 className="text-lg sm:text-xl font-black text-[#0B192C] leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'border-[#0B192C] bg-[#EFF5FA] ring-1 ring-[#0B192C] text-[#0B192C] font-semibold shadow-2xs'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected ? 'bg-[#0B192C] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="leading-relaxed flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Assessment Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              
              <button
                disabled={currentQuestionIndex === 0}
                onClick={handlePrevious}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                  currentQuestionIndex === 0 
                    ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-3">
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <Button
                    variant="primary"
                    size="md"
                    iconRight={ArrowRight}
                    onClick={handleNext}
                    id="assessment-next-btn"
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    disabled={answeredCount < totalQuestions}
                    iconRight={CheckCircle2}
                    onClick={handleSubmitAssessment}
                    id="submit-final-assessment-btn"
                  >
                    Submit Assessment
                  </Button>
                )}
              </div>

            </div>

          </div>

        ) : (

          /* ASSESSMENT COMPLETED / RESULT VIEW */
          <div className="space-y-6">
            
            <div className={`rounded-3xl p-8 sm:p-10 border text-center shadow-xs ${
              isPassed 
                ? 'bg-gradient-to-b from-emerald-50/60 to-white border-emerald-200' 
                : 'bg-gradient-to-b from-rose-50/60 to-white border-rose-200'
            }`}>
              
              {/* Status Badge & Icon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ${
                isPassed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {isPassed ? <CheckCircle2 className="w-9 h-9" /> : <RotateCcw className="w-9 h-9" />}
              </div>

              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-3 border ${
                isPassed 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                  : 'bg-rose-100 text-rose-800 border-rose-200'
              }`}>
                {isPassed ? 'ASSESSMENT PASSED' : 'ASSESSMENT INCOMPLETE'}
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0B192C] tracking-tight mb-2">
                Score: {calculatedScore}%
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                {isPassed 
                  ? `Congratulations ${profile.name}! You have successfully demonstrated the core competencies and standard procedures for ${role.title}. Your certificate is issued and ready.`
                  : `You scored ${calculatedScore}%. The passing threshold is 70%. You can review the SOP modules and retake the assessment immediately.`}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {isPassed ? (
                  <Button
                    variant="primary"
                    size="lg"
                    iconRight={ArrowRight}
                    onClick={() => navigate('certificate', { enrollmentId: enrollment.id, roleId: role.id })}
                    id="continue-to-certificate-btn"
                  >
                    View Official Certificate
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => navigate('course-modules', { roleId: role.id })}
                    >
                      Review Course Modules
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      icon={RotateCcw}
                      onClick={handleRetakeAssessment}
                      id="retake-assessment-btn"
                    >
                      Retake Assessment
                    </Button>
                  </div>
                )}
              </div>

            </div>

            {/* Answer Explanations Review */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-black text-[#0B192C] pb-2 border-b border-slate-100">
                Performance Breakdown & Explanations
              </h3>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isQCorrect = userAns === q.correctIndex;

                  return (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-2">
                      <div className="flex items-start justify-between gap-2 font-bold text-slate-900">
                        <span>{idx + 1}. {q.question}</span>
                        <span className={`shrink-0 font-bold px-2 py-0.5 rounded text-[10px] ${
                          isQCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isQCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      <div className="text-slate-600">
                        <strong className="text-slate-800">Your Answer:</strong> {q.options[userAns] || 'Not answered'}
                      </div>

                      {!isQCorrect && (
                        <div className="text-emerald-700">
                          <strong className="text-emerald-800">Correct Procedure:</strong> {q.options[q.correctIndex]}
                        </div>
                      )}

                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}
