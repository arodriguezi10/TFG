import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";

const LeaderboardDesktop = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [league, setLeague] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  const [view, setView] = useState("main");
  const [leagueName, setLeagueName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const currentMonth = new Date().toLocaleDateString("es-ES", {
    month: "long", year: "numeric",
  });

  useEffect(() => {
    loadLeague();
  }, []);

  const loadLeague = async () => {
    try {
      setLoading(true);
      const { data: memberData } = await supabase
        .from("league_members")
        .select("*, leagues(*)")
        .eq("user_id", user.id)
        .maybeSingle();

        console.log("memberData:", memberData);
    console.log("league_id:", memberData?.league_id);

      if (!memberData) { setLeague(null); setLoading(false); return; }

      setLeague(memberData.leagues);
      await loadLeaderboard(memberData.league_id);
    } catch (err) {
      console.error("Error cargando liga:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (leagueId) => {
  const { data, error } = await supabase
    .from("league_leaderboard")
    .select("*")
    .eq("league_id", leagueId);

  if (error) { console.error("Error cargando ranking:", error); return; }

  console.log("Leaderboard data:", data);

  const ranked = (data || []).map((entry, index) => ({ ...entry, rank: index + 1 }));
  setLeaderboard(ranked);

  const userEntry = ranked.find((e) => e.user_id === user.id);
  if (userEntry) setCurrentUserRank(userEntry);
};

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const handleCreateLeague = async () => {
    if (!leagueName.trim()) { alert("Escribe un nombre para la liga"); return; }
    setActionLoading(true);
    try {
      const code = generateCode();
      const { data: leagueData, error: leagueError } = await supabase
        .from("leagues").insert({ name: leagueName.trim(), code, owner_id: user.id })
        .select().single();
      if (leagueError) throw leagueError;

      const { error: memberError } = await supabase
        .from("league_members").insert({ league_id: leagueData.id, user_id: user.id });
      if (memberError) throw memberError;

      setLeague(leagueData);
      setView("main");
      await loadLeaderboard(leagueData.id);
    } catch (err) {
      console.error("Error creando liga:", err);
      alert("Error al crear la liga");
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinLeague = async () => {
    if (!joinCode.trim()) { alert("Escribe el codigo de la liga"); return; }
    setActionLoading(true);
    try {
      const { data: leagueData, error: leagueError } = await supabase
        .from("leagues").select("*").eq("code", joinCode.trim().toUpperCase()).single();
      if (leagueError || !leagueData) { alert("Codigo incorrecto"); setActionLoading(false); return; }

      const { error: memberError } = await supabase
        .from("league_members").insert({ league_id: leagueData.id, user_id: user.id });
      if (memberError) throw memberError;

      setLeague(leagueData);
      setView("main");
      await loadLeaderboard(leagueData.id);
    } catch (err) {
      console.error("Error uniendose:", err);
      alert("Error al unirse a la liga");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveLeague = async () => {
    if (!window.confirm("Seguro que quieres abandonar la liga?")) return;
    try {
      await supabase.from("league_members").delete()
        .eq("user_id", user.id).eq("league_id", league.id);
      setLeague(null);
      setLeaderboard([]);
      setCurrentUserRank(null);
    } catch (err) {
      console.error("Error abandonando liga:", err);
    }
  };

  const getTierBadge = (tier) => {
    if (tier === "elite") return { label: "Elite", color: "#f5a623", border: "rgba(245,166,35,0.4)" };
    if (tier === "pro") return { label: "Pro", color: "#6c63ff", border: "rgba(108,99,255,0.4)" };
    return null;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return { bg: "bg-yellow-500/10", border: "border-yellow-500", text: "text-yellow-400" };
    if (rank === 2) return { bg: "bg-slate-400/10", border: "border-slate-400", text: "text-slate-300" };
    if (rank === 3) return { bg: "bg-orange-700/10", border: "border-orange-700", text: "text-orange-500" };
    return { bg: "bg-surf", border: "border-text-low/20", text: "text-text-low" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // SIN LIGA
  if (!league) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-2">Liga de Constancia</p>
            <h1 className="font-heading font-extrabold text-[36px] text-text-high">Sin liga activa</h1>
            <p className="font-body text-[15px] text-text-low mt-2">Crea una liga privada o unete con un codigo</p>
          </div>

          {view === "main" && (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setView("create")}
                className="w-full bg-primary border border-primary rounded-2xl py-4 font-heading font-bold text-[16px] text-text-high hover:opacity-90 transition-opacity"
              >
                Crear nueva liga
              </button>
              <button
                onClick={() => setView("join")}
                className="w-full bg-surf border border-text-low rounded-2xl py-4 font-heading font-bold text-[16px] text-text-high hover:border-primary transition-colors"
              >
                Unirse con codigo
              </button>
            </div>
          )}

          {view === "create" && (
            <Card>
              <p className="font-heading font-bold text-[20px] text-text-high mb-6">Crear liga</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-2 block">Nombre de la liga</label>
                  <input
                    type="text"
                    placeholder="Los Gigantes"
                    value={leagueName}
                    onChange={(e) => setLeagueName(e.target.value)}
                    className="w-full bg-background border border-text-low rounded-xl px-4 py-3 font-body text-[15px] text-text-high outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  onClick={handleCreateLeague}
                  disabled={actionLoading}
                  className="w-full bg-primary border border-primary rounded-xl py-3.5 font-heading font-bold text-[15px] text-text-high hover:opacity-90 disabled:opacity-50"
                >
                  {actionLoading ? "Creando..." : "Crear liga"}
                </button>
                <button onClick={() => setView("main")} className="font-body text-[14px] text-text-low text-center hover:text-text-high">
                  Cancelar
                </button>
              </div>
            </Card>
          )}

          {view === "join" && (
            <Card>
              <p className="font-heading font-bold text-[20px] text-text-high mb-6">Unirse a una liga</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-2 block">Codigo de invitacion</label>
                  <input
                    type="text"
                    placeholder="ABC123"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full bg-background border border-text-low rounded-xl px-4 py-3 font-body text-[15px] text-text-high outline-none focus:border-primary transition-colors uppercase"
                  />
                </div>
                <button
                  onClick={handleJoinLeague}
                  disabled={actionLoading}
                  className="w-full bg-primary border border-primary rounded-xl py-3.5 font-heading font-bold text-[15px] text-text-high hover:opacity-90 disabled:opacity-50"
                >
                  {actionLoading ? "Uniendose..." : "Unirse"}
                </button>
                <button onClick={() => setView("main")} className="font-body text-[14px] text-text-low text-center hover:text-text-high">
                  Cancelar
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // CON LIGA
  return (
    <div className="min-h-screen bg-background p-8">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-1">Liga de Constancia</p>
          <h1 className="font-heading font-extrabold text-[32px] text-text-high leading-tight">{league.name}</h1>
          <p className="font-body text-[14px] text-text-low mt-1 capitalize">{currentMonth}</p>
        </div>
        <button
          onClick={handleLeaveLeague}
          className="px-4 py-2 rounded-xl border border-red/40 font-subheading font-bold text-[13px] text-red hover:bg-red/10 transition-colors"
        >
          Abandonar liga
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* COLUMNA IZQUIERDA */}
        <div className="col-span-1 flex flex-col gap-6">

          {/* CODIGO */}
          <Card>
            <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mb-2">Codigo de invitacion</p>
            <p className="font-heading font-extrabold text-[36px] text-primary tracking-widest mb-1">{league.code}</p>
            <p className="font-body text-[12px] text-text-low">Comparte este codigo con tus amigos para que se unan</p>
          </Card>

          {/* TU POSICION */}
          {currentUserRank && (
            <Card>
              <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mb-4">Tu posicion</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary flex items-center justify-center font-heading font-extrabold text-[22px] text-primary shrink-0">
                  {currentUserRank.rank}
                </div>
                <div>
                  <p className="font-heading font-bold text-[16px] text-primary">
                    {currentUserRank.first_name} {currentUserRank.last_name}
                  </p>
                  <p className="font-body text-[12px] text-text-low">Posicion actual</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Puntos", value: currentUserRank.total_points },
                  { label: "Entrenos", value: currentUserRank.total_sessions },
                  { label: "Bonus", value: `+${currentUserRank.bonus_points}` },
                  { label: "Racha", value: `x${currentUserRank.multiplier}` },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surf rounded-xl p-3 border border-text-low/20">
                    <p className="font-heading font-bold text-[18px] text-text-high">{stat.value}</p>
                    <p className="font-body text-[11px] text-text-low">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* REGLAS */}
          <Card>
            <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mb-4">Como se puntua</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Asistencia", pts: "+10", desc: "Por entrenamiento completado" },
                { label: "Precision", pts: "+5", desc: "Volumen exacto pautado" },
                { label: "Racha", pts: "x1.1", desc: "Por semana consecutiva" },
              ].map((rule) => (
                <div key={rule.label} className="flex gap-3 items-start">
                  <div className="h-7 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-heading font-bold text-[11px] text-primary shrink-0">
                    {rule.pts}
                  </div>
                  <div>
                    <p className="font-subheading font-bold text-[13px] text-text-high">{rule.label}</p>
                    <p className="font-body text-[11px] text-text-low">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* COLUMNA DERECHA — ranking */}
        <div className="col-span-2">
          <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">Clasificacion</p>

          {leaderboard.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center py-12 text-center">
                <p className="font-heading font-bold text-[20px] text-text-high mb-2">Sin entrenamientos este mes</p>
                <p className="font-body text-[14px] text-text-low">Completa un entrenamiento para aparecer en el ranking</p>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-[48px_1fr_80px_80px_80px_80px] gap-4 px-4 py-2">
                <div className="font-subheading font-bold text-[11px] text-text-low uppercase">#</div>
                <div className="font-subheading font-bold text-[11px] text-text-low uppercase">Atleta</div>
                <div className="font-subheading font-bold text-[11px] text-text-low uppercase text-center">Entrenos</div>
                <div className="font-subheading font-bold text-[11px] text-text-low uppercase text-center">Bonus</div>
                <div className="font-subheading font-bold text-[11px] text-text-low uppercase text-center">Racha</div>
                <div className="font-subheading font-bold text-[11px] text-text-low uppercase text-right">Puntos</div>
              </div>

              {leaderboard.map((entry) => {
                const rankStyle = getRankStyle(entry.rank);
                const tierBadge = getTierBadge(entry.subscription_tier);
                const isMe = entry.user_id === user.id;

                return (
                  <div
                    key={entry.user_id}
                    className={`rounded-2xl border grid grid-cols-[48px_1fr_80px_80px_80px_80px] gap-4 px-4 py-3 items-center ${
                      isMe ? "bg-primary/10 border-primary" : `${rankStyle.bg} ${rankStyle.border}`
                    }`}
                  >
                    <div className={`font-heading font-extrabold text-[18px] ${isMe ? "text-primary" : rankStyle.text}`}>
                      {entry.rank}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <p className={`font-heading font-bold text-[15px] truncate ${isMe ? "text-primary" : "text-text-high"}`}>
                        {entry.first_name} {entry.last_name}{isMe && " (tu)"}
                      </p>
                      {tierBadge && (
                        <span className="px-2 py-0.5 rounded-full font-subheading font-bold text-[10px] border shrink-0"
                          style={{ color: tierBadge.color, borderColor: tierBadge.border, backgroundColor: `${tierBadge.color}15` }}>
                          {tierBadge.label}
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="font-heading font-bold text-[15px] text-text-high">{entry.total_sessions}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-heading font-bold text-[15px] text-text-high">+{entry.bonus_points}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-heading font-bold text-[15px] text-text-high">x{entry.multiplier}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-heading font-extrabold text-[20px] ${isMe ? "text-primary" : "text-text-high"}`}>
                        {entry.total_points}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardDesktop;