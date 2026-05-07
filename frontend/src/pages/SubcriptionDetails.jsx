import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Header from "../components/Header";
import Button from "../components/Button";

import {
  Leaf, Zap, Crown, CheckCircle2, X, CreditCard, Calendar,
  FileText, Download, RefreshCw, ChevronRight, CheckCheck
} from "lucide-react";

const SubscriptionDetails = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Precios por plan y periodo
  const PLAN_PRICES = {
    free: { mes: 0, annual: 0 },
    pro: { mes: 9.99, annual: 5.99 },
    elite: { mes: 19.99, annual: 11.99 },
  };

  // Features incluidas por plan
  const PLAN_FEATURES = {
    free: [
      { label: "Hasta 4 rutinas", included: true },
      { label: "Registro del peso corporal", included: true },
      { label: "Rutinas predefinidas por nivel", included: false },
      { label: "Planificación de mesociclos", included: false },
      { label: "Chat directo con el entrenador", included: false },
    ],
    pro: [
      { label: "Hasta 4 rutinas", included: true },
      { label: "Registro del peso corporal", included: true },
      { label: "Rutinas predefinidas por nivel", included: true },
      { label: "Planificación de mesociclos", included: false },
      { label: "Chat directo con el entrenador", included: false },
    ],
    elite: [
      { label: "Rutinas ilimitadas", included: true },
      { label: "Registro del peso corporal", included: true },
      { label: "Rutinas predefinidas por nivel", included: true },
      { label: "Planificación de mesociclos", included: true },
      { label: "Chat directo con el entrenador", included: true },
    ],
  };

  // Info visual por plan
  const PLAN_CONFIG = {
    free: {
      label: "Plan Free",
      icon: <Leaf className="text-green"/>,
      color: "text-text-low",
      borderColor: "border-text-low",
      bgColor: "bg-surf",
      accentColor: "text-text-low",
    },
    pro: {
      label: "Plan Pro",
      icon: <Zap className="text-orange"/>,
      color: "text-orange",
      borderColor: "border-orange",
      bgColor: "bg-orange-bg2",
      accentColor: "text-orange",
    },
    elite: {
      label: "Plan Elite",
      icon: <Crown className="text-orange"/>,
      color: "text-primary",
      borderColor: "border-primary",
      bgColor: "bg-primary-bg",
      accentColor: "text-primary",
    },
  };

  useEffect(() => {
    if (user) loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("first_name, subscription_tier, subscription_ends_at, stripe_id")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error("Error cargando datos de suscripcion:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calcula los dias restantes hasta subscription_ends_at
  const getDaysRemaining = (endsAt) => {
    if (!endsAt) return null;
    const end = new Date(endsAt);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  // Calcula la fecha de inicio estimada (30 dias antes del fin)
  const getStartDate = (endsAt) => {
    if (!endsAt) return null;
    const end = new Date(endsAt);
    const start = new Date(end);
    start.setDate(start.getDate() - 30);
    return start;
  };

  // Calcula el porcentaje del ciclo consumido
  const getCycleProgress = (endsAt) => {
    if (!endsAt) return 0;
    const end = new Date(endsAt);
    const start = getStartDate(endsAt);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    const progress = (elapsed / total) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const formatDate = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateLong = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Nombre del plan con primera letra en mayuscula
  const getPlanName = (tier) => {
    const names = { free: "Free", pro: "Pro", elite: "Elite" };
    return names[tier] || "Free";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
      <Header
        showback
        subtitle="Perfil"
        title="Suscripcion y pagos"
        onBackClick={() => navigate("/profile")}
      />

      {/* PLAN ACTUAL */}
      <section className="mt-4 px-4">
        <p className="font-subheading font-bold text-text-low text-[16px] uppercase tracking-wide mb-3">
          Tu plan actual
        </p>

        <Card>
          {/* Cabecera del plan */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-11 w-11 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center text-[22px]`}>
              {config.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-subheading font-bold text-[16px] ${config.color} border ${config.borderColor} rounded-full px-2.5 py-0.5 uppercase tracking-wide`}>
                  {config.label}
                </span>
              </div>
              <p className="font-subheading font-extrabold text-[22px] text-text-high leading-none">
                {userData?.first_name || "Usuario"}
              </p>
            </div>
            {/* Badge activo */}
            <span className="flex items-center gap-1.5 bg-accent3 rounded-full px-3 py-1 font-subheading font-bold text-[12px] text-green">
                <span className="w-1.5 h-1.5 rounded-full bg-green inline-block"></span>
                Activo
            </span>
          </div>

          {/* Ciclo de facturacion — solo si tiene plan de pago */}
          {tier !== "free" && endsAt && (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="font-subheading text-[13px] text-text-low">Ciclo de facturacion</p>
                <p className={`font-subheading font-bold text-[13px] ${config.accentColor}`}>
                  Quedan {daysRemaining} dias
                </p>
              </div>

              {/* Barra de progreso del ciclo */}
              <div className="w-full h-2 bg-text-low/20 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${cycleProgress}%`,
                    background: tier === "pro"
                      ? "linear-gradient(90deg, #f5a623, #ff6b9d)"
                      : "linear-gradient(90deg, #6c63ff, #36d9b8)",
                  }}
                />
              </div>

              <div className="flex justify-between mb-4">
                <p className="font-body text-[16px] text-text-low">{formatDate(startDate)}</p>
                <p className="font-body text-[16px] text-text-low">{formatDate(endsAt)}</p>
              </div>
            </>
          )}

          {/* Stats del plan */}
          <div className="flex items-center justify-between bg-surf rounded-xl p-4">
            {/* Precio */}
            <div className="flex flex-col items-center gap-0.5">
              <p className="font-subheading font-extrabold text-[22px] text-text-high leading-none">
                {tier === "free" ? "0" : `${price.toFixed(2).replace(".", ",")}`}
              </p>
              <p className="font-subheading font-bold text-[16px] text-text-low uppercase">
                {tier === "free" ? "gratis" : "€ al mes"}
              </p>
            </div>

            <div className="w-px h-8 bg-text-low"></div>

            {/* Dias activo o estado */}
            <div className="flex flex-col items-center gap-0.5">
              <p className="font-subheading font-extrabold text-[22px] text-text-high leading-none">
                {tier === "free" ? "∞" : (daysActive !== null ? daysActive : "--")}
              </p>
              <p className="font-subheading font-bold text-[16px] text-text-low uppercase">
                {tier === "free" ? "para siempre" : "dias activo"}
              </p>
            </div>

            <div className="w-px h-8 bg-text-low"></div>

            {/* Nivel */}
            <div className="flex flex-col items-center gap-0.5">
              <p className={`font-subheading font-extrabold text-[22px] leading-none ${config.accentColor}`}>
                {getPlanName(tier)}
              </p>
              <p className="font-subheading font-bold text-[16px] text-text-low uppercase">nivel</p>
            </div>
          </div>
        </Card>
      </section>

      {/* DATOS DE FACTURACION — solo si tiene plan de pago */}
      {tier !== "free" && (
        <section className="mt-6 px-4">
          <p className="font-subheading font-bold text-text-low text-[16px] uppercase tracking-wide mb-3">
            Datos de facturacion
          </p>

          <Card>
            {/* Metodo de pago */}
            <button className="w-full flex items-center gap-4 py-1">
              <div className="h-10 w-10 rounded-xl bg-primary-bg border border-primary flex items-center justify-center text-[18px] shrink-0">
                <CreditCard className="text-text-high"/>
              </div>
              <div className="flex-1 text-left">
                <p className="font-subheading text-[16px] text-text-low">Método de pago</p>
                <p className="font-subheading font-bold text-[16px] text-text-high">
                  {userData?.stripe_id ? "Visa ···· 4242" : "Sin metodo de pago"}
                </p>
              </div>
              <span className="text-text-low text-[16px]"><ChevronRight/></span>
            </button>

            <div className="w-full h-px bg-text-low my-3"></div>

            {/* Proximo cobro */}
            <div className="w-full flex items-center gap-4 py-1">
              <div className="h-10 w-10 rounded-xl bg-primary-bg border border-primary flex items-center justify-center text-[18px] shrink-0">
                <Calendar className="text-text-high"/>
              </div>
              <div className="flex-1 text-left">
                <p className="font-body text-[16px] text-text-low">Proximo cobro</p>
                <p className="font-subheading font-bold text-[16px] text-text-high">
                  {formatDateLong(endsAt)}
                </p>
              </div>
              <span className={`font-subheading font-bold text-[14px] ${config.accentColor}`}>
                {price.toFixed(2).replace(".", ",")} €<br />
                <span className="font-body text-[16px] text-text-low">al mes</span>
              </span>
            </div>

            <div className="w-full h-px bg-text-low my-3"></div>

            {/* Historial de facturas */}
            <button className="w-full flex items-center gap-4 py-1">
              <div className="h-10 w-10 rounded-xl bg-primary-bg border border-primary flex items-center justify-center text-[18px] shrink-0">
                <FileText className="text-text-high"/>
              </div>
              <div className="flex-1 text-left">
                <p className="font-body text-[16px] text-text-low">Historial de facturas</p>
                <p className={`font-subheading font-bold text-[16px] ${config.accentColor}`}>
                  Ver todas
                </p>
              </div>
              <span className="text-text-low text-[16px]"><ChevronRight/></span>
            </button>
          </Card>
        </section>
      )}

      {/* INCLUIDO EN TU PLAN */}
      <section className="mt-6 px-4">
        <p className="font-subheading font-bold text-text-low text-[16px] uppercase tracking-wide mb-3">
          Incluido en tu plan
        </p>

        <Card>
          <div className="flex flex-col gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                {feature.included ? (
                  <div className="h-6 w-6 rounded-full bg-green flex items-center justify-center shrink-0">

                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full bg-accent3/10 flex items-center justify-center shrink-0">

                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-text-low opacity-40">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                )}
                <p className={`font-subheading font-bold text-[16px] ${feature.included ? "text-text-high" : "text-text-low opacity-50"}`}>
                  {feature.label}
                </p>
              </div>
            ))}
          </div>

          {/* Boton para subir de plan si no es elite */}
          {tier !== "elite" && (
            <div className="mt-4 pt-4 border-t border-text-low">
              <Button
                variant="outlined"
                text={tier === "free" ? "Conseguir un plan superior" : "Subir a Elite"}
                bgColor="bg-primary-bg"
                textColor="text-primary"
                borderColor="border-primary"
                w="w-full"
                onClick={() => navigate("/subscription")}
              />
            </div>
          )}
        </Card>
      </section>

      {/* GESTIONAR */}
      <section className="mt-6 px-4">
        <p className="font-subheading font-bold text-text-low text-[16px] uppercase tracking-wide mb-3">
          Gestionar
        </p>

        <Card>
          <div className="flex flex-col">
            {/* Cambiar metodo de pago — solo si tiene plan de pago */}
            {tier !== "free" && (
              <>
                <button
                  onClick={() => alert("Proximamente: cambiar metodo de pago")}
                  className="w-full flex items-center gap-4 py-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary-bg border border-primary flex items-center justify-center text-[18px] shrink-0">
                    <CreditCard className="text-blue"/>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-subheading font-bold text-[16px] text-text-high">Cambiar metodo de pago</p>
                    <p className="font-subheading text-[14px] text-text-low">Actualiza tu tarjeta o añade otra</p>
                  </div>
                  <span className="text-text-low text-[16px]"><ChevronRight/></span>
                </button>
                <div className="w-full h-px bg-text-low"></div>
              </>
            )}

            {/* Cambiar de plan */}
            <button
              onClick={() => navigate("/subscription")}
              className="w-full flex items-center gap-4 py-3"
            >
              <div className="h-10 w-10 rounded-xl bg-green-bg1 border border-green flex items-center justify-center text-[18px] shrink-0">
                <RefreshCw className="text-text-high"/>
              </div>
              <div className="flex-1 text-left">
                <p className="font-subheading font-bold text-[16px] text-text-high">Cambiar de plan</p>
                <p className="font-subheading text-[14px] text-text-low">
                  {tier === "free" ? "Consigue mas funciones" : "Sube o baja tu suscripcion"}
                </p>
              </div>
              <span className="text-text-low text-[16px]"><ChevronRight/></span>
            </button>

            {/* Descargar factura y cancelar — solo si tiene plan de pago */}
            {tier !== "free" && (
              <>
                <div className="w-full h-px bg-text-low"></div>
                <button
                  onClick={() => alert("Proximamente: descargar factura")}
                  className="w-full flex items-center gap-4 py-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-orange-bg2 border border-orange flex items-center justify-center text-[18px] shrink-0">
                    <FileText className="text-orange"/>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-subheading font-bold text-[16px] text-text-high">Descargar factura</p>
                    <p className="font-subheading text-[14px] text-text-low">PDF del ultimo periodo</p>
                  </div>
                  <span className="text-text-low text-[16px]"><ChevronRight/></span>
                </button>

                <div className="w-full h-px bg-text-low"></div>

                {/* Cancelar suscripcion */}
                <button
                  onClick={() => {
                    if (window.confirm("¿Seguro que quieres cancelar tu suscripcion? Seguiras teniendo acceso hasta " + formatDateLong(endsAt))) {
                      alert("Proximamente: cancelacion real via Stripe");
                    }
                  }}
                  className="w-full flex items-center gap-4 py-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-red-bg1 border border-red flex items-center justify-center text-[18px] shrink-0">
                    <X className="text-red"/>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-subheading font-bold text-[16px] text-red">Cancelar suscripcion</p>
                    <p className="font-subheading text-[14px] text-text-low">
                      Tendras acceso hasta el {formatDateLong(endsAt)}
                    </p>
                  </div>
                  <span className="text-red text-[16px] opacity-60"><ChevronRight/></span>
                </button>
              </>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default SubscriptionDetails;