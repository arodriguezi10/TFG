import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/Card";
import {
  Scale, TrendingUp, TrendingDown, Lock, Moon, Zap, Wind,
  Bone, Brain, MessageCircle, ClipboardList, ChevronRight,
  Percent, Ruler, Dumbbell, PersonStanding
} from "lucide-react";
import {
  RANGES, loadWeeklyCheckin, loadMeasurements,
  isRangeLocked, getDiff, formatAxisDate, getRangeLabel
} from "../utils/progressCuerpoUtils";

const SensacionBar = ({ value, max = 10, color }) => (
  <div className="w-full h-1.5 bg-surf rounded-full overflow-hidden">
    <div className="h-full rounded-full transition-all" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
  </div>
);

const ProgressCuerpoDesktop = ({ subscriptionTier }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState("1M");
  const [measurements, setMeasurements] = useState([]);
  const [latestMeasurement, setLatestMeasurement] = useState(null);
  const [prevMeasurement, setPrevMeasurement] = useState(null);
  const [weeklyCheckin, setWeeklyCheckin] = useState(null);

  useEffect(() => {
    if (user) {
      loadMeasurements(user.id, "1M", setMeasurements, setLatestMeasurement, setPrevMeasurement, setLoading);
      loadWeeklyCheckin(user.id, setWeeklyCheckin);
    }
  }, [user]);

  const handleRangeChange = (label, minTier) => {
    if (isRangeLocked(label, minTier, subscriptionTier)) { navigate("/subscription"); return; }
    setSelectedRange(label);
    loadMeasurements(user.id, label, setMeasurements, setLatestMeasurement, setPrevMeasurement, setLoading);
  };

  const weightDiff = getDiff(latestMeasurement, prevMeasurement, "weight_kg");

  const renderWeightChart = () => {
    const validPoints = measurements.filter((m) => m.weight_kg !== null);
    if (validPoints.length === 0) return (
      <div className="flex items-center justify-center h-48 text-text-low text-[14px]">Sin datos para este rango</div>
    );

    const width = 600, height = 200, paddingLeft = 40, paddingRight = 16, paddingTop = 16, paddingBottom = 32;
    const values = validPoints.map((d) => d.weight_kg);
    const minVal = Math.min(...values), maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;
    const getX = (i) => paddingLeft + (i / Math.max(validPoints.length - 1, 1)) * (width - paddingLeft - paddingRight);
    const getY = (val) => paddingTop + ((maxVal - val) / range) * (height - paddingTop - paddingBottom);
    const points = validPoints.map((d, i) => `${getX(i)},${getY(d.weight_kg)}`);
    const linePath = "M " + points.join(" L ");
    const areaPath = linePath + ` L ${getX(validPoints.length - 1)},${height - paddingBottom} L ${getX(0)},${height - paddingBottom} Z`;
    const yLabels = [maxVal, (maxVal + minVal) / 2, minVal].map((v) => Math.round(v * 10) / 10);
    const xLabelIndices = validPoints.length <= 5 ? validPoints.map((_, i) => i) : [0, Math.floor(validPoints.length / 4), Math.floor(validPoints.length / 2), Math.floor((3 * validPoints.length) / 4), validPoints.length - 1];

    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="bodyChartGradDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6b9d" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff6b9d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#bodyChartGradDesktop)" />
        <path d={linePath} fill="none" stroke="#ff6b9d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={getX(validPoints.length - 1)} cy={getY(validPoints[validPoints.length - 1].weight_kg)} r="5" fill="#ff6b9d" stroke="#0a0a0f" strokeWidth="2" />
        {yLabels.map((val, i) => <text key={i} x={paddingLeft - 6} y={getY(val) + 4} textAnchor="end" fontSize="11" fill="#6b6b8a">{val}</text>)}
        {xLabelIndices.map((idx) => <text key={idx} x={getX(idx)} y={height - 4} textAnchor="middle" fontSize="11" fill="#6b6b8a">{idx === validPoints.length - 1 ? "Hoy" : formatAxisDate(validPoints[idx].created_at)}</text>)}
      </svg>
    );
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="flex gap-6 px-4">

      {/* COLUMNA IZQUIERDA — PESO Y GRAFICA */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="font-subheading font-bold text-[14px] text-text-high tracking-wide">Composicion Corporal</p>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {RANGES.map(({ label, minTier }) => {
                const locked = isRangeLocked(label, minTier, subscriptionTier);
                return (
                  <button key={label} onClick={() => handleRangeChange(label, minTier)}
                    className={`px-3 py-1.5 rounded-xl font-subheading font-bold text-[13px] border transition-all ${selectedRange === label && !locked ? "bg-accent2 border-accent2 text-text-high" : "bg-surf border-text-low text-text-low"}`}>
                    {locked ? <span className="flex items-center gap-1"><Lock size={9} />{label}</span> : label}
                  </button>
                );
              })}
            </div>
            <button onClick={() => navigate("/dailyRegister")} className="font-subheading font-bold text-[14px] text-primary">+ Registrar</button>
          </div>
        </div>

        {latestMeasurement?.weight_kg ? (
          <div className="flex items-center gap-3">
            <span className="font-heading font-extrabold text-[56px] text-text-high leading-none">{latestMeasurement.weight_kg}</span>
            <span className="font-heading font-bold text-[22px] text-text-low">kg</span>
            {weightDiff !== null && (
              <span className={`flex items-center gap-1 px-3 py-1 rounded-full font-subheading font-bold text-[13px] border ${weightDiff >= 0 ? "bg-accent3/10 border-accent3 text-accent3" : "bg-red-bg1 border-red text-red"}`}>
                {weightDiff >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {Math.abs(weightDiff)}kg
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-heading font-extrabold text-[56px] text-text-low leading-none">--</span>
            <span className="font-heading font-bold text-[22px] text-text-low">kg</span>
          </div>
        )}
        <p className="font-body text-[13px] text-text-low -mt-2">Peso corporal · Ultimas {getRangeLabel(selectedRange)}</p>

        <Card>{renderWeightChart()}</Card>

        {/* MEDIDAS */}
        <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Medidas esta semana</p>

        {weeklyCheckin ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-bg1 border border-red flex items-center justify-center shrink-0"><Percent size={18} className="text-red" /></div>
                  <div>
                    <p className="font-subheading font-bold text-[11px] text-text-low uppercase">% Grasa</p>
                    <div className="flex items-baseline gap-1">
                      <p className="font-heading font-extrabold text-[28px] text-text-high leading-none">{weeklyCheckin.body_fat_pct ?? "--"}</p>
                      <p className="font-body text-[14px] text-text-low">%</p>
                    </div>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent2/10 border border-accent2 flex items-center justify-center shrink-0"><Ruler size={18} className="text-accent2" /></div>
                  <div>
                    <p className="font-subheading font-bold text-[11px] text-text-low uppercase">Cintura</p>
                    <div className="flex items-baseline gap-1">
                      <p className="font-heading font-extrabold text-[28px] text-text-high leading-none">{weeklyCheckin.waist_cm ?? "--"}</p>
                      <p className="font-body text-[14px] text-text-low">cm</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Dumbbell size={16} color="#6c63ff" />, label: "Pecho", value: weeklyCheckin.chest_cm, color: "#6c63ff", borderColor: "rgba(108,99,255,0.4)", bgColor: "rgba(108,99,255,0.06)" },
                { icon: <Scale size={16} color="#f5a623" />, label: "Brazo", value: weeklyCheckin.arm_cm, color: "#f5a623", borderColor: "rgba(245,166,35,0.4)", bgColor: "rgba(245,166,35,0.06)" },
                { icon: <PersonStanding size={16} color="#ff6b9d" />, label: "Pierna", value: weeklyCheckin.leg_cm, color: "#ff6b9d", borderColor: "rgba(255,107,157,0.4)", bgColor: "rgba(255,107,157,0.06)" },
              ].map(({ icon, label, value, color, borderColor, bgColor }) => (
                <div key={label} className="rounded-xl p-3 border flex flex-col gap-1" style={{ backgroundColor: bgColor, borderColor }}>
                  <span>{icon}</span>
                  <p className="font-subheading font-bold text-[10px] text-text-low uppercase tracking-wide">{label}</p>
                  <div className="flex items-baseline gap-0.5">
                    <p className="font-heading font-extrabold text-[22px] leading-none" style={{ color }}>{value ?? "--"}</p>
                    <p className="font-body text-[11px] text-text-low">cm</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <button onClick={() => navigate("/dailyRegister")} className="w-full bg-surf border border-text-low border-dashed rounded-2xl py-8 flex flex-col items-center gap-2">
            <ClipboardList size={32} className="text-text-low" />
            <p className="font-heading font-bold text-[16px] text-text-high">Sin registro esta semana</p>
            <p className="font-body text-[13px] text-primary">+ Registrar ahora</p>
          </button>
        )}
      </div>

      {/* COLUMNA DERECHA — SENSACIONES */}
      <div className="w-80 shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="font-subheading font-bold text-[14px] text-text-high tracking-wide">Sensaciones</p>
          <p className="font-body text-[12px] text-text-low">Esta semana</p>
        </div>

        <Card>
          <div className="flex flex-col divide-y divide-text-low/20">
            {[
              { icon: <Moon size={16} className="text-primary" />, bg: "bg-primary/10", border: "border-primary", label: "Calidad del sueno", key: "sleep_quality", color: "#ff6b9d" },
              { icon: <Zap size={16} className="text-orange" />, bg: "bg-orange-bg2", border: "border-orange", label: "Nivel de energia", key: "energy_level", color: "#36d9b8" },
              { icon: <Brain size={16} className="text-red" />, bg: "bg-red-bg1", border: "border-red", label: "Estres percibido", key: "stress_level", color: "#f5a623" },
            ].map(({ icon, bg, border, label, key, color }) => (
              <div key={key} className="py-3 first:pt-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-8 w-8 rounded-lg ${bg} border ${border} flex items-center justify-center shrink-0`}>{icon}</div>
                  <div className="flex-1">
                    <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">{label}</p>
                    <div className="flex items-baseline gap-1">
                      <p className="font-heading font-extrabold text-[20px] text-text-high leading-none">{weeklyCheckin?.[key] ?? "--"}</p>
                      <p className="font-body text-[12px] text-text-low">/10</p>
                    </div>
                  </div>
                </div>
                {weeklyCheckin?.[key] && <SensacionBar value={weeklyCheckin[key]} color={color} />}
              </div>
            ))}

            <div className="py-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-accent2/10 border border-accent2 flex items-center justify-center shrink-0"><Wind size={16} className="text-accent2" /></div>
                <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Fatiga muscular</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {["Ninguna", "Baja", "Media", "Alta"].map((nivel) => (
                  <span key={nivel} className="px-2 py-0.5 rounded-full font-subheading font-bold text-[11px] border"
                    style={{ backgroundColor: weeklyCheckin?.muscle_fatigue === nivel ? "rgba(54,217,184,0.1)" : "transparent", borderColor: weeklyCheckin?.muscle_fatigue === nivel ? "#36d9b8" : "#6b6b8a", color: weeklyCheckin?.muscle_fatigue === nivel ? "#36d9b8" : "#6b6b8a" }}>
                    {nivel}
                  </span>
                ))}
              </div>
            </div>

            <div className="py-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-accent1/10 border border-accent1 flex items-center justify-center shrink-0"><Bone size={16} className="text-accent1" /></div>
                <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Molestias articulares</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {["Ninguna", "Leves", "Severas"].map((nivel) => (
                  <span key={nivel} className="px-2 py-0.5 rounded-full font-subheading font-bold text-[11px] border"
                    style={{ backgroundColor: weeklyCheckin?.joint_pain === nivel ? "rgba(54,217,184,0.1)" : "transparent", borderColor: weeklyCheckin?.joint_pain === nivel ? "#36d9b8" : "#6b6b8a", color: weeklyCheckin?.joint_pain === nivel ? "#36d9b8" : "#6b6b8a" }}>
                    {nivel}
                  </span>
                ))}
              </div>
            </div>

            {weeklyCheckin?.trainer_note && (
              <div className="pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle size={14} className="text-text-low" />
                  <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Nota al entrenador</p>
                </div>
                <p className="font-body text-[12px] text-text-low italic">"{weeklyCheckin.trainer_note}"</p>
              </div>
            )}
          </div>
        </Card>

        <button onClick={() => navigate("/dailyRegister")} className="w-full bg-surf border border-text-low rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-primary transition-colors">
          <div className="h-9 w-9 rounded-xl bg-primary-bg border border-primary flex items-center justify-center shrink-0"><ClipboardList size={16} className="text-primary" /></div>
          <div className="flex-1 text-left">
            <p className="font-heading font-bold text-[14px] text-text-high">{weeklyCheckin ? "Actualizar registro" : "Registrar semana"}</p>
            <p className="font-body text-[11px] text-text-low">{weeklyCheckin ? "Modifica tu check-in" : "Envia tu check-in semanal"}</p>
          </div>
          <ChevronRight size={16} className="text-primary" />
        </button>
      </div>
    </div>
  );
};

export default ProgressCuerpoDesktop;