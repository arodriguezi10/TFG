import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import { logoutUser } from "../services/auth";
import {
  ClipboardList,
  Scale,
  Ruler,
  Cake,
  Settings,
  Star,
  MessageCircle,
  LogOut,
  ChevronRight,
  Crown,
  Leaf,
  ChevronLeft,
  Users,
} from "lucide-react";
import {
  getBadgeByTier,
  getGoalIcon,
  formatWeight,
  calculateAge,
  calculateTimeSince,
} from "../utils/profileUtils";
import SupportModal from "../components/SupportModal"; 

const ProfileDesktop = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    fullName: "",
    subscription_tier: "free",
    height_cm: null,
    initial_weight_kg: null,
    age: null,
    fitness_goal: "",
    onboarding_date: null,
  });
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    if (user) {
      supabase
        .from("coach_client_relations")
        .select("id")
        .eq("client_id", user.id)
        .eq("status", "pending")
        .then(({ data }) => setPendingRequests(data?.length || 0));
    }
  }, [user]);

  useEffect(() => {
    if (user) loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          "first_name, last_name, subscription_tier, height_cm, initial_weight_kg, fitness_goal, updated_at",
        )
        .eq("id", user.id)
        .single();
      if (error) {
        console.error(error);
        return;
      }

      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("birth_date")
        .eq("user_id", user.id)
        .single();

      const fullName =
        `${data?.first_name || ""} ${data?.last_name || ""}`.trim() ||
        "Usuario";

      setUserData({
        fullName,
        subscription_tier: data?.subscription_tier || "free",
        height_cm: data?.height_cm || null,
        initial_weight_kg: data?.initial_weight_kg || null,
        age: calculateAge(profileData?.birth_date),
        fitness_goal: data?.fitness_goal || "Volumen",
        onboarding_date: data?.updated_at || null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const badge = getBadgeByTier(userData.subscription_tier);
  const weightFormatted = formatWeight(userData.initial_weight_kg);
  const timeSince = calculateTimeSince(userData.onboarding_date);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-text-low">Cargando...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-1">
            Perfil
          </p>
          <h1 className="font-heading font-extrabold text-[32px] text-text-high">
            Mi perfil
          </h1>
        </div>
      </div>

      <div className="flex-1 px-8 py-6 grid grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA — AVATAR Y BADGES */}
        <div className="flex flex-col gap-5">
          <Card>
            <div className="flex flex-col items-center gap-4 py-4">
              <span className="bg-accent1 h-24 w-24 rounded-3xl font-heading font-bold text-[48px] text-primary flex items-center justify-center">
                {userData.fullName.charAt(0).toUpperCase()}
              </span>
              <div className="text-center">
                <p className="font-heading font-extrabold text-[22px] text-text-high leading-tight">
                  {userData.fullName}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <span
                  className={`${badge.bgColor} py-1.5 px-3 rounded-2xl border ${badge.borderColor} ${badge.textColor} font-subheading font-semibold text-[13px] flex items-center justify-center gap-1.5`}
                >
                  {badge.icon} {badge.text}
                </span>
                <span className="bg-orange-bg4 py-1.5 px-3 rounded-2xl border border-orange text-orange font-subheading font-semibold text-[13px] flex items-center justify-center gap-1.5">
                  {getGoalIcon(userData.fitness_goal)} {userData.fitness_goal}
                </span>
              </div>
            </div>
          </Card>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <div className="flex flex-col">
                <div className="bg-brown-bg2 h-9 w-9 rounded-lg flex items-center justify-center mb-2">
                  <Scale size={18} className="text-brown" />
                </div>
                <p className="font-subheading font-bold text-text-low text-[11px] uppercase">
                  Peso inicial
                </p>
                <div className="flex items-baseline gap-0.5 mt-1">
                  <p className="font-heading font-semibold text-accent1 text-[18px] leading-none">
                    {weightFormatted.integer}
                  </p>
                  <p className="font-heading font-semibold text-accent1 text-[12px] leading-none">
                    ,{weightFormatted.decimal}
                  </p>
                </div>
                <p className="font-subheading font-bold text-text-low text-[11px] mt-1">
                  kg · {timeSince}
                </p>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col">
                <div className="bg-accent2-bg1 h-9 w-9 rounded-lg flex items-center justify-center mb-2">
                  <Ruler size={18} className="text-accent2" />
                </div>
                <p className="font-subheading font-bold text-text-low text-[11px] uppercase">
                  Altura
                </p>
                <p className="font-heading font-semibold text-accent2 text-[18px] mt-1">
                  {userData.height_cm || "--"}
                </p>
                <p className="font-subheading font-bold text-text-low text-[11px] mt-1">
                  cm
                </p>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col">
                <div className="bg-orange-bg4 h-9 w-9 rounded-lg flex items-center justify-center mb-2">
                  <Cake size={18} className="text-orange" />
                </div>
                <p className="font-subheading font-bold text-text-low text-[11px] uppercase">
                  Edad
                </p>
                <p className="font-heading font-semibold text-orange text-[18px] mt-1">
                  {userData.age || "--"}
                </p>
                <p className="font-subheading font-bold text-text-low text-[11px] mt-1">
                  anos
                </p>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col">
                <div className="bg-surface h-9 w-9 rounded-lg flex items-center justify-center mb-2">
                  <ClipboardList size={18} className="text-text-low" />
                </div>
                <p className="font-subheading font-bold text-text-low text-[11px] uppercase">
                  Plan
                </p>
                <p className="font-heading font-semibold text-primary text-[18px] mt-1">
                  Micro 2
                </p>
                <p className="font-subheading font-bold text-text-low text-[11px] mt-1">
                  8 dias
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* COLUMNA CENTRAL Y DERECHA — MENU */}
        <div className="col-span-2 flex flex-col gap-5">
          <Card>
            <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-4">
              Configuracion
            </p>
            <div className="flex flex-col divide-y divide-text-low/20">
              <button
                onClick={() => navigate("/personalSettings")}
                className="flex items-center gap-4 py-4 hover:bg-surf transition-colors rounded-xl px-2"
              >
                <div className="bg-primary-bg h-11 w-11 rounded-xl flex items-center justify-center shrink-0">
                  <Settings size={20} className="text-primary" />
                </div>
                <div className="flex flex-col text-left flex-1">
                  <p className="font-subheading font-bold text-[15px] text-text-high">
                    Ajustes y datos personales
                  </p>
                  <p className="font-body text-[13px] text-text-low">
                    Edita tu foto y tus datos
                  </p>
                </div>
                <ChevronRight size={18} className="text-text-low" />
              </button>

              <button
                onClick={() =>
                  userData.subscription_tier === "free"
                    ? navigate("/subscription")
                    : navigate("/subscriptionDetails")
                }
                className="flex items-center gap-4 py-4 hover:bg-surf transition-colors rounded-xl px-2"
              >
                <div className="bg-primary-bg h-11 w-11 rounded-xl flex items-center justify-center shrink-0">
                  <Star size={20} className="text-yellow" />
                </div>
                <div className="flex flex-col text-left flex-1">
                  <p className="font-subheading font-bold text-[15px] text-text-high">
                    Suscripcion y pagos
                  </p>
                  <p className="font-body text-[13px] text-text-low">
                    Plan{" "}
                    {userData.subscription_tier === "elite"
                      ? "Elite"
                      : userData.subscription_tier === "pro"
                        ? "Pro"
                        : "Free"}{" "}
                    · Activo
                  </p>
                </div>
                <ChevronRight size={18} className="text-text-low" />
              </button>

              <button
                onClick={() => navigate("/coach/requests")}
                className="flex items-center gap-4 py-4 hover:bg-surf transition-colors rounded-xl px-2"
              >      
                  <div className="bg-primary-bg h-11 w-11 rounded-xl flex items-center justify-center shrink-0">
                    <Users size={18} className="text-primary" />
                  </div>

                  <div className="flex flex-col text-left flex-1">
                    <p className="font-subheading font-bold text-[15px] text-text-high">
                      Solicitudes de entrenador
                    </p>
                    <p className="font-subheading text-[16px] text-text-low">
                      {pendingRequests > 0
                        ? `${pendingRequests} pendiente${pendingRequests !== 1 ? "s" : ""}`
                        : "Sin solicitudes"}
                    </p>
                  </div>
                 
                  <div className="flex items-center gap-2">
                    {pendingRequests > 0 && (
                      <span className="bg-orange h-5 w-5 rounded-full font-heading font-bold text-[11px] text-background flex items-center justify-center">
                        {pendingRequests}
                      </span>
                    )}
                    <ChevronRight size={18} className="text-text-low" />
                  </div>
      
              </button>

              <button
                onClick={() => setShowSupport(true)} className="w-full"
                className="flex items-center gap-4 py-4 hover:bg-surf transition-colors rounded-xl px-2"
              >
                <div className="bg-primary-bg h-11 w-11 rounded-xl flex items-center justify-center shrink-0">
                  <MessageCircle size={20} className="text-accent2" />
                </div>
                <div className="flex flex-col text-left flex-1">
                  <p className="font-subheading font-bold text-[15px] text-text-high">
                    Soporte / Ayuda
                  </p>
                  <p className="font-body text-[13px] text-text-low">
                    FAQ y contacto
                  </p>
                </div>
                <ChevronRight size={18} className="text-text-low" />
              </button>
            </div>
          </Card>

          <Card>
            <button
              className="w-full flex items-center gap-4 py-2 hover:bg-surf transition-colors rounded-xl px-2"
              onClick={async () => {
                if (window.confirm("Seguro que quieres cerrar sesion?")) {
                  await logoutUser();
                  navigate("/login");
                }
              }}
            >
              <div className="bg-red-bg1 h-11 w-11 rounded-xl flex items-center justify-center shrink-0">
                <LogOut size={20} className="text-red" />
              </div>
              <div className="flex flex-col text-left flex-1">
                <p className="font-heading font-semibold text-[18px] text-red">
                  Cerrar sesion
                </p>
              </div>
              <ChevronRight size={18} className="text-red" />
            </button>
          </Card>
        </div>
      </div>
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    </div>
  );
};

export default ProfileDesktop;
