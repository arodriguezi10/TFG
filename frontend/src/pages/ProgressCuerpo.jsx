import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import {
  Scale, TrendingUp, TrendingDown, Lock, Moon, Zap, Wind,
  Bone, Brain, MessageCircle, ClipboardList, ChevronRight,
  Percent, Ruler, Dumbbell, PersonStanding
} from "lucide-react";

const ProgressCuerpo = ({ subscriptionTier }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState("1M");
  const [measurements, setMeasurements] = useState([]);
  const [latestMeasurement, setLatestMeasurement] = useState(null);
  const [prevMeasurement, setPrevMeasurement] = useState(null);
  const [weeklyCheckin, setWeeklyCheckin] = useState(null);

  const RANGE_DAYS = { "1M": 30, "3M": 90, "6M": 180, "1A": 365 };

  const RANGES = [
    { label: "1M", minTier: "free" },
    { label: "3M", minTier: "pro" },
    { label: "6M", minTier: "pro" },
    { label: "1A", minTier: "elite" },
  ];

  useEffect(() => {
    if (user) {
      loadMeasurements("1M");
      loadWeeklyCheckin();
    }
  }, [user]);

  const getWeekStart = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    d.setDate(diff);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const loadWeeklyCheckin = async () => {
    try {
      const weekStart = getWeekStart();
      const { data } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user.id)
        .eq("checkin_date", weekStart)
        .maybeSingle();
      setWeeklyCheckin(data || null);
    } catch (err) {
      console.error("Error cargando checkin semanal:", err);
    }
  };

  const loadMeasurements = async (range) => {
    setLoading(true);
    try {
      const days = RANGE_DAYS[range] || 30;
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      const fromDateStr = fromDate.toISOString().split("T")[0];

      const { data } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("user_id", user.id)
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
        if (mapped.length > 1) setPrevMeasurement(mapped[mapped.length - 2]);
        else setPrevMeasurement(null);
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

  const handleRangeChange = (range) => {
    const isLocked =
      (range === "3M" && subscriptionTier === "free") ||
      (range === "6M" && subscriptionTier === "free") ||
      (range === "1A" && subscriptionTier !== "elite");
    if (isLocked) { navigate("/subscription"); return; }
    setSelectedRange(range);
    loadMeasurements(range);
  };

  const formatAxisDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const getDiff = (current, prev, field) => {
    if (!current || !prev) return null;
    if (current[field] === null || prev[field] === null) return null;
    return Math.round((current[field] - prev[field]) * 10) / 10;
  };

  const renderWeightChart = () => {
    const validPoints = measurements.filter((m) => m.weight_kg !== null);
    if (validPoints.length === 0) {
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

    const values = validPoints.map((d) => d.weight_kg);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const getX = (i) =>
      paddingLeft + (i / Math.max(validPoints.length - 1, 1)) * (width - paddingLeft - paddingRight);
    const getY = (val) =>
      paddingTop + ((maxVal - val) / range) * (height - paddingTop - paddingBottom);

    const points = validPoints.map((d, i) => `${getX(i)},${getY(d.weight_kg)}`);
    const linePath = "M " + points.join(" L ");
    const areaPath =
      linePath +
      ` L ${getX(validPoints.length - 1)},${height - paddingBottom}` +
      ` L ${getX(0)},${height - paddingBottom} Z`;

    const yLabels = [maxVal, (maxVal + minVal) / 2, minVal].map((v) => Math.round(v * 10) / 10);
    const xLabelIndices =
      validPoints.length <= 5
        ? validPoints.map((_, i) => i)
        : [0, Math.floor(validPoints.length / 4), Math.floor(validPoints.length / 2), Math.floor((3 * validPoints.length) / 4), validPoints.length - 1];

    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="bodyChartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6b9d" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff6b9d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#bodyChartGrad)" />
        <path d={linePath} fill="none" stroke="#ff6b9d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle
          cx={getX(validPoints.length - 1)}
          cy={getY(validPoints[validPoints.length - 1].weight_kg)}
          r="4" fill="#ff6b9d" stroke="#0a0a0f" strokeWidth="2"
        />
        {yLabels.map((val, i) => (
          <text key={i} x={paddingLeft - 4} y={getY(val) + 4} textAnchor="end" fontSize="10" fill="#6b6b8a">{val}</text>
        ))}
        {xLabelIndices.map((idx) => (
          <text key={idx} x={getX(idx)} y={height - 4} textAnchor="middle" fontSize="10" fill="#6b6b8a">
            {idx === validPoints.length - 1 ? "Hoy" : formatAxisDate(validPoints[idx].created_at)}
          </text>
        ))}
      </svg>
    );
  };

  const weightDiff = getDiff(latestMeasurement, prevMeasurement, "weight_kg");

  const SensacionBar = ({ value, max = 10, color }) => (
    <div className="w-full h-1.5 bg-surf rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
      />
    </div>
  );

  const MedidaCard = ({ icon, label, value, unit, color, borderColor, bgColor }) => (
    <div className="flex-1 rounded-xl p-3 border flex flex-col gap-1" style={{ backgroundColor: bgColor, borderColor }}>
      <span className="text-[16px]">{icon}</span>
      <p className="font-subheading font-bold text-[10px] text-text-low uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-0.5">
        <p className="font-heading font-extrabold text-[20px] leading-none" style={{ color }}>
          {value ?? "--"}
        </p>
        <p className="font-body text-[11px] text-text-low">{unit}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 gap-4">

      {/* CABECERA */}
      <div className="flex items-center justify-between">
        <p className="font-subheading font-bold text-[14px] text-text-high tracking-wide">
          Composición Corporal
        </p>
        <button
          onClick={() => navigate("/dailyRegister")}
          className="font-subheading font-bold text-[14px] text-primary"
        >
          + Registrar semana
        </button>
      </div>

      {/* SELECTOR DE RANGO */}
      <div className="flex gap-2">
        {RANGES.map(({ label, minTier }) => {
          const isLocked =
            (minTier === "pro" && subscriptionTier === "free") ||
            (minTier === "elite" && subscriptionTier !== "elite");
          return (
            <button
              key={label}
              onClick={() => handleRangeChange(label)}
              className={`px-4 py-1.5 rounded-xl font-subheading font-bold text-[13px] border transition-all ${
                selectedRange === label && !isLocked
                  ? "bg-accent2 border-accent2 text-text-high"
                  : "bg-surf border-text-low text-text-low"
              }`}
            >
              {isLocked ? (
                <span className="flex flex-col items-center leading-tight">
                  <Lock size={9} />
                  <span>{label}</span>
                </span>
              ) : label}
            </button>
          );
        })}
      </div>

      {/* PESO */}
      {latestMeasurement?.weight_kg ? (
        <div className="flex items-center gap-3">
          <span className="font-heading font-extrabold text-[48px] text-text-high leading-none">
            {latestMeasurement.weight_kg}
          </span>
          <span className="font-heading font-bold text-[18px] text-text-low">kg</span>
          {weightDiff !== null && (
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full font-subheading font-bold text-[13px] border ${
              weightDiff >= 0
                ? "bg-accent3/10 border-accent3 text-accent3"
                : "bg-red-bg1 border-red text-red"
            }`}>
              {weightDiff >= 0
                ? <TrendingUp size={13} />
                : <TrendingDown size={13} />}
              {Math.abs(weightDiff)}kg
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="font-heading font-extrabold text-[48px] text-text-low leading-none">--</span>
          <span className="font-heading font-bold text-[18px] text-text-low">kg</span>
        </div>
      )}
      <p className="font-body text-[12px] text-text-low -mt-2">
        Peso corporal · Últimas {selectedRange === "1M" ? "4 semanas" : selectedRange === "3M" ? "12 semanas" : selectedRange === "6M" ? "6 meses" : "1 año"}
      </p>

      {/* GRAFICA */}
      <Card>{renderWeightChart()}</Card>

      {/* MEDIDAS SEMANALES */}
      <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mt-2">
        Medidas esta semana
      </p>

      {weeklyCheckin ? (
        <>
          <div className="flex gap-3">
            <Card>
              <div className="flex flex-col gap-1">
                <div className="h-9 w-9 rounded-lg bg-red-bg1 border border-red flex items-center justify-center shrink-0">
                  <Percent size={16} className="text-red" />
                </div>
                <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mt-1">% Grasa</p>
                <div className="flex items-baseline gap-1">
                  <p className="font-heading font-extrabold text-[28px] text-text-high leading-none">
                    {weeklyCheckin.body_fat_pct ?? "--"}
                  </p>
                  <p className="font-body text-[14px] text-text-low">%</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col gap-1">
                <div className="h-9 w-9 rounded-lg bg-accent3/10 border border-accent3 flex items-center justify-center shrink-0">
                  <Ruler size={16} className="text-accent3" />
                </div>
                <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mt-1">Cintura</p>
                <div className="flex items-baseline gap-1">
                  <p className="font-heading font-extrabold text-[28px] text-text-high leading-none">
                    {weeklyCheckin.waist_cm ?? "--"}
                  </p>
                  <p className="font-body text-[14px] text-text-low">cm</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex gap-2">
            <MedidaCard
              icon={<Dumbbell size={14} color="#6c63ff" />}
              label="Pecho"
              value={weeklyCheckin.chest_cm}
              unit="cm"
              color="#6c63ff"
              borderColor="rgba(108,99,255,0.4)"
              bgColor="rgba(108,99,255,0.06)"
            />
            <MedidaCard
              icon={<Scale size={14} color="#f5a623" />}
              label="Brazo"
              value={weeklyCheckin.arm_cm}
              unit="cm"
              color="#f5a623"
              borderColor="rgba(245,166,35,0.4)"
              bgColor="rgba(245,166,35,0.06)"
            />
            <MedidaCard
              icon={<PersonStanding size={14} color="#ff6b9d" />}
              label="Pierna"
              value={weeklyCheckin.leg_cm}
              unit="cm"
              color="#ff6b9d"
              borderColor="rgba(255,107,157,0.4)"
              bgColor="rgba(255,107,157,0.06)"
            />
          </div>
        </>
      ) : (
        <button
          onClick={() => navigate("/dailyRegister")}
          className="w-full bg-surf border border-text-low border-dashed rounded-2xl py-6 flex flex-col items-center gap-2"
        >
          <ClipboardList size={28} className="text-text-low" />
          <p className="font-heading font-bold text-[15px] text-text-high">Sin registro esta semana</p>
          <p className="font-body text-[12px] text-primary">+ Registrar ahora</p>
        </button>
      )}

      {/* SENSACIONES */}
      <div className="flex items-center justify-between mt-2">
        <p className="font-subheading font-bold text-[14px] text-text-high tracking-wide">
          Sensaciones y Recuperación
        </p>
        <p className="font-body text-[12px] text-text-low">Esta semana</p>
      </div>

      <Card>
        <div className="flex flex-col divide-y divide-text-low/20">

          {/* CALIDAD DEL SUENO */}
          <div className="py-3 first:pt-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary flex items-center justify-center shrink-0">
                <Moon size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Calidad del sueño</p>
                  <p className="font-body text-[11px] text-text-low">Esta semana</p>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="font-heading font-extrabold text-[22px] text-text-high leading-none">
                    {weeklyCheckin?.sleep_quality ?? "--"}
                  </p>
                  <p className="font-body text-[13px] text-text-low">/10</p>
                </div>
              </div>
            </div>
            {weeklyCheckin?.sleep_quality && (
              <SensacionBar value={weeklyCheckin.sleep_quality} color="#ff6b9d" />
            )}
          </div>

          {/* NIVEL DE ENERGIA */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-orange-bg2 border border-orange flex items-center justify-center shrink-0">
                <Zap size={16} className="text-orange" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Nivel de energía</p>
                  <p className="font-body text-[11px] text-text-low">Esta semana</p>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="font-heading font-extrabold text-[22px] text-text-high leading-none">
                    {weeklyCheckin?.energy_level ?? "--"}
                  </p>
                  <p className="font-body text-[13px] text-text-low">/10</p>
                </div>
              </div>
            </div>
            {weeklyCheckin?.energy_level && (
              <SensacionBar value={weeklyCheckin.energy_level} color="#36d9b8" />
            )}
          </div>

          {/* FATIGA MUSCULAR */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-accent2/10 border border-accent2 flex items-center justify-center shrink-0">
                <Wind size={16} className="text-accent2" />
              </div>
              <div className="flex-1">
                <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Fatiga muscular</p>
              </div>
            </div>
            <div className="flex gap-2">
              {["Ninguna", "Baja", "Media", "Alta"].map((nivel) => (
                <span
                  key={nivel}
                  className="px-2.5 py-1 rounded-full font-subheading font-bold text-[12px] border transition-all"
                  style={{
                    backgroundColor: weeklyCheckin?.muscle_fatigue === nivel ? "rgba(54,217,184,0.1)" : "transparent",
                    borderColor: weeklyCheckin?.muscle_fatigue === nivel ? "#36d9b8" : "#6b6b8a",
                    color: weeklyCheckin?.muscle_fatigue === nivel ? "#36d9b8" : "#6b6b8a",
                  }}
                >
                  {nivel}
                </span>
              ))}
            </div>
          </div>

          {/* MOLESTIAS ARTICULARES */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-surf border border-text-low flex items-center justify-center shrink-0">
                <Bone size={16} className="text-text-low" />
              </div>
              <div className="flex-1">
                <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Molestias articulares</p>
              </div>
            </div>
            <div className="flex gap-2">
              {["Ninguna", "Leves", "Severas"].map((nivel) => (
                <span
                  key={nivel}
                  className="px-2.5 py-1 rounded-full font-subheading font-bold text-[12px] border transition-all"
                  style={{
                    backgroundColor: weeklyCheckin?.joint_pain === nivel ? "rgba(54,217,184,0.1)" : "transparent",
                    borderColor: weeklyCheckin?.joint_pain === nivel ? "#36d9b8" : "#6b6b8a",
                    color: weeklyCheckin?.joint_pain === nivel ? "#36d9b8" : "#6b6b8a",
                  }}
                >
                  {nivel}
                </span>
              ))}
            </div>
          </div>

          {/* ESTRES PERCIBIDO */}
          <div className="py-3 last:pb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-red-bg1 border border-red flex items-center justify-center shrink-0">
                <Brain size={16} className="text-red" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Estrés percibido</p>
                  <p className="font-body text-[11px] text-text-low">Esta semana</p>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="font-heading font-extrabold text-[22px] text-text-high leading-none">
                    {weeklyCheckin?.stress_level ?? "--"}
                  </p>
                  <p className="font-body text-[13px] text-text-low">/10</p>
                </div>
              </div>
            </div>
            {weeklyCheckin?.stress_level && (
              <SensacionBar value={weeklyCheckin.stress_level} color="#f5a623" />
            )}
          </div>

          {/* NOTA AL ENTRENADOR */}
          {weeklyCheckin?.trainer_note && (
            <div className="pt-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={16} className="text-text-low" />
                <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Nota al entrenador</p>
              </div>
              <p className="font-body text-[13px] text-text-low italic">"{weeklyCheckin.trainer_note}"</p>
            </div>
          )}
        </div>
      </Card>

      {/* BOTON REGISTRO */}
      <button
        onClick={() => navigate("/dailyRegister")}
        className="w-full bg-surf border border-text-low rounded-2xl px-4 py-4 flex items-center gap-4 hover:border-primary transition-colors"
      >
        <div className="h-10 w-10 rounded-xl bg-primary-bg border border-primary flex items-center justify-center shrink-0">
          <ClipboardList size={18} className="text-primary" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-heading font-bold text-[16px] text-text-high">
            {weeklyCheckin ? "Actualizar registro semanal" : "Registrar sensaciones de la semana"}
          </p>
          <p className="font-body text-[12px] text-text-low">
            {weeklyCheckin ? "Modifica tu check-in de esta semana" : "Envia tu check-in semanal al entrenador"}
          </p>
        </div>
        <ChevronRight size={18} className="text-primary" />
      </button>

    </div>
  );
};

export default ProgressCuerpo;