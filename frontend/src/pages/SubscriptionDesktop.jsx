import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { CheckCircle2, X, Crown, ChevronLeft, CreditCard } from "lucide-react";
import { PRICES, PLAN_FEATURES, getButtonText, getButtonSubtext, handleActivatePlan } from "../utils/subscriptionUtils";

const CheckIcon = () => (
  <div className="w-4.5 h-4.5 rounded-[5px] bg-green flex items-center justify-center shrink-0">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent3"><polyline points="20 6 9 17 4 12" /></svg>
  </div>
);

const CrossIcon = () => (
  <div className="w-4.5 h-4.5 rounded-[5px] bg-background flex items-center justify-center shrink-0">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-text-low"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  </div>
);

const PLANS = [
  {
    key: "free",
    name: "Free",
    icon: "🌱",
    iconBg: "bg-text-low/8",
    badge: null,
    selectedColor: "text-primary",
    radioBorder: "border-primary bg-primary",
    priceMain: "0",
    priceDec: null,
    priceSub: "Para siempre · Sin tarjeta",
  },
  {
    key: "pro",
    name: "Pro",
    icon: "⚡",
    iconBg: "bg-orange-bg2",
    badge: { text: "Mas popular", style: "bg-yellow-bg2 border border-orange text-orange" },
    selectedColor: "text-orange",
    radioBorder: "border-orange bg-orange",
    priceKey: "pro",
  },
  {
    key: "elite",
    name: "Elite",
    icon: "👑",
    iconBg: "bg-surface",
    badge: null,
    selectedColor: "text-primary",
    radioBorder: "border-primary bg-primary",
    priceKey: "elite",
  },
];

const PlanCard = ({ plan, billingPeriod, selectedPlan, setSelectedPlan }) => {
  const isSelected = selectedPlan === plan.key;
  const features = PLAN_FEATURES[plan.key];
  const priceStr = plan.priceKey ? PRICES[plan.priceKey][billingPeriod] : null;

  return (
    <div
      onClick={() => setSelectedPlan(plan.key)}
      className={`bg-surf border rounded-2xl p-5 cursor-pointer transition-all flex flex-col gap-3 ${isSelected ? "border-primary shadow-lg shadow-primary/10" : "border-text-low/30 hover:border-text-low"}`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl ${plan.iconBg} flex items-center justify-center text-[18px]`}>{plan.icon}</div>
          <p className="font-heading font-extrabold text-[18px] text-text-high">{plan.name}</p>
        </div>
        {plan.badge && <span className={`${plan.badge.style} rounded-full px-3 py-0.5 text-[13px] font-subheading font-semibold`}>{plan.badge.text}</span>}
        {isSelected && !plan.badge && <span className="border border-text-low rounded-full px-3 py-0.5 text-[13px] text-text-low font-subheading font-semibold">Activo</span>}
      </div>

      {/* PRECIO */}
      <div className="flex items-end gap-1">
        {plan.priceKey ? (
          <>
            <span className="font-heading font-extrabold text-[32px] text-text-high leading-none">{priceStr?.split(",")[0]}</span>
            <span className="font-subheading font-semibold text-base text-text-low mb-0.5">,{priceStr?.split(",")[1]} €</span>
          </>
        ) : (
          <>
            <span className="font-heading font-extrabold text-[32px] text-text-high leading-none">0</span>
            <span className="font-subheading font-semibold text-base text-text-low mb-0.5">€</span>
          </>
        )}
      </div>
      <p className="text-[13px] text-text-low font-body">
        {plan.priceKey
          ? billingPeriod === "mes" ? "Por mes · cancela cuando quieras" : "Por mes · Facturado anualmente"
          : "Para siempre · Sin tarjeta"}
      </p>

      <div className="w-full h-px bg-text-low/30" />

      {/* FEATURES */}
      <div className="flex flex-col gap-2">
        {features.map((f, i) => (
          <div key={i} className={`flex items-center gap-2.5 ${!f.included ? "opacity-50" : ""}`}>
            {f.included ? <CheckIcon /> : <CrossIcon />}
            <span className={`font-subheading font-bold text-[14px] ${f.included ? "text-text-high" : "text-text-low line-through"}`}>{f.label}</span>
          </div>
        ))}
      </div>

      <div className="w-full h-px bg-text-low/30" />

      {/* RADIO */}
      <div className="flex gap-2 items-center">
        <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center ${isSelected ? plan.radioBorder : "border-text-low"}`}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <span className={`font-subheading font-bold text-[14px] ${isSelected ? plan.selectedColor : "text-text-low"}`}>
          {isSelected ? "Seleccionado" : `Seleccionar ${plan.name}`}
        </span>
      </div>
    </div>
  );
};

const SubscriptionDesktop = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState("mes");
  const [selectedPlan, setSelectedPlan] = useState("free");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Perfil</p>
          <h1 className="font-heading font-extrabold text-[28px] text-text-high">Suscripcion y pagos</h1>
        </div>
      </div>

      <div className="flex-1 px-8 py-6 grid grid-cols-4 gap-6">

        {/* COLUMNA IZQUIERDA — HERO + BILLING TOGGLE */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-4 py-6">
            <span className="bg-yellow-bg3 h-24 w-24 rounded-3xl border border-yellow flex items-center justify-center">
              <Crown size={48} className="text-yellow" />
            </span>
            <p className="font-heading font-extrabold text-[22px] text-text-high leading-tight text-center">
              Desbloquea tu
              <span className="block bg-linear-to-r from-orange to-orange-bg3 bg-clip-text text-transparent">potencial completo</span>
            </p>
            <p className="font-body text-[13px] text-text-low text-center">Elige un plan y accede a todas las funciones de FYLIOS.</p>
          </div>

          {/* BILLING TOGGLE */}
          <div className="bg-surf rounded-2xl border border-text-low p-1.5 flex">
            <button onClick={() => setBillingPeriod("mes")} className={`flex-1 py-2 rounded-xl font-subheading font-bold text-[14px] transition-all ${billingPeriod === "mes" ? "bg-surface text-text-high shadow-md" : "text-text-low"}`}>Mensual</button>
            <button onClick={() => setBillingPeriod("annual")} className={`flex-1 py-2 rounded-xl font-subheading font-bold text-[14px] transition-all ${billingPeriod === "annual" ? "bg-surface text-text-high shadow-md" : "text-text-low"}`}>
              Anual <span className="inline-flex bg-accent2-bg2 border border-accent2 rounded-full px-1.5 text-[11px] text-accent2 ml-1">-40%</span>
            </button>
          </div>

          {/* PAGO SEGURO */}
          <div className="flex text-center  flex-col gap-2">
            <div className="flex gap-1.5 flex-wrap items-center justify-center">
              <span className="bg-text-low/8 border border-text-low rounded-full px-3 py-0.5 text-[12px] text-text-low font-body">💳 Tarjeta</span>
              <span className="bg-text-low/8 border border-text-low rounded-full px-3 py-0.5 text-[12px] text-text-low font-body">🍎 Apple Pay</span>
              <span className="bg-text-low/8 border border-text-low rounded-full px-3 py-0.5 text-[12px] text-text-low font-body">🌐 Google Pay</span>
            </div>
            <p className="font-body text-[11px] text-text-low">🔒 Pago 100% seguro. Cancela cuando quieras</p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2">
            <Button variant="outlined" text={getButtonText(selectedPlan)} bgColor="bg-orange" textColor="text-text-high" borderColor="border-orange" w="w-full" onClick={() => handleActivatePlan(selectedPlan, billingPeriod, navigate)} />
            <p className="text-center text-[11px] text-text-low font-light">{getButtonSubtext(selectedPlan)}</p>
            <button onClick={() => navigate("/subscriptionDetails")} className="font-body text-[12px] text-text-low underline underline-offset-2 text-center">Por ahora no, ver mis datos</button>
          </div>
        </div>

        {/* COLUMNA PLANES — 3 columnas */}
        <div className="col-span-3 grid grid-cols-3 gap-4">
          {PLANS.map(plan => (
            <PlanCard key={plan.key} plan={plan} billingPeriod={billingPeriod} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDesktop;