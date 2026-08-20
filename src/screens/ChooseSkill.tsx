import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Wallet,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SKILL_CATEGORIES, JOB_ROLES } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { JobRole } from '../lib/types';

// Role-specific image mapping for horizontal cards
const ROLE_IMAGES: Record<string, string> = {
  // Logistics
  'warehouse-associate': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
  'qc-inbound-inspector': 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80',
  'inventory-staging-specialist': 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=80',
  'dispatch-fleet-coordinator': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',

  // Retail
  'retail-store-associate': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80',
  'cashier-pos-specialist': 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80',
  'visual-merchandiser': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
  'store-inventory-supervisor': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',

  // Quick Commerce
  'dark-store-picker-packer': 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
  'hub-dispatch-rider-coordinator': 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80',
  'inbound-fresh-quality-grader': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80',
  'dark-store-shift-lead': 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',

  // Hospitality
  'fb-service-specialist': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
  'guest-relations-associate': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
  'food-safety-hygiene-officer': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
  'banquet-event-coordinator': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',

  // Facility Management
  'facility-maintenance-technician': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'bms-operations-executive': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
  'fls-fire-safety-officer': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
  'utility-hvac-lead': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
};

// High-resolution skill category banners
const SKILL_BANNERS: Record<string, string> = {
  'logistics-supply-chain': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
  'retail-operations': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80',
  'quick-commerce': 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80',
  'hospitality': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
  'facility-management': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
};

export function ChooseSkillScreen() {
  const { currentRoute, navigate } = useRouter();
  
  // Resolve selected skill dynamically from route parameters (defaulting to first skill if none specified)
  const routeSkillId = currentRoute.params?.selectedSkillId || currentRoute.params?.skillId || SKILL_CATEGORIES[0].id;
  const [activeSkillId, setActiveSkillId] = useState<string>(routeSkillId);

  useEffect(() => {
    const targetId = currentRoute.params?.selectedSkillId || currentRoute.params?.skillId;
    if (targetId && targetId !== activeSkillId) {
      setActiveSkillId(targetId);
    }
  }, [currentRoute.params?.selectedSkillId, currentRoute.params?.skillId]);

  const currentSkill = SKILL_CATEGORIES.find(s => s.id === activeSkillId) || SKILL_CATEGORIES[0];
  const associatedRoles = JOB_ROLES.filter(r => r.skillId === currentSkill.id).slice(0, 4);
  const bannerImage = SKILL_BANNERS[currentSkill.id] || SKILL_BANNERS['logistics-supply-chain'];

  const handleSelectRole = (role: JobRole) => {
    navigate('role-detail', { 
      roleId: role.id, 
      skillId: currentSkill.id 
    });
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16 font-sans">
      
      {/* 1. TOP BANNER WITH RELATED INDUSTRY / SKILL PICTURE */}
      <div className="relative w-full h-44 sm:h-64 lg:h-80 overflow-hidden bg-slate-900 shadow-md">
        <img
          src={bannerImage}
          alt={currentSkill.name}
          className="w-full h-full object-cover object-center brightness-60 scale-105 transition-transform duration-700 hover:scale-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        {/* Banner Content Overlay */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-5 sm:pb-8 lg:pb-10">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <span 
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full" 
              style={{ backgroundColor: currentSkill.accentColor || '#2563eb' }}
            />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-300">
              Industry Track
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
            {currentSkill.name}
          </h1>
        </div>
      </div>

      {/* 2. FOUR HORIZONTAL CARDS */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 -mt-4 sm:-mt-8 relative z-10">
        
        <div className="space-y-3 sm:space-y-4" id="role-horizontal-cards-container">
          {associatedRoles.map((roleItem: JobRole, index: number) => {
            const roleImage = ROLE_IMAGES[roleItem.id] || bannerImage;
            
            return (
              <div 
                key={roleItem.id}
                id={`role-horizontal-card-${roleItem.id}`}
                onClick={() => handleSelectRole(roleItem)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-500 hover:-translate-y-0.5 sm:hover:-translate-y-1 p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer transition-all duration-200 group active:scale-[0.99]"
              >
                {/* Left Side: Thumbnail + Role Title & Concise Description */}
                <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100 shadow-2xs">
                    <img 
                      src={roleImage} 
                      alt={roleItem.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">
                        0{index + 1}
                      </span>
                      <h3 className="text-sm sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {roleItem.title}
                      </h3>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-slate-500 font-medium line-clamp-1">
                      {roleItem.shortDescription}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 pt-0.5">
                      <div className="inline-flex items-center gap-1 text-slate-600 text-[11px] sm:text-xs">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span>{roleItem.moduleCount} Modules</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Salary Range + Click Arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <div className="flex items-center sm:justify-end gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      <Wallet className="w-3 h-3 text-emerald-600" />
                      <span>Salary Range</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                      {roleItem.startingSalary}
                    </div>
                  </div>

                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-50 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0 border border-slate-200 group-hover:border-blue-600">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. GO BACK OPTION AT THE BOTTOM */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            onClick={() => navigate('home')}
            id="role-selection-go-back-btn"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Go Back</span>
          </button>
        </div>

      </div>

    </div>
  );
}
