import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import { CreditCard, User, Calendar, Lock, CheckCircle2, Shield, ChevronLeft, Zap, Crown } from "lucide-react";

const CheckoutDesktop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const planData = location.state || { plan: "pro", planName: "Pro", billingPeriod: "mes", price: "9,99", billingText: "mensual" };

  const [cardData, setCardData] = useState({ number: "1234 5678 9101 1234", holder: "Santiago Segura", expiry: "12 / 28", cvv: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const getChargeDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getSubscriptionEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    if (planData.billingPeriod === "mes") date.setMonth(date.getMonth() + 1);
    else date.setFullYear(date.getFullYear() + 1);
    return date.toISOString();
  };

  const getCurrentDate = () => {
    const date = new Date();
    const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const planFeatures = {
    pro: ["Hasta 4 rutinas", "Registro del peso corporal", "Rutinas predefinidas por nivel"],
    elite: ["Rutinas ilimitadas", "Registro del peso corporal", "Rutinas predefinidas por nivel", "Planificacion de mesociclos", "Chat directo con el entrenador"],
  };

  const handleCardInputChange = (field, value) => setCardData(prev => ({ ...prev, [field]: value }));

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(" ") : cleaned;
  };

  const handleCardNumberChange = (e) => handleCardInputChange("number", formatCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16)));

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) value = value.slice(0, 2) + " / " + value.slice(2, 4);
    handleCardInputChange("expiry", value);
  };

  const getLastFour = () => cardData.number.replace(/\s/g, "").slice(-4) || "····";
  const getCardBrand = () => "VISA";

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.from("users").update({ subscription_tier: planData.plan, subscription_ends_at: getSubscriptionEndDate() }).eq("id", user.id);
      if (error) { alert("Error al procesar el pago"); setIsProcessing(false); return; }
      const transactionId = "AUR-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      navigate("/paymentConfirmation", { state: { ...planData, cardLastFour: getLastFour(), paymentDate: getCurrentDate(), nextBillingDate: getChargeDate(), transactionId } });
    } catch { alert("Error inesperado"); setIsProcessing(false); }
  };

  const inputClass = (field) => `w-full bg-transparent border-b-2 outline-none font-subheading font-bold text-[15px] text-text-high py-2 transition-colors ${focusedField === field ? "border-primary" : "border-text-low/30"} placeholder-text-low/40`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Suscripcion</p>
          <h1 className="font-heading font-extrabold text-[28px] text-text-high">Confirmar pago</h1>
        </div>
      </div>

      <div className="flex-1 px-8 py-8 grid grid-cols-2 gap-10 max-w-5xl mx-auto w-full">

        {/* COLUMNA IZQUIERDA — PAGO */}
        <div className="flex flex-col gap-6">

          {/* PREVIEW TARJETA */}
          <div>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">Metodo de pago</p>
            <div className="w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md flex items-center justify-center">
                  <div className="w-6 h-4 bg-yellow-200/40 rounded-sm" />
                </div>
                <span className="text-white/80 text-xl font-heading font-extrabold tracking-widest italic">{getCardBrand()}</span>
              </div>
              <div className="mb-6">
                <div className="flex gap-4 text-white text-lg font-mono tracking-widest">
                  <span>····</span><span>····</span><span>····</span>
                  <span className="text-white/70">{getLastFour()}</span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Titular</p>
                  <p className="text-white text-[13px] font-subheading font-bold tracking-wide uppercase">{cardData.holder || "NOMBRE TITULAR"}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Expira</p>
                  <p className="text-white text-[13px] font-subheading font-bold">{cardData.expiry || "MM / AA"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-5">Datos de la tarjeta</p>
            <div className="flex flex-col gap-5">
              <div>
                <label className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide">Numero de tarjeta</label>
                <div className="flex items-center gap-3 mt-1">
                  <CreditCard size={16} className="text-text-low shrink-0" />
                  <input type="text" placeholder="1234 5678 9101 1234" className={inputClass("number")} value={cardData.number} onChange={handleCardNumberChange} onFocus={() => setFocusedField("number")} onBlur={() => setFocusedField(null)} maxLength={19} />
                </div>
              </div>
              <div>
                <label className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide">Nombre del titular</label>
                <div className="flex items-center gap-3 mt-1">
                  <User size={16} className="text-text-low shrink-0" />
                  <input type="text" placeholder="Como aparece en la tarjeta" className={inputClass("holder")} value={cardData.holder} onChange={(e) => handleCardInputChange("holder", e.target.value)} onFocus={() => setFocusedField("holder")} onBlur={() => setFocusedField(null)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide">Caducidad</label>
                  <div className="flex items-center gap-3 mt-1">
                    <Calendar size={16} className="text-text-low shrink-0" />
                    <input type="text" placeholder="MM / AA" className={inputClass("expiry")} value={cardData.expiry} onChange={handleExpiryChange} onFocus={() => setFocusedField("expiry")} onBlur={() => setFocusedField(null)} maxLength={7} />
                  </div>
                </div>
                <div>
                  <label className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide flex items-center gap-1">CVV <Lock size={10} /></label>
                  <div className="flex items-center gap-3 mt-1">
                    <Lock size={16} className="text-text-low shrink-0" />
                    <input type="password" placeholder="···" className={inputClass("cvv")} value={cardData.cvv} onChange={(e) => handleCardInputChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))} onFocus={() => setFocusedField("cvv")} onBlur={() => setFocusedField(null)} maxLength={3} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* SEGURIDAD */}
          <div className="flex items-center gap-3 text-text-low">
            <Shield size={16} className="text-accent3 shrink-0" />
            <p className="font-body text-[12px]">Pago cifrado SSL 256-bit. Tus datos estan protegidos.</p>
          </div>
        </div>

        {/* COLUMNA DERECHA — RESUMEN */}
        <div className="flex flex-col gap-5">

          {/* PLAN */}
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">Tu plan</p>
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-14 w-14 rounded-2xl ${planData.plan === "pro" ? "bg-orange-bg2" : "bg-surface"} flex items-center justify-center shrink-0`}>
                {planData.plan === "pro" ? <Zap size={28} className="text-orange" /> : <Crown size={28} className="text-primary" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-heading font-extrabold text-[22px] text-text-high">Plan {planData.planName}</p>
                  {planData.plan === "pro" && <span className="bg-yellow-bg2 border border-orange rounded-full px-2 py-0.5 text-[11px] text-orange font-subheading font-semibold">Mas popular</span>}
                </div>
                <div className="flex gap-2">
                  <span className="bg-primary-bg border border-primary rounded-full px-2.5 py-0.5 text-[12px] text-primary font-subheading font-semibold">{planData.billingText === "mensual" ? "Mensual" : "Anual"}</span>
                  <span className="bg-accent2-bg2 border border-accent2 rounded-full px-2.5 py-0.5 text-[12px] text-accent2 font-subheading font-semibold">7 dias gratis</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {planFeatures[planData.plan].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-green shrink-0" />
                  <span className="font-body text-[14px] text-text-high">{f}</span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-text-low/20 my-4" />

            {/* DESGLOSE PRECIO */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-body text-[14px] text-text-low">Plan {planData.planName} {planData.billingText}</p>
                <p className="font-subheading font-bold text-[14px] text-text-high">{planData.price} €</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-body text-[14px] text-text-low">Prueba gratuita (7 dias)</p>
                <p className="font-subheading font-bold text-[14px] text-accent2">-{planData.price} €</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-body text-[14px] text-text-low">IVA (21%)</p>
                <p className="font-body text-[14px] text-text-low">Incluido</p>
              </div>
              <div className="w-full h-px bg-text-low/20" />
              <div className="flex items-center justify-between">
                <p className="font-heading font-bold text-[18px] text-text-high">Hoy pagas</p>
                <p className="font-heading font-extrabold text-[22px] text-accent3">0,00 €</p>
              </div>
            </div>
          </Card>

          {/* INFO */}
          <p className="font-body text-[13px] text-text-low text-center leading-relaxed">
            Al confirmar aceptas los <span className="text-primary">Terminos de uso</span> y la <span className="text-primary">Politica de privacidad.</span> Se te cobrara <span className="text-text-high">{planData.price}€</span> el <span className="text-text-high">{getChargeDate()}</span> salvo que canceles antes del fin del periodo de prueba.
          </p>

          {/* CTA */}
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl font-heading font-bold text-[16px] text-text-high flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #f5a623, #ff6b9d)" }}
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
            ) : (
              <>
                <CheckCircle2 size={18} />
                Confirmar pago
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-4">
            {["VISA", "MC", "AMEX"].map(b => (
              <span key={b} className="bg-surf border border-text-low/20 rounded-lg px-3 py-1.5 font-heading font-bold text-[11px] text-text-low">{b}</span>
            ))}
            <div className="flex items-center gap-1.5 text-text-low">
              <Shield size={14} />
              <span className="font-body text-[12px]">SSL seguro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDesktop;