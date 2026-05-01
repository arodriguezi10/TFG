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

  const handleConfirmMesocycle = () => {
    if (!mesocycleName || !mesocycleGoal) {
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
                Planificación semanal
              </p>
              <p className="font-body text-[12px] text-text-low">
                Asignar rutinas a días
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
                      Secuencia de Rotación
                    </p>
                    <p className="font-body text-[12px] text-text-low leading-relaxed">
                      Crea una secuencia de días (Día 1, Día 2, Día 3...) con las rutinas correspondientes. Esta secuencia se repetirá cíclicamente durante todo el mesociclo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de días (estático de momento) */}
              <div className="space-y-2">
                <div className="bg-background border border-text-low rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary font-heading font-bold text-[14px] flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <p className="font-heading font-bold text-[14px] text-text-high">
                        Día 1
                      </p>
                      <p className="font-body text-[11px] text-text-low">
                        Sin rutina asignada
                      </p>
                    </div>
                  </div>
                  <button className="text-text-low hover:text-red transition-colors">
                    🗑️
                  </button>
                </div>

                <div className="bg-background border border-text-low rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary font-heading font-bold text-[14px] flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <p className="font-heading font-bold text-[14px] text-text-high">
                        Día 2
                      </p>
                      <p className="font-body text-[11px] text-text-low">
                        Sin rutina asignada
                      </p>
                    </div>
                  </div>
                  <button className="text-text-low hover:text-red transition-colors">
                    🗑️
                  </button>
                </div>
              </div>

              {/* Botón añadir día */}
              <button className="w-full bg-background border-2 border-dashed border-text-low text-text-low py-3 rounded-2xl font-heading font-bold text-[14px] hover:border-primary hover:text-primary transition-colors">
                ➕ Añadir día al bloque
              </button>

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
          className={`w-full py-3 rounded-lg font-heading font-bold text-[15px] transition-all ${
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