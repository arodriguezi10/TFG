export const PLAN_PRICES = {
  free: { mes: 0, annual: 0 },
  pro: { mes: 9.99, annual: 5.99 },
  elite: { mes: 19.99, annual: 11.99 },
};

export const PLAN_FEATURES = {
  free: [
    { label: "Hasta 4 rutinas", included: true },
    { label: "Registro del peso corporal", included: true },
    { label: "Rutinas predefinidas por nivel", included: false },
    { label: "Planificacion de mesociclos", included: false },
    { label: "Chat directo con el entrenador", included: false },
  ],
  pro: [
    { label: "Hasta 4 rutinas", included: true },
    { label: "Registro del peso corporal", included: true },
    { label: "Rutinas predefinidas por nivel", included: true },
    { label: "Planificacion de mesociclos", included: false },
    { label: "Chat directo con el entrenador", included: false },
  ],
  elite: [
    { label: "Rutinas ilimitadas", included: true },
    { label: "Registro del peso corporal", included: true },
    { label: "Rutinas predefinidas por nivel", included: true },
    { label: "Planificacion de mesociclos", included: true },
    { label: "Chat directo con el entrenador", included: true },
  ],
};

export const getDaysRemaining = (endsAt) => {
  if (!endsAt) return null;
  const diff = Math.ceil((new Date(endsAt) - new Date()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

export const getStartDate = (endsAt) => {
  if (!endsAt) return null;
  const start = new Date(endsAt);
  start.setDate(start.getDate() - 30);
  return start;
};

export const getCycleProgress = (endsAt) => {
  if (!endsAt) return 0;
  const end = new Date(endsAt);
  const start = getStartDate(endsAt);
  const now = new Date();
  return Math.min(Math.max(((now - start) / (end - start)) * 100, 0), 100);
};

export const formatDate = (date) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
};

export const formatDateLong = (date) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
};

export const getPlanName = (tier) => ({ free: "Free", pro: "Pro", elite: "Elite" })[tier] || "Free";