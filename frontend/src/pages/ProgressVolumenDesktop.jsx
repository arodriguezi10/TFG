import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/Card";
import { BarChart2, Lock, Star, TrendingUp, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { STATUS_CONFIG, LEGEND, getRecoveryDays, getFatigaAnalysis, loadVolumeData } from "../utils/progressVolumenUtils";
import { useTargetUser } from "../hooks/useTargetUser";


const ProgressVolumenDesktop = ({ subscriptionTier }) => {
  const navigate = useNavigate();
  //const { user } = useContext(AuthContext);
  const { targetUserId } = useTargetUser();
  const [loading, setLoading] = useState(true);
  const [muscleData, setMuscleData] = useState([]);
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const [weekOptions, setWeekOptions] = useState([]);

  const isElite = subscriptionTier === "elite";

  useEffect(() => {
  if (!targetUserId) return;
  if (isElite) {
    loadVolumeData(targetUserId, 0, setMuscleData, setWeekOptions, setLoading);
  } else {
    setTimeout(() => setLoading(false), 0);
  }
}, [targetUserId]);
  const handleWeekChange = (offset) => {
    setSelectedWeekOffset(offset);
    loadVolumeData(targetUserId, offset, setMuscleData, setWeekOptions, setLoading);
  };

  if (!isElite) return (
    <div className="flex flex-col px-4 gap-6 py-8 max-w-2xl mx-auto">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-32 w-32 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <BarChart2 size={60} className="text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 bg-yellow-500 h-9 w-9 rounded-full flex items-center justify-center">
            <Lock size={16} className="text-background" />
          </div>
        </div>
        <span className="bg-yellow-500/10 border border-yellow-500 px-4 py-1 rounded-full font-subheading font-bold text-[13px] text-yellow-500">FUNCION ELITE</span>
      </div>
      <div className="text-center">
        <h2 className="font-heading font-extrabold text-[30px] text-text-high leading-tight mb-2">Analisis de<br /><span className="text-primary">Volumen Efectivo</span></h2>
        <p className="font-body text-[15px] text-text-low leading-relaxed">Controla tu volumen semanal por grupo muscular basado en los rangos MEV y MRV de la literatura cientifica de hipertrofia.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <Activity size={20} className="text-primary" />, title: "MEV y MRV por musculo", desc: "Saber exactamente cuantas series necesitas para crecer" },
          { icon: <TrendingUp size={20} className="text-accent3" />, title: "Tendencia semanal", desc: "Compara tu volumen con la semana anterior" },
          { icon: <AlertTriangle size={20} className="text-orange-400" />, title: "Analisis de fatiga", desc: "Detecta sobreentrenamiento antes de que ocurra" },
          { icon: <CheckCircle2 size={20} className="text-accent3" />, title: "Proyeccion de recuperacion", desc: "Dias estimados hasta recuperacion completa por musculo" },
        ].map(f => (
          <div key={f.title} className="flex items-start gap-4 bg-surf border border-text-low/20 rounded-2xl p-4">
            <div className="h-11 w-11 rounded-xl bg-background flex items-center justify-center shrink-0">{f.icon}</div>
            <div>
              <p className="font-heading font-bold text-[15px] text-text-high mb-0.5">{f.title}</p>
              <p className="font-body text-[13px] text-text-low">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/subscription")} className="w-full bg-primary border border-primary rounded-2xl py-4 font-heading font-bold text-[16px] text-text-high hover:opacity-90 flex items-center justify-center gap-2">
        <Star size={18} /> Ver planes y precios
      </button>
    </div>
  );

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="flex gap-6 px-4">

      {/* COLUMNA IZQUIERDA — TARJETAS MUSCULO */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading font-extrabold text-[20px] text-text-high">Distribucion semanal</p>
            <p className="font-body text-[12px] text-text-low">de Volumen Efectivo</p>
          </div>
          <select value={selectedWeekOffset} onChange={(e) => handleWeekChange(Number(e.target.value))}
            className="bg-surf border border-text-low rounded-xl px-3 py-2 font-subheading font-bold text-[13px] text-text-high outline-none">
            {weekOptions.map(opt => <option key={opt.offset} value={opt.offset}>{opt.label}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {[
            { label: "Mantenimiento", color: "#36d9b8" },
            { label: "MAV optimo", color: "#6c63ff" },
            { label: "Cerca MRV", color: "#f5a623" },
            { label: "MRV Excedido", color: "#ff5757" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              <p className="font-body text-[11px] text-text-low">{l.label}</p>
            </div>
          ))}
        </div>

        {muscleData.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center py-16 gap-3">
              <BarChart2 size={48} className="text-text-low" />
              <p className="font-heading font-bold text-[18px] text-text-high">Sin datos esta semana</p>
              <p className="font-body text-[14px] text-text-low text-center">Completa entrenamientos para ver tu analisis de volumen</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {muscleData.map(item => {
              const config = STATUS_CONFIG[item.status];
              return (
                <div key={item.muscle} className="rounded-2xl p-4 border" style={{ backgroundColor: config.bg, borderColor: config.border }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: config.bg, border: `1px solid ${config.border}` }}>
                      <Activity size={18} color={config.color} />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-[16px] text-text-high">{item.muscle}</p>
                      <span className="inline-flex px-2.5 py-0.5 rounded-full font-subheading font-bold text-[11px]" style={{ backgroundColor: config.bg, border: `1px solid ${config.border}`, color: config.color }}>{config.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="font-body text-[12px] text-text-low">{item.series} series · Fatiga:</p>
                    <span className="inline-flex px-2 py-0.5 rounded-full font-subheading font-bold text-[11px]" style={{ border: `1px solid ${config.color}`, color: config.color }}>
                      {config.fatiga}{item.status === "mrv_excedido" && " ↑↑"}{item.status === "cerca_mrv" && " ↑"}{item.status === "mav_optimo" && " ✓"}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background/40 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full" style={{ width: `${item.progressPct}%`, backgroundColor: config.color }} />
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="font-body text-[11px] text-text-low">MEV {item.mev}</p>
                    <p className="font-body text-[11px]" style={{ color: config.color }}>{item.series} series</p>
                    <p className="font-body text-[11px] text-red">MRV {item.mrv}</p>
                  </div>
                  {item.trend !== null && (
                    <div className="flex items-center justify-between">
                      <p className="font-body text-[11px] text-text-low">Tendencia:</p>
                      <p className="font-subheading font-bold text-[12px]" style={{ color: item.trend >= 0 ? config.color : "#ff5757" }}>
                        {item.trend >= 0 ? `↑ +${item.trend}` : `↓ ${item.trend}`} ser.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* COLUMNA DERECHA — FATIGA Y RECUPERACION */}
      {muscleData.length > 0 && (
        <div className="w-80 shrink-0 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide">Analisis de fatiga</p>
            <span className="bg-yellow-bg2 border border-orange px-2 py-0.5 rounded-full font-subheading font-bold text-[10px] text-orange">ELITE</span>
          </div>

          <Card>
            <div className="flex flex-col divide-y divide-text-low/20">
              {muscleData.map(item => {
                const analysis = getFatigaAnalysis(item);
                return (
                  <div key={item.muscle} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: analysis.iconBg, border: `1px solid ${analysis.iconBorder}` }}>
                        {analysis.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-heading font-bold text-[14px] text-text-high">{item.muscle}</p>
                          <span className="inline-flex px-2 py-0.5 rounded-full font-subheading font-bold text-[10px]" style={{ backgroundColor: analysis.statusBg, border: `1px solid ${analysis.statusColor}`, color: analysis.statusColor }}>{analysis.statusLabel}</span>
                        </div>
                        <p className="font-body text-[11px] text-text-low leading-relaxed">{analysis.descripcion}</p>
                      </div>
                    </div>
                    <span className="inline-flex px-2.5 py-0.5 rounded-full font-subheading font-bold text-[11px] border" style={{ color: analysis.recomendacionColor, borderColor: analysis.recomendacionColor, backgroundColor: `${analysis.recomendacionColor}10` }}>
                      {analysis.recomendacion}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="rounded-2xl p-4 border" style={{ backgroundColor: "rgba(245,166,35,0.05)", borderColor: "#f5a623" }}>
            <p className="font-heading font-bold text-[15px] text-text-high mb-1">Proyeccion de recuperacion</p>
            <p className="font-body text-[12px] text-text-low mb-3">Dias estimados hasta recuperacion completa</p>
            <div className="grid grid-cols-3 gap-2">
              {muscleData.map(item => {
                const recovery = getRecoveryDays(item.status);
                return (
                  <div key={item.muscle} className="bg-surf rounded-xl p-2 flex flex-col gap-0.5">
                    <p className="font-body text-[10px] text-text-low truncate">{item.muscle}</p>
                    <p className="font-heading font-extrabold text-[18px] leading-none" style={{ color: recovery.color }}>{recovery.days}</p>
                    <p className="font-body text-[10px] text-text-low">{recovery.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressVolumenDesktop;