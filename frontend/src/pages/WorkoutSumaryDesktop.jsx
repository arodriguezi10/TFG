import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import { ChevronLeft, Timer, Hash, Weight, CheckCircle2, Zap, AlertTriangle, MessageCircle } from "lucide-react";

const WorkoutSumaryDesktop = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { sessionDuration, totalSets, completedExercises, exercisesData, sessionId, fromProgression, completedDate } = location.state || {};

  const [personalFeedback, setPersonalFeedback] = useState({ energyLevel: 0, feltPain: false, painDescription: "", trainerNotes: "" });
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [showPainInput, setShowPainInput] = useState(false);

  useEffect(() => { if (!location.state) navigate("/dashboard"); }, []);

  const calculateTotalVolume = () => {
    if (!exercisesData) return 0;
    let totalVolume = 0;
    Object.values(exercisesData).forEach((exerciseSeries) => {
      exerciseSeries.forEach((serie) => {
        if (serie.completed && serie.actualReps && serie.actualWeight) totalVolume += parseFloat(serie.actualReps) * parseFloat(serie.actualWeight);
      });
    });
    return totalVolume.toFixed(0);
  };

  const calculateExerciseStats = () => {
    if (!exercisesData) return [];
    return Object.keys(exercisesData).map((exerciseId) => {
      const exerciseSeries = exercisesData[exerciseId];
      const completedSeries = exerciseSeries.filter((s) => s.completed);
      const percentage = exerciseSeries.length > 0 ? (completedSeries.length / exerciseSeries.length) * 100 : 0;
      const exerciseName = exerciseSeries[0]?.exerciseName || "Ejercicio";
      let status = "Plan cumplido", statusColor = "text-accent3", iconBg = "bg-accent3/20", borderColor = "border-accent3", icon = "✓";
      if (percentage < 100 && percentage >= 80) {
        const incompleteSerie = exerciseSeries.findIndex((s) => !s.completed) + 1;
        status = `Desviacion en la S${incompleteSerie}`; statusColor = "text-orange"; iconBg = "bg-orange/20"; borderColor = "border-orange"; icon = "⚠";
      }
      return { exerciseId, name: exerciseName, percentage: Math.round(percentage), status, statusColor, iconBg, borderColor, icon, series: exerciseSeries };
    });
  };

  const handleSaveFeedback = async () => {
    if (personalFeedback.energyLevel === 0) { alert("Por favor selecciona tu nivel de energia"); return; }
    try {
      const { error } = await supabase.from("workout_sessions").update({ energy_level: personalFeedback.energyLevel, felt_pain: personalFeedback.feltPain, pain_description: personalFeedback.painDescription || null, trainer_notes: personalFeedback.trainerNotes || null, total_volume: parseFloat(totalVolume) || 0 }).eq("id", sessionId);
      if (error) throw error;
      alert("Sesion guardada correctamente");
      navigate(fromProgression ? "/progression" : "/dashboard", { state: fromProgression ? { justCompleted: true, completedDate } : undefined });
    } catch (error) { console.error("Error guardando sesion:", error); alert("Error al guardar"); }
  };

  const totalVolume = calculateTotalVolume();
  const exerciseStats = calculateExerciseStats();
  const currentDate = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const stats = [
    { icon: <Timer size={20} className="text-primary" />, bg: "bg-primary/10", border: "border-primary", value: `${sessionDuration || 0}m`, label: "Duracion total" },
    { icon: <Hash size={20} className="text-accent1" />, bg: "bg-accent1/10", border: "border-accent1", value: totalSets || 0, label: "Series totales" },
    { icon: <Weight size={20} className="text-yellow" />, bg: "bg-accent2/10", border: "border-accent2", value: `${totalVolume}kg`, label: "Volumen total" },
    { icon: <CheckCircle2 size={20} className="text-green" />, bg: "bg-green/10", border: "border-green", value: completedExercises || 0, label: "Ejercicios completados" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center gap-4">
        <button onClick={() => navigate(fromProgression ? "/progression" : "/dashboard")} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors shrink-0">
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5 capitalize">{currentDate}</p>
          <h1 className="font-heading font-extrabold text-[28px] text-text-high">Resumen de entrenamiento</h1>
        </div>
      </div>

      <div className="flex-1 px-8 py-6 grid grid-cols-3 gap-6">

        {/* COLUMNA IZQUIERDA — STATS + EJERCICIOS */}
        <div className="col-span-2 flex flex-col gap-5">

          {/* STATS */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <Card key={i}>
                <div className="flex flex-col gap-2">
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center shrink-0`}>{stat.icon}</div>
                  <p className="font-heading font-bold text-[24px] text-text-high leading-none">{stat.value}</p>
                  <p className="font-body text-[11px] text-text-low">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* RENDIMIENTO POR EJERCICIO */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-[18px] text-text-high">Revisa tu rendimiento</h2>
              <p className="font-body text-[12px] text-text-low uppercase tracking-wide">{completedExercises || 0} ejercicios</p>
            </div>
            <div className="flex flex-col gap-3">
              {exerciseStats.map((exercise, index) => {
                const isExpanded = expandedExercise === exercise.exerciseId;
                return (
                  <Card key={index}>
                    <button onClick={() => setExpandedExercise(isExpanded ? null : exercise.exerciseId)} className="w-full flex items-center gap-4">
                      <div className={`h-11 w-11 rounded-xl ${exercise.iconBg} border ${exercise.borderColor} flex items-center justify-center text-[20px] shrink-0`}>{exercise.icon}</div>
                      <div className="flex-1 text-left">
                        <p className="font-heading font-bold text-[15px] text-text-high mb-1">{exercise.name}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-surf rounded-full overflow-hidden">
                            <div className={`h-full ${exercise.statusColor.replace("text-", "bg-")} transition-all rounded-full`} style={{ width: `${exercise.percentage}%` }} />
                          </div>
                          <span className="font-body text-[11px] text-text-low">{exercise.percentage}%</span>
                        </div>
                        <p className={`font-body text-[11px] ${exercise.statusColor} mt-0.5`}>{exercise.status}</p>
                      </div>
                      <div className={`text-text-low transition-transform ${isExpanded ? "rotate-180" : ""}`}>⌄</div>
                    </button>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-text-low">
                        <div className="grid grid-cols-4 gap-2 text-[11px] font-subheading font-semibold text-text-low uppercase text-center mb-2">
                          <div>SET</div><div>PLANIFICADO</div><div>TUS DATOS</div><div>CUMPL.</div>
                        </div>
                        {exercise.series.map((serie, idx) => (
                          <div key={idx} className="grid grid-cols-4 gap-2 items-center py-2 text-center border-t border-text-low/30">
                            <div className="font-heading font-bold text-[14px] text-text-high">S{serie.serieNumber}</div>
                            <div className="font-body text-[12px] text-text-low">{serie.targetReps}×12@RIR2</div>
                            <div className="font-heading font-semibold text-[13px] text-accent3">{serie.completed ? `${serie.actualReps}×12@RIR2` : "—"}</div>
                            <div className={`font-heading font-bold text-[14px] px-2 py-1 rounded-lg ${serie.completed ? "bg-accent3 text-background" : "bg-orange text-background"}`}>
                              {serie.completed ? "100%" : `${Math.round(((parseInt(serie.actualReps) || 0) / serie.targetReps) * 100)}%`}
                            </div>
                          </div>
                        ))}
                        <div className="mt-3 pt-3 border-t border-text-low">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px]">🎯</span>
                            <p className="font-body text-[12px] text-text-low">Tecnica: <span className="text-text-high font-semibold">Ninguna pautada</span></p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA — FEEDBACK */}
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-heading font-bold text-[18px] text-text-high mb-1">Feedback personal</h2>
            <p className="font-body text-[12px] text-text-low uppercase tracking-wide mb-4">Para el entrenador</p>

            <Card>
              <div className="flex flex-col gap-5">
                {/* ENERGIA */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary flex items-center justify-center shrink-0"><Zap size={16} className="text-primary" /></div>
                    <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Nivel de energia percibido</p>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-heading font-bold text-[36px] text-text-high leading-none">{personalFeedback.energyLevel}<span className="text-[18px] text-text-low">/10</span></p>
                  </div>
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                      <button key={num} onClick={() => setPersonalFeedback((prev) => ({ ...prev, energyLevel: num }))}
                        className={`flex-1 h-9 rounded-lg font-heading font-bold text-[13px] transition-all ${personalFeedback.energyLevel === num ? "bg-primary text-text-high" : "bg-surf border border-text-low text-text-low hover:border-primary"}`}>
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DOLOR */}
                <div className="pt-4 border-t border-text-low">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-text-low" />
                    <p className="font-heading font-bold text-[15px] text-text-high">Reporte de molestia</p>
                  </div>
                  <p className="font-body text-[13px] text-text-low mb-3">Sentiste algun dolor o molestia?</p>
                  <button onClick={() => { setShowPainInput(!showPainInput); setPersonalFeedback((prev) => ({ ...prev, feltPain: !prev.feltPain })); }}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border transition-all ${personalFeedback.feltPain ? "bg-red/10 border-red text-red" : "bg-surf border-text-low text-text-low hover:border-red"}`}>
                    <span className="text-[16px]">{personalFeedback.feltPain ? "⚠️" : "⭕"}</span>
                    <span className="font-heading font-semibold text-[14px]">{personalFeedback.feltPain ? "Reportar molestia" : "Sin molestias"}</span>
                  </button>
                  {showPainInput && personalFeedback.feltPain && (
                    <textarea placeholder="Escribe tu molestia para que lo vea el entrenador" value={personalFeedback.painDescription}
                      onChange={(e) => setPersonalFeedback((prev) => ({ ...prev, painDescription: e.target.value }))}
                      className="w-full mt-3 bg-surf border border-red rounded-xl px-3 py-2.5 text-text-high text-[14px] font-body outline-none resize-none" rows={3} />
                  )}
                </div>

                {/* NOTA */}
                <div className="pt-4 border-t border-text-low">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={16} className="text-text-low" />
                    <p className="font-body text-[12px] text-text-low uppercase tracking-wide">Nota para el entrenador (opc.)</p>
                  </div>
                  <textarea placeholder="Explica como te has sentido hoy." value={personalFeedback.trainerNotes}
                    onChange={(e) => setPersonalFeedback((prev) => ({ ...prev, trainerNotes: e.target.value }))}
                    className="w-full bg-surf border border-text-low rounded-xl px-3 py-2.5 text-text-high text-[14px] font-body outline-none focus:border-primary transition-colors resize-none" rows={4} />
                </div>
              </div>
            </Card>
          </div>

          <button onClick={handleSaveFeedback} className="w-full py-4 rounded-2xl font-heading font-bold text-[16px] bg-primary text-text-high hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            ✉️ Guardar y enviar al entrenador
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSumaryDesktop;