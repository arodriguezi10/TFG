import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";

const WorkoutSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const {
    sessionDuration,
    totalSets,
    completedExercises,
    exercisesData,
    sessionId
  } = location.state || {};

  const [personalFeedback, setPersonalFeedback] = useState({
    energyLevel: 0,
    feltPain: false,
    painDescription: '',
    trainerNotes: ''
  });

  const [expandedExercise, setExpandedExercise] = useState(null);

  const [showPainInput, setShowPainInput] = useState(false);

  useEffect(() => {
    if (!location.state) {
      navigate('/dashboard');
    }
  }, []);

  const calculateTotalVolume = () => {
    if (!exercisesData) return 0;
    
    let totalVolume = 0;
    Object.values(exercisesData).forEach(exerciseSeries => {
      exerciseSeries.forEach(serie => {
        if (serie.completed && serie.actualReps && serie.actualWeight) {
          totalVolume += parseFloat(serie.actualReps) * parseFloat(serie.actualWeight);
        }
      });
    });
    
    return totalVolume.toFixed(0);
  };

  const calculateExerciseStats = () => {
    if (!exercisesData) return [];
    
    const stats = [];
    Object.keys(exercisesData).forEach(exerciseId => {
      const exerciseSeries = exercisesData[exerciseId];
      const completedSeries = exerciseSeries.filter(s => s.completed);
      const totalSeries = exerciseSeries.length;
      const percentage = totalSeries > 0 ? (completedSeries.length / totalSeries) * 100 : 0;
      
      const exerciseName = exerciseSeries[0]?.exerciseName || 'Ejercicio';
      
      let status = 'Plan cumplido';
      let statusColor = 'text-accent3';
      let iconBg = 'bg-accent3/20';
      let borderColor = 'border-accent3';
      let icon = '✓';
      
      if (percentage < 100 && percentage >= 80) {
        const incompleteSerie = exerciseSeries.findIndex(s => !s.completed) + 1;
        status = `Desviación en la S${incompleteSerie}`;
        statusColor = 'text-orange';
        iconBg = 'bg-orange/20';
        borderColor = 'border-orange';
        icon = '⚠';
      } else if (percentage === 100) {
        status = 'Plan cumplido';
      } else if (percentage >= 95) {
        status = 'Casi perfecto';
      }
      
      stats.push({
        exerciseId,
        name: exerciseName,
        percentage: Math.round(percentage),
        status,
        statusColor,
        iconBg,
        borderColor,
        icon,
        series: exerciseSeries
      });
    });
    
    return stats;
  };

  const handleSaveFeedback = async () => {
    if (personalFeedback.energyLevel === 0) {
      alert('⚠️ Por favor selecciona tu nivel de energía');
      return;
    }

    try {
      const { error } = await supabase
        .from('workout_feedback')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          energy_level: personalFeedback.energyLevel,
          felt_pain: personalFeedback.feltPain,
          pain_description: personalFeedback.painDescription || null,
          trainer_notes: personalFeedback.trainerNotes || null
        });

      if (error) throw error;

      alert('✅ Feedback guardado');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error guardando feedback:', error);
      alert('❌ Error al guardar feedback');
    }
  };

  const totalVolume = calculateTotalVolume();
  const exerciseStats = calculateExerciseStats();
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background flex flex-col pb-[120px]">
      {/* HEADER */}
      <section className="w-full px-4 pt-4 pb-4 border-b border-text-low/20">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-surf h-10 w-10 rounded-lg border border-text-low flex items-center justify-center text-text-high hover:bg-surface transition-colors"
          >
            ←
          </button>

          <button className="bg-surf h-10 w-10 rounded-lg border border-text-low flex items-center justify-center text-text-high hover:bg-surface transition-colors">
            ⋮
          </button>
        </div>

        <div className="text-center">
          <h1 className="font-heading font-extrabold text-[24px] text-text-high leading-tight mb-1">
            Resumen de<br />entrenamiento
          </h1>
          <p className="font-body text-[13px] text-text-low capitalize">
            {currentDate}
          </p>
        </div>
      </section>

      {/* STATS GRID */}
      <section className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-[20px]">
                ⏱️
              </div>
              <div>
                <p className="font-heading font-bold text-[24px] text-text-high leading-none">
                  {sessionDuration || 0}m
                </p>
                <p className="font-body text-[11px] text-text-low">
                  Duración total
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent1/20 flex items-center justify-center text-[20px]">
                🔢
              </div>
              <div>
                <p className="font-heading font-bold text-[24px] text-text-high leading-none">
                  {totalSets || 0}
                </p>
                <p className="font-body text-[11px] text-text-low">
                  Series totales
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent2/20 flex items-center justify-center text-[20px]">
                💪
              </div>
              <div>
                <p className="font-heading font-bold text-[20px] text-text-high leading-none">
                  {totalVolume}
                  <span className="text-[12px] text-text-low ml-1">kg</span>
                </p>
                <p className="font-body text-[11px] text-text-low">
                  Volumen total
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent3/20 flex items-center justify-center text-[20px]">
                ⚡
              </div>
              <div>
                <p className="font-heading font-bold text-[24px] text-text-high leading-none">
                  {Math.floor((sessionDuration || 0) * 0.75)}m
                </p>
                <p className="font-body text-[11px] text-text-low">
                  Tiempo de trabajo
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* REVISA TU RENDIMIENTO */}
      <section className="px-4 mt-6">
        <h2 className="font-heading font-bold text-[18px] text-text-high mb-1">
          Revisa tu rendimiento
        </h2>
        <p className="font-body text-[12px] text-text-low mb-3 uppercase tracking-wide">
          {completedExercises || 0} EJERCICIOS
        </p>

        <div className="flex flex-col gap-2">
          {exerciseStats.map((exercise, index) => {
            const isExpanded = expandedExercise === exercise.exerciseId;
            
            return (
              <Card key={index}>
                <button
                  onClick={() => setExpandedExercise(isExpanded ? null : exercise.exerciseId)}
                  className="w-full flex items-center gap-3"
                >
                  <div className={`h-11 w-11 rounded-lg ${exercise.iconBg} border ${exercise.borderColor} flex items-center justify-center text-[20px] shrink-0`}>
                    {exercise.icon}
                  </div>

                  <div className="flex-1 text-left">
                    <p className="font-heading font-bold text-[15px] text-text-high mb-1">
                      {exercise.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-surf rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${exercise.statusColor.replace('text-', 'bg-')} transition-all rounded-full`}
                          style={{ width: `${exercise.percentage}%` }}
                        />
                      </div>
                      <span className="font-body text-[11px] text-text-low">
                        {exercise.percentage}%
                      </span>
                    </div>
                    <p className={`font-body text-[11px] ${exercise.statusColor} mt-0.5`}>
                      {exercise.status}
                    </p>
                  </div>

                  <div className={`text-text-low text-[16px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ⌄
                  </div>
                </button>

                {/* DETALLE DESPLEGABLE */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-text-low">
                    <div className="grid grid-cols-4 gap-2 text-[11px] font-subheading font-semibold text-text-low uppercase text-center mb-2">
                      <div>SET</div>
                      <div>PLANIFICADO</div>
                      <div>TUS DATOS</div>
                      <div>CUMP.</div>
                    </div>

                    {exercise.series.map((serie, idx) => (
                      <div 
                        key={idx}
                        className="grid grid-cols-4 gap-2 items-center py-2 text-center border-t border-text-low/30"
                      >
                        <div className="font-heading font-bold text-[14px] text-text-high">
                          S{serie.serieNumber}
                        </div>
                        <div className="font-body text-[12px] text-text-low">
                          {serie.targetReps}×12@RIR2
                        </div>
                        <div className="font-heading font-semibold text-[13px] text-accent3">
                          {serie.completed ? `${serie.actualReps}×12@RIR2` : '—'}
                        </div>
                        <div className={`font-heading font-bold text-[14px] px-2 py-1 rounded-lg ${
                          serie.completed 
                            ? 'bg-accent3 text-background' 
                            : 'bg-orange text-background'
                        }`}>
                          {serie.completed ? '100%' : `${Math.round((parseInt(serie.actualReps) || 0) / serie.targetReps * 100)}%`}
                        </div>
                      </div>
                    ))}

                    <div className="mt-3 pt-3 border-t border-text-low">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px]">🎯</span>
                        <p className="font-body text-[12px] text-text-low">
                          Técnica: <span className="text-text-high font-semibold">Ninguna pautada</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* FEEDBACK PERSONAL */}
      <section className="px-4 mt-6">
        <h2 className="font-heading font-bold text-[18px] text-text-high mb-1">
          Feedback personal
        </h2>
        <p className="font-body text-[12px] text-text-low mb-3 uppercase tracking-wide">
          PARA EL ENTRENADOR
        </p>

        <Card>
          <div className="space-y-4">
            {/* NIVEL DE ENERGÍA */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-[18px] shrink-0">
                  ⚡
                </div>
                <p className="font-heading font-semibold text-[13px] text-text-low uppercase tracking-wide">
                  NIVEL DE ENERGÍA PERCIBIDO
                </p>
              </div>

              <div className="flex items-center justify-between mb-2">
                <p className="font-heading font-bold text-[32px] text-text-high">
                  {personalFeedback.energyLevel}
                  <span className="text-[18px] text-text-low">/10</span>
                </p>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    onClick={() => setPersonalFeedback(prev => ({ ...prev, energyLevel: num }))}
                    className={`flex-1 h-10 rounded-lg font-heading font-bold text-[14px] transition-all ${
                      personalFeedback.energyLevel === num
                        ? 'bg-primary text-text-high'
                        : 'bg-surf border border-text-low text-text-low hover:border-primary'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* REPORTE DE MOLESTIA */}
            <div className="pt-4 border-t border-text-low">
              <p className="font-heading font-bold text-[15px] text-text-high mb-3">
                Reporte de molestia
              </p>
              <p className="font-body text-[13px] text-text-low mb-3">
                ¿Sentiste algún dolor o molestia?
              </p>

              <button
                onClick={() => {
                  setShowPainInput(!showPainInput);
                  setPersonalFeedback(prev => ({ ...prev, feltPain: !prev.feltPain }));
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-all ${
                  personalFeedback.feltPain
                    ? 'bg-red/10 border-red text-red'
                    : 'bg-surf border-text-low text-text-low hover:border-red'
                }`}
              >
                <span className="text-[16px]">{personalFeedback.feltPain ? '⚠️' : '⭕'}</span>
                <span className="font-heading font-semibold text-[14px]">
                  {personalFeedback.feltPain ? 'Reportar molestia' : 'Sin molestias'}
                </span>
              </button>

              {showPainInput && personalFeedback.feltPain && (
                <textarea
                  placeholder="Escribe tu molestia para que lo vea el entrenador"
                  value={personalFeedback.painDescription}
                  onChange={(e) => setPersonalFeedback(prev => ({ ...prev, painDescription: e.target.value }))}
                  className="w-full mt-3 bg-surf border border-red rounded-lg px-3 py-2.5 text-text-high text-[14px] font-body outline-none focus:border-red transition-colors resize-none"
                  rows={3}
                />
              )}
            </div>

            {/* NOTA PARA ENTRENADOR */}
            <div className="pt-4 border-t border-text-low">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[16px]">💬</span>
                <p className="font-body text-[13px] text-text-low uppercase tracking-wide">
                  NOTA PARA TU ENTRENADOR (OPC.)
                </p>
              </div>

              <textarea
                placeholder="Explica cómo te has sentido hoy."
                value={personalFeedback.trainerNotes}
                onChange={(e) => setPersonalFeedback(prev => ({ ...prev, trainerNotes: e.target.value }))}
                className="w-full bg-surf border border-text-low rounded-lg px-3 py-2.5 text-text-high text-[14px] font-body outline-none focus:border-primary transition-colors resize-none"
                rows={3}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* BOTÓN GUARDAR Y ENVIAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          variant="outlined"
          text="✉️ Guardar y enviar al entrenador"
          bgColor="bg-primary"
          textColor="text-text-high"
          borderColor="border-primary"
          w="w-full"
          onClick={handleSaveFeedback}
        />
      </div>
    </div>
  );
};

export default WorkoutSummary;