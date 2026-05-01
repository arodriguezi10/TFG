import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ModalSelectRoutine from "../components/ModalSelectedRoutine";

// PALETA DE COLORES POSICIONALES
const POSITION_COLORS = [
  '#6c63ff', // accent1 - Posición 1
  '#ff6b9d', // accent2 - Posición 2
  '#36d9b8', // accent3 - Posición 3
  '#f5a623', // accent-warm - Posición 4
  '#9b59b6', // Púrpura - Posición 5
  '#e74c3c', // Rojo - Posición 6
  '#3498db', // Azul - Posición 7
  '#2ecc71', // Verde - Posición 8
];

// Función para obtener color según posición
const getColorByPosition = (index) => {
  return POSITION_COLORS[index % POSITION_COLORS.length];
};

const CreateProgression = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

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

  // Estados para rutinas
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [availableRoutines, setAvailableRoutines] = useState([]);
  const [selectedRoutines, setSelectedRoutines] = useState([]);
  const [loadingRoutines, setLoadingRoutines] = useState(false);

  // Estados para planificación
  const [calendarAssignments, setCalendarAssignments] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);

  // Sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Manejar reordenamiento
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSelectedRoutines((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Cargar rutinas del usuario
  useEffect(() => {
    if (user) {
      fetchUserRoutines();
    }
  }, [user]);

  const fetchUserRoutines = async () => {
    try {
      setLoadingRoutines(true);
      const { data, error } = await supabase
        .from('routines')
        .select(`
          id,
          name,
          description,
          target_muscle_groups,
          routine_exercises (
            id
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailableRoutines(data || []);
    } catch (error) {
      console.error('Error cargando rutinas:', error);
    } finally {
      setLoadingRoutines(false);
    }
  };

  const handleSelectRoutine = (routine) => {
    // Verificar que no esté ya añadida
    if (selectedRoutines.find(r => r.id === routine.id)) {
      alert('Esta rutina ya está añadida al bloque');
      return;
    }

    setSelectedRoutines([...selectedRoutines, routine]);
    setShowRoutineModal(false);
  };

  const handleRemoveRoutine = (routineId) => {
    setSelectedRoutines(selectedRoutines.filter(r => r.id !== routineId));
  };

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
    if (selectedRoutines.length === 0) {
      alert("Añade al menos una rutina al bloque");
      return;
    }
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

  // Componente para rutina arrastrable
  const SortableRoutineItem = ({ routine, index, onRemove }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: routine.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-background border border-text-low rounded-xl overflow-hidden flex touch-none"
      >
        {/* Franja de color lateral */}
        <div 
          className="w-1.5 shrink-0"
          style={{ backgroundColor: getColorByPosition(index) }}
        ></div>
        
        <div className="flex-1 p-3 flex items-center gap-3">
          {/* Handle de arrastre */}
          <div 
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-text-low hover:text-text-high"
          >
            ⋮⋮
          </div>

          <div 
            className="h-10 w-10 rounded-lg font-heading font-bold text-[14px] flex items-center justify-center shrink-0"
            style={{ 
              backgroundColor: `${getColorByPosition(index)}20`,
              color: getColorByPosition(index)
            }}
          >
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="font-heading font-bold text-[14px] text-text-high">
              {routine.name}
            </p>
            <p className="font-body text-[11px] text-text-low">
              {routine.routine_exercises?.length || 0} ejercicios
            </p>
          </div>
          <button
            onClick={() => onRemove(routine.id)}
            className="text-text-low hover:text-red transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  };

  // Modal para asignar rutina a un día
  const DayAssignmentModal = ({ day, isOpen, onClose, routines, currentAssignment, onAssign }) => {
    if (!isOpen || !day) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal Card */}
        <div className="relative bg-surf border border-text-low rounded-2xl w-[90%] max-w-md max-h-[70vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-text-low">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-heading font-bold text-[18px] text-text-high">
                  {day.dayName} {day.dayNum} de {day.monthName}
                </h3>
                <p className="font-body text-[12px] text-text-low">
                  Asigna una rutina o márcalo como descanso
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-background h-9 w-9 rounded-lg border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lista de opciones */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Opción: Día de descanso */}
            <button
              onClick={() => {
                onAssign(day.fullDate, { type: 'rest' });
                onClose();
              }}
              className={`w-full p-3 rounded-xl border transition-colors text-left ${
                currentAssignment?.type === 'rest'
                  ? 'bg-accent2/10 border-accent2'
                  : 'bg-background border-text-low hover:border-accent2 hover:bg-accent2/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[24px]">😴</span>
                <div className="flex-1">
                  <p className="font-heading font-bold text-[15px] text-text-high">
                    Día de descanso
                  </p>
                  <p className="font-body text-[11px] text-text-low">
                    Sin entrenamiento programado
                  </p>
                </div>
                {currentAssignment?.type === 'rest' && (
                  <span className="text-accent2">✓</span>
                )}
              </div>
            </button>

            {/* Separador */}
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-text-low"></div>
              <p className="font-body text-[11px] text-text-low uppercase">O selecciona rutina</p>
              <div className="flex-1 h-px bg-text-low"></div>
            </div>

            {/* Lista de rutinas del bloque */}
            {routines.map((routine, index) => (
              <button
                key={routine.id}
                onClick={() => {
                  onAssign(day.fullDate, { type: 'routine', routineId: routine.id, routineIndex: index });
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border transition-colors text-left overflow-hidden flex ${
                  currentAssignment?.routineId === routine.id
                    ? 'border-primary'
                    : 'bg-background border-text-low hover:border-primary hover:bg-primary/5'
                }`}
              >
                {/* Franja de color */}
                <div 
                  className="w-1 shrink-0 rounded-l-xl -ml-3"
                  style={{ backgroundColor: getColorByPosition(index) }}
                ></div>
                
                <div className="flex items-center gap-3 flex-1 ml-3">
                  <div 
                    className="h-10 w-10 rounded-lg font-heading font-bold text-[14px] flex items-center justify-center shrink-0"
                    style={{ 
                      backgroundColor: `${getColorByPosition(index)}20`,
                      color: getColorByPosition(index)
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-bold text-[14px] text-text-high">
                      {routine.name}
                    </p>
                    <p className="font-body text-[11px] text-text-low">
                      {routine.routine_exercises?.length || 0} ejercicios
                    </p>
                  </div>
                  {currentAssignment?.routineId === routine.id && (
                    <span className="text-primary">✓</span>
                  )}
                </div>
              </button>
            ))}

            {/* Opción: Sin asignar */}
            {currentAssignment && (
              <>
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-text-low"></div>
                </div>
                <button
                  onClick={() => {
                    onAssign(day.fullDate, null);
                    onClose();
                  }}
                  className="w-full p-3 rounded-xl border bg-background border-text-low hover:border-red hover:bg-red/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">🗑️</span>
                    <p className="font-heading font-bold text-[14px] text-text-low">
                      Quitar asignación
                    </p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleDayAssignment = (date, assignment) => {
    setCalendarAssignments(prev => {
      const updated = { ...prev };
      if (assignment === null) {
        delete updated[date];
      } else {
        updated[date] = assignment;
      }
      return updated;
    });
  };

  const handleCreateProgression = async () => {
  try {
    setLoading(true);

    // 1. Insertar la progresión principal
    const { data: progressionData, error: progressionError } = await supabase
      .from('progressions')
      .insert([
        {
          user_id: user.id,
          name: mesocycleName,
          goal: mesocycleGoal,
          duration_weeks: mesocycleDuration,
          start_date: startDate,
        }
      ])
      .select()
      .single();

    if (progressionError) {
      console.error('Error al crear progresión:', progressionError);
      alert('Error al guardar la progresión');
      return;
    }

    console.log('Progresión creada:', progressionData);

    // 2. Insertar el bloque de rutinas con sus posiciones y colores
    const routineBlocks = selectedRoutines.map((routine, index) => ({
      progression_id: progressionData.id,
      routine_id: routine.id,
      position: index,
      color_code: getColorByPosition(index),
    }));

    const { error: blocksError } = await supabase
      .from('progression_routine_blocks')
      .insert(routineBlocks);

    if (blocksError) {
      console.error('Error al insertar bloques de rutinas:', blocksError);
      alert('Error al guardar el bloque de rutinas');
      return;
    }

    console.log('Bloques de rutinas insertados');

    // 3. Insertar las asignaciones del calendario
    const calendarEntries = Object.entries(calendarAssignments).map(([date, assignment]) => ({
      progression_id: progressionData.id,
      date: date,
      routine_id: assignment.type === 'routine' ? assignment.routineId : null,
      is_rest_day: assignment.type === 'rest',
    }));

    if (calendarEntries.length > 0) {
      const { error: calendarError } = await supabase
        .from('progression_calendar')
        .insert(calendarEntries);

      if (calendarError) {
        console.error('Error al insertar calendario:', calendarError);
        alert('Error al guardar el calendario');
        return;
      }

      console.log('Calendario insertado');
    }

    // 4. Limpieza y redirección
    alert('🎉 ¡Progresión creada exitosamente!');
    navigate('/progression');

  } catch (err) {
    console.error('Error inesperado:', err);
    alert('Error inesperado al crear la progresión');
  } finally {
    setLoading(false);
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
                {selectedRoutines.length} rutinas seleccionadas
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

              {/* Lista de rutinas seleccionadas CON DRAG AND DROP */}
              {selectedRoutines.length > 0 && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={selectedRoutines.map(r => r.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {selectedRoutines.map((routine, index) => (
                        <SortableRoutineItem
                          key={routine.id}
                          routine={routine}
                          index={index}
                          onRemove={handleRemoveRoutine}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {/* Botones de acción */}
              <button
                onClick={() => setShowRoutineModal(true)}
                className="w-full bg-background border border-accent1 text-accent1 py-3 rounded-2xl font-heading font-bold text-[14px] hover:bg-accent1/5 transition-colors"
              >
                📋 Añadir rutina existente
              </button>

              <button
                  onClick={() => navigate('/createRoutines1', { 
                    state: { returnTo: '/createProgression' }
                  })}
                  className="w-full bg-background border border-accent2 text-accent2 py-3 rounded-2xl font-heading font-bold text-[14px] hover:bg-accent2/5 transition-colors"
                >
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
                            onClick={() => {
                              setSelectedDay(day);
                              setShowDayModal(true);
                            }}
                            className={`flex flex-col items-center gap-1 rounded-lg py-2 transition-colors relative overflow-hidden ${
                              calendarAssignments[day.fullDate]?.type === 'rest'
                                ? 'bg-accent2/10 border border-accent2'
                                : calendarAssignments[day.fullDate]?.type === 'routine'
                                  ? 'border-2'
                                  : 'bg-background border border-text-low hover:border-primary hover:bg-primary/5'
                            }`}
                            style={
                              calendarAssignments[day.fullDate]?.type === 'routine'
                                ? { borderColor: getColorByPosition(calendarAssignments[day.fullDate].routineIndex) }
                                : {}
                            }
                          >
                            {/* Franja superior de color si hay rutina asignada */}
                            {calendarAssignments[day.fullDate]?.type === 'routine' && (
                              <div 
                                className="absolute top-0 left-0 right-0 h-1"
                                style={{ backgroundColor: getColorByPosition(calendarAssignments[day.fullDate].routineIndex) }}
                              ></div>
                            )}

                            <span className="font-subheading font-bold text-[10px] text-text-low">
                              {day.dayName}
                            </span>
                            <span className="font-heading font-bold text-[14px] text-text-high">
                              {day.dayNum}
                            </span>
                            
                            {/* Indicador visual */}
                            {calendarAssignments[day.fullDate]?.type === 'rest' ? (
                              <span className="text-[12px]">😴</span>
                            ) : calendarAssignments[day.fullDate]?.type === 'routine' ? (
                              <span className="text-[12px]">💪</span>
                            ) : (
                              weekIndex === 0 && dayIndex === 0 && (
                                <span className="font-body text-[8px] text-accent1">
                                  {day.monthName}
                                </span>
                              )
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
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <button
          onClick={handleCreateProgression}
          disabled={!planningConfirmed || loading}
          className={`w-full py-3 rounded-lg font-heading font-bold text-[15px] transition-all ${
            planningConfirmed && !loading
              ? 'bg-accent3 text-text-high hover:opacity-80'
              : 'bg-surf text-text-low border border-text-low cursor-not-allowed'
          }`}
        >
          {loading ? '⏳ Guardando...' : '🚀 Crear progresión'}
        </button>
      </div>

      {/* MODAL DE SELECCIÓN */}
      <ModalSelectRoutine
        isOpen={showRoutineModal}
        onClose={() => setShowRoutineModal(false)}
        routines={availableRoutines}
        onSelectRoutine={handleSelectRoutine}
        loading={loadingRoutines}
      />

      {/* MODAL DE ASIGNACIÓN DE DÍA */}
      <DayAssignmentModal
        day={selectedDay}
        isOpen={showDayModal}
        onClose={() => setShowDayModal(false)}
        routines={selectedRoutines}
        currentAssignment={selectedDay ? calendarAssignments[selectedDay.fullDate] : null}
        onAssign={handleDayAssignment}
      />
    </div>
  );
};

export default CreateProgression;