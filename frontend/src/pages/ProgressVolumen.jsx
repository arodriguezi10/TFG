import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";

import { BarChart2, Lock, Star, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, ArrowUp, ArrowDown, Activity } from "lucide-react";


// Valores MEV/MRV estandar de literatura cientifica de hipertrofia
const MEV_MRV = {
  "Pecho":       { mev: 8,  mrv: 20 },
  "Espalda":     { mev: 9,  mrv: 20 },
  "Hombro":      { mev: 8,  mrv: 17 },
  "Cuádriceps":  { mev: 10, mrv: 16 },
  "Femoral":     { mev: 6,  mrv: 18 },
  "Bíceps":      { mev: 8,  mrv: 18 },
  "Tríceps":     { mev: 8,  mrv: 18 },
  "Glúteo":      { mev: 6,  mrv: 16 },
  "Core":        { mev: 8,  mrv: 16 },
};

// Colores por estado de volumen
const STATUS_CONFIG = {
  mev_bajo:    { label: "MEV Bajo",         color: "#36d9b8", border: "#36d9b8", bg: "rgba(54,217,184,0.1)",  fatiga: "Mínima",  fatigaColor: "#36d9b8" },
  mav_optimo:  { label: "MAV Óptimo",       color: "#6c63ff", border: "#6c63ff", bg: "rgba(108,99,255,0.1)", fatiga: "Óptima",  fatigaColor: "#6c63ff" },
  cerca_mrv:   { label: "Cerca MRV",        color: "#f5a623", border: "#f5a623", bg: "rgba(245,166,35,0.1)", fatiga: "Media",   fatigaColor: "#f5a623" },
  mrv_excedido:{ label: "MRV Excedido",     color: "#ff5757", border: "#ff5757", bg: "rgba(255,87,87,0.1)",  fatiga: "Alta",    fatigaColor: "#ff5757" },
};

// Colores de la leyenda superior
const LEGEND = [
  { label: "Mantenimiento", color: "#36d9b8" },
  { label: "MAV óptimo",   color: "#6c63ff" },
  { label: "Cerca MRV",    color: "#f5a623" },
  { label: "MRV Excedido", color: "#ff5757" },
];

const ProgressVolumen = ({ subscriptionTier }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [muscleData, setMuscleData] = useState([]);
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0); // 0 = semana actual
  const [weekOptions, setWeekOptions] = useState([]);

  // Solo elite puede ver esta pantalla
  const isElite = subscriptionTier === "elite";

  useEffect(() => {
    if (user && isElite) loadVolumeData(0);
    else setLoading(false);
  }, [user]);

  // Obtiene el lunes y domingo de una semana dado un offset (0 = actual, -1 = anterior...)
  const getWeekRange = (offset) => {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { monday, sunday };
  };

  const formatWeekLabel = (offset) => {
    if (offset === 0) return "Semana actual";
    const { monday, sunday } = getWeekRange(offset);
    const fmt = (d) => d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    return `${fmt(monday)} - ${fmt(sunday)}`;
  };

  // Calcula el estado de volumen segun series vs MEV/MRV
  const getVolumeStatus = (series, mev, mrv) => {
    const mav = Math.round((mev + mrv) / 2);
    if (series < mev) return "mev_bajo";
    if (series <= mav) return "mav_optimo";
    if (series < mrv) return "cerca_mrv";
    return "mrv_excedido";
  };

  // Calcula tendencia comparando con semana anterior
  const getTrend = (currentSeries, prevSeries) => {
    if (prevSeries === null) return null;
    return currentSeries - prevSeries;
  };

  const loadVolumeData = async (weekOffset) => {
    setLoading(true);
    try {
      const { monday, sunday } = getWeekRange(weekOffset);
      const { monday: prevMonday, sunday: prevSunday } = getWeekRange(weekOffset - 1);

      const mondayStr = monday.toISOString().split("T")[0];
      const sundayStr = sunday.toISOString().split("T")[0];
      const prevMondayStr = prevMonday.toISOString().split("T")[0];
      const prevSundayStr = prevSunday.toISOString().split("T")[0];

      // Sesiones de la semana actual
      const { data: currentSessions } = await supabase
        .from("workout_sessions")
        .select("id, session_date")
        .eq("user_id", user.id)
        .gte("session_date", mondayStr)
        .lte("session_date", sundayStr);

      // Sesiones de la semana anterior (para tendencia)
      const { data: prevSessions } = await supabase
        .from("workout_sessions")
        .select("id")
        .eq("user_id", user.id)
        .gte("session_date", prevMondayStr)
        .lte("session_date", prevSundayStr);

      // Logs semana actual
      let currentLogs = [];
      if (currentSessions && currentSessions.length > 0) {
        const ids = currentSessions.map((s) => s.id);
        const { data: logs } = await supabase
          .from("workout_exercise_logs")
          .select("exercise_id, completed")
          .in("session_id", ids)
          .eq("completed", true);
        currentLogs = logs || [];
      }

      // Logs semana anterior
      let prevLogs = [];
      if (prevSessions && prevSessions.length > 0) {
        const ids = prevSessions.map((s) => s.id);
        const { data: logs } = await supabase
          .from("workout_exercise_logs")
          .select("exercise_id, completed")
          .in("session_id", ids)
          .eq("completed", true);
        prevLogs = logs || [];
      }

      // Obtener todos los exercise_ids unicos de ambas semanas
      const allIds = [...new Set([
        ...currentLogs.map((l) => l.exercise_id),
        ...prevLogs.map((l) => l.exercise_id),
      ])];

      if (allIds.length === 0) {
        setMuscleData([]);
        setLoading(false);
        return;
      }

      // Obtener muscle_group de cada ejercicio
      const { data: exerciseList } = await supabase
        .from("exercises")
        .select("id, muscle_group")
        .in("id", allIds);

      const exerciseMap = {};
      (exerciseList || []).forEach((e) => { exerciseMap[e.id] = e.muscle_group; });

      // Contar series por grupo muscular semana actual
      const currentSeriesByMuscle = {};
      currentLogs.forEach((log) => {
        const muscle = exerciseMap[log.exercise_id];
        if (!muscle || !MEV_MRV[muscle]) return;
        currentSeriesByMuscle[muscle] = (currentSeriesByMuscle[muscle] || 0) + 1;
      });

      // Contar series por grupo muscular semana anterior
      const prevSeriesByMuscle = {};
      prevLogs.forEach((log) => {
        const muscle = exerciseMap[log.exercise_id];
        if (!muscle || !MEV_MRV[muscle]) return;
        prevSeriesByMuscle[muscle] = (prevSeriesByMuscle[muscle] || 0) + 1;
      });

      // Construir datos por grupo muscular
      const result = Object.keys(MEV_MRV)
        .filter((muscle) => currentSeriesByMuscle[muscle] !== undefined)
        .map((muscle) => {
          const series = currentSeriesByMuscle[muscle] || 0;
          const prevSeries = prevSeriesByMuscle[muscle] ?? null;
          const { mev, mrv } = MEV_MRV[muscle];
          const status = getVolumeStatus(series, mev, mrv);
          const trend = getTrend(series, prevSeries);
          const progressPct = Math.min((series / mrv) * 100, 100);

          return { muscle, series, prevSeries, mev, mrv, status, trend, progressPct };
        })
        .sort((a, b) => b.series - a.series);

      setMuscleData(result);

      // Generar opciones de semana (ultimas 8 semanas)
      const options = Array.from({ length: 8 }, (_, i) => ({
        offset: -i,
        label: formatWeekLabel(-i),
      }));
      setWeekOptions(options);

    } catch (err) {
      console.error("Error cargando volumen:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWeekChange = (offset) => {
    setSelectedWeekOffset(offset);
    loadVolumeData(offset);
  };

  // Analisis de fatiga hardcodeado segun status
  const getFatigaAnalysis = (item) => {
    const { series, mev, mrv, status, trend } = item;
    const mav = Math.round((mev + mrv) / 2);

    switch (status) {
      case "mrv_excedido":
        return {
          icon: <AlertTriangle size={18} color="#f5a623" />,
          iconBg: "rgba(255,87,87,0.1)",
          iconBorder: "#ff5757",
          iconColor: "#ff5757",
          statusLabel: "MRV Superado",
          statusColor: "#ff5757",
          statusBg: "rgba(255,87,87,0.1)",
          descripcion: `+${series - mrv} series sobre MRV. Fatiga acumulada alta. Riesgo de sobreentrenamiento si continúa este patrón el próximo microciclo.`,
          recomendacion: `Reduce -${Math.ceil((series - mav) / 2)} series próx. microciclo`,
          recomendacionColor: "#ff5757",
        };
      case "cerca_mrv":
        return {
          icon: <AlertTriangle size={18} color="#f5a623" />,
          iconBg: "rgba(245,166,35,0.1)",
          iconBorder: "#f5a623",
          iconColor: "#f5a623",
          statusLabel: "Cerca MRV",
          statusColor: "#f5a623",
          statusBg: "rgba(245,166,35,0.1)",
          descripcion: `${series} series, a ${mrv - series} serie${mrv - series !== 1 ? "s" : ""} del MRV (${mrv}). ${trend > 0 ? `Tendencia alcista las últimas semanas.` : ""} Fatiga media acumulándose.`,
          recomendacion: "No aumentes volumen",
          recomendacionColor: "#f5a623",
        };
      case "mav_optimo":
        return {
          icon: < CheckCircle2 size={18} color="#6c63ff" />,
          iconBg: "rgba(108,99,255,0.1)",
          iconBorder: "#6c63ff",
          iconColor: "#6c63ff",
          statusLabel: "MAV Óptimo",
          statusColor: "#6c63ff",
          statusBg: "rgba(108,99,255,0.1)",
          descripcion: `${series} series en zona MAV. Fatiga baja, recuperación completa entre sesiones. Progresión sostenible.`,
          recomendacion: "Mantener volumen actual",
          recomendacionColor: "#6c63ff",
        };
      case "mev_bajo":
      default:
        return {
          icon: <ArrowUp size={18} color="#36d9b8" />,
          iconBg: "rgba(54,217,184,0.1)",
          iconBorder: "#36d9b8",
          iconColor: "#36d9b8",
          statusLabel: "MEV Bajo",
          statusColor: "#36d9b8",
          statusBg: "rgba(54,217,184,0.1)",
          descripcion: `${series} series, ${mev - series} del umbral mínimo de estímulo. Sin hipertrofia posible.`,
          recomendacion: `Añade +${mev - series} series próx. sem.`,
          recomendacionColor: "#36d9b8",
        };
    }
  };

  // Proyeccion de recuperacion en dias segun fatiga
  const getRecoveryDays = (status) => {
    switch (status) {
      case "mrv_excedido": return { days: "4-5d", label: "Alta fatiga",    color: "#ff5757" };
      case "cerca_mrv":    return { days: "2-3d", label: "Precaución",     color: "#f5a623" };
      case "mav_optimo":   return { days: "2d",   label: "En progreso",    color: "#6c63ff" };
      case "mev_bajo":     return { days: "1d",   label: "Sin fatiga",     color: "#36d9b8" };
      default:             return { days: "1d",   label: "Recup.",         color: "#36d9b8" };
    }
  };

  // Pantalla bloqueada para no elite
  if (!isElite) {
  return (
    <div className="flex flex-col px-4 gap-6 py-8">

      {/* ICONO Y BADGE */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-28 w-28 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <BarChart2 size={52} className="text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 bg-yellow-500 h-8 w-8 rounded-full flex items-center justify-center">
            <Lock size={14} className="text-background" />
          </div>
        </div>

        <span className="bg-yellow-500/10 border border-yellow-500 px-4 py-1 rounded-full font-subheading font-bold text-[13px] text-yellow-500">
          FUNCIÓN ÉLITE
        </span>
      </div>

      {/* TITULO */}
      <div className="text-center">
        <h2 className="font-heading font-extrabold text-[26px] text-text-high leading-tight mb-2">
          Análisis de<br />
          <span className="text-primary">Volumen Efectivo</span>
        </h2>
        <p className="font-body text-[14px] text-text-low leading-relaxed">
          Controla tu volumen semanal por grupo muscular basado en los rangos MEV y MRV de la literatura científica de hipertrofia.
        </p>
      </div>

      {/* FEATURES */}
      <div className="flex flex-col gap-3">
        {[
          { icon: <Activity size={18} className="text-primary" />, title: "MEV y MRV por músculo", desc: "Saber exactamente cuántas series necesitas para crecer" },
          { icon: <TrendingUp size={18} className="text-blue-500" />, title: "Tendencia semanal", desc: "Compara tu volumen con la semana anterior" },
          { icon: <AlertTriangle size={18} className="text-orange-400" />, title: "Análisis de fatiga", desc: "Detecta sobreentrenamiento antes de que ocurra" },
          { icon: <CheckCircle2 size={18} className="text-green" />, title: "Proyección de recuperación", desc: "Días estimados hasta recuperación completa por músculo" },
        ].map((f) => (
          <div key={f.title} className="flex items-start gap-4 bg-surf border border-text-low/20 rounded-2xl p-4">
            <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shrink-0">
              {f.icon}
            </div>
            <div>
              <p className="font-heading font-bold text-[15px] text-text-high mb-0.5">{f.title}</p>
              <p className="font-body text-[13px] text-text-low">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/subscription")}
        className="w-full bg-primary border border-primary rounded-2xl py-4 font-heading font-bold text-[16px] text-text-high hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <Star size={18} />
        Ver planes
      </button>
    </div>
  );
}

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 gap-4">

      {/* SELECTOR DE SEMANA */}
      <div className="flex items-center justify-between">
        <p className="font-heading font-extrabold text-[20px] text-text-high">
          Distribución semanal
        </p>
        <select
          value={selectedWeekOffset}
          onChange={(e) => handleWeekChange(Number(e.target.value))}
          className="bg-surf border border-text-low rounded-xl px-3 py-2 font-subheading font-bold text-[13px] text-text-high outline-none"
        >
          {weekOptions.map((opt) => (
            <option key={opt.offset} value={opt.offset}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <p className="font-body text-[12px] text-text-low -mt-2">
        de Volumen Efectivo
      </p>

      {/* LEYENDA */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            <p className="font-body text-[11px] text-text-low">{l.label}</p>
          </div>
        ))}
      </div>

      {/* TARJETAS POR GRUPO MUSCULAR */}
      {muscleData.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center py-10 gap-3">
            <span className="text-[40px]">📊</span>
            <p className="font-heading font-bold text-[16px] text-text-high">Sin datos esta semana</p>
            <p className="font-body text-[13px] text-text-low text-center">
              Completa entrenamientos para ver tu análisis de volumen
            </p>
          </div>
        </Card>
      ) : (
        muscleData.map((item) => {
          const config = STATUS_CONFIG[item.status];
          return (
            <div
              key={item.muscle}
              className="rounded-2xl p-4 border"
              style={{ backgroundColor: config.bg, borderColor: config.border }}
            >
              {/* Cabecera */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-[18px]"
                  style={{ backgroundColor: config.bg, border: `1px solid ${config.border}` }}
                >
                  <Activity size={18} color={config.color} />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-[18px] text-text-high">
                    {item.muscle}
                  </p>
                  <span
                    className="inline-flex px-2.5 py-0.5 rounded-full font-subheading font-bold text-[11px]"
                    style={{ backgroundColor: config.bg, border: `1px solid ${config.border}`, color: config.color }}
                  >
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Series y fatiga */}
              <div className="flex items-center gap-3 mb-3">
                <p className="font-body text-[13px] text-text-low">
                  {item.series} series · Fatiga:
                </p>
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-subheading font-bold text-[12px]"
                  style={{ border: `1px solid ${config.color}`, color: config.color }}
                >
                  {config.fatiga}
                  {item.status === "mrv_excedido" && " ↑↑"}
                  {item.status === "cerca_mrv" && " ↑"}
                  {item.status === "mav_optimo" && " ✓"}
                  {item.status === "mev_bajo" && ""}
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full h-2 bg-background/40 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.progressPct}%`, backgroundColor: config.color }}
                />
              </div>

              {/* MEV / series / MRV */}
              <div className="flex justify-between mb-3">
                <p className="font-body text-[11px] text-text-low">MEV {item.mev}</p>
                <p className="font-body text-[11px]" style={{ color: config.color }}>
                  {item.series} series
                </p>
                <p className="font-body text-[11px] text-red">MRV {item.mrv}</p>
              </div>

              {/* Tendencia */}
              {item.trend !== null && (
                <div className="flex items-center justify-between">
                  <p className="font-body text-[11px] text-text-low">Tendencia 4 sem:</p>
                  <p
                    className="font-subheading font-bold text-[12px]"
                    style={{ color: item.trend >= 0 ? config.color : "#ff5757" }}
                  >
                    {item.trend >= 0 ? `↑ +${item.trend} ser.` : `↓ ${item.trend} ser.`}
                  </p>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* ANALISIS DE FATIGA Y RECUPERACION */}
      {muscleData.length > 0 && (
        <>
          <div className="flex items-center gap-2 mt-2">
            <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
              Analisis de fatiga y recuperacion
            </p>
            <span className="bg-yellow-bg2 border border-orange px-2 py-0.5 rounded-full font-subheading font-bold text-[10px] text-orange">
              ÉLITE
            </span>
          </div>

          <Card>
            <div className="flex flex-col divide-y divide-text-low/20">
              {muscleData.map((item) => {
                const analysis = getFatigaAnalysis(item);
                return (
                  <div key={item.muscle} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3 mb-2">
                      {/* Icono estado */}
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-[16px] shrink-0"
                        style={{ backgroundColor: analysis.iconBg, border: `1px solid ${analysis.iconBorder}`, color: analysis.iconColor }}
                      >
                        {analysis.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-heading font-bold text-[16px] text-text-high">
                            {item.muscle}
                          </p>
                          <span
                            className="inline-flex px-2 py-0.5 rounded-full font-subheading font-bold text-[10px]"
                            style={{ backgroundColor: analysis.statusBg, border: `1px solid ${analysis.statusColor}`, color: analysis.statusColor }}
                          >
                            {analysis.statusLabel}
                          </span>
                        </div>
                        <p className="font-body text-[12px] text-text-low leading-relaxed">
                          {analysis.descripcion}
                        </p>
                      </div>
                    </div>

                    {/* Recomendacion */}
                    <span
                      className="inline-flex px-3 py-1 rounded-full font-subheading font-bold text-[12px] border"
                      style={{ color: analysis.recomendacionColor, borderColor: analysis.recomendacionColor, backgroundColor: `${analysis.recomendacionColor}10` }}
                    >
                      {analysis.recomendacion}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* PROYECCION DE RECUPERACION */}
          <div
            className="rounded-2xl p-4 border"
            style={{ backgroundColor: "rgba(245,166,35,0.05)", borderColor: "#f5a623" }}
          >
            <p className="font-heading font-bold text-[16px] text-text-high mb-1">
              Proyección de recuperación
            </p>
            <p className="font-body text-[12px] text-text-low mb-4">
              Días estimados hasta recuperación completa
            </p>

            <div className="grid grid-cols-3 gap-2">
              {muscleData.map((item) => {
                const recovery = getRecoveryDays(item.status);
                return (
                  <div
                    key={item.muscle}
                    className="bg-surf rounded-xl p-2.5 flex flex-col gap-0.5"
                  >
                    <p className="font-body text-[10px] text-text-low">{item.muscle}</p>
                    <p
                      className="font-heading font-extrabold text-[22px] leading-none"
                      style={{ color: recovery.color }}
                    >
                      {recovery.days}
                    </p>
                    <p className="font-body text-[10px] text-text-low">{recovery.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressVolumen;