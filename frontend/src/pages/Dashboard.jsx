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
  const [nextRoutine, setNextRoutine] = useState(null);
  const [preWorkout, setPreWorkout] = useState(false);
  const [postWorkout, setPostWorkout] = useState(false);

  useEffect(() => {
    loadData();
    loadDailyChecks();
  }, []);

  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetDailyChecks();
      }
    }, 60000);

    return () => clearInterval(checkMidnight);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: userData } = await supabase
        .from("users")
        .select("first_name")
        .eq("id", user.id)
        .single();

      setName(userData?.first_name ?? "");

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
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error al consultar rutinas:", error);
        setNextRoutine(null);
      } else if (routines && routines.length > 0) {
        setNextRoutine(routines[0]);
      } else {
        setNextRoutine(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setNextRoutine(null);
    } finally {
      setLoading(false);
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
    navigate("/routines1");
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
    if (!nextRoutine) return { exerciseCount: 0, totalSets: 0, duration: 0 };

    const exerciseCount = nextRoutine.routine_exercises?.length || 0;
    const totalSets = nextRoutine.routine_exercises?.reduce((sum, ex) => sum + (ex.target_sets || 0), 0) || 0;
    const duration = nextRoutine.estimated_duration_min || 0;

    return { exerciseCount, totalSets, duration };
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
        ) : nextRoutine ? (
          <Card>
            <p className="font-subheading font-bold text-text-low text-[16px]">
              · SIGUIENTE EN TU CICLO
            </p>

            <div className="mt-4">
              <p className="font-heading font-extrabold text-text-high text-[28px]">
                {nextRoutine.name}
              </p>

              <div className="flex space-x-2">
                <span className="bg-surf h-7.5 py-0.5 px-2.5 rounded-[16px] border border-text-low text-[14px] text-text-low font-subheading flex items-center justify-center">
                  {stats.exerciseCount} ejercicio{stats.exerciseCount !== 1 ? 's' : ''}
                </span>
                <span className="bg-surf h-7.5 py-0.5 px-2.5 rounded-[16px] border border-text-low text-[14px] text-text-low font-subheading flex items-center justify-center">
                  {parseMuscles(nextRoutine.target_muscle_groups)}
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
              />
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-accent1/20 to-accent2/20 border border-accent1/30 flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-accent1"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>

              <h3 className="font-heading font-extrabold text-xl text-text-high mb-2 tracking-tight">
                Sin rutinas activas
              </h3>

              <p className="text-text-low text-sm font-light leading-relaxed mb-6 max-w-xs">
                Crea tu primera rutina para empezar a entrenar y alcanzar tus
                objetivos.
              </p>

              <Button
                variant="outlined"
                text="Crear mi primera rutina"
                bgColor="bg-accent1"
                textColor="text-text-high"
                borderColor="border-accent1"
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
          <p className="font-subheading font-bold text-text-low text-[16px]">
            PESO DEL DÍA HOY
          </p>

          <div className="flex mt-2.5 items-center justify-between">
            <div className="flex gap-1.25">
              <div className="w-38.25 h-15 rounded-[16px] border border-text-high flex items-center justify-center">
                <p className="font-heading font-bold text-text-high text-[50px]">
                  75
                  <span className="font-heading font-bold text-text-low text-[50px]">
                    ,36
                  </span>
                </p>
              </div>

              <p className="font-heading font-bold text-text-low  text-[22px]">
                kg
              </p>
            </div>

            <div className="bg-surf rounded-[16px] py-1.25 px-3 border border-accent2">
              <p className="font-heading font-bold text-accent2 text-[22px]">
                -1,8
              </p>
              <p className="font-subheading font-semibold text-text-low text-[12px]">
                kg/mes
              </p>
            </div>
          </div>

          <div className="mt-1.25">
            <span className="bg-surf rounded-[16px] py-0.5 px-3 border border-accent2 font-subheading font-semibold text-[16px] text-accent2">
              & 0,4 kg esta semana
            </span>
          </div>

          <div className="w-full h-16.25 bg-surf rounded-x1 mt-2.5 flex items-center justify-center">
            <p className="text-text-low text-[12px]">Gráfica de peso</p>
          </div>
        </Card>
      </section>

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
          <p className="font-subheading font-bold text-text-low text-[16px]">
            ENERO 2026
          </p>

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col items-center gap-1.75">
              <p className="font-subheading font-bold text-text-low text-[16px]">
                L
              </p>
              <p className="font-heading font-bold text-text-low text-[16px]">
                &
              </p>
              <p>·</p>
            </div>

            <div className="flex flex-col items-center gap-1.75">
              <p className="font-subheading font-bold text-text-low text-[16px]">
                M
              </p>
              <p className="font-heading font-bold text-text-low text-[16px]">
                10
              </p>
              <p>·</p>
            </div>

            <div className="flex flex-col items-center gap-1.75">
              <p className="font-subheading font-bold text-text-low text-[16px]">
                X
              </p>
              <p className="font-heading font-bold text-text-low text-[16px]">
                &
              </p>
              <p>·</p>
            </div>

            <div className="flex flex-col items-center gap-1.75">
              <p className="font-subheading font-bold text-text-low text-[16px]">
                J
              </p>
              <p className="font-heading font-bold text-text-low text-[16px]">
                12
              </p>
              <p>·</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-1.75">
              <p className="font-subheading font-bold text-text-low text-[16px]">
                V
              </p>
              <p className="bg-accent1 h-5.5 w-8.25 rounded-lg font-heading font-bold text-text-high text-[16px] flex items-center justify-center">
                13
              </p>
              <p>·</p>
            </div>

            <div className="flex flex-col items-center gap-1.75">
              <p className="font-subheading font-bold text-text-low text-[16px]">
                S
              </p>
              <p className="font-heading font-bold text-text-low text-[16px]">
                14
              </p>
              <p>·</p>
            </div>

            <div className="flex flex-col items-center gap-1.75">
              <p className="font-subheading font-bold text-text-low text-[16px]">
                D
              </p>
              <p className="font-heading font-bold text-text-low text-[16px]">
                15
              </p>
              <p>·</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;