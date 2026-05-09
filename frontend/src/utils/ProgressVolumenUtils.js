import { supabase } from "../services/supabase";
import React from "react";
import { AlertTriangle, CheckCircle2, ArrowUp } from "lucide-react";

export const MEV_MRV = {
  "Pecho":      { mev: 8,  mrv: 20 },
  "Espalda":    { mev: 9,  mrv: 20 },
  "Hombro":     { mev: 8,  mrv: 17 },
  "Cuádriceps": { mev: 10, mrv: 16 },
  "Femoral":    { mev: 6,  mrv: 18 },
  "Bíceps":     { mev: 8,  mrv: 18 },
  "Tríceps":    { mev: 8,  mrv: 18 },
  "Glúteo":     { mev: 6,  mrv: 16 },
  "Core":       { mev: 8,  mrv: 16 },
};

export const STATUS_CONFIG = {
  mev_bajo:    { label: "MEV Bajo",    color: "#36d9b8", border: "#36d9b8", bg: "rgba(54,217,184,0.1)",  fatiga: "Minima",  fatigaColor: "#36d9b8" },
  mav_optimo:  { label: "MAV Optimo", color: "#6c63ff", border: "#6c63ff", bg: "rgba(108,99,255,0.1)", fatiga: "Optima",  fatigaColor: "#6c63ff" },
  cerca_mrv:   { label: "Cerca MRV",  color: "#f5a623", border: "#f5a623", bg: "rgba(245,166,35,0.1)", fatiga: "Media",   fatigaColor: "#f5a623" },
  mrv_excedido:{ label: "MRV Excedido",color: "#ff5757", border: "#ff5757", bg: "rgba(255,87,87,0.1)",  fatiga: "Alta",    fatigaColor: "#ff5757" },
};

export const LEGEND = [
  { label: "Mantenimiento", color: "#36d9b8" },
  { label: "MAV optimo",    color: "#6c63ff" },
  { label: "Cerca MRV",    color: "#f5a623" },
  { label: "MRV Excedido", color: "#ff5757" },
];

export const getWeekRange = (offset) => {
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

export const formatWeekLabel = (offset) => {
  if (offset === 0) return "Semana actual";
  const { monday, sunday } = getWeekRange(offset);
  const fmt = (d) => d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  return `${fmt(monday)} - ${fmt(sunday)}`;
};

export const getVolumeStatus = (series, mev, mrv) => {
  const mav = Math.round((mev + mrv) / 2);
  if (series < mev) return "mev_bajo";
  if (series <= mav) return "mav_optimo";
  if (series < mrv) return "cerca_mrv";
  return "mrv_excedido";
};

export const getRecoveryDays = (status) => {
  switch (status) {
    case "mrv_excedido": return { days: "4-5d", label: "Alta fatiga", color: "#ff5757" };
    case "cerca_mrv":    return { days: "2-3d", label: "Precaucion",  color: "#f5a623" };
    case "mav_optimo":   return { days: "2d",   label: "En progreso", color: "#6c63ff" };
    default:             return { days: "1d",   label: "Sin fatiga",  color: "#36d9b8" };
  }
};

export const getFatigaAnalysis = (item) => {
  const { series, mev, mrv, status, trend } = item;
  const mav = Math.round((mev + mrv) / 2);
  switch (status) {
    case "mrv_excedido":
      return {
        icon: React.createElement(AlertTriangle, { size: 18, color: "#ff5757" }),
        iconBg: "rgba(255,87,87,0.1)", iconBorder: "#ff5757", iconColor: "#ff5757",
        statusLabel: "MRV Superado", statusColor: "#ff5757", statusBg: "rgba(255,87,87,0.1)",
        descripcion: `+${series - mrv} series sobre MRV. Fatiga acumulada alta. Riesgo de sobreentrenamiento.`,
        recomendacion: `Reduce -${Math.ceil((series - mav) / 2)} series prox. microciclo`,
        recomendacionColor: "#ff5757",
      };
    case "cerca_mrv":
      return {
        icon: React.createElement(AlertTriangle, { size: 18, color: "#f5a623" }),
        iconBg: "rgba(245,166,35,0.1)", iconBorder: "#f5a623", iconColor: "#f5a623",
        statusLabel: "Cerca MRV", statusColor: "#f5a623", statusBg: "rgba(245,166,35,0.1)",
        descripcion: `${series} series, a ${mrv - series} serie${mrv - series !== 1 ? "s" : ""} del MRV (${mrv}). ${trend > 0 ? "Tendencia alcista." : ""} Fatiga media acumulandose.`,
        recomendacion: "No aumentes volumen", recomendacionColor: "#f5a623",
      };
    case "mav_optimo":
      return {
        icon: React.createElement(CheckCircle2, { size: 18, color: "#6c63ff" }),
        iconBg: "rgba(108,99,255,0.1)", iconBorder: "#6c63ff", iconColor: "#6c63ff",
        statusLabel: "MAV Optimo", statusColor: "#6c63ff", statusBg: "rgba(108,99,255,0.1)",
        descripcion: `${series} series en zona MAV. Fatiga baja, recuperacion completa. Progresion sostenible.`,
        recomendacion: "Mantener volumen actual", recomendacionColor: "#6c63ff",
      };
    default:
      return {
        icon: React.createElement(ArrowUp, { size: 18, color: "#36d9b8" }),
        iconBg: "rgba(54,217,184,0.1)", iconBorder: "#36d9b8", iconColor: "#36d9b8",
        statusLabel: "MEV Bajo", statusColor: "#36d9b8", statusBg: "rgba(54,217,184,0.1)",
        descripcion: `${series} series, ${mev - series} del umbral minimo de estimulo. Sin hipertrofia posible.`,
        recomendacion: `Anade +${mev - series} series prox. sem.`, recomendacionColor: "#36d9b8",
      };
  }
};

export const loadVolumeData = async (user, weekOffset, setMuscleData, setWeekOptions, setLoading) => {
  setLoading(true);
  try {
    const { monday, sunday } = getWeekRange(weekOffset);
    const { monday: prevMonday, sunday: prevSunday } = getWeekRange(weekOffset - 1);

    const mondayStr = monday.toISOString().split("T")[0];
    const sundayStr = sunday.toISOString().split("T")[0];
    const prevMondayStr = prevMonday.toISOString().split("T")[0];
    const prevSundayStr = prevSunday.toISOString().split("T")[0];

    const { data: currentSessions } = await supabase.from("workout_sessions").select("id").eq("user_id", user.id).gte("session_date", mondayStr).lte("session_date", sundayStr);
    const { data: prevSessions } = await supabase.from("workout_sessions").select("id").eq("user_id", user.id).gte("session_date", prevMondayStr).lte("session_date", prevSundayStr);

    let currentLogs = [];
    if (currentSessions?.length > 0) {
      const { data: logs } = await supabase.from("workout_exercise_logs").select("exercise_id, completed").in("session_id", currentSessions.map(s => s.id)).eq("completed", true);
      currentLogs = logs || [];
    }

    let prevLogs = [];
    if (prevSessions?.length > 0) {
      const { data: logs } = await supabase.from("workout_exercise_logs").select("exercise_id, completed").in("session_id", prevSessions.map(s => s.id)).eq("completed", true);
      prevLogs = logs || [];
    }

    const allIds = [...new Set([...currentLogs.map(l => l.exercise_id), ...prevLogs.map(l => l.exercise_id)])];
    if (allIds.length === 0) { setMuscleData([]); setLoading(false); return; }

    const { data: exerciseList } = await supabase.from("exercises").select("id, muscle_group").in("id", allIds);
    const exerciseMap = {};
    (exerciseList || []).forEach(e => { exerciseMap[e.id] = e.muscle_group; });

    const currentSeriesByMuscle = {};
    currentLogs.forEach(log => {
      const muscle = exerciseMap[log.exercise_id];
      if (!muscle || !MEV_MRV[muscle]) return;
      currentSeriesByMuscle[muscle] = (currentSeriesByMuscle[muscle] || 0) + 1;
    });

    const prevSeriesByMuscle = {};
    prevLogs.forEach(log => {
      const muscle = exerciseMap[log.exercise_id];
      if (!muscle || !MEV_MRV[muscle]) return;
      prevSeriesByMuscle[muscle] = (prevSeriesByMuscle[muscle] || 0) + 1;
    });

    const result = Object.keys(MEV_MRV)
      .filter(muscle => currentSeriesByMuscle[muscle] !== undefined)
      .map(muscle => {
        const series = currentSeriesByMuscle[muscle] || 0;
        const prevSeries = prevSeriesByMuscle[muscle] ?? null;
        const { mev, mrv } = MEV_MRV[muscle];
        const status = getVolumeStatus(series, mev, mrv);
        const trend = prevSeries !== null ? series - prevSeries : null;
        const progressPct = Math.min((series / mrv) * 100, 100);
        return { muscle, series, prevSeries, mev, mrv, status, trend, progressPct };
      })
      .sort((a, b) => b.series - a.series);

    setMuscleData(result);
    setWeekOptions(Array.from({ length: 8 }, (_, i) => ({ offset: -i, label: formatWeekLabel(-i) })));
  } catch (err) {
    console.error("Error cargando volumen:", err);
  } finally {
    setLoading(false);
  }
};