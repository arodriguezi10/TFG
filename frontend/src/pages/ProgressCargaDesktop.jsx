import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import { useTargetUser } from "../hooks/useTargetUser";
import { Dumbbell, Plus, X, Lock, Trophy, Target, Search } from "lucide-react";
import {
  getLibraryLimit, loadSavedLibrary, saveLibrary,
  getRirLabel, formatAxisDate, loadChartData,
} from "../utils/progressCargaUtils";

const ProgressCargaDesktop = ({ subscriptionTier }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { targetUserId } = useTargetUser();


  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
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

  const limit = getLibraryLimit(subscriptionTier);

  useEffect(() => {
  if (!targetUserId) return;
  const saved = loadSavedLibrary(targetUserId);
  if (saved && saved.length > 0) {
    setTimeout(() => {
      setExercises(saved);
      setSelectedExercise(saved[0]);
    }, 0);
  }
}, [targetUserId]);

  useEffect(() => {
    if (selectedExercise) {
      loadChartData({ user, selectedExercise, selectedRange, setChartData, setPr, setAvgRir, setCurrent1RM, setPrev1RM, setLoadingChart });
    }
  }, [selectedExercise, selectedRange]);

  const searchExercises = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    const { data } = await supabase.from("exercises").select("id, name, muscle_group").ilike("name", `%${query}%`).limit(20);
    setSearchResults(data || []);
    setSearchLoading(false);
  };

  const addExerciseToLibrary = (ex) => {
    if (exercises.find((e) => e.id === ex.id)) return;
    if (exercises.length >= limit) { alert(`Maximo ${limit} ejercicios en tu biblioteca`); return; }
    const updated = [...exercises, ex];
    setExercises(updated);
    saveLibrary(targetUserId, updated);
    setSelectedExercise(ex);
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeExerciseFromLibrary = (exId) => {
    const updated = exercises.filter((e) => e.id !== exId);
    setExercises(updated);
    saveLibrary(targetUserId, updated);
    if (selectedExercise?.id === exId) setSelectedExercise(updated[0] || null);
  };

  const renderChartSVG = (chartData, formatAxisDate) => {
  if (chartData.length === 0) return null;

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

  const getX = (i) => paddingLeft + (i / Math.max(chartData.length - 1, 1)) * (width - paddingLeft - paddingRight);
  const getY = (val) => paddingTop + ((maxVal - val) / range) * (height - paddingTop - paddingBottom);

  const points = chartData.map((d, i) => `${getX(i)},${getY(d.rm)}`);
  const linePath = "M " + points.join(" L ");
  const areaPath = linePath + ` L ${getX(chartData.length - 1)},${height - paddingBottom} L ${getX(0)},${height - paddingBottom} Z`;

  const yLabels = [maxVal, (maxVal + minVal) / 2, minVal].map(Math.round);
  const xLabelIndices = chartData.length <= 5
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

  return (
    <div className="flex gap-6 px-4">

      {/* SIDEBAR IZQUIERDA — BIBLIOTECA */}
      <aside className="w-64 shrink-0 flex flex-col gap-4">
        <div>
          <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-2">Tu biblioteca ({exercises.length}/{limit})</p>

          {/* BUSCADOR */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-low" />
            <input type="text" placeholder="Buscar ejercicio..." value={searchQuery} onChange={(e) => searchExercises(e.target.value)}
              className="w-full bg-surf border border-text-low rounded-xl pl-8 pr-3 py-2 font-body text-[13px] text-text-high outline-none focus:border-primary transition-colors" />
          </div>

          {searchLoading && <p className="font-body text-[12px] text-text-low text-center mb-2">Buscando...</p>}
          {searchResults.length > 0 && (
            <div className="mb-3 flex flex-col gap-1 max-h-40 overflow-y-auto bg-surf border border-text-low rounded-xl p-2">
              {searchResults.map((ex) => {
                const alreadyAdded = exercises.find((e) => e.id === ex.id);
                return (
                  <button key={ex.id} onClick={() => !alreadyAdded && addExerciseToLibrary(ex)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ${alreadyAdded ? "opacity-40 cursor-not-allowed" : "hover:bg-background"}`}>
                    <div>
                      <p className="font-heading font-bold text-[13px] text-text-high">{ex.name}</p>
                      {ex.muscle_group && <p className="font-body text-[11px] text-text-low">{ex.muscle_group}</p>}
                    </div>
                    {alreadyAdded ? <span className="font-body text-[11px] text-text-low">Anadido</span> : <Plus size={16} className="text-primary" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* LISTA BIBLIOTECA */}
          <div className="flex flex-col gap-1">
            {exercises.length === 0 ? (
              <div className="bg-surf border border-text-low/30 rounded-xl p-4 text-center">
                <Dumbbell size={24} className="text-text-low mx-auto mb-2" />
                <p className="font-body text-[12px] text-text-low">Busca y anade ejercicios para ver tu progreso</p>
              </div>
            ) : (
              exercises.map((ex) => (
                <div key={ex.id} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${selectedExercise?.id === ex.id ? "bg-primary/10 border border-primary" : "bg-surf hover:bg-surf/50"}`}
                  onClick={() => setSelectedExercise(ex)}>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-[13px] text-text-high truncate">{ex.name}</p>
                    {ex.muscle_group && <p className="font-body text-[11px] text-text-low">{ex.muscle_group}</p>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeExerciseFromLibrary(ex.id); }} className="h-6 w-6 rounded-lg bg-red-bg1 border border-red flex items-center justify-center text-red shrink-0 hover:bg-red/20 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SELECTOR RANGO */}
        <div>
          <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-2">Rango temporal</p>
          <div className="flex flex-col gap-1.5">
            {["1M", "6M", "1A", "Todo"].map((range) => {
              const isLocked = (range === "6M" && subscriptionTier === "free") || (range === "1A" && subscriptionTier !== "elite") || (range === "Todo" && subscriptionTier !== "elite");
              const lockLabel = range === "6M" ? "PRO" : "ELITE";
              return (
                <button key={range} onClick={() => { if (isLocked) { navigate("/subscription"); return; } setSelectedRange(range); }}
                  className={`w-full py-2 px-3 rounded-xl font-subheading font-bold text-[13px] transition-all border text-left flex items-center justify-between ${selectedRange === range && !isLocked ? "bg-primary border-primary text-text-high" : "bg-surf border-text-low text-text-low"}`}>
                  <span>{range}</span>
                  {isLocked && <span className="flex items-center gap-1 text-[11px]"><Lock size={10} /> {lockLabel}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col gap-4">
        {loadingChart ? (
          <Card><div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div></div></Card>
        ) : (
          <>
            {current1RM !== null && (
              <div className="flex items-center gap-4">
                <span className="font-heading font-extrabold text-[56px] text-text-high leading-none">{Math.round(current1RM)}</span>
                <span className="font-heading font-bold text-[24px] text-text-low">kg</span>
                {rmDiff !== null && (
                  <span className={`flex items-center gap-1 px-4 py-1.5 rounded-full font-subheading font-bold text-[14px] border ${rmDiff >= 0 ? "bg-accent3/10 border-accent3 text-accent3" : "bg-red-bg1 border-red text-red"}`}>
                    {rmDiff >= 0 ? "↑" : "↓"} {Math.abs(rmDiff)}kg
                  </span>
                )}
                <p className="font-body text-[13px] text-text-low">1RM Estimado</p>
              </div>
            )}

            <Card>
              {chartData.length === 0
                ? <div className="flex items-center justify-center h-48 text-text-low text-[14px]">Sin datos para este rango. Completa entrenamientos para ver tu progreso.</div>
                : renderChartSVG(chartData, formatAxisDate)}
            </Card>

            {pr && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-orange-bg2 border border-orange flex items-center justify-center shrink-0"><Trophy size={20} className="text-orange" /></div>
                    <div className="flex flex-col">
                      <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">PR Personal</p>
                      <p className="font-heading font-extrabold text-[36px] text-text-high leading-none">{pr.actual_weight}<span className="text-[18px] text-text-low ml-1">kg</span></p>
                      <p className="font-body text-[13px] text-text-low">x {pr.actual_reps} repeticiones</p>
                      <span className="mt-2 inline-flex bg-accent3/10 border border-text-low rounded-full px-3 py-1 font-subheading font-bold text-[12px] text-text-low">
                        +{Math.round((pr.actual_weight - (chartData[0]?.weight || pr.actual_weight)) * 10) / 10}kg vs anterior
                      </span>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-primary-bg border border-primary flex items-center justify-center shrink-0"><Target size={20} className="text-primary" /></div>
                    <div className="flex flex-col">
                      <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">RIR Medio</p>
                      <p className="font-heading font-extrabold text-[36px] text-text-high leading-none">{avgRir !== null ? avgRir : "--"}</p>
                      <p className="font-body text-[13px] text-text-low">{getRirLabel(avgRir)}</p>
                      {avgRir !== null && <span className="mt-2 inline-flex bg-primary/10 border border-primary rounded-full px-3 py-1 font-subheading font-bold text-[12px] text-primary">Mejora vs -{avgRir}</span>}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {!selectedExercise && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Dumbbell size={48} className="text-text-low" />
                <p className="font-heading font-bold text-[18px] text-text-high">Selecciona un ejercicio</p>
                <p className="font-body text-[14px] text-text-low text-center">Busca y anade ejercicios en la barra lateral para ver tu progreso de carga</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressCargaDesktop;