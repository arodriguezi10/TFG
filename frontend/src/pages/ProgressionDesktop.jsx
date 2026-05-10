import React, { useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";
import { Settings, Plus, ChevronLeft, ChevronRight, CircleCheck, Moon, Dumbbell, Lock, Crown, TrendingUp, Target, Clock, ClipboardList, Zap, Lightbulb } from "lucide-react";
import { useTargetUser } from "../hooks/useTargetUser";

const ProgressionDesktop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //const { user } = useContext(AuthContext);
  const { targetUserId } = useTargetUser();

  const [activeProgression, setActiveProgression] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [weekDays, setWeekDays] = useState([]);
  const [calendarAssignments, setCalendarAssignments] = useState({});
  const [progressionBlocks, setProgressionBlocks] = useState([]);
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);
  const [completedDays, setCompletedDays] = useState(new Set());

  useEffect(() => {
    if (targetUserId) { loadUserSubscription(); fetchProgressions(); }
  }, [targetUserId]);

  useEffect(() => {
    if (location.state?.justCompleted) { fetchProgressions(); window.history.replaceState({}, document.title); }
  }, [location]);

  const loadUserSubscription = async () => {
    try {
      const { data, error } = await supabase.from("users").select("subscription_tier").eq("id", targetUserId).single();
      setSubscriptionTier(error ? "free" : data?.subscription_tier || "free");
    } catch { setSubscriptionTier("free"); }
  };

  const fetchProgressions = async () => {
    try {
      setLoading(true);
      const { data: progressionData, error: progressionError } = await supabase.from("progressions").select("*").eq("user_id", targetUserId).order("created_at", { ascending: false }).limit(1).single();
      if (progressionError) { setActiveProgression(null); return; }
      if (progressionData) {
        setActiveProgression(progressionData);
        const { data: blocks, error: blocksError } = await supabase.from("progression_routine_blocks").select(`*, routines (id, name, estimated_duration_min, routine_exercises (id))`).eq("progression_id", progressionData.id).order("position", { ascending: true });
        if (!blocksError && blocks) setProgressionBlocks(blocks);
        const { data: calendar, error: calendarError } = await supabase.from("progression_calendar").select("*").eq("progression_id", progressionData.id);
        let assignments = {};
        if (!calendarError && calendar) {
          calendar.forEach((entry) => { assignments[entry.date] = { type: entry.is_rest_day ? "rest" : "routine", routineId: entry.routine_id }; });
          setCalendarAssignments(assignments);
        }
        const startDate = new Date(progressionData.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + progressionData.duration_weeks * 7);
        const { data: sessions, error: sessionsError } = await supabase.from("workout_sessions").select("session_date, routine_id").eq("user_id", targetUserId).gte("session_date", startDate.toISOString().split("T")[0]).lte("session_date", endDate.toISOString().split("T")[0]);
        if (!sessionsError && sessions) {
          const completed = new Set();
          sessions.forEach((session) => {
            const assignment = assignments[session.session_date];
            if (assignment && assignment.routineId === session.routine_id) completed.add(session.session_date);
          });
          setCompletedDays(completed);
        }
        calculateCurrentWeek(progressionData);
        generateWeekCalendar(progressionData, 0);
      } else { setActiveProgression(null); }
    } catch { setActiveProgression(null); }
    finally { setLoading(false); }
  };

  const calculateCurrentWeek = (progression) => {
    const startDate = new Date(progression.start_date);
    const diffDays = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));
    setCurrentWeekIndex(Math.max(0, Math.min(Math.floor(diffDays / 7), progression.duration_weeks - 1)));
  };

  const generateWeekCalendar = (progression, weekOffset) => {
    const startDate = new Date(progression.start_date);
    startDate.setDate(startDate.getDate() + weekOffset * 7);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dayName = currentDate.toLocaleDateString("es-ES", { weekday: "short" });
      const fullDate = currentDate.toISOString().split("T")[0];
      days.push({ dayName: dayName.charAt(0).toUpperCase(), dayNum: currentDate.getDate(), fullDate, isToday: fullDate === new Date().toISOString().split("T")[0] });
    }
    setWeekDays(days);
  };

  const handlePreviousWeek = () => {
    if (currentWeekIndex > 0) { const newIndex = currentWeekIndex - 1; setCurrentWeekIndex(newIndex); generateWeekCalendar(activeProgression, newIndex); setSelectedDayDetail(null); }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < activeProgression.duration_weeks - 1) { const newIndex = currentWeekIndex + 1; setCurrentWeekIndex(newIndex); generateWeekCalendar(activeProgression, newIndex); setSelectedDayDetail(null); }
  };

  const getRoutineColor = (routineId) => {
    const block = progressionBlocks.find((b) => b.routine_id === routineId);
    return block?.color_code || "#6c63ff";
  };

  const getProgressPercentage = () => {
    if (!activeProgression) return 0;
    return (completedDays.size / (activeProgression.duration_weeks * 7)) * 100;
  };

  const handleDayClick = (day) => {
    const assignment = calendarAssignments[day.fullDate];
    if (!assignment || assignment.type === "rest") { setSelectedDayDetail(null); return; }
    if (selectedDayDetail?.fullDate === day.fullDate) { setSelectedDayDetail(null); return; }
    const routineBlock = progressionBlocks.find((b) => b.routine_id === assignment.routineId);
    if (routineBlock) setSelectedDayDetail({ ...day, routine: routineBlock.routines, color: routineBlock.color_code });
  };

  const handleStartRoutine = (routineId, dayFullDate) => {
    const todayDate = new Date().toISOString().split("T")[0];
    if (dayFullDate !== todayDate) { alert("Solo puedes iniciar la rutina el día que te toca"); return; }
    navigate(`/executeRoutine/${routineId}`, { state: { fromProgression: true, progressionId: activeProgression.id, completedDate: dayFullDate } });
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="font-body text-text-low">Cargando progresiones...</p></div>;

  // HEADER compartido desktop
  const DesktopHeader = () => (
    <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center justify-between">
      <div>
        <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Biblioteca</p>
        <h1 className="font-heading font-extrabold text-[32px] text-text-high">Progresión</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-2 border-b border-text-low">
          <button onClick={() => navigate("/routines1")} className="pb-2 px-1 font-subheading font-semibold text-[15px] text-text-low hover:text-text-high transition-all">Rutinas</button>
          <button className="pb-2 px-1 font-subheading font-semibold text-[15px] text-accent1 relative">Progresión<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent1"></div></button>
        </div>
        {subscriptionTier === "elite" && (
          <div className="flex gap-2 ml-4">
            <button className="bg-surf h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-low hover:bg-surface transition-colors"><Settings size={18} /></button>
            <button onClick={() => navigate("/createProgression")} className="bg-accent1 h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-high cursor-pointer hover:opacity-80 transition-opacity"><Plus size={18} /></button>
          </div>
        )}
      </div>
    </div>
  );

  // UPGRADE SCREEN
  if (subscriptionTier !== "elite") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <DesktopHeader />
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="max-w-2xl w-full flex flex-col items-center gap-6">
            <div className="relative">
              <span className="bg-linear-to-br from-yellow/20 to-orange/20 h-32 w-32 rounded-[40px] flex items-center justify-center border border-yellow/30"><Crown size={48} className="text-yellow" /></span>
              <div className="absolute -top-2 -right-2 bg-yellow h-8 w-8 rounded-full flex items-center justify-center animate-pulse"><Lightbulb size={16} className="text-background" /></div>
            </div>
            <p className="bg-yellow-bg2 px-3.5 py-1 rounded-2xl border border-yellow font-subheading font-bold text-[14px] text-yellow">◆ FUNCIÓN ÉLITE</p>
            <div className="text-center">
              <p className="font-heading font-extrabold text-[36px] text-text-high leading-tight">Desbloquea la<br /><span className="text-yellow">progresión automática</span></p>
              <p className="font-body text-[15px] text-text-low mt-3 max-w-md mx-auto">Planifica la evolución de tus cargas semana a semana con progresiones inteligentes diseñadas por tu entrenador.</p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="flex flex-col items-start gap-3 bg-surf border border-text-low/20 rounded-2xl p-4">
                <div className="h-10 w-10 rounded-xl bg-accent1/10 border border-accent1 flex items-center justify-center shrink-0"><TrendingUp size={20} className="text-blue" /></div>
                <p className="font-heading font-bold text-[14px] text-text-high">Progresión inteligente</p>
                <p className="font-body text-[12px] text-text-low">Incrementa peso y volumen de forma óptima cada semana</p>
              </div>
              <div className="flex flex-col items-start gap-3 bg-surf border border-text-low/20 rounded-2xl p-4">
                <div className="h-10 w-10 rounded-xl bg-accent2/10 border border-accent2 flex items-center justify-center shrink-0"><Target size={20} className="text-accent1" /></div>
                <p className="font-heading font-bold text-[14px] text-text-high">Ciclos personalizados</p>
                <p className="font-body text-[12px] text-text-low">Crea mesociclos de 4-12 semanas adaptados a tus objetivos</p>
              </div>
              <div className="flex flex-col items-start gap-3 bg-surf border border-text-low/20 rounded-2xl p-4">
                <div className="h-10 w-10 rounded-xl bg-primary-bg border border-primary flex items-center justify-center shrink-0"><Zap size={20} className="text-primary" /></div>
                <p className="font-heading font-bold text-[14px] text-text-high">Automatización completa</p>
                <p className="font-body text-[12px] text-text-low">Olvídate de calcular, el sistema ajusta todo por ti</p>
              </div>
            </div>
            <div className="flex gap-3 w-full max-w-sm">
              <Button variant="outlined" text="👑 Mejorar a Élite" bgColor={"bg-yellow"} textColor={"text-background"} borderColor={"border-yellow"} w="w-[100%]" onClick={() => navigate("/subscription")} />
            </div>
            <button onClick={() => navigate("/routines1")} className="font-body text-[14px] text-text-low">Volver a rutinas</button>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY STATE
  if (!activeProgression) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <DesktopHeader />
        <div className="flex-1 flex gap-8 px-8 py-8">
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <span className="bg-surf h-27.5 w-27.5 px-2.5 rounded-[35px] font-body text-[45px] text-accent1 flex items-center justify-center border border-accent1/20">📈</span>
              <div className="absolute -bottom-1 -right-1 bg-yellow h-9 w-9 rounded-full flex items-center justify-center text-[18px] border-2 border-background">✨</div>
            </div>
            <p className="bg-surf px-3.5 py-0.5 rounded-2xl border border-text-low font-subheading font-semibold text-[16px] text-text-low">Sin progresiones todavía</p>
            <p className="font-heading font-extrabold text-[32px] text-text-high leading-tight text-center">Crea tu primera<br /><span className="text-accent1">progresión automática</span></p>
            <p className="font-body text-[16px] text-text-low text-center max-w-sm">Diseña un plan de 4-12 semanas con incrementos automáticos de carga y volumen para maximizar tu progreso.</p>
            <Button variant="outlined" text="Crear progresión" bgColor={"bg-accent1"} textColor={"text-text-high"} borderColor={"border-accent1"} w="w-64" onClick={() => navigate("/createProgression")} />
          </div>
          <div className="w-80 shrink-0">
            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-[20px] shrink-0">💡</div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-[16px] text-text-high mb-1">¿Cómo funciona?</p>
                  <p className="font-body text-[13px] text-text-low leading-relaxed">Una progresión es un plan estructurado que incrementa automáticamente tus cargas semana a semana.</p>
                </div>
              </div>
              <div className="pt-3 border-t border-text-low">
                <div className="flex items-center gap-2 mb-2"><span className="text-[14px]">📋</span><p className="font-body text-[13px] text-text-low"><span className="text-text-high font-semibold">Paso 1:</span> Elige rutinas existentes o crea nuevas</p></div>
                <div className="flex items-center gap-2 mb-2"><span className="text-[14px]">⏰</span><p className="font-body text-[13px] text-text-low"><span className="text-text-high font-semibold">Paso 2:</span> Define duración del mesociclo (4-12 semanas)</p></div>
                <div className="flex items-center gap-2"><span className="text-[14px]">🎯</span><p className="font-body text-[13px] text-text-low"><span className="text-text-high font-semibold">Paso 3:</span> Configura incrementos de peso y volumen</p></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // PROGRESIÓN ACTIVA DESKTOP
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DesktopHeader />
      <div className="flex-1 px-8 py-6 grid grid-cols-3 gap-6">

        {/* COLUMNA IZQUIERDA — INFO Y STATS */}
        <div className="flex flex-col gap-5">
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">Mesociclo activo</p>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="font-heading font-extrabold text-[22px] text-text-high leading-tight">{activeProgression.name}</h2>
                <p className="font-body text-[13px] text-text-low mt-1">Objetivo: {activeProgression.goal} · {activeProgression.duration_weeks} semanas</p>
              </div>
              <div className="bg-accent1 rounded-2xl px-4 py-3 flex flex-col items-center shrink-0 ml-3">
                <p className="font-subheading font-bold text-[10px] text-text-high/80 uppercase">Sem.</p>
                <p className="font-heading font-extrabold text-[28px] text-text-high leading-none">{currentWeekIndex + 1}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-subheading font-bold text-[12px] text-text-low">PROGRESO</p>
              <p className="font-heading font-bold text-[14px] text-accent1">{Math.round(getProgressPercentage())}%</p>
            </div>
            <div className="w-full h-3 bg-surf rounded-full overflow-hidden">
              <div className="h-full bg-accent1 rounded-full transition-all duration-500" style={{ width: `${getProgressPercentage()}%` }}></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="font-body text-[11px] text-text-low">{completedDays.size} días completados</p>
              <p className="font-body text-[11px] text-text-low">{activeProgression.duration_weeks * 7} totales</p>
            </div>
          </Card>

          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">Resumen</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-accent1/10 h-11 w-11 rounded-xl border border-accent1 flex items-center justify-center shrink-0"><Clock size={18} className="text-accent1" /></div>
                <div><p className="font-heading font-bold text-[20px] text-text-high">{activeProgression.duration_weeks}</p><p className="font-body text-[11px] text-text-low">Semanas totales</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-accent2/10 h-11 w-11 rounded-xl border border-accent2 flex items-center justify-center shrink-0"><ClipboardList size={18} className="text-accent2" /></div>
                <div><p className="font-heading font-bold text-[20px] text-text-high">{progressionBlocks.length}</p><p className="font-body text-[11px] text-text-low">Rutinas en bloque</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary-bg h-11 w-11 rounded-xl border border-primary flex items-center justify-center shrink-0"><Target size={18} className="text-primary" /></div>
                <div><p className="font-heading font-bold text-[20px] text-text-high capitalize">{activeProgression.goal}</p><p className="font-body text-[11px] text-text-low">Objetivo</p></div>
              </div>
            </div>
          </Card>
        </div>

        {/* COLUMNA CENTRAL Y DERECHA — CALENDARIO */}
        <div className="col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="font-subheading font-bold text-[14px] text-text-low">SEMANA {currentWeekIndex + 1} DE {activeProgression.duration_weeks}</p>
            <div className="flex gap-2">
              <button onClick={handlePreviousWeek} disabled={currentWeekIndex === 0} className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-colors ${currentWeekIndex === 0 ? "bg-surf border-text-low text-text-low/30 cursor-not-allowed" : "bg-surf border-text-low text-text-high hover:bg-surface"}`}><ChevronLeft size={16} /></button>
              <button onClick={handleNextWeek} disabled={currentWeekIndex >= activeProgression.duration_weeks - 1} className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-colors ${currentWeekIndex >= activeProgression.duration_weeks - 1 ? "bg-surf border-text-low text-text-low/30 cursor-not-allowed" : "bg-surf border-text-low text-text-high hover:bg-surface"}`}><ChevronRight size={16} /></button>
            </div>
          </div>

          <Card>
            <div className="flex items-center justify-between">
              {weekDays.map((day, index) => {
                const assignment = calendarAssignments[day.fullDate];
                const isRest = assignment?.type === "rest";
                const routineId = assignment?.routineId;
                const color = routineId ? getRoutineColor(routineId) : null;
                const isCompleted = completedDays.has(day.fullDate);
                return (
                  <button key={index} onClick={() => handleDayClick(day)} className="flex flex-col items-center gap-1.5 relative flex-1">
                    <p className="font-subheading font-bold text-[12px] text-text-low">{day.dayName}</p>
                    <div className={`h-12 w-12 rounded-xl font-heading font-bold text-[16px] flex items-center justify-center transition-all ${day.isToday ? "border-2 border-accent1 bg-accent1/10 text-accent1" : selectedDayDetail?.fullDate === day.fullDate ? "border-2 border-primary bg-primary/10 text-primary" : isCompleted ? "border-2 border-accent3 bg-accent3/10 text-accent3" : "border border-text-low bg-surf text-text-high"}`}
                      style={color && !day.isToday && !isCompleted && selectedDayDetail?.fullDate !== day.fullDate ? { borderColor: color, backgroundColor: `${color}15` } : {}}>
                      {day.dayNum}
                    </div>
                    <p className="text-[14px]">
                      {isCompleted ? <CircleCheck size={14} className="text-green" /> : isRest ? <Moon size={14} className="text-blue" /> : routineId ? <Dumbbell size={14} className="text-primary" /> : "·"}
                    </p>
                    {color && !isCompleted && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full" style={{ backgroundColor: color }}></div>}
                  </button>
                );
              })}
            </div>
          </Card>

          {selectedDayDetail && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${selectedDayDetail.color}20`, border: `1px solid ${selectedDayDetail.color}` }}>
                    <Dumbbell size={20} style={{ color: selectedDayDetail.color }} />
                  </div>
                  <div>
                    <p className="font-body text-[11px] text-text-low">{selectedDayDetail.dayName} {selectedDayDetail.dayNum}</p>
                    <p className="font-heading font-bold text-[18px] text-text-high">{selectedDayDetail.routine.name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDayDetail(null)} className="h-8 w-8 rounded-lg border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">✕</button>
              </div>
              <div className="flex gap-3 mb-4">
                <span className="bg-surf px-3 py-1.5 rounded-lg border border-text-low font-body text-[12px] text-text-low">{selectedDayDetail.routine.routine_exercises?.length || 0} ejercicios</span>
                <span className="bg-surf px-3 py-1.5 rounded-lg border border-text-low font-body text-[12px] text-text-low">{selectedDayDetail.routine.estimated_duration_min || 0} min</span>
              </div>
              {completedDays.has(selectedDayDetail.fullDate) ? (
                <div className="bg-accent3/10 border border-accent3 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-[32px]">✅</span>
                  <div className="flex-1"><p className="font-heading font-bold text-[15px] text-accent3">Rutina completada</p><p className="font-body text-[12px] text-text-low">Ya completaste este entrenamiento</p></div>
                </div>
              ) : selectedDayDetail.isToday ? (
                <Button variant="outlined" text="⚡ Iniciar entrenamiento" bgColor="bg-accent1" textColor="text-text-high" borderColor="border-accent1" w="w-full" onClick={() => handleStartRoutine(selectedDayDetail.routine.id, selectedDayDetail.fullDate)} />
              ) : (
                <div className="bg-surf/50 border border-text-low rounded-xl p-4 flex items-center gap-3">
                  <Lock size={24} className="text-text-low" />
                  <div className="flex-1"><p className="font-heading font-bold text-[14px] text-text-low">Solo disponible el día indicado</p><p className="font-body text-[12px] text-text-low">Podrás iniciar esta rutina cuando llegue su día</p></div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressionDesktop;