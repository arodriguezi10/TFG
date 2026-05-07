import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useContext, useState, useEffect } from "react";

import {
  Calendar,
  ChevronRight,
  ChevronLeft,
  CircleCheck,
  Dumbbell,
  Moon,
  BedDouble,
  Zap,
  Timer,
  Scale,
  Pencil,
  BarChart2,
  Lock,
  Clock,
  Layers,
  Plus,
  CheckCircle2,
  Minus,
  LockKeyhole,
} from "lucide-react";

const getLocalDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const DashboardDesktop = () => {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [todayRoutine, setTodayRoutine] = useState(null);
  const [preWorkout, setPreWorkout] = useState(false);
  const [postWorkout, setPostWorkout] = useState(false);
  const [todayWeight, setTodayWeight] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [weeklyChange, setWeeklyChange] = useState(null);
  const [monthlyChange, setMonthlyChange] = useState(null);
  const [last7Days, setLast7Days] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [routineCompletedToday, setRoutineCompletedToday] = useState(false);
  const [activeProgression, setActiveProgression] = useState(null);
  const [progressionWeekDays, setProgressionWeekDays] = useState([]);
  const [progressionAssignments, setProgressionAssignments] = useState({});
  const [progressionCompletedDays, setProgressionCompletedDays] = useState(
    new Set(),
  );
  const [progressionBlocks, setProgressionBlocks] = useState([]);
  const [todayProgressionRoutine, setTodayProgressionRoutine] = useState(null);
  const [currentProgressionWeek, setCurrentProgressionWeek] = useState(0);
  const [selectedProgressionDay, setSelectedProgressionDay] = useState(null);

  useEffect(() => {
    loadInitialData();
    loadDailyChecks();
    loadWeightData();
    loadWeekData();
  }, []);

  useEffect(() => {
    let lastCheckDate = new Date().toDateString();
    const checkMidnight = setInterval(() => {
      const currentDate = new Date().toDateString();
      if (currentDate !== lastCheckDate) {
        resetDailyChecks();
        loadWeightData();
        loadWeekData();
        loadInitialData();
        lastCheckDate = currentDate;
      }
    }, 30000);
    return () => clearInterval(checkMidnight);
  }, []);

  const checkTodayHasProgressionRoutine = async (progressionData) => {
    const todayDate = getLocalDate();
    const { data: calendar } = await supabase
      .from("progression_calendar")
      .select("*")
      .eq("progression_id", progressionData.id)
      .eq("date", todayDate)
      .eq("is_rest_day", false)
      .single();
    return !!(calendar && calendar.routine_id);
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const progressionData = await loadProgressionData();
      const todayStr = getLocalDate();
      const inRange = progressionData
        ? (() => {
            const end = new Date(progressionData.start_date + "T12:00:00");
            end.setDate(end.getDate() + progressionData.duration_weeks * 7 - 1);
            const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;
            return todayStr >= progressionData.start_date && todayStr <= endStr;
          })()
        : false;
      await loadData(
        inRange && (await checkTodayHasProgressionRoutine(progressionData)),
      );
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgressionData = async () => {
    try {
      const { data: progressionData, error: progressionError } = await supabase
        .from("progressions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (progressionError || !progressionData) {
        setActiveProgression(null);
        setTodayProgressionRoutine(null);
        return null;
      }

      setActiveProgression(progressionData);

      const { data: blocks } = await supabase
        .from("progression_routine_blocks")
        .select(
          `*, routines (id, name, estimated_duration_min, routine_exercises (id, target_sets))`,
        )
        .eq("progression_id", progressionData.id)
        .order("position", { ascending: true });

      if (blocks) setProgressionBlocks(blocks);

      const { data: calendar } = await supabase
        .from("progression_calendar")
        .select("*")
        .eq("progression_id", progressionData.id);

      let assignments = {};
      if (calendar) {
        calendar.forEach((entry) => {
          assignments[entry.date] = {
            type: entry.is_rest_day ? "rest" : "routine",
            routineId: entry.routine_id,
          };
        });
        setProgressionAssignments(assignments);

        const todayDate = getLocalDate();
        const todayAssignment = assignments[todayDate];

        if (
          todayAssignment &&
          todayAssignment.type === "routine" &&
          todayAssignment.routineId &&
          blocks
        ) {
          const routineBlock = blocks.find(
            (b) => b.routine_id === todayAssignment.routineId,
          );
          if (routineBlock) {
            setTodayProgressionRoutine(routineBlock.routines);
            const isCompleted = await checkIfRoutineCompletedToday(
              routineBlock.routines.id,
            );
            setRoutineCompletedToday(isCompleted);
          } else {
            setTodayProgressionRoutine(null);
            setRoutineCompletedToday(false);
          }
        } else {
          setTodayProgressionRoutine(null);
          setRoutineCompletedToday(false);
        }
      }

      const startDate = new Date(progressionData.start_date + "T12:00:00");
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + progressionData.duration_weeks * 7);

      const { data: sessions } = await supabase
        .from("workout_sessions")
        .select("session_date, routine_id")
        .eq("user_id", user.id)
        .gte("session_date", progressionData.start_date)
        .lte(
          "session_date",
          `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`,
        );

      if (sessions) {
        const completed = new Set();
        sessions.forEach((session) => {
          const assignment = assignments[session.session_date];
          if (assignment && assignment.routineId === session.routine_id)
            completed.add(session.session_date);
        });
        setProgressionCompletedDays(completed);
      }

      calculateCurrentProgressionWeek(progressionData);
      generateProgressionWeekCalendar(progressionData, currentProgressionWeek);
      return progressionData;
    } catch (error) {
      console.error("Error cargando progresión:", error);
      setActiveProgression(null);
      setTodayProgressionRoutine(null);
      return null;
    }
  };

  const calculateCurrentProgressionWeek = (progression) => {
    const startDate = new Date(progression.start_date + "T12:00:00");
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekIndex = Math.floor(diffDays / 7);
    const clampedWeek = Math.max(
      0,
      Math.min(weekIndex, progression.duration_weeks - 1),
    );
    setCurrentProgressionWeek(clampedWeek);
  };

  const generateProgressionWeekCalendar = (progression, weekOffset) => {
    const startDate = new Date(progression.start_date + "T12:00:00");
    startDate.setDate(startDate.getDate() + weekOffset * 7);
    const todayLocal = getLocalDate();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dayName = currentDate.toLocaleDateString("es-ES", {
        weekday: "short",
      });
      const dayNum = currentDate.getDate();
      const fullDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
      const isToday = fullDate === todayLocal;
      days.push({
        dayName: dayName.charAt(0).toUpperCase(),
        dayNum,
        fullDate,
        isToday,
      });
    }
    setProgressionWeekDays(days);
  };

  const handlePreviousProgressionWeek = () => {
    if (currentProgressionWeek > 0) {
      const newWeek = currentProgressionWeek - 1;
      setCurrentProgressionWeek(newWeek);
      generateProgressionWeekCalendar(activeProgression, newWeek);
      setSelectedProgressionDay(null);
    }
  };

  const handleNextProgressionWeek = () => {
    if (currentProgressionWeek < activeProgression.duration_weeks - 1) {
      const newWeek = currentProgressionWeek + 1;
      setCurrentProgressionWeek(newWeek);
      generateProgressionWeekCalendar(activeProgression, newWeek);
      setSelectedProgressionDay(null);
    }
  };

  const getRoutineColor = (routineId) => {
    const block = progressionBlocks.find((b) => b.routine_id === routineId);
    return block?.color_code || "#6c63ff";
  };

  const handleProgressionDayClick = (day) => {
    const assignment = progressionAssignments[day.fullDate];
    if (!assignment || assignment.type === "rest") {
      setSelectedProgressionDay(null);
      return;
    }
    if (selectedProgressionDay?.fullDate === day.fullDate) {
      setSelectedProgressionDay(null);
      return;
    }
    const routineBlock = progressionBlocks.find(
      (b) => b.routine_id === assignment.routineId,
    );
    if (routineBlock) {
      setSelectedProgressionDay({
        ...day,
        routine: routineBlock.routines,
        color: routineBlock.color_code,
      });
    }
  };

  const handleStartProgressionRoutine = () => {
    if (!selectedProgressionDay) return;
    const todayDate = getLocalDate();
    if (selectedProgressionDay.fullDate !== todayDate) return;
    if (progressionCompletedDays.has(selectedProgressionDay.fullDate)) return;
    navigate(`/executeRoutine/${selectedProgressionDay.routine.id}`, {
      state: {
        fromProgression: true,
        progressionId: activeProgression.id,
        completedDate: selectedProgressionDay.fullDate,
      },
    });
  };

  const checkIfRoutineCompletedToday = async (routineId) => {
    try {
      const todayDate = getLocalDate();
      const { data, error } = await supabase
        .from("workout_sessions")
        .select("id")
        .eq("user_id", user.id)
        .eq("routine_id", routineId)
        .eq("session_date", todayDate)
        .limit(1);
      if (error) return false;
      return data && data.length > 0;
    } catch {
      return false;
    }
  };

  const loadWeekData = async () => {
    try {
      const currentWeek = getCurrentWeekDays();
      setWeekDays(currentWeek);
      const { data: sessions } = await supabase
        .from("workout_sessions")
        .select("*")
        .eq("user_id", user.id)
        .gte("session_date", currentWeek[0].fullDate)
        .lte("session_date", currentWeek[6].fullDate)
        .order("session_date", { ascending: true });
      setCompletedSessions(sessions || []);
    } catch (error) {
      console.error("Error cargando semana:", error);
    }
  };

  const getCurrentWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const todayLocal = getLocalDate();
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + i);
      const dayStr = date
        .toLocaleDateString("es-ES", { weekday: "short" })
        .charAt(0)
        .toUpperCase();
      const dayNum = date.getDate();
      const fullDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const isToday = fullDate === todayLocal;
      weekDays.push({ dayStr, dayNum, fullDate, isToday });
    }
    return weekDays;
  };

  const isDateCompleted = (dateStr) =>
    completedSessions.some((s) => s.session_date === dateStr);
  const getSessionForDate = (dateStr) =>
    completedSessions.find((s) => s.session_date === dateStr);

  const handleDayClick = (day) => {
    const session = getSessionForDate(day.fullDate);
    if (session) {
      setSelectedDay(day);
      setSelectedSession(session);
    } else {
      setSelectedDay(null);
      setSelectedSession(null);
    }
  };

  const getTodayDayName = () => {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return days[new Date().getDay()];
  };

  const loadData = async (hasProgression = false) => {
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("first_name")
        .eq("id", user.id)
        .single();
      setName(userData?.first_name ?? "");
      if (!hasProgression) {
        const { data: routines, error } = await supabase
          .from("routines")
          .select(`*, routine_exercises (id, target_sets)`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) {
          setTodayRoutine(null);
          return;
        }
        const todayDayName = getTodayDayName();
        const routineForToday = routines?.find((routine) => {
          try {
            return JSON.parse(routine.assigned_days || "[]").includes(
              todayDayName,
            );
          } catch {
            return false;
          }
        });
        setTodayRoutine(routineForToday || null);
        if (routineForToday) {
          const isCompleted = await checkIfRoutineCompletedToday(
            routineForToday.id,
          );
          setRoutineCompletedToday(isCompleted);
        } else {
          setRoutineCompletedToday(false);
        }
      } else {
        setTodayRoutine(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setTodayRoutine(null);
    }
  };

  const loadWeightData = async () => {
    try {
      const todayDate = getLocalDate();
      const { data: todayData } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", todayDate)
        .single();
      setTodayWeight(todayData);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoDate = `${thirtyDaysAgo.getFullYear()}-${String(thirtyDaysAgo.getMonth() + 1).padStart(2, "0")}-${String(thirtyDaysAgo.getDate()).padStart(2, "0")}`;
      const { data: recentWeights } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("log_date", thirtyDaysAgoDate)
        .order("log_date", { ascending: false });

      if (recentWeights && recentWeights.length > 0) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoDate = `${sevenDaysAgo.getFullYear()}-${String(sevenDaysAgo.getMonth() + 1).padStart(2, "0")}-${String(sevenDaysAgo.getDate()).padStart(2, "0")}`;
        const weightSevenDaysAgo = recentWeights.find(
          (w) => w.log_date <= sevenDaysAgoDate,
        );
        if (todayData && weightSevenDaysAgo)
          setWeeklyChange(todayData.weight - weightSevenDaysAgo.weight);
        const weightThirtyDaysAgo = recentWeights[recentWeights.length - 1];
        if (todayData && weightThirtyDaysAgo)
          setMonthlyChange(todayData.weight - weightThirtyDaysAgo.weight);
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const sevenDaysAgoDate = `${sevenDaysAgo.getFullYear()}-${String(sevenDaysAgo.getMonth() + 1).padStart(2, "0")}-${String(sevenDaysAgo.getDate()).padStart(2, "0")}`;
      const { data: last7DaysData } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("log_date", sevenDaysAgoDate)
        .order("log_date", { ascending: true });

      const last7DaysArray = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        const weightLog = last7DaysData?.find((w) => w.log_date === dateStr);
        const dayName = date.toLocaleDateString("es-ES", { weekday: "short" });
        const firstLetter =
          dayName === "mié" ? "X" : dayName.charAt(0).toUpperCase();
        last7DaysArray.push({
          date: dateStr,
          weight: weightLog?.weight || null,
          dayName: firstLetter,
        });
      }
      setLast7Days(last7DaysArray);
    } catch (error) {
      console.error("Error cargando peso:", error);
    }
  };

  const handleSaveWeight = async () => {
    if (!weightInput || isNaN(weightInput)) {
      alert("Por favor ingresa un peso válido");
      return;
    }
    const weight = parseFloat(weightInput);
    if (weight <= 0 || weight > 500) {
      alert("El peso debe estar entre 0 y 500 kg");
      return;
    }
    const todayDate = getLocalDate();
    try {
      const { data: existing } = await supabase
        .from("weight_logs")
        .select("id")
        .eq("user_id", user.id)
        .eq("log_date", todayDate)
        .single();
      if (existing) {
        await supabase
          .from("weight_logs")
          .update({ weight, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("weight_logs")
          .insert({ user_id: user.id, weight, log_date: todayDate });
      }
      setShowWeightInput(false);
      setWeightInput("");
      await loadWeightData();
      alert("✅ Peso guardado correctamente");
    } catch (error) {
      console.error("Error guardando peso:", error);
      alert("❌ Error al guardar el peso");
    }
  };

  const loadDailyChecks = () => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("dailyChecksDate");
    if (savedDate === today) {
      setPreWorkout(localStorage.getItem("preWorkout") === "true");
      setPostWorkout(localStorage.getItem("postWorkout") === "true");
    } else {
      resetDailyChecks();
    }
  };

  const resetDailyChecks = () => {
    setPreWorkout(false);
    setPostWorkout(false);
    const today = new Date().toDateString();
    localStorage.setItem("dailyChecksDate", today);
    localStorage.setItem("preWorkout", "false");
    localStorage.setItem("postWorkout", "false");
  };

  const handlePreWorkoutToggle = () => {
    if (window.confirm("¿Confirmas que has completado tu pre-entreno?")) {
      const newStatus = !preWorkout;
      setPreWorkout(newStatus);
      localStorage.setItem("preWorkout", String(newStatus));
    }
  };

  const handlePostWorkoutToggle = () => {
    if (window.confirm("¿Confirmas que has completado tu post-entreno?")) {
      const newStatus = !postWorkout;
      setPostWorkout(newStatus);
      localStorage.setItem("postWorkout", String(newStatus));
    }
  };

  const handleStartRoutine = async () => {
    if (todayProgressionRoutine) {
      const todayDate = getLocalDate();
      if (routineCompletedToday) {
        const { data: session } = await supabase
          .from("workout_sessions")
          .select("id")
          .eq("user_id", user.id)
          .eq("routine_id", todayProgressionRoutine.id)
          .eq("session_date", todayDate)
          .single();
        navigate(`/executeRoutine/${todayProgressionRoutine.id}`, {
          state: { viewOnly: true, sessionId: session?.id },
        });
      } else {
        navigate(`/executeRoutine/${todayProgressionRoutine.id}`, {
          state: {
            fromProgression: true,
            progressionId: activeProgression.id,
            completedDate: todayDate,
          },
        });
      }
    } else if (todayRoutine) {
      if (routineCompletedToday) {
        const todayDate = getLocalDate();
        const { data: session } = await supabase
          .from("workout_sessions")
          .select("id")
          .eq("user_id", user.id)
          .eq("routine_id", todayRoutine.id)
          .eq("session_date", todayDate)
          .single();
        navigate(`/executeRoutine/${todayRoutine.id}`, {
          state: { viewOnly: true, sessionId: session?.id },
        });
      } else {
        navigate(`/executeRoutine/${todayRoutine.id}`);
      }
    } else {
      navigate("/routines1");
    }
  };

  const parseMuscles = (musclesJson) => {
    try {
      const muscles = JSON.parse(musclesJson);
      if (Array.isArray(muscles) && muscles.length > 0)
        return muscles.slice(0, 3).join(" · ");
      return "Sin especificar";
    } catch {
      return "Sin especificar";
    }
  };

  const getRoutineStats = (routine) => {
    if (!routine) return { exerciseCount: 0, totalSets: 0, duration: 0 };
    return {
      exerciseCount: routine.routine_exercises?.length || 0,
      totalSets:
        routine.routine_exercises?.reduce(
          (sum, ex) => sum + (ex.target_sets || 0),
          0,
        ) || 0,
      duration: routine.estimated_duration_min || 0,
    };
  };

  const formatWeight = (weight) => {
    const integerPart = Math.floor(weight);
    const decimalPart = ((weight % 1) * 100).toFixed(0).padStart(2, "0");
    return { integer: integerPart, decimal: decimalPart };
  };

  const renderWeightChart = () => {
    const validWeights = last7Days
      .filter((d) => d.weight !== null)
      .map((d) => d.weight);
    if (validWeights.length === 0)
      return (
        <div className="w-full h-16 bg-surf rounded-xl mt-2 flex items-center justify-center">
          <p className="text-text-low text-[12px]">Sin datos suficientes</p>
        </div>
      );
    const minWeight = Math.min(...validWeights);
    const maxWeight = Math.max(...validWeights);
    const range = maxWeight - minWeight || 1;
    return (
      <div className="w-full h-16 bg-surf rounded-xl mt-2 p-3 flex items-end justify-between gap-1">
        {last7Days.map((day, index) => {
          const height = day.weight
            ? ((day.weight - minWeight) / range) * 100
            : 0;
          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 gap-1"
            >
              <div
                className="w-full flex items-end justify-center"
                style={{ height: "32px" }}
              >
                {day.weight ? (
                  <div
                    className="w-full bg-accent1 rounded-t-sm"
                    style={{
                      height: `${Math.max(height, 10)}%`,
                      minHeight: "4px",
                    }}
                  />
                ) : (
                  <div className="w-full h-1 bg-text-low/20 rounded-full" />
                )}
              </div>
              <span className="text-[10px] text-text-low font-semibold">
                {day.dayName}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const todayDate = getLocalDate();
  const progressionStartDate = activeProgression?.start_date;
  const progressionEndDate = activeProgression
    ? (() => {
        const end = new Date(activeProgression.start_date + "T12:00:00");
        end.setDate(end.getDate() + activeProgression.duration_weeks * 7 - 1);
        return `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;
      })()
    : null;
  const isTodayInProgressionRange =
    activeProgression &&
    todayDate >= progressionStartDate &&
    todayDate <= progressionEndDate;
  const displayRoutine = isTodayInProgressionRange
    ? todayProgressionRoutine
    : todayRoutine;
  const stats = getRoutineStats(displayRoutine);

  return (
    <div className="min-h-screen bg-background flex">
      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* TOPBAR */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-body text-[13px] text-text-low capitalize">
              {today}
            </p>
            <h1 className="font-heading font-extrabold text-[28px] text-text-high leading-tight">
              Hola, <span className="text-accent1">{name}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="bg-accent1 h-10 w-10 rounded-xl flex items-center justify-center font-heading font-extrabold text-[20px] text-text-high hover:opacity-80"
            >
              {name.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-5 gap-6">
          {/* COLUMNA IZQUIERDA — 3/5 */}
          <div className="col-span-3 flex flex-col gap-6">
            {/* RUTINA DE HOY */}
            <div>
              <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">
                {todayProgressionRoutine
                  ? "Rutina de progresión hoy"
                  : "Rutina de hoy"}
              </p>
              {loading ? (
                <Card>
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent1"></div>
                  </div>
                </Card>
              ) : displayRoutine ? (
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-heading font-extrabold text-[24px] text-text-high">
                        {displayRoutine.name}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-surf px-3 py-1 rounded-full border border-text-low font-body text-[12px] text-text-low">
                          {stats.exerciseCount} ejercicios
                        </span>
                        {displayRoutine.target_muscle_groups && (
                          <span className="bg-surf px-3 py-1 rounded-full border border-text-low font-body text-[12px] text-text-low">
                            {parseMuscles(displayRoutine.target_muscle_groups)}
                          </span>
                        )}
                      </div>
                    </div>
                    {routineCompletedToday && (
                      <span className="bg-accent3/10 border border-accent3 text-accent3 px-3 py-1 rounded-full font-subheading font-bold text-[12px]">
                        ✓ Completada
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { value: stats.duration, label: "Minutos" },
                      { value: stats.exerciseCount, label: "Ejercicios" },
                      { value: stats.totalSets, label: "Series" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-surf rounded-xl p-3 text-center border border-text-low/20"
                      >
                        <p className="font-heading font-extrabold text-[24px] text-text-high">
                          {stat.value}
                        </p>
                        <p className="font-subheading font-bold text-[11px] text-text-low uppercase">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outlined"
                    text={
                      routineCompletedToday
                        ? "👁️ Ver entrenamiento"
                        : "⚡ Empezar entrenamiento"
                    }
                    bgColor={routineCompletedToday ? "bg-green" : "bg-accent1"}
                    textColor="text-text-high"
                    borderColor={
                      routineCompletedToday ? "border-green" : "border-accent1"
                    }
                    w="w-full"
                    onClick={handleStartRoutine}
                  />
                </Card>
              ) : (
                <Card>
                  <div className="flex items-center gap-6 py-4">
                    <div className="w-16 h-16 rounded-full bg-accent2/10 border border-accent2/30 flex items-center justify-center shrink-0">
                      <span className="text-[32px]">
                        <BedDouble size={30} className="text-background" />
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-extrabold text-[20px] text-text-high mb-1">
                        Día de descanso
                      </h3>
                      <p className="text-text-low text-[14px] font-light mb-3">
                        No tienes rutinas programadas para hoy.
                      </p>
                      <Button
                        variant="outlined"
                        text="Ver mis rutinas"
                        bgColor="bg-surf"
                        textColor="text-text-high"
                        borderColor="border-text-low"
                        w="w-48"
                        onClick={handleStartRoutine}
                      />
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* PROGRESION */}
            {activeProgression && isTodayInProgressionRange && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">
                    Semana {currentProgressionWeek + 1} ·{" "}
                    {activeProgression.name}
                  </p>
                  <button
                    onClick={() => navigate("/progression")}
                    className="font-subheading font-bold text-primary text-[13px] hover:opacity-80"
                  >
                    Ver todo{" "}
                    <ChevronRight className="inline-block mb-1" size={16} />
                  </button>
                </div>
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">
                      {activeProgression.name}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePreviousProgressionWeek}
                        disabled={currentProgressionWeek === 0}
                        className={`h-7 w-7 rounded-lg border flex items-center justify-center text-[14px] ${currentProgressionWeek === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-surface"} bg-surf border-text-low text-text-high`}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={handleNextProgressionWeek}
                        disabled={
                          currentProgressionWeek >=
                          activeProgression.duration_weeks - 1
                        }
                        className={`h-7 w-7 rounded-lg border flex items-center justify-center text-[14px] ${currentProgressionWeek >= activeProgression.duration_weeks - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-surface"} bg-surf border-text-low text-text-high`}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {progressionWeekDays.map((day, index) => {
                      const assignment = progressionAssignments[day.fullDate];
                      const isRest = assignment?.type === "rest";
                      const routineId = assignment?.routineId;
                      const color = routineId
                        ? getRoutineColor(routineId)
                        : null;
                      const isCompleted = progressionCompletedDays.has(
                        day.fullDate,
                      );
                      return (
                        <button
                          key={index}
                          onClick={() => handleProgressionDayClick(day)}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <p className="font-subheading font-bold text-[12px] text-text-low">
                            {day.dayName}
                          </p>
                          <div
                            className={`h-10 w-10 rounded-xl font-heading font-bold text-[15px] flex items-center justify-center transition-all ${day.isToday ? "border-2 border-accent1 bg-accent1/10 text-accent1" : selectedProgressionDay?.fullDate === day.fullDate ? "border-2 border-primary bg-primary/10 text-primary" : isCompleted ? "border-2 border-accent3 bg-accent3/10 text-accent3" : "border border-text-low bg-surf text-text-high"}`}
                            style={
                              color &&
                              !day.isToday &&
                              !isCompleted &&
                              selectedProgressionDay?.fullDate !== day.fullDate
                                ? {
                                    borderColor: color,
                                    backgroundColor: `${color}15`,
                                  }
                                : {}
                            }
                          >
                            {day.dayNum}
                          </div>
                          <p className="text-[12px]">
                            {isCompleted ? (
                              <CircleCheck size={20} className="text-green" />
                            ) : isRest ? (
                              <Moon size={16} className="text-text-low" />
                            ) : routineId ? (
                              <Dumbbell size={16} className="text-primary" />
                            ) : (
                              "·"
                            )}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  {selectedProgressionDay && (
                    <div className="mt-4 pt-4 border-t border-text-low/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-9 w-9 rounded-xl flex items-center justify-center text-[16px]"
                            style={{
                              backgroundColor: `${selectedProgressionDay.color}20`,
                              border: `1px solid ${selectedProgressionDay.color}`,
                            }}
                          >
                            <Dumbbell
                              size={16}
                              style={{ color: selectedProgressionDay.color }}
                            />
                          </div>
                          <div>
                            <p className="font-body text-[11px] text-text-low">
                              {selectedProgressionDay.dayName}{" "}
                              {selectedProgressionDay.dayNum}
                            </p>
                            <p className="font-heading font-bold text-[15px] text-text-high">
                              {selectedProgressionDay.routine.name}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedProgressionDay(null)}
                          className="h-7 w-7 rounded-lg border border-text-low flex items-center justify-center text-text-low text-[12px]"
                        >
                          ✕
                        </button>
                      </div>
                      {progressionCompletedDays.has(
                        selectedProgressionDay.fullDate,
                      ) ? (
                        <div className="bg-accent3/10 border border-accent3 rounded-xl p-3 flex items-center gap-3">
                          <span className="text-[24px]">✅</span>
                          <p className="font-heading font-bold text-[14px] text-accent3">
                            Rutina completada
                          </p>
                        </div>
                      ) : selectedProgressionDay.isToday ? (
                        <Button
                          variant="outlined"
                          text="⚡ Iniciar"
                          bgColor="bg-accent1"
                          textColor="text-text-high"
                          borderColor="border-accent1"
                          w="w-full"
                          onClick={handleStartProgressionRoutine}
                        />
                      ) : (
                        <div className="bg-surf/50 border border-text-low rounded-xl p-3 flex items-center gap-3">
                          <span className="text-[20px]"><Lock size={20} className="text-text-low" /></span>
                          <p className="font-body text-[13px] text-text-low">
                            Solo disponible el día indicado
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* HISTORIAL SEMANAL */}
            <div>
              <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">
                Historial semanal
              </p>
              <Card>
                <p className="font-subheading font-bold text-text-low text-[13px] mb-4">
                  {new Date()
                    .toLocaleDateString("es-ES", {
                      month: "long",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </p>
                <div className="flex items-center justify-between">
                  {weekDays.map((day, index) => {
                    const isCompleted = isDateCompleted(day.fullDate);
                    return (
                      <button
                        key={index}
                        onClick={() => handleDayClick(day)}
                        disabled={!isCompleted}
                        className={`flex flex-col items-center gap-1.5 ${isCompleted ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <p className="font-subheading font-bold text-text-low text-[13px]">
                          {day.dayStr}
                        </p>
                        <div
                          className={`h-10 w-10 rounded-xl font-heading font-bold text-text-high text-[15px] flex items-center justify-center transition-all ${isCompleted ? "bg-accent1" : day.isToday ? "border-2 border-accent1 text-accent1" : "text-text-low"}`}
                        >
                          {day.dayNum}
                        </div>
                        <p className="text-[14px] text-text-low">
                          {isCompleted ? (
                            <CheckCircle2 size={14} className="text-accent1" />
                          ) : (
                            <Minus size={14} className="text-text-low" />
                          )}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {selectedDay && selectedSession && (
                  <div className="mt-4 pt-4 border-t border-text-low/20">
                    <p className="font-heading font-bold text-text-high text-[16px] mb-2">
                      {selectedSession.routine_name}
                    </p>
                    <div className="flex justify-between text-[13px] text-text-low">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-primary" />{" "}
                        {selectedSession.duration_minutes || 0} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Dumbbell size={14} className="text-primary" />
                        {selectedSession.exercises_completed || 0} ejercicios
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers size={14} className="text-primary" />
                        {selectedSession.total_sets || 0} series
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* COLUMNA DERECHA — 2/5 */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* PESO DE HOY */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">
                  Peso de hoy
                </p>
                <button
                  onClick={() => navigate("/progress")}
                  className="font-subheading font-bold text-primary text-[12px] hover:opacity-80"
                >
                  Historial{" "}
                  <ChevronRight className="inline-block mb-1" size={16} />
                </button>
              </div>
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-subheading font-bold text-text-low text-[12px] uppercase">
                    Peso del día
                  </p>
                  <button
                    onClick={() => setShowWeightInput(!showWeightInput)}
                    className="bg-accent1 h-7 w-7 rounded-lg flex items-center justify-center text-text-high text-[14px] font-bold hover:opacity-80"
                  >
                    {todayWeight ? <Pencil size={18} /> : <Plus size={18} />}
                  </button>
                </div>
                {showWeightInput && (
                  <div className="mb-3 flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="75,5"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="flex-1 min-w-0 bg-background border border-text-low rounded-lg px-3 py-2 text-text-high text-[15px] font-heading font-semibold outline-none focus:border-accent1"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveWeight}
                      className="shrink-0 bg-accent1 text-text-high px-3 py-2 rounded-lg font-heading font-bold text-[13px] hover:opacity-80"
                    >
                      OK
                    </button>
                  </div>
                )}
                {todayWeight ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="font-heading font-extrabold text-[48px] text-text-high leading-none">
                          {formatWeight(todayWeight.weight).integer}
                        </span>
                        <span className="font-heading font-bold text-[24px] text-text-low leading-none">
                          ,{formatWeight(todayWeight.weight).decimal}
                        </span>
                        <span className="font-heading font-bold text-[18px] text-text-low ml-1">
                          kg
                        </span>
                      </div>
                      {monthlyChange !== null && (
                        <div className="bg-surf rounded-xl py-2 px-3 border border-accent2">
                          <p className="font-heading font-extrabold text-accent2 text-[18px] leading-tight">
                            {monthlyChange > 0 ? "+" : ""}
                            {monthlyChange.toFixed(1)}
                          </p>
                          <p className="font-subheading font-semibold text-text-low text-[10px]">
                            kg/mes
                          </p>
                        </div>
                      )}
                    </div>
                    {weeklyChange !== null && (
                      <span className="inline-flex items-center bg-surf rounded-xl py-1.5 px-3 border border-accent2 font-subheading font-semibold text-[13px] text-accent2 mt-2">
                        <BarChart2 size={15} className="text-primary" />{" "}
                        {weeklyChange > 0 ? "+" : ""}
                        {weeklyChange.toFixed(1)} kg esta semana
                      </span>
                    )}
                    {renderWeightChart()}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <span className="text-[32px] mb-3">⚖️</span>
                    <p className="text-text-low text-[13px] mb-3">
                      No has registrado tu peso hoy
                    </p>
                    <button
                      onClick={() => setShowWeightInput(true)}
                      className="bg-accent1 text-text-high px-4 py-2 rounded-xl font-heading font-bold text-[13px] hover:opacity-80"
                    >
                      Registrar peso
                    </button>
                  </div>
                )}
              </Card>
            </div>

            {/* PRE / POST ENTRENO */}
            <div>
              <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">
                ¿Todo marcado hoy?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePreWorkoutToggle}
                  className="w-full cursor-pointer"
                >
                  <Card>
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-xl border flex justify-center items-center text-[18px] transition-colors shrink-0 ${preWorkout ? "bg-accent1 border-accent1" : "bg-surf border-text-low"}`}
                      >
                        {preWorkout ? (
                          "✓"
                        ) : (
                          <Dumbbell size={14} className="text-text-low" />
                        )}
                      </div>
                      <div className="text-left">
                        <p
                          className={`font-subheading font-bold text-[15px] transition-colors ${preWorkout ? "text-accent1" : "text-text-high"}`}
                        >
                          Pre-entreno
                        </p>
                        <p className="font-body text-[12px] text-text-low">
                          Carbohidratos
                        </p>
                      </div>
                    </div>
                  </Card>
                </button>
                <button
                  onClick={handlePostWorkoutToggle}
                  className="w-full cursor-pointer"
                >
                  <Card>
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-xl border flex justify-center items-center text-[18px] transition-colors shrink-0 ${postWorkout ? "bg-accent1 border-accent1" : "bg-surf border-text-low"}`}
                      >
                        {postWorkout ? (
                          "✓"
                        ) : (
                          <Zap size={14} className="text-orange" />
                        )}
                      </div>
                      <div className="text-left">
                        <p
                          className={`font-subheading font-bold text-[15px] transition-colors ${postWorkout ? "text-accent1" : "text-text-high"}`}
                        >
                          Post-entreno
                        </p>
                        <p className="font-body text-[12px] text-text-low">
                          Proteína
                        </p>
                      </div>
                    </div>
                  </Card>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardDesktop;
