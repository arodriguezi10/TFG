import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Header from "../components/Header";
import Button from "../components/Button";
import { CheckCircle2, X, CreditCard, Crown } from "lucide-react";
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

const RadioDot = ({ selected, color = "border-primary bg-primary" }) => (
  <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center ${selected ? color : "border-text-low"}`}>
    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
  </div>
);

const SubscriptionMobile = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState("mes");
  const [selectedPlan, setSelectedPlan] = useState("free");

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <section className="w-full">
        <Header showback subtitle="perfil" title="Suscripcion y pagos" />
      </section>

      <section className="mt-6.25 flex flex-col items-center justify-center gap-3.75">
        <span className="bg-yellow-bg3 h-27.5 w-27.5 px-2.5 rounded-[35px] border border-yellow font-heading font-bold text-[50px] text-yellow flex items-center justify-center">
          <Crown size={50} className="text-yellow" />
        </span>
        <span className="items-center bg-text-low/8 border border-text-low rounded-full px-3.5 py-0.5 text-[16px] text-text-low font-subheading font-semibold">Sin plan activo</span>
        <p className="font-heading font-extrabold text-[28px] text-text-high leading-tight flex flex-col items-center text-center">
          Desbloquea tu
          <span className="bg-linear-to-r from-orange to-orange-bg3 bg-clip-text text-transparent">potencial</span>
          <span className="bg-linear-to-l from-accent1 to-accent1-bg1 bg-clip-text text-transparent">completo</span>
        </p>
        <p className="font-subheading text-[16px] p-4 text-text-low text-center">Actualmente estas en el plan gratuito. Elige un plan y accede a todas las funciones de FYLIOS.</p>
      </section>

      <section className="mt-2.5 mx-5 mb-5">
        <div className="bg-surf rounded-2xl border border-text-low p-1.5 flex">
          <button onClick={() => setBillingPeriod("mes")} className={`flex-1 py-2.5 rounded-2xl font-subheading font-bold text-[16px] transition-all duration-200 ${billingPeriod === "mes" ? "bg-surface text-text-high shadow-lg" : "text-text-low"}`}>Mensual</button>
          <button onClick={() => setBillingPeriod("annual")} className={`flex-1 py-2.5 rounded-[10px] font-subheading font-bold text-[16px] transition-all duration-200 ${billingPeriod === "annual" ? "bg-surface text-text-high shadow-lg" : "text-text-low"}`}>
            Anual <span className="inline-flex bg-accent2-bg2 border border-accent2 rounded-full px-1.5 text-[12px] text-accent2 ml-1">-40%</span>
          </button>
        </div>
      </section>

      <section className="mx-5 flex flex-col gap-3">
        {/* FREE */}
        <Card>
          <button onClick={() => setSelectedPlan("free")} className="w-full text-left">
            <div className="flex flex-col gap-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8.5 h-8.5 rounded-[10px] bg-text-low/8 flex items-center justify-center text-[17px]">🌱</div>
                  <p className="font-heading font-extrabold text-[17px] text-text-high">Free</p>
                </div>
                {selectedPlan === "free" && <span className="border border-text-low rounded-full px-3.5 py-0.5 text-[16px] text-text-low font-subheading font-semibold">Activo</span>}
              </div>
              <div className="flex items-end gap-1">
                <span className="font-heading font-extrabold text-[30px] text-text-high leading-none">0</span>
                <span className="font-subheading font-semibold text-base text-text-low mb-0.5">€</span>
              </div>
              <p className="text-[16px] text-text-low font-body mb-1.5">Para siempre · Sin tarjeta</p>
              <div className="w-full h-px bg-text-low mb-1.5" />
              <div className="flex flex-col gap-2">
                {PLAN_FEATURES.free.map((f, i) => (
                  <div key={i} className={`flex items-center gap-2.5 ${!f.included ? "opacity-50" : ""}`}>
                    {f.included ? <CheckIcon /> : <CrossIcon />}
                    <span className={`font-subheading font-bold text-[16px] ${f.included ? "text-text-high" : "text-text-low line-through"}`}>{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="w-full h-px bg-text-low mb-1.5" />
              <div className="flex gap-2">
                <RadioDot selected={selectedPlan === "free"} />
                <span className={`font-subheading font-bold text-[16px] ${selectedPlan === "free" ? "text-primary" : "text-text-low"}`}>{selectedPlan === "free" ? "Seleccionado" : "Seleccionar Free"}</span>
              </div>
            </div>
          </button>
        </Card>

        {/* PRO */}
        <Card>
          <button onClick={() => setSelectedPlan("pro")} className="w-full text-left">
            <div className="flex flex-col gap-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8.5 h-8.5 rounded-[10px] bg-orange-bg2 flex items-center justify-center text-[17px]">⚡</div>
                  <p className="font-heading font-extrabold text-[17px] text-text-high">Pro</p>
                </div>
                <span className="bg-yellow-bg2 border border-orange rounded-full px-3.5 py-0.5 text-[16px] text-orange font-subheading font-semibold">Mas popular</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="font-heading font-extrabold text-[30px] text-text-high leading-none">{PRICES.pro[billingPeriod].split(",")[0]}</span>
                <span className="font-subheading font-semibold text-base text-text-low mb-0.5">,{PRICES.pro[billingPeriod].split(",")[1]}</span>
              </div>
              <p className="text-[16px] text-text-low font-body mb-1.5">{billingPeriod === "mes" ? "Por mes · cancela cuando quieras" : "Por mes · Facturado anualmente"}</p>
              <div className="w-full h-px bg-text-low mb-1.5" />
              <div className="flex flex-col gap-2">
                {PLAN_FEATURES.pro.map((f, i) => (
                  <div key={i} className={`flex items-center gap-2.5 ${!f.included ? "opacity-50" : ""}`}>
                    {f.included ? <CheckIcon /> : <CrossIcon />}
                    <span className={`font-subheading font-bold text-[16px] ${f.included ? "text-text-high" : "text-text-low line-through"}`}>{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="w-full h-px bg-text-low mb-1.5" />
              <div className="flex gap-2">
                <RadioDot selected={selectedPlan === "pro"} color="border-orange bg-orange" />
                <span className={`font-subheading font-bold text-[16px] ${selectedPlan === "pro" ? "text-orange" : "text-text-low"}`}>{selectedPlan === "pro" ? "Seleccionado" : "Seleccionar Pro"}</span>
              </div>
            </div>
          </button>
        </Card>

        {/* ELITE */}
        <Card>
          <button onClick={() => setSelectedPlan("elite")} className="w-full text-left">
            <div className="flex flex-col gap-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8.5 h-8.5 rounded-[10px] bg-surface flex items-center justify-center text-[17px]">👑</div>
                  <p className="font-heading font-extrabold text-[17px] text-text-high">Elite</p>
                </div>
              </div>
              <div className="flex items-end gap-1">
                <span className="font-heading font-extrabold text-[30px] text-text-high leading-none">{PRICES.elite[billingPeriod].split(",")[0]}</span>
                <span className="font-subheading font-semibold text-base text-text-low mb-0.5">,{PRICES.elite[billingPeriod].split(",")[1]}</span>
              </div>
              <p className="text-[16px] text-text-low font-body mb-1.5">{billingPeriod === "mes" ? "Por mes · cancela cuando quieras" : "Por mes · Facturado anualmente"}</p>
              <div className="w-full h-px bg-text-low mb-1.5" />
              <div className="flex flex-col gap-2">
                {PLAN_FEATURES.elite.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckIcon />
                    <span className="font-subheading font-bold text-[16px] text-text-high">{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="w-full h-px bg-text-low mb-1.5" />
              <div className="flex gap-2">
                <RadioDot selected={selectedPlan === "elite"} />
                <span className={`font-subheading font-bold text-[16px] ${selectedPlan === "elite" ? "text-primary" : "text-text-low"}`}>{selectedPlan === "elite" ? "Seleccionado" : "Seleccionar Elite"}</span>
              </div>
            </div>
          </button>
        </Card>
      </section>

      <section className="mt-2.5 flex flex-col items-center justify-center gap-2">
        <div className="flex gap-1">
          <span className="bg-text-low/8 border border-text-low rounded-full px-3.5 py-0.5 text-[14px] text-text-low font-body">💳 Tarjeta</span>
          <span className="bg-text-low/8 border border-text-low rounded-full px-3.5 py-0.5 text-[14px] text-text-low font-body">🍎 Apple Pay</span>
          <span className="bg-text-low/8 border border-text-low rounded-full px-3.5 py-0.5 text-[14px] text-text-low font-body">🌐 Google Pay</span>
        </div>
        <p className="font-body text-[12px] text-text-low">🔒 Pago 100% seguro. Cancela cuando quieras</p>
      </section>

      <div className="w-full px-4 mt-2 text-center">
        <button onClick={() => navigate("/subscriptionDetails")} className="font-body text-[13px] text-text-low underline underline-offset-2">Por ahora no, ver mis datos</button>
      </div>

      <div className="w-full px-4 fixed bottom-1 gap-2.5">
        <Button variant="outlined" text={getButtonText(selectedPlan)} bgColor="bg-orange" textColor="text-text-high" borderColor="border-orange" w="w-[100%]" onClick={() => handleActivatePlan(selectedPlan, billingPeriod, navigate)} />
        <p className="text-center mt-2 text-[11px] text-text-low font-light">{getButtonSubtext(selectedPlan)}</p>
      </div>
    </div>
  );
};

export default SubscriptionMobile;