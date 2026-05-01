import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProgression = () => {
  const navigate = useNavigate();

  const [mesocycleExpanded, setMesocycleExpanded] = useState(true);
  const [routinesExpanded, setRoutinesExpanded] = useState(false);
  const [planningExpanded, setPlanningExpanded] = useState(false);

  const [mesocycleConfirmed, setMesocycleConfirmed] = useState(false);
  const [routinesConfirmed, setRoutinesConfirmed] = useState(false);
  const [planningConfirmed, setPlanningConfirmed] = useState(false);

  // Estados del formulario
  const [mesocycleName, setMesocycleName] = useState("");
  const [mesocycleGoal, setMesocycleGoal] = useState("");
  const [mesocycleDuration, setMesocycleDuration] = useState(4);
  const [startDate, setStartDate] = useState("");

  // Generar calendario basado en fecha de inicio y duración
  const generateCalendar = () => {
    if (!startDate) return [];
    
    const start = new Date(startDate);
    const weeks = [];
    
    for (let week = 0; week < mesocycleDuration; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + (week * 7) + day);
        
        const dayName = currentDate.toLocaleDateString('es-ES', { weekday: 'short' });
        const dayNum = currentDate.getDate();
        const monthName = currentDate.toLocaleDateString('es-ES', { month: 'short' });
        
        days.push({
          date: currentDate,
          dayName: dayName.charAt(0).toUpperCase(),
          dayNum,
          monthName,
          fullDate: currentDate.toISOString().split('T')[0]
        });
      }
      weeks.push(days);
    }
    
    return weeks;
  };

  const calendar = generateCalendar();

  const handleConfirmMesocycle = () => {
    if (!mesocycleName || !mesocycleGoal || !startDate) {
      alert("Por favor completa todos los campos");
      return;
    }
    setMesocycleConfirmed(true);
    setMesocycleExpanded(false);
    setRoutinesExpanded(true);
  };

  const handleConfirmRoutines = () => {
    setRoutinesConfirmed(true);
    setRoutinesExpanded(false);
    setPlanningExpanded(true);
  };

  const handleConfirmPlanning = () => {
    setPlanningConfirmed(true);
    setPlanningExpanded(false);
  };

  const toggleMesocycle = () => {
    setMesocycleExpanded(!mesocycleExpanded);
  };

  const toggleRoutines = () => {
    if (mesocycleConfirmed) {
      setRoutinesExpanded(!routinesExpanded);
    }
  };

  const togglePlanning = () => {
    if (routinesConfirmed) {
      setPlanningExpanded(!planningExpanded);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-25">
      {/* HEADER */}
      <section className="w-full px-4 pt-4 pb-4 border-b border-text-low/20">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate('/progression')}
            className="bg-surf h-10 w-10 rounded-lg border border-text-low flex items-center justify-center text-text-high hover:bg-surface transition-colors"
          >
            ←
          </button>

          <div className="flex-1 text-center mx-4">
            <p className="font-subheading text-[11px] text-text-low uppercase tracking-wider">
              Nueva progresión
            </p>
            <h1 className="font-heading font-extrabold text-[20px] text-text-high leading-tight">
              Crear Mesociclo
            </h1>
          </div>

          <button className="bg-surf h-10 w-10 rounded-lg border border-text-low flex items-center justify-center text-text-high hover:bg-surface transition-colors">
            ⋮
          </button>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="px-4 mt-4 flex flex-col gap-3">
        
        {/* 1. DATOS DEL MESOCICLO */}
        <div className={`bg-surf border rounded-2xl transition-all ${
          mesocycleConfirmed ? 'border-accent3' : 'border-text-low'
        }`}>
          <button
            onClick={toggleMesocycle}
            className="w-full flex items-center gap-3 p-4"
          >
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-heading font-bold text-[18px] shrink-0 transition-all ${
              mesocycleConfirmed
                ? 'bg-accent3 text-text-high'
                : 'bg-primary-bg1 border border-primary text-primary'
            }`}>
              1
            </div>

            <div className="flex-1 text-left">
              <p className="font-heading font-bold text-[16px] text-text-high">
                Datos del mesociclo
              </p>
              <p className="font-body text-[12px] text-text-low">
                Nombre, objetivo y duración
              </p>
            </div>

            <div className={`text-text-low text-[20px] transition-transform ${
              mesocycleExpanded ? 'rotate-180' : ''
            }`}>
              ⌄
            </div>
          </button>

          {mesocycleExpanded && (
            <div className="px-4 pb-4 space-y-4 border-t border-text-low pt-4">
              {/* Nombre */}
              <div>
                <label className="font-subheading font-semibold text-[13px] text-text-low uppercase tracking-wide block mb-2">
                  Nombre del mesociclo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Volumen Primavera 2025"
                  value={mesocycleName}
                  onChange={(e) => setMesocycleName(e.target.value)}
                  className="w-full bg-background border border-text-low rounded-2xl px-4 py-3 text-text-high text-[14px] font-body outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Objetivo */}
              <div>
                <label className="font-subheading font-semibold text-[13px] text-text-low uppercase tracking-wide block mb-2">
                  Objetivo
                </label>
                <select
                  value={mesocycleGoal}
                  onChange={(e) => setMesocycleGoal(e.target.value)}
                  className="w-full bg-background border border-text-low rounded-2xl px-4 py-3 text-text-high text-[14px] font-body outline-none focus:border-primary transition-colors"
                >
                  <option value="">Selecciona un objetivo</option>
                  <option value="fuerza">Fuerza</option>
                  <option value="hipertrofia">Hipertrofia</option>
                  <option value="resistencia">Resistencia</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="definicion">Definición</option>
                </select>
              </div>

              {/* Duración */}
              <div>
                <label className="font-subheading font-semibold text-[13px] text-text-low uppercase tracking-wide block mb-2">
                  Duración (semanas)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="4"
                    max="12"
                    value={mesocycleDuration}
                    onChange={(e) => setMesocycleDuration(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="bg-primary text-text-high font-heading font-bold text-[18px] w-16 h-12 rounded-2xl flex items-center justify-center">
                    {mesocycleDuration}
                  </div>
                </div>
                <p className="font-body text-[11px] text-text-low mt-1">
                  Rango recomendado: 4-12 semanas
                </p>
              </div>

              {/* Fecha de inicio */}
              <div>
                <label className="font-subheading font-semibold text-[13px] text-text-low uppercase tracking-wide block mb-2">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-background border border-text-low rounded-2xl px-4 py-3 text-text-high text-[14px] font-body outline-none focus:border-primary transition-colors"
                />
                <p className="font-body text-[11px] text-text-low mt-1">
                  El mesociclo comenzará en esta fecha
                </p>
              </div>

              {/* Botón confirmar */}
              <button
                onClick={handleConfirmMesocycle}
                className="w-full bg-primary-bg2 border border-primary text-primary py-3 rounded-2xl font-heading font-bold text-[14px] hover:opacity-80 transition-opacity"
              >
                ✓ Confirmar datos del mesociclo
              </button>
            </div>
          )}
        </div>

        {/* 2. RUTINAS */}
        <div className={`bg-surf border rounded-2xl transition-all ${
          routinesConfirmed ? 'border-accent3' : mesocycleConfirmed ? 'border-text-low' : 'border-text-low/30'
        } ${!mesocycleConfirmed ? 'opacity-50' : ''}`}>
          <button
            onClick={toggleRoutines}
            disabled={!mesocycleConfirmed}
            className="w-full flex items-center gap-3 p-4"
          >
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-heading font-bold text-[18px] shrink-0 transition-all ${
              routinesConfirmed
                ? 'bg-accent3 text-text-high'
                : mesocycleConfirmed
                  ? 'bg-primary-bg1 border border-primary text-primary'
                  : 'bg-surf border border-text-low text-text-low'
            }`}>
              2
            </div>

            <div className="flex-1 text-left">
              <p className="font-heading font-bold text-[16px] text-text-high">
                Rutinas
              </p>
              <p className="font-body text-[12px] text-text-low">
                0 rutinas seleccionadas
              </p>
            </div>

            <div className={`text-text-low text-[20px] transition-transform ${
              routinesExpanded ? 'rotate-180' : ''
            }`}>
              ⌄
            </div>
          </button>

          {routinesExpanded && (
            <div className="px-4 pb-4 space-y-4 border-t border-text-low pt-4">
              {/* Mensaje informativo */}
              <div className="bg-primary/10 border border-primary rounded-2xl p-3">
                <div className="flex items-start gap-2">
                  <span className="text-[16px]">💡</span>
                  <p className="font-body text-[12px] text-text-high leading-relaxed">
                    Se creará un <span className="font-bold">bloque de entrenamiento rotativo</span> que se repetirá durante las {mesocycleDuration} semanas del mesociclo.
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <button className="w-full bg-background border border-accent1 text-accent1 py-3 rounded-2xl font-heading font-bold text-[14px] hover:bg-accent1/5 transition-colors">
                📋 Elegir rutinas existentes
              </button>

              <button className="w-full bg-background border border-accent2 text-accent2 py-3 rounded-2xl font-heading font-bold text-[14px] hover:bg-accent2/5 transition-colors">
                ➕ Crear nueva rutina
              </button>

              {/* Botón confirmar */}
              <button
                onClick={handleConfirmRoutines}
                className="w-full bg-primary-bg2 border border-primary text-primary py-3 rounded-2xl font-heading font-bold text-[14px] hover:opacity-80 transition-opacity mt-4"
              >
                ✓ Confirmar rutinas
              </button>
            </div>
          )}
        </div>

        {/* 3. PLANIFICACIÓN SEMANAL */}
        <div className={`bg-surf border rounded-2xl transition-all ${
          planningConfirmed ? 'border-accent3' : routinesConfirmed ? 'border-text-low' : 'border-text-low/30'
        } ${!routinesConfirmed ? 'opacity-50' : ''}`}>
          <button
            onClick={togglePlanning}
            disabled={!routinesConfirmed}
            className="w-full flex items-center gap-3 p-4"
          >
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-heading font-bold text-[18px] shrink-0 transition-all ${
              planningConfirmed
                ? 'bg-accent3 text-text-high'
                : routinesConfirmed
                  ? 'bg-primary-bg1 border border-primary text-primary'
                  : 'bg-surf border border-text-low text-text-low'
            }`}>
              3
            </div>

            <div className="flex-1 text-left">
              <p className="font-heading font-bold text-[16px] text-text-high">
                Planificación del mesociclo
              </p>
              <p className="font-body text-[12px] text-text-low">
                Calendario de {mesocycleDuration} semanas
              </p>
            </div>

            <div className={`text-text-low text-[20px] transition-transform ${
              planningExpanded ? 'rotate-180' : ''
            }`}>
              ⌄
            </div>
          </button>

          {planningExpanded && (
            <div className="px-4 pb-4 space-y-4 border-t border-text-low pt-4">
              {/* Mensaje informativo */}
              <div className="bg-accent2/10 border border-accent2 rounded-2xl p-3">
                <div className="flex items-start gap-2">
                  <span className="text-[16px]">📅</span>
                  <div className="flex-1">
                    <p className="font-heading font-bold text-[13px] text-text-high mb-1">
                      Vista del Mesociclo
                    </p>
                    <p className="font-body text-[12px] text-text-low leading-relaxed">
                      Este es el calendario completo de tu progresión de {mesocycleDuration} semanas. Haz click en cada día para asignar una rutina o marcarlo como descanso.
                    </p>
                  </div>
                </div>
              </div>

              {/* CALENDARIO */}
              {startDate ? (
                <div className="space-y-4">
                  {calendar.map((week, weekIndex) => (
                    <div key={weekIndex} className="space-y-2">
                      <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide">
                        Semana {weekIndex + 1}
                      </p>
                      <div className="grid grid-cols-7 gap-1">
                        {week.map((day, dayIndex) => (
                          <button
                            key={dayIndex}
                            className="flex flex-col items-center gap-1 bg-background border border-text-low rounded-lg py-2 hover:border-primary hover:bg-primary/5 transition-colors"
                          >
                            <span className="font-subheading font-bold text-[10px] text-text-low">
                              {day.dayName}
                            </span>
                            <span className="font-heading font-bold text-[14px] text-text-high">
                              {day.dayNum}
                            </span>
                            {weekIndex === 0 && dayIndex === 0 && (
                              <span className="font-body text-[8px] text-accent1">
                                {day.monthName}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-surf border border-text-low rounded-2xl p-8 text-center">
                  <p className="font-body text-[13px] text-text-low">
                    Configura la fecha de inicio en el paso 1 para ver el calendario
                  </p>
                </div>
              )}

              {/* Botón confirmar */}
              <button
                onClick={handleConfirmPlanning}
                className="w-full bg-primary-bg2 border border-primary text-primary py-3 rounded-2xl font-heading font-bold text-[14px] hover:opacity-80 transition-opacity mt-4"
              >
                ✓ Confirmar planificación
              </button>
            </div>
          )}
        </div>

      </section>

      {/* BOTÓN CREAR PROGRESIÓN */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-background via-background to-transparent">
        <button
          disabled={!planningConfirmed}
          className={`w-full py-3 rounded-2xl font-heading font-bold text-[15px] transition-all ${
            planningConfirmed
              ? 'bg-accent3 text-text-high hover:opacity-80'
              : 'bg-surf text-text-low border border-text-low cursor-not-allowed'
          }`}
        >
          🚀 Crear progresión
        </button>
      </div>
    </div>
  );
};

export default CreateProgression;