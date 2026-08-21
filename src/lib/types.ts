export type PlanType = 'lite' | 'pro';

export interface LearningTopic {
  title: string;
  description: string;
  iconName: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  heroHeadline: string;
  heroSubtext: string;
  tagline: string;
  description: string;
  iconName: string;
  accentColor: string;
  badge: string;
  rolesCount: number;
  durationAvg: string;
  modulesRange: string;
  practicalAvailable: boolean;
  certificateIncluded: boolean;
  popularRole: string;
  bgGradient: string;
  keySkills: string[];
  whatYoullLearn: LearningTopic[];
}

export interface JobRole {
  id: string;
  skillId: string;
  title: string;
  industry: string;
  shortDescription: string;
  fullDescription: string;
  startingSalary: string;
  seniorSalary: string;
  hiringPartners: string[];
  litePrice: number;
  liteOriginalPrice?: number;
  proPrice: number;
  proOriginalPrice?: number;
  durationWeeks: number;
  moduleCount: number;
  hasPractical: boolean;
  practicalHours: number;
  careerPath: string[];
  skillsGained: string[];
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  roleId: string;
  moduleNumber: number;
  title: string;
  durationMinutes: number;
  summary: string;
  videoUrl?: string;
  videoDuration: string;
  keyTakeaways: string[];
  quiz: ModuleQuiz;
}

export interface ModuleQuiz {
  id: string;
  moduleId: string;
  title: string;
  passingScore: number; // in percentage e.g. 70
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  category: 'Operations' | 'Customer Service' | 'Safety' | 'Leadership' | 'Digital Skills' | 'SOPs' | 'Quick Skills' | 'Interview Prep' | 'Videos' | string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Essential';
  summary: string;
  readTime: string;
  price: number; // e.g. 19 or 29
  content: string[];
  keyTips?: string[];
  downloadable?: boolean;
  image?: string;
  imageAlt?: string;
  videoDuration?: string;
  videoUrl?: string;
}

export type ProductType = 'skill' | 'library';

export interface CartItem {
  id: string; // Unique cart item ID (e.g. cart-skill-warehouse-associate-qc-pro or cart-lib-lib-2)
  productId: string; // roleId (for skill) or libraryItemId (for library)
  productType: ProductType;
  title: string;
  subtitle?: string;
  price: number;
  image?: string;
  selectedPlan?: PlanType; // 'lite' | 'pro' for skills
  skillId?: string; // parent skill domain id
  category?: string; // category tag
  duration?: string;
}

export interface LearnerProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  education: string;
  experienceLevel: string;
}

export interface Enrollment {
  id: string;
  roleId: string;
  skillId: string;
  plan: PlanType;
  enrollmentDate: string;
  completedModules: string[];
  currentModuleId: string;
  quizScores: Record<string, number>; // moduleId -> percentage
  practicalPurchased?: boolean;
  practicalCompleted?: boolean;
  completedPracticalActivities?: string[];
  practicalBooked?: boolean;
  practicalSlot?: {
    centerId: string;
    centerName: string;
    date: string;
    timeSlot: string;
  };
  assessmentAttempts?: number;
  assessmentScore?: number;
  assessmentPassed?: boolean;
  certificateEligible?: boolean;
  isCompleted: boolean;
  completionDate?: string;
  certificateId?: string;
}

export type CertificateStatus = 'locked' | 'eligible' | 'issued' | 'verified';

export interface OrderItemRecord {
  productId: string;
  title: string;
  price: number;
  productType: ProductType;
  selectedPlan?: PlanType;
  skillId?: string;
  subtitle?: string;
}

export interface OrderRecord {
  orderId: string;
  purchaseDate: string;
  totalAmount: number;
  paymentMethod: string;
  items: OrderItemRecord[];
}

export interface CertificateRecord {
  id: string; // SG-CERT-XXXXXX
  enrollmentId: string;
  learnerId?: string;
  candidateName: string;
  skillId?: string;
  skillCategory: string;
  roleId?: string;
  roleTitle: string;
  plan: PlanType;
  issueDate: string;
  grade: string;
  scoreAvg: number;
  assessmentScore?: number;
  practicalCompleted?: boolean;
  verificationCode: string;
  verificationStatus: 'valid' | 'revoked';
  isValid: boolean;
}
