import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Play, 
  Barcode, 
  Boxes, 
  Truck, 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  RotateCcw,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Layers,
  Smartphone
} from 'lucide-react';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { enrollmentStore } from '../lib/enrollmentStore';
import { useRouter } from '../lib/router';
import { JobRole, SkillCategory, Enrollment } from '../lib/types';

export interface PracticalActivity {
  id: string;
  roleId: string;
  activityNumber: number;
  title: string;
  category: string;
  estimatedMinutes: number;
  description: string;
  iconType: 'barcode' | 'boxes' | 'truck' | 'creditCard' | 'zap' | 'shield';
  terminalType: string;
  targetSku: string;
  simulationSteps: string[];
}

const ROLE_PRACTICAL_ACTIVITIES: Record<string, PracticalActivity[]> = {
  'logistics-supply-chain': [
    {
      id: 'log-prac-1',
      roleId: 'warehouse-associate',
      activityNumber: 1,
      title: 'Inbound Dock & RF Handheld Scanning',
      category: 'Inbound Receiving',
      estimatedMinutes: 10,
      description: 'Scan master airway bills and log incoming pallets into the warehouse receiving ledger.',
      iconType: 'barcode',
      terminalType: 'RF TERMINAL v4.2',
      targetSku: 'AWB-DL-882910 / PALLET-01',
      simulationSteps: [
        'Power on RF scanner and calibrate barcode sensor.',
        'Scan incoming shipment QR and verify PO match.',
        'Confirm piece-count and log seal integrity.'
      ]
    },
    {
      id: 'log-prac-2',
      roleId: 'warehouse-associate',
      activityNumber: 2,
      title: 'Location Bin Allocation & Putaway',
      category: 'Putaway',
      estimatedMinutes: 12,
      description: 'Route incoming stock to designated racking locations and lock bin coordinates.',
      iconType: 'boxes',
      terminalType: 'PUTAWAY ENGINE v2.8',
      targetSku: 'LOC-BIN-04-B / SKU-99401',
      simulationSteps: [
        'Read directed route on RF screen (Aisle 04, Bay B).',
        'Scan shelf location barcode to verify coordinates.',
        'Place stock and confirm balance update.'
      ]
    },
    {
      id: 'log-prac-3',
      roleId: 'warehouse-associate',
      activityNumber: 3,
      title: 'Batch Wave Picking & Packing Audit',
      category: 'Picking',
      estimatedMinutes: 10,
      description: 'Pick multi-line orders, verify tamper seals, and pack standard shipping cartons.',
      iconType: 'boxes',
      terminalType: 'PICK & PACK v3.1',
      targetSku: 'TOTE-TK-5502 / ORDER-09',
      simulationSteps: [
        'Retrieve active pick wave on handheld terminal.',
        'Audit items, expiration dates, and barcode tags.',
        'Place in shipping carton and apply tamper seal.'
      ]
    },
    {
      id: 'log-prac-4',
      roleId: 'warehouse-associate',
      activityNumber: 4,
      title: 'Pallet Wrap & Outbound Verification',
      category: 'Outbound Dispatch',
      estimatedMinutes: 10,
      description: 'Secure pallet stretch wrap, verify shipping labels, and sign digital dispatch pass.',
      iconType: 'truck',
      terminalType: 'DISPATCH GATE v1.9',
      targetSku: 'MANIFEST-TRK-7740 / BAY-03',
      simulationSteps: [
        'Apply 5-layer stretch wrap around pallet load.',
        'Affix shipping labels and hazardous placards.',
        'Inspect carrier trailer and sign digital gate pass.'
      ]
    }
  ],
  'retail-operations': [
    {
      id: 'ret-prac-1',
      roleId: 'retail-store-associate',
      activityNumber: 1,
      title: 'POS Billing & Payment Processing',
      category: 'Billing',
      estimatedMinutes: 10,
      description: 'Scan item barcodes, apply member discounts, and process split cash/UPI tenders.',
      iconType: 'creditCard',
      terminalType: 'POS REGISTER v8.4',
      targetSku: 'SKU-FMCG-2281 / SPLIT-PAY',
      simulationSteps: [
        'Scan item barcodes and confirm quantities in cart.',
        'Apply loyalty promo code and verify tax breakout.',
        'Process split tender payment (Cash + UPI) and print receipt.'
      ]
    },
    {
      id: 'ret-prac-2',
      roleId: 'retail-store-associate',
      activityNumber: 2,
      title: 'Planogram & Shelf Display Audit',
      category: 'Merchandising',
      estimatedMinutes: 12,
      description: 'Audit shelf facings, maintain eye-level display compliance, and update price tags.',
      iconType: 'boxes',
      terminalType: 'PLANOGRAM AUDIT v3.0',
      targetSku: 'BAY-AISLE-02 / FACINGS-4X',
      simulationSteps: [
        'Review planogram diagram for Aisle 2 eye-level tier.',
        'Verify front facings alignment and price labels.',
        'Log compliance photo and trigger reorder alert.'
      ]
    },
    {
      id: 'ret-prac-3',
      roleId: 'retail-store-associate',
      activityNumber: 3,
      title: 'Restocking & FIFO Stock Rotation',
      category: 'Restock',
      estimatedMinutes: 10,
      description: 'Stage stock from storage, rotate earlier inventory forward, and clear customer aisles.',
      iconType: 'boxes',
      terminalType: 'RESTOCK ROLLS v2.5',
      targetSku: 'CAGE-RESTOCK-08 / FIFO-EXP',
      simulationSteps: [
        'Pull restock cart containing beverage SKUs.',
        'Rotate rear shelf stock forward to enforce FIFO.',
        'Clear empty cartons into recycling bin.'
      ]
    },
    {
      id: 'ret-prac-4',
      roleId: 'retail-store-associate',
      activityNumber: 4,
      title: 'Customer Return & Cash Reconciliation',
      category: 'Store Desk',
      estimatedMinutes: 10,
      description: 'Inspect returned items, issue credit vouchers, and reconcile shift cash drawer.',
      iconType: 'shield',
      terminalType: 'REGISTER CLOSURE v6.0',
      targetSku: 'RMA-TAG-9912 / CASH-TILL-Z',
      simulationSteps: [
        'Inspect item condition, tags, and purchase receipt.',
        'Issue store credit voucher or refund approval.',
        'Perform cash count and generate end-of-day Z-Report.'
      ]
    }
  ],
  'quick-commerce': [
    {
      id: 'qc-prac-1',
      roleId: 'dark-store-associate',
      activityNumber: 1,
      title: 'Sub-90s Multi-Tote Wave Picking',
      category: 'Fast Picking',
      estimatedMinutes: 10,
      description: 'Follow optimal route across micro-aisles to pick customer baskets under 90 seconds.',
      iconType: 'zap',
      terminalType: 'WAVE PICKER v5.0',
      targetSku: 'ZONE-A / BASKET-3X',
      simulationSteps: [
        'Accept automated priority pick order on picker device.',
        'Follow shortest path route across micro-aisles 1-4.',
        'Scan barcodes directly into customer partition bins.'
      ]
    },
    {
      id: 'qc-prac-2',
      roleId: 'dark-store-associate',
      activityNumber: 2,
      title: 'Produce Quality & Cold Chain Check',
      category: 'Quality QA',
      estimatedMinutes: 10,
      description: 'Check fresh produce firmness and verify chiller room temperatures.',
      iconType: 'shield',
      terminalType: 'COLD CHAIN v2.2',
      targetSku: 'CHILLER-01 / TEMP-4C',
      simulationSteps: [
        'Verify dairy chiller temperature is between 2°C and 4°C.',
        'Grade fruit/vegetable crates for firmness and freshness.',
        'Attach certified freshness tag on verified packs.'
      ]
    },
    {
      id: 'qc-prac-3',
      roleId: 'dark-store-associate',
      activityNumber: 3,
      title: 'Tamper-Proof Polybag Packing',
      category: 'Packing',
      estimatedMinutes: 10,
      description: 'Bag orders safely, seal security tags, and confirm manifest scale weight.',
      iconType: 'boxes',
      terminalType: 'PACK BENCH v3.3',
      targetSku: 'POLY-8830 / SCALE-1420g',
      simulationSteps: [
        'Separate ambient grocery items from chilled goods.',
        'Seal tamper-proof bag and generate delivery QR label.',
        'Place on automated scale to verify weight tolerance.'
      ]
    },
    {
      id: 'qc-prac-4',
      roleId: 'dark-store-associate',
      activityNumber: 4,
      title: 'Rider Handover & OTP Dispatch',
      category: 'Dispatch',
      estimatedMinutes: 10,
      description: 'Stage packed bags on pickup racks and verify rider mobile OTP.',
      iconType: 'truck',
      terminalType: 'RIDER QUEUE v7.1',
      targetSku: 'SLOT-12 / RIDER-OTP-9921',
      simulationSteps: [
        'Place packed order into designated rack slot.',
        'Verify delivery rider identity and scan rider QR.',
        'Confirm OTP validation to initiate GPS delivery.'
      ]
    }
  ],
  'hospitality': [
    {
      id: 'hosp-prac-1',
      roleId: 'fb-service-associate',
      activityNumber: 1,
      title: 'Digital KOT Order Entry',
      category: 'Dining Service',
      estimatedMinutes: 10,
      description: 'Take guest orders with dietary notes and route tickets to kitchen display screens.',
      iconType: 'creditCard',
      terminalType: 'KDS TERMINAL v4.1',
      targetSku: 'TABLE-08 / KOT-HOT',
      simulationSteps: [
        'Select Table 08 on dining floor map.',
        'Enter guest food selections and dietary preferences.',
        'Transmit digital KOT directly to hot kitchen and bar.'
      ]
    },
    {
      id: 'hosp-prac-2',
      roleId: 'fb-service-associate',
      activityNumber: 2,
      title: 'Food Safety & Hygiene Logging',
      category: 'Hygiene QA',
      estimatedMinutes: 10,
      description: 'Check holding food temperatures and log sanitization checklists.',
      iconType: 'shield',
      terminalType: 'HACCP MONITOR v2.0',
      targetSku: 'BUFFET-HOT / TEMP-65C',
      simulationSteps: [
        'Check probe thermometer on hot buffet display (≥ 65°C).',
        'Audit kitchen allergen color-coded cutting boards.',
        'Record hourly handwashing and surface sanitization.'
      ]
    },
    {
      id: 'hosp-prac-3',
      roleId: 'fb-service-associate',
      activityNumber: 3,
      title: 'Table Setting & Plate Service',
      category: 'Service',
      estimatedMinutes: 10,
      description: 'Arrange formal cutlery and glassware according to standard operating procedures.',
      iconType: 'boxes',
      terminalType: 'SERVICE GUIDE v3.5',
      targetSku: 'COVERS-4PAX / SET-A',
      simulationSteps: [
        'Align dinner plate 1 inch from table edge with polished silverware.',
        'Place glassware in top-right diagonal arrangement.',
        'Serve finished culinary dishes smoothly from the guest’s right.'
      ]
    },
    {
      id: 'hosp-prac-4',
      roleId: 'fb-service-associate',
      activityNumber: 4,
      title: 'Guest Billing & Settlement',
      category: 'Billing',
      estimatedMinutes: 10,
      description: 'Present final bill, process card transactions, and record guest feedback.',
      iconType: 'creditCard',
      terminalType: 'BILLING DESK v5.2',
      targetSku: 'BILL-INV-4419 / SETTLE',
      simulationSteps: [
        'Review final bill with table guests and apply discount.',
        'Process credit card transaction and hand over copy.',
        'Record guest satisfaction feedback and farewell.'
      ]
    }
  ],
  'facility-management': [
    {
      id: 'fm-prac-1',
      roleId: 'facility-operations-officer',
      activityNumber: 1,
      title: 'BMS Central HVAC Controls',
      category: 'HVAC',
      estimatedMinutes: 10,
      description: 'Monitor building automation dashboard and adjust static air pressures.',
      iconType: 'zap',
      terminalType: 'BMS COMMAND v9.0',
      targetSku: 'AHU-03 / STATIC-1.2',
      simulationSteps: [
        'Acknowledge BMS alarm on Air Handling Unit AHU-03.',
        'Adjust setpoint temperature to 23.5°C.',
        'Verify return air CO2 levels remain under 800 ppm.'
      ]
    },
    {
      id: 'fm-prac-2',
      roleId: 'facility-operations-officer',
      activityNumber: 2,
      title: 'UPS & Generator Daily Round',
      category: 'Utilities',
      estimatedMinutes: 10,
      description: 'Inspect backup battery banks and verify diesel fuel levels.',
      iconType: 'zap',
      terminalType: 'UTILITY LOGGER v2.7',
      targetSku: 'UPS-BANK-B / DIESEL-85%',
      simulationSteps: [
        'Measure DC bus voltage on UPS battery bank B (415V standard).',
        'Check Diesel Generator fuel day-tank level (> 80%).',
        'Sign electronic utility log and upload maintenance record.'
      ]
    },
    {
      id: 'fm-prac-3',
      roleId: 'facility-operations-officer',
      activityNumber: 3,
      title: 'Fire & Safety Pressure Test',
      category: 'Safety',
      estimatedMinutes: 10,
      description: 'Verify hydrant main pressure and test smoke sensor alarms.',
      iconType: 'shield',
      terminalType: 'FLS INSPECTOR v4.0',
      targetSku: 'HYDRANT-01 / PRESS-7KG',
      simulationSteps: [
        'Check jockey pump pressure gauge on main riser (7 kg/cm²).',
        'Trigger test canister on optical smoke sensor and reset.',
        'Verify emergency exit pathways are clear of obstructions.'
      ]
    },
    {
      id: 'fm-prac-4',
      roleId: 'facility-operations-officer',
      activityNumber: 4,
      title: 'Facility Work Order Resolution',
      category: 'Operations',
      estimatedMinutes: 10,
      description: 'Audit janitorial scorecards, check chemical dilutions, and close maintenance tickets.',
      iconType: 'boxes',
      terminalType: 'FM DESK v3.8',
      targetSku: 'SLA-TOWER-1 / TICKET-88',
      simulationSteps: [
        'Perform surface swab test in high-traffic zones.',
        'Verify janitorial chemical dispenser dilution ratios.',
        'Sign off vendor SLA scorecard and close maintenance ticket.'
      ]
    }
  ]
};

function getActivitiesForRole(roleId: string, skillId: string): PracticalActivity[] {
  if (ROLE_PRACTICAL_ACTIVITIES[skillId]) {
    return ROLE_PRACTICAL_ACTIVITIES[skillId];
  }
  return ROLE_PRACTICAL_ACTIVITIES['logistics-supply-chain'];
}

export function PracticalTrainingScreen() {
  const { currentRoute, navigate } = useRouter();
  const allEnrollments: Enrollment[] = enrollmentStore.getEnrollments();
  
  const enrolledRoles = allEnrollments.map(enr => {
    const role = JOB_ROLES.find(r => r.id === enr.roleId) || JOB_ROLES[0];
    const skill = SKILL_CATEGORIES.find(s => s.id === (role.skillId || enr.skillId)) || SKILL_CATEGORIES[0];
    return { enrollment: enr, role, skill };
  });

  const initialRoleId = currentRoute.params?.roleId || (enrolledRoles[0]?.role.id || JOB_ROLES[0].id);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoleId);

  // Active track information
  const activeTrack = enrolledRoles.find(t => t.role.id === selectedRoleId) || enrolledRoles[0] || {
    enrollment: {
      id: `enr-${Date.now()}`,
      roleId: JOB_ROLES[0].id,
      skillId: SKILL_CATEGORIES[0].id,
      plan: 'pro',
      enrollmentDate: new Date().toISOString().split('T')[0],
      completedModules: [],
      currentModuleId: 'mod-1',
      quizScores: {},
      isCompleted: false
    } as Enrollment,
    role: JOB_ROLES[0],
    skill: SKILL_CATEGORIES[0]
  };

  const role = activeTrack.role;
  const skill = activeTrack.skill;
  const enrollment = activeTrack.enrollment;

  const practicalActivities = getActivitiesForRole(role.id, skill.id);
  const completedActivities = enrollment.completedPracticalActivities || [];

  // If activityId is in router params or selected by user, we show the ACTUAL SIMULATION screen
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(() => {
    return currentRoute.params?.activityId || null;
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const activeActivity = practicalActivities.find(a => a.id === activeSimulationId) || practicalActivities[0];
  const activeActivityIndex = practicalActivities.findIndex(a => a.id === activeActivity?.id);
  const isCurrentCompleted = activeSimulationId ? completedActivities.includes(activeSimulationId) : false;

  const handleStepComplete = () => {
    if (!activeActivity) return;
    if (currentStepIndex < activeActivity.simulationSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      enrollmentStore.completePracticalActivity(enrollment.id, activeActivity.id);
    }
  };

  const handleNextSimulation = () => {
    if (activeActivityIndex < practicalActivities.length - 1) {
      const nextAct = practicalActivities[activeActivityIndex + 1];
      setActiveSimulationId(nextAct.id);
      setCurrentStepIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Return to cards overview
      setActiveSimulationId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetStep = () => {
    setCurrentStepIndex(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'barcode': return <Barcode className="w-5 h-5" />;
      case 'boxes': return <Boxes className="w-5 h-5" />;
      case 'truck': return <Truck className="w-5 h-5" />;
      case 'creditCard': return <CreditCard className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      default: return <ShieldCheck className="w-5 h-5" />;
    }
  };

  // -------------------------------------------------------------
  // VIEW 2: ACTUAL SIMULATION SCREEN (WHEN A CARD IS CLICKED)
  // -------------------------------------------------------------
  if (activeSimulationId && activeActivity) {
    return (
      <div className="w-full bg-[#0B192C]/[0.02] min-h-screen pb-20 font-sans text-slate-900">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 sticky top-16 sm:top-18 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            
            <button 
              onClick={() => {
                setActiveSimulationId(null);
                setCurrentStepIndex(0);
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Simulation Lab</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                {role.title} •
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Simulation 0{activeActivity.activityNumber}
              </span>
            </div>

          </div>
        </header>

        {/* Actual Simulator Container */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
          
          {/* Title & Info Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                {activeActivity.category}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>~{activeActivity.estimatedMinutes} Mins</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
              {activeActivity.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeActivity.description}
            </p>
          </div>

          {/* Interactive Simulation Sandbox Console */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 text-white p-6 sm:p-7 shadow-lg space-y-6">
            
            {/* Console Status Bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5 text-xs font-mono text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">{activeActivity.terminalType}</span>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                STEP {currentStepIndex + 1} OF {activeActivity.simulationSteps.length}
              </div>
            </div>

            {/* Main Interactive Display */}
            <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4">
              
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Operating Standard Protocol (SOP):
              </div>

              <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {activeActivity.simulationSteps[currentStepIndex]}
              </div>

              {/* Target Indicator */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="text-slate-400">TARGET SKU / REGISTRY</div>
                <div className="text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800/50">
                  {activeActivity.targetSku}
                </div>
              </div>

            </div>

            {/* Step Progress Indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Simulation Progress</span>
                <span>
                  {Math.round(((currentStepIndex + 1) / activeActivity.simulationSteps.length) * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                {activeActivity.simulationSteps.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      sIdx < currentStepIndex || (sIdx === currentStepIndex && isCurrentCompleted)
                        ? 'bg-emerald-400'
                        : sIdx === currentStepIndex
                        ? 'bg-blue-500'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Interactive Execution Controls */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <button
                onClick={handleResetStep}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Simulation</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                {currentStepIndex === activeActivity.simulationSteps.length - 1 && isCurrentCompleted ? (
                  <button
                    onClick={handleNextSimulation}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>{activeActivityIndex < practicalActivities.length - 1 ? 'Next Simulation' : 'Back to Simulation Lab'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleStepComplete}
                    id="execute-sim-step-btn"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>
                      {currentStepIndex === activeActivity.simulationSteps.length - 1
                        ? 'Complete & Verify Simulation'
                        : 'Execute Step →'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Success Banner when Completed */}
          {isCurrentCompleted && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Simulation Successfully Completed & Logged
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Your workplace activity has been recorded in your learning profile.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveSimulationId(null);
                  setCurrentStepIndex(0);
                }}
                className="shrink-0 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                All Simulations
              </button>
            </div>
          )}

        </main>

      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: SIMULATION LAB ALL CARDS (CLICKABLE LIST OF SIMULATIONS)
  // -------------------------------------------------------------
  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pb-20 font-sans text-slate-900">
      
      {/* 1. CLEAN MINIMAL HEADER */}
      <header className="bg-white border-b border-slate-200/80 sticky top-16 sm:top-18 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (currentRoute.params?.from === 'my-learning') {
                  navigate('my-learning');
                } else {
                  navigate('course-complete', { roleId: role.id });
                }
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Return"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-bold text-[#0B192C]">
                Simulation Lab
              </h1>
              <span className="text-xs text-slate-400">
                {role.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {completedActivities.length} of {practicalActivities.length} Completed
            </span>
          </div>

        </div>
      </header>

      {/* 2. MAIN SIMULATION CARDS CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Track Switcher (If multiple enrollments exist) */}
        {enrolledRoles.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {enrolledRoles.map((track) => {
              const isSelected = track.role.id === selectedRoleId;
              const acts = getActivitiesForRole(track.role.id, track.skill.id);
              const doneCount = track.enrollment.completedPracticalActivities?.length || 0;

              return (
                <button
                  key={track.role.id}
                  onClick={() => {
                    setSelectedRoleId(track.role.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
                    isSelected 
                      ? 'bg-[#0B192C] text-white shadow-xs' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{track.role.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {doneCount}/{acts.length}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Section Header */}
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Your Enrolled Simulations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Click any simulation card below to launch the interactive hands-on simulator.
          </p>
        </div>

        {/* CLEAN CLICKABLE SIMULATION CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {practicalActivities.map((act, idx) => {
            const isCompleted = completedActivities.includes(act.id);

            return (
              <div
                key={act.id}
                id={`sim-card-${act.id}`}
                onClick={() => {
                  setActiveSimulationId(act.id);
                  setCurrentStepIndex(0);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between cursor-pointer group hover:shadow-md hover:border-slate-400 ${
                  isCompleted
                    ? 'border-emerald-200/90 bg-emerald-50/20'
                    : 'border-slate-200/90'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Card Top Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-700 group-hover:bg-[#0B192C] group-hover:text-white transition-colors'
                      }`}>
                        {getIcon(act.iconType)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Simulation 0{act.activityNumber} • {act.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {act.title}
                        </h3>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {isCompleted ? (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Done</span>
                      </span>
                    ) : (
                      <span className="shrink-0 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        Ready
                      </span>
                    )}
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>

                  {/* Meta Pills */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3" />
                      <span>~{act.estimatedMinutes}m</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                      {act.simulationSteps.length} Steps
                    </span>
                  </div>

                </div>

                {/* Footer Action Button */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[160px]">
                    {act.terminalType}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSimulationId(act.id);
                      setCurrentStepIndex(0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs ${
                      isCompleted
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-[#0B192C] hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{isCompleted ? 'Replay Simulation' : 'Launch Simulation'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </main>

    </div>
  );
}
