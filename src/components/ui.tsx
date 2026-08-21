import React from 'react';
import { LucideIcon, CheckCircle2, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export function SkillGoLogo({ 
  className = "", 
  onClick,
  size = "md",
  theme = "dark"
}: { 
  className?: string; 
  onClick?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  theme?: "dark" | "light";
}) {
  const sizeStyles = {
    sm: "text-sm sm:text-base tracking-[0.16em]",
    md: "text-base sm:text-lg tracking-[0.20em]",
    lg: "text-lg sm:text-xl tracking-[0.22em]",
    xl: "text-xl sm:text-2xl tracking-[0.24em]",
    "2xl": "text-2xl sm:text-4xl tracking-[0.26em]",
  };

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center cursor-pointer select-none ${className}`}
      id="skillgo-brand-logo"
    >
      <span 
        className={`font-bold uppercase leading-none ${sizeStyles[size]} ${theme === 'light' ? 'text-white' : 'text-black'}`}
        style={{
          fontFamily: "'Syncopate', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontWeight: 700,
        }}
      >
        SKILLGO
      </span>
    </div>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconRight: IconRight,
  onClick,
  disabled = false,
  type = 'button',
  id
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'blue' | 'orange' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
}) {
  const base = "inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl active:scale-[0.98]";
  
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 shadow-sm"
  };

  const variants = {
    primary: "bg-[#0B192C] hover:bg-[#1E293B] active:bg-[#07101C] text-white shadow-sm",
    secondary: "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800",
    blue: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20",
    orange: "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-sm shadow-orange-500/20",
    outline: "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300",
    ghost: "bg-transparent hover:bg-slate-100/80 active:bg-slate-200/80 text-slate-700 hover:text-slate-900",
    emerald: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm shadow-emerald-600/20"
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizeClasses[size]} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className={size === 'sm' ? "w-3.5 h-3.5" : size === 'lg' ? "w-5 h-5" : "w-4 h-4"} />}
      <span>{children}</span>
      {IconRight && <IconRight className={size === 'sm' ? "w-3.5 h-3.5" : size === 'lg' ? "w-5 h-5" : "w-4 h-4"} />}
    </button>
  );
}

export function Badge({
  children,
  variant = 'default',
  className = ''
}: {
  children: React.ReactNode;
  variant?: 'default' | 'orange' | 'blue' | 'emerald' | 'purple' | 'slate' | 'pro' | 'lite' | 'soft-blue';
  className?: string;
}) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    'soft-blue': "bg-blue-100/90 text-blue-700 border-blue-200/50 font-semibold",
    blue: "bg-blue-50 text-blue-700 border-blue-200/60 font-medium",
    orange: "bg-orange-50 text-orange-700 border-orange-200/60 font-medium",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60 font-medium",
    purple: "bg-purple-50 text-purple-700 border-purple-200/60 font-medium",
    slate: "bg-slate-900 text-white border-transparent font-medium",
    pro: "bg-[#0B192C] text-white border-transparent font-semibold shadow-2xs",
    lite: "bg-slate-100 text-slate-800 border-slate-300 font-semibold"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border whitespace-nowrap tracking-tight ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({
  children,
  className = '',
  hover = false,
  onClick,
  id
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  id?: string;
}) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-2xs transition-all duration-200 ${
        hover ? 'hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function ProgressBar({
  value = 0,
  max = 100,
  className = '',
  color = 'blue'
}: {
  value: number;
  max?: number;
  className?: string;
  color?: 'blue' | 'orange' | 'emerald';
}) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const colors = {
    blue: 'bg-blue-600',
    orange: 'bg-orange-500',
    emerald: 'bg-emerald-600'
  };

  return (
    <div className={`w-full bg-slate-100 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${colors[color]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl'
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className={`bg-white rounded-2xl shadow-2xl border border-slate-100 w-full ${maxWidth} overflow-hidden max-h-[90vh] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
