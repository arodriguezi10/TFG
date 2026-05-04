import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";

const ProgressCuerpo = ({ subscriptionTier }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState("1M");
  const [measurements, setMeasurements] = useState([]);
  const [latestMeasurement, setLatestMeasurement] = useState(null);
  const [prevMeasurement, setPrevMeasurement] = useState(null);

  const RANGE_DAYS = { "1M": 30, "3M": 90, "6M": 180, "1A": 365 };

  const RANGES = [
    { label: "1M", minTier: "free" },
    { label: "3M", minTier: "pro" },
    { label: "6M", minTier: "pro" },
    { label: "1A", minTier: "elite" },
  ];

  useEffect(() => {
    if (user) loadMeasurements("1M");
  }, [user]);

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

        // Mapear weight_logs al formato que espera la grafica
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

  // Grafica SVG de linea para peso
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
  const fatDiff = getDiff(latestMeasurement, prevMeasurement, "body_fat_pct");
  const waistDiff = getDiff(latestMeasurement, prevMeasurement, "waist_cm");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 gap-4">

      {/* CABECERA COMPOSICION CORPORAL */}
      <div className="flex items-center justify-between">
        <p className="font-heading font-extrabold text-[20px] text-text-high">
          Composición Corporal
        </p>
        <button
          onClick={() => navigate("/bodyRegister")}
          className="font-subheading font-bold text-[14px] text-primary"
        >
          + Registrar hoy
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
                  <span className="text-[9px]">🔒</span>
                  <span>{label}</span>
                </span>
              ) : label}
            </button>
          );
        })}
      </div>

      {/* PESO ACTUAL Y DIFERENCIA */}
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
              {weightDiff >= 0 ? "↑" : "↓"} +{Math.abs(weightDiff)}kg
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

      {/* GRAFICA PESO */}
      <Card>{renderWeightChart()}</Card>

      {/* CARDS GRASA Y CINTURA */}
      <div className="flex gap-3">
        {/* GRASA CORPORAL */}
        <Card>
          <div className="flex flex-col gap-1">
            <div className="h-9 w-9 rounded-lg bg-red-bg1 border border-red flex items-center justify-center text-[16px]">
              📉
            </div>
            <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mt-1">
              % de grasa
            </p>
            <div className="flex items-baseline gap-1">
              <p className="font-heading font-extrabold text-[28px] text-text-high leading-none">
                {latestMeasurement?.body_fat_pct ?? "--"}
              </p>
              <p className="font-body text-[14px] text-text-low">%</p>
              {fatDiff !== null && (
                <span style={{ color: fatDiff <= 0 ? "#36d9b8" : "#ff5757", fontSize: "14px" }}>
                  {fatDiff <= 0 ? "↓" : "↑"}
                </span>
              )}
            </div>
            <p className="font-body text-[11px] text-text-low">
              Ultima medicion · {latestMeasurement ? formatAxisDate(latestMeasurement.created_at) : "--"}
            </p>
            <button
              onClick={() => navigate("/bodyRegister")}
              className="font-subheading font-bold text-[12px] text-primary mt-1"
            >
              + Registrar hoy
            </button>
          </div>
        </Card>

        {/* CINTURA */}
        <Card>
          <div className="flex flex-col gap-1">
            <div className="h-9 w-9 rounded-lg bg-accent3/10 border border-accent3 flex items-center justify-center text-[16px]">
              📏
            </div>
            <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mt-1">
              Cintura
            </p>
            <div className="flex items-baseline gap-1">
              <p className="font-heading font-extrabold text-[28px] text-text-high leading-none">
                {latestMeasurement?.waist_cm ?? "--"}
              </p>
              <p className="font-body text-[14px] text-text-low">cm</p>
              {waistDiff !== null && (
                <span style={{ color: waistDiff <= 0 ? "#36d9b8" : "#ff5757", fontSize: "14px" }}>
                  {waistDiff <= 0 ? "↓" : "↑"}
                </span>
              )}
            </div>
            <p className="font-body text-[11px] text-text-low">
              Ultima medicion · {latestMeasurement ? formatAxisDate(latestMeasurement.created_at) : "--"}
            </p>
            <button
              onClick={() => navigate("/bodyRegister")}
              className="font-subheading font-bold text-[12px] text-primary mt-1"
            >
              + Registrar hoy
            </button>
          </div>
        </Card>
      </div>

      {/* SENSACIONES Y RECUPERACION — datos estaticos de momento */}
      <div className="flex items-center justify-between mt-2">
        <p className="font-heading font-extrabold text-[20px] text-text-high">
          Sensaciones y Recuperación
        </p>
        <p className="font-body text-[12px] text-text-low">Últimos 7 días</p>
      </div>

      <Card>
        <div className="flex flex-col divide-y divide-text-low/20">

          {/* CALIDAD DEL SUENO */}
          <div className="py-3 first:pt-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary flex items-center justify-center text-[16px] shrink-0">
                🌙
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
                    Calidad del sueño
                  </p>
                  <p className="font-body text-[11px] text-text-low">Media 7d</p>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="font-heading font-extrabold text-[22px] text-text-high leading-none">7</p>
                  <p className="font-body text-[13px] text-text-low">/10</p>
                </div>
              </div>
            </div>
            <div className="w-full h-1.5 bg-surf rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "70%", backgroundColor: "#ff6b9d" }} />
            </div>
          </div>

          {/* NIVEL DE ENERGIA */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-orange-bg2 border border-orange flex items-center justify-center text-[16px] shrink-0">
                ⚡
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
                    Nivel de energía
                  </p>
                  <p className="font-body text-[11px] text-text-low">Media 7d</p>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="font-heading font-extrabold text-[22px] text-text-high leading-none">8</p>
                  <p className="font-body text-[13px] text-text-low">/10</p>
                </div>
              </div>
            </div>
            <div className="w-full h-1.5 bg-surf rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "80%", backgroundColor: "#36d9b8" }} />
            </div>
          </div>

          {/* FATIGA MUSCULAR */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-accent2/10 border border-accent2 flex items-center justify-center text-[16px] shrink-0">
                😮‍💨
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
                    Fatiga muscular
                  </p>
                  <p className="font-body text-[11px] text-text-low">Media 7d</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {["Ninguna", "Baja", "Media", "Alta"].map((nivel, i) => (
                <span
                  key={nivel}
                  className={`px-2.5 py-1 rounded-full font-subheading font-bold text-[12px] border ${
                    i === 0
                      ? "bg-accent3/10 border-accent3 text-accent3"
                      : "bg-surf border-text-low text-text-low"
                  }`}
                >
                  {nivel}
                </span>
              ))}
            </div>
          </div>

          {/* MOLESTIAS ARTICULARES */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-surf border border-text-low flex items-center justify-center text-[16px] shrink-0">
                🦴
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
                    Molestias articulares
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {["Ninguna", "Leves", "Severas"].map((nivel, i) => (
                <span
                  key={nivel}
                  className={`px-2.5 py-1 rounded-full font-subheading font-bold text-[12px] border ${
                    i === 0
                      ? "bg-accent3/10 border-accent3 text-accent3"
                      : "bg-surf border-text-low text-text-low"
                  }`}
                >
                  {nivel}
                </span>
              ))}
            </div>
          </div>

          {/* ESTRES PERCIBIDO */}
          <div className="py-3 last:pb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-red-bg1 border border-red flex items-center justify-center text-[16px] shrink-0">
                🧠
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
                    Estrés percibido
                  </p>
                  <p className="font-body text-[11px] text-text-low">Media 7d</p>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="font-heading font-extrabold text-[22px] text-text-high leading-none">5</p>
                  <p className="font-body text-[13px] text-text-low">/10</p>
                </div>
              </div>
            </div>
            <div className="w-full h-1.5 bg-surf rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "50%", backgroundColor: "#f5a623" }} />
            </div>
          </div>
        </div>
      </Card>

      {/* REGISTRO DIARIO */}
      <div className="flex items-center gap-2 mt-2">
        <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">
          Registro diario
        </p>
      </div>

      <button
        onClick={() => navigate("/dailyRegister")}
        className="w-full bg-surf border border-text-low rounded-2xl px-4 py-4 flex items-center gap-4 hover:border-primary transition-colors"
      >
        <div className="h-10 w-10 rounded-xl bg-primary-bg border border-primary flex items-center justify-center text-[18px] shrink-0">
          📋
        </div>
        <div className="flex-1 text-left">
          <p className="font-heading font-bold text-[16px] text-text-high">
            Registrar sensaciones de hoy
          </p>
          <p className="font-body text-[12px] text-text-low">
            Envia tu check-in diario al entrenador
          </p>
        </div>
        <span className="text-primary text-[18px]">›</span>
      </button>

    </div>
  );
};

export default ProgressCuerpo;