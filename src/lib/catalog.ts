import { SkillCategory, JobRole, LibraryItem } from './types';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'logistics-supply-chain',
    name: 'Logistics & Supply Chain',
    heroHeadline: 'Build the skills that power modern fulfilment.',
    heroSubtext: 'Learn the operational skills used across warehouses, fulfilment centres and supply-chain environments.',
    tagline: 'Master modern warehousing, dispatch operations, and end-to-end material flow.',
    description: 'Learn certified industry SOPs for automated sorting hubs, high-density fulfillment centers, and freight logistics.',
    iconName: 'Boxes',
    accentColor: '#FF7A00',
    badge: 'High Hiring Demand',
    rolesCount: 3,
    durationAvg: '2 - 3 Weeks',
    modulesRange: '4 - 5 Modules',
    practicalAvailable: true,
    certificateIncluded: true,
    popularRole: 'Warehouse Associate & QC',
    bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    keySkills: ['Inbound Receiving', 'Inventory Audits', 'RF Handheld Scanning', 'Cold Chain Safety'],
    whatYoullLearn: [
      {
        title: 'Inbound & Receiving',
        description: 'Dock inspections, physical seal verification, PO manifest reconciliation, and damaged carton quarantine.',
        iconName: 'PackageCheck'
      },
      {
        title: 'Storage & Putaway',
        description: '2-step RF gun verification, automated location bin mapping, and high-density racking navigation.',
        iconName: 'Boxes'
      },
      {
        title: 'Inventory & Cycle Counting',
        description: 'Physical audit methodology, discrepancy reconciliation, and WMS digital stock adjustments.',
        iconName: 'ClipboardCheck'
      },
      {
        title: 'Picking & Fulfilment',
        description: 'Batch picking algorithms, pick-to-light routines, tote staging, and packing quality checks.',
        iconName: 'Layers'
      },
      {
        title: 'Dispatch & Handover',
        description: 'Outbound vehicle manifests, pallet wrap standards, delivery partner handover, and POD logging.',
        iconName: 'Truck'
      },
      {
        title: 'Safety & Compliance',
        description: 'Ergonomic manual lifting, PPE standards, hazardous material containment, and fire safety.',
        iconName: 'ShieldAlert'
      }
    ]
  },
  {
    id: 'retail-operations',
    name: 'Retail Operations',
    heroHeadline: 'Master modern store operations and retail excellence.',
    heroSubtext: 'Learn point-of-sale systems, visual merchandising, stock replenishment, and omnichannel store management.',
    tagline: 'Lead store inventory, omnichannel customer fulfillment, and merchandising excellence.',
    description: 'Practical training for hypermarket floors, point-of-sale systems, stock replenishment, and visual merchandising.',
    iconName: 'Store',
    accentColor: '#3B82F6',
    badge: 'Fast-Track Career',
    rolesCount: 3,
    durationAvg: '2 Weeks',
    modulesRange: '4 Modules',
    practicalAvailable: true,
    certificateIncluded: true,
    popularRole: 'Retail Store Supervisor',
    bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    keySkills: ['POS Systems', 'Planogram Compliance', 'Customer Escalations', 'Cash Reconciliation'],
    whatYoullLearn: [
      {
        title: 'POS Systems & Billing',
        description: 'Barcode scanning, discount applications, split tenders, UPI/Card EDC terminals, and return receipts.',
        iconName: 'CreditCard'
      },
      {
        title: 'Visual Merchandising',
        description: 'Planogram execution, eye-level shelf compliance, promotional endcaps, and pricing tag audits.',
        iconName: 'LayoutGrid'
      },
      {
        title: 'Stock Replenishment',
        description: 'Backroom-to-floor staging, stock rotation, fast-moving aisle restocking, and shrinkage prevention.',
        iconName: 'Boxes'
      },
      {
        title: 'Cash Reconciliation',
        description: 'Closing cash drawer balances, X/Z report reconciliation, and banking handover protocol.',
        iconName: 'Receipt'
      },
      {
        title: 'Customer Service & De-escalation',
        description: 'Handling exchanges, resolving billing queries, managing queues, and customer satisfaction.',
        iconName: 'Users'
      },
      {
        title: 'Loss Prevention & Store Safety',
        description: 'EAS tag deactivation, anti-theft monitoring, aisle clearance, and emergency protocols.',
        iconName: 'ShieldCheck'
      }
    ]
  },
  {
    id: 'quick-commerce',
    name: 'Quick Commerce',
    heroHeadline: 'Power high-speed dark stores and sub-10 min dispatch.',
    heroSubtext: 'Master rapid wave picking, fresh produce grading, cold storage maintenance, and instant rider handoff.',
    tagline: 'Operate ultra-fast dark stores, sub-10 minute order picking, and live dispatching.',
    description: 'Specialized for high-speed micro-fulfillment centers, batch staging, rider coordination, and fresh produce grading.',
    iconName: 'Zap',
    accentColor: '#10B981',
    badge: 'High Growth Sector',
    rolesCount: 3,
    durationAvg: '1 - 2 Weeks',
    modulesRange: '3 - 4 Modules',
    practicalAvailable: true,
    certificateIncluded: true,
    popularRole: 'Dark Store Lead & Dispatcher',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    keySkills: ['Sub-90s Order Picking', 'Expiry Rotation (FIFO)', 'Rider Queue Management', 'Damaged Goods Quarantine'],
    whatYoullLearn: [
      {
        title: 'Sub-90s Wave Picking',
        description: 'Fast-lane navigation, multi-order tote routing, and picking error minimization.',
        iconName: 'Zap'
      },
      {
        title: 'Fresh & Chilled Grading',
        description: 'Cold chain integrity, fresh fruit/vegetable quality inspection, and thermal pack storage.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'FIFO Expiry Rotation',
        description: 'Daily expiry audits, short-dated stock segregation, and zero-waste markdown processes.',
        iconName: 'RotateCcw'
      },
      {
        title: 'Order Bagging & Seal Integrity',
        description: 'Weight-balanced bagging, fragile item isolation, and tamper-proof sealing.',
        iconName: 'PackageCheck'
      },
      {
        title: 'Rider Queue & Dispatch',
        description: 'Rider check-in, live OTP verification, delivery batch assignment, and SLA tracking.',
        iconName: 'Truck'
      },
      {
        title: 'Micro-Hub Floor Organization',
        description: 'Fast-moving aisle ergonomics, crate sanitization, and continuous staging readiness.',
        iconName: 'Layers'
      }
    ]
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    heroHeadline: 'Deliver exceptional service in food & beverage operations.',
    heroSubtext: 'Learn dining service excellence, kitchen dispatch, guest satisfaction, and hygiene protocols.',
    tagline: 'Deliver world-class guest satisfaction, dining operations, and service standards.',
    description: 'Comprehensive operational training for premium dining, cloud kitchen dispatch, banquet management, and front desk handling.',
    iconName: 'Utensils',
    accentColor: '#8B5CF6',
    badge: 'Global Hospitality Standards',
    rolesCount: 3,
    durationAvg: '2 - 3 Weeks',
    modulesRange: '4 Modules',
    practicalAvailable: true,
    certificateIncluded: true,
    popularRole: 'F&B Operations Associate',
    bgGradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
    keySkills: ['Food Safety & Hygiene', 'Beverage Service Standards', 'Table Management Software', 'Guest Complaint De-escalation'],
    whatYoullLearn: [
      {
        title: 'Service Standards & Etiquette',
        description: 'Table setting, sequencing orders, plate presentation, and formal guest hospitality.',
        iconName: 'Utensils'
      },
      {
        title: 'Food Safety & FSSAI Standards',
        description: 'HACCP food handling, allergen isolation, kitchen hygiene, and temperature maintenance.',
        iconName: 'ShieldCheck'
      },
      {
        title: 'POS Order Management',
        description: 'Table management software, KOT (Kitchen Order Ticket) dispatch, and bill settlement.',
        iconName: 'Receipt'
      },
      {
        title: 'Cloud Kitchen Logistics',
        description: 'Third-party delivery aggregator coordination, tamper packaging, and order timeliness.',
        iconName: 'Clock'
      },
      {
        title: 'Guest Relations & De-escalation',
        description: 'Resolving service delays, handling guest feedback, and turning escalations into loyalty.',
        iconName: 'Users'
      },
      {
        title: 'Beverage & Bar Protocol',
        description: 'Barware sanitization, non-alcoholic prep standards, and inventory liquor stock controls.',
        iconName: 'Layers'
      }
    ]
  },
  {
    id: 'facility-management',
    name: 'Facility Management',
    heroHeadline: 'Maintain critical infrastructure and enterprise facility uptime.',
    heroSubtext: 'Master BMS building operations, electrical safety, vendor SLAs, and compliance protocols.',
    tagline: 'Ensure infrastructure uptime, building maintenance, and enterprise safety compliance.',
    description: 'Hands-on protocols for corporate tech parks, HVAC inspections, fire safety compliance, and automated BMS monitoring.',
    iconName: 'Building2',
    accentColor: '#0EA5E9',
    badge: 'Essential Infrastructure',
    rolesCount: 3,
    durationAvg: '3 Weeks',
    modulesRange: '4 - 5 Modules',
    practicalAvailable: true,
    certificateIncluded: true,
    popularRole: 'Facility Operations Officer',
    bgGradient: 'from-sky-500/10 via-cyan-500/5 to-transparent',
    keySkills: ['BMS Dashboard Operations', 'Hazard Identification', 'Vendor SLA Audits', 'Electrical/HVAC Daily Rounds'],
    whatYoullLearn: [
      {
        title: 'BMS & Smart Building Systems',
        description: 'Building Management Software alerts, HVAC setpoint controls, and sensor monitoring.',
        iconName: 'Building2'
      },
      {
        title: 'Electrical & Utility Rounds',
        description: 'Daily checklist audits for UPS battery banks, DG sets, and low-voltage switchgears.',
        iconName: 'Zap'
      },
      {
        title: 'HVAC & Air Quality Monitoring',
        description: 'AHU filter inspections, chiller plant logging, and indoor air quality compliance.',
        iconName: 'Layers'
      },
      {
        title: 'Fire & Life Safety (FLS)',
        description: 'Hydrant checks, smoke detector testing, emergency evacuation routes, and OSHA logs.',
        iconName: 'ShieldAlert'
      },
      {
        title: 'Vendor SLA & Housekeeping Audits',
        description: 'Contractor supervision, janitorial inspection checklists, and SLA scorecard reviews.',
        iconName: 'ClipboardCheck'
      },
      {
        title: 'Workplace Ergonomics & Incident Logging',
        description: 'Near-miss reporting, preventive maintenance tickets, and emergency response plans.',
        iconName: 'FileText'
      }
    ]
  }
];

export const JOB_ROLES: JobRole[] = [
  // LOGISTICS & SUPPLY CHAIN ROLES
  {
    id: 'warehouse-associate',
    skillId: 'logistics-supply-chain',
    title: 'Warehouse Associate',
    industry: 'Logistics & Supply Chain',
    shortDescription: 'Core entry-level warehouse operations including pallet staging, storage bin allocation, and RF scanning.',
    fullDescription: 'Comprehensive training on modern fulfillment floor routines, pallet jack operation safety, handheld scanner terminal usage, and bin putaway.',
    startingSalary: '₹17,000 - ₹22,000 / mo',
    seniorSalary: '₹30,000+ / mo',
    hiringPartners: ['Delhivery', 'BlueDart', 'Amazon Relay', 'Flipkart Hubs'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Warehouse Associate', 'Shift Floor Lead', 'Assistant Operations Manager'],
    skillsGained: ['RF Scan Operations', 'Bin Putaway', 'Pallet Wrapping', 'Safety Protocols'],
    modules: [
      {
        id: 'wa-mod-1',
        roleId: 'warehouse-associate',
        moduleNumber: 1,
        title: 'Warehouse Layouts & RF Scanner Operation',
        durationMinutes: 25,
        summary: 'Learn warehouse zoning, high-rack bin numbering, and handheld barcode terminal basics.',
        videoDuration: '11:30',
        keyTakeaways: ['Understand aisle, bay, and shelf coordinates', 'Master 2-step scanning verification'],
        quiz: {
          id: 'wa-q-1',
          moduleId: 'wa-mod-1',
          title: 'RF Scanning Basics',
          passingScore: 70,
          questions: [
            {
              id: 'q1',
              question: 'What is the purpose of scanning the location bin after scanning the item SKU?',
              options: ['To clear the scanner memory', 'To confirm the item is stored in the correct digital coordinate', 'To print a receipt', 'To alert the driver'],
              correctIndex: 1,
              explanation: 'Scanning both items and bins ensures 100% stock location accuracy.'
            }
          ]
        }
      },
      {
        id: 'wa-mod-2',
        roleId: 'warehouse-associate',
        moduleNumber: 2,
        title: 'Pallet Stacking & Stretch Wrapping Standards',
        durationMinutes: 20,
        summary: 'Safe interlocking pallet stack patterns and shrink-wrapping techniques for transport stability.',
        videoDuration: '10:15',
        keyTakeaways: ['Stack heavy items at the base', 'Apply at least 3 tight wrap rotations at pallet base'],
        quiz: {
          id: 'wa-q-2',
          moduleId: 'wa-mod-2',
          title: 'Palletization Standards',
          passingScore: 70,
          questions: [
            {
              id: 'q2',
              question: 'Why should heavy cartons always be placed at the bottom of a pallet?',
              options: ['For cosmetic look', 'To maintain a low center of gravity and prevent collapse', 'To hide them', 'It does not matter'],
              correctIndex: 1,
              explanation: 'Low center of gravity prevents tipping and crushing of lighter cargo.'
            }
          ]
        }
      },
      {
        id: 'wa-mod-3',
        roleId: 'warehouse-associate',
        moduleNumber: 3,
        title: 'Order Picking & Tote Packing',
        durationMinutes: 30,
        summary: 'Efficient pick routes, batch order sorting, and packing fragile items securely.',
        videoDuration: '14:00',
        keyTakeaways: ['Follow snake-path routing to reduce walking', 'Check carton condition before packing'],
        quiz: {
          id: 'wa-q-3',
          moduleId: 'wa-mod-3',
          title: 'Picking Assessment',
          passingScore: 70,
          questions: [
            {
              id: 'q3',
              question: 'What should a picker do if an item in a bin appears damaged?',
              options: ['Pick it anyway', 'Quarantine it and flag in the WMS system as damaged stock', 'Ignore and walk away', 'Throw it in the trash'],
              correctIndex: 1,
              explanation: 'Flagging damaged goods prevents customer returns and keeps inventory counts accurate.'
            }
          ]
        }
      },
      {
        id: 'wa-mod-4',
        roleId: 'warehouse-associate',
        moduleNumber: 4,
        title: 'Floor Safety, Ergonomics & PPE',
        durationMinutes: 20,
        summary: 'Power lifting ergonomics, pedestrian safety lanes, and protective equipment standards.',
        videoDuration: '10:00',
        keyTakeaways: ['Lift with knees, not with back', 'Stay within designated yellow pedestrian walkways'],
        quiz: {
          id: 'wa-q-4',
          moduleId: 'wa-mod-4',
          title: 'Safety Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'q4',
              question: 'Which of the following is mandatory PPE in a warehouse?',
              options: ['High-visibility vest and safety shoes', 'Sunglasses', 'Sandals', 'Formal tie'],
              correctIndex: 0,
              explanation: 'High-vis vests and steel-toed boots protect against impacts and vehicle hazards.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'qc-inbound-inspector',
    skillId: 'logistics-supply-chain',
    title: 'QC & Inbound Inspector',
    industry: 'Logistics & Supply Chain',
    shortDescription: 'Inspect freight trailers, verify bills of lading, execute AQL defect checks, and manage quarantine zones.',
    fullDescription: 'Become a certified QC & Inbound Inspector trained on Purchase Order verification, seal integrity, defect sampling tables (AQL), and digital NCR reporting.',
    startingSalary: '₹20,000 - ₹26,000 / mo',
    seniorSalary: '₹38,000+ / mo',
    hiringPartners: ['Delhivery', 'Ecom Express', 'XpressBees', 'Amazon FCs'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Inbound Inspector', 'Shift Floor QC Lead', 'Quality & Compliance Manager'],
    skillsGained: ['Bill of Lading Audits', 'AQL Sampling', 'Seal Verification', 'Quarantine Handling'],
    modules: [
      {
        id: 'qc-mod-1',
        roleId: 'qc-inbound-inspector',
        moduleNumber: 1,
        title: 'Inbound Receiving & Manifest Verification',
        durationMinutes: 25,
        summary: 'Inspect incoming trailers, cross-examine physical bills of lading against POs, and verify security seals.',
        videoDuration: '12:40',
        keyTakeaways: ['Verify tamper-evident seal serials', 'Check PO match before accepting delivery'],
        quiz: {
          id: 'qc-q-1',
          moduleId: 'qc-mod-1',
          title: 'Manifest Verification Assessment',
          passingScore: 70,
          questions: [
            {
              id: 'qc-q1-1',
              question: 'What is the first step when a freight truck arrives at the loading dock?',
              options: ['Unload immediately', 'Verify seal number against bill of lading before opening doors', 'Sign without checking', 'Move to warehouse bins'],
              correctIndex: 1,
              explanation: 'Verifying seal integrity prevents cargo tampering and inventory loss.'
            }
          ]
        }
      },
      {
        id: 'qc-mod-2',
        roleId: 'qc-inbound-inspector',
        moduleNumber: 2,
        title: 'AQL Defect Sampling & Classification',
        durationMinutes: 30,
        summary: 'Apply Acceptable Quality Limit tables to sample batch cartons and classify Critical vs Major defects.',
        videoDuration: '14:30',
        keyTakeaways: ['Critical defects compromise safety', 'Major defects affect functionality'],
        quiz: {
          id: 'qc-q-2',
          moduleId: 'qc-mod-2',
          title: 'Defect Sampling Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'qc-q2-1',
              question: 'A defect that presents a safety hazard to the end user is classified as:',
              options: ['Minor', 'Cosmetic', 'Critical', 'Acceptable'],
              correctIndex: 2,
              explanation: 'Critical defects pose safety or operational hazards.'
            }
          ]
        }
      },
      {
        id: 'qc-mod-3',
        roleId: 'qc-inbound-inspector',
        moduleNumber: 3,
        title: 'Quarantine Procedures & Non-Conformance Reports',
        durationMinutes: 25,
        summary: 'Segregate damaged or non-matching consignments into red quarantine zones and file digital NCRs.',
        videoDuration: '12:00',
        keyTakeaways: ['Attach red quarantine tags to rejected pallets', 'Record photographic evidence for vendor claims'],
        quiz: {
          id: 'qc-q-3',
          moduleId: 'qc-mod-3',
          title: 'Quarantine Assessment',
          passingScore: 70,
          questions: [
            {
              id: 'qc-q3-1',
              question: 'What should be done when an entire shipment fails AQL inspection?',
              options: ['Put it into good stock', 'Move to Quarantine Zone and issue an NCR', 'Discard silently', 'Sell to coworkers'],
              correctIndex: 1,
              explanation: 'Quarantining and issuing a formal Non-Conformance Report ensures vendor accountability.'
            }
          ]
        }
      },
      {
        id: 'qc-mod-4',
        roleId: 'qc-inbound-inspector',
        moduleNumber: 4,
        title: 'Cold Chain & Temperature Monitoring',
        durationMinutes: 20,
        summary: 'Temperature data-logger audits, thermal insulation checks, and perishable goods acceptance.',
        videoDuration: '10:30',
        keyTakeaways: ['Log probe temperature readings on POD', 'Reject thawed perishable shipments'],
        quiz: {
          id: 'qc-q-4',
          moduleId: 'qc-mod-4',
          title: 'Cold Chain Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'qc-q4-1',
              question: 'If a frozen food shipment arrives at +8°C instead of -18°C, what is the protocol?',
              options: ['Put in freezer quickly', 'Reject consignment immediately due to cold-chain breach', 'Eat it', 'Accept with discount'],
              correctIndex: 1,
              explanation: 'Temperature abuse compromises food safety and requires mandatory rejection.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'inventory-staging-specialist',
    skillId: 'logistics-supply-chain',
    title: 'Inventory & Staging Specialist',
    industry: 'Logistics & Supply Chain',
    shortDescription: 'Conduct cycle counts and stock staging.',
    fullDescription: 'Master WMS inventory management, ABC analysis classification, fast-moving lane staging, and discrepancy reconciliation.',
    startingSalary: '₹19,000 - ₹25,000 / mo',
    seniorSalary: '₹36,000+ / mo',
    hiringPartners: ['Amazon', 'Flipkart', 'Shadowfax', 'DHL Supply Chain'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Inventory Auditor', 'Inventory Control Lead', 'Hub Inventory Manager'],
    skillsGained: ['Cycle Counting', 'ABC Stock Categorization', 'Variance Resolution', 'Aisle Optimization'],
    modules: [
      {
        id: 'inv-mod-1',
        roleId: 'inventory-staging-specialist',
        moduleNumber: 1,
        title: 'Cycle Count Methodology & Variance Auditing',
        durationMinutes: 25,
        summary: 'Understand blind cycle counting vs. targeted audits and system discrepancy adjustments.',
        videoDuration: '12:00',
        keyTakeaways: ['Perform counts without looking at expected system totals', 'Double-check adjacent bins for misplaced items'],
        quiz: {
          id: 'inv-q-1',
          moduleId: 'inv-mod-1',
          title: 'Cycle Count Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'inv-q1',
              question: 'What is a "Blind Cycle Count"?',
              options: ['Counting with eyes closed', 'Counting physical items without knowing system expected quantity', 'Counting only at night', 'Guessing stock levels'],
              correctIndex: 1,
              explanation: 'Blind counts eliminate confirmation bias by having the auditor enter true physical counts.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'dispatch-fleet-coordinator',
    skillId: 'logistics-supply-chain',
    title: 'Dispatch & Fleet Coordinator',
    industry: 'Logistics & Supply Chain',
    shortDescription: 'Coordinate outbound freight and vehicle manifests.',
    fullDescription: 'Manage loading bay assignments, transporter handovers, route manifests, and proof-of-delivery logging.',
    startingSalary: '₹18,000 - ₹24,000 / mo',
    seniorSalary: '₹35,000+ / mo',
    hiringPartners: ['Delhivery', 'BlueDart', 'Rivigo', 'Gati'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Dispatch Associate', 'Dock Master', 'Fleet Operations Lead'],
    skillsGained: ['Vehicle Manifests', 'Dock Scheduling', 'POD Logging', 'Transporter SLA'],
    modules: [
      {
        id: 'dfc-mod-1',
        roleId: 'dispatch-fleet-coordinator',
        moduleNumber: 1,
        title: 'Outbound Dock Scheduling & Manifests',
        durationMinutes: 25,
        summary: 'Transporter sign-offs, load balancing, and dispatch gate clearances.',
        videoDuration: '12:00',
        keyTakeaways: ['Verify truck seal serial numbers', 'Ensure correct weight distribution'],
        quiz: {
          id: 'dfc-q-1',
          moduleId: 'dfc-mod-1',
          title: 'Dispatch Gate Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'dfc1',
              question: 'What document confirms transporter receipt of cargo?',
              options: ['Proof of Delivery (POD)', 'Invoice Copy', 'Gate Pass', 'Visiting Card'],
              correctIndex: 0,
              explanation: 'The signed POD confirms the carrier took physical custody of cargo.'
            }
          ]
        }
      }
    ]
  },

  // RETAIL OPERATIONS ROLES
  {
    id: 'retail-store-associate',
    skillId: 'retail-operations',
    title: 'Retail Store Associate',
    industry: 'Retail Operations',
    shortDescription: 'Manage customer service and shelf displays.',
    fullDescription: 'Hands-on retail floor skills: product knowledge presentation, visual planogram maintenance, shelf facings, and stock rotation.',
    startingSalary: '₹16,000 - ₹21,000 / mo',
    seniorSalary: '₹28,000+ / mo',
    hiringPartners: ['Reliance Retail', 'DMart', 'Croma', 'Decathlon'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 6,
    careerPath: ['Store Associate', 'Category Floor Lead', 'Assistant Store Manager'],
    skillsGained: ['Planogram Compliance', 'Customer Engagement', 'Shelf Facing', 'Stock Rotation'],
    modules: [
      {
        id: 'ret-mod-1',
        roleId: 'retail-store-associate',
        moduleNumber: 1,
        title: 'Planogram Standards & Shelf Merchandising',
        durationMinutes: 25,
        summary: 'Learn eye-level product placement, facing guidelines, and price tag auditing.',
        videoDuration: '12:00',
        keyTakeaways: ['Keep front-row labels clearly visible', 'Ensure price tags match barcode SKU exactly'],
        quiz: {
          id: 'ret-q-1',
          moduleId: 'ret-mod-1',
          title: 'Planogram Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'rq1',
              question: 'What is a Planogram in retail stores?',
              options: ['A discount coupon', 'A visual diagram showing exact shelf placement for each product', 'A cash register model', 'A staff roster'],
              correctIndex: 1,
              explanation: 'Planograms ensure consistent product visibility and optimized sales flow.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'cashier-pos-specialist',
    skillId: 'retail-operations',
    title: 'Cashier & POS Specialist',
    industry: 'Retail Operations',
    shortDescription: 'Execute fast billing and payment settlement.',
    fullDescription: 'Master point-of-sale systems, split payments, return handling, cash drawer balancing, and invoice printing.',
    startingSalary: '₹17,000 - ₹23,000 / mo',
    seniorSalary: '₹30,000+ / mo',
    hiringPartners: ['DMart', 'Spencer’s', 'Star Bazaar', 'Lifestyle'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 6,
    careerPath: ['Checkout Cashier', 'Front-End Lead', 'Store Accounts Supervisor'],
    skillsGained: ['POS Systems', 'Cash Drawer Balancing', 'Card EDC Settlement', 'Invoice Processing'],
    modules: [
      {
        id: 'pos-mod-1',
        roleId: 'cashier-pos-specialist',
        moduleNumber: 1,
        title: 'POS Navigation & Cash Reconciliation',
        durationMinutes: 25,
        summary: 'POS shortcuts, scanning accuracy, discount validation, and end-of-day X/Z reports.',
        videoDuration: '11:00',
        keyTakeaways: ['Count cash out of customer view in secure office', 'Reconcile EDC card terminals before closing'],
        quiz: {
          id: 'pos-q-1',
          moduleId: 'pos-mod-1',
          title: 'POS Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'posq1',
              question: 'What report is printed at the end of the shift to reconcile total cash in drawer?',
              options: ['Z-Report / End-of-Day Settlement', 'Customer bill copy', 'Employee attendance slip', 'Weekly flyer'],
              correctIndex: 0,
              explanation: 'The Z-Report summarizes shift revenue across cash, card, and UPI tenders.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'visual-merchandiser',
    skillId: 'retail-operations',
    title: 'Visual Merchandiser',
    industry: 'Retail Operations',
    shortDescription: 'Design eye-catching store product showcases.',
    fullDescription: 'Plan endcap promotions, lighting arrangements, color themes, seasonal window displays, and signage.',
    startingSalary: '₹18,000 - ₹24,000 / mo',
    seniorSalary: '₹32,000+ / mo',
    hiringPartners: ['Shoppers Stop', 'Westside', 'Zara', 'H&M'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 6,
    careerPath: ['Visual Merchandiser', 'Display Coordinator', 'Regional VM Manager'],
    skillsGained: ['Window Styling', 'Color Blocking', 'Endcap Design', 'Signage Audits'],
    modules: [
      {
        id: 'vm-mod-1',
        roleId: 'visual-merchandiser',
        moduleNumber: 1,
        title: 'Visual Merchandising & Eye-Level Placement',
        durationMinutes: 25,
        summary: 'Display focal points, lighting highlights, and promotional signage execution.',
        videoDuration: '12:00',
        keyTakeaways: ['Position impulse items near checkout counters', 'Maintain high-contrast display lighting'],
        quiz: {
          id: 'vm-q-1',
          moduleId: 'vm-mod-1',
          title: 'Merchandising Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'vm1',
              question: 'What is the "Golden Zone" in retail merchandising?',
              options: ['The top shelf above 7 feet', 'Eye-level shelves between 4 to 5.5 feet', 'Floor corners', 'Under the counter'],
              correctIndex: 1,
              explanation: 'Eye-level shelves capture up to 80% of customer visual attention.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'store-inventory-supervisor',
    skillId: 'retail-operations',
    title: 'Store Inventory Supervisor',
    industry: 'Retail Operations',
    shortDescription: 'Audit backroom stock and replenishment.',
    fullDescription: 'Oversee backroom unloading, shrinkage control, stock rotation, expiry checks, and POS restocking.',
    startingSalary: '₹20,000 - ₹26,000 / mo',
    seniorSalary: '₹36,000+ / mo',
    hiringPartners: ['DMart', 'Reliance Fresh', 'More Retail', 'Nature’s Basket'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 6,
    careerPath: ['Inventory Lead', 'Assistant Store Manager', 'Store General Manager'],
    skillsGained: ['Stock Audits', 'Shrinkage Prevention', 'Backroom Staging', 'WMS Replenishment'],
    modules: [
      {
        id: 'sis-mod-1',
        roleId: 'store-inventory-supervisor',
        moduleNumber: 1,
        title: 'Backroom Inventory & Shrinkage Prevention',
        durationMinutes: 25,
        summary: 'Audit high-value SKUs, manage security tags, and direct morning stock replenishment.',
        videoDuration: '12:00',
        keyTakeaways: ['Inspect EAS electronic tags on garments', 'Audit high-shrink aisles daily'],
        quiz: {
          id: 'sis-q-1',
          moduleId: 'sis-mod-1',
          title: 'Inventory Audit Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'sis1',
              question: 'What is retail shrinkage?',
              options: ['Clothes shrinking in wash', 'Loss of inventory due to theft, damage, or administrative errors', 'Price drops during sales', 'Store size reduction'],
              correctIndex: 1,
              explanation: 'Shrinkage is the difference between recorded and physical inventory.'
            }
          ]
        }
      }
    ]
  },

  // QUICK COMMERCE ROLES
  {
    id: 'dark-store-picker-packer',
    skillId: 'quick-commerce',
    title: 'Dark Store Picker & Packer',
    industry: 'Quick Commerce',
    shortDescription: 'Sub-90s wave picking and grocery packing.',
    fullDescription: 'Trained specifically for under-10-minute micro-fulfillment hubs: snake-path aisle navigation, fresh grading, and sealed packing.',
    startingSalary: '₹17,000 - ₹23,000 / mo',
    seniorSalary: '₹32,000+ / mo',
    hiringPartners: ['Blinkit', 'Zepto', 'Swiggy Instamart', 'BigBasket Now'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 1,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 6,
    careerPath: ['Picker Associate', 'Dark Store Shift Lead', 'Hub Cluster Manager'],
    skillsGained: ['Sub-90s Picking', 'FIFO Expiry Audits', 'Bag Staging', 'Cold Item Packing'],
    modules: [
      {
        id: 'dsp-mod-1',
        roleId: 'dark-store-picker-packer',
        moduleNumber: 1,
        title: 'Dark Store Zoning & Rapid Picking Routing',
        durationMinutes: 20,
        summary: 'Hot zones vs cold zones, tote scanning, and eliminating aisle backtracking.',
        videoDuration: '10:00',
        keyTakeaways: ['Average item pick target is under 15 seconds', 'Keep heavy staples at bottom of delivery bag'],
        quiz: {
          id: 'dsp-q-1',
          moduleId: 'dsp-mod-1',
          title: 'Rapid Picking Assessment',
          passingScore: 70,
          questions: [
            {
              id: 'dspq1',
              question: 'Where should chilled milk and frozen ice cream be packed?',
              options: ['In standard plastic bag without insulation', 'In insulated thermal pouch with ice pack as last step', 'At bottom under heavy rice bags', 'Loose in tote'],
              correctIndex: 1,
              explanation: 'Thermal pouches prevent melting and temperature abuse during transit.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'hub-dispatch-rider-coordinator',
    skillId: 'quick-commerce',
    title: 'Hub Dispatch & Rider Coordinator',
    industry: 'Quick Commerce',
    shortDescription: 'Manage rider staging queues and handovers.',
    fullDescription: 'Lead dark store dispatch desks: assign orders to waiting riders, handle delivery escalations, and monitor hub throughput.',
    startingSalary: '₹19,000 - ₹25,000 / mo',
    seniorSalary: '₹35,000+ / mo',
    hiringPartners: ['Zepto', 'Blinkit', 'Instamart', 'Zomato'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 6,
    careerPath: ['Dispatch Lead', 'Dark Store Operations Manager', 'City Fleet Lead'],
    skillsGained: ['Rider Queue Allocation', 'SLA Monitoring', 'Handover Verification', 'Hub Staging Management'],
    modules: [
      {
        id: 'hd-mod-1',
        roleId: 'hub-dispatch-rider-coordinator',
        moduleNumber: 1,
        title: 'Live Dispatch Operations & Rider Handover',
        durationMinutes: 25,
        summary: 'Order verification, bag scanning, rider app sync, and OTP handshake.',
        videoDuration: '12:00',
        keyTakeaways: ['Confirm rider ID and order number before handover', 'Maintain under 45-second dispatch dock time'],
        quiz: {
          id: 'hd-q-1',
          moduleId: 'hd-mod-1',
          title: 'Dispatch Protocol Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'hdq1',
              question: 'What is the primary objective of the Dispatch Coordinator in a dark store?',
              options: ['Clean the parking lot', 'Ensure prepared orders are handed to the correct rider within 45 seconds', 'Cook food', 'Take telephone calls'],
              correctIndex: 1,
              explanation: 'Minimizing dock dispatch latency is vital to meeting overall 10-minute delivery promises.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'inbound-fresh-quality-grader',
    skillId: 'quick-commerce',
    title: 'Fresh Produce Quality Grader',
    industry: 'Quick Commerce',
    shortDescription: 'Grade fresh fruits, vegetables, and expiry.',
    fullDescription: 'Inspect fresh farm deliveries, perform visual and tactile quality grading, identify spoilage, and execute FIFO binning.',
    startingSalary: '₹18,000 - ₹24,000 / mo',
    seniorSalary: '₹33,000+ / mo',
    hiringPartners: ['Zepto', 'Blinkit', 'Swiggy Instamart', 'OTIPY'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 6,
    careerPath: ['Quality Grader', 'Inbound Lead', 'Quality Control Manager'],
    skillsGained: ['Produce Grading', 'Expiry Audits', 'Cold Storage Binning', 'Waste Log Management'],
    modules: [
      {
        id: 'fqg-mod-1',
        roleId: 'inbound-fresh-quality-grader',
        moduleNumber: 1,
        title: 'Fresh Produce Grading & Cold Bin Allocation',
        durationMinutes: 25,
        summary: 'Inspect surface blemishes, firmness standards, and chiller temperature zones.',
        videoDuration: '12:00',
        keyTakeaways: ['Segregate ripe vs unripe items', 'Log temperature readings at receiving dock'],
        quiz: {
          id: 'fqg-q-1',
          moduleId: 'inbound-fresh-quality-grader',
          title: 'Fresh Quality Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'fq1',
              question: 'What is the FIFO rule in grocery storage?',
              options: ['First In, First Out', 'Fast Item, Fast Out', 'Freeze It First Only', 'Final Inspection First Order'],
              correctIndex: 0,
              explanation: 'First In, First Out ensures older stock is picked first to eliminate waste.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'dark-store-shift-lead',
    skillId: 'quick-commerce',
    title: 'Dark Store Shift Lead',
    industry: 'Quick Commerce',
    shortDescription: 'Supervise floor throughput and dispatch speeds.',
    fullDescription: 'Coordinate pickers, stock replenishments, rider staging, hourly SLA scorecards, and dark store opening/closing routines.',
    startingSalary: '₹22,000 - ₹28,000 / mo',
    seniorSalary: '₹38,000+ / mo',
    hiringPartners: ['Blinkit', 'Zepto', 'Instamart', 'Dunzo'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Shift Lead', 'Dark Store Manager', 'Area Operations Lead'],
    skillsGained: ['SLA Management', 'Floor Rostering', 'Rider Coordination', 'Throughput Audits'],
    modules: [
      {
        id: 'dssl-mod-1',
        roleId: 'dark-store-shift-lead',
        moduleNumber: 1,
        title: 'Throughput Optimization & Floor Leadership',
        durationMinutes: 30,
        summary: 'Real-time order bottleneck elimination, rider queue re-balancing, and daily shift handovers.',
        videoDuration: '14:00',
        keyTakeaways: ['Balance picker allocations during surge hours', 'Track sub-10 min SLA compliance'],
        quiz: {
          id: 'dssl-q-1',
          moduleId: 'dark-store-shift-lead',
          title: 'Shift Leadership Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'dsl1',
              question: 'How should pickers be allocated during flash order surges?',
              options: ['Send them home', 'Reassign replenisher staff to dynamic wave picking', 'Ignore surge', 'Stop taking orders'],
              correctIndex: 1,
              explanation: 'Cross-training staff to flex into picking maintains 99%+ on-time dispatch rates.'
            }
          ]
        }
      }
    ]
  },

  // HOSPITALITY ROLES
  {
    id: 'fb-service-specialist',
    skillId: 'hospitality',
    title: 'F&B Service Specialist',
    industry: 'Hospitality',
    shortDescription: 'Deliver table service and guest dining hospitality.',
    fullDescription: 'Comprehensive food and beverage service training: table setting standards, order management, beverage service, and guest hospitality.',
    startingSalary: '₹18,000 - ₹24,000 / mo',
    seniorSalary: '₹34,000+ / mo',
    hiringPartners: ['Taj Hotels', 'Marriott', 'Speciality Restaurants', 'Haldirams'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Service Associate', 'Captain / Shift Lead', 'Restaurant Manager'],
    skillsGained: ['Table Service Standards', 'FSSAI Hygiene', 'Order Sequencing', 'Guest Communication'],
    modules: [
      {
        id: 'fb-mod-1',
        roleId: 'fb-service-specialist',
        moduleNumber: 1,
        title: 'Service Etiquette & Table Management',
        durationMinutes: 25,
        summary: 'Formal table setup, greeting guests, taking orders accurately, and course sequencing.',
        videoDuration: '12:00',
        keyTakeaways: ['Serve food from guest’s left, clear from right', 'Repeat order to confirm dietary preferences'],
        quiz: {
          id: 'fb-q-1',
          moduleId: 'fb-mod-1',
          title: 'Service Etiquette Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'fbq1',
              question: 'Why should food allergens be immediately noted on the Kitchen Order Ticket?',
              options: ['To charge extra', 'To prevent severe allergic reactions and ensure guest safety', 'To delay cooking', 'It is optional'],
              correctIndex: 1,
              explanation: 'Clear allergen communication prevents cross-contamination in the kitchen.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'guest-relations-associate',
    skillId: 'hospitality',
    title: 'Front Desk & Guest Relations Associate',
    industry: 'Hospitality',
    shortDescription: 'Manage guest check-ins, reservations, and billing.',
    fullDescription: 'Master hotel PMS software, guest reception etiquette, room key issuance, billing settlements, and concierge assistance.',
    startingSalary: '₹19,000 - ₹25,000 / mo',
    seniorSalary: '₹35,000+ / mo',
    hiringPartners: ['ITC Hotels', 'Hyatt', 'Lemon Tree Hotels', 'Radisson'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Guest Relations Executive', 'Duty Manager', 'Front Office Manager'],
    skillsGained: ['Hotel PMS Operations', 'Guest Check-in Protocol', 'Billing & EDC Settlement', 'Conflict Resolution'],
    modules: [
      {
        id: 'gra-mod-1',
        roleId: 'guest-relations-associate',
        moduleNumber: 1,
        title: 'Front Desk PMS & Check-In Protocol',
        durationMinutes: 25,
        summary: 'Guest registration cards, photo ID verification, key encoding, and billing preferences.',
        videoDuration: '12:00',
        keyTakeaways: ['Verify government ID before issuing room keys', 'Explain hotel amenities during registration'],
        quiz: {
          id: 'gra-q-1',
          moduleId: 'guest-relations-associate',
          title: 'Front Desk Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'gra1',
              question: 'What is the standard procedure when verifying a guest ID at check-in?',
              options: ['Skip if guest looks friendly', 'Match name with booking and scan valid government ID', 'Ask for cash only', 'Give room key first'],
              correctIndex: 1,
              explanation: 'Mandatory government ID verification ensures compliance with hospitality security laws.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'food-safety-hygiene-officer',
    skillId: 'hospitality',
    title: 'Food Safety & Hygiene Steward',
    industry: 'Hospitality',
    shortDescription: 'Enforce kitchen cleanliness and FSSAI guidelines.',
    fullDescription: 'Implement HACCP kitchen hygiene rules, sanitization protocols, food temperature logging, and pest control audits.',
    startingSalary: '₹18,000 - ₹24,000 / mo',
    seniorSalary: '₹32,000+ / mo',
    hiringPartners: ['Dominos / Jubilant', 'McDonalds / Westlife', 'KFC / Sapphire', 'Barbeque Nation'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Hygiene Steward', 'Kitchen Safety Lead', 'FSSAI Compliance Manager'],
    skillsGained: ['HACCP Standards', 'Temperature Logging', 'Sanitization Chemicals', 'Allergen Control'],
    modules: [
      {
        id: 'fsh-mod-1',
        roleId: 'food-safety-hygiene-officer',
        moduleNumber: 1,
        title: 'Kitchen HACCP & Food Temperature Standards',
        durationMinutes: 25,
        summary: 'Danger zone temperature ranges, sanitization concentrations, and cross-contamination prevention.',
        videoDuration: '12:00',
        keyTakeaways: ['Keep hot food above 63°C and cold food below 5°C', 'Use separate color-coded cutting boards'],
        quiz: {
          id: 'fsh-q-1',
          moduleId: 'food-safety-hygiene-officer',
          title: 'Food Hygiene Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'fsh1',
              question: 'What is the temperature "Danger Zone" where bacteria multiply rapidly in food?',
              options: ['Between 5°C and 63°C', 'Below 0°C', 'Above 100°C', 'Exactly 80°C'],
              correctIndex: 0,
              explanation: 'Perishable foods must not stay in the 5°C - 63°C range for more than 2 hours.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'banquet-event-coordinator',
    skillId: 'hospitality',
    title: 'Banquet & Event Operations Lead',
    industry: 'Hospitality',
    shortDescription: 'Coordinate catering setups and event dining.',
    fullDescription: 'Organize banquet buffet setups, live cooking stations, conference layouts, corporate dining, and event timing.',
    startingSalary: '₹20,000 - ₹26,000 / mo',
    seniorSalary: '₹36,000+ / mo',
    hiringPartners: ['Taj Vivanta', 'The Leela', 'Novotel', 'Conrad'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Banquet Lead', 'Event Operations Manager', 'Banquet Director'],
    skillsGained: ['Buffet Staging', 'Table Layouts', 'Event Timelines', 'Guest Logistics'],
    modules: [
      {
        id: 'beo-mod-1',
        roleId: 'banquet-event-coordinator',
        moduleNumber: 1,
        title: 'Banquet Layouts & Live Buffet Staging',
        durationMinutes: 25,
        summary: 'Theater vs classroom seating, chaffing dish setups, and VIP guest reception.',
        videoDuration: '12:00',
        keyTakeaways: ['Test buffet warmers 30 minutes before doors open', 'Maintain clear guest walking aisles'],
        quiz: {
          id: 'beo-q-1',
          moduleId: 'banquet-event-coordinator',
          title: 'Banquet Setup Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'beo1',
              question: 'When should banquet buffet food stations be fully prepped and warmed?',
              options: ['After guests arrive', '30 minutes before guest event start time', '2 hours after event', 'Never'],
              correctIndex: 1,
              explanation: 'Pre-warming ensures hot food is at safe serving temperatures upon guest arrival.'
            }
          ]
        }
      }
    ]
  },

  // FACILITY MANAGEMENT ROLES
  {
    id: 'facility-maintenance-technician',
    skillId: 'facility-management',
    title: 'Facility Operations & Maintenance Officer',
    industry: 'Facility Management',
    shortDescription: 'Execute HVAC rounds, BMS monitoring, and safety.',
    fullDescription: 'Corporate infrastructure maintenance: BMS dashboard navigation, utility checklists (UPS, DG sets), vendor SLA audits, and OSHA compliance.',
    startingSalary: '₹20,000 - ₹27,000 / mo',
    seniorSalary: '₹40,000+ / mo',
    hiringPartners: ['JLL', 'CBRE', 'Compass Group', 'Sodexo Facility'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 3,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Facility Officer', 'Shift Operations Lead', 'Senior Facility Manager'],
    skillsGained: ['BMS Monitoring', 'HVAC Inspection', 'Fire Safety Audits', 'Vendor SLA Reviews'],
    modules: [
      {
        id: 'fm-mod-1',
        roleId: 'facility-maintenance-technician',
        moduleNumber: 1,
        title: 'BMS Dashboard Operations & Daily Utility Rounds',
        durationMinutes: 30,
        summary: 'Understanding building automation alarms, UPS battery room checks, and temperature logging.',
        videoDuration: '14:00',
        keyTakeaways: ['Inspect UPS room temperatures between 20°C - 24°C', 'Log DG battery voltage before shift handover'],
        quiz: {
          id: 'fm-q-1',
          moduleId: 'facility-maintenance-technician',
          title: 'Facility Operations Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'fmq1',
              question: 'What is the primary function of a Building Management System (BMS)?',
              options: ['To play music in lobby', 'To monitor and control HVAC, lighting, and power infrastructure automatically', 'To cook meals', 'To print tickets'],
              correctIndex: 1,
              explanation: 'BMS automates energy efficiency, temperature control, and critical system alarms.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'bms-operations-executive',
    skillId: 'facility-management',
    title: 'BMS & Smart Building Operator',
    industry: 'Facility Management',
    shortDescription: 'Control HVAC setpoints and alarm monitoring.',
    fullDescription: 'Operate Building Management Systems (BMS), monitor chilled water temperatures, adjust ventilation dampers, and respond to sensor triggers.',
    startingSalary: '₹22,000 - ₹28,000 / mo',
    seniorSalary: '₹38,000+ / mo',
    hiringPartners: ['Schneider Electric', 'Johnson Controls', 'CBRE', 'Honeywell'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['BMS Operator', 'Control Room Supervisor', 'Building Automation Lead'],
    skillsGained: ['BMS Software', 'AHU VAV Setpoints', 'Chiller Monitoring', 'Energy Logging'],
    modules: [
      {
        id: 'bms-mod-1',
        roleId: 'bms-operations-executive',
        moduleNumber: 1,
        title: 'BMS Software Alarms & Setpoint Adjustments',
        durationMinutes: 25,
        summary: 'Monitor critical temperature thresholds, alarm priority levels, and air handling units.',
        videoDuration: '12:00',
        keyTakeaways: ['Respond to Level 1 critical alarms within 3 minutes', 'Maintain server room temperatures at 20-22°C'],
        quiz: {
          id: 'bms-q-1',
          moduleId: 'bms-operations-executive',
          title: 'BMS Operations Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'bms1',
              question: 'What action should a BMS operator take upon receiving a critical server room high-temperature alarm?',
              options: ['Mute and ignore', 'Acknowledge alarm, trigger backup precision AC (PAC), and dispatch technician', 'Turn off computers', 'Wait until tomorrow'],
              correctIndex: 1,
              explanation: 'Immediate PAC failover prevents data center thermal shutdowns.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'fls-fire-safety-officer',
    skillId: 'facility-management',
    title: 'Fire, Life Safety & Compliance Officer',
    industry: 'Facility Management',
    shortDescription: 'Audit fire hydrants, detectors, and evacuation.',
    fullDescription: 'Inspect fire alarm panels, emergency exit routes, sprinkler risers, fire extinguishers, and conduct workplace safety drills.',
    startingSalary: '₹21,000 - ₹26,000 / mo',
    seniorSalary: '₹37,000+ / mo',
    hiringPartners: ['JLL', 'Cushman & Wakefield', 'Knight Frank', 'Tata Realty'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 2,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Safety Officer', 'EHS Lead', 'Head of Workplace Safety'],
    skillsGained: ['FLS Inspections', 'Fire Alarm Panels', 'Evacuation Drill Management', 'OSHA Compliance'],
    modules: [
      {
        id: 'fls-mod-1',
        roleId: 'fls-fire-safety-officer',
        moduleNumber: 1,
        title: 'Fire Alarm Panel Audits & Evacuation Routes',
        durationMinutes: 25,
        summary: 'Test smoke detectors, inspect exit signage illumination, and verify fire hydrant pressure.',
        videoDuration: '12:00',
        keyTakeaways: ['Keep all fire exit doorways completely unobstructed', 'Verify fire extinguisher pressure gauge in green zone'],
        quiz: {
          id: 'fls-q-1',
          moduleId: 'fls-fire-safety-officer',
          title: 'Fire Safety Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'fls1',
              question: 'What does a green needle position on a fire extinguisher pressure gauge indicate?',
              options: ['Empty', 'Overcharged', 'Properly charged and ready for use', 'Expired'],
              correctIndex: 2,
              explanation: 'Green indicator verifies proper internal gas pressure.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'utility-hvac-lead',
    skillId: 'facility-management',
    title: 'Utility, DG & Electrical Substation Lead',
    industry: 'Facility Management',
    shortDescription: 'Maintain backup power, DG sets, and utilities.',
    fullDescription: 'Monitor low-voltage switchgears, diesel generator fuel logs, UPS battery strings, and utility power factor correction.',
    startingSalary: '₹23,000 - ₹30,000 / mo',
    seniorSalary: '₹42,000+ / mo',
    hiringPartners: ['L&T Facility', 'CBRE', 'DLF Tech Parks', 'Embassy Services'],
    litePrice: 199,
    liteOriginalPrice: 399,
    proPrice: 399,
    proOriginalPrice: 799,
    durationWeeks: 3,
    moduleCount: 4,
    hasPractical: true,
    practicalHours: 8,
    careerPath: ['Utility Technician', 'Electrical Lead', 'Chief Engineering Officer'],
    skillsGained: ['DG Synchronization', 'UPS Battery Audits', 'Transformer Maintenance', 'Energy Metering'],
    modules: [
      {
        id: 'uhl-mod-1',
        roleId: 'utility-hvac-lead',
        moduleNumber: 1,
        title: 'DG Backup Readiness & UPS Battery Monitoring',
        durationMinutes: 30,
        summary: 'Diesel generator auto-mains failure (AMF) panels, fuel level verification, and UPS load audits.',
        videoDuration: '14:00',
        keyTakeaways: ['Test DG auto-start sequence weekly', 'Check UPS battery individual cell voltages'],
        quiz: {
          id: 'uhl-q-1',
          moduleId: 'utility-hvac-lead',
          title: 'Utility Maintenance Quiz',
          passingScore: 70,
          questions: [
            {
              id: 'uhl1',
              question: 'What is the role of an AMF (Auto Mains Failure) panel in a facility?',
              options: ['To dim lights', 'To automatically start the DG set within seconds during power grid failure', 'To cool the building', 'To count visitors'],
              correctIndex: 1,
              explanation: 'AMF panels ensure uninterrupted power backup for critical enterprise infrastructure.'
            }
          ]
        }
      }
    ]
  }
];

export const LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'lib-1',
    title: 'Inbound Receiving & Freight Dock SOP',
    category: 'Operations',
    duration: '5 min',
    level: 'Essential',
    readTime: '5 min read',
    price: 29,
    summary: 'Step-by-step checklist for dock trailer inspections, PO validation, physical carton counts, and quarantine handling.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Warehouse receiving associate checking freight shipment',
    content: [
      '1. Dock Safety Protocol: Verify wheel chocks and dock leveler before walking into freight vehicle.',
      '2. Seal Inspection: Match the physical tamper-evident seal serial number to the Waybill/POD.',
      '3. Temperature Check (Cold Chain): Record internal temperature with calibrated infrared thermometer before unloading.',
      '4. SKU Quantity Cross-Check: Count box totals against the digital Bill of Lading.',
      '5. Damage Segregation: Immediately place damaged or damp cartons in the designated Red Quarantine Zone.'
    ],
    keyTips: ['Never sign a clean delivery receipt if there is visible outer packaging puncture.'],
    downloadable: true
  },
  {
    id: 'lib-2',
    title: 'Inventory Accuracy & Cycle Count SOP',
    category: 'Operations',
    duration: '8 min',
    level: 'Essential',
    readTime: '8 min read',
    price: 29,
    summary: 'Keep stock records accurate, resolve bin discrepancies, and reduce warehouse inventory errors.',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Logistics coordinator managing inventory stock records',
    content: [
      '1. Review ERP daily cycle count trigger list before opening morning floor operations.',
      '2. Scan physical bin location barcode before counting items on shelf.',
      '3. Perform blind physical count without looking at expected system balance.',
      '4. Re-count adjacent bins in case of SKU mix-ups or misplaced items.',
      '5. Log shrinkage variance codes with supervisor signature before adjusting inventory.'
    ],
    keyTips: ['Always count from top shelf to bottom shelf to prevent missed item records.'],
    downloadable: true
  },
  {
    id: 'lib-3',
    title: 'Customer Service & Frontline Etiquette',
    category: 'Customer Service',
    duration: '6 min',
    level: 'Intermediate',
    readTime: '6 min read',
    price: 29,
    summary: 'Essential communication, active listening, and conflict de-escalation techniques for retail and service floors.',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Customer service executive interacting with a client',
    content: [
      '1. The 10/4 Rule: Acknowledge every customer within 10 feet with eye contact and within 4 feet with a warm greeting.',
      '2. Active Listening: Allow the customer to complete their explanation without interruption.',
      '3. Empathetic Response: Validate frustration before presenting practical solutions.',
      '4. Solution Ownership: Walk the customer directly to the product location instead of pointing across aisles.',
      '5. Polite Close: Thank the customer for visiting and confirm if they require any additional assistance.'
    ],
    keyTips: ['Use positive framing: replace "We don\'t have that" with "Let me check our store inventory or order that for you."'],
    downloadable: true
  },
  {
    id: 'lib-4',
    title: 'Safe Material Handling & Ergonomic Lifting',
    category: 'Safety',
    duration: '4 min',
    level: 'Essential',
    readTime: '4 min read',
    price: 29,
    summary: 'Critical ergonomic rules for manual carton handling, heavy equipment clearances, and zero-injury shift discipline.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Frontline workplace safety supervisor on floor',
    content: [
      '1. Assess load weight before lifting; request a team lift for items exceeding 23 kg (50 lbs).',
      '2. Base of support: Feet shoulder-width apart, one foot slightly ahead.',
      '3. Bend knees and hips — never bend forward from the waist.',
      '4. Hold load tight against your center of gravity.',
      '5. Turn with your feet, not by twisting your torso.'
    ],
    keyTips: ['Never stack cartons higher than 1.8 meters on standard wooden euro pallets.'],
    downloadable: true
  },
  {
    id: 'lib-5',
    title: 'Handheld RF Gun & Barcode Scanning',
    category: 'Digital Skills',
    duration: '3 min',
    level: 'Beginner',
    readTime: '3 min read',
    price: 29,
    summary: 'Master handheld terminal scanning angles, QR code reading distance, and battery management in high-throughput environments.',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Warehouse associate scanning barcode on package',
    content: [
      '1. Keep scanner window 15–20 cm away from the barcode for optimal focal length.',
      '2. Clean the optical lens with microfiber cloth at the start of every shift.',
      '3. If a 1D barcode is wrinkled, smooth the label flat with thumb before scanning.',
      '4. Always listen for the single confirmation beep before moving to the bin scan.'
    ],
    keyTips: ['Keep your scan trigger pressed smoothly rather than double-tapping repeatedly.'],
    downloadable: false
  },
  {
    id: 'lib-6',
    title: 'Shift Handover & Team Floor Leadership',
    category: 'Leadership',
    duration: '5 min',
    level: 'Intermediate',
    readTime: '5 min read',
    price: 29,
    summary: 'Structured 10-minute briefing routine for shift supervisors to transition pending dispatches and SLA priorities.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Team leader conducting operational briefing with colleagues',
    content: [
      '1. Output Metrics: Review completed picking units vs. daily shift targets.',
      '2. Pending Backlog: Hand over unfulfilled customer orders and express courier cutoffs.',
      '3. Equipment Status: Note any MHE (stacker, scanner, conveyor) needing battery charging or maintenance.',
      '4. Safety Incident Check: Confirm zero near-misses or document open inspection reports.',
      '5. Sign-off: Both incoming and outgoing shift supervisors sign the physical shift logbook.'
    ],
    keyTips: ['Always conduct shift handover 15 minutes before the shift changeover bell rings.'],
    downloadable: true
  },
  {
    id: 'lib-7',
    title: 'Retail POS Cash Reconciliation & End-of-Day SOP',
    category: 'Customer Service',
    duration: '5 min',
    level: 'Intermediate',
    readTime: '5 min read',
    price: 29,
    summary: 'Closing cash drawer balances, matching card/UPI digital terminal summaries, and discrepancy resolution.',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Retail cashier managing digital checkout and point of sale terminal',
    content: [
      '1. Print the X-Report to review running transaction totals before closing register.',
      '2. Count currency denominations in descending order (2000, 500, 200, 100, 50, 20, 10).',
      '3. Compare total physical cash against expected POS drawer balance.',
      '4. Settle credit/debit card EDC machines and reconcile batch settlement slips.'
    ],
    keyTips: ['Always perform cash counting out of direct customer eyesight in the secure back office.'],
    downloadable: true
  },
  {
    id: 'lib-8',
    title: 'Dark Store Sub-90s Picking & Packing Workflow',
    category: 'Operations',
    duration: '6 min',
    level: 'Intermediate',
    readTime: '6 min read',
    price: 29,
    summary: 'Visual breakdown of fast-lane aisle routing, batch tote arrangement, and instant bag sealing for quick commerce hubs.',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Fast fulfillment dark store aisle operations',
    content: [
      '1. Route optimization: Follow designated single-direction aisle pick path on mobile terminal.',
      '2. Weight distribution: Place heavy liquid containers and canned goods at base of tote.',
      '3. Fragile item isolation: Bag bakery and fresh fruits separately in top pouch.',
      '4. Quality verification: Confirm expiration date is at least 3 days beyond current date.',
      '5. Rider handoff: Scan QR on tamper-proof delivery bag and stage at outbound dispatch counter.'
    ],
    keyTips: ['Place chilled dairy products into insulated thermal bags at the last step.'],
    downloadable: true
  }
];

export const PRACTICAL_TRAINING_CENTERS = [
  {
    id: 'center-delhi-ncr',
    city: 'Delhi NCR',
    name: 'SkillGo Logistics Hub (Gurugram Sec 48)',
    address: 'Plot 12, Industrial Logistics Zone, Sector 48, Gurugram, Haryana 122001',
    equipment: ['Automated Conveyor Line', 'RF Gun Simulators', 'Electric Stackers', 'Quality Testing Lab'],
    availableBatches: ['Upcoming Saturday, 10:00 AM - 6:00 PM', 'Upcoming Sunday, 10:00 AM - 6:00 PM']
  },
  {
    id: 'center-bengaluru',
    city: 'Bengaluru',
    name: 'SkillGo Center of Excellence (Peenya)',
    address: '4th Cross, Peenya Industrial Area Phase 1, Bengaluru, Karnataka 560058',
    equipment: ['Dark Store Replica Setup', 'ERP/WMS Live Lab', 'Pallet Wrapper Mock Dock', 'AQL Inspection Station'],
    availableBatches: ['Upcoming Saturday, 10:00 AM - 6:00 PM', 'Upcoming Wednesday, 10:00 AM - 6:00 PM']
  },
  {
    id: 'center-mumbai',
    city: 'Mumbai / Bhiwandi',
    name: 'SkillGo Bhiwandi Mega-Hub Center',
    address: 'Godown 4B, Indian Corporation Logistics Park, Mankoli, Bhiwandi 421302',
    equipment: ['High-Rack Staging', 'Dock Leveler Simulators', 'Barcode Printing Station', 'Cold Storage Mock Units'],
    availableBatches: ['Upcoming Sunday, 10:00 AM - 6:00 PM', 'Upcoming Tuesday, 10:00 AM - 6:00 PM']
  }
];
