import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Header from "../components/Header";
import Button from "../components/Button";
import { CreditCard, User, Calendar, Lock, CheckCircle2 } from "lucide-react";

const CheckoutMobile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const planData = location.state || { plan: "pro", planName: "Pro", billingPeriod: "mes", price: "9,99", billingText: "mensual" };

  const [cardData, setCardData] = useState({ number: "1234 5678 9101 1234", holder: "Santiago Segura", expiry: "12 / 28", cvv: "123" });
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
    elite: ["Hasta 4 rutinas", "Registro del peso corporal", "Rutinas predefinidas por nivel", "Planificacion de mesociclos", "Chat directo con el entrenador"],
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

  const getLastFour = () => cardData.number.slice(-4);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.from("users").update({ subscription_tier: planData.plan, subscription_ends_at: getSubscriptionEndDate() }).eq("id", user.id);
      if (error) { alert("Error al procesar el pago"); setIsProcessing(false); return; }
      const transactionId = "AUR-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      navigate("/paymentConfirmation", { state: { ...planData, cardLastFour: getLastFour(), paymentDate: getCurrentDate(), nextBillingDate: getChargeDate(), transactionId } });
    } catch { alert("Error inesperado"); setIsProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <section className="w-full"><Header showback subtitle="suscripcion" title="Confirmar pago" /></section>

      <section className="mx-5 pt-5 flex flex-col gap-3">
        <p className="font-subheading font-bold text-[16px] text-text-low">TU PLAN</p>
        <Card>
          <div className="flex flex-col gap-3.5">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className={`w-10 h-12.5 rounded-[10px] ${planData.plan === "pro" ? "bg-orange-bg2" : "bg-surface"} flex items-center justify-center text-[17px]`}>
                  {planData.plan === "pro" ? "⚡" : "👑"}
                </div>
                <div className="flex flex-col gap-1.5">
                  {planData.plan === "pro" && <span className="bg-yellow-bg2 border border-orange rounded-full px-3.5 py-0.5 text-[16px] text-orange font-subheading font-semibold">Mas popular</span>}
                  <p className="font-heading font-extrabold text-[17px] text-text-high">{planData.planName}</p>
                </div>
              </div>
              <p className="font-heading font-extrabold text-[17px] text-text-high flex flex-col items-end">
                {planData.price}<br /><span>€</span><span className="font-body font-normal text-[16px] text-text-low">al mes</span>
              </p>
            </div>
            <div className="flex items-end gap-3">
              <span className="bg-primary-bg border border-primary rounded-full px-3.5 py-0.5 text-[16px] text-primary font-subheading font-semibold">{planData.billingText === "mensual" ? "Mensual" : "Anual"}</span>
              <span className="bg-accent2-bg2 border border-accent2 rounded-full px-3.5 py-0.5 text-[16px] text-accent2 font-subheading font-semibold">7 dias gratis</span>
            </div>
            <div className="w-full h-px bg-text-low mb-1.5" />
            <div className="flex flex-col gap-2">
              {planFeatures[planData.plan].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-green shrink-0" />
                  <span className="font-subheading font-bold text-[16px] text-text-high">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {!isEditingCard && (
        <section className="mx-5 pt-5 flex flex-col gap-3">
          <p className="font-subheading font-bold text-[16px] text-text-low">METODO DE PAGO</p>
          <div className="w-full bg-linear-to-br from-surf to-surface rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 bg-linear-to-br from-orange to-accent2/70 rounded-lg flex items-center justify-center">
                <CreditCard size={24} color="white" />
              </div>
              <span className="text-white text-2xl font-heading font-extrabold tracking-wider">VISA</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between gap-3 text-white text-xl font-mono tracking-widest">
                <span>····</span><span>····</span><span>····</span><span className="text-white/60">{getLastFour()}</span>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="font-subheading font-bold text-white/50 text-[12px] uppercase tracking-wider mb-1">Titular</p>
                <p className="text-white text-sm font-subheading font-bold tracking-wide uppercase">{cardData.holder}</p>
              </div>
              <div className="text-right">
                <p className="font-subheading font-bold text-white/50 text-[12px] uppercase tracking-wider mb-1">Expira</p>
                <p className="text-white text-sm font-subheading font-bold tracking-wide">{cardData.expiry}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <button onClick={() => setIsEditingCard(true)} className="flex items-center gap-2 text-accent1 text-sm font-medium hover:text-accent1/80 transition-colors">
                Cambiar tarjeta
              </button>
            </div>
          </div>
        </section>
      )}

      {isEditingCard && (
        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
          <p className="font-subheading font-bold text-[16px] text-text-low">DATOS DE PAGO</p>
          <Card>
            <div className="flex flex-col gap-3.75">
              <div className="flex flex-col gap-1.25">
                <label className="font-subheading font-bold text-[14px] text-text-low uppercase">NUMERO DE LA TARJETA</label>
                <div className="flex items-center gap-5">
                  <CreditCard size={20} className="text-text-low shrink-0" />
                  <input type="text" placeholder="1234 5678 9101 1234" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" value={cardData.number} onChange={handleCardNumberChange} maxLength={19} />
                </div>
              </div>
              <div className="w-full h-px bg-text-low" />
              <div className="flex flex-col gap-1.25">
                <label className="font-subheading font-bold text-[14px] text-text-low uppercase">NOMBRE DEL TITULAR</label>
                <div className="flex items-center gap-5">
                  <User size={20} className="text-text-low shrink-0" />
                  <input type="text" placeholder="Como aparece en la tarjeta" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" value={cardData.holder} onChange={(e) => handleCardInputChange("holder", e.target.value)} />
                </div>
              </div>
              <div className="w-full h-px bg-text-low" />
              <div className="flex items-center justify-between gap-6.25">
                <div className="flex flex-col gap-1.25">
                  <label className="font-subheading font-bold text-[14px] text-text-low uppercase">CADUCIDAD</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-text-low shrink-0" />
                    <input type="text" placeholder="MM / AA" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" value={cardData.expiry} onChange={handleExpiryChange} maxLength={7} />
                  </div>
                </div>
                <div className="w-px h-12.5 bg-text-low" />
                <div className="flex flex-col gap-1.25">
                  <label className="font-subheading font-bold text-[14px] text-text-low uppercase flex items-center gap-1">CVV <Lock size={12} /></label>
                  <input type="text" placeholder="123" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" value={cardData.cvv} onChange={(e) => handleCardInputChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))} maxLength={3} />
                </div>
              </div>
              <button onClick={() => setIsEditingCard(false)} className="mt-2 w-full py-2 bg-primary rounded-lg text-text-high font-subheading font-bold text-[14px] hover:bg-primary/80 transition-colors">Guardar tarjeta</button>
            </div>
          </Card>
        </section>
      )}

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <p className="font-subheading font-bold text-[16px] text-text-low">RESUMEN DE LA SUSCRIPCION</p>
        <Card>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <p className="font-subheading font-bold text-[16px] text-text-low">Plan {planData.planName} {planData.billingText}</p>
              <p className="font-subheading font-bold text-[16px] text-text-high">{planData.price} €</p>
            </div>
            <div className="w-full h-px bg-text-low" />
            <div className="flex items-center justify-between">
              <p className="font-subheading font-bold text-[16px] text-text-low">Prueba gratuita (7 dias)</p>
              <p className="font-subheading font-bold text-[16px] text-accent2">-{planData.price} €</p>
            </div>
            <div className="w-full h-px bg-text-low" />
            <div className="flex items-center justify-between">
              <p className="font-subheading font-bold text-[16px] text-text-low">IVA (21%)</p>
              <p className="font-body text-[16px] text-text-low">Incluido</p>
            </div>
            <div className="-mx-4 -mb-5.75 mt-3 bg-yellow-bg3 rounded-b-2xl px-3.5 py-2.5 flex items-center justify-between border border-yellow/27">
              <p className="font-heading font-semibold text-[20px] text-text-high">Hoy pagas</p>
              <p className="font-heading font-extrabold text-[18px] text-accent3">0,00 €</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-5.5 pb-5">
        <p className="font-body text-[14px] text-text-low text-center px-4">
          Al confirmar aceptas los <span className="text-primary">Terminos de uso</span> y la <span className="text-primary">Politica de privacidad.</span> Se te cobrara <span className="text-text-high">{planData.price}€</span> el <span className="text-text-high">{getChargeDate()}</span> salvo que canceles antes.
        </p>
      </section>

      <div className="w-full px-4 fixed bottom-1">
        <Button variant="outlined" text={isProcessing ? "Procesando..." : "Confirmar pago"} bgColor="bg-orange" textColor="text-text-high" borderColor="border-orange" w="w-[100%]" onClick={handleConfirmPayment} disabled={isProcessing} />
        <p className="text-center mt-2 text-[11px] text-text-low font-light">Pago cifrado SSL · Sin compromiso</p>
      </div>
    </div>
  );
};

export default CheckoutMobile;