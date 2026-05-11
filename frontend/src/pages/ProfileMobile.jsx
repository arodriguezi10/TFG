import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Header from "../components/Header";
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
  Flame,
  Zap,
  Dumbbell,
  Sparkles,
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

const ProfileMobile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showSupport, setShowSupport] = useState(false);

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
    <div className="min-h-screen bg-background flex flex-col mb-2.5">
      <Header showback onBackClick={() => navigate("/dashboard")} />

      <section className="mt-2.5 flex flex-col items-center justify-center gap-3.75">
        <span className="bg-accent1 h-27.5 w-27.5 px-2.5 rounded-[35px] font-heading font-bold text-[50px] text-primary flex items-center justify-center">
          {userData.fullName.charAt(0).toUpperCase()}
        </span>
        <p className="font-heading font-extrabold text-[28px] text-text-high leading-tight text-center">
          {userData.fullName}
        </p>
        <div className="flex gap-2.5">
          <span
            className={`${badge.bgColor} h-7.5 py-0.5 px-3 rounded-2xl border ${badge.borderColor} ${badge.textColor} font-subheading font-semibold flex items-center gap-1.5`}
          >
            {badge.icon} {badge.text}
          </span>
          <span className="bg-orange-bg4 h-7.5 py-0.5 px-3 rounded-2xl border border-orange text-orange font-subheading font-semibold flex items-center gap-1.5">
            {getGoalIcon(userData.fitness_goal)} {userData.fitness_goal}
          </span>
        </div>
      </section>

      <section className="mt-4 flex flex-col px-4 gap-4">
        <div className="flex gap-3.75">
          <Card>
            <div className="flex flex-col h-auto">
              <div className="bg-surface h-10 w-10 rounded-lg flex items-center justify-center">
                <ClipboardList size={20} className="text-text-low" />
              </div>
              <p className="font-subheading font-bold text-text-low text-[16px] mt-2.5">
                PLANIFICACION
              </p>
              <p className="font-heading font-semibold text-primary text-[20px] mt-1.25">
                Microciclo 2
              </p>
              <p className="font-subheading font-bold text-text-low text-[16px] mt-1.25">
                8 dias / 2 sem.
              </p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col h-auto">
              <div className="bg-brown-bg2 h-10 w-10 rounded-lg flex items-center justify-center">
                <Scale size={20} className="text-brown" />
              </div>
              <p className="font-subheading font-bold text-text-low text-[16px] mt-2.5">
                PESO INICIAL
              </p>
              <div className="flex items-baseline gap-1 mt-1.25">
                <p className="font-heading font-semibold text-accent1 text-[20px] leading-none">
                  {weightFormatted.integer}
                </p>
                <p className="font-heading font-semibold text-accent1 text-[14px] leading-none">
                  ,{weightFormatted.decimal}
                </p>
              </div>
              <p className="font-subheading font-bold text-text-low text-[16px] mt-1.25">
                kg · {timeSince}
              </p>
            </div>
          </Card>
        </div>
        <div className="flex gap-3.75">
          <Card>
            <div className="flex flex-col h-auto">
              <div className="bg-accent2-bg1 h-10 w-10 rounded-lg flex items-center justify-center">
                <Ruler size={20} className="text-accent2" />
              </div>
              <p className="font-subheading font-bold text-text-low text-[16px] mt-2.5">
                ALTURA
              </p>
              <p className="font-heading font-semibold text-accent2 text-[20px] mt-1.25">
                {userData.height_cm || "--"}
              </p>
              <p className="font-subheading font-bold text-text-low text-[16px] mt-1.25">
                cm
              </p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col h-auto">
              <div className="bg-orange-bg4 h-10 w-10 rounded-lg flex items-center justify-center">
                <Cake size={20} className="text-orange" />
              </div>
              <p className="font-subheading font-bold text-text-low text-[16px] mt-2.5">
                EDAD
              </p>
              <p className="font-heading font-semibold text-orange text-[20px] mt-1.25">
                {userData.age || "--"}
              </p>
              <p className="font-subheading font-bold text-text-low text-[16px] mt-1.25">
                anos
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <Card>
          <div className="flex flex-col gap-3.75">
            <button
              onClick={() => navigate("/personalSettings")}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-5 items-center">
                  <div className="bg-primary-bg h-10 w-10 rounded-lg flex items-center justify-center">
                    <Settings size={18} className="text-primary" />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="font-subheading font-bold text-[16px] text-text-high">
                      Ajustes y datos personales
                    </p>
                    <p className="font-subheading font-bold text-[16px] text-text-low">
                      Edita tu foto y tus datos
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-low" />
              </div>
            </button>

            <div className="w-full h-px bg-text-low" />

            <button
              onClick={() =>
                userData.subscription_tier === "free"
                  ? navigate("/subscription")
                  : navigate("/subscriptionDetails")
              }
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-5 items-center">
                  <div className="bg-primary-bg h-10 w-10 rounded-lg flex items-center justify-center">
                    <Star size={18} className="text-yellow" />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="font-subheading font-bold text-[16px] text-text-high">
                      Suscripcion y pagos
                    </p>
                    <p className="font-subheading font-bold text-[16px] text-text-low">
                      Plan{" "}
                      {userData.subscription_tier === "elite"
                        ? "Elite"
                        : userData.subscription_tier === "pro"
                          ? "Pro"
                          : "Free"}{" "}
                      · Activo
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-low" />
              </div>
            </button>

            <div className="w-full h-px bg-text-low" />

            <button
              onClick={() => navigate("/coach/requests")}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-5 items-center">
                  <div className="bg-primary-bg h-10 w-10 rounded-lg flex items-center justify-center">
                    <Users size={18} className="text-primary" />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="font-subheading font-bold text-[16px] text-text-high">
                      Solicitudes de entrenador
                    </p>
                    <p className="font-subheading font-bold text-[16px] text-text-low">
                      {pendingRequests > 0
                        ? `${pendingRequests} pendiente${pendingRequests !== 1 ? "s" : ""}`
                        : "Sin solicitudes"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pendingRequests > 0 && (
                    <span className="bg-orange h-5 w-5 rounded-full font-heading font-bold text-[11px] text-background flex items-center justify-center">
                      {pendingRequests}
                    </span>
                  )}
                  <ChevronRight size={18} className="text-text-low" />
                </div>
              </div>
            </button>

            <div className="w-full h-px bg-text-low" />

            <button onClick={() => setShowSupport(true)} className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex gap-5 items-center">
                  <div className="bg-primary-bg h-10 w-10 rounded-lg flex items-center justify-center">
                    <MessageCircle size={18} className="text-accent2" />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="font-subheading font-bold text-[16px] text-text-high">
                      Soporte / Ayuda
                    </p>
                    <p className="font-subheading font-bold text-[16px] text-text-low">
                      FAQ y contacto
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-low" />
              </div>
            </button>
          </div>
        </Card>

        <Card>
          <button
            className="w-full"
            onClick={async () => {
              if (window.confirm("Seguro que quieres cerrar sesion?")) {
                await logoutUser();
                navigate("/login");
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-5 items-center">
                <div className="bg-red-bg1 h-10 w-10 rounded-lg flex items-center justify-center">
                  <LogOut size={18} className="text-red" />
                </div>
                <p className="font-heading font-semibold text-[20px] text-red">
                  Cerrar sesion
                </p>
              </div>
              <ChevronRight size={18} className="text-red" />
            </div>
          </button>
        </Card>
      </section>
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    </div>
  );
};

export default ProfileMobile;
