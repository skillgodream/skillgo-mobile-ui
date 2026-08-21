import React from 'react';
import { Globe, Landmark, Castle, Building2, Check, X } from 'lucide-react';

export interface LanguageOption {
  code: string;
  nameEnglish: string;
  nameVernacular: string;
  landmark: string;
  icon: any;
  colorBg: string;
  borderColor: string;
  textColor: string;
  tagline: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    nameEnglish: 'English',
    nameVernacular: 'English',
    landmark: 'Global / Big Ben',
    icon: Globe,
    colorBg: 'bg-blue-50 hover:bg-blue-100/80',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    tagline: 'Global Standard'
  },
  {
    code: 'hi',
    nameEnglish: 'Hindi',
    nameVernacular: 'हिन्दी',
    landmark: 'India Gate / Taj Mahal',
    icon: Landmark,
    colorBg: 'bg-amber-50 hover:bg-amber-100/80',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-900',
    tagline: 'राष्ट्रीय भाषा'
  },
  {
    code: 'ka',
    nameEnglish: 'Kannada',
    nameVernacular: 'ಕನ್ನಡ',
    landmark: 'Mysore Palace',
    icon: Castle,
    colorBg: 'bg-emerald-50 hover:bg-emerald-100/80',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-900',
    tagline: 'ಕರ್ನಾಟಕ'
  },
  {
    code: 'te',
    nameEnglish: 'Telugu',
    nameVernacular: 'తెలుగు',
    landmark: 'Charminar',
    icon: Building2,
    colorBg: 'bg-purple-50 hover:bg-purple-100/80',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
    tagline: 'తెలుగు రాష్ట్రాలు'
  }
];

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
}

export function LanguageModal({ isOpen, onClose, currentLanguage, onSelectLanguage }: LanguageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" id="language-modal-backdrop">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        id="language-modal-container"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <Globe className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Select Preferred Language</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Choose your language for operational training, SOP guides, and interface.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            id="language-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Language Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LANGUAGES.map((lang) => {
              const IconComponent = lang.icon;
              const isSelected = currentLanguage === lang.code;

              return (
                <div
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    onClose();
                  }}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-md ring-4 ring-blue-500/10'
                      : `${lang.borderColor} ${lang.colorBg} hover:shadow-lg hover:-translate-y-1`
                  }`}
                  id={`lang-card-${lang.code}`}
                >
                  {/* Top row: Icon & Check */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200/80'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {isSelected ? (
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/80 text-slate-600 border border-slate-200">
                        {lang.tagline}
                      </span>
                    )}
                  </div>

                  {/* Language Names */}
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <h4 className="text-lg font-black text-slate-900">{lang.nameVernacular}</h4>
                      <span className="text-xs font-semibold text-slate-500">{lang.nameEnglish}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <span>🏛️ Landmark:</span> <span className="font-semibold text-slate-700">{lang.landmark}</span>
                    </p>
                  </div>

                  {/* Bottom selection indicator */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                    <span className={isSelected ? 'text-blue-700' : 'text-slate-600'}>
                      {isSelected ? 'Active Language' : 'Click to Switch'}
                    </span>
                    <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>You can switch languages anytime from the top navigation bar.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
