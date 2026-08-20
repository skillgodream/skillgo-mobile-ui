import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Award, RotateCcw } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { JOB_ROLES } from '../lib/catalog';
import { useEnrollmentState, enrollmentStore } from '../lib/enrollmentStore';
import { useRouter } from '../lib/router';

export function ModuleQuizScreen() {
  const { currentRoute, navigate, goBack } = useRouter();
  const { activeEnrollment } = useEnrollmentState();
  const roleId = currentRoute.params?.roleId || activeEnrollment?.roleId || JOB_ROLES[0].id;
  const moduleId = currentRoute.params?.moduleId || 'mod-1';

  const role = JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];
  const moduleItem = role.modules.find(m => m.id === moduleId) || role.modules[0];
  const quiz = moduleItem.quiz;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalQuestions = quiz.questions.length;
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, optIdx]) => quiz.questions[Number(qIdx)]?.correctIndex === optIdx
  ).length;

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = scorePercentage >= quiz.passingScore;

  const handleSubmit = () => {
    setSubmitted(true);
    if (isPassed && activeEnrollment) {
      enrollmentStore.completeModule(activeEnrollment.id, moduleItem.id, scorePercentage);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <button onClick={goBack} className="inline-flex items-center gap-1 hover:text-slate-900 font-medium cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Lesson
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{quiz.title}</span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="orange">Passing Target: {quiz.passingScore}%</Badge>
          <span className="text-xs font-semibold text-slate-500">{totalQuestions} Questions</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">{quiz.title}</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Select the best answer for each operating scenario. Score ≥ 70% to unlock the next module.
        </p>
      </div>

      {/* Questions list */}
      <div className="space-y-6 mb-8">
        {quiz.questions.map((q, qIndex) => {
          const selected = selectedAnswers[qIndex];
          const isCorrect = selected === q.correctIndex;

          return (
            <div key={q.id} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-start gap-3 mb-4">
                <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {qIndex + 1}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{q.question}</h3>
              </div>

              <div className="space-y-2.5">
                {q.options.map((opt, optIndex) => {
                  const isOptionSelected = selected === optIndex;
                  let optStyle = 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-800';

                  if (submitted) {
                    if (optIndex === q.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                    } else if (isOptionSelected && !isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                    }
                  } else if (isOptionSelected) {
                    optStyle = 'border-orange-500 bg-orange-50/70 text-orange-950 font-semibold ring-1 ring-orange-500';
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={submitted}
                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }))}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${optStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200/60">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Result / Submit Action */}
      {!submitted ? (
        <div className="flex justify-end">
          <Button
            size="lg"
            variant="primary"
            disabled={Object.keys(selectedAnswers).length < totalQuestions}
            onClick={handleSubmit}
          >
            Submit Assessment
          </Button>
        </div>
      ) : (
        <div className={`p-6 rounded-3xl border text-center space-y-4 ${
          isPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}>
          <div className="text-3xl font-black">{scorePercentage}%</div>
          <h3 className="text-lg font-bold">
            {isPassed ? 'Passed! Module Completed' : 'Assessment Not Passed'}
          </h3>
          <p className="text-xs max-w-md mx-auto">
            {isPassed 
              ? 'Great job! Your progress has been updated and the next module is unlocked.' 
              : `You scored ${scorePercentage}%. Passing criteria is ${quiz.passingScore}%. Please review the lesson and retry.`}
          </p>

          <div className="flex justify-center gap-3 pt-2">
            {!isPassed ? (
              <Button size="md" variant="secondary" icon={RotateCcw} onClick={handleRetry}>
                Retry Quiz
              </Button>
            ) : (
              <Button 
                size="md" 
                variant="primary" 
                iconRight={ArrowRight} 
                onClick={() => navigate('course-modules', { roleId: role.id })}
              >
                Continue Course
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
