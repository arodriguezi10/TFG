import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useCoach } from "../hooks/useCoach";
import {
  Users, Search, Eye, UserPlus, Dumbbell, Scale,
  TrendingUp, Clock, Crown, Zap, Leaf, Bell, Activity
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

const CoachDashboardDesktop = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { enterClientView } = useCoach();

  const [clients, setClients] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => { if (user) loadClients(); }, [user]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const { data: relations } = await supabase.from("coach_client_relations").select("client_id, status, created_at").eq("coach_id", user.id);
      if (!relations) return;

      const activeRelations = relations.filter(r => r.status === "active");
      setPendingCount(relations.filter(r => r.status === "pending").length);
      if (activeRelations.length === 0) { setClients([]); return; }

      const clientIds = activeRelations.map(r => r.client_id);
      const { data: usersData } = await supabase.from("users").select("id, first_name, last_name, subscription_tier, initial_weight_kg, height_cm").in("id", clientIds);
      const { data: sessions } = await supabase.from("workout_sessions").select("user_id, session_date, routine_name, total_sets, exercises_completed").in("user_id", clientIds).order("session_date", { ascending: false });
      const { data: progressions } = await supabase.from("progressions").select("user_id, name, duration_weeks, start_date, goal").in("user_id", clientIds).order("created_at", { ascending: false });
      const { data: weights } = await supabase.from("weight_logs").select("user_id, weight, log_date").in("user_id", clientIds).order("log_date", { ascending: false });
      const { data: checkins } = await supabase.from("daily_checkins").select("user_id, sleep_quality, energy_level, stress_level").in("user_id", clientIds).order("checkin_date", { ascending: false });

      const enriched = (usersData || []).map(u => {
        const lastSession = sessions?.find(s => s.user_id === u.id);
        const activeProgression = progressions?.find(p => p.user_id === u.id);
        const lastWeight = weights?.find(w => w.user_id === u.id);
        const lastCheckin = checkins?.find(c => c.user_id === u.id);
        const recentSessions = sessions?.filter(s => s.user_id === u.id).slice(0, 5) || [];

        let progressPct = 0;
        if (activeProgression) {
          const start = new Date(activeProgression.start_date);
          const diffDays = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
          progressPct = Math.min(Math.round((diffDays / (activeProgression.duration_weeks * 7)) * 100), 100);
        }

        const daysSinceSession = lastSession ? Math.floor((new Date() - new Date(lastSession.session_date)) / (1000 * 60 * 60 * 24)) : null;

        return { ...u, fullName: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Atleta", lastSession, daysSinceSession, activeProgression, progressPct, currentWeight: lastWeight?.weight || null, lastCheckin, recentSessions };
      });

      setClients(enriched);
      if (enriched.length > 0) setSelectedClient(enriched[0]);
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

  const getActivityColor = (days) => {
    if (days === null) return "#6b6b8a";
    if (days <= 1) return "#36d9b8";
    if (days <= 3) return "#6c63ff";
    if (days <= 7) return "#f5a623";
    return "#ff5757";
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center justify-between">
        <div>
          <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Panel de entrenador</p>
          <h1 className="font-heading font-extrabold text-[32px] text-text-high">Mis atletas</h1>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <button onClick={() => navigate("/coach/requests")} className="relative bg-surf h-10 px-4 rounded-xl border border-orange flex items-center gap-2 text-orange font-subheading font-bold text-[13px]">
              <Bell size={16} /> {pendingCount} solicitud{pendingCount !== 1 ? "es" : ""} pendiente{pendingCount !== 1 ? "s" : ""}
            </button>
          )}
          <button onClick={() => navigate("/coach/search")} className="bg-primary h-10 px-5 rounded-xl font-heading font-bold text-[14px] text-text-high flex items-center gap-2 hover:opacity-90 transition-opacity">
            <UserPlus size={16} /> Anadir atleta
          </button>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          <div className="bg-primary-bg h-28 w-28 rounded-3xl border border-primary flex items-center justify-center"><Users size={52} className="text-primary" /></div>
          <p className="font-heading font-bold text-[24px] text-text-high">Sin atletas todavia</p>
          <p className="font-body text-[15px] text-text-low text-center max-w-md">Busca atletas por email para enviarles una solicitud de vinculacion</p>
          <button onClick={() => navigate("/coach/search")} className="bg-primary px-8 py-3 rounded-2xl font-heading font-bold text-[15px] text-text-high flex items-center gap-2">
            <Search size={16} /> Buscar atleta
          </button>
        </div>
      ) : (
        <div className="flex-1 flex gap-0 overflow-hidden">

          {/* SIDEBAR — LISTA ATLETAS */}
          <div className="w-72 shrink-0 border-r border-text-low/20 overflow-y-auto py-4 flex flex-col gap-1 px-3">
            <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide px-2 mb-2">{clients.length} atletas activos</p>
            {clients.map(client => (
              <button key={client.id} onClick={() => setSelectedClient(client)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${selectedClient?.id === client.id ? "bg-primary/10 border border-primary" : "hover:bg-surf"}`}>
                <div className="bg-accent1 h-10 w-10 rounded-xl flex items-center justify-center font-heading font-bold text-[16px] text-primary shrink-0">
                  {client.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-[14px] text-text-high truncate">{client.fullName}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getActivityColor(client.daysSinceSession) }} />
                    <p className="font-body text-[11px] text-text-low">{formatDaysAgo(client.daysSinceSession)}</p>
                  </div>
                </div>
                <PlanBadge tier={client.subscription_tier} />
              </button>
            ))}
          </div>

          {/* CONTENIDO PRINCIPAL — DETALLE ATLETA */}
          {selectedClient && (
            <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-5">

              {/* CABECERA ATLETA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-accent1 h-16 w-16 rounded-2xl flex items-center justify-center font-heading font-bold text-[28px] text-primary">
                    {selectedClient.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-heading font-extrabold text-[24px] text-text-high">{selectedClient.fullName}</p>
                      <PlanBadge tier={selectedClient.subscription_tier} />
                    </div>
                    <p className="font-body text-[13px] text-text-low flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: getActivityColor(selectedClient.daysSinceSession) }} />
                      {formatDaysAgo(selectedClient.daysSinceSession)}
                      {selectedClient.lastSession && <span className="text-text-low/60"> · {selectedClient.lastSession.routine_name}</span>}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleEnterClient(selectedClient)} className="bg-primary px-6 py-3 rounded-2xl font-heading font-bold text-[15px] text-text-high flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <Eye size={16} /> Ver como atleta
                </button>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: <Scale size={18} className="text-accent2" />, bg: "bg-accent2/10", border: "border-accent2", label: "Peso actual", value: selectedClient.currentWeight ? `${selectedClient.currentWeight}kg` : "--" },
                  { icon: <TrendingUp size={18} className="text-accent3" />, bg: "bg-accent3/10", border: "border-accent3", label: "Mesociclo", value: selectedClient.activeProgression ? `${selectedClient.progressPct}%` : "--" },
                  { icon: <Activity size={18} className="text-orange" />, bg: "bg-orange-bg2", border: "border-orange", label: "Energia", value: selectedClient.lastCheckin?.energy_level ? `${selectedClient.lastCheckin.energy_level}/10` : "--" },
                  { icon: <Dumbbell size={18} className="text-primary" />, bg: "bg-primary-bg", border: "border-primary", label: "Altura", value: selectedClient.height_cm ? `${selectedClient.height_cm}cm` : "--" },
                ].map((stat, i) => (
                  <Card key={i}>
                    <div className={`h-10 w-10 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center mb-2`}>{stat.icon}</div>
                    <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide">{stat.label}</p>
                    <p className="font-heading font-extrabold text-[24px] text-text-high leading-none mt-1">{stat.value}</p>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* MESOCICLO ACTIVO */}
                <Card>
                  <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">Mesociclo activo</p>
                  {selectedClient.activeProgression ? (
                    <>
                      <p className="font-heading font-bold text-[18px] text-text-high mb-1">{selectedClient.activeProgression.name}</p>
                      <p className="font-body text-[13px] text-text-low mb-3">Objetivo: {selectedClient.activeProgression.goal} · {selectedClient.activeProgression.duration_weeks} semanas</p>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-body text-[12px] text-text-low">Progreso</p>
                        <p className="font-heading font-bold text-[14px] text-primary">{selectedClient.progressPct}%</p>
                      </div>
                      <div className="w-full h-2.5 bg-surf rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${selectedClient.progressPct}%` }} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center py-6 gap-2">
                      <p className="font-body text-[13px] text-text-low">Sin mesociclo activo</p>
                      <button onClick={() => handleEnterClient(selectedClient)} className="font-subheading font-bold text-[13px] text-primary">Crear uno →</button>
                    </div>
                  )}
                </Card>

                {/* SENSACIONES */}
                <Card>
                  <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">Ultima semana</p>
                  {selectedClient.lastCheckin ? (
                    <div className="flex flex-col gap-3">
                      {[
                        { label: "Calidad sueno", value: selectedClient.lastCheckin.sleep_quality, color: "#ff6b9d" },
                        { label: "Nivel energia", value: selectedClient.lastCheckin.energy_level, color: "#36d9b8" },
                        { label: "Estres percibido", value: selectedClient.lastCheckin.stress_level, color: "#f5a623" },
                      ].map(({ label, value, color }) => (
                        <div key={label}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-body text-[12px] text-text-low">{label}</p>
                            <p className="font-heading font-bold text-[13px] text-text-high">{value ?? "--"}/10</p>
                          </div>
                          {value && (
                            <div className="w-full h-1.5 bg-surf rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${(value / 10) * 100}%`, backgroundColor: color }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body text-[13px] text-text-low py-6 text-center">Sin checkin esta semana</p>
                  )}
                </Card>
              </div>

              {/* SESIONES RECIENTES */}
              <Card>
                <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">Sesiones recientes</p>
                {selectedClient.recentSessions.length === 0 ? (
                  <p className="font-body text-[13px] text-text-low py-4 text-center">Sin sesiones registradas</p>
                ) : (
                  <div className="flex flex-col divide-y divide-text-low/20">
                    {selectedClient.recentSessions.map((session, i) => (
                      <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-bg h-9 w-9 rounded-lg border border-primary flex items-center justify-center shrink-0"><Dumbbell size={16} className="text-primary" /></div>
                          <div>
                            <p className="font-subheading font-bold text-[14px] text-text-high">{session.routine_name}</p>
                            <p className="font-body text-[12px] text-text-low">{new Date(session.session_date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <div><p className="font-heading font-bold text-[14px] text-text-high">{session.total_sets || 0}</p><p className="font-body text-[10px] text-text-low">series</p></div>
                          <div><p className="font-heading font-bold text-[14px] text-text-high">{session.exercises_completed || 0}</p><p className="font-body text-[10px] text-text-low">ejercicios</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoachDashboardDesktop;