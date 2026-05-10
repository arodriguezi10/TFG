import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useCoach } from "../hooks/useCoach";
import {
  Users, Search, Eye, UserPlus, Dumbbell, Scale,
  TrendingUp, Clock, Crown, Zap, Leaf, ChevronRight, Bell
} from "lucide-react";
import Card from "../components/Card";

const PlanBadge = ({ tier }) => {
  const config = {
    elite: { icon: <Crown size={11} />, label: "Elite", className: "bg-primary-bg border-primary text-primary" },
    pro:   { icon: <Zap size={11} />,   label: "Pro",   className: "bg-orange-bg2 border-orange text-orange" },
    free:  { icon: <Leaf size={11} />,  label: "Free",  className: "bg-surf border-text-low text-text-low" },
  };
  const c = config[tier] || config.free;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-subheading font-bold text-[10px] ${c.className}`}>
      {c.icon}{c.label}
    </span>
  );
};

const CoachDashboardMobile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { enterClientView } = useCoach();

  const [clients, setClients] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadClients(); }, [user]);

  const loadClients = async () => {
    try {
      setLoading(true);

      // Relaciones activas
      const { data: relations } = await supabase
        .from("coach_client_relations")
        .select("client_id, status, created_at")
        .eq("coach_id", user.id);

      if (!relations) return;

      const activeRelations = relations.filter(r => r.status === "active");
      setPendingCount(relations.filter(r => r.status === "pending").length);

      if (activeRelations.length === 0) { setClients([]); return; }

      const clientIds = activeRelations.map(r => r.client_id);

      // Datos de usuarios
      const { data: usersData } = await supabase
        .from("users")
        .select("id, first_name, last_name, subscription_tier, initial_weight_kg")
        .in("id", clientIds);

      // Última sesión de cada cliente
      const { data: sessions } = await supabase
        .from("workout_sessions")
        .select("user_id, session_date, routine_name")
        .in("user_id", clientIds)
        .order("session_date", { ascending: false });

      // Progresión activa de cada cliente
      const { data: progressions } = await supabase
        .from("progressions")
        .select("user_id, name, duration_weeks, start_date")
        .in("user_id", clientIds)
        .order("created_at", { ascending: false });

      // Peso más reciente
      const { data: weights } = await supabase
        .from("weight_logs")
        .select("user_id, weight, log_date")
        .in("user_id", clientIds)
        .order("log_date", { ascending: false });

      const enriched = (usersData || []).map(u => {
        const lastSession = sessions?.find(s => s.user_id === u.id);
        const activeProgression = progressions?.find(p => p.user_id === u.id);
        const lastWeight = weights?.find(w => w.user_id === u.id);

        let progressPct = 0;
        if (activeProgression) {
          const start = new Date(activeProgression.start_date);
          const today = new Date();
          const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
          progressPct = Math.min(Math.round((diffDays / (activeProgression.duration_weeks * 7)) * 100), 100);
        }

        const daysSinceSession = lastSession
          ? Math.floor((new Date() - new Date(lastSession.session_date)) / (1000 * 60 * 60 * 24))
          : null;

        return {
          ...u,
          fullName: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Atleta",
          lastSession, daysSinceSession,
          activeProgression, progressPct,
          currentWeight: lastWeight?.weight || null,
        };
      });

      setClients(enriched);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleEnterClient = (client) => {
    enterClientView({ id: client.id, fullName: client.fullName, subscription_tier: client.subscription_tier });
    navigate("/dashboard");
  };

  const formatDaysAgo = (days) => {
    if (days === null) return "Sin sesiones";
    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    return `Hace ${days} dias`;
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col pb-8">
      {/* HEADER */}
      <div className="px-4 pt-14 pb-4 border-b border-text-low/20">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide">Panel</p>
            <h1 className="font-heading font-extrabold text-[28px] text-text-high">Mis atletas</h1>
          </div>
          <div className="flex gap-2">
            {pendingCount > 0 && (
              <button onClick={() => navigate("/coach/requests")} className="relative bg-surf h-10 w-10 rounded-xl border border-orange flex items-center justify-center">
                <Bell size={18} className="text-orange" />
                <span className="absolute -top-1 -right-1 bg-orange h-4 w-4 rounded-full font-heading font-bold text-[10px] text-background flex items-center justify-center">{pendingCount}</span>
              </button>
            )}
            <button onClick={() => navigate("/coach/search")} className="bg-primary h-10 w-10 rounded-xl flex items-center justify-center">
              <UserPlus size={18} className="text-text-high" />
            </button>
          </div>
        </div>
        <p className="font-body text-[13px] text-text-low">{clients.length} atleta{clients.length !== 1 ? "s" : ""} activo{clients.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="bg-primary-bg h-24 w-24 rounded-3xl border border-primary flex items-center justify-center">
              <Users size={40} className="text-primary" />
            </div>
            <p className="font-heading font-bold text-[20px] text-text-high">Sin atletas todavia</p>
            <p className="font-body text-[14px] text-text-low text-center">Busca atletas por email para enviarles una solicitud de vinculacion</p>
            <button onClick={() => navigate("/coach/search")} className="bg-primary px-6 py-3 rounded-2xl font-heading font-bold text-[15px] text-text-high flex items-center gap-2">
              <Search size={16} /> Buscar atleta
            </button>
          </div>
        ) : (
          clients.map(client => (
            <Card key={client.id}>
              <div className="flex items-start gap-3 mb-3">
                {/* AVATAR */}
                <div className="bg-accent1 h-12 w-12 rounded-2xl flex items-center justify-center font-heading font-bold text-[20px] text-primary shrink-0">
                  {client.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-heading font-bold text-[16px] text-text-high truncate">{client.fullName}</p>
                    <PlanBadge tier={client.subscription_tier} />
                  </div>
                  <p className="font-body text-[12px] text-text-low flex items-center gap-1">
                    <Clock size={11} /> {formatDaysAgo(client.daysSinceSession)}
                    {client.lastSession && <span className="text-text-low/60"> · {client.lastSession.routine_name}</span>}
                  </p>
                </div>
              </div>

              {/* STATS */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-surf rounded-xl p-2.5 flex flex-col gap-0.5">
                  <p className="font-subheading font-bold text-[10px] text-text-low uppercase tracking-wide flex items-center gap-1"><Scale size={10} /> Peso</p>
                  <p className="font-heading font-bold text-[16px] text-text-high leading-none">{client.currentWeight ? `${client.currentWeight}kg` : "--"}</p>
                </div>
                <div className="flex-1 bg-surf rounded-xl p-2.5 flex flex-col gap-0.5">
                  <p className="font-subheading font-bold text-[10px] text-text-low uppercase tracking-wide flex items-center gap-1"><TrendingUp size={10} /> Mesociclo</p>
                  <p className="font-heading font-bold text-[16px] text-text-high leading-none">{client.activeProgression ? `${client.progressPct}%` : "--"}</p>
                </div>
                <div className="flex-1 bg-surf rounded-xl p-2.5 flex flex-col gap-0.5">
                  <p className="font-subheading font-bold text-[10px] text-text-low uppercase tracking-wide flex items-center gap-1"><Dumbbell size={10} /> Plan</p>
                  <p className="font-heading font-bold text-[16px] text-text-high leading-none">{client.activeProgression?.name?.split(" ")[0] || "--"}</p>
                </div>
              </div>

              {/* PROGRESO MESOCICLO */}
              {client.activeProgression && (
                <div className="mb-3">
                  <div className="w-full h-1.5 bg-surf rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${client.progressPct}%` }} />
                  </div>
                </div>
              )}

              {/* CTA */}
              <button onClick={() => handleEnterClient(client)} className="w-full bg-primary-bg border border-primary rounded-xl py-2.5 font-heading font-bold text-[14px] text-primary flex items-center justify-center gap-2 hover:bg-primary/15 transition-colors">
                <Eye size={15} /> Ver como atleta
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CoachDashboardMobile;