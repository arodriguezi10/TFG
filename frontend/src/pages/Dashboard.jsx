import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

/*importaciones para la lógica */
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { useContext, useState, useEffect } from "react";

const Dashboard = () => {
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

  // Estados para peso
  const [todayWeight, setTodayWeight] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [weeklyChange, setWeeklyChange] = useState(null);
  const [monthlyChange, setMonthlyChange] = useState(null);
  const [last7Days, setLast7Days] = useState([]);

  // Estados para calendario
  const [weekDays, setWeekDays] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    loadData();
    loadDailyChecks();
    loadWeightData();
    loadWeekData();
  }, []);

  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetDailyChecks();
        loadWeightData();
        loadWeekData();
        loadData(); // Recargar rutina del día
      }
    }, 60000);

    return () => clearInterval(checkMidnight);
  }, []);

  const loadWeekData = async () => {
    try {
      // Generar array de los 7 días de la semana actual (Lunes a Domingo)
      const currentWeek = getCurrentWeekDays();
      setWeekDays(currentWeek);

      // Obtener sesiones completadas de esta semana
      const startOfWeek = currentWeek[0].fullDate;
      const endOfWeek = currentWeek[6].fullDate;

      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('session_date', startOfWeek)
        .lte('session_date', endOfWeek)
        .order('session_date', { ascending: true });

      setCompletedSessions(sessions || []);
    } catch (error) {
      console.error('Error cargando datos de la semana:', error);
    }
  };

  const getCurrentWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    // Ajustar para que la semana empiece en Lunes
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + i);
      
      const dayStr = date.toLocaleDateString('es-ES', { weekday: 'short' }).charAt(0).toUpperCase();
      const dayNum = date.getDate();
      const fullDate = date.toISOString().split('T')[0];
      const isToday = fullDate === new Date().toISOString().split('T')[0];
      
      weekDays.push({
        dayStr,
        dayNum,
        fullDate,
        isToday
      });
    }
    
    return weekDays;
  };

  const isDateCompleted = (dateStr) => {
    return completedSessions.some(session => session.session_date === dateStr);
  };

  const getSessionForDate = (dateStr) => {
    return completedSessions.find(session => session.session_date === dateStr);
  };

  const handleDayClick = (day) => {
    // Solo permitir click en días completados
    const session = getSessionForDate(day.fullDate);
    
    if (session) {
      // Día completado - mostrar resumen
      setSelectedDay(day);
      setSelectedSession(session);
    } else {
      // Día sin completar - no hacer nada
      setSelectedDay(null);
      setSelectedSession(null);
    }
  };

  const getTodayDayName = () => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[new Date().getDay()];
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: userData } = await supabase
        .from("users")
        .select("first_name")
        .eq("id", user.id)
        .single();

      setName(userData?.first_name ?? "");

      // Obtener todas las rutinas del usuario
      const { data: routines, error } = await supabase
        .from("routines")
        .select(`
          *,
          routine_exercises (
            id,
            target_sets
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al consultar rutinas:", error);
        setTodayRoutine(null);
        return;
      }

      // Buscar la rutina que corresponde al día de hoy
      const todayDayName = getTodayDayName();
      
      const routineForToday = routines?.find(routine => {
        try {
          const assignedDays = JSON.parse(routine.assigned_days || '[]');
          return assignedDays.includes(todayDayName);
        } catch {
          return false;
        }
      });

      setTodayRoutine(routineForToday || null);

    } catch (error) {
      console.error("Error:", error);
      setTodayRoutine(null);
    } finally {
      setLoading(false);
    }
  };

  const loadWeightData = async () => {
    try {
      const todayDate = new Date().toISOString().split('T')[0];

      const { data: todayData } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', todayDate)
        .single();

      setTodayWeight(todayData);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoDate = thirtyDaysAgo.toISOString().split('T')[0];

      const { data: recentWeights } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('log_date', thirtyDaysAgoDate)
        .order('log_date', { ascending: false });

      if (recentWeights && recentWeights.length > 0) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoDate = sevenDaysAgo.toISOString().split('T')[0];

        const weightSevenDaysAgo = recentWeights.find(
          w => w.log_date <= sevenDaysAgoDate
        );

        if (todayData && weightSevenDaysAgo) {
          const change = todayData.weight - weightSevenDaysAgo.weight;
          setWeeklyChange(change);
        }

        const weightThirtyDaysAgo = recentWeights[recentWeights.length - 1];
        if (todayData && weightThirtyDaysAgo) {
          const change = todayData.weight - weightThirtyDaysAgo.weight;
          setMonthlyChange(change);
        }
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const sevenDaysAgoDate = sevenDaysAgo.toISOString().split('T')[0];

      const { data: last7DaysData } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('log_date', sevenDaysAgoDate)
        .order('log_date', { ascending: true });

      const last7DaysArray = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const weightLog = last7DaysData?.find(w => w.log_date === dateStr);
        last7DaysArray.push({
          date: dateStr,
          weight: weightLog?.weight || null,
          dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }).charAt(0).toUpperCase()
        });
      }

      setLast7Days(last7DaysArray);

    } catch (error) {
      console.error('Error cargando datos de peso:', error);
    }
  };

  const handleSaveWeight = async () => {
    if (!weightInput || isNaN(weightInput)) {
      alert('Por favor ingresa un peso válido');
      return;
    }

    const weight = parseFloat(weightInput);
    if (weight <= 0 || weight > 500) {
      alert('El peso debe estar entre 0 y 500 kg');
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];

    try {
      const { data: existing } = await supabase
        .from('weight_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('log_date', todayDate)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('weight_logs')
          .update({ 
            weight: weight,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('weight_logs')
          .insert({
            user_id: user.id,
            weight: weight,
            log_date: todayDate
          });

        if (error) throw error;
      }

      setShowWeightInput(false);
      setWeightInput("");
      await loadWeightData();
      alert('✅ Peso guardado correctamente');
    } catch (error) {
      console.error('Error guardando peso:', error);
      alert('❌ Error al guardar el peso');
    }
  };

  const loadDailyChecks = () => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('dailyChecksDate');
    
    if (savedDate === today) {
      const preWorkoutStatus = localStorage.getItem('preWorkout') === 'true';
      const postWorkoutStatus = localStorage.getItem('postWorkout') === 'true';
      setPreWorkout(preWorkoutStatus);
      setPostWorkout(postWorkoutStatus);
    } else {
      resetDailyChecks();
    }
  };

  const resetDailyChecks = () => {
    setPreWorkout(false);
    setPostWorkout(false);
    const today = new Date().toDateString();
    localStorage.setItem('dailyChecksDate', today);
    localStorage.setItem('preWorkout', 'false');
    localStorage.setItem('postWorkout', 'false');
  };

  const handlePreWorkoutToggle = () => {
    if (window.confirm('¿Confirmas que has completado tu pre-entreno?')) {
      const newStatus = !preWorkout;
      setPreWorkout(newStatus);
      localStorage.setItem('preWorkout', String(newStatus));
    }
  };

  const handlePostWorkoutToggle = () => {
    if (window.confirm('¿Confirmas que has completado tu post-entreno?')) {
      const newStatus = !postWorkout;
      setPostWorkout(newStatus);
      localStorage.setItem('postWorkout', String(newStatus));
    }
  };

  const handleStartRoutine = () => {
    if (todayRoutine) {
      // Navegar a la pantalla de ejecución de rutina (próximamente)
      navigate(`/executeRoutine/${todayRoutine.id}`);
    } else {
      navigate("/routines1");
    }
  };

  const handleNavigateToProfile = () => {
    navigate("/profile");
  };

  const parseMuscles = (musclesJson) => {
    try {
      const muscles = JSON.parse(musclesJson);
      if (Array.isArray(muscles) && muscles.length > 0) {
        return muscles.slice(0, 3).join(" · ");
      }
      return "Sin especificar";
    } catch {
      return "Sin especificar";
    }
  };

  const getRoutineStats = () => {
    if (!todayRoutine) return { exerciseCount: 0, totalSets: 0, duration: 0 };

    const exerciseCount = todayRoutine.routine_exercises?.length || 0;
    const totalSets = todayRoutine.routine_exercises?.reduce((sum, ex) => sum + (ex.target_sets || 0), 0) || 0;
    const duration = todayRoutine.estimated_duration_min || 0;

    return { exerciseCount, totalSets, duration };
  };

  const formatWeight = (weight) => {
    const integerPart = Math.floor(weight);
    const decimalPart = ((weight % 1) * 100).toFixed(0).padStart(2, '0');
    return { integer: integerPart, decimal: decimalPart };
  };

  const renderWeightChart = () => {
    if (last7Days.length === 0) return null;

    const validWeights = last7Days.filter(d => d.weight !== null).map(d => d.weight);
    if (validWeights.length === 0) {
      return (
        <div className="w-full h-16.25 bg-surf rounded-xl mt-2.5 flex items-center justify-center">
          <p className="text-text-low text-[12px]">Sin datos suficientes para gráfico</p>
        </div>
      );
    }

    const minWeight = Math.min(...validWeights);
    const maxWeight = Math.max(...validWeights);
    const range = maxWeight - minWeight || 1;

    return (
      <div className="w-full h-16.25 bg-surf rounded-xl mt-2.5 p-3 flex items-end justify-between gap-1">
        {last7Days.map((day, index) => {
          const height = day.weight 
            ? ((day.weight - minWeight) / range) * 100 
            : 0;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 gap-1">
              <div className="w-full flex items-end justify-center" style={{ height: '40px' }}>
                {day.weight ? (
                  <div 
                    className="w-full bg-accent1 rounded-t-sm transition-all"
                    style={{ 
                      height: `${Math.max(height, 10)}%`,
                      minHeight: '4px'
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

  const stats = getRoutineStats();

  return (
    <div className="min-h-screen bg-background flex flex-col mb-2.5">
      <section className="w-full px-4">
        <p className="font-body text-[12px] text-text-low">{today}</p>

        <div className="flex justify-between items-center">
          <h1 className="font-heading font-extrabold text-[28px] text-text-high flex flex-col leading-tight mt-1.25">
            Hola,
            <span className="text-accent1">{name}</span>
          </h1>

          <button
            onClick={handleNavigateToProfile}
            className="bg-accent1 h-13.75 w-13.75 rounded-[12px] flex items-center justify-center font-heading font-extrabold text-[28px] text-text-high cursor-pointer hover:opacity-80 transition-opacity"
          >
            F
          </button>
        </div>
      </section>

      <section className="mt-4 flex flex-col px-4 items-center justify-center leading-tight">
        {loading ? (
          <Card>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent1"></div>
            </div>
          </Card>
        ) : todayRoutine ? (
          <Card>
            <p className="font-subheading font-bold text-text-low text-[16px]">
              · RUTINA DE HOY
            </p>

            <div className="mt-4">
              <p className="font-heading font-extrabold text-text-high text-[28px]">
                {todayRoutine.name}
              </p>

              <div className="flex space-x-2">
                <span className="bg-surf h-7.5 py-0.5 px-2.5 rounded-[16px] border border-text-low text-[14px] text-text-low font-subheading flex items-center justify-center">
                  {stats.exerciseCount} ejercicio{stats.exerciseCount !== 1 ? 's' : ''}
                </span>
                <span className="bg-surf h-7.5 py-0.5 px-2.5 rounded-[16px] border border-text-low text-[14px] text-text-low font-subheading flex items-center justify-center">
                  {parseMuscles(todayRoutine.target_muscle_groups)}
                </span>
              </div>
            </div>

            <div className="mt-4 w-[95%] flex items-center justify-between">
              <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
                {stats.duration}
                <span className="font-subheading font-semibold text-[14px] text-text-low">
                  MINUTOS
                </span>
              </p>

              <div className="w-px h-10 bg-text-low"></div>
              <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
                {stats.exerciseCount}
                <span className="font-subheading font-semibold text-[14px] text-text-low">
                  EJERCICIOS
                </span>
              </p>

              <div className="w-px h-10 bg-text-low"></div>
              <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
                {stats.totalSets}
                <span className="font-subheading font-semibold text-[14px] text-text-low">
                  SERIES
                </span>
              </p>
            </div>

            <div className="mt-4 flex items-center">
              <Button
                variant="outlined"
                text="& Empezar entrenamiento"
                bgColor={"bg-accent1"}
                textColor={"text-text-high"}
                borderColor={"border-accent1"}
                w="w-[100%]"
                onClick={handleStartRoutine}
              />
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-accent2/20 to-accent3/20 border border-accent2/30 flex items-center justify-center">
                <span className="text-[40px]">😴</span>
              </div>

              <h3 className="font-heading font-extrabold text-xl text-text-high mb-2 tracking-tight">
                Día de descanso
              </h3>

              <p className="text-text-low text-sm font-light leading-relaxed mb-6 max-w-xs">
                No tienes rutinas programadas para hoy. ¡Aprovecha para recuperar!
              </p>

              <Button
                variant="outlined"
                text="Ver mis rutinas"
                bgColor="bg-surf"
                textColor="text-text-high"
                borderColor="border-text-low"
                w="w-full"
                onClick={handleStartRoutine}
              />
            </div>
          </Card>
        )}
      </section>

      <section className="mt-4 flex flex-col px-4 gap-3">
        <p className="font-subheading font-bold text-text-high text-[16px]">
          ¿TODO MARCADO HOY?
        </p>

        <div className="flex gap-3.75">
          <button
            onClick={handlePreWorkoutToggle}
            className="flex-1 cursor-pointer"
          >
            <Card>
              <div className={`h-7.5 w-7.5 rounded-[8px] border flex justify-center items-center transition-colors ${
                preWorkout 
                  ? 'bg-accent1 border-accent1 text-text-high' 
                  : 'bg-surf border-white/27 text-text-low'
              }`}>
                {preWorkout ? '✓' : '&'}
              </div>
              <p className={`font-subheading font-semibold text-[14px] text-left mt-1.25 transition-colors ${
                preWorkout ? 'text-accent1' : 'text-text-high'
              }`}>
                Pre-entreno
              </p>
              <p className="font-subheading font-semibold text-text-low text-left text-[14px] mt-1.25">
                Carbohidratos
              </p>
            </Card>
          </button>

          <button
            onClick={handlePostWorkoutToggle}
            className="flex-1 cursor-pointer"
          >
            <Card>
              <div className={`h-7.5 w-7.5 rounded-[8px] border flex justify-center items-center transition-colors ${
                postWorkout 
                  ? 'bg-accent1 border-accent1 text-text-high' 
                  : 'bg-surf border-white/27 text-text-low'
              }`}>
                {postWorkout ? '✓' : '&'}
              </div>
              <p className={`font-subheading font-semibold text-[14px] text-left mt-1.25 transition-colors ${
                postWorkout ? 'text-accent1' : 'text-text-high'
              }`}>
                Post-entreno
              </p>
              <p className="font-subheading font-semibold text-text-low text-left text-[14px] mt-1.25">
                Proteína
              </p>
            </Card>
          </button>
        </div>
      </section>

      <section className="mt-4 flex flex-col px-4 gap-3 items-center leading-tight">
        <div className="w-full flex justify-between">
          <p className="font-subheading font-bold text-text-high text-[16px]">
            PESO DE HOY
          </p>
          <button
            onClick={() => navigate('#')}
            className="font-subheading font-bold text-primary text-[16px] cursor-pointer hover:opacity-80 transition-opacity"
          >
            Historial &
          </button>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-3">
            <p className="font-subheading font-bold text-text-low text-[16px]">
              PESO DEL DÍA HOY
            </p>
            <button
              onClick={() => setShowWeightInput(!showWeightInput)}
              className="bg-accent1 h-8 w-8 rounded-lg flex items-center justify-center text-text-high text-[18px] font-bold hover:opacity-80 transition-opacity shadow-sm"
            >
              {todayWeight ? '✏️' : '+'}
            </button>
          </div>

          {showWeightInput && (
            <div className="mb-4 p-3 bg-surf rounded-xl border border-text-low">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  step="0.1"
                  placeholder="75,5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="flex-1 min-w-0 bg-background border border-text-low rounded-lg px-3 py-2.5 text-text-high text-[16px] font-heading font-semibold outline-none focus:border-accent1 transition-colors"
                  autoFocus
                />
                <button
                  onClick={handleSaveWeight}
                  className="shrink-0 bg-accent1 text-text-high px-4 py-2.5 rounded-lg font-heading font-bold text-[14px] hover:opacity-80 transition-opacity shadow-sm"
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {todayWeight ? (
            <>
              <div className="flex mt-2 items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <div className="flex items-baseline">
                    <span className="font-heading font-extrabold text-[64px] text-text-high leading-none tracking-tight">
                      {formatWeight(todayWeight.weight).integer}
                    </span>
                    <span className="font-heading font-bold text-[32px] text-text-low leading-none">
                      ,{formatWeight(todayWeight.weight).decimal}
                    </span>
                  </div>
                  <span className="font-heading font-bold text-[24px] text-text-low mb-1">
                    kg
                  </span>
                </div>

                {monthlyChange !== null && (
                  <div className="bg-surf rounded-xl py-2 px-3.5 border border-accent2 shadow-sm">
                    <p className="font-heading font-extrabold text-accent2 text-[20px] leading-tight">
                      {monthlyChange > 0 ? '+' : ''}{monthlyChange.toFixed(1)}
                    </p>
                    <p className="font-subheading font-semibold text-text-low text-[11px] leading-tight mt-0.5">
                      kg/mes
                    </p>
                  </div>
                )}
              </div>

              {weeklyChange !== null && (
                <div className="mt-3">
                  <span className="inline-flex items-center bg-surf rounded-xl py-1.5 px-3.5 border border-accent2 font-subheading font-semibold text-[14px] text-accent2 shadow-sm">
                    <span className="mr-1.5">📊</span>
                    {weeklyChange > 0 ? '+' : ''}{weeklyChange.toFixed(1)} kg esta semana
                  </span>
                </div>
              )}

              {renderWeightChart()}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-accent1/10 border border-accent1/30 flex items-center justify-center">
                <span className="text-[32px]">⚖️</span>
              </div>
              <p className="text-text-low text-[14px] mb-4 font-subheading">
                No has registrado tu peso hoy
              </p>
              <button
                onClick={() => setShowWeightInput(true)}
                className="bg-accent1 text-text-high px-6 py-2.5 rounded-xl font-heading font-bold text-[14px] hover:opacity-80 transition-opacity shadow-md"
              >
                Registrar peso
              </button>
            </div>
          )}
        </Card>
      </section>

      {/* CALENDARIO SEMANAL */}
      <section className="mt-4 flex flex-col px-4 gap-3 items-center leading-tight">
        <div className="w-full flex justify-between">
          <p className="font-subheading font-bold text-text-high text-[16px]">
            ESTA SEMANA
          </p>
          <button
            onClick={() => navigate('#')}
            className="font-subheading font-bold text-primary text-[16px] cursor-pointer hover:opacity-80 transition-opacity"
          >
            Ver todo &
          </button>
        </div>

        <Card>
          <p className="font-subheading font-bold text-text-low text-[16px] mb-4">
            {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
          </p>

          <div className="flex items-center justify-between">
            {weekDays.map((day, index) => {
              const isCompleted = isDateCompleted(day.fullDate);
              
              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`flex flex-col items-center gap-1.75 transition-all ${
                    isCompleted ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  disabled={!isCompleted}
                >
                  <p className="font-subheading font-bold text-text-low text-[16px]">
                    {day.dayStr}
                  </p>
                  
                  <div className={`h-5.5 min-w-[33px] px-1.5 rounded-lg font-heading font-bold text-text-high text-[16px] flex items-center justify-center transition-all ${
                    isCompleted 
                      ? 'bg-accent1' 
                      : day.isToday 
                        ? 'bg-transparent border-2 border-accent1 text-accent1' 
                        : 'bg-transparent text-text-low'
                  }`}>
                    {day.dayNum}
                  </div>
                  
                  <p className="text-[14px]">
                    {isCompleted ? '✓' : '·'}
                  </p>
                </button>
              );
            })}
          </div>

          {/* RESUMEN DE DÍA SELECCIONADO */}
          {selectedDay && selectedSession && (
            <div className="mt-4 pt-4 border-t border-text-low">
              <p className="font-heading font-bold text-text-high text-[18px] mb-2">
                {selectedSession.routine_name}
              </p>
              <div className="flex gap-3 text-[14px] text-text-low">
                <span>⏱️ {selectedSession.duration_minutes || 0} min</span>
                <span>💪 {selectedSession.exercises_completed || 0} ejercicios</span>
                <span>🔢 {selectedSession.total_sets || 0} series</span>
              </div>
              {selectedSession.notes && (
                <p className="mt-2 text-[13px] text-text-low italic">
                  "{selectedSession.notes}"
                </p>
              )}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;