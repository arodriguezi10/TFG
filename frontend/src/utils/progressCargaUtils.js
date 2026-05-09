import { supabase } from "../services/supabase";

export const RANGE_DAYS = { "1M": 30, "6M": 180, "1A": 365, "Todo": 3650 };

export const getLibraryKey = (userId) => `progress_library_${userId}`;

export const getLibraryLimit = (subscriptionTier) => {
  if (subscriptionTier === "elite" || subscriptionTier === "pro") return 6;
  return 3;
};

export const loadSavedLibrary = (userId) => {
  try {
    const saved = localStorage.getItem(getLibraryKey(userId));
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

export const saveLibrary = (userId, exercises) => {
  try {
    localStorage.setItem(getLibraryKey(userId), JSON.stringify(exercises));
  } catch(error) { error}
};

export const calc1RM = (weight, reps) => {
  if (!weight || !reps || reps <= 0) return 0;
  return weight * (1 + reps / 30);
};

export const getRirLabel = (rir) => {
  if (rir === null) return "--";
  if (rir <= 1) return "Intensidad muy alta";
  if (rir <= 2) return "Intensidad alta";
  if (rir <= 4) return "Intensidad media";
  return "Intensidad baja";
};

export const formatAxisDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};

export const loadChartData = async ({
  user, selectedExercise, selectedRange,
  setChartData, setPr, setAvgRir, setCurrent1RM, setPrev1RM, setLoadingChart
}) => {
  if (!selectedExercise) return;
  setLoadingChart(true);
  try {
    const days = RANGE_DAYS[selectedRange] || 30;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    const fromDateStr = fromDate.toISOString().split("T")[0];

    const { data: sessions } = await supabase
      .from("workout_sessions")
      .select("id, session_date")
      .eq("user_id", user.id)
      .gte("session_date", fromDateStr)
      .order("session_date", { ascending: true });

    if (!sessions || sessions.length === 0) {
      setChartData([]); setPr(null); setAvgRir(null);
      setCurrent1RM(null); setPrev1RM(null);
      return;
    }

    const sessionIds = sessions.map((s) => s.id);
    const sessionDateMap = {};
    sessions.forEach((s) => { sessionDateMap[s.id] = s.session_date; });

    const { data: logs } = await supabase
      .from("workout_exercise_logs")
      .select("*")
      .in("session_id", sessionIds)
      .eq("exercise_id", selectedExercise.id)
      .eq("completed", true);

    if (!logs || logs.length === 0) {
      setChartData([]); setPr(null); setAvgRir(null);
      setCurrent1RM(null); setPrev1RM(null);
      return;
    }

    const bySession = {};
    logs.forEach((log) => {
      const date = sessionDateMap[log.session_id];
      if (!date) return;
      const rm = calc1RM(log.actual_weight, log.actual_reps);
      if (!bySession[date] || rm > bySession[date].rm) {
        bySession[date] = { date, rm: Math.round(rm * 10) / 10, weight: log.actual_weight, reps: log.actual_reps };
      }
    });

    const points = Object.values(bySession).sort((a, b) => a.date.localeCompare(b.date));
    setChartData(points);

    if (points.length > 0) setCurrent1RM(points[points.length - 1].rm);
    if (points.length > 1) setPrev1RM(points[points.length - 2].rm);
    else setPrev1RM(null);

    const prLog = logs.reduce((best, log) => (!best || log.actual_weight > best.actual_weight) ? log : best, null);
    setPr(prLog);

    const rirLogs = logs.filter((l) => l.actual_rir !== null && l.actual_rir >= 0);
    if (rirLogs.length > 0) {
      const avg = rirLogs.reduce((s, l) => s + l.actual_rir, 0) / rirLogs.length;
      setAvgRir(Math.round(avg * 10) / 10);
    } else {
      setAvgRir(null);
    }
  } catch (err) {
    console.error("Error cargando datos de carga:", err);
  } finally {
    setLoadingChart(false);
  }
};

