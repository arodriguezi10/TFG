export const PRICES = {
  pro: { mes: "9,99", annual: "5,99" },
  elite: { mes: "19,99", annual: "11,99" },
};

export const PLAN_NAMES = { free: "Free", pro: "Pro", elite: "Elite" };

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

export const getButtonText = (selectedPlan) => {
  if (selectedPlan === "free") return "Continuar con Free";
  return `Activar plan ${PLAN_NAMES[selectedPlan]}`;
};

export const getButtonSubtext = (selectedPlan) => {
  if (selectedPlan === "free") return "Sin coste · Siempre gratis";
  return "Prueba 7 dias gratis · Sin compromiso";
};

export const handleActivatePlan = (selectedPlan, billingPeriod, navigate) => {
  if (selectedPlan === "free") { alert("Ya estas en el plan Free"); return; }
  navigate("/checkout", {
    state: {
      plan: selectedPlan,
      planName: PLAN_NAMES[selectedPlan],
      billingPeriod,
      price: PRICES[selectedPlan][billingPeriod],
      billingText: billingPeriod === "mes" ? "mensual" : "anual",
    },
  });
};