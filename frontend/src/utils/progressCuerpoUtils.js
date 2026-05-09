import { supabase } from "../services/supabase";

export const RANGE_DAYS = { "1M": 30, "3M": 90, "6M": 180, "1A": 365 };

export const RANGES = [
  { label: "1M", minTier: "free" },
  { label: "3M", minTier: "pro" },
  { label: "6M", minTier: "pro" },
  { label: "1A", minTier: "elite" },
];

export const getWeekStart = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  d.setDate(diff);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const loadWeeklyCheckin = async (userId, setWeeklyCheckin) => {
  try {
    const weekStart = getWeekStart();
    const { data } = await supabase
      .from("daily_checkins")
      .select("*")
      .eq("user_id", userId)
      .eq("checkin_date", weekStart)
      .maybeSingle();
    setWeeklyCheckin(data || null);
  } catch (err) {
    console.error("Error cargando checkin semanal:", err);
  }
};

export const loadMeasurements = async (userId, range, setMeasurements, setLatestMeasurement, setPrevMeasurement, setLoading) => {
  setLoading(true);
  try {
    const days = RANGE_DAYS[range] || 30;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    const fromDateStr = fromDate.toISOString().split("T")[0];

    const { data } = await supabase
      .from("weight_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("log_date", fromDateStr)
      .order("log_date", { ascending: true });

    const mapped = (data || []).map((w) => ({
      weight_kg: w.weight,
      created_at: w.log_date,
      body_fat_pct: null,
      waist_cm: null,
    }));

    setMeasurements(mapped);

    if (mapped.length > 0) {
      setLatestMeasurement(mapped[mapped.length - 1]);
      setPrevMeasurement(mapped.length > 1 ? mapped[mapped.length - 2] : null);
    } else {
      setLatestMeasurement(null);
      setPrevMeasurement(null);
    }
  } catch (err) {
    console.error("Error cargando medidas:", err);
  } finally {
    setLoading(false);
  }
};

export const isRangeLocked = (label, minTier, subscriptionTier) => {
  if (minTier === "pro" && subscriptionTier === "free") return true;
  if (minTier === "elite" && subscriptionTier !== "elite") return true;
  return false;
};

export const getDiff = (current, prev, field) => {
  if (!current || !prev) return null;
  if (current[field] === null || prev[field] === null) return null;
  return Math.round((current[field] - prev[field]) * 10) / 10;
};

export const formatAxisDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};

export const getRangeLabel = (range) => {
  switch (range) {
    case "1M": return "4 semanas";
    case "3M": return "12 semanas";
    case "6M": return "6 meses";
    case "1A": return "1 año";
    default: return "";
  }
};