import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";

const LeaderboardMobile = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [league, setLeague] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  const [view, setView] = useState("main"); // main | create | join
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

      if (!memberData) {
        setLeague(null);
        setLoading(false);
        return;
      }

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
        .from("leagues")
        .insert({ name: leagueName.trim(), code, owner_id: user.id })
        .select()
        .single();

      if (leagueError) throw leagueError;

      const { error: memberError } = await supabase
        .from("league_members")
        .insert({ league_id: leagueData.id, user_id: user.id });

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
        .from("leagues")
        .select("*")
        .eq("code", joinCode.trim().toUpperCase())
        .single();

      if (leagueError || !leagueData) { alert("Codigo incorrecto"); setActionLoading(false); return; }

      const { error: memberError } = await supabase
        .from("league_members")
        .insert({ league_id: leagueData.id, user_id: user.id });

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
      <div className="min-h-screen bg-background flex flex-col pb-24">
        <section className="px-4 pt-6 pb-4 border-b border-text-low/20">
          <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mb-1">Liga de Constancia</p>
          <h1 className="font-heading font-extrabold text-[28px] text-text-high leading-tight">Sin liga activa</h1>
          <p className="font-body text-[13px] text-text-low mt-1">Crea una liga o unete con un codigo</p>
        </section>

        <section className="px-4 mt-6 flex flex-col gap-4">
          {view === "main" && (
            <>
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
            </>
          )}

          {view === "create" && (
            <Card>
              <p className="font-heading font-bold text-[18px] text-text-high mb-4">Crear liga</p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-1 block">Nombre de la liga</label>
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
                  className="w-full bg-primary border border-primary rounded-xl py-3 font-heading font-bold text-[15px] text-text-high hover:opacity-90 disabled:opacity-50"
                >
                  {actionLoading ? "Creando..." : "Crear liga"}
                </button>
                <button onClick={() => setView("main")} className="font-body text-[14px] text-text-low text-center">
                  Cancelar
                </button>
              </div>
            </Card>
          )}

          {view === "join" && (
            <Card>
              <p className="font-heading font-bold text-[18px] text-text-high mb-4">Unirse a una liga</p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-1 block">Codigo de invitacion</label>
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
                  className="w-full bg-primary border border-primary rounded-xl py-3 font-heading font-bold text-[15px] text-text-high hover:opacity-90 disabled:opacity-50"
                >
                  {actionLoading ? "Uniendose..." : "Unirse"}
                </button>
                <button onClick={() => setView("main")} className="font-body text-[14px] text-text-low text-center">
                  Cancelar
                </button>
              </div>
            </Card>
          )}
        </section>
      </div>
    );
  }

  // CON LIGA
  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">

      {/* HEADER */}
      <section className="px-4 pt-6 pb-4 border-b border-text-low/20">
        <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mb-1">Liga de Constancia</p>
        <h1 className="font-heading font-extrabold text-[26px] text-text-high leading-tight">{league.name}</h1>
        <p className="font-body text-[13px] text-text-low mt-1 capitalize">{currentMonth}</p>
      </section>

      {/* CODIGO DE LIGA */}
      <section className="px-4 mt-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mb-1">Codigo de invitacion</p>
              <p className="font-heading font-extrabold text-[28px] text-primary tracking-widest">{league.code}</p>
              <p className="font-body text-[12px] text-text-low">Comparte este codigo con tus amigos</p>
            </div>
            <button
              onClick={handleLeaveLeague}
              className="px-3 py-1.5 rounded-xl border border-red/40 font-subheading font-bold text-[12px] text-red hover:bg-red/10 transition-colors"
            >
              Abandonar
            </button>
          </div>
        </Card>
      </section>

      {/* TU POSICION */}
      {currentUserRank && (
        <section className="px-4 mt-4">
          <Card>
            <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mb-3">Tu posicion</p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary flex items-center justify-center font-heading font-extrabold text-[22px] text-primary shrink-0">
                {currentUserRank.rank}
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-[16px] text-primary">
                  {currentUserRank.first_name} {currentUserRank.last_name}
                </p>
                <p className="font-body text-[12px] text-text-low">
                  {currentUserRank.total_points} pts · {currentUserRank.total_sessions} entrenos · x{currentUserRank.multiplier} racha
                </p>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* RANKING */}
      <section className="px-4 mt-4">
        <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mb-3">Clasificacion</p>

        {leaderboard.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center py-8 text-center">
              <p className="font-heading font-bold text-[18px] text-text-high mb-2">Sin entrenamientos este mes</p>
              <p className="font-body text-[13px] text-text-low">Completa un entrenamiento para aparecer en el ranking</p>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {leaderboard.map((entry) => {
              const rankStyle = getRankStyle(entry.rank);
              const tierBadge = getTierBadge(entry.subscription_tier);
              const isMe = entry.user_id === user.id;

              return (
                <div
                  key={entry.user_id}
                  className={`rounded-2xl border p-4 flex items-center gap-4 ${isMe ? "bg-primary/10 border-primary" : `${rankStyle.bg} ${rankStyle.border}`}`}
                >
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center font-heading font-extrabold text-[16px] shrink-0 ${rankStyle.bg} ${rankStyle.border} ${rankStyle.text}`}>
                    {entry.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-heading font-bold text-[15px] ${isMe ? "text-primary" : "text-text-high"}`}>
                        {entry.first_name} {entry.last_name}{isMe && " (tu)"}
                      </p>
                      {tierBadge && (
                        <span className="px-2 py-0.5 rounded-full font-subheading font-bold text-[10px] border"
                          style={{ color: tierBadge.color, borderColor: tierBadge.border, backgroundColor: `${tierBadge.color}15` }}>
                          {tierBadge.label}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-[12px] text-text-low mt-0.5">
                      {entry.total_sessions} entrenos · x{entry.multiplier} racha
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-heading font-extrabold text-[20px] ${isMe ? "text-primary" : "text-text-high"}`}>{entry.total_points}</p>
                    <p className="font-body text-[11px] text-text-low">pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default LeaderboardMobile;