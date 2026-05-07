// ProgressCarga.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import { Dumbbell, ChevronDown, Plus, X, Lock, Trophy, Target, TrendingUp, Search } from "lucide-react";



const ProgressCarga = ({ subscriptionTier }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState("1M");
  const [chartData, setChartData] = useState([]);
  const [pr, setPr] = useState(null);
  const [avgRir, setAvgRir] = useState(null);
  const [current1RM, setCurrent1RM] = useState(null);
  const [prev1RM, setPrev1RM] = useState(null);
  const [loadingChart, setLoadingChart] = useState(false);

  const RANGE_DAYS = { "1M": 30, "6M": 180, "1A": 365, "Todo": 3650 };

  useEffect(() => {
    if (user) loadExercises();
  }, [user]);

  useEffect(() => {
    if (selectedExercise) loadChartData();
  }, [selectedExercise, selectedRange]);

  const loadExercises = async () => {
    const { data: sessions } = await supabase
      .from("workout_sessions")
      .select("id")
      .eq("user_id", user.id);

    if (!sessions || sessions.length === 0) return;

    const sessionIds = sessions.map((s) => s.id);

    const { data: logs } = await supabase
      .from("workout_exercise_logs")
      .select("exercise_id")
      .in("session_id", sessionIds);

    if (!logs) return;

    const uniqueIds = [...new Set(logs.map((l) => l.exercise_id))];

    const { data: exerciseList } = await supabase
      .from("exercises")
      .select("id, name, muscle_group")
      .in("id", uniqueIds)
      .order("name");

    setExercises(exerciseList || []);
    if (exerciseList && exerciseList.length > 0) {
      setSelectedExercise(exerciseList[0]);
    }
  };

  const searchExercises = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    const { data } = await supabase
      .from("exercises")
      .select("id, name, muscle_group")
      .ilike("name", `%${query}%`)
      .limit(20);
    setSearchResults(data || []);
    setSearchLoading(false);
  };

  const addExerciseToLibrary = (ex) => {
    if (exercises.find((e) => e.id === ex.id)) return;
    if (exercises.length >= 6) { alert("Maximo 6 ejercicios en tu biblioteca"); return; }
    const updated = [...exercises, ex];
    setExercises(updated);
    setSelectedExercise(ex);
    setShowAddExercise(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeExerciseFromLibrary = (exId) => {
    const updated = exercises.filter((e) => e.id !== exId);
    setExercises(updated);
    if (selectedExercise?.id === exId) setSelectedExercise(updated[0] || null);
  };

  const calc1RM = (weight, reps) => {
    if (!weight || !reps || reps <= 0) return 0;
    return weight * (1 + reps / 30);
  };

  const loadChartData = async () => {
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
          bySession[date] = {
            date,
            rm: Math.round(rm * 10) / 10,
            weight: log.actual_weight,
            reps: log.actual_reps,
          };
        }
      });

      const points = Object.values(bySession).sort((a, b) => a.date.localeCompare(b.date));
      setChartData(points);

      if (points.length > 0) setCurrent1RM(points[points.length - 1].rm);
      if (points.length > 1) setPrev1RM(points[points.length - 2].rm);
      else setPrev1RM(null);

      const prLog = logs.reduce((best, log) => {
        if (!best || log.actual_weight > best.actual_weight) return log;
        return best;
      }, null);
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

  const formatAxisDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-40 text-text-low text-[13px]">
          Sin datos para este rango
        </div>
      );
    }

    const width = 340;
    const height = 160;
    const paddingLeft = 36;
    const paddingRight = 12;
    const paddingTop = 16;
    const paddingBottom = 28;

    const values = chartData.map((d) => d.rm);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const getX = (i) =>
      paddingLeft + (i / Math.max(chartData.length - 1, 1)) * (width - paddingLeft - paddingRight);
    const getY = (val) =>
      paddingTop + ((maxVal - val) / range) * (height - paddingTop - paddingBottom);

    const points = chartData.map((d, i) => `${getX(i)},${getY(d.rm)}`);
    const linePath = "M " + points.join(" L ");
    const areaPath =
      linePath +
      ` L ${getX(chartData.length - 1)},${height - paddingBottom}` +
      ` L ${getX(0)},${height - paddingBottom} Z`;

    const yLabels = [maxVal, (maxVal + minVal) / 2, minVal].map(Math.round);
    const xLabelIndices =
      chartData.length <= 5
        ? chartData.map((_, i) => i)
        : [0, Math.floor(chartData.length / 4), Math.floor(chartData.length / 2), Math.floor((3 * chartData.length) / 4), chartData.length - 1];

    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chartGrad)" />
        <path d={linePath} fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={getX(chartData.length - 1)} cy={getY(chartData[chartData.length - 1].rm)} r="4" fill="#6c63ff" stroke="#0a0a0f" strokeWidth="2" />
        {yLabels.map((val, i) => (
          <text key={i} x={paddingLeft - 4} y={getY(val) + 4} textAnchor="end" fontSize="10" fill="#6b6b8a">{val}</text>
        ))}
        {xLabelIndices.map((idx) => (
          <text key={idx} x={getX(idx)} y={height - 4} textAnchor="middle" fontSize="10" fill="#6b6b8a">
            {formatAxisDate(chartData[idx].date)}
          </text>
        ))}
      </svg>
    );
  };

  const rmDiff = current1RM && prev1RM ? Math.round((current1RM - prev1RM) * 10) / 10 : null;

  const getRirLabel = (rir) => {
    if (rir === null) return "--";
    if (rir <= 1) return "Intensidad muy alta";
    if (rir <= 2) return "Intensidad alta";
    if (rir <= 4) return "Intensidad media";
    return "Intensidad baja";
  };

  return (
    <div className="flex flex-col px-4 gap-4">

      {/* SELECTOR DE EJERCICIO */}
      <button
        onClick={() => setShowExercisePicker(!showExercisePicker)}
        className="w-full bg-surf border border-text-low rounded-2xl px-4 py-3 flex items-center gap-3"
      >
        <div className="h-9 w-9 rounded-lg bg-primary-bg border border-primary flex items-center justify-center text-[16px] shrink-0">
          <Dumbbell size={16} className="text-orange"/>
        </div>
        <div className="flex-1 text-left">
          <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide">
            Ejercicio seleccionado
          </p>
          <p className="font-heading font-bold text-[16px] text-text-high">
            {selectedExercise?.name || "Selecciona un ejercicio"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-orange-bg2 border border-orange px-2 py-0.5 rounded-lg font-subheading font-bold text-[11px] text-orange">
            {exercises.length}/6 ejercicios
          </span>
          <span className="text-text-low text-[18px]"><ChevronDown size={18} /></span>
        </div>
      </button>

      {/* PICKER */}
      {showExercisePicker && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
              Tu biblioteca ({exercises.length}/6)
            </p>
            <button
              onClick={() => setShowAddExercise(!showAddExercise)}
              className="bg-primary h-7 w-7 rounded-lg flex items-center justify-center text-text-high font-bold text-[16px]"
            >
              {showAddExercise ? <X size={16} /> : <Plus size={16} />}
            </button>
          </div>

          {showAddExercise && (
            <div className="mb-3">
              <input
                type="text"
                placeholder="Buscar ejercicio..."
                value={searchQuery}
                onChange={(e) => searchExercises(e.target.value)}
                className="w-full bg-background border border-text-low rounded-xl px-3 py-2 font-body text-[14px] text-text-high outline-none focus:border-primary transition-colors"
                autoFocus
              />
              {searchLoading && (
                <p className="font-body text-[12px] text-text-low mt-2 text-center">Buscando...</p>
              )}
              {searchResults.length > 0 && (
                <div className="mt-2 flex flex-col gap-1 max-h-36 overflow-y-auto">
                  {searchResults.map((ex) => {
                    const alreadyAdded = exercises.find((e) => e.id === ex.id);
                    return (
                      <button
                        key={ex.id}
                        onClick={() => !alreadyAdded && addExerciseToLibrary(ex)}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                          alreadyAdded ? "opacity-40 cursor-not-allowed" : "hover:bg-surf"
                        }`}
                      >
                        <div>
                          <p className="font-heading font-bold text-[14px] text-text-high">{ex.name}</p>
                          {ex.muscle_group && (
                            <p className="font-body text-[11px] text-text-low">{ex.muscle_group}</p>
                          )}
                        </div>
                        {alreadyAdded ? (
                          <span className="font-body text-[11px] text-text-low">Añadido</span>
                        ) : (
                          <span className="text-primary font-bold text-[18px]">+</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
            {exercises.length === 0 ? (
              <p className="font-body text-[13px] text-text-low text-center py-4">
                Añade ejercicios a tu biblioteca
              </p>
            ) : (
              exercises.map((ex) => (
                <div
                  key={ex.id}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all ${
                    selectedExercise?.id === ex.id
                      ? "bg-primary/10 border border-primary"
                      : "hover:bg-surf"
                  }`}
                >
                  <button
                    className="flex-1 text-left"
                    onClick={() => {
                      setSelectedExercise(ex);
                      setShowExercisePicker(false);
                      setShowAddExercise(false);
                    }}
                  >
                    <p className="font-heading font-bold text-[14px] text-text-high">{ex.name}</p>
                    {ex.muscle_group && (
                      <p className="font-body text-[11px] text-text-low">{ex.muscle_group}</p>
                    )}
                  </button>
                  <button
                    onClick={() => removeExerciseFromLibrary(ex.id)}
                    className="h-6 w-6 rounded-lg bg-red-bg1 border border-red flex items-center justify-center text-red text-[12px] shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* SELECTOR DE RANGO */}
      <div className="flex gap-2">
        {["1M", "6M", "1A", "Todo"].map((range) => {
          const isLocked =
            (range === "6M" && subscriptionTier === "free") ||
            (range === "1A" && subscriptionTier !== "elite") ||
            (range === "Todo" && subscriptionTier !== "elite");
          const lockLabel = range === "6M" ? "PRO" : "ÉLITE";

          return (
            <button
              key={range}
              onClick={() => {
                if (isLocked) { navigate("/subscription"); return; }
                setSelectedRange(range);
              }}
              className={`flex-1 py-2 rounded-xl font-subheading font-bold text-[13px] transition-all border ${
                selectedRange === range && !isLocked
                  ? "bg-primary border-primary text-text-high"
                  : "bg-surf border-text-low text-text-low"
              }`}
            >
              {isLocked ? (
                <span className="flex flex-col items-center leading-tight">
                  <span className="text-[10px]"><Lock size={10} /> {lockLabel}</span>
                  <span>{range}</span>
                </span>
              ) : range}
            </button>
          );
        })}
      </div>

      {/* 1RM Y GRAFICA */}
      {loadingChart ? (
        <Card>
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </Card>
      ) : (
        <>
          {current1RM !== null && (
            <div className="flex items-center gap-3">
              <span className="font-heading font-extrabold text-[48px] text-text-high leading-none">
                {Math.round(current1RM)}
              </span>
              <span className="font-heading font-bold text-[20px] text-text-low">kg</span>
              {rmDiff !== null && (
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full font-subheading font-bold text-[13px] border ${
                  rmDiff >= 0 ? "bg-accent3/10 border-accent3 text-accent3" : "bg-red-bg1 border-red text-red"
                }`}>
                  {rmDiff >= 0 ? "↑" : "↓"} {Math.abs(rmDiff)}kg
                </span>
              )}
            </div>
          )}
          {current1RM !== null && (
            <p className="font-body text-[12px] text-text-low -mt-2">1RM Estimado · Ultimo mes</p>
          )}

          <Card>{renderChart()}</Card>

          {pr && (
            <div className="flex gap-3">
              <Card>
                <div className="flex flex-col gap-1">
                  <div className="h-9 w-9 rounded-lg bg-orange-bg2 border border-orange flex items-center justify-center text-[16px]"><Trophy size={16} className="text-orange"/></div>
                  <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mt-1">PR</p>
                  <p className="font-heading font-extrabold text-[32px] text-text-high leading-none">{pr.actual_weight}kg</p>
                  <p className="font-body text-[12px] text-text-low">x {pr.actual_reps} repeticiones</p>
                  <p className="font-body text-[11px] text-text-low">
                    Registrado el {formatAxisDate(chartData.find((d) => d.weight === pr.actual_weight)?.date || "")}
                  </p>
                  <span className="mt-1 inline-flex bg-accent3/10 border border-text-low rounded-full px-3 py-1 font-subheading font-bold text-[12px] text-text-low">
                    +{Math.round((pr.actual_weight - (chartData[0]?.weight || pr.actual_weight)) * 10) / 10}kg vs anterior
                  </span>
                </div>
              </Card>

              <Card>
                <div className="flex flex-col gap-1">
                  <div className="h-9 w-9 rounded-lg bg-primary-bg border border-primary flex items-center justify-center text-[16px]"><Target size={16} className="text-primary"/></div>
                  <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mt-1">RIR MEDIO</p>
                  <p className="font-heading font-extrabold text-[32px] text-text-high leading-none">{avgRir !== null ? avgRir : "--"}</p>
                  <p className="font-body text-[12px] text-text-low">{getRirLabel(avgRir)}</p>
                  <p className="font-body text-[11px] text-text-low">Media del ultimo mes</p>
                  {avgRir !== null && (
                    <span className="mt-1 inline-flex bg-primary/10 border border-primary rounded-full px-3 py-1 font-subheading font-bold text-[12px] text-primary">
                      Mejora vs -{avgRir}
                    </span>
                  )}
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressCarga;