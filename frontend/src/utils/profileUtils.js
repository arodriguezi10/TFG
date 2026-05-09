import React from "react";
import { Crown, Star, Leaf, Flame, Zap, Dumbbell, Sparkles } from "lucide-react";

export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export const calculateTimeSince = (date) => {
  if (!date) return "Sin fecha";
  const past = new Date(date);
  const today = new Date();
  const diffTime = Math.abs(today - past);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  if (diffYears > 0) return `hace ${diffYears} ${diffYears === 1 ? 'ano' : 'anos'}`;
  if (diffMonths > 0) return `hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
  if (diffDays > 0) return `hace ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
  return "hoy";
};

export const formatWeight = (weight) => {
  if (!weight) return { integer: '--', decimal: '--' };
  const integerPart = Math.floor(weight);
  const decimalPart = ((weight % 1) * 100).toFixed(0).padStart(2, '0');
  return { integer: integerPart, decimal: decimalPart };
};

export const getBadgeByTier = (tier) => {
  switch (tier) {
    case 'elite':
      return { icon: React.createElement(Crown, { size: 14 }), text: 'Atleta Elite', bgColor: 'bg-accent1-bg1', borderColor: 'border-accent1', textColor: 'text-accent1' };
    case 'pro':
      return { icon: React.createElement(Star, { size: 14 }), text: 'Atleta Pro', bgColor: 'bg-primary-bg', borderColor: 'border-primary', textColor: 'text-primary' };
    default:
      return { icon: React.createElement(Leaf, { size: 14 }), text: 'Atleta Free', bgColor: 'bg-surf', borderColor: 'border-text-low', textColor: 'text-text-low' };
  }
};

export const getGoalIcon = (goal) => {
  switch (goal) {
    case 'Volumen': return React.createElement(Flame, { size: 14 });
    case 'Definicion': return React.createElement(Zap, { size: 14 });
    case 'Fuerza': return React.createElement(Dumbbell, { size: 14 });
    case 'Mantenimiento': return React.createElement(Sparkles, { size: 14 });
    default: return React.createElement(Flame, { size: 14 });
  }
};