import { useState, useEffect } from 'react';
import { Enrollment, LearnerProfile, CertificateRecord, PlanType, CertificateStatus, CartItem, ProductType, OrderRecord } from './types';
import { JOB_ROLES, SKILL_CATEGORIES, LIBRARY_ITEMS } from './catalog';

const STORAGE_KEYS = {
  ENROLLMENTS: 'skillgo_enrollments_v1',
  ACTIVE_ENROLLMENT_ID: 'skillgo_active_enrollment_id_v1',
  PROFILE: 'skillgo_learner_profile_v1',
  CERTIFICATES: 'skillgo_certificates_v1',
  ONBOARDED: 'skillgo_onboarded_v1',
  REGISTERED: 'skillgo_registered_v1',
  CART: 'skillgo_cart_v1',
  PURCHASED_LIBRARY: 'skillgo_purchased_library_v1',
  ORDER_HISTORY: 'skillgo_order_history_v1',
};

const GUEST_PROFILE: LearnerProfile = {
  id: 'USR-GUEST',
  name: 'Learner',
  email: 'learner@skillgo.in',
  phone: '',
  city: 'Delhi NCR',
  education: 'Graduate / Diploma',
  experienceLevel: 'Entry to 1 Year'
};

function clearAllCookies(): void {
  try {
    if (typeof document !== 'undefined' && document.cookie) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    }
  } catch (err) {
    console.warn('Cookie cleanup warning:', err);
  }
}

function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('skillgo_storage_update'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export const enrollmentStore = {
  isOnboarded(): boolean {
    return getStorageItem<boolean>(STORAGE_KEYS.ONBOARDED, false);
  },

  isRegistered(): boolean {
    return getStorageItem<boolean>(STORAGE_KEYS.REGISTERED, false);
  },

  skipOnboarding(): void {
    setStorageItem(STORAGE_KEYS.ONBOARDED, true);
    setStorageItem(STORAGE_KEYS.REGISTERED, false);
  },

  /**
   * Clears old storage/cookies and generates a brand-new unique user profile & fresh cart session
   */
  completeOnboarding(
    details: { name: string; phone: string; city: string; email?: string },
    initialCartItems: CartItem[] = []
  ): LearnerProfile {
    // 1. Wipe old local storage data, cookies, and cached user states
    try {
      localStorage.clear();
      clearAllCookies();
    } catch (e) {
      console.warn('Storage wipe warning:', e);
    }

    // 2. Generate brand-new unique user profile details
    const cleanName = details.name.trim() || 'Learner';
    const cleanPhoneDigits = details.phone.replace(/\D/g, '');
    const cleanPhone = cleanPhoneDigits.length === 10 ? `+91 ${cleanPhoneDigits}` : details.phone.trim();
    const cleanCity = details.city.trim() || 'Delhi NCR';
    
    const emailPrefix = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'learner';
    const cleanEmail = details.email?.trim() || `${emailPrefix}${Math.floor(100 + Math.random() * 900)}@gmail.com`;
    const uniqueLearnerId = `USR-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const freshProfile: LearnerProfile = {
      id: uniqueLearnerId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      city: cleanCity,
      education: 'Graduate / Diploma',
      experienceLevel: 'Entry to 1 Year'
    };

    // 3. Initialize clean state structure for the new user
    setStorageItem(STORAGE_KEYS.PROFILE, freshProfile);
    setStorageItem(STORAGE_KEYS.ONBOARDED, true);
    setStorageItem(STORAGE_KEYS.REGISTERED, true);
    setStorageItem(STORAGE_KEYS.ENROLLMENTS, []);
    setStorageItem(STORAGE_KEYS.ACTIVE_ENROLLMENT_ID, null);
    setStorageItem(STORAGE_KEYS.CERTIFICATES, []);
    setStorageItem(STORAGE_KEYS.CART, initialCartItems);
    setStorageItem(STORAGE_KEYS.PURCHASED_LIBRARY, []);

    return freshProfile;
  },

  resetAllSessionData(): void {
    try {
      localStorage.clear();
      clearAllCookies();
      window.dispatchEvent(new Event('skillgo_storage_update'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to reset session data', err);
    }
  },

  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ONBOARDED);
      localStorage.removeItem(STORAGE_KEYS.REGISTERED);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      window.dispatchEvent(new Event('skillgo_storage_update'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to logout session', err);
    }
  },

  getProfile(): LearnerProfile {
    return getStorageItem<LearnerProfile>(STORAGE_KEYS.PROFILE, GUEST_PROFILE);
  },

  updateProfile(profile: Partial<LearnerProfile>): void {
    const current = this.getProfile();
    setStorageItem(STORAGE_KEYS.PROFILE, { ...current, ...profile });
  },

  getEnrollments(): Enrollment[] {
    return getStorageItem<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, []);
  },

  getActiveEnrollment(): Enrollment | null {
    const enrollments = this.getEnrollments();
    if (enrollments.length === 0) return null;
    const activeId = getStorageItem<string | null>(STORAGE_KEYS.ACTIVE_ENROLLMENT_ID, null);
    if (activeId) {
      const found = enrollments.find(e => e.id === activeId);
      if (found) return found;
    }
    // Return most recently active in-progress enrollment
    const inProgress = enrollments.find(e => !e.isCompleted);
    return inProgress || enrollments[0] || null;
  },

  createEnrollment(roleId: string, skillId: string, plan: PlanType): Enrollment {
    const enrollments = this.getEnrollments();
    const role = JOB_ROLES.find(r => r.id === roleId);
    const firstModuleId = role?.modules[0]?.id || 'mod-1';

    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      roleId,
      skillId,
      plan,
      enrollmentDate: new Date().toISOString().split('T')[0],
      completedModules: [],
      currentModuleId: firstModuleId,
      quizScores: {},
      practicalBooked: false,
      isCompleted: false
    };

    const updated = [newEnrollment, ...enrollments];
    setStorageItem(STORAGE_KEYS.ENROLLMENTS, updated);
    setStorageItem(STORAGE_KEYS.ACTIVE_ENROLLMENT_ID, newEnrollment.id);
    return newEnrollment;
  },

  completeModule(enrollmentId: string, moduleId: string, score: number): void {
    const enrollments = this.getEnrollments();
    const target = enrollments.find(e => e.id === enrollmentId);
    if (!target) return;

    const completed = Array.from(new Set([...target.completedModules, moduleId]));
    const scores = { ...target.quizScores, [moduleId]: score };

    const role = JOB_ROLES.find(r => r.id === target.roleId);
    let nextModuleId = target.currentModuleId;
    let isFullyDone = false;

    if (role) {
      const currentIndex = role.modules.findIndex(m => m.id === moduleId);
      if (currentIndex >= 0 && currentIndex < role.modules.length - 1) {
        nextModuleId = role.modules[currentIndex + 1].id;
      } else {
        isFullyDone = true;
      }
    }

    const updatedEnrollments = enrollments.map(e => {
      if (e.id === enrollmentId) {
        return {
          ...e,
          completedModules: completed,
          currentModuleId: nextModuleId,
          quizScores: scores,
          isCompleted: isFullyDone,
          completionDate: isFullyDone ? new Date().toISOString().split('T')[0] : e.completionDate,
          certificateId: isFullyDone && !e.certificateId ? `SG-CERT-${Date.now().toString().slice(-6)}` : e.certificateId
        };
      }
      return e;
    });

    setStorageItem(STORAGE_KEYS.ENROLLMENTS, updatedEnrollments);

    if (isFullyDone) {
      const completedRecord = updatedEnrollments.find(e => e.id === enrollmentId);
      if (completedRecord) {
        this.generateCertificate(completedRecord);
      }
    }
  },

  upgradeToPractical(enrollmentId: string): void {
    const enrollments = this.getEnrollments();
    const updated = enrollments.map(e => {
      if (e.id === enrollmentId) {
        return {
          ...e,
          practicalPurchased: true,
          plan: 'pro' as PlanType
        };
      }
      return e;
    });
    setStorageItem(STORAGE_KEYS.ENROLLMENTS, updated);
  },

  completePracticalActivity(enrollmentId: string, activityId: string): void {
    const enrollments = this.getEnrollments();
    const updated = enrollments.map(e => {
      if (e.id === enrollmentId) {
        const activities = Array.from(new Set([...(e.completedPracticalActivities || []), activityId]));
        const isAllActivitiesDone = activities.length >= 4;
        return {
          ...e,
          completedPracticalActivities: activities,
          practicalCompleted: isAllActivitiesDone
        };
      }
      return e;
    });
    setStorageItem(STORAGE_KEYS.ENROLLMENTS, updated);
  },

  checkCertificateEligibility(enrollment: Enrollment): { eligible: boolean; status: CertificateStatus; reason?: string } {
    const role = JOB_ROLES.find(r => r.id === enrollment.roleId);
    const totalModules = role?.modules?.length || 4;
    const modulesComplete = (enrollment.completedModules?.length || 0) >= totalModules;
    
    // Check existing certificate
    const existingCert = this.getCertificates().find(c => c.enrollmentId === enrollment.id || c.id === enrollment.certificateId);
    if (existingCert) {
      return { eligible: true, status: 'issued' };
    }

    if (!modulesComplete) {
      return { eligible: false, status: 'locked', reason: 'Complete all curriculum learning modules first.' };
    }

    const isProOrPractical = enrollment.plan === 'pro' || enrollment.practicalPurchased;
    if (isProOrPractical) {
      const practicalCount = enrollment.completedPracticalActivities?.length || 0;
      if (practicalCount < 4 && !enrollment.practicalCompleted) {
        return { eligible: false, status: 'locked', reason: 'Complete all 4 practical training simulation activities.' };
      }
    }

    if (!enrollment.assessmentPassed) {
      return { eligible: false, status: 'locked', reason: 'Pass the final scenario assessment with ≥ 70%.' };
    }

    return { eligible: true, status: 'eligible' };
  },

  recordAssessmentResult(enrollmentId: string, score: number, passed: boolean): void {
    const enrollments = this.getEnrollments();
    const updated = enrollments.map(e => {
      if (e.id === enrollmentId) {
        const attempts = (e.assessmentAttempts || 0) + 1;
        const isPassed = passed;
        const certId = isPassed && !e.certificateId ? `SG-CERT-${Math.floor(100000 + Math.random() * 900000)}` : e.certificateId;
        return {
          ...e,
          assessmentAttempts: attempts,
          assessmentScore: score,
          assessmentPassed: isPassed,
          certificateEligible: isPassed,
          isCompleted: isPassed ? true : e.isCompleted,
          certificateId: certId,
          completionDate: isPassed ? (e.completionDate || new Date().toISOString().split('T')[0]) : e.completionDate
        };
      }
      return e;
    });
    setStorageItem(STORAGE_KEYS.ENROLLMENTS, updated);

    if (passed) {
      const record = updated.find(e => e.id === enrollmentId);
      if (record) {
        this.generateCertificate(record);
      }
    }
  },

  generateCertificate(enrollment: Enrollment): CertificateRecord {
    const certs = getStorageItem<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, []);
    
    // Check if certificate already exists for this enrollment
    const existing = certs.find(c => c.enrollmentId === enrollment.id || (enrollment.certificateId && c.id === enrollment.certificateId));
    if (existing) {
      return existing;
    }

    const role = JOB_ROLES.find(r => r.id === enrollment.roleId);
    const skill = SKILL_CATEGORIES.find(s => s.id === enrollment.skillId);
    const profile = this.getProfile();

    const scoreValues = Object.values(enrollment.quizScores);
    const avgScore = scoreValues.length ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) : 88;
    const finalScore = enrollment.assessmentScore || avgScore;
    const grade = finalScore >= 90 ? 'A+ (Distinction)' : finalScore >= 80 ? 'A (Excellent)' : 'B+ (Proficient)';
    
    const permanentId = enrollment.certificateId || `SG-CERT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCert: CertificateRecord = {
      id: permanentId,
      enrollmentId: enrollment.id,
      learnerId: profile.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      candidateName: profile.name || 'Learner',
      skillId: enrollment.skillId,
      skillCategory: skill?.name || 'Logistics & Supply Chain',
      roleId: enrollment.roleId,
      roleTitle: role?.title || 'Warehouse Associate',
      plan: enrollment.plan,
      issueDate: enrollment.completionDate || new Date().toISOString().split('T')[0],
      grade,
      scoreAvg: finalScore,
      assessmentScore: finalScore,
      practicalCompleted: (enrollment.completedPracticalActivities?.length || 0) >= 4 || enrollment.practicalCompleted,
      verificationCode: `VERIFY-SG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      verificationStatus: 'valid',
      isValid: true
    };

    const updatedCerts = [newCert, ...certs.filter(c => c.id !== newCert.id)];
    setStorageItem(STORAGE_KEYS.CERTIFICATES, updatedCerts);
    return newCert;
  },

  getCertificates(): CertificateRecord[] {
    return getStorageItem<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, []);
  },

  verifyCertificate(codeOrId: string): CertificateRecord | null {
    const certs = this.getCertificates();
    const query = codeOrId.trim().toUpperCase();
    return certs.find(c => c.id.toUpperCase() === query || c.verificationCode.toUpperCase() === query) || null;
  },

  getRoleById(roleId: string) {
    return JOB_ROLES.find(r => r.id === roleId) || null;
  },

  getSkillById(skillId: string) {
    return SKILL_CATEGORIES.find(s => s.id === skillId) || null;
  },

  getEnrollmentProgress(enrollmentId: string): number {
    const enrollments = this.getEnrollments();
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) return 0;
    if (enrollment.isCompleted) return 100;
    const role = this.getRoleById(enrollment.roleId);
    if (!role || role.modules.length === 0) return 0;
    const completedCount = enrollment.completedModules.length;
    return Math.round((completedCount / role.modules.length) * 100);
  },

  getOrderHistory(): OrderRecord[] {
    return getStorageItem<OrderRecord[]>(STORAGE_KEYS.ORDER_HISTORY, []);
  }
};

export const cartStore = {
  getCart(): CartItem[] {
    return getStorageItem<CartItem[]>(STORAGE_KEYS.CART, []);
  },

  addToCart(item: CartItem): boolean {
    const cart = this.getCart();
    
    // Check if already in cart
    const exists = cart.some(i => i.id === item.id || (i.productId === item.productId && i.selectedPlan === item.selectedPlan));
    if (exists) {
      return false;
    }

    // Check if already purchased/enrolled
    if (item.productType === 'skill' && this.isSkillEnrolled(item.productId)) {
      return false;
    }
    if (item.productType === 'library' && this.isLibraryItemPurchased(item.productId)) {
      return false;
    }

    const updated = [...cart, item];
    setStorageItem(STORAGE_KEYS.CART, updated);
    return true;
  },

  removeFromCart(cartItemId: string): void {
    const cart = this.getCart();
    const updated = cart.filter(i => i.id !== cartItemId);
    setStorageItem(STORAGE_KEYS.CART, updated);
  },

  clearCart(): void {
    setStorageItem(STORAGE_KEYS.CART, []);
  },

  isInCart(productId: string, plan?: PlanType): boolean {
    const cart = this.getCart();
    return cart.some(i => {
      if (i.productId !== productId) return false;
      if (plan && i.selectedPlan) return i.selectedPlan === plan;
      return true;
    });
  },

  getPurchasedLibraryItemIds(): string[] {
    return getStorageItem<string[]>(STORAGE_KEYS.PURCHASED_LIBRARY, []);
  },

  getOrderHistory(): OrderRecord[] {
    return getStorageItem<OrderRecord[]>(STORAGE_KEYS.ORDER_HISTORY, []);
  },

  isLibraryItemPurchased(libraryItemId: string): boolean {
    const purchased = this.getPurchasedLibraryItemIds();
    return purchased.includes(libraryItemId);
  },

  isSkillEnrolled(roleId: string): boolean {
    const enrollments = enrollmentStore.getEnrollments();
    return enrollments.some(e => e.roleId === roleId);
  },

  isPurchased(productId: string, productType: ProductType): boolean {
    if (productType === 'skill') {
      return this.isSkillEnrolled(productId);
    }
    return this.isLibraryItemPurchased(productId);
  },

  checkoutOrder(paymentMethod: string = 'UPI'): {
    success: boolean;
    orderId: string;
    totalAmount: number;
    enrolledRoles: { roleId: string; skillId: string; plan: PlanType; title: string }[];
    purchasedModules: { id: string; title: string; price: number }[];
  } {
    const cart = this.getCart();
    if (cart.length === 0) {
      return {
        success: false,
        orderId: '',
        totalAmount: 0,
        enrolledRoles: [],
        purchasedModules: []
      };
    }

    const orderId = `SG-ORD-${Date.now().toString().slice(-6)}`;
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    const enrolledRoles: { roleId: string; skillId: string; plan: PlanType; title: string }[] = [];
    const purchasedModules: { id: string; title: string; price: number }[] = [];

    // Process Skills: create active enrollments
    cart.filter(item => item.productType === 'skill').forEach(item => {
      const plan = item.selectedPlan || 'pro';
      const skillId = item.skillId || 'logistics-supply-chain';
      enrollmentStore.createEnrollment(item.productId, skillId, plan);
      enrolledRoles.push({
        roleId: item.productId,
        skillId,
        plan,
        title: item.title
      });
    });

    // Process Library items: record purchased items
    const existingPurchased = this.getPurchasedLibraryItemIds();
    const newLibraryIds: string[] = [];

    cart.filter(item => item.productType === 'library').forEach(item => {
      newLibraryIds.push(item.productId);
      purchasedModules.push({
        id: item.productId,
        title: item.title,
        price: item.price
      });
    });

    if (newLibraryIds.length > 0) {
      const combined = Array.from(new Set([...existingPurchased, ...newLibraryIds]));
      setStorageItem(STORAGE_KEYS.PURCHASED_LIBRARY, combined);
    }

    // Save order record to order history repository
    const orderRecord: OrderRecord = {
      orderId,
      purchaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      totalAmount,
      paymentMethod: paymentMethod.toUpperCase(),
      items: cart.map(item => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        productType: item.productType,
        selectedPlan: item.selectedPlan,
        skillId: item.skillId,
        subtitle: item.subtitle
      }))
    };
    const existingOrders = this.getOrderHistory();
    setStorageItem(STORAGE_KEYS.ORDER_HISTORY, [orderRecord, ...existingOrders]);

    // Clear cart after successful checkout
    this.clearCart();

    return {
      success: true,
      orderId,
      totalAmount,
      enrolledRoles,
      purchasedModules
    };
  }
};

export function useCartState() {
  const [cart, setCart] = useState<CartItem[]>(() => cartStore.getCart());
  const [purchasedLibraryIds, setPurchasedLibraryIds] = useState<string[]>(() => cartStore.getPurchasedLibraryItemIds());

  useEffect(() => {
    const handleUpdate = () => {
      setCart(cartStore.getCart());
      setPurchasedLibraryIds(cartStore.getPurchasedLibraryItemIds());
    };

    window.addEventListener('skillgo_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('skillgo_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  const itemCount = cart.length;

  return {
    cart,
    itemCount,
    totalAmount,
    purchasedLibraryIds,
    addToCart: (item: CartItem) => cartStore.addToCart(item),
    removeFromCart: (id: string) => cartStore.removeFromCart(id),
    clearCart: () => cartStore.clearCart(),
    isInCart: (productId: string, plan?: PlanType) => cartStore.isInCart(productId, plan),
    isPurchased: (productId: string, productType: ProductType) => cartStore.isPurchased(productId, productType),
    isLibraryPurchased: (libId: string) => cartStore.isLibraryItemPurchased(libId),
    isSkillEnrolled: (roleId: string) => cartStore.isSkillEnrolled(roleId),
    checkoutOrder: (method?: string) => cartStore.checkoutOrder(method),
  };
}

export function useEnrollmentState() {
  const [activeEnrollment, setActiveEnrollment] = useState<Enrollment | null>(() => enrollmentStore.getActiveEnrollment());
  const [profile, setProfile] = useState<LearnerProfile>(() => enrollmentStore.getProfile());
  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => enrollmentStore.getCertificates());
  const [isRegistered, setIsRegistered] = useState<boolean>(() => enrollmentStore.isRegistered());

  useEffect(() => {
    const handleUpdate = () => {
      setActiveEnrollment(enrollmentStore.getActiveEnrollment());
      setProfile(enrollmentStore.getProfile());
      setCertificates(enrollmentStore.getCertificates());
      setIsRegistered(enrollmentStore.isRegistered());
    };

    window.addEventListener('skillgo_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('skillgo_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    activeEnrollment,
    profile,
    certificates,
    isRegistered,
    role: activeEnrollment ? JOB_ROLES.find(r => r.id === activeEnrollment.roleId) : null,
    skill: activeEnrollment ? SKILL_CATEGORIES.find(s => s.id === activeEnrollment.skillId) : null,
  };
}
