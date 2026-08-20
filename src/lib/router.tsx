import React, { createContext, useContext, useState, useEffect } from 'react';
import { enrollmentStore } from './enrollmentStore';

export type ScreenName =
  | 'home'
  | 'onboarding-details'
  | 'onboarding-otp'
  | 'choose-skill'
  | 'skill-detail'
  | 'role-detail'
  | 'choose-plan'
  | 'personal-details'
  | 'payment'
  | 'payment-success'
  | 'course-modules'
  | 'module-video'
  | 'module-quiz'
  | 'practical-training'
  | 'practical-payment'
  | 'practical-payment-success'
  | 'course-complete'
  | 'final-assessment'
  | 'certificate'
  | 'verify-certificate'
  | 'my-learning'
  | 'library'
  | 'growth-plan'
  | 'support'
  | 'careers'
  | 'profile';

export interface RouteState {
  screen: ScreenName;
  params?: Record<string, any>;
}

interface RouterContextType {
  currentRoute: RouteState;
  navigate: (screen: ScreenName, params?: Record<string, any>) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

const getInitialRouteState = (): RouteState => {
  return {
    screen: 'onboarding-details',
    params: {},
  };
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<RouteState[]>([getInitialRouteState()]);

  const currentRoute = history[history.length - 1] || { screen: 'home', params: {} };

  const navigate = (screen: ScreenName, params: Record<string, any> = {}) => {
    setHistory(prev => [...prev, { screen, params }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute.screen]);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
