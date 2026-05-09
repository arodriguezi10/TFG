import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Header from "../components/Header";
import Button from "../components/Button";
import { Leaf, Zap, Crown, CheckCircle2, X, CreditCard, Calendar, FileText, RefreshCw, ChevronRight } from "lucide-react";
import { PLAN_PRICES, PLAN_FEATURES, getDaysRemaining, getStartDate, getCycleProgress, formatDate, formatDateLong, getPlanName } from "../utils/subscriptionDetailsUtils";

const PLAN_CONFIG = {
  free: { label: "Plan Free", icon: <Leaf className="text-text-low" />, color: "text-text-low", borderColor: "border-text-low", bgColor: "bg-surf", accentColor: "text-text-low" },
  pro: { label: "Plan Pro", icon: <Zap className="text-orange" />, color: "text-orange", borderColor: "border-orange", bgColor: "bg-orange-bg2", accentColor: "text-orange" },
  elite: { label: "Plan Elite", icon: <Crown className="text-primary" />, color: "text-primary", borderColor: "border-primary", bgColor: "bg-primary-bg", accentColor: "text-primary" },
};

const SubscriptionDetailsMobile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadUserData(); }, [user]);

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase.from("users").select("first_name, subscription_tier, subscription_ends_at, stripe_id").eq("id", user.id).single();
      if (error) throw error;
      setUserData(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div></div>;

  const tier = userData?.subscription_tier || "free";
  const config = PLAN_CONFIG[tier];
  const features = PLAN_FEATURES[tier];
  const price = PLAN_PRICES[tier].mes;
  const endsAt = userData?.subscription_ends_at;
  const daysRemaining = getDaysRemaining(endsAt);
  const startDate = getStartDate(endsAt);
  const cycleProgress = getCycleProgress(endsAt);
  const daysActive = endsAt ? Math.max(0, 30 - (daysRemaining || 0)) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-10">
      <Header showback subtitle="Perfil" title="Suscripcion y pagos" onBackClick={() => navigate("/profile")} />

      <section className="mt-4 px-4">
        <p className="font-subheading font-bold text-text-low text-[16px] uppercase tracking-wide mb-3">Tu plan actual</p>
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-11 w-11 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>{config.icon}</div>
            <div className="flex-1">
              <span className={`font-subheading font-bold text-[16px] ${config.color} border ${config.borderColor} rounded-full px-2.5 py-0.5 uppercase tracking-wide`}>{config.label}</span>
              <p className="font-subheading font-extrabold text-[22px] text-text-high leading-none mt-1">{userData?.first_name || "Usuario"}</p>
            </div>
            <span className="flex items-center gap-1.5 bg-accent2/10 border border-accent2 rounded-full px-3 py-1 font-subheading font-bold text-[12px] text-accent2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent2 inline-block"></span>Activo
            </span>
          </div>

          {tier !== "free" && endsAt && (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="font-subheading text-[13px] text-text-low">Ciclo de facturacion</p>
                <p className={`font-subheading font-bold text-[13px] ${config.accentColor}`}>Quedan {daysRemaining} dias</p>
              </div>
              <div className="w-full h-2 bg-text-low/20 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all" style={{ width: `${cycleProgress}%`, background: tier === "pro" ? "linear-gradient(90deg, #f5a623, #ff6b9d)" : "linear-gradient(90deg, #6c63ff, #36d9b8)" }} />
              </div>
              <div className="flex justify-between mb-4">
                <p className="font-body text-[13px] text-text-low">{formatDate(startDate)}</p>
                <p className="font-body text-[13px] text-text-low">{formatDate(endsAt)}</p>
              </div>
            </>
          )}

          <div className="flex items-center justify-between bg-surf rounded-xl p-4">
            <div className="flex flex-col items-center gap-0.5">
              <p className="font-subheading font-extrabold text-[22px] text-text-high leading-none">{tier === "free" ? "0" : price.toFixed(2).replace(".", ",")}</p>
              <p className="font-subheading font-bold text-[12px] text-text-low uppercase">{tier === "free" ? "gratis" : "€ al mes"}</p>
            </div>
            <div className="w-px h-8 bg-text-low" />
            <div className="flex flex-col items-center gap-0.5">
              <p className="font-subheading font-extrabold text-[22px] text-text-high leading-none">{tier === "free" ? "∞" : (daysActive ?? "--")}</p>
              <p className="font-subheading font-bold text-[12px] text-text-low uppercase">{tier === "free" ? "para siempre" : "dias activo"}</p>
            </div>
            <div className="w-px h-8 bg-text-low" />
            <div className="flex flex-col items-center gap-0.5">
              <p className={`font-subheading font-extrabold text-[22px] leading-none ${config.accentColor}`}>{getPlanName(tier)}</p>
              <p className="font-subheading font-bold text-[12px] text-text-low uppercase">nivel</p>
            </div>
          </div>
        </Card>
      </section>

      {tier !== "free" && (
        <section className="mt-6 px-4">
          <p className="font-subheading font-bold text-text-low text-[16px] uppercase tracking-wide mb-3">Datos de facturacion</p>
          <Card>
            <button className="w-full flex items-center gap-4 py-1">
              <div className="h-10 w-10 rounded-xl bg-primary-bg border border-primary flex items-center justify-center shrink-0"><CreditCard size={18} className="text-primary" /></div>
              <div className="flex-1 text-left">
                <p className="font-subheading text-[14px] text-text-low">Metodo de pago</p>
                <p className="font-subheading font-bold text-[15px] text-text-high">{userData?.stripe_id ? "Visa ···· 4242" : "Sin metodo de pago"}</p>
              </div>
              <ChevronRight size={18} className="text-text-low" />
            </button>
            <div className="w-full h-px bg-text-low my-3" />
            <div className="w-full flex items-center gap-4 py-1">
              <div className="h-10 w-10 rounded-xl bg-primary-bg border border-primary flex items-center justify-center shrink-0"><Calendar size={18} className="text-primary" /></div>
              <div className="flex-1 text-left">
                <p className="font-body text-[14px] text-text-low">Proximo cobro</p>
                <p className="font-subheading font-bold text-[15px] text-text-high">{formatDateLong(endsAt)}</p>
              </div>
              <span className={`font-subheading font-bold text-[13px] ${config.accentColor}`}>{price.toFixed(2).replace(".", ",")} €</span>
            </div>
            <div className="w-full h-px bg-text-low my-3" />
            <button className="w-full flex items-center gap-4 py-1">
              <div className="h-10 w-10 rounded-xl bg-primary-bg border border-primary flex items-center justify-center shrink-0"><FileText size={18} className="text-primary" /></div>
              <div className="flex-1 text-left">
                <p className="font-body text-[14px] text-text-low">Historial de facturas</p>
                <p className={`font-subheading font-bold text-[15px] ${config.accentColor}`}>Ver todas</p>
              </div>
              <ChevronRight size={18} className="text-text-low" />
            </button>
          </Card>
        </section>
      )}

      <section className="mt-6 px-4">
        <p className="font-subheading font-bold text-text-low text-[16px] uppercase tracking-wide mb-3">Incluido en tu plan</p>
        <Card>
          <div className="flex flex-col gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                {feature.included ? (
                  <CheckCircle2 size={20} className="text-green shrink-0" />
                ) : (
                  <X size={20} className="text-text-low opacity-40 shrink-0" />
                )}
                <p className={`font-subheading font-bold text-[15px] ${feature.included ? "text-text-high" : "text-text-low opacity-50"}`}>{feature.label}</p>
              </div>
            ))}
          </div>
          {tier !== "elite" && (
            <div className="mt-4 pt-4 border-t border-text-low">
              <Button variant="outlined" text={tier === "free" ? "Conseguir un plan superior" : "Subir a Elite"} bgColor="bg-primary-bg" textColor="text-primary" borderColor="border-primary" w="w-full" onClick={() => navigate("/subscription")} />
            </div>
          )}
        </Card>
      </section>

      <section className="mt-6 px-4">
        <p className="font-subheading font-bold text-text-low text-[16px] uppercase tracking-wide mb-3">Gestionar</p>
        <Card>
          <div className="flex flex-col divide-y divide-text-low/20">
            {tier !== "free" && (
              <button onClick={() => alert("Proximamente")} className="w-full flex items-center gap-4 py-3">
                <div className="h-10 w-10 rounded-xl bg-primary-bg border border-primary flex items-center justify-center shrink-0"><CreditCard size={18} className="text-primary" /></div>
                <div className="flex-1 text-left">
                  <p className="font-subheading font-bold text-[15px] text-text-high">Cambiar metodo de pago</p>
                  <p className="font-subheading text-[13px] text-text-low">Actualiza tu tarjeta o anade otra</p>
                </div>
                <ChevronRight size={18} className="text-text-low" />
              </button>
            )}
            <button onClick={() => navigate("/subscription")} className="w-full flex items-center gap-4 py-3">
              <div className="h-10 w-10 rounded-xl bg-green/10 border border-green flex items-center justify-center shrink-0"><RefreshCw size={18} className="text-green" /></div>
              <div className="flex-1 text-left">
                <p className="font-subheading font-bold text-[15px] text-text-high">Cambiar de plan</p>
                <p className="font-subheading text-[13px] text-text-low">{tier === "free" ? "Consigue mas funciones" : "Sube o baja tu suscripcion"}</p>
              </div>
              <ChevronRight size={18} className="text-text-low" />
            </button>
            {tier !== "free" && (
              <>
                <button onClick={() => alert("Proximamente")} className="w-full flex items-center gap-4 py-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-bg2 border border-orange flex items-center justify-center shrink-0"><FileText size={18} className="text-orange" /></div>
                  <div className="flex-1 text-left">
                    <p className="font-subheading font-bold text-[15px] text-text-high">Descargar factura</p>
                    <p className="font-subheading text-[13px] text-text-low">PDF del ultimo periodo</p>
                  </div>
                  <ChevronRight size={18} className="text-text-low" />
                </button>
                <button onClick={() => { if (window.confirm("Seguro que quieres cancelar?")) alert("Proximamente"); }} className="w-full flex items-center gap-4 py-3">
                  <div className="h-10 w-10 rounded-xl bg-red-bg1 border border-red flex items-center justify-center shrink-0"><X size={18} className="text-red" /></div>
                  <div className="flex-1 text-left">
                    <p className="font-subheading font-bold text-[15px] text-red">Cancelar suscripcion</p>
                    <p className="font-subheading text-[13px] text-text-low">Acceso hasta el {formatDateLong(endsAt)}</p>
                  </div>
                  <ChevronRight size={18} className="text-red opacity-60" />
                </button>
              </>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default SubscriptionDetailsMobile;