import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ModalSelectRoutine from "../components/ModalSelectedRoutine";
import { ChevronLeft, CheckCircle2, GripVertical, Trash2, Plus, CalendarDays, Dumbbell, Target, Clock } from "lucide-react";

const POSITION_COLORS = ['#6c63ff','#ff6b9d','#36d9b8','#f5a623','#9b59b6','#e74c3c','#3498db','#2ecc71'];
const getColorByPosition = (index) => POSITION_COLORS[index % POSITION_COLORS.length];

const CreateProgressionDesktop = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [mesocycleConfirmed, setMesocycleConfirmed] = useState(false);
  const [routinesConfirmed, setRoutinesConfirmed] = useState(false);
  const [planningConfirmed, setPlanningConfirmed] = useState(false);
  const [mesocycleName, setMesocycleName] = useState("");
  const [mesocycleGoal, setMesocycleGoal] = useState("");
  const [mesocycleDuration, setMesocycleDuration] = useState(4);
  const [startDate, setStartDate] = useState("");
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [availableRoutines, setAvailableRoutines] = useState([]);
  const [selectedRoutines, setSelectedRoutines] = useState([]);
  const [loadingRoutines, setLoadingRoutines] = useState(false);
  const [calendarAssignments, setCalendarAssignments] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

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

  useEffect(() => { if (user) fetchUserRoutines(); }, [user]);

  const fetchUserRoutines = async () => {
    try {
      setLoadingRoutines(true);
      const { data, error } = await supabase.from('routines').select(`id, name, description, target_muscle_groups, routine_exercises (id)`).eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setAvailableRoutines(data || []);
    } catch (error) { console.error('Error cargando rutinas:', error); }
    finally { setLoadingRoutines(false); }
  };

  const handleSelectRoutine = (routine) => {
    if (selectedRoutines.find(r => r.id === routine.id)) { alert('Esta rutina ya está añadida al bloque'); return; }
    setSelectedRoutines([...selectedRoutines, routine]);
    setShowRoutineModal(false);
  };

  const handleRemoveRoutine = (routineId) => setSelectedRoutines(selectedRoutines.filter(r => r.id !== routineId));

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
        days.push({ date: currentDate, dayName: dayName.charAt(0).toUpperCase(), dayNum: currentDate.getDate(), monthName: currentDate.toLocaleDateString('es-ES', { month: 'short' }), fullDate: currentDate.toISOString().split('T')[0] });
      }
      weeks.push(days);
    }
    return weeks;
  };

  const calendar = generateCalendar();

  const handleDayAssignment = (date, assignment) => {
    setCalendarAssignments(prev => {
      const updated = { ...prev };
      if (assignment === null) delete updated[date];
      else updated[date] = assignment;
      return updated;
    });
  };

  const handleCreateProgression = async () => {
    try {
      setLoading(true);
      const { data: progressionData, error: progressionError } = await supabase.from('progressions').insert([{ user_id: user.id, name: mesocycleName, goal: mesocycleGoal, duration_weeks: mesocycleDuration, start_date: startDate }]).select().single();
      if (progressionError) { alert('Error al guardar la progresión'); return; }
      const routineBlocks = selectedRoutines.map((routine, index) => ({ progression_id: progressionData.id, routine_id: routine.id, position: index, color_code: getColorByPosition(index) }));
      const { error: blocksError } = await supabase.from('progression_routine_blocks').insert(routineBlocks);
      if (blocksError) { alert('Error al guardar el bloque de rutinas'); return; }
      const calendarEntries = Object.entries(calendarAssignments).map(([date, assignment]) => ({ progression_id: progressionData.id, date, routine_id: assignment.type === 'routine' ? assignment.routineId : null, is_rest_day: assignment.type === 'rest' }));
      if (calendarEntries.length > 0) {
        const { error: calendarError } = await supabase.from('progression_calendar').insert(calendarEntries);
        if (calendarError) { alert('Error al guardar el calendario'); return; }
      }
      alert('🎉 ¡Progresión creada exitosamente!');
      navigate('/progression');
    } catch (err) { console.error('Error inesperado:', err); alert('Error inesperado al crear la progresión'); }
    finally { setLoading(false); }
  };

  const SortableRoutineItem = ({ routine, index, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: routine.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
    return (
      <div ref={setNodeRef} style={style} className="bg-background border border-text-low rounded-xl overflow-hidden flex touch-none">
        <div className="w-1.5 shrink-0" style={{ backgroundColor: getColorByPosition(index) }}></div>
        <div className="flex-1 p-3 flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-text-low hover:text-text-high"><GripVertical size={18} /></div>
          <div className="h-10 w-10 rounded-lg font-heading font-bold text-[14px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${getColorByPosition(index)}20`, color: getColorByPosition(index) }}>{index + 1}</div>
          <div className="flex-1">
            <p className="font-heading font-bold text-[14px] text-text-high">{routine.name}</p>
            <p className="font-body text-[11px] text-text-low">{routine.routine_exercises?.length || 0} ejercicios</p>
          </div>
          <button onClick={() => onRemove(routine.id)} className="text-text-low hover:text-red transition-colors"><Trash2 size={16} /></button>
        </div>
      </div>
    );
  };

  const steps = [
    { num: 1, label: "Datos", icon: <Target size={16} />, confirmed: mesocycleConfirmed },
    { num: 2, label: "Rutinas", icon: <Dumbbell size={16} />, confirmed: routinesConfirmed },
    { num: 3, label: "Calendario", icon: <CalendarDays size={16} />, confirmed: planningConfirmed },
  ];

  const canGoStep = (step) => {
    if (step === 1) return true;
    if (step === 2) return mesocycleConfirmed;
    if (step === 3) return routinesConfirmed;
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center gap-4">
        <button onClick={() => navigate('/progression')} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Nueva progresión</p>
          <h1 className="font-heading font-extrabold text-[28px] text-text-high">Crear Mesociclo</h1>
        </div>

        {/* STEPS INDICATOR */}
        <div className="ml-auto flex items-center gap-2">
          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              <button onClick={() => canGoStep(step.num) && setActiveStep(step.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-subheading font-bold text-[13px] transition-all border ${activeStep === step.num ? 'bg-primary border-primary text-text-high' : step.confirmed ? 'bg-accent3/10 border-accent3 text-accent3' : 'bg-surf border-text-low text-text-low'} ${!canGoStep(step.num) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                {step.confirmed ? <CheckCircle2 size={14} /> : step.icon}
                {step.label}
              </button>
              {i < steps.length - 1 && <div className={`w-6 h-px ${step.confirmed ? 'bg-accent3' : 'bg-text-low/30'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 px-8 py-6 grid grid-cols-3 gap-8">

        {/* PASO 1 — DATOS */}
        {activeStep === 1 && (
          <>
            <div className="col-span-2 flex flex-col gap-5">
              <div className="bg-surf border border-text-low rounded-2xl p-6 flex flex-col gap-5">
                <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Datos del mesociclo</p>
                <div>
                  <label className="font-subheading font-semibold text-[13px] text-text-low uppercase tracking-wide block mb-2">Nombre del mesociclo</label>
                  <input type="text" placeholder="Ej: Volumen Primavera 2025" value={mesocycleName} onChange={(e) => setMesocycleName(e.target.value)} className="w-full bg-background border border-text-low rounded-2xl px-4 py-3 text-text-high text-[14px] font-body outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="font-subheading font-semibold text-[13px] text-text-low uppercase tracking-wide block mb-2">Objetivo</label>
                  <select value={mesocycleGoal} onChange={(e) => setMesocycleGoal(e.target.value)} className="w-full bg-background border border-text-low rounded-2xl px-4 py-3 text-text-high text-[14px] font-body outline-none focus:border-primary transition-colors">
                    <option value="">Selecciona un objetivo</option>
                    <option value="fuerza">Fuerza</option>
                    <option value="hipertrofia">Hipertrofia</option>
                    <option value="resistencia">Resistencia</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="definicion">Definición</option>
                  </select>
                </div>
                <div>
                  <label className="font-subheading font-semibold text-[13px] text-text-low uppercase tracking-wide block mb-2">Duración: <span className="text-primary">{mesocycleDuration} semanas</span></label>
                  <div className="flex items-center gap-4">
                    <input type="range" min="4" max="12" value={mesocycleDuration} onChange={(e) => setMesocycleDuration(parseInt(e.target.value))} className="flex-1" />
                    <div className="bg-primary text-text-high font-heading font-bold text-[20px] w-16 h-12 rounded-2xl flex items-center justify-center shrink-0">{mesocycleDuration}</div>
                  </div>
                  <p className="font-body text-[11px] text-text-low mt-1">Rango recomendado: 4-12 semanas</p>
                </div>
                <div>
                  <label className="font-subheading font-semibold text-[13px] text-text-low uppercase tracking-wide block mb-2">Fecha de inicio</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full bg-background border border-text-low rounded-2xl px-4 py-3 text-text-high text-[14px] font-body outline-none focus:border-primary transition-colors" />
                </div>
                <button onClick={() => {
                  if (!mesocycleName || !mesocycleGoal || !startDate) { alert("Por favor completa todos los campos"); return; }
                  setMesocycleConfirmed(true); setActiveStep(2);
                }} className="w-full bg-primary text-text-high py-3 rounded-2xl font-heading font-bold text-[15px] hover:opacity-90 transition-opacity">
                  Confirmar y continuar →
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-surf border border-text-low rounded-2xl p-5">
                <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">Resumen</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary flex items-center justify-center shrink-0"><Target size={16} className="text-primary" /></div>
                    <div><p className="font-body text-[11px] text-text-low">Objetivo</p><p className="font-heading font-bold text-[14px] text-text-high capitalize">{mesocycleGoal || "--"}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-accent1/10 border border-accent1 flex items-center justify-center shrink-0"><Clock size={16} className="text-accent1" /></div>
                    <div><p className="font-body text-[11px] text-text-low">Duración</p><p className="font-heading font-bold text-[14px] text-text-high">{mesocycleDuration} semanas</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-accent2/10 border border-accent2 flex items-center justify-center shrink-0"><CalendarDays size={16} className="text-accent2" /></div>
                    <div><p className="font-body text-[11px] text-text-low">Inicio</p><p className="font-heading font-bold text-[14px] text-text-high">{startDate || "--"}</p></div>
                  </div>
                </div>
              </div>
              <div className="bg-primary/10 border border-primary rounded-2xl p-4">
                <p className="font-heading font-bold text-[14px] text-text-high mb-2">💡 Consejo</p>
                <p className="font-body text-[12px] text-text-low leading-relaxed">Un mesociclo de 4-6 semanas es ideal para principiantes, mientras que 8-12 semanas permite mayor adaptación para avanzados.</p>
              </div>
            </div>
          </>
        )}

        {/* PASO 2 — RUTINAS */}
        {activeStep === 2 && (
          <>
            <div className="col-span-2 flex flex-col gap-5">
              <div className="bg-surf border border-text-low rounded-2xl p-6 flex flex-col gap-5">
                <div>
                  <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-1">Rutinas del bloque</p>
                  <p className="font-body text-[13px] text-text-low">Selecciona y ordena las rutinas que se rotarán durante las {mesocycleDuration} semanas</p>
                </div>
                <div className="bg-primary/10 border border-primary rounded-2xl p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-[16px]">💡</span>
                    <p className="font-body text-[12px] text-text-high leading-relaxed">Se creará un <span className="font-bold">bloque de entrenamiento rotativo</span> que se repetirá durante las {mesocycleDuration} semanas del mesociclo.</p>
                  </div>
                </div>

                {selectedRoutines.length > 0 && (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={selectedRoutines.map(r => r.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {selectedRoutines.map((routine, index) => (
                          <SortableRoutineItem key={routine.id} routine={routine} index={index} onRemove={handleRemoveRoutine} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setShowRoutineModal(true)} className="flex-1 bg-background border border-accent1 text-accent1 py-3 rounded-2xl font-heading font-bold text-[14px] hover:bg-accent1/5 transition-colors flex items-center justify-center gap-2">
                    <Dumbbell size={16} /> Añadir rutina
                  </button>
                  <button onClick={() => navigate('/createRoutines1', { state: { returnTo: '/createProgression' } })} className="flex-1 bg-background border border-accent2 text-accent2 py-3 rounded-2xl font-heading font-bold text-[14px] hover:bg-accent2/5 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> Crear nueva
                  </button>
                </div>

                <button onClick={() => {
                  if (selectedRoutines.length === 0) { alert("Añade al menos una rutina al bloque"); return; }
                  setRoutinesConfirmed(true); setActiveStep(3);
                }} className="w-full bg-primary text-text-high py-3 rounded-2xl font-heading font-bold text-[15px] hover:opacity-90 transition-opacity">
                  Confirmar y continuar →
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-surf border border-text-low rounded-2xl p-5">
                <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">Rutinas seleccionadas ({selectedRoutines.length})</p>
                {selectedRoutines.length === 0 ? (
                  <div className="flex flex-col items-center py-6 gap-2">
                    <Dumbbell size={32} className="text-text-low" />
                    <p className="font-body text-[12px] text-text-low text-center">Aún no has añadido rutinas</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedRoutines.map((r, i) => (
                      <div key={r.id} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getColorByPosition(i) }}></div>
                        <p className="font-body text-[13px] text-text-high truncate">{r.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* PASO 3 — CALENDARIO */}
        {activeStep === 3 && (
          <>
            <div className="col-span-2 flex flex-col gap-5">
              <div className="bg-surf border border-text-low rounded-2xl p-6 flex flex-col gap-4">
                <div>
                  <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-1">Planificación del mesociclo</p>
                  <p className="font-body text-[13px] text-text-low">Haz clic en cada día para asignar una rutina o marcarlo como descanso</p>
                </div>
                {startDate ? (
                  <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                    {calendar.map((week, weekIndex) => (
                      <div key={weekIndex} className="space-y-2">
                        <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide">Semana {weekIndex + 1}</p>
                        <div className="grid grid-cols-7 gap-1.5">
                          {week.map((day, dayIndex) => (
                            <button key={dayIndex} onClick={() => setSelectedDay(selectedDay?.fullDate === day.fullDate ? null : day)}
                              className={`flex flex-col items-center gap-1 rounded-xl py-2.5 transition-all relative overflow-hidden border-2 ${selectedDay?.fullDate === day.fullDate ? 'border-primary bg-primary/10' : calendarAssignments[day.fullDate]?.type === 'rest' ? 'border-accent2 bg-accent2/10' : calendarAssignments[day.fullDate]?.type === 'routine' ? '' : 'border-transparent bg-background hover:border-primary/40'}`}
                              style={calendarAssignments[day.fullDate]?.type === 'routine' ? { borderColor: getColorByPosition(calendarAssignments[day.fullDate].routineIndex) } : {}}>
                              {calendarAssignments[day.fullDate]?.type === 'routine' && <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: getColorByPosition(calendarAssignments[day.fullDate].routineIndex) }}></div>}
                              <span className="font-subheading font-bold text-[10px] text-text-low">{day.dayName}</span>
                              <span className="font-heading font-bold text-[15px] text-text-high">{day.dayNum}</span>
                              {calendarAssignments[day.fullDate]?.type === 'rest' ? <span className="text-[12px]">😴</span> : calendarAssignments[day.fullDate]?.type === 'routine' ? <span className="text-[12px]">💪</span> : <span className="text-[12px] opacity-0">·</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-surf border border-text-low rounded-2xl p-8 text-center"><p className="font-body text-[13px] text-text-low">Configura la fecha de inicio en el paso 1</p></div>
                )}

                <button onClick={() => {
                  setPlanningConfirmed(true);
                }} className="w-full bg-accent3 text-text-high py-3 rounded-2xl font-heading font-bold text-[15px] hover:opacity-90 transition-opacity">
                  ✓ Confirmar planificación
                </button>
              </div>
            </div>

            {/* SIDEBAR — ASIGNAR DÍA */}
            <div className="flex flex-col gap-4">
              {selectedDay ? (
                <div className="bg-surf border border-primary rounded-2xl p-5 flex flex-col gap-3">
                  <div>
                    <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-1">Asignar día</p>
                    <p className="font-heading font-bold text-[18px] text-text-high">{selectedDay.dayName} {selectedDay.dayNum} de {selectedDay.monthName}</p>
                  </div>

                  <button onClick={() => { handleDayAssignment(selectedDay.fullDate, { type: 'rest' }); }}
                    className={`w-full p-3 rounded-xl border transition-all text-left ${calendarAssignments[selectedDay.fullDate]?.type === 'rest' ? 'bg-accent2/10 border-accent2' : 'bg-background border-text-low hover:border-accent2'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-[20px]">😴</span>
                      <div className="flex-1"><p className="font-heading font-bold text-[14px] text-text-high">Día de descanso</p></div>
                      {calendarAssignments[selectedDay.fullDate]?.type === 'rest' && <CheckCircle2 size={16} className="text-accent2" />}
                    </div>
                  </button>

                  <div className="flex items-center gap-2"><div className="flex-1 h-px bg-text-low/30"></div><p className="font-body text-[11px] text-text-low">rutinas</p><div className="flex-1 h-px bg-text-low/30"></div></div>

                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {selectedRoutines.map((routine, index) => (
                      <button key={routine.id} onClick={() => handleDayAssignment(selectedDay.fullDate, { type: 'routine', routineId: routine.id, routineIndex: index })}
                        className={`w-full p-3 rounded-xl border transition-all text-left overflow-hidden flex ${calendarAssignments[selectedDay.fullDate]?.routineId === routine.id ? 'border-primary bg-primary/5' : 'bg-background border-text-low hover:border-primary'}`}>
                        <div className="w-1 shrink-0 rounded-l-xl -ml-3 mr-3" style={{ backgroundColor: getColorByPosition(index) }}></div>
                        <div className="flex items-center gap-2 flex-1">
                          <div className="h-8 w-8 rounded-lg font-heading font-bold text-[13px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${getColorByPosition(index)}20`, color: getColorByPosition(index) }}>{index + 1}</div>
                          <div className="flex-1 min-w-0"><p className="font-heading font-bold text-[13px] text-text-high truncate">{routine.name}</p></div>
                          {calendarAssignments[selectedDay.fullDate]?.routineId === routine.id && <CheckCircle2 size={14} className="text-primary shrink-0" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {calendarAssignments[selectedDay.fullDate] && (
                    <button onClick={() => handleDayAssignment(selectedDay.fullDate, null)} className="w-full p-2.5 rounded-xl border bg-background border-text-low hover:border-red text-text-low hover:text-red transition-all text-[13px] font-body flex items-center justify-center gap-2">
                      <Trash2 size={14} /> Quitar asignación
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-surf border border-text-low rounded-2xl p-5 flex flex-col items-center gap-3 py-10">
                  <CalendarDays size={32} className="text-text-low" />
                  <p className="font-body text-[13px] text-text-low text-center">Haz clic en un día del calendario para asignarle una rutina</p>
                </div>
              )}

              {/* LEYENDA */}
              <div className="bg-surf border border-text-low rounded-2xl p-4">
                <p className="font-subheading font-bold text-[11px] text-text-low uppercase tracking-wide mb-3">Leyenda de rutinas</p>
                <div className="flex flex-col gap-2">
                  {selectedRoutines.map((r, i) => (
                    <div key={r.id} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getColorByPosition(i) }}></div>
                      <p className="font-body text-[12px] text-text-high truncate">{r.name}</p>
                    </div>
                  ))}
                  <div className="flex items-center gap-2"><span className="text-[12px]">😴</span><p className="font-body text-[12px] text-text-low">Descanso</p></div>
                </div>
              </div>

              {/* CTA CREAR */}
              {planningConfirmed && (
                <button onClick={handleCreateProgression} disabled={loading}
                  className={`w-full py-4 rounded-2xl font-heading font-bold text-[15px] transition-all ${loading ? 'bg-surf text-text-low border border-text-low cursor-not-allowed' : 'bg-accent3 text-text-high hover:opacity-90'}`}>
                  {loading ? '⏳ Guardando...' : '🚀 Crear progresión'}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <ModalSelectRoutine isOpen={showRoutineModal} onClose={() => setShowRoutineModal(false)} routines={availableRoutines} onSelectRoutine={handleSelectRoutine} loading={loadingRoutines} />
    </div>
  );
};

export default CreateProgressionDesktop;