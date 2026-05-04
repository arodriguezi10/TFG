import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";

const Progression = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

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
    if (user) {
      loadUserSubscription();
      fetchProgressions();
    }
  }, [user]);

  useEffect(() => {
    // ✅ Recargar si acabamos de completar una rutina
    if (location.state?.justCompleted) {
      fetchProgressions();
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadUserSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error cargando suscripción:", error);
        setSubscriptionTier("free");
      } else {
        setSubscriptionTier(data?.subscription_tier || "free");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubscriptionTier("free");
    }
  };

  const fetchProgressions = async () => {
    try {
      setLoading(true);

      const { data: progressionData, error: progressionError } = await supabase
        .from("progressions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (progressionError) {
        console.error("Error cargando progresión:", progressionError);
        setActiveProgression(null);
        return;
      }

      if (progressionData) {
        setActiveProgression(progressionData);

        const { data: blocks, error: blocksError } = await supabase
          .from("progression_routine_blocks")
          .select(
            `
            *,
            routines (
              id,
              name,
              estimated_duration_min,
              routine_exercises (id)
            )
          `
          )
          .eq("progression_id", progressionData.id)
          .order("position", { ascending: true });

        if (!blocksError && blocks) {
          setProgressionBlocks(blocks);
        }

        // ✅ Cargar asignaciones del calendario PRIMERO
        const { data: calendar, error: calendarError } = await supabase
          .from("progression_calendar")
          .select("*")
          .eq("progression_id", progressionData.id);

        let assignments = {};
        if (!calendarError && calendar) {
          calendar.forEach((entry) => {
            assignments[entry.date] = {
              type: entry.is_rest_day ? "rest" : "routine",
              routineId: entry.routine_id,
            };
          });
          setCalendarAssignments(assignments);
        }

        // ✅ AHORA cargar días completados usando las asignaciones
        const startDate = new Date(progressionData.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(
          startDate.getDate() + progressionData.duration_weeks * 7
        );

        const { data: sessions, error: sessionsError } = await supabase
          .from("workout_sessions")
          .select("session_date, routine_id")
          .eq("user_id", user.id)
          .gte("session_date", startDate.toISOString().split("T")[0])
          .lte("session_date", endDate.toISOString().split("T")[0]);

        if (!sessionsError && sessions) {
          const completed = new Set();
          sessions.forEach((session) => {
            // ✅ Verificar que la rutina del día coincide con la planificada
            const assignment = assignments[session.session_date];
            if (assignment && assignment.routineId === session.routine_id) {
              completed.add(session.session_date);
            }
          });
          setCompletedDays(completed);
        }

        // Calcular semana actual
        calculateCurrentWeek(progressionData);
        generateWeekCalendar(progressionData, 0);
      } else {
        setActiveProgression(null);
      }
    } catch (error) {
      console.error("Error cargando progresiones:", error);
      setActiveProgression(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentWeek = (progression) => {
    const startDate = new Date(progression.start_date);
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekIndex = Math.floor(diffDays / 7);

    const clampedWeek = Math.max(
      0,
      Math.min(weekIndex, progression.duration_weeks - 1)
    );
    setCurrentWeekIndex(clampedWeek);
  };

  const generateWeekCalendar = (progression, weekOffset) => {
    const startDate = new Date(progression.start_date);
    startDate.setDate(startDate.getDate() + weekOffset * 7);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dayName = currentDate.toLocaleDateString("es-ES", {
        weekday: "short",
      });
      const dayNum = currentDate.getDate();
      const fullDate = currentDate.toISOString().split("T")[0];
      const isToday = fullDate === new Date().toISOString().split("T")[0];

      days.push({
        dayName: dayName.charAt(0).toUpperCase(),
        dayNum,
        fullDate,
        isToday,
      });
    }

    setWeekDays(days);
  };

  const handlePreviousWeek = () => {
    if (currentWeekIndex > 0) {
      const newIndex = currentWeekIndex - 1;
      setCurrentWeekIndex(newIndex);
      generateWeekCalendar(activeProgression, newIndex);
      setSelectedDayDetail(null); // Cerrar detalle al cambiar semana
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < activeProgression.duration_weeks - 1) {
      const newIndex = currentWeekIndex + 1;
      setCurrentWeekIndex(newIndex);
      generateWeekCalendar(activeProgression, newIndex);
      setSelectedDayDetail(null); // Cerrar detalle al cambiar semana
    }
  };

  const getRoutineColor = (routineId) => {
    const block = progressionBlocks.find((b) => b.routine_id === routineId);
    return block?.color_code || "#6c63ff";
  };

  //PROGRESO BASADO EN DÍAS COMPLETADOS
  const getProgressPercentage = () => {
    if (!activeProgression) return 0;
    const totalDays = activeProgression.duration_weeks * 7;
    const completedCount = completedDays.size;
    return (completedCount / totalDays) * 100;
  };

  const handleCreateProgression = () => {
    navigate("/createProgression");
  };

  const handleNavigateToSubscription = () => {
    navigate("/subscription");
  };

  const handleDayClick = (day) => {
    const assignment = calendarAssignments[day.fullDate];

    if (!assignment || assignment.type === "rest") {
      setSelectedDayDetail(null);
      return;
    }

    // Si ya está seleccionado el mismo día, colapsar
    if (selectedDayDetail?.fullDate === day.fullDate) {
      setSelectedDayDetail(null);
      return;
    }

    // Buscar la rutina completa
    const routineBlock = progressionBlocks.find(
      (b) => b.routine_id === assignment.routineId
    );

    if (routineBlock) {
      setSelectedDayDetail({
        ...day,
        routine: routineBlock.routines,
        color: routineBlock.color_code,
      });
    }
  };

  // SOLO PERMITIR INICIAR RUTINA SI ES HOY
  const handleStartRoutine = (routineId, dayFullDate) => {
    const todayDate = new Date().toISOString().split("T")[0];
    
    // Verificar que sea el día de hoy
    if (dayFullDate !== todayDate) {
      alert("Solo puedes iniciar la rutina el día que te toca");
      return;
    }

    navigate(`/executeRoutine/${routineId}`, {
      state: {
        fromProgression: true,
        progressionId: activeProgression.id,
        completedDate: dayFullDate,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-text-low">Cargando progresiones...</p>
      </div>
    );
  }

  // Si el usuario no es Elite, mostrar pantalla de upgrade
  if (subscriptionTier !== "elite") {
    return (
      <div className="min-h-screen bg-background flex flex-col mb-2.5 px-4">
        <section className="w-full flex items-center justify-between">
          <div className="flex flex-col gap-1.25">
            <div className="flex gap-3.75">
              <p className="font-subheading text-[12px] text-text-low">
                Biblioteca
              </p>
            </div>

            <h1 className="font-heading font-extrabold text-[28px] text-text-high flex flex-col leading-tight">
              Progresión
            </h1>
          </div>

          <button
            onClick={() => navigate("/routines1")}
            className="bg-surf h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-low hover:bg-surface transition-colors cursor-pointer"
          >
            ←
          </button>
        </section>

        {/* TABS */}
        <section className="mt-3 w-full border-b border-text-low">
          <div className="flex gap-8">
            <button
              onClick={() => navigate("/routines1")}
              className="pb-2 font-subheading font-semibold text-[15px] transition-all text-text-low hover:text-text-high"
            >
              Rutinas
            </button>

            <button className="pb-2 font-subheading font-semibold text-[15px] transition-all text-accent1 relative">
              Progresión
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent1"></div>
            </button>
          </div>
        </section>

        {/* PANTALLA DE UPGRADE */}
        <section className="mt-16 flex flex-col items-center justify-center gap-3.75 px-4">
          <div className="relative">
            <span className="bg-linear-to-br from-yellow/20 to-orange/20 h-32 w-32 rounded-[40px] font-body text-[70px] flex items-center justify-center border border-yellow/30">
              👑
            </span>
            <div className="absolute -top-2 -right-2 bg-yellow h-8 w-8 rounded-full flex items-center justify-center text-[16px] animate-pulse">
              ✨
            </div>
          </div>

          <p className="mt-2 bg-yellow-bg2 px-3.5 py-1 rounded-2xl border border-yellow font-subheading font-bold text-[14px] text-yellow">
            ◆ FUNCIÓN ÉLITE
          </p>

          <p className="font-heading font-extrabold text-[32px] text-text-high leading-tight flex flex-col items-center justify-center text-center">
            Desbloquea la
            <span className="text-yellow">progresión automática</span>
          </p>

          <p className="font-body text-[15px] text-text-low text-center max-w-sm">
            Planifica la evolución de tus cargas semana a semana con
            progresiones inteligentes diseñadas por tu entrenador.
          </p>

          {/* BENEFICIOS */}
          <div className="mt-4 w-full flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent1/10 border border-accent1 flex items-center justify-center text-[18px] shrink-0">
                📈
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-[15px] text-text-high mb-0.5">
                  Progresión inteligente
                </p>
                <p className="font-body text-[13px] text-text-low">
                  Incrementa peso y volumen de forma óptima cada semana
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent2/10 border border-accent2 flex items-center justify-center text-[18px] shrink-0">
                🎯
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-[15px] text-text-high mb-0.5">
                  Ciclos personalizados
                </p>
                <p className="font-body text-[13px] text-text-low">
                  Crea mesociclos de 4-12 semanas adaptados a tus objetivos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent3/10 border border-accent3 flex items-center justify-center text-[18px] shrink-0">
                ⚡
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-[15px] text-text-high mb-0.5">
                  Automatización completa
                </p>
                <p className="font-body text-[13px] text-text-low">
                  Olvídate de calcular, el sistema ajusta todo por ti
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA UPGRADE */}
        <section className="mt-8 flex flex-col gap-3">
          <Button
            variant="outlined"
            text="👑 Mejorar a Élite"
            bgColor={"bg-yellow"}
            textColor={"text-background"}
            borderColor={"border-yellow"}
            w="w-[100%]"
            onClick={handleNavigateToSubscription}
          />

          <button onClick={() => navigate("/routines1")} className="w-full">
            <p className="font-body text-[14px] text-text-low text-center">
              Volver a rutinas
            </p>
          </button>
        </section>
      </div>
    );
  }

  // SI NO HAY PROGRESIÓN ACTIVA - EMPTY STATE
  if (!activeProgression) {
    return (
      <div className="min-h-screen bg-background flex flex-col mb-2.5 px-4">
        <section className="w-full flex items-center justify-between">
          <div className="flex flex-col gap-1.25">
            <div className="flex gap-3.75">
              <p className="font-subheading text-[12px] text-text-low">
                Biblioteca
              </p>
            </div>

            <h1 className="font-heading font-extrabold text-[28px] text-text-high flex flex-col leading-tight">
              Progresión
            </h1>
          </div>

          <div className="flex gap-2.5">
            <div className="bg-surf h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-low">
              ⚙️
            </div>

            <button
              onClick={handleCreateProgression}
              className="bg-accent1 h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-high cursor-pointer hover:opacity-80 transition-opacity"
            >
              +
            </button>
          </div>
        </section>

        {/* TABS */}
        <section className="mt-3 w-full border-b border-text-low">
          <div className="flex gap-8">
            <button
              onClick={() => navigate("/routines1")}
              className="pb-2 font-subheading font-semibold text-[15px] transition-all text-text-low hover:text-text-high"
            >
              Rutinas
            </button>

            <button className="pb-2 font-subheading font-semibold text-[15px] transition-all text-accent1 relative">
              Progresión
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent1"></div>
            </button>
          </div>
        </section>

        <section className="mt-2">
          <p className="font-body text-[14px] text-text-low">
            0 progresiones activas
          </p>
        </section>

        {/* EMPTY STATE */}
        <section className="mt-12.5 flex flex-col items-center justify-center gap-3.75">
          <div className="relative">
            <span className="bg-surf h-27.5 w-27.5 px-2.5 rounded-[35px] font-body text-[45px] text-accent1 flex items-center justify-center border border-accent1/20">
              📈
            </span>
            <div className="absolute -bottom-1 -right-1 bg-yellow h-9 w-9 rounded-full flex items-center justify-center text-[18px] border-2 border-background">
              ✨
            </div>
          </div>

          <p className="mt-5 bg-surf px-3.5 py-0.5 rounded-2xl border border-text-low font-subheading font-semibold text-[16px] text-text-low">
            Sin progresiones todavía
          </p>

          <p className="font-heading font-extrabold text-[28px] text-text-high leading-tight flex flex-col items-center justify-center text-center">
            Crea tu primera
            <span className="text-accent1">progresión automática</span>
          </p>

          <p className="font-body text-[16px] text-text-low text-center max-w-sm">
            Diseña un plan de 4-12 semanas con incrementos automáticos de carga
            y volumen para maximizar tu progreso.
          </p>
        </section>

        {/* INFORMACIÓN ADICIONAL */}
        <section className="mt-8">
          <Card>
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-[20px] shrink-0">
                💡
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-[16px] text-text-high mb-1">
                  ¿Cómo funciona?
                </p>
                <p className="font-body text-[13px] text-text-low leading-relaxed">
                  Una progresión es un plan estructurado que incrementa
                  automáticamente tus cargas semana a semana basándose en
                  rutinas existentes o nuevas.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-text-low">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[14px]">📋</span>
                <p className="font-body text-[13px] text-text-low">
                  <span className="text-text-high font-semibold">Paso 1:</span>{" "}
                  Elige rutinas existentes o crea nuevas
                </p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[14px]">⏰</span>
                <p className="font-body text-[13px] text-text-low">
                  <span className="text-text-high font-semibold">Paso 2:</span>{" "}
                  Define duración del mesociclo (4-12 semanas)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[14px]">🎯</span>
                <p className="font-body text-[13px] text-text-low">
                  <span className="text-text-high font-semibold">Paso 3:</span>{" "}
                  Configura incrementos de peso y volumen
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <section className="mt-7.5 flex flex-col gap-2.5">
          <Button
            variant="outlined"
            text="Crear progresión"
            bgColor={"bg-accent1"}
            textColor={"text-text-high"}
            borderColor={"border-accent1"}
            w="w-[100%]"
            onClick={handleCreateProgression}
          />
        </section>
      </div>
    );
  }

  // ============================================
  // PANTALLA CON PROGRESIÓN ACTIVA
  // ============================================
  return (
    <div className="min-h-screen bg-background flex flex-col mb-2.5 px-4">
      {/* HEADER */}
      <section className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-1.25">
          <div className="flex gap-3.75">
            <p className="font-subheading text-[12px] text-text-low">
              Biblioteca
            </p>
          </div>

          <h1 className="font-heading font-extrabold text-[28px] text-text-high flex flex-col leading-tight">
            Progresión
          </h1>
        </div>

        <div className="flex gap-2.5">
          <button className="bg-surf h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-low hover:bg-surface transition-colors">
            ⚙️
          </button>

          <button
            onClick={handleCreateProgression}
            className="bg-accent1 h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-high cursor-pointer hover:opacity-80 transition-opacity"
          >
            +
          </button>
        </div>
      </section>

      {/* TABS */}
      <section className="mt-3 w-full border-b border-text-low">
        <div className="flex gap-8">
          <button
            onClick={() => navigate("/routines1")}
            className="pb-2 font-subheading font-semibold text-[15px] transition-all text-text-low hover:text-text-high"
          >
            Rutinas
          </button>

          <button className="pb-2 font-subheading font-semibold text-[15px] transition-all text-accent1 relative">
            Progresión
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent1"></div>
          </button>
        </div>
      </section>

      {/* NOMBRE DE LA PROGRESIÓN Y SEMANA ACTUAL */}
      <section className="mt-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">
                Mesociclo activo
              </p>
              <h2 className="font-heading font-extrabold text-[24px] text-text-high mt-1 leading-tight">
                {activeProgression.name}
              </h2>
              <p className="font-body text-[13px] text-text-low mt-1">
                Objetivo: {activeProgression.goal} ·{" "}
                {activeProgression.duration_weeks} semanas
              </p>
            </div>

            <div className="bg-accent1 rounded-2xl px-4 py-3 flex flex-col items-center shrink-0">
              <p className="font-subheading font-bold text-[11px] text-text-high/80 uppercase">
                Semana
              </p>
              <p className="font-heading font-extrabold text-[32px] text-text-high leading-none">
                {currentWeekIndex + 1}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* CALENDARIO SEMANAL CON NAVEGACIÓN */}
      <section className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-subheading font-bold text-[16px] text-text-low">
            SEMANA {currentWeekIndex + 1} DE {activeProgression.duration_weeks}
          </p>

          <div className="flex gap-2">
            <button
              onClick={handlePreviousWeek}
              disabled={currentWeekIndex === 0}
              className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-colors ${
                currentWeekIndex === 0
                  ? "bg-surf border-text-low text-text-low/30 cursor-not-allowed"
                  : "bg-surf border-text-low text-text-high hover:bg-surface"
              }`}
            >
              ←
            </button>
            <button
              onClick={handleNextWeek}
              disabled={
                currentWeekIndex >= activeProgression.duration_weeks - 1
              }
              className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-colors ${
                currentWeekIndex >= activeProgression.duration_weeks - 1
                  ? "bg-surf border-text-low text-text-low/30 cursor-not-allowed"
                  : "bg-surf border-text-low text-text-high hover:bg-surface"
              }`}
            >
              →
            </button>
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
                <button
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className="flex flex-col items-center gap-1.5 relative"
                >
                  <p className="font-subheading font-bold text-[12px] text-text-low">
                    {day.dayName}
                  </p>

                  <div
                    className={`h-11 w-11 rounded-xl font-heading font-bold text-[16px] flex items-center justify-center transition-all ${
                      day.isToday
                        ? "border-2 border-accent1 bg-accent1/10 text-accent1"
                        : selectedDayDetail?.fullDate === day.fullDate
                          ? "border-2 border-primary bg-primary/10 text-primary"
                          : isCompleted
                            ? "border-2 border-accent3 bg-accent3/10 text-accent3"
                            : "border border-text-low bg-surf text-text-high"
                    }`}
                    style={
                      color &&
                      !day.isToday &&
                      !isCompleted &&
                      selectedDayDetail?.fullDate !== day.fullDate
                        ? { borderColor: color, backgroundColor: `${color}15` }
                        : {}
                    }
                  >
                    {day.dayNum}
                  </div>

                  <p className="text-[14px]">
                    {isCompleted
                      ? "✅"
                      : isRest
                        ? "😴"
                        : routineId
                          ? "💪"
                          : "·"}
                  </p>

                  {/* Indicador de color superior */}
                  {color && !isCompleted && (
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* DETALLE DE RUTINA DEL DÍA SELECCIONADO */}
        {selectedDayDetail && (
          <Card className="mt-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-[18px]"
                  style={{
                    backgroundColor: `${selectedDayDetail.color}20`,
                    border: `1px solid ${selectedDayDetail.color}`,
                  }}
                >
                  💪
                </div>
                <div>
                  <p className="font-body text-[11px] text-text-low">
                    {selectedDayDetail.dayName} {selectedDayDetail.dayNum}
                  </p>
                  <p className="font-heading font-bold text-[16px] text-text-high">
                    {selectedDayDetail.routine.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDayDetail(null)}
                className="h-8 w-8 rounded-lg border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-3 mb-4">
              <span className="bg-surf px-3 py-1.5 rounded-lg border border-text-low font-body text-[12px] text-text-low">
                {selectedDayDetail.routine.routine_exercises?.length || 0}{" "}
                ejercicios
              </span>
              <span className="bg-surf px-3 py-1.5 rounded-lg border border-text-low font-body text-[12px] text-text-low">
                {selectedDayDetail.routine.estimated_duration_min || 0} min
              </span>
            </div>

            {completedDays.has(selectedDayDetail.fullDate) ? (
              <div className="bg-accent3/10 border border-accent3 rounded-xl p-4 flex items-center gap-3">
                <span className="text-[32px]">✅</span>
                <div className="flex-1">
                  <p className="font-heading font-bold text-[15px] text-accent3">
                    Rutina completada
                  </p>
                  <p className="font-body text-[12px] text-text-low">
                    Ya completaste este entrenamiento
                  </p>
                </div>
              </div>
            ) : selectedDayDetail.isToday ? (
              <Button
                variant="outlined"
                text="⚡ Iniciar entrenamiento"
                bgColor="bg-accent1"
                textColor="text-text-high"
                borderColor="border-accent1"
                w="w-full"
                onClick={() =>
                  handleStartRoutine(selectedDayDetail.routine.id, selectedDayDetail.fullDate)
                }
              />
            ) : (
              <div className="bg-surf/50 border border-text-low rounded-xl p-4 flex items-center gap-3">
                <span className="text-[24px]">🔒</span>
                <div className="flex-1">
                  <p className="font-heading font-bold text-[14px] text-text-low">
                    Solo disponible el día indicado
                  </p>
                  <p className="font-body text-[12px] text-text-low">
                    Podrás iniciar esta rutina cuando llegue su día
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}
      </section>

      {/* BARRA DE PROGRESO - BASADA EN COMPLETADOS */}
      <section className="mt-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="font-subheading font-bold text-[14px] text-text-low">
              PROGRESO DEL MESOCICLO
            </p>
            <p className="font-heading font-bold text-[16px] text-accent1">
              {Math.round(getProgressPercentage())}%
            </p>
          </div>

          <div className="w-full h-3 bg-surf rounded-full overflow-hidden">
            <div
              className="h-full bg-accent1 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="font-body text-[12px] text-text-low">
              {completedDays.size} días completados
            </p>
            <p className="font-body text-[12px] text-text-low">
              {activeProgression.duration_weeks * 7} días totales
            </p>
          </div>
        </Card>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="mt-4">
        <Card>
          <p className="font-subheading font-bold text-[14px] text-text-low mb-4">
            RESUMEN
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-accent1/10 h-12 w-12 rounded-xl border border-accent1 flex items-center justify-center text-[20px] mb-2">
                ⏰
              </div>
              <p className="font-heading font-bold text-[20px] text-text-high">
                {activeProgression.duration_weeks}
              </p>
              <p className="font-body text-[11px] text-text-low text-center">
                Semanas totales
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-accent2/10 h-12 w-12 rounded-xl border border-accent2 flex items-center justify-center text-[20px] mb-2">
                📋
              </div>
              <p className="font-heading font-bold text-[20px] text-text-high">
                {progressionBlocks.length}
              </p>
              <p className="font-body text-[11px] text-text-low text-center">
                Rutinas en bloque
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-accent3/10 h-12 w-12 rounded-xl border border-accent3 flex items-center justify-center text-[20px] mb-2">
                🎯
              </div>
              <p className="font-heading font-bold text-[20px] text-text-high capitalize">
                {activeProgression.goal}
              </p>
              <p className="font-body text-[11px] text-text-low text-center">
                Objetivo
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Progression;