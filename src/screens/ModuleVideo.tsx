import React, { useState } from 'react';
import { ArrowLeft, Play, CheckCircle2, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { JOB_ROLES } from '../lib/catalog';
import { useRouter } from '../lib/router';

export function ModuleVideoScreen() {
  const { currentRoute, navigate, goBack } = useRouter();
  const roleId = currentRoute.params?.roleId || JOB_ROLES[0].id;
  const moduleId = currentRoute.params?.moduleId || 'mod-1';

  const role = JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];
  const moduleItem = role.modules.find(m => m.id === moduleId) || role.modules[0];
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <button onClick={goBack} className="inline-flex items-center gap-1 hover:text-slate-900 font-medium cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Modules
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Module {moduleItem.moduleNumber}</span>
      </div>

      {/* Video Frame */}
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden aspect-video flex items-center justify-center mb-6 shadow-lg border border-slate-800">
        {!isPlaying ? (
          <div className="text-center p-6 space-y-3 z-10">
            <button
              onClick={() => setIsPlaying(true)}
              className="w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center mx-auto shadow-xl transition-all cursor-pointer"
            >
              <Play className="w-8 h-8 ml-1 fill-white" />
            </button>
            <div className="text-white font-bold text-base sm:text-lg">{moduleItem.title}</div>
            <div className="text-slate-400 text-xs flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Duration: {moduleItem.videoDuration}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-950 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <h4 className="font-bold text-lg">Masterclass Lesson Simulated Player</h4>
            <p className="text-xs text-slate-400 max-w-md">
              You have reviewed the key operating procedures for {moduleItem.title}. Ready for the assessment?
            </p>
            <Button
              size="md"
              variant="primary"
              iconRight={ArrowRight}
              onClick={() => navigate('module-quiz', { roleId: role.id, moduleId: moduleItem.id })}
            >
              Proceed to Assessment Quiz
            </Button>
          </div>
        )}
      </div>

      {/* Summary and Takeaways */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="orange">Module {moduleItem.moduleNumber}</Badge>
          <Badge variant="default">{moduleItem.durationMinutes} Mins Total</Badge>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-3">{moduleItem.title}</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">{moduleItem.summary}</p>

        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Key Operational Takeaways</h4>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
          {moduleItem.keyTakeaways.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <Button
            size="md"
            variant="primary"
            iconRight={ArrowRight}
            onClick={() => navigate('module-quiz', { roleId: role.id, moduleId: moduleItem.id })}
          >
            Take Module Assessment Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
